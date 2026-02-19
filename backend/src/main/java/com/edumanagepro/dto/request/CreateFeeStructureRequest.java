package com.edumanagepro.dto.request;

import lombok.Getter; import lombok.Setter;
import java.math.BigDecimal;
import java.util.UUID;

@Getter @Setter
public class CreateFeeStructureRequest {
    private UUID academicYearId;
    private UUID classRoomId;
    private BigDecimal amount;
    private String currency = "INR";
    private boolean active = true;
}
