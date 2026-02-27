package com.edumanagepro.controller;


import com.edumanagepro.dto.request.CreateModuleRequest;
import com.edumanagepro.dto.request.InitContentUploadRequest;
import com.edumanagepro.dto.response.ConfirmUploadResponse;
import com.edumanagepro.dto.response.InitContentUploadResponse;
import com.edumanagepro.dto.response.ModuleResponse;
import com.edumanagepro.dto.response.DeleteModuleResponse;
import com.edumanagepro.dto.response.DeleteContentItemResponse;
import com.edumanagepro.security.UserPrincipal;
import com.edumanagepro.service.TeacherContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/teacher")
public class TeacherContentController {

    private final TeacherContentService teacherContentService;

    @PostMapping("/subjects/{subjectId}/modules")
    public ModuleResponse createModule(
            @AuthenticationPrincipal UserPrincipal me,
            @PathVariable UUID subjectId,
            @RequestBody CreateModuleRequest req
    ) {
        return teacherContentService.createModule(me.getId(), subjectId, req);
    }

    @PostMapping("/modules/{moduleId}/content-items/init-upload")
    public InitContentUploadResponse initUpload(
            @AuthenticationPrincipal UserPrincipal me,
            @PathVariable UUID moduleId,
            @RequestBody InitContentUploadRequest req
    ) {
        return teacherContentService.initUpload(me.getId(), moduleId, req);
    }

    @PutMapping("/content-items/{contentItemId}/confirm-upload")
    public ConfirmUploadResponse confirmUpload(
            @AuthenticationPrincipal UserPrincipal me,
            @PathVariable UUID contentItemId
    ) {
        return teacherContentService.confirmUpload(me.getId(), contentItemId);
    }

    //DELETE
    //Delete content item
    @DeleteMapping("/content-items/{contentItemId}")
    public DeleteContentItemResponse deleteContentItem(
            @AuthenticationPrincipal UserPrincipal me,
            @PathVariable UUID contentItemId
    ) {
        return teacherContentService.deleteContentItem(me.getId(), contentItemId);
    }

    //delete module (optionally delete all content)
    @DeleteMapping("/modules/{moduleId}")
    public DeleteModuleResponse deleteModule(
            @AuthenticationPrincipal UserPrincipal me,
            @PathVariable UUID moduleId,
            @RequestParam(defaultValue = "false") boolean deleteAllContent
    ) {
        return teacherContentService.deleteModule(me.getId(), moduleId, deleteAllContent);
    }
}