import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { studentApi } from "../../api/studentApi";
import type { MyClass, SubjectSummary } from "../../types/student";
import { Avatar } from "../../components/Avatar";
import { Card } from "../../components/student/Card";
import { Skeleton } from "../../components/Skeleton";
import { EmptyState } from "../../components/EmptyState";

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

function LockBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
      <span className="text-xs">🔒</span>
      Fees pending
    </span>
  );
}

function SubjectCard({
  s,
  feeCleared,
  onAllowedClick,
}: {
  s: SubjectSummary;
  feeCleared: boolean;
  onAllowedClick: () => void;
}) {
  const fallback = useMemo(() => colorFromId(s.subjectId), [s.subjectId]);

  const handleClick = () => {
    if (!feeCleared) {
      alert("Fees not cleared. Please complete payment to unlock subject content.");
      return;
    }
    onAllowedClick();
  };

  return (
    <button onClick={handleClick} className="w-full text-left">
      <Card
        className={[
          "overflow-hidden transition-shadow h-full",
          feeCleared ? "hover:shadow-md" : "opacity-90",
        ].join(" ")}
      >
        {/* Thumbnail */}
        <div className={["h-32 w-full relative", fallback].join(" ")}>
          {s.thumbnailUrl ? (
            <img
              src={`${import.meta.env.VITE_APP_BUCKET}/${s.thumbnailUrl}`}
              alt={s.subjectName}
              className={[
                "h-full w-full object-cover",
                feeCleared ? "" : "grayscale",
              ].join(" ")}
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full p-4 flex items-end">
              <div className="text-slate-700/80 font-semibold text-sm">
                {s.subjectName}
              </div>
            </div>
          )}

          {/* Lock badge */}
          {!feeCleared ? (
            <div className="absolute left-3 top-3">
              <LockBadge />
            </div>
          ) : null}
        </div>

        {/* Details */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-slate-900 font-semibold text-base truncate">
                {s.subjectName}
              </div>

              {s.description ? (
                // If you still get line-clamp plugin error, replace with "truncate" or remove line-clamp
                <div className="mt-1 text-sm text-slate-600 line-clamp-2">
                  {s.description}
                </div>
              ) : (
                <div className="mt-1 text-sm text-slate-400">No description</div>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Avatar
              name={s.teacherName}
              src={s.teacherProfilePhotoUrl ? `${import.meta.env.VITE_APP_BUCKET}/${s.teacherProfilePhotoUrl}` : null}
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
            {feeCleared ? "View modules & content →" : "Pay fees to unlock →"}
          </div>
        </div>
      </Card>
    </button>
  );
}

export function StudentHome() {
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [myClass, setMyClass] = useState<MyClass | null>(null);
  const [subjects, setSubjects] = useState<SubjectSummary[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await studentApi.listSubjects(); // should return MyClass
        // data.feeCleared = false;
        setMyClass(data);
        setSubjects(data.subjects);
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

  const feeCleared = myClass?.feeCleared ?? true;

  return (
    <div>
      {/* Header + class info */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-2xl font-bold text-slate-900">Your Subjects</div>

          {myClass ? (
            <div className="mt-1 text-sm text-slate-600">
              <span className="font-medium text-slate-800">
                {myClass.classRoomName}
              </span>
              <span className="mx-2 text-slate-300">•</span>
              <span>{myClass.academicYearName}</span>
              {!feeCleared ? (
                <span className="ml-3 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                  🔒 Fees Pending
                </span>
              ) : (
                <span className="ml-3 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                  ✅ Fees Cleared
                </span>
              )}
            </div>
          ) : (
            <div className="text-slate-600 text-sm">
              Open a subject to view modules and content (Video/PDF).
            </div>
          )}
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

      {/* Grid */}
      <div className="mt-5 grid grid-cols-2 gap-4">
        {loading ? (
          <>
            <Skeleton className="h-60" />
            <Skeleton className="h-60" />
            <Skeleton className="h-60" />
            <Skeleton className="h-60" />
          </>
        ) : filtered.length === 0 ? (
          <div className="col-span-2 sm:col-span-3 lg:col-span-4">
            <EmptyState title="No subjects found" hint="Try a different search." />
          </div>
        ) : (
          filtered.map((s) => (
            <SubjectCard
              key={s.subjectId}
              s={s}
              feeCleared={feeCleared}
              onAllowedClick={() => nav(`/student/subject/${s.subjectId}`)}
            />
          ))
        )}
      </div>
    </div>
  );
}