package com.edumanagepro.service;

import com.edumanagepro.dto.request.TakeAttendanceRequest;
import com.edumanagepro.dto.response.*;
import com.edumanagepro.entity.*;
import com.edumanagepro.repository.*;
import com.edumanagepro.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class TeacherAttendanceService {

    private final SubjectRepository subjectRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AttendanceSessionRepository sessionRepository;
    private final AttendanceRecordRepository recordRepository;

    public List<TeacherAttendanceSubjectResponse> listMySubjects(UserPrincipal me) {
        // reuse your existing subjectRepository queries if present
        // assuming Subject has teacher, classRoom, academicYear
        List<Subject> subjects = subjectRepository.findByTeacherId(me.getId());
        return subjects.stream().map(s -> TeacherAttendanceSubjectResponse.builder()
                .subjectId(s.getId())
                .subjectName(s.getName())
                .classRoomName(s.getClassRoom().getName())
                .academicYearName(s.getClassRoom().getAcademicYear().getName())
                .build()
        ).toList();
    }

    public List<AttendanceSessionSummaryResponse> listSessions(UserPrincipal me, UUID subjectId) {
        Subject subject = subjectRepository.findById(subjectId).orElseThrow();

        if (!subject.getTeacher().getId().equals(me.getId()))
            throw new RuntimeException("Not your subject");

        // total students = enrolled in subject's class+year
        int totalStudents = enrollmentRepository
                .findByAcademicYearAndClassRoom(subject.getClassRoom().getAcademicYear().getId(), subject.getClassRoom().getId())
                .size();

        List<AttendanceSession> sessions = sessionRepository.findBySubjectIdOrderBySessionDateDesc(subjectId);

        return sessions.stream().map(sess -> {
            var records = recordRepository.findByAttendanceSessionId(sess.getId());
            int present = (int) records.stream().filter(r -> r.getStatus().name().equals("PRESENT")).count();
            int absent = (int) records.stream().filter(r -> r.getStatus().name().equals("ABSENT")).count();
            return AttendanceSessionSummaryResponse.builder()
                    .sessionId(sess.getId())
                    .date(sess.getSessionDate())
                    .totalStudents(totalStudents)
                    .presentStudents(present)
                    .absentStudents(absent)
                    .build();
        }).toList();
    }

    public List<EnrolledStudentResponse> listEnrolledStudents(UserPrincipal me, UUID subjectId) {
        Subject subject = subjectRepository.findById(subjectId).orElseThrow();
        if (!subject.getTeacher().getId().equals(me.getId()))
            throw new RuntimeException("Not your subject");

        List<Enrollment> enrollments = enrollmentRepository
                .findByAcademicYearAndClassRoom(subject.getClassRoom().getAcademicYear().getId(), subject.getClassRoom().getId());

        return enrollments.stream().map(e -> EnrolledStudentResponse.builder()
                .studentId(e.getStudent().getId())
                .name(e.getStudent().getFullName())
                .email(e.getStudent().getEmail())
                .profilePhotoKey(e.getStudent().getProfilePhotoKey())
                .build()
        ).toList();
    }

    public AttendanceSessionSummaryResponse takeAttendance(UserPrincipal me, UUID subjectId, TakeAttendanceRequest req) {
        Subject subject = subjectRepository.findById(subjectId).orElseThrow();
        if (!subject.getTeacher().getId().equals(me.getId()))
            throw new RuntimeException("Not your subject");

        LocalDate date = req.getSessionDate() != null ? req.getSessionDate() : LocalDate.now();

        AttendanceSession session = sessionRepository.findBySubjectIdAndSessionDate(subjectId, date)
                .orElseGet(() -> {
                    AttendanceSession s = new AttendanceSession();
                    s.setSubject(subject);
                    s.setTeacher(subject.getTeacher());
                    s.setSessionDate(date);
                    return sessionRepository.save(s);
                });

        // upsert records
        for (var r : req.getRecords()) {
            AttendanceRecord record = recordRepository
                    .findByAttendanceSessionIdAndStudentId(session.getId(), r.getStudentId())
                    .orElseGet(() -> {
                        AttendanceRecord ar = new AttendanceRecord();
                        ar.setAttendanceSession(session);
                        User stub = new User();
                        stub.setId(r.getStudentId());
                        ar.setStudent(stub);
                        return ar;
                    });

            record.setStatus(r.getStatus());
            recordRepository.save(record);
        }

        int totalStudents = enrollmentRepository
                .findByAcademicYearAndClassRoom(subject.getClassRoom().getAcademicYear().getId(), subject.getClassRoom().getId())
                .size();
        var records = recordRepository.findByAttendanceSessionId(session.getId());
        int present = (int) records.stream().filter(x -> x.getStatus().name().equals("PRESENT")).count();
        int absent = (int) records.stream().filter(x -> x.getStatus().name().equals("ABSENT")).count();

        return AttendanceSessionSummaryResponse.builder()
                .sessionId(session.getId())
                .date(date)
                .totalStudents(totalStudents)
                .presentStudents(present)
                .absentStudents(absent)
                .build();
    }
}