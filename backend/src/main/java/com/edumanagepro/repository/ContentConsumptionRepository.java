package com.edumanagepro.repository;

import com.edumanagepro.entity.ContentConsumption;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ContentConsumptionRepository extends JpaRepository<ContentConsumption, UUID> {

    Optional<ContentConsumption> findByStudentIdAndContentItemId(UUID studentId, UUID contentItemId);

    List<ContentConsumption> findByStudentId(UUID studentId);

    List<ContentConsumption> findByStudentIdAndContentItemIdIn(UUID studentId, List<UUID> contentItemIds);
}
