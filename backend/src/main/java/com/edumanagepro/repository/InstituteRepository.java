package com.edumanagepro.repository;

import com.edumanagepro.entity.Institute;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface InstituteRepository extends JpaRepository<Institute, UUID> {
    Optional<Institute> findByCode(String code);
    boolean existsByCode(String code);
}
