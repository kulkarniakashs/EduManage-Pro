function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "U") + (parts[1]?.[0] ?? "");
}

export function Avatar({
  name,
  src,
  size = 36,
}: {
  name: string;
  src?: string | null;
  size?: number;
}) {
  const s = `${size}px`;
  return (
    <div
      className="rounded-full border border-slate-200 bg-slate-100 overflow-hidden grid place-items-center text-slate-700 font-semibold"
      style={{ width: s, height: s }}
      title={name}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span style={{ fontSize: Math.max(12, size / 2.4) }}>
          {initials(name)}
        </span>
      )}
    </div>
  );
}