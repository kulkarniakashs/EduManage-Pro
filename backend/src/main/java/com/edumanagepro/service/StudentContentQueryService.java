package com.edumanagepro.service;

import com.edumanagepro.dto.response.*;
import com.edumanagepro.entity.*;
import com.edumanagepro.entity.Module;
import com.edumanagepro.entity.enums.EnrollmentStatus;
import com.edumanagepro.repository.*;
import com.edumanagepro.security.AccessValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentContentQueryService {

    private final AccessValidator accessValidator;
    private final ModuleRepository moduleRepository;
    private final ContentItemRepository contentItemRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final SubjectRepository subjectRepository;
    private final ContentConsumptionRepository contentConsumptionRepository;

    public StudentMyClassResponse getMyClassAndSubjects(UUID studentId) {

        Enrollment enr = enrollmentRepository
                .findTopByStudentIdAndStatusOrderByEnrolledAtDesc(studentId, EnrollmentStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("No active enrollment"));

        List<Subject> subjects = subjectRepository.findByClassRoomIdAndIsActiveTrue(enr.getClassRoom().getId());

        List<SubjectResponse> dto = subjects.stream()
                .map(SubjectResponse::toSubjectResponse)
                .toList();

        return new StudentMyClassResponse(
                enr.getAcademicYear().getId(),
                enr.getAcademicYear().getName(),
                enr.getClassRoom().getId(),
                enr.getClassRoom().getName(),
                enr.getFeeCleared(),
                dto
        );
    }

    public List<ModuleResponse> listModules(UUID studentId, UUID subjectId) {
        accessValidator.validateStudentContentAccess(studentId, subjectId);

        return moduleRepository.findBySubjectId(subjectId)
                .stream()
                .map((ModuleResponse::toModuleResponse))
                .toList();
    }

    public SubjectDetailsWithModulesResponse subjectDetails(UUID studentId, UUID subjectId){
        accessValidator.validateStudentContentAccess(studentId, subjectId);
        com.edumanagepro.entity.Subject sub = subjectRepository.findById(subjectId).orElseThrow();
        List<ModuleResponse> moduleResponses = moduleRepository.findBySubjectId(subjectId).stream().map(ModuleResponse::toModuleResponse).toList();
        return  new SubjectDetailsWithModulesResponse(sub.getId(),sub.getName(), sub.getDescription(), sub.getThumbnailUrl(), sub.getTeacher().getId(), sub.getTeacher().getFullName(), sub.getTeacher().getProfilePhotoKey(),  moduleResponses);
    }

    public List<ContentItemWithConsumptionResponse> listPublishedContent(UUID studentId, UUID subjectId, UUID moduleId) {
        accessValidator.validateStudentContentAccess(studentId, subjectId);

        // module must belong to subject
        Module module = moduleRepository.findById(moduleId).orElseThrow();
        if (!module.getSubject().getId().equals(subjectId)) {
            throw new RuntimeException("Module does not belong to subject");
        }

        // only published items
//        return contentItemRepository.findByModuleIdAndIsPublishedTrue(moduleId)
//                .stream()
//                .map(contentItem -> {
//                    ContentConsumption cc = contentConsumptionRepository.findByStudentIdAndContentItemId(studentId, contentItem.getId()).orElseThrow(err -> {});
//                    return ContentItemWithConsumptionResponse.toContentItem(contentItem, cc);
//                })
//                .toList();
        var items = contentItemRepository.findByModuleIdAndIsPublishedTrueOrderByCreatedAt(moduleId);

        var itemIds = items.stream()
                .map(ContentItem::getId)
                .toList();

        var consumptions = contentConsumptionRepository.findByStudentIdAndContentItemIdIn(studentId, itemIds);

        var ccMap = consumptions.stream()
                .collect(Collectors.toMap(
                        cc -> cc.getContentItem().getId(),
                        Function.identity()
                ));

        return items.stream()
                .map(ci -> {
                    var cc = ccMap.get(ci.getId()); // can be null if not started
                    return ContentItemWithConsumptionResponse.toContentItem(ci, cc);
                })
                .toList();
    }

}