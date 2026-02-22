import { http } from "../lib/http";
import type {
  AdminAcademicYear,
  AdminClassRoom,
  AdminFeeStructure,
  AdminSubjectWithTeacher,
  AdminTeacherOption,
  AssignTeacherRequest,
  CreateAcademicYearRequest,
  CreateClassRoomRequest,
  CreateFeeStructureRequest,
  CreateSubjectRequest,
} from "../types/admin";

export const adminApi = {
  // queries
  async listAcademicYears(): Promise<AdminAcademicYear[]> {
    const res = await http.get("/admin/academic-years");
    return res.data;
  },
  async latestAcademicYear(): Promise<AdminAcademicYear> {
    const res = await http.get("/admin/academic-years/latest");
    return res.data;
  },
  async listClassRooms(academicYearId: string): Promise<AdminClassRoom[]> {
    const res = await http.get(`/admin/academic-years/${academicYearId}/classrooms`);
    return res.data;
  },
  async listSubjects(academicYearId: string, classRoomId: string): Promise<AdminSubjectWithTeacher[]> {
    const res = await http.get(`/admin/academic-years/${academicYearId}/classrooms/${classRoomId}/subjects`);
    return res.data;
  },
  async listTeachers(): Promise<AdminTeacherOption[]> {
    const res = await http.get("/admin/teachers");
    return res.data;
  },
  async getFeeStructure(academicYearId: string, classRoomId: string): Promise<AdminFeeStructure> {
    const res = await http.get(`/admin/fee-structures?academicYearId=${academicYearId}&classRoomId=${classRoomId}`);
    return res.data;
  },

  // existing AdminController creates
  async createAcademicYear(req: CreateAcademicYearRequest) {
    const res = await http.post("/admin/academic-years", req);
    return res.data;
  },
  async createClassRoom(req: CreateClassRoomRequest) {
    const res = await http.post("/admin/classrooms", req);
    return res.data;
  },
  async createSubject(req: CreateSubjectRequest) {
    const res = await http.post("/admin/subjects", req);
    return res.data;
  },
  async assignTeacher(subjectId: string, req: AssignTeacherRequest) {
    const res = await http.put(`/admin/subjects/${subjectId}/assign-teacher`, req);
    return res.data;
  },
  async setFeeStructure(req: CreateFeeStructureRequest) {
    const res = await http.post("/admin/fee-structures", req);
    return res.data;
  },
};