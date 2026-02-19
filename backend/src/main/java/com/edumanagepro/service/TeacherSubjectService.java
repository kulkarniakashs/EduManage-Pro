package com.edumanagepro.service;

import com.edumanagepro.dto.request.ConfirmObjectKeyRequest;
import com.edumanagepro.dto.response.PresignUploadResponse;
import com.edumanagepro.entity.Subject;
import com.edumanagepro.repository.SubjectRepository;
import com.edumanagepro.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TeacherSubjectService {

    private final SubjectRepository subjectRepository;
    private final R2PublicStorageService publicStorage;

    public PresignUploadResponse presignThumbnail(UserPrincipal me, UUID subjectId, String contentType) {
        Subject s = subjectRepository.findById(subjectId).orElseThrow();

        // teacher can only modify their subject
        if (!s.getTeacher().getId().equals(me.getId())) {
            throw new RuntimeException("Not allowed");
        }

        if (!isAllowedImageContentType(contentType)) {
            throw new RuntimeException("Only jpeg/png/webp allowed");
        }

        // ✅ IMPORTANT: your confirm endpoint expects ".../{subjectId}/..."
        // so presign MUST include subjectId as a folder prefix
        String prefix = "subject-thumbnails/" + subjectId + "/";

        var p = publicStorage.presignGenericPut(prefix, contentType);

        return new PresignUploadResponse(
                p.objectKey(),
                p.uploadUrl(),
                contentType,
                p.expiresMinutes()
        );
    }

    @Transactional
    public void confirmThumbnail(UserPrincipal me, UUID subjectId, ConfirmObjectKeyRequest req) {
        Subject s = subjectRepository.findById(subjectId).orElseThrow();

        if (!s.getTeacher().getId().equals(me.getId())) {
            throw new RuntimeException("Not allowed");
        }

        String key = req.getObjectKey();
        String prefix = "subject-thumbnails/" + subjectId + "/";

        if (key == null || !key.startsWith(prefix)) {
            throw new RuntimeException("Invalid objectKey");
        }

        // better name: thumbnailKey (but keeping your field)
        s.setThumbnailUrl(key);
        // no need subjectRepository.save(s) if JPA + @Transactional
    }

    private boolean isAllowedImageContentType(String ct) {
        return "image/jpeg".equals(ct) || "image/png".equals(ct) || "image/webp".equals(ct);
    }
}
