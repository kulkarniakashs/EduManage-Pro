export type UUID = string;

export type ContentType = "VIDEO" | "PDF";

export type TeacherSubject = {
  subjectId: UUID;
  subjectName: string;
  thumbnailUrl?: string | null;
  description : string
};

export type Module = {
  id: UUID;
  title: string;
  description?: string | null;
  createdAt: string;
};

export type ContentItem = {
  id: UUID;
  moduleId: UUID;
  title: string;
  description?: string | null;
  type: ContentType;
  objectKey: string;

  uploadStatus: boolean;      // backend currently sends boolean
  published: boolean;
  protectedContent: boolean;
};

export type CreateModuleRequest = {
  title: string;
  description?: string;
};

export type InitContentUploadRequest = {
  title: string;
  description?: string;
  type: ContentType;
  contentType: string; // "video/mp4" / "application/pdf"
  published: boolean;
  protectedContent: boolean;
};

export type InitContentUploadResponse = {
  contentItem: ContentItem;
  uploadUrl: string;
  expiresInMinutes: number;
};

export type ConfirmUploadResponse = {
  contentItem: ContentItem;
};

export type PresignUploadResponse = {
  objectKey: string;
  uploadUrl: string;
  contentType: string;
  expiresInMinutes: number;
};

export type ConfirmObjectKeyRequest = {
  objectKey: string;
};