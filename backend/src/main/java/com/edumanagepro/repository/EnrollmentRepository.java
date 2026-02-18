package com.edumanagepro.repository;

import com.edumanagepro.entity.Enrollment;
import com.edumanagepro.entity.enums.EnrollmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID> {

    Optional<Enrollment> findByStudentIdAndAcademicYearId(UUID studentId, UUID academicYearId);

    boolean existsByStudentIdAndAcademicYearId(UUID studentId, UUID academicYearId);

    List<Enrollment> findByClassRoomId(UUID classRoomId);

    List<Enrollment> findByClassRoomIdAndStatus(UUID classRoomId, EnrollmentStatus status);
}

