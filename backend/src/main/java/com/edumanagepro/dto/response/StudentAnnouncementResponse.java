package com.edumanagepro.dto.response;

import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
@Builder
public class StudentAnnouncementResponse {
    private UUID id;
    private String title;
    private String message;

    private Instant publishAt;
    private Instant expiresAt; // nullable

    private UUID createdByAdminId;
    private String createdByAdminName;
    private String AdminPhotoUrl;
    private Instant createdAt; // from BaseEntity
}