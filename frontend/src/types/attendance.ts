export type UUID = string;

export type AttendanceStatus = "PRESENT" | "ABSENT";

export type TeacherAttendanceSubject = {
  subjectId: UUID;
  subjectName: string;
  classRoomName: string;
  academicYearName: string;
};

export type AttendanceSessionSummary = {
  sessionId: UUID;
  date: string; // YYYY-MM-DD
  totalStudents: number;
  presentStudents: number;
  absentStudents: number;
};

export type EnrolledStudent = {
  studentId: UUID;
  name: string;
  email: string;
  profilePhotoKey?: string | null;
};

export type TakeAttendanceRequest = {
  sessionDate: string; // YYYY-MM-DD
  records: { studentId: UUID; status: AttendanceStatus }[];
};

export type StudentSubjectAttendanceSummary = {
  subjectId: UUID;
  subjectName: string;
  teacherName: string;
  teacherProfilePhotoKey?: string | null;
  totalSessions: number;
  presentCount: number;
  percentage: number;
};

export type StudentAttendanceDay = {
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
};