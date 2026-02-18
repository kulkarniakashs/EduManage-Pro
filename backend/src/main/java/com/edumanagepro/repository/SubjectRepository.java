package com.edumanagepro.repository;

import com.edumanagepro.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SubjectRepository extends JpaRepository<Subject, UUID> {

    List<Subject> findByClassRoomId(UUID classRoomId);

    Optional<Subject> findByClassRoomIdAndName(UUID classRoomId, String name);

    // Teacher assigned directly in Subject
    List<Subject> findByTeacherId(UUID teacherId);

    List<Subject> findByTeacherIdAndClassRoomId(UUID teacherId, UUID classRoomId);
}

