import { http } from "../lib/http";
import type {
  TeacherAttendanceSubject,
  AttendanceSessionSummary,
  EnrolledStudent,
  TakeAttendanceRequest,
} from "../types/attendance";

export const teacherAttendanceApi = {
  async listSubjects(): Promise<TeacherAttendanceSubject[]> {
    const res = await http.get("/teacher/attendance/subjects");
    return res.data;
  },

  async listSessions(subjectId: string): Promise<AttendanceSessionSummary[]> {
    const res = await http.get(`/teacher/attendance/subjects/${subjectId}/sessions`);
    return res.data;
  },

  async listStudents(subjectId: string): Promise<EnrolledStudent[]> {
    const res = await http.get(`/teacher/attendance/subjects/${subjectId}/students`);
    return res.data;
  },

  async takeAttendance(subjectId: string, req: TakeAttendanceRequest): Promise<AttendanceSessionSummary> {
    const res = await http.post(`/teacher/attendance/subjects/${subjectId}/sessions`, req);
    return res.data;
  },
};