package com.edumanagepro.repository;

import com.edumanagepro.entity.AcademicYear;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AcademicYearRepository extends JpaRepository<AcademicYear, UUID> {

    List<AcademicYear> findByInstituteId(UUID instituteId);

    Optional<AcademicYear> findByInstituteIdAndIsActiveTrue(UUID instituteId);

    boolean existsByInstituteIdAndName(UUID instituteId, String name);
}
