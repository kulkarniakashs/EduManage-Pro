package com.edumanagepro.service;

import com.edumanagepro.dto.request.*;
import com.edumanagepro.dto.response.*;
import com.edumanagepro.entity.User;
import com.edumanagepro.repository.UserRepository;
import com.edumanagepro.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final R2PublicStorageService publicStorage;

    @Value("${app.r2.public.base-url}")
    private String publicBaseUrl;

    public PresignUploadResponse presignProfilePhoto(UserPrincipal me, String contentType) {
        if (!isAllowedImageContentType(contentType)) {
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

    @Transactional
    public MeResponse confirmProfilePhoto(UserPrincipal me, ConfirmObjectKeyRequest req) {
        String key = req.getObjectKey();
        if (key == null || !key.startsWith("profile-photos/" + me.getId() + "/")) {
            throw new RuntimeException("Invalid objectKey");
        }

        User u = userRepository.findById(me.getId()).orElseThrow();
        u.setProfilePhotoKey(key);

        return new MeResponse(u.getId(), u.getFullName(), u.getRole(), u.getProfilePhotoKey());
    }

    public String myProfilePhotoUrl(UserPrincipal me) {
        User u = userRepository.findById(me.getId()).orElseThrow();
        if (u.getProfilePhotoKey() == null) return "";
        return joinUrl(publicBaseUrl, u.getProfilePhotoKey());
    }

    @Transactional
    public MeResponse updateProfile(UserPrincipal me, UpdateProfileRequest req) {
        User u = userRepository.findById(me.getId()).orElseThrow();

        if (req.getFullName() != null && !req.getFullName().isBlank()) {
            u.setFullName(req.getFullName().trim());
        }

        return new MeResponse(u.getId(), u.getFullName(), u.getRole(), u.getProfilePhotoKey());
    }

    @Transactional
    public void changePassword(UserPrincipal me, ChangePasswordRequest req) {
        if (req.getNewPassword() == null || req.getNewPassword().length() < 8) {
            throw new RuntimeException("New password must be at least 8 characters");
        }

        User u = userRepository.findById(me.getId()).orElseThrow();

        if (!passwordEncoder.matches(req.getOldPassword(), u.getPasswordHash())) {
            throw new RuntimeException("Old password incorrect");
        }

        u.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
    }

    private boolean isAllowedImageContentType(String ct) {
        return "image/jpeg".equals(ct) || "image/png".equals(ct) || "image/webp".equals(ct);
    }

    private String joinUrl(String base, String key) {
        if (base == null || base.isBlank()) throw new RuntimeException("Public base url not configured");
        return base.endsWith("/") ? base + key : base + "/" + key;
    }
}
