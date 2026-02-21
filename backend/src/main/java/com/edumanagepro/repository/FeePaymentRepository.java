package com.edumanagepro.repository;

import com.edumanagepro.entity.FeePayment;
import com.edumanagepro.entity.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FeePaymentRepository extends JpaRepository<FeePayment, UUID> {

    boolean existsByStudentIdAndAcademicYearIdAndClassRoomIdAndStatus(
            UUID studentId, UUID academicYearId, UUID classRoomId, PaymentStatus status
    );

    Optional<FeePayment> findTopByStudentIdAndAcademicYearIdAndClassRoomIdOrderByCreatedAtDesc(
            UUID studentId, UUID academicYearId, UUID classRoomId
    );

    List<FeePayment> findByStudentIdAndAcademicYearId(UUID studentId, UUID academicYearId);

    Optional<FeePayment> findByOrderId(String orderId);

    Optional<FeePayment> findFirstByStudentIdAndAcademicYearIdAndClassRoomIdOrderByCreatedAtDesc(
            UUID studentId, UUID academicYearId, UUID classRoomId
    );
}
