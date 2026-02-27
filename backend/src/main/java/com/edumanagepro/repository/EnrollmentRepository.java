package com.edumanagepro.repository;

import com.edumanagepro.entity.Enrollment;
import com.edumanagepro.entity.User;
import com.edumanagepro.entity.enums.EnrollmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID> {

    Optional<Enrollment> findByStudentIdAndAcademicYearId(UUID studentId, UUID academicYearId);

    boolean existsByStudentIdAndAcademicYearId(UUID studentId, UUID academicYearId);

    List<Enrollment> findByClassRoomId(UUID classRoomId);

    List<Enrollment> findByClassRoomIdAndStatus(UUID classRoomId, EnrollmentStatus status);

    Optional<Enrollment> findFirstByStudentIdAndStatusOrderByCreatedAtDesc(UUID studentId, EnrollmentStatus status);

    Optional<Enrollment> findTopByStudentIdAndStatusOrderByEnrolledAtDesc(UUID studentId, EnrollmentStatus status);

    @Query("""
    SELECT u FROM User u
    WHERE u.role = com.edumanagepro.entity.enums.UserRole.STUDENT
    AND u.id NOT IN (
        SELECT e.student.id FROM Enrollment e
        WHERE e.academicYear.id = :academicYearId
    )
""")
    List<User> findStudentsNotEnrolled(UUID academicYearId);


    @Query("""
        select e from Enrollment e
        where e.academicYear.id = :academicYearId
          and e.classRoom.id = :classRoomId
        """)
    List<Enrollment> findByAcademicYearAndClassRoom(UUID academicYearId, UUID classRoomId);
}

