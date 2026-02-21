import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { teacherApi } from "../../api/teacherApi";
import type { TeacherSubject } from "../../types/teacher";
import { Card } from "../../components/student/Card";
import { Skeleton } from "../../components/Skeleton";
import { EmptyState } from "../../components/EmptyState";

function colorFromId(id: string) {
  const colors = ["bg-indigo-100","bg-emerald-100","bg-sky-100","bg-rose-100","bg-amber-100","bg-violet-100"];
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  return colors[sum % colors.length];
}

function SubjectTile({ s, onClick }: { s: TeacherSubject; onClick: () => void }) {
  const fallback = useMemo(() => colorFromId(s.subjectId), [s.subjectId]);

  return (
    <button onClick={onClick} className="w-full text-left">
      <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
        <div className={["h-32 w-full", fallback].join(" ")}>
          {s.thumbnailUrl ? (
            <img
              src={`${import.meta.env.VITE_APP_BUCKET}/${s.thumbnailUrl}`}
              className="h-full w-full object-cover"
              alt={s.subjectName}
            />
          ) : (
            <div className="h-full w-full p-4 flex items-end">
              <div className="text-slate-950 font-semibold text-xl">{s.subjectName}</div>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="text-slate-900 font-semibold truncate text-2xl">{s.subjectName}</div>
          <div className="text-slate-500 font-semibold truncate text-sm">{s.description}</div>
          <div className="mt-2 text-xs text-slate-500">Manage modules & uploads →</div>
        </div>
      </Card>
    </button>
  );
}

export function TeacherHome() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<TeacherSubject[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setItems(await teacherApi.mySubjects());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter((s) => s.subjectName.toLowerCase().includes(term));
  }, [q, items]);

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-2xl font-bold text-slate-900">Your Subjects</div>
          <div className="text-slate-600 text-sm">Create modules & upload content for students.</div>
        </div>

        <div className="w-full sm:w-80">
          <label className="text-xs text-slate-600">Search</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
            placeholder="Search subject…"
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2">
        {loading ? (
          <>
            <Skeleton className="h-60" />
            <Skeleton className="h-60" />
            <Skeleton className="h-60" />
            <Skeleton className="h-60" />
          </>
        ) : filtered.length === 0 ? (
          <div className="col-span-2 sm:col-span-3 lg:col-span-4">
            <EmptyState title="No subjects assigned" hint="Ask admin to assign you subjects." />
          </div>
        ) : (
          filtered.map((s) => (
            <SubjectTile key={s.subjectId} s={s} onClick={() => nav(`/teacher/subject/${s.subjectId}`)} />
          ))
        )}
      </div>
    </div>
  );
}