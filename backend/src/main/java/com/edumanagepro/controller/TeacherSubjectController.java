package com.edumanagepro.controller;

import com.edumanagepro.dto.request.ConfirmObjectKeyRequest;
import com.edumanagepro.dto.response.PresignUploadResponse;
import com.edumanagepro.entity.Subject;
import com.edumanagepro.repository.SubjectRepository;
import com.edumanagepro.service.R2PublicStorageService;
import com.edumanagepro.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/teacher")
public class TeacherSubjectController {

    private final SubjectRepository subjectRepository;
    private final R2PublicStorageService publicStorage;

    @PostMapping("/subjects/{subjectId}/thumbnail/presign")
    public PresignUploadResponse presignThumbnail(
            @AuthenticationPrincipal UserPrincipal me,
            @PathVariable UUID subjectId,
            @RequestParam String contentType
    ) {
        Subject s = subjectRepository.findById(subjectId).orElseThrow();

        if (!s.getTeacher().getId().equals(me.getId())) throw new RuntimeException("Not allowed");

        if (!contentType.equals("image/jpeg") &&
                !contentType.equals("image/png") &&
                !contentType.equals("image/webp")) {
            throw new RuntimeException("Only jpeg/png/webp allowed");
        }

        var p = publicStorage.presignGenericPut("subject-thumbnails/" + subjectId, contentType);

        return new PresignUploadResponse(p.objectKey(), p.uploadUrl(), contentType, p.expiresMinutes());
    }

    @PutMapping("/subjects/{subjectId}/thumbnail")
    public void confirmThumbnail(
            @AuthenticationPrincipal UserPrincipal me,
            @PathVariable UUID subjectId,
            @RequestBody ConfirmObjectKeyRequest req
    ) {
        Subject s = subjectRepository.findById(subjectId).orElseThrow();

        if (!s.getTeacher().getId().equals(me.getId())) throw new RuntimeException("Not allowed");

        if (req.getObjectKey() == null ||
                !req.getObjectKey().startsWith("subject-thumbnails/" + subjectId + "/")) {
            throw new RuntimeException("Invalid objectKey");
        }

        s.setThumbnailUrl(req.getObjectKey());
        subjectRepository.save(s);
    }
}
