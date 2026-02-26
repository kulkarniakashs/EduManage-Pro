package com.edumanagepro.service;

import com.edumanagepro.dto.request.CreateRazorpayOrderRequest;
import com.edumanagepro.dto.request.VerifyRazorpayPaymentRequest;
import com.edumanagepro.dto.response.CreateRazorpayOrderResponse;
import com.edumanagepro.dto.response.StudentFeeSummaryResponse;
import com.edumanagepro.dto.response.VerifyRazorpayPaymentResponse;
import com.edumanagepro.entity.*;
import com.edumanagepro.entity.enums.*;
import com.edumanagepro.repository.*;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.HexFormat;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FeePaymentService {

    private final EnrollmentRepository enrollmentRepository;
    private final FeeStructureRepository feeStructureRepository;
    private final FeePaymentRepository feePaymentRepository;

    @Value("${razorpay.keyId}")
    private String razorpayKeyId;

    @Value("${razorpay.keySecret}")
    private String razorpayKeySecret;

    @Value("${razorpay.companyName:EduManage Pro}")
    private String companyName;

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

    // -------- Razorpay --------

    @Transactional
    public CreateRazorpayOrderResponse createRazorpayOrder(UUID studentId, CreateRazorpayOrderRequest req) {

        Enrollment enr = enrollmentRepository
                .findByStudentIdAndAcademicYearId(studentId, req.getAcademicYearId())
                .orElseThrow(() -> new RuntimeException("Not enrolled in this academic year"));

        if (enr.getStatus() != EnrollmentStatus.ACTIVE) throw new RuntimeException("Enrollment not active");
        if (!enr.getClassRoom().getId().equals(req.getClassRoomId())) throw new RuntimeException("Invalid class");

        FeeStructure fs = feeStructureRepository
                .findByAcademicYearIdAndClassRoomId(req.getAcademicYearId(), req.getClassRoomId())
                .orElseThrow(() -> new RuntimeException("Fee not configured"));

        if (!fs.isActive()) throw new RuntimeException("Fee structure is inactive");

        if (enr.getFeeCleared()) {
            throw new RuntimeException("Fees already cleared");
        }

        // amount in paise (INR subunits)
        long amountSubunits = fs.getAmount().multiply(BigDecimal.valueOf(100)).longValueExact();

        try {
            RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject orderReq = new JSONObject();
            orderReq.put("amount", amountSubunits);
            orderReq.put("currency", fs.getCurrency()); // typically "INR"
            orderReq.put("receipt", "FEE-" + enr.getId());

            JSONObject notes = new JSONObject();
            notes.put("studentId", studentId.toString());
            notes.put("academicYearId", enr.getAcademicYear().getId().toString());
            notes.put("classRoomId", enr.getClassRoom().getId().toString());
            orderReq.put("notes", notes);

            Order order = client.orders.create(orderReq);
            String razorpayOrderId = order.get("id");

            // Save PENDING payment row
            FeePayment payment = new FeePayment();
            payment.setStudent(enr.getStudent());
            payment.setAcademicYear(enr.getAcademicYear());
            payment.setClassRoom(enr.getClassRoom());
            payment.setFeeStructure(fs);
            payment.setAmount(fs.getAmount());
            payment.setProvider("RAZORPAY");
            payment.setOrderId(razorpayOrderId);
            payment.setStatus(PaymentStatus.PENDING);

            FeePayment saved = feePaymentRepository.save(payment);

            return new CreateRazorpayOrderResponse(
                    saved.getId(),
                    razorpayOrderId,
                    fs.getAmount(),
                    fs.getCurrency(),
                    razorpayKeyId
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to create Razorpay order: " + e.getMessage());
        }
    }

    @Transactional
    public VerifyRazorpayPaymentResponse verifyRazorpayPayment(UUID studentId, VerifyRazorpayPaymentRequest req) {

        FeePayment payment = feePaymentRepository
                .findByOrderId(req.getRazorpayOrderId())
                .orElseThrow(() -> new RuntimeException("Payment record not found for order"));

        if (!payment.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("Forbidden");
        }

        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            return new VerifyRazorpayPaymentResponse(payment.getId(), payment.getStatus().name(), payment.getPaidAt());
        }

        // Verify signature: HMAC_SHA256(order_id + "|" + payment_id, secret) :contentReference[oaicite:2]{index=2}
        String payload = req.getRazorpayOrderId() + "|" + req.getRazorpayPaymentId();
        String expected = hmacSha256Hex(payload, razorpayKeySecret);

        if (!expected.equals(req.getRazorpaySignature())) {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setSignature(req.getRazorpaySignature());
            feePaymentRepository.save(payment);
            throw new RuntimeException("Invalid payment signature");
        }

        // Mark payment SUCCESS
        payment.setPaymentId(req.getRazorpayPaymentId());
        payment.setSignature(req.getRazorpaySignature());
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setPaidAt(Instant.now());
        feePaymentRepository.save(payment);

        // Mark enrollment fee cleared
        Enrollment enr = enrollmentRepository
                .findByStudentIdAndAcademicYearId(studentId, payment.getAcademicYear().getId())
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        enr.setFeeCleared(true);
        enrollmentRepository.save(enr);

        return new VerifyRazorpayPaymentResponse(payment.getId(), payment.getStatus().name(), payment.getPaidAt());
    }

    private static String hmacSha256Hex(String data, String secret) {
        try {
            Mac sha256 = Mac.getInstance("HmacSHA256");
            sha256.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] hash = sha256.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            throw new RuntimeException("HMAC generation failed");
        }
    }
}