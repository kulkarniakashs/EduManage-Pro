package com.edumanagepro.dto.response;

import com.edumanagepro.entity.enums.ConsumptionStatus;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentContentConsumptionDto {
    private UUID contentId;
    private ConsumptionStatus status;
    private int progressPercent;       // 0..100
    private int lastPositionSeconds;   // for resume
    private Instant lastAccessedAt;
}