package com.edumanagepro.dto.request;

import com.edumanagepro.entity.enums.AttendanceStatus;
import lombok.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TakeAttendanceRequest {

    private LocalDate sessionDate; // default today on frontend

    private List<Record> records;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Record {
        private UUID studentId;
        private AttendanceStatus status; // PRESENT/ABSENT
    }
}