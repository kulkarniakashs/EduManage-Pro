package com.edumanagepro.service;

import com.edumanagepro.dto.response.StudentAttendanceDayResponse;
import com.edumanagepro.dto.response.StudentSubjectAttendanceSummaryResponse;
import com.edumanagepro.entity.ClassRoom;
import com.edumanagepro.entity.Enrollment;
import com.edumanagepro.entity.Subject;
import com.edumanagepro.entity.User;
import com.edumanagepro.entity.enums.AttendanceStatus;
import com.edumanagepro.entity.enums.EnrollmentStatus;
import com.edumanagepro.repository.*;
import com.edumanagepro.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudentAttendanceService {

    private final SubjectRepository subjectRepository;
    private final AttendanceRecordRepository recordRepository;
    private final UserRepository userRepository;
    private final ClassRoomRepository classRoomRepository;
    private final EnrollmentRepository enrollmentRepository;

    public List<StudentSubjectAttendanceSummaryResponse> mySubjectSummary(UserPrincipal me) {
//        List<Subject> subjects = subjectRepository.findStudentSubjects(me.getId());
        Enrollment enr = enrollmentRepository
                .findTopByStudentIdAndStatusOrderByEnrolledAtDesc(me.getId(), EnrollmentStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("No active enrollment"));

        List<Subject> subjects = subjectRepository.findByClassRoomIdAndIsActiveTrue(enr.getClassRoom().getId());

        return subjects.stream().map(s -> {
            long total = recordRepository.countByStudentIdAndAttendanceSessionSubjectId(me.getId(), s.getId());
            long present = recordRepository.countByStudentIdAndAttendanceSessionSubjectIdAndStatus(
                    me.getId(), s.getId(), AttendanceStatus.PRESENT
            );

            double pct = total == 0 ? 0.0 : (present * 100.0) / total;
            double rounded = Math.round(pct * 10.0) / 10.0;

            return StudentSubjectAttendanceSummaryResponse.builder()
                    .subjectId(s.getId())
                    .subjectName(s.getName())
                    .teacherName(s.getTeacher().getFullName())
                    .teacherProfilePhotoKey(s.getTeacher().getProfilePhotoKey())
                    .totalSessions(total)
                    .presentCount(present)
                    .percentage(rounded)
                    .build();
        }).toList();
    }

    public List<StudentAttendanceDayResponse> myCalendar(
            UserPrincipal me,
            UUID subjectId,
            LocalDate from,
            LocalDate to
    ) {
        LocalDate f = (from != null) ? from : LocalDate.now().minusDays(120);
        LocalDate t = (to != null) ? to : LocalDate.now();

        // rows: [0]=LocalDate, [1]=AttendanceStatus (nullable if record missing)
        List<Object[]> rows = recordRepository.calendar(me.getId(), subjectId, f, t);

        List<StudentAttendanceDayResponse> out = new ArrayList<>();
        for (Object[] row : rows) {
            LocalDate date = (LocalDate) row[0];
            AttendanceStatus status = (AttendanceStatus) row[1];

            // if teacher created a session but didn't create record for student, treat as ABSENT
            if (status == null) status = AttendanceStatus.ABSENT;

            out.add(StudentAttendanceDayResponse.builder()
                    .date(date)
                    .status(status)
                    .build());
        }

        return out;
    }
}