package com.edumanagepro.service;

import com.edumanagepro.dto.request.*;
import com.edumanagepro.entity.*;
import com.edumanagepro.entity.enums.*;
import com.edumanagepro.repository.*;
import com.edumanagepro.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.edumanagepro.events.*;
import org.springframework.context.ApplicationEventPublisher;

import java.math.BigDecimal;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AdminSetupService {

    private final InstituteRepository instituteRepository;
    private final AcademicYearRepository academicYearRepository;
    private final ClassRoomRepository classRoomRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final FeeStructureRepository feeStructureRepository;
    private final AnnouncementRepository announcementRepository; // you added earlier
    private final PasswordEncoder passwordEncoder;
    private final ApplicationEventPublisher events;

    public AcademicYear createAcademicYear(CreateAcademicYearRequest req) {
        Institute inst = instituteRepository.findById(req.getInstituteId()).orElseThrow();

        AcademicYear y = new AcademicYear();
        y.setInstitute(inst);
        y.setName(req.getName());
        y.setStartDate(req.getStartDate());
        y.setEndDate(req.getEndDate());
        y.setIsActive(req.isActive());

        return academicYearRepository.save(y);
    }

    public ClassRoom createClassRoom(CreateClassRoomRequest req) {
        AcademicYear y = academicYearRepository.findById(req.getAcademicYearId()).orElseThrow();

        ClassRoom c = new ClassRoom();
        c.setAcademicYear(y);
        c.setName(req.getName());
        c.setGradeOrProgram(req.getGradeOrProgram());
        c.setSection(req.getSection());
        c.setIsActive(req.isActive());

        return classRoomRepository.save(c);
    }

    public User createUser(CreateUserRequest req, UserPrincipal me) {
        User admin = userRepository.findById(me.getId()).orElseThrow(()-> new RuntimeException("Your institute is not defined"));
        Institute inst = admin.getInstitute();
        if (req.getRole() == null || (req.getRole() != UserRole.TEACHER && req.getRole() != UserRole.STUDENT)) {
            throw new RuntimeException("Role must be TEACHER or STUDENT");
        }

        String email = req.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) throw new RuntimeException("Email already exists");

        User u = new User();
        u.setInstitute(inst);
        u.setFullName(req.getFullName());
        u.setEmail(email);
        u.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        u.setRole(req.getRole());
        u.setActive(true);
        User saved = userRepository.save(u);
        events.publishEvent(new UserCreatedEvent(saved.getId(), req.getPassword()));
        return saved;
    }

    public Subject createSubject(CreateSubjectRequest req) {
        System.out.println(req + "In Create Subject");
        ClassRoom classRoom = classRoomRepository.findById(req.getClassRoomId()).orElseThrow();
        User teacher = userRepository.findById(req.getTeacherId()).orElseThrow();

        if (teacher.getRole() != UserRole.TEACHER) throw new RuntimeException("Assigned user is not a TEACHER");

        Subject s = new Subject();
        s.setClassRoom(classRoom);
        s.setTeacher(teacher);
        s.setName(req.getName());
//        s.setCode(req.getCode());
        s.setDescription(req.getDescription());
        s.setThumbnailUrl(req.getThumbnailUrl()); // optional
        s.setIsActive(true);
        Subject saved = subjectRepository.save(s);
        events.publishEvent(new TeacherAssignedEvent(saved.getId()));
        return saved;
    }

    public Subject assignTeacherToSubject(java.util.UUID subjectId, AssignTeacherRequest req) {
        Subject s = subjectRepository.findById(subjectId).orElseThrow();
        User teacher = userRepository.findById(req.getTeacherId()).orElseThrow();

        if (teacher.getRole() != UserRole.TEACHER) throw new RuntimeException("Assigned user is not a TEACHER");

        s.setTeacher(teacher);
        Subject saved = subjectRepository.save(s);
        events.publishEvent(new TeacherAssignedEvent(saved.getId()));
        return saved;
    }

    public Enrollment enrollStudent(CreateEnrollmentRequest req) {
        User student = userRepository.findById(req.getStudentId()).orElseThrow();
        if (student.getRole() != UserRole.STUDENT) throw new RuntimeException("User is not a STUDENT");

        AcademicYear y = academicYearRepository.findById(req.getAcademicYearId()).orElseThrow();
        ClassRoom c = classRoomRepository.findById(req.getClassRoomId()).orElseThrow();

        // ensure class belongs to that academic year
        if (!c.getAcademicYear().getId().equals(y.getId())) throw new RuntimeException("ClassRoom not in given AcademicYear");

        // ensure only one enrollment per student per year
        if (enrollmentRepository.existsByStudentIdAndAcademicYearId(student.getId(), y.getId())) {
            throw new RuntimeException("Student already enrolled in this academic year");
        }

        Enrollment e = new Enrollment();
        e.setStudent(student);
        e.setAcademicYear(y);
        e.setClassRoom(c);
        e.setStatus(EnrollmentStatus.ACTIVE);
        e.setEnrolledAt(Instant.now());
        e.setFeeCleared(false);
        Enrollment enr = enrollmentRepository.save(e);
        events.publishEvent(new StudentEnrolledEvent(enr.getId()));
        return enr;
    }

    public FeeStructure setFeeStructure(CreateFeeStructureRequest req) {
        AcademicYear y = academicYearRepository.findById(req.getAcademicYearId()).orElseThrow();
        ClassRoom c = classRoomRepository.findById(req.getClassRoomId()).orElseThrow();

        if (!c.getAcademicYear().getId().equals(y.getId())) throw new RuntimeException("ClassRoom not in given AcademicYear");
        if (req.getAmount() == null || req.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Amount must be > 0");
        }

        FeeStructure fs = feeStructureRepository
                .findByAcademicYearIdAndClassRoomId(y.getId(), c.getId())
                .orElseGet(FeeStructure::new);

        fs.setAcademicYear(y);
        fs.setClassRoom(c);
        fs.setAmount(req.getAmount());
        fs.setCurrency(req.getCurrency() == null ? "INR" : req.getCurrency());
        fs.setIsActive(req.isActive());

        return feeStructureRepository.save(fs);
    }

    public Announcement createAnnouncement(CreateAnnouncementRequest req, java.util.UUID adminId) {
        AcademicYear y = academicYearRepository.findById(req.getAcademicYearId()).orElseThrow();
        ClassRoom c = classRoomRepository.findById(req.getClassRoomId()).orElseThrow();

        if (!c.getAcademicYear().getId().equals(y.getId())) throw new RuntimeException("ClassRoom not in given AcademicYear");

        User admin = userRepository.findById(adminId).orElseThrow();
        if (admin.getRole() != UserRole.ADMIN) throw new RuntimeException("Only ADMIN can create announcements");

        Announcement a = new Announcement();
        a.setAcademicYear(y);
        a.setClassRoom(c);
        a.setCreatedByAdmin(admin);
        a.setTitle(req.getTitle());
        a.setMessage(req.getMessage());
        a.setIsActive(true);
        a.setPublishAt(Instant.now());

        return announcementRepository.save(a);
    }
}
