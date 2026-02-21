import { useEffect, useState } from "react";
import { studentApi } from "../../api/studentApi";
import type { Announcement } from "../../types/student";
import { Card, CardContent, CardHeader } from "../../components/student/Card";
import { EmptyState } from "../../components/student/EmptyState";
import { Skeleton } from "../../components/student/Skeleton";

function fmt(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export function StudentAnnouncements() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Announcement[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await studentApi.listAnnouncements();
        // newest first
        setItems([...data].sort((a, b) => b.createdAtISO.localeCompare(a.createdAtISO)));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <div className="text-2xl font-bold text-slate-900">Announcements</div>
      <div className="text-sm text-slate-600">Class-wide updates (not per subject).</div>

      <div className="mt-5 grid gap-3">
        {loading ? (
          <>
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </>
        ) : items.length === 0 ? (
          <EmptyState title="No announcements" hint="You're all caught up." />
        ) : (
          items.map((a) => (
            <Card key={a.id}>
              <CardHeader className="pb-2">
                <div className="font-semibold text-slate-900">{a.title}</div>
                <div className="text-xs text-slate-500">{fmt(a.createdAtISO)}</div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-sm text-slate-700">{a.message}</div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}