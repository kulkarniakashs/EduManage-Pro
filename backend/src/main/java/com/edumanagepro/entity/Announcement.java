package com.edumanagepro.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "announcements",
        indexes = {
                @Index(name = "idx_announcement_class", columnList = "class_room_id"),
                @Index(name = "idx_announcement_year", columnList = "academic_year_id"),
                @Index(name = "idx_announcement_created_at", columnList = "created_at")
        })
@Getter @Setter
public class Announcement extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "academic_year_id", nullable = false)
    private AcademicYear academicYear;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "class_room_id", nullable = false)
    private ClassRoom classRoom;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by_admin_id", nullable = false)
    private User createdByAdmin; // role ADMIN

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 2000)
    private String message;

    @Column(nullable = false)
    private boolean isActive = true;

    @Column(nullable = false)
    private Instant publishAt = Instant.now();

    private Instant expiresAt; // optional (if you want later)
}
