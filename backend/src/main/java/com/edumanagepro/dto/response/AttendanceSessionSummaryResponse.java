package com.edumanagepro.dto.response;

import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AttendanceSessionSummaryResponse {
    private UUID sessionId;
    private LocalDate date;
    private int totalStudents;
    private int presentStudents;
    private int absentStudents;
}