/** --- inline modal components --- */
export function ModalShell({ title, children, onClose }: any) {
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