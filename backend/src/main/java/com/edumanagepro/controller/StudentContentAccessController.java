package com.edumanagepro.controller;

import com.edumanagepro.dto.response.ContentAccessUrlResponse;
import com.edumanagepro.security.UserPrincipal;
import com.edumanagepro.service.StudentContentAccessService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/student")
public class StudentContentAccessController {

    private final StudentContentAccessService studentContentAccessService;

    @GetMapping("/content-items/{contentItemId}/access-url")
    public ContentAccessUrlResponse accessUrl(
            @AuthenticationPrincipal UserPrincipal me,
            @PathVariable UUID contentItemId
    ) {
        return studentContentAccessService.getAccessUrl(me.getId(), contentItemId);
    }
}