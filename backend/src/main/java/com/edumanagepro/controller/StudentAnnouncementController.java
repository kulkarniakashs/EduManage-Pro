package com.edumanagepro.controller;

import com.edumanagepro.dto.response.StudentAnnouncementResponse;
import com.edumanagepro.security.UserPrincipal;
import com.edumanagepro.service.AnnouncementService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/student/announcements")
public class StudentAnnouncementController {

    private final AnnouncementService announcementService;

    @GetMapping
    public List<StudentAnnouncementResponse> list(@AuthenticationPrincipal UserPrincipal me) {
        return announcementService.listForStudent(me.getId());
    }
}