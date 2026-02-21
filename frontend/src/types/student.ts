export type UUID = string;

export type MyClass = {
  academicYearId : UUID;
  academicYearName : String;

  classRoomId : UUID;
  classRoomName : String;
  feeCleared : boolean;
  subjects : SubjectSummary[];
};

export type SubjectSummary = {
  subjectId: UUID;
  subjectName: string;
  description?: string;
  thumbnailUrl?: string | null;
  teacherId: string;
  teacherName: string;
  teacherProfilePhotoUrl: string;
};

export type SubjectDetail = SubjectSummary;

export type Module = {
  id: UUID;
  title: string;
  description?: string;
};

export type ContentType = "VIDEO" | "PDF";

export type ContentItem = {
  id: string;
  moduleId: string;
  title: string;
  description?: string;
  type: ContentType;
  objectKey: string;
};

export interface ContentAccessUrlResponse {
  contentItem: ContentItem;
  url: string;
  expiresInMinutes: number; // int maps to number
}

export type Announcement = {
  id: UUID;
  title: string;
  message: string;
  createdAtISO: string;
};

export type StudentMe = {
  id: UUID;
  name: string;
  email: string;
  profilePhotoKey?: string | null;
};

export interface SubjectResponse {
  id: string;
  name: string;
  description: string;
  thumbnailUrl?: string;
  teacherId: string;
  teacherName: string;
  teacherProfileUrl?: string;
}

export interface ModuleResponse {
  id: string;
  title: string;
  description?: string;
  subjectId: string;
}

export interface SubjectDetailsWithModulesResponse {
  id: string;
  name: string;
  description: string;
  thumbnailUrl?: string;
  teacherId: string;
  teacherName: string;
  teacherProfileUrl?: string;
  modules: ModuleResponse[];
}
