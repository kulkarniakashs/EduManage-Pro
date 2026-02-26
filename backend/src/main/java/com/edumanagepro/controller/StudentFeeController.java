package com.edumanagepro.controller;

import com.edumanagepro.dto.request.CreateRazorpayOrderRequest;
import com.edumanagepro.dto.request.VerifyRazorpayPaymentRequest;
import com.edumanagepro.dto.response.CreateRazorpayOrderResponse;
import com.edumanagepro.dto.response.StudentFeeSummaryResponse;
import com.edumanagepro.dto.response.VerifyRazorpayPaymentResponse;
import com.edumanagepro.security.UserPrincipal;
import com.edumanagepro.service.FeePaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/student/fees")
public class StudentFeeController {

    private final FeePaymentService feePaymentService;

    @GetMapping("/summary")
    public StudentFeeSummaryResponse summary(@AuthenticationPrincipal UserPrincipal me) {
        return feePaymentService.getSummary(me.getId());
    }

    // 1) Create order (server computes amount from FeeStructure)
    @PostMapping("/razorpay/order")
    public CreateRazorpayOrderResponse createOrder(
            @AuthenticationPrincipal UserPrincipal me,
            @RequestBody CreateRazorpayOrderRequest req
    ) {
        return feePaymentService.createRazorpayOrder(me.getId(), req);
    }

    // 2) Verify payment signature and mark SUCCESS
    @PostMapping("/razorpay/verify")
    public VerifyRazorpayPaymentResponse verifyPayment(
            @AuthenticationPrincipal UserPrincipal me,
            @RequestBody VerifyRazorpayPaymentRequest req
    ) {
        return feePaymentService.verifyRazorpayPayment(me.getId(), req);
    }
}
