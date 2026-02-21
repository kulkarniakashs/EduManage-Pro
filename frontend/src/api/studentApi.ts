import { http } from "../lib/http";
import type {
  ContentAccessUrlResponse,
  ContentItem,
  MyClass,
  SubjectDetailsWithModulesResponse,
  UUID,
} from "../types/student";
import type { StudentAnnouncementResponse,  } from "../types/announcements";

import type { StudentFeeSummaryResponse, SimulateFeePaymentRequest, SimulateFeePaymentResponse } from "../types/fees";


export const studentApi = {
  async listSubjects(): Promise<MyClass> {
    const res = await http.get('/student/me/class')
    console.log(res.data);
    return res.data;
  },

  async getSubject(subjectId: UUID): Promise<SubjectDetailsWithModulesResponse> {
    const res = await http.get(`/student/subjects/${subjectId}`)
    console.log(res.data);
    return res.data;
  },

  // async listModules(subjectId: UUID): Promise<Module[]> {
  //   await wait(350);
  //   return MODULES_BY_SUBJECT[subjectId] ?? [];
  // },

  async listAnnouncements(): Promise<StudentAnnouncementResponse[]> {
    const res = await http.get<StudentAnnouncementResponse[]>("/student/announcements");
    console.log(res.data);
    return res.data;
  },

  async listModuleContent(subjectId : UUID,moduleId: UUID): Promise<ContentItem[]> {
    const res = await http.get(`student/subjects/${subjectId}/modules/${moduleId}/content-list`);
    return res.data;
  },


  async contentItemUrl(contentId : UUID) : Promise<ContentAccessUrlResponse>{
    const res = await http.get(`student/content-items/${contentId}/access-url`);
    console.log(res.data);
    return res.data;
  },

  async getFeeSummary(): Promise<StudentFeeSummaryResponse> {
    const res = await http.get<StudentFeeSummaryResponse>("/student/fees/summary");
    return res.data;
  },

  async simulatePay(req: SimulateFeePaymentRequest): Promise<SimulateFeePaymentResponse> {
    const res = await http.post<SimulateFeePaymentResponse>("/student/fees/simulate-pay", req);
    return res.data;
  },
};