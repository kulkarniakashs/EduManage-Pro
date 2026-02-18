package com.edumanagepro.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "subjects",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_subject_name_per_class",
                columnNames = {"class_room_id", "name"}
        ),
        indexes = @Index(name = "idx_subject_class", columnList = "class_room_id"))
@Getter @Setter
public class Subject extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "class_room_id", nullable = false)
    private ClassRoom classRoom;

    @Column(nullable = false, length = 120)
    private String name;

    private String code;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private boolean isActive = true;

    private String thumbnailUrl;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;
}
