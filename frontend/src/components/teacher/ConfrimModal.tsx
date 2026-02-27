import React from "react";

export function ConfirmModal({
  open,
  title,
  description,
  confirmText = "Delete",
  confirmVariant = "danger", // "danger" | "primary"
  loading,
  onClose,
  onConfirm,
  extra,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  confirmVariant?: "danger" | "primary";
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  extra?: React.ReactNode; // for checkbox etc.
}) {
  if (!open) return null;

  const confirmBtn =
    confirmVariant === "danger"
      ? "bg-rose-600 hover:bg-rose-700"
      : "bg-slate-900 hover:bg-slate-800";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={loading ? undefined : onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
        <div className="text-base font-semibold text-slate-900">{title}</div>

        {description ? (
          <div className="mt-2 text-sm text-slate-600">{description}</div>
        ) : null}

        {extra ? <div className="mt-4">{extra}</div> : null}

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            disabled={loading}
            onClick={onClose}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-70"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={onConfirm}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-70 ${confirmBtn}`}
          >
            {loading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}