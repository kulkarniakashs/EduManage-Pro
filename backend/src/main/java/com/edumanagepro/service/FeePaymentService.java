package com.edumanagepro.service;

import com.edumanagepro.dto.request.SimulateFeePaymentRequest;
import com.edumanagepro.dto.response.SimulateFeePaymentResponse;
import com.edumanagepro.dto.response.StudentFeeSummaryResponse;
import com.edumanagepro.entity.*;
import com.edumanagepro.entity.enums.*;
import com.edumanagepro.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FeePaymentService {

    private final EnrollmentRepository enrollmentRepository;
    private final FeeStructureRepository feeStructureRepository;
    private final FeePaymentRepository feePaymentRepository;


    public StudentFeeSummaryResponse getSummary(UUID studentId) {
        Enrollment e = enrollmentRepository
                .findFirstByStudentIdAndStatusOrderByCreatedAtDesc(studentId, EnrollmentStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("Active enrollment not found"));

        FeeStructure fs = feeStructureRepository
                .findByAcademicYearIdAndClassRoomIdAndIsActiveTrue(
                        e.getAcademicYear().getId(),
                        e.getClassRoom().getId()
                )
                .orElseThrow(() -> new RuntimeException("Fee structure not configured for your class"));

        var latestOpt = feePaymentRepository.findFirstByStudentIdAndAcademicYearIdAndClassRoomIdOrderByCreatedAtDesc(
                studentId, e.getAcademicYear().getId(), e.getClassRoom().getId()
        );

        StudentFeeSummaryResponse.LatestPayment latest = latestOpt.map(p ->
                StudentFeeSummaryResponse.LatestPayment.builder()
                        .paymentId(p.getId())
                        .status(p.getStatus())
                        .amount(p.getAmount())
                        .currency(fs.getCurrency())
                        .provider(p.getProvider())
                        .orderId(p.getOrderId())
                        .paymentIdRef(p.getPaymentId())
                        .paidAt(p.getPaidAt())
                        .createdAt(p.getCreatedAt())
                        .build()
        ).orElse(null);

        return StudentFeeSummaryResponse.builder()
                .academicYearId(e.getAcademicYear().getId())
                .academicYearName(e.getAcademicYear().getName())
                .classRoomId(e.getClassRoom().getId())
                .classRoomName(e.getClassRoom().getName())
                .feeCleared(Boolean.TRUE.equals(e.getFeeCleared()))
                .feeStructureId(fs.getId())
                .amount(fs.getAmount())
                .currency(fs.getCurrency())
                .feeStructureActive(fs.isActive())
                .latestPayment(latest)
                .build();
    }

    @Transactional
    public SimulateFeePaymentResponse simulatePay(UUID studentId, SimulateFeePaymentRequest req) {

        Enrollment enr = enrollmentRepository
                .findByStudentIdAndAcademicYearId(studentId, req.getAcademicYearId())
                .orElseThrow(() -> new RuntimeException("Not enrolled in this academic year"));

        if (enr.getStatus() != EnrollmentStatus.ACTIVE)
            throw new RuntimeException("Enrollment not active");

        if (!enr.getClassRoom().getId().equals(req.getClassRoomId()))
            throw new RuntimeException("Invalid class");

        FeeStructure fs = feeStructureRepository
                .findByAcademicYearIdAndClassRoomId(req.getAcademicYearId(), req.getClassRoomId())
                .orElseThrow(() -> new RuntimeException("Fee not configured"));

        FeePayment payment = new FeePayment();
        payment.setStudent(enr.getStudent());
        payment.setAcademicYear(enr.getAcademicYear());
        payment.setClassRoom(enr.getClassRoom());
        payment.setFeeStructure(fs);
        payment.setAmount(fs.getAmount());
        payment.setProvider("SIMULATED");
        payment.setOrderId("SIM-" + UUID.randomUUID());
        payment.setPaymentId("SIM-PAY-" + UUID.randomUUID());
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setPaidAt(Instant.now());

        FeePayment saved = feePaymentRepository.save(payment);

        enr.setFeeCleared(true);
        enrollmentRepository.save(enr);

        return new SimulateFeePaymentResponse(
                saved.getId(),
                saved.getAmount(),
                fs.getCurrency(),
                saved.getStatus().name(),
                saved.getPaidAt()
        );
    }

}
