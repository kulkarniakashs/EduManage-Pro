package com.edumanagepro.repository;

import com.edumanagepro.entity.ClassRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ClassRoomRepository extends JpaRepository<ClassRoom, UUID> {

    List<ClassRoom> findByAcademicYearId(UUID academicYearId);

    Optional<ClassRoom> findByAcademicYearIdAndName(UUID academicYearId, String name);
}
