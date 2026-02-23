package com.edumanagepro.dto.response;

import lombok.*;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StudentSubjectAttendanceSummaryResponse {
    private UUID subjectId;
    private String subjectName;
    private String teacherName;
    private String teacherProfilePhotoKey; // nullable

    private long totalSessions;
    private long presentCount;
    private double percentage; // 0..100
}