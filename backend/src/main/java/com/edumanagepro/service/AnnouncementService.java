package com.edumanagepro.service;

import com.edumanagepro.dto.response.StudentAnnouncementResponse;
import com.edumanagepro.entity.Enrollment;
import com.edumanagepro.entity.enums.EnrollmentStatus;
import com.edumanagepro.repository.AnnouncementRepository;
import com.edumanagepro.repository.EnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AnnouncementService {

    private final EnrollmentRepository enrollmentRepository;
    private final AnnouncementRepository announcementRepository;

    public List<StudentAnnouncementResponse> listForStudent(UUID studentId) {
        Enrollment e = enrollmentRepository
                .findFirstByStudentIdAndStatusOrderByCreatedAtDesc(studentId, EnrollmentStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("Active enrollment not found"));

        var list = announcementRepository.findVisibleForClass(
                e.getAcademicYear().getId(),
                e.getClassRoom().getId(),
                Instant.now()
        );

        return list.stream().map(a -> StudentAnnouncementResponse.builder()
                .id(a.getId())
                .title(a.getTitle())
                .message(a.getMessage())
                .publishAt(a.getPublishAt())
                .expiresAt(a.getExpiresAt())
                .createdByAdminId(a.getCreatedByAdmin().getId())
                .createdByAdminName(a.getCreatedByAdmin().getFullName()) // adjust if your User has fullName/username
                .createdAt(a.getCreatedAt())
                .AdminPhotoUrl(a.getCreatedByAdmin().getProfilePhotoKey())
                .build()
        ).toList();
    }
}