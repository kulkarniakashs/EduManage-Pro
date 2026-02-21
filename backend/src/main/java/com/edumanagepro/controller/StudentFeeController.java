
package com.edumanagepro.controller;

import com.edumanagepro.dto.request.SimulateFeePaymentRequest;
import com.edumanagepro.dto.response.SimulateFeePaymentResponse;
import com.edumanagepro.dto.response.StudentFeeSummaryResponse;
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

    @PostMapping("/simulate-pay")
    public SimulateFeePaymentResponse simulatePay(
            @AuthenticationPrincipal UserPrincipal me,
            @RequestBody SimulateFeePaymentRequest req
    ) {
        return feePaymentService.simulatePay(me.getId(), req);
    }
}
