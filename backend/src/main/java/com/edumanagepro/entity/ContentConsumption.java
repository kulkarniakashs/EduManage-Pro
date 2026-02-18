package com.edumanagepro.entity;

import com.edumanagepro.entity.enums.ConsumptionStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "content_consumptions",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_consumption_student_content",
                columnNames = {"student_id", "content_item_id"}
        ),
        indexes = {
                @Index(name = "idx_consumption_student", columnList = "student_id"),
                @Index(name = "idx_consumption_content", columnList = "content_item_id"),
                @Index(name = "idx_consumption_status", columnList = "status")
        })
@Getter @Setter
public class ContentConsumption extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "content_item_id", nullable = false)
    private ContentItem contentItem;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ConsumptionStatus status = ConsumptionStatus.NOT_STARTED;

    @Column(nullable = false)
    private int progressPercent = 0;

    @Column(nullable = false)
    private int lastPositionSeconds = 0;

    private Instant lastAccessedAt;
    private Instant completedAt;
}
