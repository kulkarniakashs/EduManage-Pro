export type UUID = string;

export type AdminAcademicYear = {
  id: UUID;
  name: string;
  active: boolean;
};

export type AdminClassRoom = {
  id: UUID;
  name: string;
};

export type AdminTeacherOption = {
  id: UUID;
  name: string;
  email: string;
  profilePhotoKey?: string | null;
};

export type AdminSubjectWithTeacher = {
  subjectId: UUID;
  subjectName: string;
  description?: string | null;
  thumbnailUrl?: string | null;

  teacherId?: UUID | null;
  teacherName?: string | null;
  teacherProfilePhotoKey?: string | null;
};

export type AdminFeeStructure = {
  id?: UUID | null;
  academicYearId: UUID;
  classRoomId: UUID;
  amount?: string | null; // BigDecimal often comes as string
  currency: string;
  active: boolean;
};

// Requests
export type CreateClassRoomRequest = { academicYearId: UUID; name: string };
export type CreateAcademicYearRequest = { name: string; active: boolean };

export type CreateSubjectRequest = {
  academicYearId: UUID;
  classRoomId: UUID;
  name: string;
  description?: string;
  teacherId : UUID
};

export type AssignTeacherRequest = { teacherId: UUID };

export type CreateFeeStructureRequest = {
  academicYearId: UUID;
  classRoomId: UUID;
  amount: number;
  currency: string; // "INR"
  active: boolean;
};

export type AdminStudentOption = {
  id: string;
  name: string;
  email: string;
  profilePhotoKey?: string | null;
};

export type CreateEnrollmentRequest = {
  academicYearId: string;
  classRoomId: string;
  studentId: string;
};