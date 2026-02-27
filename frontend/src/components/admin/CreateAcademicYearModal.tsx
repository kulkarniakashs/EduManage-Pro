import { useState } from "react";
import { ModalShell } from "./ModalShell";
import { adminApi } from "../../api/adminApi";

export default function CreateAcademicYearModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [active, setActive] = useState(true);

  // ✅ new fields
  const [startDate, setStartDate] = useState(""); // "YYYY-MM-DD"
  const [endDate, setEndDate] = useState(""); // "YYYY-MM-DD"

  const [saving, setSaving] = useState(false);

  const isInvalidRange =
    startDate && endDate ? new Date(endDate) < new Date(startDate) : false;

  return (
    <ModalShell title="Create Academic Year" onClose={onClose}>
      <label className="text-xs text-slate-600">Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
        placeholder="e.g. 2025-26"
      />

      {/* ✅ Dates (consistent UI) */}
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs text-slate-600">Start date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
          />
        </div>

        <div>
          <label className="text-xs text-slate-600">End date</label>
          <input
            type="date"
            value={endDate}
            min={startDate || undefined} // nice UX: prevents selecting earlier dates in most browsers
            onChange={(e) => setEndDate(e.target.value)}
            className={`mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10 ${
              isInvalidRange ? "border-rose-300" : "border-slate-200"
            }`}
          />
          {isInvalidRange ? (
            <p className="mt-1 text-xs text-rose-600">
              End date must be on or after start date.
            </p>
          ) : null}
        </div>
      </div>

      <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
        />
        Active
      </label>

      <div className="mt-4 flex gap-2">
        <button
          disabled={saving}
          onClick={async () => {
            if (!name.trim()) return alert("Name required");
            if (!startDate) return alert("Start date required");
            if (!endDate) return alert("End date required");
            if (isInvalidRange) return alert("End date must be after start date");

            try {
              setSaving(true);
              await adminApi.createAcademicYear({
                name: name.trim(),
                active,
                startDate, // "YYYY-MM-DD"
                endDate,   // "YYYY-MM-DD"
              });
              await onCreated();
              onClose();
            } finally {
              setSaving(false);
            }
          }}
          className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {saving ? "Creating..." : "Create"}
        </button>

        <button
          onClick={onClose}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </ModalShell>
  );
}