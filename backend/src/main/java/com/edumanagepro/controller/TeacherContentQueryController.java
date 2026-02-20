package com.edumanagepro.controller;

import com.edumanagepro.dto.response.ContentItemResponse;
import com.edumanagepro.dto.response.ModuleResponse;
import com.edumanagepro.dto.response.TeacherSubjectResponse;
import com.edumanagepro.repository.SubjectRepository;
import com.edumanagepro.security.UserPrincipal;
import com.edumanagepro.service.TeacherContentQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/teacher")
public class TeacherContentQueryController {

    private final SubjectRepository subjectRepository;
    private final TeacherContentQueryService teacherContentQueryService;


    @GetMapping("/me/subjects")
    public List<TeacherSubjectResponse> mySubjects(@AuthenticationPrincipal UserPrincipal me) {
        return teacherContentQueryService.mySubjects(me.getId());
    }

    // GET /teacher/subjects/{subjectId}/modules
    @GetMapping("/subjects/{subjectId}/modules")
    public List<ModuleResponse> listModules(
            @AuthenticationPrincipal UserPrincipal me,
            @PathVariable UUID subjectId
    ) {
        return teacherContentQueryService.listModules(me.getId(), subjectId);
    }

    // GET /teacher/modules/{moduleId}/content-items
    @GetMapping("/modules/{moduleId}/content-items")
    public List<ContentItemResponse> listContentItems(
            @AuthenticationPrincipal UserPrincipal me,
            @PathVariable UUID moduleId
    ) {
        return teacherContentQueryService.listContentItems(me.getId(), moduleId);
    }
}