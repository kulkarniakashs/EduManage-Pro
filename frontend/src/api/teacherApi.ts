import { http } from "../lib/http";
import type {
  ConfirmObjectKeyRequest,
  ConfirmUploadResponse,
  ContentItem,
  CreateModuleRequest,
  InitContentUploadRequest,
  InitContentUploadResponse,
  Module,
  PresignUploadResponse,
  TeacherSubject,
  UUID,
} from "../types/teacher";
import type { ContentAccessUrlResponse } from "../types/student";

export const teacherApi = {
  async mySubjects(): Promise<TeacherSubject[]> {
    const res = await http.get<TeacherSubject[]>("/teacher/me/subjects");
    return res.data;
  },

  async listModules(subjectId: UUID): Promise<Module[]> {
    const res = await http.get<Module[]>(`/teacher/subjects/${subjectId}/modules`);
    return res.data;
  },

  async createModule(subjectId: UUID, req: CreateModuleRequest): Promise<Module> {
    const res = await http.post<Module>(`/teacher/subjects/${subjectId}/modules`, req);
    return res.data;
  },

  async listModuleContent(moduleId: UUID): Promise<ContentItem[]> {
    const res = await http.get<ContentItem[]>(`/teacher/modules/${moduleId}/content-items`);
    return res.data;
  },

  async initUpload(moduleId: UUID, req: InitContentUploadRequest): Promise<InitContentUploadResponse> {
    const res = await http.post<InitContentUploadResponse>(
      `/teacher/modules/${moduleId}/content-items/init-upload`,
      req
    );
    return res.data;
  },

  async confirmUpload(contentItemId: UUID): Promise<ConfirmUploadResponse> {
    const res = await http.put<ConfirmUploadResponse>(
      `/teacher/content-items/${contentItemId}/confirm-upload`
    );
    return res.data;
  },

  async presignSubjectThumbnail(subjectId: UUID, contentType: string): Promise<PresignUploadResponse> {
    const res = await http.post<PresignUploadResponse>(
      `/teacher/subjects/${subjectId}/thumbnail/presign?contentType=${encodeURIComponent(contentType)}`
    );
    return res.data;
  },

  async confirmSubjectThumbnail(subjectId: UUID, req: ConfirmObjectKeyRequest): Promise<void> {
    await http.put(`/teacher/subjects/${subjectId}/thumbnail`, req);
  },

    async contentItemUrl(contentId : UUID) : Promise<ContentAccessUrlResponse>{
      const res = await http.get(`teacher/content-item/${contentId}`);
      console.log(res.data);
      return res.data;
    },
};