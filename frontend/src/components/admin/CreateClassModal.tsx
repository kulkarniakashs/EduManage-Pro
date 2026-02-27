import { useState } from "react";
import { ModalShell } from "./ModalShell";
import { adminApi } from "../../api/adminApi";
import type { AdminClassRoom } from "../../types/admin";

export default function CreateClassModal({
  academicYearId,
  onClose,
  onCreated,
}: {
  academicYearId: string;
  onClose: () => void;
  onCreated: (classRoom : AdminClassRoom) => void;
}) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  return (
    <ModalShell title="Create Class" onClose={onClose}>
      <label className="text-xs text-slate-600">Class name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
        placeholder="e.g. SYCS-A"
      />

      <div className="mt-4 flex gap-2">
        <button
          disabled={saving}
          onClick={async () => {
            if (!name.trim()) return alert("Name required");
            try {
              setSaving(true);
              const res = await adminApi.createClassRoom({ academicYearId, name: name.trim() });
              await onCreated(res);
              onClose();
            } finally {
              setSaving(false);
            }
          }}
          className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {saving ? "Creating..." : "Create"}
        </button>
        <button onClick={onClose} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50">
          Cancel
        </button>
      </div>
    </ModalShell>
  );
}