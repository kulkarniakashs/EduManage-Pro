package com.edumanagepro.service;

import com.edumanagepro.dto.request.*;
import com.edumanagepro.dto.response.ConfirmUploadResponse;
import com.edumanagepro.dto.response.ContentItemResponse;
import com.edumanagepro.dto.response.InitContentUploadResponse;
import com.edumanagepro.dto.response.ModuleResponse;
import com.edumanagepro.entity.*;
import com.edumanagepro.entity.Module;
import com.edumanagepro.entity.enums.ContentType;
import com.edumanagepro.repository.ContentItemRepository;
import com.edumanagepro.repository.ModuleRepository;
import com.edumanagepro.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TeacherContentService {

    private final SubjectRepository subjectRepository;
    private final ModuleRepository moduleRepository;
    private final ContentItemRepository contentItemRepository;
    private final R2ContentStorageService r2;

    // keep your createModule returning ModuleResponse if you want (unchanged)
    public ModuleResponse createModule(UUID teacherId, UUID subjectId, CreateModuleRequest req) {

        Subject subject = subjectRepository.findById(subjectId).orElseThrow();

        if (!subject.getTeacher().getId().equals(teacherId)) {
            throw new RuntimeException("Not allowed");
        }

        Module m = new Module();
        m.setSubject(subject);
        m.setTitle(req.getTitle());
        m.setDescription(req.getDescription());

        Module saved = moduleRepository.save(m);

        return new ModuleResponse(saved.getId(), saved.getTitle(), saved.getDescription(), saved.getCreatedAt());
    }

    @Transactional
    public InitContentUploadResponse initUpload(UUID teacherId, UUID moduleId, InitContentUploadRequest req) {
        Module module = moduleRepository.findById(moduleId).orElseThrow();
        Subject subject = module.getSubject();

        if (!subject.getTeacher().getId().equals(teacherId)) throw new RuntimeException("Not allowed");
        if (req.getType() == null) throw new RuntimeException("type is required");
        if (req.getType() != ContentType.VIDEO && req.getType() != ContentType.PDF)
            throw new RuntimeException("Only VIDEO or PDF allowed");
        if (req.getContentType() == null || req.getContentType().isBlank())
            throw new RuntimeException("contentType is required");

        // 1) create item UPLOADING
        ContentItem ci = new ContentItem();
        ci.setModule(module);
        ci.setTitle(req.getTitle());
        ci.setDescription(req.getDescription());
        ci.setType(req.getType());
        ci.setPublished(req.isPublished());
        ci.setProtectedContent(req.isProtectedContent());
        ci.setUploadStatus(false);

        ContentItem created = contentItemRepository.save(ci);

        // 2) generate objectKey (needs ID)
        String ext = guessExt(req.getContentType(), req.getType());
        String objectKey = "content/" + subject.getId() + "/" + moduleId + "/" + created.getId() + ext;

        created.setObjectKey(objectKey);
        created = contentItemRepository.save(created);

        // 3) presign PUT
        var presigned = r2.presignPut(objectKey, req.getContentType());

        return new InitContentUploadResponse(
                toDto(created),
                presigned.url(),
                presigned.expiresInMinutes()
        );
    }

    @Transactional
    public ConfirmUploadResponse confirmUpload(UUID teacherId, UUID contentItemId) {
        ContentItem ci = contentItemRepository.findById(contentItemId).orElseThrow();
        Subject subject = ci.getModule().getSubject();

        if (!subject.getTeacher().getId().equals(teacherId)) throw new RuntimeException("Not allowed");
        if (ci.getObjectKey() == null || ci.getObjectKey().isBlank()) throw new RuntimeException("objectKey missing");

        ci.setUploadStatus(true);
        ContentItem saved = contentItemRepository.save(ci);

        return new ConfirmUploadResponse(toDto(saved));
    }

    private ContentItemResponse toDto(ContentItem c) {
        return new ContentItemResponse(
                c.getId(),
                c.getModule().getId(),
                c.getTitle(),
                c.getDescription(),
                c.getType(),
                c.getObjectKey(),
                c.getUploadStatus(),
                c.isPublished(),
                c.isProtectedContent()
        );
    }

    private String guessExt(String contentType, ContentType type) {
        if ("application/pdf".equalsIgnoreCase(contentType)) return ".pdf";
        if (contentType.toLowerCase().contains("mp4")) return ".mp4";
        return type == ContentType.PDF ? ".pdf" : ".bin";
    }
}