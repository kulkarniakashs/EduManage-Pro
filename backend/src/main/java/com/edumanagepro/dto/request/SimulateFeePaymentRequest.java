package com.edumanagepro.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter @Setter
public class SimulateFeePaymentRequest {
    private UUID academicYearId;
    private UUID classRoomId;
}
