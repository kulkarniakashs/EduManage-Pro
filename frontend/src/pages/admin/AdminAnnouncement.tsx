import { useEffect, useMemo, useState } from "react";
import { adminApi } from "../../api/adminApi";
import type { AdminAcademicYear, AdminClassRoom, AdminAnnouncement } from "../../types/admin";        

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export function AdminAnnouncementsPage() {
  const [years, setYears] = useState<AdminAcademicYear[]>([]);
  const [classes, setClasses] = useState<AdminClassRoom[]>([]);
  const [announcements, setAnnouncements] = useState<AdminAnnouncement[]>([]);

  const [yearId, setYearId] = useState<string>("");
  const [classId, setClassId] = useState<string>("");

  const [loadingYears, setLoadingYears] = useState(true);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [posting, setPosting] = useState(false);

  const canQuery = useMemo(() => Boolean(yearId && classId), [yearId, classId]);

  // 1) load academic years + default to latest
  useEffect(() => {
    (async () => {
      try {
        setLoadingYears(true);
        const [ys, latest] = await Promise.all([
          adminApi.listAcademicYears(),
          adminApi.latestAcademicYear(),
        ]);
        setYears(ys as any);
        setYearId((latest as any).id);
      } finally {
        setLoadingYears(false);
      }
    })();
  }, []);

  // 2) when year changes -> load classes + auto pick first class
  useEffect(() => {
    if (!yearId) return;
    (async () => {
      try {
        setLoadingClasses(true);
        setClasses([]);
        setClassId("");
        setAnnouncements([]);

        const cs = await adminApi.listClassRooms(yearId);
        setClasses(cs as any);
        if (cs.length > 0) setClassId(cs[0].id);
      } finally {
        setLoadingClasses(false);
      }
    })();
  }, [yearId]);

  // 3) when year+class selected -> load announcements
  useEffect(() => {
    if (!canQuery) return;
    (async () => {
      try {
        setLoadingAnnouncements(true);
        const list = await (adminApi as any).listAnnouncements(yearId, classId);
        setAnnouncements(list);
      } finally {
        setLoadingAnnouncements(false);
      }
    })();
  }, [canQuery, yearId, classId]);

  async function postAnnouncement() {
    if (!yearId || !classId) return;
    if (!title.trim() || !message.trim()) return;

    try {
      setPosting(true);
      await (adminApi as any).createAnnouncement({
        academicYearId: yearId,
        classRoomId: classId,
        title: title.trim(),
        message: message.trim(),
      });

      setTitle("");
      setMessage("");

      // refresh list
      const list = await (adminApi as any).listAnnouncements(yearId, classId);
      setAnnouncements(list);
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl p-2 max-h-full">
      <div className="mb-3">
        <h1 className="text-xl font-semibold text-slate-900">Announcements</h1>
        <p className="text-sm text-slate-600">
          Create announcements for a class and view previous announcements.
        </p>
      </div>

      {/* filters */}
      <div className="mb-3 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <label className="text-xs text-slate-600">Academic Year</label>
          <select
            value={yearId}
            onChange={(e) => setYearId(e.target.value)}
            disabled={loadingYears}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
          >
            {loadingYears ? (
              <option>Loading...</option>
            ) : (
              years.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.name} {y.active ? "• Active" : ""}
                </option>
              ))
            )}
          </select>
          <p className="mt-2 text-xs text-slate-500">
            Default: latest academic year.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <label className="text-xs text-slate-600">Class</label>
          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            disabled={loadingClasses || !yearId}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
          >
            {loadingClasses ? (
              <option>Loading...</option>
            ) : classes.length === 0 ? (
              <option value="">No classes</option>
            ) : (
              classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))
            )}
          </select>
          <p className="mt-2 text-xs text-slate-500">
            Select a class to view and create announcements.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5 h-full">
        {/* create */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-slate-900">Create Announcement</h2>

            <label className="mt-3 block text-xs text-slate-600">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Unit Test on Monday"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
            />

            <label className="mt-3 block text-xs text-slate-600">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write the announcement message..."
              rows={5}
              className="mt-1 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
            />

            <button
              onClick={postAnnouncement}
              disabled={!canQuery || posting || !title.trim() || !message.trim()}
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {posting ? "Posting..." : "Post Announcement"}
            </button>

            {!canQuery && (
              <p className="mt-3 text-xs text-amber-700">
                Select academic year and class first.
              </p>
            )}
          </div>
        </div>

        {/* list */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Previous Announcements
              </h2>
              {loadingAnnouncements && (
                <span className="text-xs text-slate-500">Loading...</span>
              )}
            </div>

            {!canQuery ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-600">
                Select a class to view announcements.
              </div>
            ) : announcements.length === 0 && !loadingAnnouncements ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-600">
                No announcements yet for this class.
              </div>
            ) : (
              <div className="space-y-3 max-h-full overflow-auto">
                {announcements.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          {a.title}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {fmtDate(a.createdAt)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 whitespace-pre-wrap text-sm text-slate-700">
                      {a.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}