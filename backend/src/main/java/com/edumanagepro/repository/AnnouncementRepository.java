package com.edumanagepro.repository;

import com.edumanagepro.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

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

    @Query("""
        select a
        from Announcement a
        where a.academicYear.id = :academicYearId
          and a.classRoom.id = :classRoomId
          and a.isActive = true
          and a.publishAt <= :now
          and (a.expiresAt is null or a.expiresAt > :now)
        order by a.publishAt desc, a.createdAt desc
    """)
    List<Announcement> findVisibleForClass(UUID academicYearId, UUID classRoomId, Instant now);
}
