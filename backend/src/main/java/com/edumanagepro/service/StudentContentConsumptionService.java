package com.edumanagepro.service;

import com.edumanagepro.dto.request.VideoProgressRequest;
import com.edumanagepro.dto.response.StudentContentConsumptionDto;
import com.edumanagepro.entity.ContentConsumption;
import com.edumanagepro.entity.ContentItem;
import com.edumanagepro.entity.User;
import com.edumanagepro.entity.enums.ConsumptionStatus;
import com.edumanagepro.entity.enums.ContentType;
import com.edumanagepro.repository.ContentConsumptionRepository;
import com.edumanagepro.repository.ContentItemRepository;
import com.edumanagepro.repository.UserRepository;
import com.edumanagepro.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudentContentConsumptionService {

    private final ContentConsumptionRepository consumptionRepo;
    private final ContentItemRepository contentRepo;
    private final UserRepository userRepo;

    public StudentContentConsumptionDto markVisited(UserPrincipal me, UUID contentId) {
        ContentItem item = contentRepo.findById(contentId).orElseThrow();
        User student = userRepo.findById(me.getId()).orElseThrow();

        ContentConsumption cc = consumptionRepo.findByStudentIdAndContentItemId(me.getId(), contentId)
                .orElseGet(() -> {
                    ContentConsumption n = new ContentConsumption();
                    n.setStudent(student);
                    n.setContentItem(item);
                    n.setStatus(ConsumptionStatus.NOT_STARTED);
                    n.setProgressPercent(0);
                    n.setLastPositionSeconds(0);
                    return n;
                });

        cc.setLastAccessedAt(Instant.now());

        // PDF: just mark as IN_PROGRESS to mean "visited"
        if (item.getType() == ContentType.PDF) {
            if (cc.getStatus() == ConsumptionStatus.NOT_STARTED) {
                cc.setStatus(ConsumptionStatus.IN_PROGRESS);
            }
        } else if (item.getType() == ContentType.VIDEO) {
            if (cc.getStatus() == ConsumptionStatus.NOT_STARTED) {
                cc.setStatus(ConsumptionStatus.IN_PROGRESS);
            }
        }

        consumptionRepo.save(cc);
        return toDto(cc);
    }

    public StudentContentConsumptionDto updateVideoProgress(UserPrincipal me, UUID contentId, VideoProgressRequest req) {
        ContentItem item = contentRepo.findById(contentId).orElseThrow();
        if (item.getType() != ContentType.VIDEO) {
            throw new RuntimeException("Not a video");
        }

        User student = userRepo.findById(me.getId()).orElseThrow();

        ContentConsumption cc = consumptionRepo.findByStudentIdAndContentItemId(me.getId(), contentId)
                .orElseGet(() -> {
                    ContentConsumption n = new ContentConsumption();
                    n.setStudent(student);
                    n.setContentItem(item);
                    n.setStatus(ConsumptionStatus.NOT_STARTED);
                    n.setProgressPercent(0);
                    n.setLastPositionSeconds(0);
                    return n;
                });

        cc.setLastAccessedAt(Instant.now());
        cc.setStatus(ConsumptionStatus.IN_PROGRESS);

        int current = Math.max(0, req.getCurrentSeconds());
        cc.setLastPositionSeconds(Math.max(cc.getLastPositionSeconds(), current));

        int duration = item.getDurationSeconds() != null ? item.getDurationSeconds() : Math.max(0, req.getDurationSeconds());
        int pct = 0;
        if (duration > 0) pct = (int) Math.round((current * 100.0) / duration);
        pct = Math.min(100, Math.max(0, pct));

        // keep max progress (do not decrease if user seeks backward)
        cc.setProgressPercent(Math.max(cc.getProgressPercent(), pct));

        if (cc.getProgressPercent() >= 95) {
            cc.setStatus(ConsumptionStatus.COMPLETED);
            if (cc.getCompletedAt() == null) cc.setCompletedAt(Instant.now());
        }

        consumptionRepo.save(cc);
        return toDto(cc);
    }

    private StudentContentConsumptionDto toDto(ContentConsumption cc) {
        return StudentContentConsumptionDto.builder()
                .contentId(cc.getContentItem().getId())
                .status(cc.getStatus())
                .progressPercent(cc.getProgressPercent())
                .lastPositionSeconds(cc.getLastPositionSeconds())
                .lastAccessedAt(cc.getLastAccessedAt())
                .build();
    }
}