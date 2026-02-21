package com.edumanagepro.dto.response;

import com.edumanagepro.entity.enums.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
@Builder
public class StudentFeeSummaryResponse {

    private UUID academicYearId;
    private String academicYearName;

    private UUID classRoomId;
    private String classRoomName;

    private boolean feeCleared;

    // FeeStructure info
    private UUID feeStructureId;
    private BigDecimal amount;
    private String currency;
    private boolean feeStructureActive;

    // Latest payment info (nullable)
    private LatestPayment latestPayment;

    @Getter @Setter
    @AllArgsConstructor @NoArgsConstructor
    @Builder
    public static class LatestPayment {
        private UUID paymentId;
        private PaymentStatus status;
        private BigDecimal amount;
        private String currency;
        private String provider; // SIMULATED / RAZORPAY / STRIPE
        private String orderId;
        private String paymentIdRef;
        private Instant paidAt;
        private Instant createdAt;
    }
}