package com.edumanagepro.dto.response;

import java.time.Instant;
import java.util.UUID;

public record VerifyRazorpayPaymentResponse(
        UUID feePaymentId,
        String status,
        Instant paidAt
) {}