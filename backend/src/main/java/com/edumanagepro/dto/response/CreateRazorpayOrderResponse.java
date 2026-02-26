package com.edumanagepro.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

public record CreateRazorpayOrderResponse(
        UUID feePaymentId,
        String razorpayOrderId,
        BigDecimal amount,
        String currency,
        String razorpayKeyId
) {}