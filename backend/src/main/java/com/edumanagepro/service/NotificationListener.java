package com.edumanagepro.service;

import com.edumanagepro.entity.Enrollment;
import com.edumanagepro.entity.Subject;
import com.edumanagepro.entity.User;
import com.edumanagepro.events.StudentEnrolledEvent;
import com.edumanagepro.events.TeacherAssignedEvent;
import com.edumanagepro.events.UserCreatedEvent;
import com.edumanagepro.repository.EnrollmentRepository;
import com.edumanagepro.repository.SubjectRepository;
import com.edumanagepro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationListener {

    private final EmailService emailService;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final SubjectRepository subjectRepository;

//    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @EventListener
    public void onUserCreated(UserCreatedEvent ev) {
        System.out.println("User account event triggered");
        User u = userRepository.findById(ev.userId()).orElseThrow();
        String html = EmailTemplates.accountCreated(u.getFullName(), u.getEmail(), ev.plainPassword(), u.getRole().name());
        emailService.sendHtml(u.getEmail(), "EduManage Pro | Account Created", html);
    }

    @EventListener
    public void onStudentEnrolled(StudentEnrolledEvent ev) {
        System.out.println("User enroll event triggered");
        Enrollment e = enrollmentRepository.findById(ev.enrollmentId()).orElseThrow();
        User student = e.getStudent();
        String html = EmailTemplates.studentEnrolled(
                student.getFullName(),
                e.getClassRoom().getName(),
                e.getAcademicYear().getName()
        );
        emailService.sendHtml(student.getEmail(), "EduManage Pro | Enrollment Confirmed", html);
    }

    @EventListener
    public void onTeacherAssigned(TeacherAssignedEvent ev) {
        System.out.println("teacher assign event triggered");
        Subject s = subjectRepository.findById(ev.subjectId()).orElseThrow();
        User teacher = s.getTeacher();
        String html = EmailTemplates.teacherAssigned(
                teacher.getFullName(),
                s.getName(),
                s.getClassRoom().getName(),
                s.getClassRoom().getAcademicYear().getName()
        );
        emailService.sendHtml(teacher.getEmail(), "EduManage Pro | Subject Assigned", html);
    }
}