// import React, { useState } from "react";

// export function AccordionItem({
//   title,
//   subtitle,
//   right,
//   children,
// }: {
//   title: string;
//   subtitle?: string;
//   right?: React.ReactNode;
//   children: React.ReactNode;
// }) {
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white">
//       <button
//         onClick={() => setOpen((v) => !v)}
//         className="w-full flex items-start justify-between gap-3 p-4 text-left"
//       >
//         <div>
//           <div className="font-semibold text-slate-900">{title}</div>
//           {subtitle ? (
//             <div className="mt-1 text-sm text-slate-600">{subtitle}</div>
//           ) : null}
//         </div>
//         <div className="flex items-center gap-3">
//           {right}
//           <span
//             className={[
//               "text-slate-500 transition-transform",
//               open ? "rotate-180" : "",
//             ].join(" ")}
//           >
//             ▾
//           </span>
//         </div>
//       </button>

//       {open ? <div className="px-4 pb-4">{children}</div> : null}
//     </div>
//   );
// }

import React, { useState } from "react";

export function AccordionItem({
  title,
  subtitle,
  right,
  children,
  onToggle,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  onToggle?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen((prev) => {
      const next = !prev;
      onToggle?.(next);
      return next;
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <button
        onClick={toggle}
        className="w-full flex items-start justify-between gap-3 p-4 text-left"
      >
        <div>
          <div className="font-semibold text-slate-900">{title}</div>
          {subtitle ? <div className="mt-1 text-sm text-slate-600">{subtitle}</div> : null}
        </div>

        <div className="flex items-center gap-3">
          {right}
          <span className={["text-slate-500 transition-transform", open ? "rotate-180" : ""].join(" ")}>
            ▾
          </span>
        </div>
      </button>

      {open ? <div className="px-4 pb-4">{children}</div> : null}
    </div>
  );
}