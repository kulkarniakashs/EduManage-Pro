package com.edumanagepro.entity;

import com.edumanagepro.entity.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "fee_payments",
        indexes = {
                @Index(name = "idx_fee_payment_student", columnList = "student_id"),
                @Index(name = "idx_fee_payment_status", columnList = "status"),
                @Index(name = "idx_fee_payment_lookup", columnList = "student_id,academic_year_id,class_room_id,status")
        })
@Getter @Setter
public class FeePayment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "academic_year_id", nullable = false)
    private AcademicYear academicYear;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "class_room_id", nullable = false)
    private ClassRoom classRoom;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "fee_structure_id", nullable = false)
    private FeeStructure feeStructure;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column(nullable = false, length = 30)
    private String provider; // SIMULATED / RAZORPAY / STRIPE

    private String orderId;
    private String paymentId;

    @Column(length = 400)
    private String signature;

    private Instant paidAt;
}
