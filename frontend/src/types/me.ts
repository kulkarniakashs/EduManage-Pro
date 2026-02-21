export type UUID = string;

export type UserRole = "ADMIN" | "TEACHER" | "STUDENT";

export interface MeResponse {
  id: UUID;
  name: string;
  role: UserRole;
  email : string
  profilePhotoKey?: string | null;
}

export interface PresignUploadResponse {
  uploadUrl: string;
  objectKey: string;
}

export interface ConfirmObjectKeyRequest {
  objectKey: string;
}

export interface UpdateProfileRequest {
  fullName: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}