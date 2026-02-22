package com.edumanagepro.dto.response;

import lombok.*;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AdminSubjectWithTeacherResponse {
    private UUID subjectId;
    private String subjectName;
    private String description;
    private String thumbnailUrl; // nullable

    private UUID teacherId;      // nullable
    private String teacherName;  // nullable
    private String teacherProfilePhotoKey; // nullable
}