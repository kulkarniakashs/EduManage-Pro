package com.edumanagepro.service;

import com.edumanagepro.dto.response.ContentAccessUrlResponse;
import com.edumanagepro.dto.response.ContentItemResponse;
import com.edumanagepro.dto.response.ModuleResponse;
import com.edumanagepro.dto.response.TeacherSubjectResponse;
import com.edumanagepro.entity.ContentItem;
import com.edumanagepro.entity.Module;
import com.edumanagepro.entity.Subject;
import com.edumanagepro.exceptions.BadRequestException;
import com.edumanagepro.repository.ContentItemRepository;
import com.edumanagepro.repository.ModuleRepository;
import com.edumanagepro.repository.SubjectRepository;
import com.edumanagepro.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TeacherContentQueryService {

    private final SubjectRepository subjectRepository;
    private final ModuleRepository moduleRepository;
    private final ContentItemRepository contentItemRepository;
    private final R2ContentStorageService r2;

    public List<TeacherSubjectResponse> mySubjects(UUID teacherId) {
        List<Subject> subjects = subjectRepository.findByTeacherIdAndIsActiveTrue(teacherId);

        return subjects.stream().map(TeacherSubjectResponse::toTeacherSubjectResponse).toList();
    }

    public List<ModuleResponse> listModules(UUID teacherId, UUID subjectId) {
        Subject subject = subjectRepository.findById(subjectId).orElseThrow();

        if (!subject.getTeacher().getId().equals(teacherId)) {
            throw new RuntimeException("Not allowed");
        }

        return moduleRepository.findBySubjectId(subjectId)
                .stream()
                .map(this::toModuleDto)
                .toList();
    }

    public List<ContentItemResponse> listContentItems(UUID teacherId, UUID moduleId) {
        Module module = moduleRepository.findById(moduleId).orElseThrow();

        if (!module.getSubject().getTeacher().getId().equals(teacherId)) {
            throw new RuntimeException("Not allowed");
        }

        return contentItemRepository.findByModuleId(moduleId)
                .stream()
                .map(this::toContentDto)
                .toList();
    }

    public ContentAccessUrlResponse contentAccessUrl(UserPrincipal user, UUID contentId){
        ContentItem contentItem = contentItemRepository.findById(contentId).orElseThrow(()-> new RuntimeException("Content Item doesn't Exist"));
//        if(contentItem.getModule().getSubject().getTeacher().getId().equals(user.getId())){
//            throw new BadRequestException("You are not teacher of this subject");
//        }
        if(!contentItem.getModule().getSubject().getTeacher().getId().equals(user.getId())){
            throw new BadRequestException("You are not teacher of this subject");
        }
        var p = r2.presignGet(contentItem.getObjectKey());
        return new ContentAccessUrlResponse(ContentItemResponse.toContentItemResponse(contentItem), p.url(), p.expiresInMinutes());
    }

    private ModuleResponse toModuleDto(Module m) {
        return new ModuleResponse(m.getId(), m.getTitle(), m.getDescription(),m.getCreatedAt());
    }

    private ContentItemResponse toContentDto(ContentItem c) {
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
}