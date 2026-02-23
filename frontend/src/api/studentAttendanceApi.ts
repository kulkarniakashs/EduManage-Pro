import { http } from "../lib/http";
import type { StudentSubjectAttendanceSummary, StudentAttendanceDay } from "../types/attendance";

export const studentAttendanceApi = {
  async subjectSummary(): Promise<StudentSubjectAttendanceSummary[]> {
    const res = await http.get("/student/attendance/subjects");
    return res.data;
  },

  async calendar(subjectId: string, from?: string, to?: string): Promise<StudentAttendanceDay[]> {
    const qs = new URLSearchParams();
    if (from) qs.set("from", from);
    if (to) qs.set("to", to);
    const res = await http.get(`/student/attendance/subjects/${subjectId}/calendar?${qs.toString()}`);
    return res.data;
  },
};