package com.edumanagepro.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "academic_years",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_year_name_per_institute",
                columnNames = {"institute_id", "name"}))
@Getter @Setter
public class AcademicYear extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "institute_id", nullable = false)
    private Institute institute;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Column(nullable = false)
    private boolean isActive = true;

    public void setIsActive(boolean active) {
    }
}
