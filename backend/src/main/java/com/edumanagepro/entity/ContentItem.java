package com.edumanagepro.entity;

import com.edumanagepro.entity.enums.ContentType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "content_items",
        indexes = {
                @Index(name = "idx_content_module", columnList = "module_id"),
                @Index(name = "idx_content_type", columnList = "type")
        })
@Getter @Setter
public class ContentItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "module_id", nullable = false)
    private Module module;

    @Column(nullable = false, length = 180)
    private String title;

    @Column(length = 800)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ContentType type;

    private String objectKey;   // VIDEO/PDF
    private String externalUrl; // LINK

    private Integer durationSeconds;

    @Column(nullable = false)
    private boolean isPublished = true;
}
