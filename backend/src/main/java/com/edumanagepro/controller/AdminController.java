package com.edumanagepro.controller;

import com.edumanagepro.dto.request.*;
import com.edumanagepro.entity.*;
import com.edumanagepro.security.UserPrincipal;
import com.edumanagepro.service.AdminSetupService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {

    private final AdminSetupService adminSetupService;

    @PostMapping("/academic-years")
    public AcademicYear createAcademicYear(@RequestBody CreateAcademicYearRequest req) {
        return adminSetupService.createAcademicYear(req);
    }

    @PostMapping("/classrooms")
    public ClassRoom createClassRoom(@RequestBody CreateClassRoomRequest req) {
        return adminSetupService.createClassRoom(req);
    }

    @PostMapping("/users")
    public User createUser(@RequestBody CreateUserRequest req) {
        return adminSetupService.createUser(req);
    }

    @PostMapping("/subjects")
    public Subject createSubject(@RequestBody CreateSubjectRequest req) {
        return adminSetupService.createSubject(req);
    }

    @PutMapping("/subjects/{subjectId}/assign-teacher")
    public Subject assignTeacher(@PathVariable UUID subjectId, @RequestBody AssignTeacherRequest req) {
        return adminSetupService.assignTeacherToSubject(subjectId, req);
    }

    @PostMapping("/enrollments")
    public Enrollment enroll(@RequestBody CreateEnrollmentRequest req) {
        return adminSetupService.enrollStudent(req);
    }

    @PostMapping("/fee-structures")
    public FeeStructure setFee(@RequestBody CreateFeeStructureRequest req) {
        return adminSetupService.setFeeStructure(req);
    }

    @PostMapping("/announcements")
    public Announcement announcement(@AuthenticationPrincipal UserPrincipal me,
                                     @RequestBody CreateAnnouncementRequest req) {
        return adminSetupService.createAnnouncement(req, me.getId());
    }
}
