package com.edumanagepro.repository;

import com.edumanagepro.entity.FeeStructure;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface FeeStructureRepository extends JpaRepository<FeeStructure, UUID> {

    Optional<FeeStructure> findByAcademicYearIdAndClassRoomId(UUID academicYearId, UUID classRoomId);

    boolean existsByAcademicYearIdAndClassRoomId(UUID academicYearId, UUID classRoomId);
}
