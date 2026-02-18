package com.edumanagepro.entity;

import com.edumanagepro.entity.enums.AttendanceStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "attendance_records",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_record_session_student",
                columnNames = {"attendance_session_id", "student_id"}
        ),
        indexes = {
                @Index(name = "idx_att_record_student", columnList = "student_id"),
                @Index(name = "idx_att_record_session", columnList = "attendance_session_id")
        })
@Getter @Setter
public class AttendanceRecord extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "attendance_session_id", nullable = false)
    private AttendanceSession attendanceSession;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private AttendanceStatus status;

    @Column(nullable = false)
    private Instant markedAt = Instant.now();
}
