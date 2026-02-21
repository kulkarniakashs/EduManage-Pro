import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { studentApi } from "../../api/studentApi";
import type { ContentItem,  ModuleResponse, SubjectDetailsWithModulesResponse } from "../../types/student";
import { Avatar } from "../../components/Avatar";
import { AccordionItem } from "../../components/Accordion";
import { Card, CardContent } from "../../components/student/Card";
import { EmptyState } from "../../components/EmptyState";
import { Skeleton } from "../../components/Skeleton";


function colorFromId(id: string) {
  const colors = [
    "bg-indigo-100",
    "bg-emerald-100",
    "bg-sky-100",
    "bg-rose-100",
    "bg-amber-100",
    "bg-violet-100",
  ];
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  return colors[sum % colors.length];
}

function ContentIcon({ kind }: { kind: "VIDEO" | "PDF" }) {
  // Simple inline icons (no extra libs)
  if (kind === "VIDEO") {
    return (
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
        ▶
      </span>
    );
  }
  return (
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
      📄
    </span>
  );
}

function kindLabel(kind: "VIDEO" | "PDF") {
  return kind === "VIDEO" ? "Video" : "PDF";
}

export function StudentSubject() {
  const { subjectId = "" } = useParams();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState<SubjectDetailsWithModulesResponse | null>(null);
  const [modules, setModules] = useState<ModuleResponse[]>([]);
  // const [contentByModule, setContentByModule] = useState<Record<string, ContentItem[]>>({});

  const [contentByModule, setContentByModule] = useState<Record<string, ContentItem[]>>({});
const [loadingModuleId, setLoadingModuleId] = useState<string | null>(null);

const fetchModuleContent = async (moduleId: string) => {
  // already cached → don’t refetch
  if (contentByModule[moduleId]) return;

  try {
    setLoadingModuleId(moduleId);
    const items = await studentApi.listModuleContent(subjectId || "",moduleId);
    setContentByModule((prev) => ({ ...prev, [moduleId]: items }));
  } finally {
    setLoadingModuleId(null);
  }
};

  const fallback = useMemo(() => colorFromId(subjectId), [subjectId]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const s = await studentApi.getSubject(subjectId);
        console.log(s,"student subject");
        setSubject(s);
        setModules(s.modules);

        const pairs = await Promise.all(
          modules.map(async (mod : ModuleResponse) => {
            const items = await studentApi.listModuleContent(subjectId || "",mod.id);
            return [mod.id, items] as const;
          })
        );

        const map: Record<string, ContentItem[]> = {};
        for (const [mid, items] of pairs) map[mid] = items;
        setContentByModule(map);
      } finally {
        setLoading(false);
      }
    })();
  }, [subjectId]);

  const openContent =async (it: ContentItem) => {
    if (it.type === "VIDEO") {
      nav(`/student/player/video/${it.id}`, { state: { content: it, subjectId } });
      return;
    }

    // PDF: open in new tab
    const url = await studentApi.contentItemUrl(it.id);
    window.open(url.url, '_blank')
  };

  if (loading) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-24" />
      </div>
    );
  }

  if (!subject) {
    return <EmptyState title="Subject not found" hint="Go back and try again." />;
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <Link to="/student" className="text-sm font-medium text-slate-700 hover:text-slate-900">
          ← Back to Subjects
        </Link>
      </div>

      {/* ✅ Full-width banner thumbnail */}
      <Card className="overflow-hidden">
        <div className={["relative w-full", subject.thumbnailUrl ? "" : fallback].join(" ")}>
          <div className="h-48 w-full sm:h-56">
            {subject.thumbnailUrl ? (
              <img
                src={`${import.meta.env.VITE_APP_BUCKET}/${subject.thumbnailUrl}`}
                alt={subject.name}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>

          {/* subtle overlay for readability when thumbnail exists */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
            <div className="text-white text-2xl font-bold">{subject.name}</div>
            {subject.description ? (
              <div className="mt-1 max-w-3xl text-white/90 text-sm">
                {subject.description}
              </div>
            ) : null}

            <div className="mt-3 flex items-center gap-2">
              <Avatar
                name={subject.teacherName}
                src={subject.teacherProfilePhotoUrl ? `${import.meta.env.VITE_APP_BUCKET}/${subject.teacherProfilePhotoUrl}` : null}
                size={34}
              />
              <div className="leading-tight">
                <div className="text-white font-semibold">{subject.teacherName}</div>
                <div className="text-xs text-white/80">Teacher</div>
              </div>
            </div>
          </div>
        </div>

        {/* Optional content below banner */}
        <CardContent className="pt-4">
          <div className="text-sm text-slate-700">
            Browse modules below and open videos/PDFs.
          </div>
        </CardContent>
      </Card>

{modules.map((m) => {
  const items = contentByModule[m.id] ?? [];
  const isLoading = loadingModuleId === m.id;

  return (
    <AccordionItem
      key={m.id}
      title={m.title}
      subtitle={m.description}
      // right={<Badge>{(contentByModule[m.id]?.length ?? 0)} items</Badge>}
      onToggle={(open) => {
        if (open) fetchModuleContent(m.id);
      }}
    >
      {isLoading ? (
        <div className="grid gap-2">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState title="No content in this module" />
      ) : (
        <div className="grid gap-2">
          {items.map((it) => (
            <button
              key={it.id}
              onClick={() => openContent(it)}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 hover:bg-slate-50"
            >
              <ContentIcon kind={it.type} />

              <div className="min-w-0 flex-1 text-left">
                <div className="font-medium text-slate-900 truncate">{it.title}</div>
                <div className="mt-0.5 text-xs text-slate-500">{kindLabel(it.type)}</div>
              </div>

              <span className="text-slate-400">→</span>
            </button>
          ))}
        </div>
      )}
    </AccordionItem>
  );
})}

    </div>
  );
}