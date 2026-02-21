export type UUID = string;

export interface StudentAnnouncementResponse {
  id: UUID;
  title: string;
  message: string;

  publishAt: string;   // Instant -> ISO string
  expiresAt?: string | null;

  createdByAdminId: UUID;
  createdByAdminName: string;

  createdAt: string;
}