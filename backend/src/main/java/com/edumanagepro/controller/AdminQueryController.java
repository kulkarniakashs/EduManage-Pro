package com.edumanagepro.controller;

import com.edumanagepro.dto.response.*;
import com.edumanagepro.service.AdminQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminQueryController {

    private final AdminQueryService adminQueryService;

    @GetMapping("/academic-years")
    public List<AdminAcademicYearResponse> listAcademicYears() {
        return adminQueryService.listAcademicYears();
    }

    @GetMapping("/academic-years/latest")
    public AdminAcademicYearResponse latestAcademicYear() {
        return adminQueryService.latestAcademicYear();
    }

    @GetMapping("/academic-years/{academicYearId}/classrooms")
    public List<AdminClassRoomResponse> listClassRooms(@PathVariable UUID academicYearId) {
        return adminQueryService.listClassRooms(academicYearId);
    }

    @GetMapping("/academic-years/{academicYearId}/classrooms/{classRoomId}/subjects")
    public List<AdminSubjectWithTeacherResponse> listSubjects(
            @PathVariable UUID academicYearId,
            @PathVariable UUID classRoomId
    ) {
        return adminQueryService.listSubjectsWithTeacher(academicYearId, classRoomId);
    }

    @GetMapping("/teachers")
    public List<AdminTeacherOptionResponse> listTeachers() {
        return adminQueryService.listTeachers();
    }

    @GetMapping("/students/available")
    public List<AdminStudentOptionResponse> listAvailableStudents(
            @RequestParam UUID academicYearId,
            @RequestParam UUID classRoomId
    ) {
        return adminQueryService.listStudentsNotEnrolled(academicYearId, classRoomId);
    }

    @GetMapping("/fee-structures")
    public AdminFeeStructureResponse getFeeStructure(
            @RequestParam UUID academicYearId,
            @RequestParam UUID classRoomId
    ) {
        return adminQueryService.getFeeStructure(academicYearId, classRoomId);
    }
}