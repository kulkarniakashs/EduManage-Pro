package com.edumanagepro.security;

import com.edumanagepro.entity.*;
import com.edumanagepro.entity.enums.*;
import com.edumanagepro.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

import static org.springframework.http.HttpStatus.FORBIDDEN;

@Component
@RequiredArgsConstructor
public class AccessValidator {

    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final ContentItemRepository contentItemRepository;

    // ==============================
    // Validate using subjectId
    // ==============================
    public void validateStudentContentAccess(UUID studentId, UUID subjectId) {

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(FORBIDDEN, "Invalid user"));

        if (student.getRole() != UserRole.STUDENT) {
            throw new ResponseStatusException(FORBIDDEN, "Only students allowed");
        }

        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResponseStatusException(FORBIDDEN, "Subject not found"));

        AcademicYear year = subject.getClassRoom().getAcademicYear();
        ClassRoom classRoom = subject.getClassRoom();

        Enrollment enrollment = enrollmentRepository
                .findByStudentIdAndAcademicYearId(studentId, year.getId())
                .orElseThrow(() -> new ResponseStatusException(FORBIDDEN, "Not enrolled"));

        if (enrollment.getStatus() != EnrollmentStatus.ACTIVE) {
            throw new ResponseStatusException(FORBIDDEN, "Enrollment inactive");
        }

        if (!enrollment.getClassRoom().getId().equals(classRoom.getId())) {
            throw new ResponseStatusException(FORBIDDEN, "Wrong class");
        }

        if (!Boolean.TRUE.equals(enrollment.getFeeCleared())) {
            throw new ResponseStatusException(FORBIDDEN, "Fee not paid");
        }
    }

    // ==============================
    // Validate using contentItemId
    // ==============================
    public void validateStudentContentAccessByContentId(UUID studentId, UUID contentItemId) {

        ContentItem content = contentItemRepository.findById(contentItemId)
                .orElseThrow(() -> new ResponseStatusException(FORBIDDEN, "Content not found"));

        UUID subjectId = content.getModule().getSubject().getId();

        validateStudentContentAccess(studentId, subjectId);
    }
}
