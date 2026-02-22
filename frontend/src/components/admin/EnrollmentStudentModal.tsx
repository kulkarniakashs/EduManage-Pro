import { useEffect, useMemo, useState } from "react";
import { adminApi } from "../../api/adminApi";
import type { AdminStudentOption } from "../../types/admin";

type Props = {
  open: boolean;
  academicYearId: string;
  classRoomId: string;
  onClose: () => void;
  onEnrolled: () => void;
};

function ModalShell({ title, children, onClose, disableClose }: any) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div className="text-lg font-semibold text-slate-900">{title}</div>
          <button
            onClick={onClose}
            disabled={disableClose}
            className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            ✕
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

export function EnrollStudentModal({
  open,
  academicYearId,
  classRoomId,
  onClose,
  onEnrolled,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<AdminStudentOption[]>([]);

  const [q, setQ] = useState("");
  const [studentId, setStudentId] = useState("");
  const [saving, setSaving] = useState(false);

  // fetch only when modal opens
  useEffect(() => {
    if (!open) return;

    (async () => {
      try {
        setLoading(true);
        const list = await adminApi.listAvailableStudents(academicYearId, classRoomId);
        setStudents(list);
      } catch (e: any) {
        alert(e?.response?.data?.message || e?.message || "Failed to load students");
      } finally {
        setLoading(false);
      }
    })();
  }, [open, academicYearId, classRoomId]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return students;
    return students.filter(
      (s) => s.name.toLowerCase().includes(term) || s.email.toLowerCase().includes(term)
    );
  }, [q, students]);

  const selected = useMemo(
    () => students.find((s) => s.id === studentId),
    [students, studentId]
  );

  const close = () => {
    if (saving) return;
    setQ("");
    setStudentId("");
    setStudents([]);
    onClose();
  };

  const enroll = async () => {
    if (!studentId) return alert("Select a student");
    try {
      setSaving(true);
      await adminApi.enrollStudent({ academicYearId, classRoomId, studentId });
      alert(`Enrolled: ${selected?.name ?? "Student"}`);
      await onEnrolled();
      close();
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || "Failed to enroll student");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <ModalShell title="Enroll Student" onClose={close} disableClose={saving}>
      <div className="grid gap-3">
        {/* <div>
          <label className="text-xs text-slate-600">Search student</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
            placeholder="Search by name or email…"
            disabled={saving || loading}
          />
        </div> */}

        <div>
          <label className="text-xs text-slate-600">Select student</label>
          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
            disabled={saving || loading}
          >
            <option value="">
              {loading ? "Loading..." : students.length === 0 ? "No available students" : "-- Select --"}
            </option>
            {filtered.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.email})
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 mt-2">
          <button
            onClick={enroll}
            disabled={saving || loading || !studentId}
            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {saving ? "Enrolling..." : "Enroll"}
          </button>

          <button
            onClick={close}
            disabled={saving}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
        </div>

        <div className="text-xs text-slate-500">
          Only students not enrolled in this class are shown.
        </div>
      </div>
    </ModalShell>
  );
}