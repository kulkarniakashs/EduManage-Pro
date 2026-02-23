package com.edumanagepro.dto.response;

import com.edumanagepro.entity.enums.AttendanceStatus;
import lombok.*;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StudentAttendanceDayResponse {
    private LocalDate date;
    private AttendanceStatus status; // PRESENT/ABSENT
}