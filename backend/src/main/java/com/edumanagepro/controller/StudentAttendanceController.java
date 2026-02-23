package com.edumanagepro.controller;

import com.edumanagepro.dto.response.StudentAttendanceDayResponse;
import com.edumanagepro.dto.response.StudentSubjectAttendanceSummaryResponse;
import com.edumanagepro.security.UserPrincipal;
import com.edumanagepro.service.StudentAttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/student/attendance")
public class StudentAttendanceController {

    private final StudentAttendanceService service;

    @GetMapping("/subjects")
    public List<StudentSubjectAttendanceSummaryResponse> subjectSummary(
            @AuthenticationPrincipal UserPrincipal me
    ) {
        return service.mySubjectSummary(me);
    }

    @GetMapping("/subjects/{subjectId}/calendar")
    public List<StudentAttendanceDayResponse> calendar(
            @AuthenticationPrincipal UserPrincipal me,
            @PathVariable UUID subjectId,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to
    ) {
        LocalDate f = (from != null) ? LocalDate.parse(from) : null;
        LocalDate t = (to != null) ? LocalDate.parse(to) : null;
        return service.myCalendar(me, subjectId, f, t);
    }
}