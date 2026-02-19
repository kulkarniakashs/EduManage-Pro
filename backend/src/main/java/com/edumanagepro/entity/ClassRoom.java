package com.edumanagepro.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "class_rooms",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_classroom_name_per_year",
                columnNames = {"academic_year_id", "name"}
        ),
        indexes = @Index(name = "idx_classroom_year", columnList = "academic_year_id"))
@Getter @Setter
public class ClassRoom extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "academic_year_id", nullable = false)
    private AcademicYear academicYear;

    @Column(nullable = false, length = 60)
    private String name;

    private String gradeOrProgram;
    private String section;

    @Column(nullable = false)
    private boolean isActive = true;

    public void setIsActive(boolean active) {
    }
}
