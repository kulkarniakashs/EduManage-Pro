import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../api/adminApi";
import type { AdminAcademicYear, AdminClassRoom } from "../../types/admin";
import { Card } from "../../components/student/Card";
import { Skeleton } from "../../components/Skeleton";
import { EmptyState } from "../../components/EmptyState";

export function AdminHome() {
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [years, setYears] = useState<AdminAcademicYear[]>([]);
  const [yearId, setYearId] = useState<string>("");

  const [classesLoading, setClassesLoading] = useState(false);
  const [classes, setClasses] = useState<AdminClassRoom[]>([]);

  // modals (simple)
  const [showCreateYear, setShowCreateYear] = useState(false);
  const [showCreateClass, setShowCreateClass] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [ys, latest] = await Promise.all([
          adminApi.listAcademicYears(),
          adminApi.latestAcademicYear(),
        ]);
        setYears(ys);
        setYearId(latest.id);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!yearId) return;
    (async () => {
      try {
        setClassesLoading(true);
        setClasses(await adminApi.listClassRooms(yearId));
      } finally {
        setClassesLoading(false);
      }
    })();
  }, [yearId]);

  const selectedYear = useMemo(() => years.find(y => y.id === yearId), [years, yearId]);

  if (loading) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-2xl font-bold text-slate-900">Academic Setup</div>
          <div className="mt-1 text-sm text-slate-600">
            Select academic year → manage classes → subjects, teachers & fees.
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateYear(true)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            + Academic Year
          </button>
          <button
            onClick={() => setShowCreateClass(true)}
            disabled={!yearId}
            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            + Class
          </button>
        </div>
      </div>

      <Card className="p-4">
        <label className="text-xs text-slate-600">Academic Year</label>
        <select
          value={yearId}
          onChange={(e) => setYearId(e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
        >
          {years.map((y) => (
            <option key={y.id} value={y.id}>
              {y.name}{y.active ? " (Active)" : ""}
            </option>
          ))}
        </select>
        {selectedYear ? (
          <div className="mt-2 text-xs text-slate-500">
            Showing classes for <span className="font-semibold text-slate-900">{selectedYear.name}</span>
          </div>
        ) : null}
      </Card>

      <div>
        <div className="text-lg font-semibold text-slate-900">Classes</div>
        <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {classesLoading ? (
            <>
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
            </>
          ) : classes.length === 0 ? (
            <div className="col-span-2 sm:col-span-3 lg:col-span-4">
              <EmptyState title="No classes found" hint="Create a class for this academic year." />
            </div>
          ) : (
            classes.map((c) => (
              <button
                key={c.id}
                onClick={() => nav(`/admin/class/${yearId}/${c.id}`)}
                className="w-full text-left"
              >
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="text-slate-900 font-semibold">{c.name}</div>
                  <div className="mt-2 text-xs text-slate-500">Manage subjects →</div>
                </Card>
              </button>
            ))
          )}
        </div>
      </div>

      {/* You asked “whole code” — modals are below in this same response */}
      {showCreateYear ? (
        <CreateAcademicYearModal
          onClose={() => setShowCreateYear(false)}
          onCreated={async () => {
            const ys = await adminApi.listAcademicYears();
            setYears(ys);
            const latest = await adminApi.latestAcademicYear();
            setYearId(latest.id);
          }}
        />
      ) : null}

      {showCreateClass ? (
        <CreateClassModal
          academicYearId={yearId}
          onClose={() => setShowCreateClass(false)}
          onCreated={async () => setClasses(await adminApi.listClassRooms(yearId))}
        />
      ) : null}
    </div>
  );
}

/** --- inline modal components --- */
function ModalShell({ title, children, onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div className="text-lg font-semibold text-slate-900">{title}</div>
          <button onClick={onClose} className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">✕</button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

function CreateAcademicYearModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  return (
    <ModalShell title="Create Academic Year" onClose={onClose}>
      <label className="text-xs text-slate-600">Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
        placeholder="e.g. 2025-26"
      />

      <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
        Active
      </label>

      <div className="mt-4 flex gap-2">
        <button
          disabled={saving}
          onClick={async () => {
            if (!name.trim()) return alert("Name required");
            try {
              setSaving(true);
              await adminApi.createAcademicYear({ name: name.trim(), active });
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
        <button onClick={onClose} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50">
          Cancel
        </button>
      </div>
    </ModalShell>
  );
}

function CreateClassModal({
  academicYearId,
  onClose,
  onCreated,
}: {
  academicYearId: string;
  onClose: () => void;
  onCreated: () => void;
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
              await adminApi.createClassRoom({ academicYearId, name: name.trim() });
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
        <button onClick={onClose} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50">
          Cancel
        </button>
      </div>
    </ModalShell>
  );
}