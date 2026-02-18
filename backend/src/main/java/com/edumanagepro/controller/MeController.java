package com.edumanagepro.controller;

import com.edumanagepro.dto.response.MeResponse;
import com.edumanagepro.security.UserPrincipal;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
public class MeController {

    @GetMapping("/me")
    public MeResponse me(@AuthenticationPrincipal UserPrincipal user) {
        return new MeResponse(user.getId(), user.getFullName(), user.getRole(), user.getProfilePhotoKey());
    }
}
