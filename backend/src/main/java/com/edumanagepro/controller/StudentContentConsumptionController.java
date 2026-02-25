package com.edumanagepro.controller;

import com.edumanagepro.dto.request.VideoProgressRequest;
import com.edumanagepro.dto.response.StudentContentConsumptionDto;
import com.edumanagepro.security.UserPrincipal;
import com.edumanagepro.service.StudentContentConsumptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/student/content")
public class StudentContentConsumptionController {

    private final StudentContentConsumptionService service;

    @PostMapping("/{contentId}/visited")
    public StudentContentConsumptionDto visited(
            @AuthenticationPrincipal UserPrincipal me,
            @PathVariable UUID contentId
    ) {
        return service.markVisited(me, contentId);
    }

    @PostMapping("/{contentId}/video-progress")
    public StudentContentConsumptionDto videoProgress(
            @AuthenticationPrincipal UserPrincipal me,
            @PathVariable UUID contentId,
            @RequestBody VideoProgressRequest req
    ) {
        return service.updateVideoProgress(me, contentId, req);
    }
}