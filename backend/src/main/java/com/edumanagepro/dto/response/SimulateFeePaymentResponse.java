package com.edumanagepro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class SimulateFeePaymentResponse {

    private UUID paymentId;
    private BigDecimal amount;
    private String currency;
    private String status;
    private Instant paidAt;
}
