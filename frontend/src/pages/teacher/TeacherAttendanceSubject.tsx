import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { teacherAttendanceApi } from "../../api/teacherAttendanceApi";
import { Card } from "../../components/student/Card";
import { EmptyState } from "../../components/EmptyState";
import { Skeleton } from "../../components/Skeleton";
import type { AttendanceSessionSummary, EnrolledStudent, AttendanceStatus } from "../../types/attendance";
import { Avatar } from "../../components/Avatar";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function TeacherAttendanceSubject() {
  const { subjectId = "" } = useParams();

  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<AttendanceSessionSummary[]>([]);

  const [openTake, setOpenTake] = useState(false);
  const [date, setDate] = useState(todayISO());
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [mark, setMark] = useState<Record<string, AttendanceStatus>>({});
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setSessions(await teacherAttendanceApi.listSessions(subjectId));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [subjectId]);

  const openTakeAttendance = async () => {
    setOpenTake(true);
    const st = await teacherAttendanceApi.listStudents(subjectId);
    setStudents(st);
    // default: PRESENT for all
    const m: Record<string, AttendanceStatus> = {};
    for (const s of st) m[s.studentId] = "PRESENT";
    setMark(m);
    setDate(todayISO());
  };

  const presentCount = useMemo(
    () => Object.values(mark).filter((v) => v === "PRESENT").length,
    [mark]
  );

  const submit = async () => {
    try {
      setSaving(true);
      await teacherAttendanceApi.takeAttendance(subjectId, {
        sessionDate: date,
        records: students.map((s) => ({
          studentId: s.studentId,
          status: mark[s.studentId] ?? "ABSENT",
        })),
      });
      setOpenTake(false);
      await load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <Link to="/teacher/attendance" className="text-sm font-medium text-slate-700 hover:text-slate-900">
          ← Back
        </Link>

        <button
          onClick={openTakeAttendance}
          className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Take Attendance
        </button>
      </div>

      <Card className="p-4">
        <div className="text-lg font-semibold text-slate-900">Previous Sessions</div>
        <div className="mt-2 text-sm text-slate-600">
          Total sessions: <span className="font-semibold text-slate-900">{sessions.length}</span>
        </div>
      </Card>

      {loading ? (
        <Skeleton className="h-40" />
      ) : sessions.length === 0 ? (
        <EmptyState title="No attendance sessions yet" hint="Click “Take Attendance” to create one." />
      ) : (
        <div className="grid gap-3">
          {sessions.map((s) => (
            <Card key={s.sessionId} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">{s.date}</div>
                  <div className="mt-1 text-sm text-slate-600">
                    Total: {s.totalStudents} • Present: {s.presentStudents} • Absent: {s.absentStudents}
                  </div>
                </div>
                <div className="text-xs rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-semibold text-slate-700">
                  Session
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Take Attendance Modal */}
      {openTake ? (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold text-slate-900">Take Attendance</div>
                <div className="text-sm text-slate-600">
                  Mark students as Present/Absent. Default is Present.
                </div>
              </div>
              <button
                disabled={saving}
                onClick={() => setOpenTake(false)}
                className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="w-full sm:w-64">
                <label className="text-xs text-slate-600">Session Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
                  disabled={saving}
                />
              </div>

              <div className="text-sm text-slate-700">
                Present: <span className="font-semibold text-slate-900">{presentCount}</span> / {students.length}
              </div>
            </div>

            <div className="mt-4 max-h-90 overflow-auto rounded-2xl border border-slate-200">
              {students.length === 0 ? (
                <div className="p-4 text-sm text-slate-600">No enrolled students found.</div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {students.map((s) => {
                    const st = mark[s.studentId] ?? "PRESENT";
                    return (
                      <div key={s.studentId} className="flex items-center gap-3 p-3">
                        <Avatar
                          name={s.name}
                          src={s.profilePhotoKey ? `${import.meta.env.VITE_APP_BUCKET}/${s.profilePhotoKey}` : undefined}
                          size={34}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-slate-900 truncate">{s.name}</div>
                          <div className="text-xs text-slate-500 truncate">{s.email}</div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            disabled={saving}
                            onClick={() => setMark((p) => ({ ...p, [s.studentId]: "PRESENT" }))}
                            className={[
                              "rounded-xl px-3 py-1.5 text-xs font-semibold border",
                              st === "PRESENT"
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50",
                            ].join(" ")}
                          >
                            Present
                          </button>

                          <button
                            disabled={saving}
                            onClick={() => setMark((p) => ({ ...p, [s.studentId]: "ABSENT" }))}
                            className={[
                              "rounded-xl px-3 py-1.5 text-xs font-semibold border",
                              st === "ABSENT"
                                ? "bg-rose-50 border-rose-200 text-rose-700"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50",
                            ].join(" ")}
                          >
                            Absent
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                disabled={saving}
                onClick={submit}
                className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Attendance"}
              </button>

              <button
                disabled={saving}
                onClick={() => setOpenTake(false)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}