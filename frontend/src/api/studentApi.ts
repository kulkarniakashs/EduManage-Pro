import { http } from "../lib/http";
import type {
  Announcement,
  ContentAccessUrlResponse,
  ContentItem,
  Module,
  StudentMe,
  SubjectDetailsWithModulesResponse,
  SubjectSummary,
  UUID,
} from "../types/student";

// ✅ Dummy delay helper
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// const SUBJECTS: SubjectSummary[] = [
//   {
//     id: "s-101",
//     name: "Data Structures",
//     description: "Arrays, linked lists, stacks, queues, trees, and graphs.",
//     thumbnailUrl: null,
//     teacher: TEACHERS[0],
//   },
//   {
//     id: "s-102",
//     name: "DBMS",
//     description: "ER model, normalization, SQL queries, transactions.",
//     thumbnailUrl: null,
//     teacher: TEACHERS[1],
//   },
//   {
//     id: "s-103",
//     name: "Operating Systems",
//     description: "Processes, scheduling, memory, deadlocks, file systems.",
//     thumbnailUrl:
//       "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=800&q=60",
//     teacher: TEACHERS[0],
//   },
// ];

const MODULES_BY_SUBJECT: Record<UUID, Module[]> = {
  "s-101": [
    { id: "m-1", title: "Basics", description: "Complexity, arrays, pointers" },
    { id: "m-2", title: "Linked Lists", description: "SLL, DLL, operations" },
  ],
  "s-102": [
    { id: "m-3", title: "ER & Normalization", description: "1NF to BCNF" },
    { id: "m-4", title: "SQL", description: "Queries, joins, grouping" },
  ],
  "s-103": [
    { id: "m-5", title: "Processes", description: "PCB, states, scheduling" },
  ],
};



const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "a-1",
    title: "Unit Test Schedule",
    message: "Unit tests start next Monday. Check the timetable on the notice board.",
    createdAtISO: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "a-2",
    title: "Library Hours Updated",
    message: "Library will remain open till 7 PM from this week.",
    createdAtISO: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
  },
];

export const studentApi = {
  async me(): Promise<StudentMe> {
    const res = await http.get('/me')
    const data = res.data;
    console.log(data);
    return data as StudentMe;
  },

  async listSubjects(): Promise<SubjectSummary[]> {
    // await wait(450);
    const res = await http.get('/student/me/class')
    console.log(res.data);
    return res.data.subjects;
  },

  async getSubject(subjectId: UUID): Promise<SubjectDetailsWithModulesResponse> {
    const res = await http.get(`/student/subjects/${subjectId}`)
    console.log(res.data);
    return res.data;
  },

  async listModules(subjectId: UUID): Promise<Module[]> {
    await wait(350);
    return MODULES_BY_SUBJECT[subjectId] ?? [];
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

  async listAnnouncements(): Promise<Announcement[]> {
    await wait(400);
    return ANNOUNCEMENTS;
  },
};