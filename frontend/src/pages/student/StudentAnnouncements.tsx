import { useEffect, useMemo, useState } from "react";
import { studentApi } from "../../api/studentApi";
import type { StudentAnnouncementResponse } from "../../types/announcements";
import { Card } from "../../components/student/Card";
import { Skeleton } from "../../components/Skeleton";
import { EmptyState } from "../../components/EmptyState";

function fmt(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function timeAgo(iso: string) {
  const t = new Date(iso).getTime();
  const diff = Date.now() - t;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function AnnouncementCard({ a }: { a: StudentAnnouncementResponse }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex gap-4 p-4">
        {/* Left accent */}
        <div className="mt-1 h-10 w-10 shrink-0 rounded-2xl bg-slate-100 grid place-items-center text-slate-700">
          🔔
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="font-semibold text-slate-900 truncate">{a.title}</div>
              <div className="mt-1 text-xs text-slate-500">
                By <span className="font-medium text-slate-700">{a.createdByAdminName}</span>
                <span className="mx-2 text-slate-300">•</span>
                <span title={fmt(a.publishAt)}>{timeAgo(a.publishAt)}</span>
              </div>
            </div>

            <span className="shrink-0 inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
              Published
            </span>
          </div>

          <div className="mt-3 whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">
            {a.message}
          </div>

          {a.expiresAt ? (
            <div className="mt-3 text-xs text-slate-500">
              Expires: <span className="font-medium text-slate-700">{fmt(a.expiresAt)}</span>
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

export function StudentAnnouncements() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<StudentAnnouncementResponse[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await studentApi.listAnnouncements();
        setItems([...data].sort((a, b) => b.publishAt.localeCompare(a.publishAt)));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (a) =>
        a.title.toLowerCase().includes(term) ||
        a.message.toLowerCase().includes(term) ||
        (a.createdByAdminName ?? "").toLowerCase().includes(term)
    );
  }, [q, items]);

  return (
    <div className="grid gap-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-2xl font-bold text-slate-900">Announcements</div>
          <div className="mt-1 text-sm text-slate-600">
            Class-wide updates from Admin (not per subject).
          </div>
        </div>

        <div className="w-full sm:w-80">
          <label className="text-xs text-slate-600">Search</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search announcements..."
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="grid gap-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No announcements" hint="You're all caught up." />
      ) : (
        <div className="grid gap-3">
          {filtered.map((a) => (
            <AnnouncementCard key={a.id} a={a} />
          ))}
        </div>
      )}
    </div>
  );
}