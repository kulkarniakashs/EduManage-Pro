package com.edumanagepro.controller;

import com.edumanagepro.dto.response.ContentItemResponse;
import com.edumanagepro.dto.response.ModuleResponse;
import com.edumanagepro.dto.response.StudentMyClassResponse;
import com.edumanagepro.security.UserPrincipal;
import com.edumanagepro.service.StudentContentQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/student")
public class StudentContentQueryController {

    private final StudentContentQueryService studentContentQueryService;


    @GetMapping("/me/class")
    public StudentMyClassResponse myClass(@AuthenticationPrincipal UserPrincipal me) {
        return studentContentQueryService.getMyClassAndSubjects(me.getId());
    }

    // GET /student/subjects/{subjectId}/modules
    @GetMapping("/subjects/{subjectId}/modules")
    public List<ModuleResponse> listModules(
            @AuthenticationPrincipal UserPrincipal me,
            @PathVariable UUID subjectId
    ) {
        return studentContentQueryService.listModules(me.getId(), subjectId);
    }

    // GET /student/subjects/{subjectId}/modules/{moduleId}/content-list
    @GetMapping("/subjects/{subjectId}/modules/{moduleId}/content-list")
    public List<ContentItemResponse> listContent(
            @AuthenticationPrincipal UserPrincipal me,
            @PathVariable UUID subjectId,
            @PathVariable UUID moduleId
    ) {
        return studentContentQueryService.listPublishedContent(me.getId(), subjectId, moduleId);
    }
}