package com.edumanagepro.entity;

import com.edumanagepro.entity.enums.EnrollmentStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "enrollments",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_enrollment_student_year",
                columnNames = {"student_id", "academic_year_id"}
        ),
        indexes = {
                @Index(name = "idx_enrollment_class", columnList = "class_room_id"),
                @Index(name = "idx_enrollment_student", columnList = "student_id")
        })
@Getter @Setter
public class Enrollment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "academic_year_id", nullable = false)
    private AcademicYear academicYear;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "class_room_id", nullable = false)
    private ClassRoom classRoom;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EnrollmentStatus status = EnrollmentStatus.ACTIVE;

    @Column(nullable = false)
    private Instant enrolledAt = Instant.now();

    private Instant deactivatedAt;

    @Column(nullable = false)
    private boolean feeCleared = false; // updated when FeePayment SUCCESS

    public Boolean getFeeCleared() {
        return feeCleared;
    }
}
