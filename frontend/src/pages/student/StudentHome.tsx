import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { studentApi } from "../../api/studentApi";
import type { SubjectSummary } from "../../types/student";
import { Avatar } from "../../components/student/Avatar";
import { Card } from "../../components/student/Card";
import { Skeleton } from "../../components/student/Skeleton";
import { EmptyState } from "../../components/student/EmptyState";

function colorFromId(id: string) {
  const colors = [
    "bg-indigo-100",
    "bg-emerald-100",
    "bg-sky-100",
    "bg-rose-100",
    "bg-amber-100",
    "bg-violet-100",
  ];
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  return colors[sum % colors.length];
}

// function SubjectCard({
//   s,
//   onClick,
// }: {
//   s: SubjectSummary;
//   onClick: () => void;
// }) {
//   const fallback = useMemo(() => colorFromId(s.id), [s.id]);

//   return (
//     <button
//       onClick={onClick}
//       className="text-left"
//       style={{ width: "100%" }}
//     >
//       <Card className="overflow-hidden hover:shadow-md transition-shadow">
//         <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr]">
//           <div className={["h-28 sm:h-full", fallback].join(" ")}>
//             {s.thumbnailUrl ? (
//               <img
//                 src={s.thumbnailUrl}
//                 alt={s.name}
//                 className="h-full w-full object-cover"
//               />
//             ) : null}
//           </div>

//           <div>
//             <CardHeader className="pb-2">
//               <div className="flex items-start justify-between gap-3">
//                 <div className="min-w-0">
//                   <div className="text-slate-900 font-semibold text-lg">
//                     {s.name}
//                   </div>
//                   {s.description ? (
//                     <div className="mt-1 text-sm text-slate-600">
//                       {s.description}
//                     </div>
//                   ) : null}
//                 </div>
//               </div>
//             </CardHeader>

//             <CardContent className="pt-0">
//               <div className="flex items-center gap-2 text-sm text-slate-700">
//                 <Avatar
//                   name={s.teacher.name}
//                   src={s.teacher.profilePhotoUrl || undefined}
//                   size={34}
//                 />
//                 <div className="leading-tight">
//                   <div className="font-medium">{s.teacher.name}</div>
//                   <div className="text-xs text-slate-500">Teacher</div>
//                 </div>
//               </div>

//               <div className="mt-3 text-xs text-slate-500">
//                 Click to view modules & content
//               </div>
//             </CardContent>
//           </div>
//         </div>
//       </Card>
//     </button>
//   );
// }


function SubjectCard({
  s,
  onClick,
}: {
  s: SubjectSummary;
  onClick: () => void;
}) {
  const fallback = useMemo(() => colorFromId(s.subjectId), [s.subjectId]);

  return (
    <button onClick={onClick} className="w-full text-left">
      <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
        {/* Thumbnail */}
        <div className={["h-32 w-full", fallback].join(" ")}>
          {s.thumbnailUrl ? (
            <img
              src={`${import.meta.env.VITE_APP_BUCKET}/${s.thumbnailUrl}`}
              alt={s.subjectName}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full p-4 flex items-end">
              <div className="text-slate-700/80 font-semibold text-sm">
                {s.subjectName}
              </div>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-slate-900 font-semibold text-base truncate">
                {s.subjectName}
              </div>

              {s.description ? (
                <div className="mt-1 text-sm text-slate-600 line-clamp-2">
                  {s.description}
                </div>
              ) : (
                <div className="mt-1 text-sm text-slate-400">
                  No description
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Avatar
              name={s.teacherName}
              src={s.teacherProfilePhotoUrl || undefined}
              size={32}
            />
            <div className="min-w-0">
              <div className="text-sm font-medium text-slate-800 truncate">
                {s.teacherName}
              </div>
              <div className="text-xs text-slate-500">Teacher</div>
            </div>
          </div>

          <div className="mt-4 text-xs text-slate-500">
            View modules & content →
          </div>
        </div>
      </Card>
    </button>
  );
}

export function StudentHome() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<SubjectSummary[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await studentApi.listSubjects();
        setSubjects(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return subjects;
    return subjects.filter(
      (s) =>
        s.subjectName.toLowerCase().includes(term) ||
        (s.description ?? "").toLowerCase().includes(term) ||
        s.teacherName.toLowerCase().includes(term)
    );
  }, [q, subjects]);

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-2xl font-bold text-slate-900">Your Subjects</div>
          <div className="text-slate-600 text-sm">
            Open a subject to view modules and content (Video/PDF).
          </div>
        </div>

        <div className="w-full sm:w-80">
          <label className="text-xs text-slate-600">Search</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search subject / teacher…"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        {loading ? (
          <>
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </>
        ) : filtered.length === 0 ? (
          <EmptyState title="No subjects found" hint="Try a different search." />
        ) : (
          filtered.map((s) => (
            <SubjectCard
              key={s.subjectId}
              s={s}
              onClick={() => nav(`/student/subject/${s.subjectId}`)}
            />
          ))
        )}
      </div>
    </div>
  );
}