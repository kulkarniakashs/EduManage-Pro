package com.edumanagepro.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "attendance_sessions",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_session_subject_date",
                columnNames = {"subject_id", "session_date"}
        ),
        indexes = {
                @Index(name = "idx_att_session_subject", columnList = "subject_id"),
                @Index(name = "idx_att_session_teacher", columnList = "teacher_id"),
                @Index(name = "idx_att_session_date", columnList = "session_date")
        })
@Getter @Setter
public class AttendanceSession extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;

    @Column(name = "session_date", nullable = false)
    private LocalDate sessionDate;
}
