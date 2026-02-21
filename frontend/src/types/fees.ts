export type UUID = string;

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface StudentFeeSummaryResponse {
  academicYearId: UUID;
  academicYearName: string;

  classRoomId: UUID;
  classRoomName: string;

  feeCleared: boolean;

  feeStructureId: UUID;
  amount: string;     // BigDecimal from backend commonly arrives as string
  currency: string;
  feeStructureActive: boolean;

  latestPayment?: {
    paymentId: UUID;
    status: PaymentStatus;
    amount: string;
    currency: string;
    provider: string;
    orderId?: string;
    paymentIdRef?: string;
    paidAt?: string;
    createdAt?: string;
  } | null;
}

export interface SimulateFeePaymentRequest {
  feeStructureId: UUID;
}

export interface SimulateFeePaymentResponse {
  status: PaymentStatus; // your backend response may differ; adjust when needed
  message?: string;
}