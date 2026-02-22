import { useMemo, useState } from "react";
import { adminApi } from "../../api/adminApi";
import type { AdminTeacherOption } from "../../types/admin";

type Props = {
  open: boolean;
  academicYearId: string;
  classRoomId: string;
  teachers: AdminTeacherOption[];
  onClose: () => void;
  onCreated: () => void; // call parent reload
};

function ModalShell({
  title,
  children,
  onClose,
  disableClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  disableClose?: boolean;
}) {
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

export function CreateSubjectModal({
  open,
  academicYearId,
  classRoomId,
  teachers,
  onClose,
  onCreated,
}: Props) {
  const [step, setStep] = useState<1 | 2>(1);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [teacherId, setTeacherId] = useState("");

  const [saving, setSaving] = useState(false);

  const teachersSorted = useMemo(
    () => [...teachers].sort((a, b) => a.name.localeCompare(b.name)),
    [teachers]
  );

  const reset = () => {
    setStep(1);
    setName("");
    setDescription("");
    setTeacherId("");
    setSaving(false);
  };

  const close = () => {
    if (saving) return;
    reset();
    onClose();
  };

  const goNext = () => {
    if (!name.trim()) return alert("Subject name required");
    setStep(2);
  };

  const create = async () => {
    if (!name.trim()) return alert("Subject name required");
    if (!teacherId) return alert("Please select a teacher");

    try {
      setSaving(true);

      await adminApi.createSubject({
        academicYearId,
        classRoomId,
        name: name.trim(),
        description: description.trim() || undefined,
        teacherId,
      });

      await onCreated();
      reset();
      onClose();
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || "Failed to create subject");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <ModalShell
      title={step === 1 ? "Create Subject" : "Assign Teacher"}
      onClose={close}
      disableClose={saving}
    >
      {step === 1 ? (
        <>
          <label className="text-xs text-slate-600">Subject Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
            placeholder="e.g. Data Structures"
            disabled={saving}
          />

          <label className="mt-3 text-xs text-slate-600">Description</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
            placeholder="Optional"
            disabled={saving}
          />

          <div className="mt-4 flex gap-2">
            <button
              onClick={goNext}
              disabled={saving}
              className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              Next
            </button>

            <button
              onClick={close}
              disabled={saving}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="text-sm text-slate-600">
            Select teacher to assign for <span className="font-semibold text-slate-900">{name.trim()}</span>
          </div>

          <label className="mt-3 text-xs text-slate-600">Teacher</label>
          <select
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
            disabled={saving}
          >
            <option value="">-- Select Teacher --</option>
            {teachersSorted.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.email})
              </option>
            ))}
          </select>

          <div className="mt-4 flex gap-2">
            <button
              onClick={create}
              disabled={saving}
              className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {saving ? "Creating..." : "Create Subject"}
            </button>

            <button
              onClick={() => setStep(1)}
              disabled={saving}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
            >
              Back
            </button>

            <button
              onClick={close}
              disabled={saving}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </ModalShell>
  );
}