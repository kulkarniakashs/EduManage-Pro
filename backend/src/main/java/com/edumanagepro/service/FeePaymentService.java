package com.edumanagepro.service;

import com.edumanagepro.dto.request.SimulateFeePaymentRequest;
import com.edumanagepro.dto.response.SimulateFeePaymentResponse;
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
