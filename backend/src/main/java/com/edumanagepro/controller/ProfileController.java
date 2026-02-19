package com.edumanagepro.controller;

import com.edumanagepro.dto.request.*;
import com.edumanagepro.dto.response.*;
import com.edumanagepro.security.UserPrincipal;
import com.edumanagepro.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @PostMapping("/me/profile-photo/presign")
    public PresignUploadResponse presignProfilePhoto(
            @AuthenticationPrincipal UserPrincipal me,
            @RequestParam String contentType
    ) {
        return profileService.presignProfilePhoto(me, contentType);
    }

    @PutMapping("/me/profile-photo")
    public MeResponse confirmProfilePhoto(
            @AuthenticationPrincipal UserPrincipal me,
            @RequestBody ConfirmObjectKeyRequest req
    ) {
        return profileService.confirmProfilePhoto(me, req);
    }

    @GetMapping("/me/profile-photo/url")
    public ResponseEntity<Map<String, String>> myProfilePhotoUrl(
            @AuthenticationPrincipal UserPrincipal me
    ) {
        String url = profileService.myProfilePhotoUrl(me);

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(Map.of("url", url));
    }

    @PutMapping("/me")
    public MeResponse updateProfile(
            @AuthenticationPrincipal UserPrincipal me,
            @RequestBody UpdateProfileRequest req
    ) {
        return profileService.updateProfile(me, req);
    }

    @PutMapping("/me/password")
    public void changePassword(
            @AuthenticationPrincipal UserPrincipal me,
            @RequestBody ChangePasswordRequest req
    ) {
        profileService.changePassword(me, req);
    }
}
