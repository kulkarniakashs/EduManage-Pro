package com.edumanagepro.repository;

import com.edumanagepro.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface AnnouncementRepository extends JpaRepository<Announcement, UUID> {

    // Student view: announcements for their class + year (active + publishAt <= now)
    List<Announcement> findByAcademicYearIdAndClassRoomIdAndIsActiveTrueAndPublishAtLessThanEqualOrderByPublishAtDesc(
            UUID academicYearId, UUID classRoomId, Instant now
    );

    // Admin view: all announcements for a class
    List<Announcement> findByAcademicYearIdAndClassRoomIdOrderByPublishAtDesc(UUID academicYearId, UUID classRoomId);
}
