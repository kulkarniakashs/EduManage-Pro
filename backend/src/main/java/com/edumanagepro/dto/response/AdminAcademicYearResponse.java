package com.edumanagepro.dto.response;

import lombok.*;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AdminAcademicYearResponse {
    private UUID id;
    private String name;
    private boolean active;
}