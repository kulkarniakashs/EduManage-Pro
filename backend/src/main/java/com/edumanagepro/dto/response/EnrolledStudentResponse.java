package com.edumanagepro.dto.response;

import lombok.*;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EnrolledStudentResponse {
    private UUID studentId;
    private String name;
    private String email;
    private String profilePhotoKey; // nullable
}