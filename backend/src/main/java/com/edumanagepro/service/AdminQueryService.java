package com.edumanagepro.service;

import com.edumanagepro.dto.response.*;
import com.edumanagepro.entity.*;
import com.edumanagepro.entity.enums.UserRole;
import com.edumanagepro.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminQueryService {

    private final AcademicYearRepository academicYearRepo;
    private final ClassRoomRepository classRoomRepo;
    private final SubjectRepository subjectRepo;
    private final UserRepository userRepo;
    private final FeeStructureRepository feeRepo;

    public List<AdminAcademicYearResponse> listAcademicYears() {
        return academicYearRepo.findAllByOrderByCreatedAtDesc()
                .stream().map(ay -> AdminAcademicYearResponse.builder()
                        .id(ay.getId())
                        .name(ay.getName())
                        .active(ay.isActive())
                        .build()
                ).toList();
    }

    public AdminAcademicYearResponse latestAcademicYear() {
        AcademicYear ay = academicYearRepo.findFirstByOrderByCreatedAtDesc();
        return AdminAcademicYearResponse.builder()
                .id(ay.getId())
                .name(ay.getName())
                .active(ay.isActive())
                .build();
    }

    public List<AdminClassRoomResponse> listClassRooms(UUID academicYearId) {

        return classRoomRepo.findByAcademicYearIdOrderByNameAsc(academicYearId)
                .stream().map(c -> AdminClassRoomResponse.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .build()
                ).toList();
    }

    public List<AdminSubjectWithTeacherResponse> listSubjectsWithTeacher(UUID academicYearId, UUID classRoomId) {
        return subjectRepo.findByClassRoomIdOrderByNameAsc(classRoomId)
                .stream().map(s -> AdminSubjectWithTeacherResponse.builder()
                        .subjectId(s.getId())
                        .subjectName(s.getName())
                        .description(s.getDescription())
                        .thumbnailUrl(s.getThumbnailUrl())
                        .teacherId(s.getTeacher() != null ? s.getTeacher().getId() : null)
                        .teacherName(s.getTeacher() != null ? s.getTeacher().getFullName() : null)
                        .teacherProfilePhotoKey(s.getTeacher() != null ? s.getTeacher().getProfilePhotoKey() : null)
                        .build()
                ).toList();
    }

    public List<AdminTeacherOptionResponse> listTeachers() {
        return userRepo.findByRoleOrderByFullNameAsc(UserRole.TEACHER)
                .stream().map(t -> AdminTeacherOptionResponse.builder()
                        .id(t.getId())
                        .name(t.getFullName())
                        .email(t.getEmail())
                        .profilePhotoKey(t.getProfilePhotoKey())
                        .build()
                ).toList();
    }

    public AdminFeeStructureResponse getFeeStructure(UUID academicYearId, UUID classRoomId) {
        FeeStructure fs = feeRepo.findByAcademicYearIdAndClassRoomIdAndIsActiveTrue(academicYearId, classRoomId)
                .orElse(null);

        if (fs == null) {
            return AdminFeeStructureResponse.builder()
                    .id(null)
                    .academicYearId(academicYearId)
                    .classRoomId(classRoomId)
                    .amount(null)
                    .currency("INR")
                    .active(false)
                    .build();
        }

        return AdminFeeStructureResponse.builder()
                .id(fs.getId())
                .academicYearId(academicYearId)
                .classRoomId(classRoomId)
                .amount(fs.getAmount())
                .currency(fs.getCurrency())
                .active(fs.isActive())
                .build();
    }
}