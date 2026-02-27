package com.edumanagepro.repository;

import com.edumanagepro.dto.response.ModuleResponse;
import com.edumanagepro.entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface ModuleRepository extends JpaRepository<Module, UUID> {
    List<Module> findBySubjectId(UUID subjectId);
}
