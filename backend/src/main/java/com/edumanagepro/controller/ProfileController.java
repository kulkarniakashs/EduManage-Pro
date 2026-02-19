package com.edumanagepro.controller;

import com.edumanagepro.dto.request.*;
import com.edumanagepro.dto.response.*;
import com.edumanagepro.entity.User;
import com.edumanagepro.repository.UserRepository;
import com.edumanagepro.service.R2PublicStorageService;
import com.edumanagepro.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ProfileController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final R2PublicStorageService publicStorage;

    @Value("${app.r2.public.base-url}")
    private String publicBaseUrl;

    // ✅ 1) Presign upload URL for profile photo (public bucket)
    @PostMapping("/me/profile-photo/presign")
    public PresignUploadResponse presignProfilePhoto(
            @AuthenticationPrincipal UserPrincipal me,
            @RequestParam String contentType
    ) {
        if (!contentType.equals("image/jpeg") &&
                !contentType.equals("image/png") &&
                !contentType.equals("image/webp")) {
            throw new RuntimeException("Only jpeg/png/webp allowed");
        }

        var p = publicStorage.presignProfilePhotoPut(me.getId(), contentType);

        return new PresignUploadResponse(
                p.objectKey(),
                p.uploadUrl(),
                contentType,
                p.expiresMinutes()
        );
    }

    // ✅ 2) Confirm upload: save objectKey in DB
    @PutMapping("/me/profile-photo")
    public MeResponse confirmProfilePhoto(
            @AuthenticationPrincipal UserPrincipal me,
            @RequestBody ConfirmProfilePhotoRequest req
    ) {
        if (req.getObjectKey() == null ||
                !req.getObjectKey().startsWith("profile-photos/" + me.getId() + "/")) {
            throw new RuntimeException("Invalid objectKey");
        }

        User u = userRepository.findById(me.getId()).orElseThrow();
        u.setProfilePhotoKey(req.getObjectKey());
        userRepository.save(u);

        return new MeResponse(u.getId(), u.getFullName(), u.getRole(), u.getProfilePhotoKey());
    }

    // ✅ 3) Secure file access for profile photo
    // Since bucket is public, security is mainly for hiding link. Return the URL only to logged-in user.
    // Frontend builds URL too, but this is a "secure endpoint" if you want.
    @GetMapping("/me/profile-photo/url")
    public ResponseEntity<Map<String, String>> myProfilePhotoUrl(@AuthenticationPrincipal UserPrincipal me) {
        User u = userRepository.findById(me.getId()).orElseThrow();
        if (u.getProfilePhotoKey() == null) {
            return ResponseEntity.ok()
                    .cacheControl(CacheControl.noStore())
                    .body(Map.of("url", ""));
        }
        String url = publicBaseUrl.endsWith("/")
                ? publicBaseUrl + u.getProfilePhotoKey()
                : publicBaseUrl + "/" + u.getProfilePhotoKey();

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(Map.of("url", url));
    }

    // ✅ 4) Update profile (name only)
    @PutMapping("/me")
    public MeResponse updateProfile(
            @AuthenticationPrincipal UserPrincipal me,
            @RequestBody UpdateProfileRequest req
    ) {
        User u = userRepository.findById(me.getId()).orElseThrow();

        if (req.getFullName() != null && !req.getFullName().isBlank()) {
            u.setFullName(req.getFullName().trim());
        }

        userRepository.save(u);
        return new MeResponse(u.getId(), u.getFullName(), u.getRole(), u.getProfilePhotoKey());
    }

    // ✅ 5) Change password
    @PutMapping("/me/password")
    public void changePassword(
            @AuthenticationPrincipal UserPrincipal me,
            @RequestBody ChangePasswordRequest req
    ) {
        if (req.getNewPassword() == null || req.getNewPassword().length() < 8) {
            throw new RuntimeException("New password must be at least 8 characters");
        }

        User u = userRepository.findById(me.getId()).orElseThrow();

        if (!passwordEncoder.matches(req.getOldPassword(), u.getPasswordHash())) {
            throw new RuntimeException("Old password incorrect");
        }

        u.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(u);
    }
}
