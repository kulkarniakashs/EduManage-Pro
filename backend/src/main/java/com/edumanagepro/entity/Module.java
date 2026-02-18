package com.edumanagepro.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "modules",
        indexes = @Index(name = "idx_module_subject", columnList = "subject_id"))
@Getter @Setter
public class Module extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Column(nullable = false, length = 160)
    private String title;

    @Column(length = 800)
    private String description;

    private Integer orderIndex;
}
