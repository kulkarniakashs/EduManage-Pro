package com.edumanagepro.repository;

import com.edumanagepro.entity.ContentItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ContentItemRepository extends JpaRepository<ContentItem, UUID> {

    List<ContentItem> findByModuleId(UUID moduleId);

    List<ContentItem> findByModuleIdAndIsPublishedTrue(UUID moduleId);
}
