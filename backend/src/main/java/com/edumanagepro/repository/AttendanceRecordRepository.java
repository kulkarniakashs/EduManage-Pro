package com.edumanagepro.repository;

import com.edumanagepro.entity.AttendanceRecord;
import com.edumanagepro.entity.enums.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, UUID> {

    Optional<AttendanceRecord> findByAttendanceSessionIdAndStudentId(UUID attendanceSessionId, UUID studentId);

    List<AttendanceRecord> findByAttendanceSessionId(UUID attendanceSessionId);

    long countByStudentIdAndAttendanceSessionSubjectIdAndStatus(UUID studentId, UUID subjectId, AttendanceStatus status);

    long countByStudentIdAndAttendanceSessionSubjectId(UUID studentId, UUID subjectId);
}
