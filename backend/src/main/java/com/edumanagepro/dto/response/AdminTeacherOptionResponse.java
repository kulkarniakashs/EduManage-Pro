package com.edumanagepro.dto.response;

import lombok.*;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AdminTeacherOptionResponse {
    private UUID id;
    private String name;
    private String email;
    private String profilePhotoKey; // nullable
}