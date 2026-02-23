package com.edumanagepro.repository;

import com.edumanagepro.entity.AttendanceSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AttendanceSessionRepository extends JpaRepository<AttendanceSession , UUID> {
    Optional<AttendanceSession> findBySubjectIdAndSessionDate(UUID subjectId, LocalDate date);

    List<AttendanceSession> findBySubjectIdOrderBySessionDateDesc(UUID subjectId);
}
