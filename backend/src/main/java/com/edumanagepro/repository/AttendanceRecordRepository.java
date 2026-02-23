package com.edumanagepro.repository;

import com.edumanagepro.entity.AttendanceRecord;
import com.edumanagepro.entity.enums.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, UUID> {

    Optional<AttendanceRecord> findByAttendanceSessionIdAndStudentId(UUID attendanceSessionId, UUID studentId);

    List<AttendanceRecord> findByAttendanceSessionId(UUID attendanceSessionId);

    long countByStudentIdAndAttendanceSessionSubjectIdAndStatus(UUID studentId, UUID subjectId, AttendanceStatus status);

    long countByStudentIdAndAttendanceSessionSubjectId(UUID studentId, UUID subjectId);

    @Query("""
        select s.sessionDate as date, r.status as status
        from AttendanceSession s
        left join AttendanceRecord r
          on r.attendanceSession.id = s.id and r.student.id = :studentId
        where s.subject.id = :subjectId
          and s.sessionDate between :from and :to
        order by s.sessionDate asc
    """)
    List<Object[]> calendar(@Param("studentId") UUID studentId,
                            @Param("subjectId") UUID subjectId,
                            @Param("from") LocalDate from,
                            @Param("to") LocalDate to);
}
