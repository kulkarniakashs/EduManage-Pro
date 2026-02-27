package com.edumanagepro.service;

import com.edumanagepro.dto.request.*;
import com.edumanagepro.dto.response.ConfirmUploadResponse;
import com.edumanagepro.dto.response.ContentItemResponse;
import com.edumanagepro.dto.response.InitContentUploadResponse;
import com.edumanagepro.dto.response.ModuleResponse;
import com.edumanagepro.dto.response.DeleteContentItemResponse;
import com.edumanagepro.dto.response.DeleteModuleResponse;
import com.edumanagepro.entity.*;
import com.edumanagepro.entity.Module;
import com.edumanagepro.entity.enums.ContentType;
import com.edumanagepro.repository.ContentItemRepository;
import com.edumanagepro.repository.ModuleRepository;
import com.edumanagepro.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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
        if(req.getType() == ContentType.VIDEO){
            ci.setDurationSeconds(req.getDuration());
        } else {
            ci.setDurationSeconds(null);
        }
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

    //Delete content
    @Transactional
    public DeleteContentItemResponse deleteContentItem(UUID teacherId, UUID contentItemId) {
        ContentItem it = contentItemRepository.findById(contentItemId).orElseThrow();

        // ✅ teacher must own subject
        UUID ownerId = it.getModule().getSubject().getTeacher().getId();
        if (!ownerId.equals(teacherId)) throw new RuntimeException("Not allowed");

        boolean deletedObj = false;

        // delete R2 object if VIDEO/PDF
        if ((it.getType() == ContentType.VIDEO || it.getType() == ContentType.PDF)
                && it.getObjectKey() != null && !it.getObjectKey().isBlank()) {
            r2.deleteObjectIfPresent(it.getObjectKey());
            deletedObj = true;
        }

        contentItemRepository.delete(it);

        return new DeleteContentItemResponse(true, deletedObj);
    }

    @Transactional
    public DeleteModuleResponse deleteModule(UUID teacherId, UUID moduleId, boolean deleteAllContent) {
        Module m = moduleRepository.findById(moduleId).orElseThrow();

        // ✅ teacher must own subject
        UUID ownerId = m.getSubject().getTeacher().getId();
        if (!ownerId.equals(teacherId)) throw new RuntimeException("Not allowed");

        long count = contentItemRepository.countByModuleId(moduleId);
        if (count > 0 && !deleteAllContent) {
            throw new RuntimeException("Module has content items. Pass deleteAllContent=true to delete everything.");
        }

        int deletedContent = 0;
        int deletedObjects = 0;

        if (count > 0) {
            List<ContentItem> items = contentItemRepository.findByModuleId(moduleId);

            // delete R2 objects first
            for (ContentItem it : items) {
                if ((it.getType() == ContentType.VIDEO || it.getType() == ContentType.PDF)) {
                    if (it.getObjectKey() != null && !it.getObjectKey().isBlank()) {
                        r2.deleteObjectIfPresent(it.getObjectKey());
                        deletedObjects++;
                    }
                }
            }

            contentItemRepository.deleteAll(items);
            deletedContent = items.size();
        }

        moduleRepository.delete(m);

        return new DeleteModuleResponse(true, deletedContent, deletedObjects);
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