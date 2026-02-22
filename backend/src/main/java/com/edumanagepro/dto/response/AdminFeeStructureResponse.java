package com.edumanagepro.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AdminFeeStructureResponse {
    private UUID id;
    private UUID academicYearId;
    private UUID classRoomId;
    private BigDecimal amount;
    private String currency;
    private boolean active;
}