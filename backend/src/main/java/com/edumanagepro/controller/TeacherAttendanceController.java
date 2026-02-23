package com.edumanagepro.controller;

import com.edumanagepro.dto.request.TakeAttendanceRequest;
import com.edumanagepro.dto.response.*;
import com.edumanagepro.security.UserPrincipal;
import com.edumanagepro.service.TeacherAttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/teacher/attendance")
public class TeacherAttendanceController {

    private final TeacherAttendanceService service;

    @GetMapping("/subjects")
    public List<TeacherAttendanceSubjectResponse> mySubjects(@AuthenticationPrincipal UserPrincipal me) {
        return service.listMySubjects(me);
    }

    @GetMapping("/subjects/{subjectId}/sessions")
    public List<AttendanceSessionSummaryResponse> sessions(@AuthenticationPrincipal UserPrincipal me,
                                                           @PathVariable UUID subjectId) {
        return service.listSessions(me, subjectId);
    }

    @GetMapping("/subjects/{subjectId}/students")
    public List<EnrolledStudentResponse> enrolled(@AuthenticationPrincipal UserPrincipal me,
                                                  @PathVariable UUID subjectId) {
        return service.listEnrolledStudents(me, subjectId);
    }

    @PostMapping("/subjects/{subjectId}/sessions")
    public AttendanceSessionSummaryResponse take(@AuthenticationPrincipal UserPrincipal me,
                                                 @PathVariable UUID subjectId,
                                                 @RequestBody TakeAttendanceRequest req) {
        return service.takeAttendance(me, subjectId, req);
    }
}