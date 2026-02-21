import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { teacherApi } from "../../api/teacherApi";
import type { ContentItem, Module, TeacherSubject } from "../../types/teacher";
import { UploadContentModal } from "./UploadContentModal";
import { Card, CardContent } from "../../components/student/Card";
import { Skeleton } from "../../components/Skeleton";
import { EmptyState } from "../../components/EmptyState";
import { AccordionItem } from "../../components/Accordion";
import { Badge } from "../../components/Badge";

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

function ContentIcon({ type }: { type: "VIDEO" | "PDF" }) {
  return (
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
      {type === "VIDEO" ? "▶" : "📄"}
    </span>
  );
}

export function TeacherSubject() {
  const { subjectId = "" } = useParams();
  const navigate = useNavigate();
  const thumbFileRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState<TeacherSubject | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [contentByModule, setContentByModule] = useState<
    Record<string, ContentItem[]>
  >({});
  const [loadingModuleId, setLoadingModuleId] = useState<string | null>(null);

  // create module form
  const [creating, setCreating] = useState(false);
  const [mTitle, setMTitle] = useState("");
  const [mDesc, setMDesc] = useState("");

  // upload modal (simple inline)
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  const fallback = useMemo(() => colorFromId(subjectId), [subjectId]);

  const load = async () => {
    try {
      setLoading(true);
      const subs = await teacherApi.mySubjects();
      setSubject(subs.find((x) => x.subjectId === subjectId) ?? null);
      setModules(await teacherApi.listModules(subjectId));
      setContentByModule({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [subjectId]);

  const fetchModuleContent = async (moduleId: string) => {
    if (contentByModule[moduleId]) return; // cached
    try {
      setLoadingModuleId(moduleId);
      const items = await teacherApi.listModuleContent(moduleId);
      setContentByModule((p) => ({ ...p, [moduleId]: items }));
    } finally {
      setLoadingModuleId(null);
    }
  };

  const createModule = async () => {
    if (!mTitle.trim()) return alert("Module title required");
    try {
      setCreating(true);
      const created = await teacherApi.createModule(subjectId, {
        title: mTitle.trim(),
        description: mDesc.trim(),
      });
      setModules((prev) => [created, ...prev]);
      setMTitle("");
      setMDesc("");
    } catch (e: any) {
      alert(
        e?.response?.data?.message || e?.message || "Failed to create module",
      );
    } finally {
      setCreating(false);
    }
  };

  const pickThumb = () => thumbFileRef.current?.click();

  const uploadThumbnail = async (file: File) => {
    try {
      const presign = await teacherApi.presignSubjectThumbnail(
        subjectId,
        file.type || "image/jpeg",
      );
      const putRes = await fetch(presign.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "image/jpeg" },
        body: file,
      });
      if (!putRes.ok) throw new Error("Thumbnail upload failed");

      await teacherApi.confirmSubjectThumbnail(subjectId, {
        objectKey: presign.objectKey,
      });
      await load();
      alert("Thumbnail updated.");
    } catch (e: any) {
      alert(
        e?.response?.data?.message ||
          e?.message ||
          "Failed to update thumbnail",
      );
    }
  };



  if (loading) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-56" />
        <Skeleton className="h-24" />
      </div>
    );
  }

  if (!subject)
    return (
      <EmptyState title="Subject not found" hint="Go back and try again." />
    );

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <Link
          to="/teacher"
          className="text-sm font-medium text-slate-700 hover:text-slate-900"
        >
          ← Back to Subjects
        </Link>

        <button
          onClick={pickThumb}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
        >
          Change Thumbnail
        </button>

        <input
          ref={thumbFileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            uploadThumbnail(f);
            e.currentTarget.value = "";
          }}
        />
      </div>

      {/* Banner */}
      <Card className="overflow-hidden">
        <div
          className={[
            "relative w-full",
            subject.thumbnailUrl ? "" : fallback,
          ].join(" ")}
        >
          <div className="h-48 w-full sm:h-56">
            {subject.thumbnailUrl ? (
              <img
                src={`${import.meta.env.VITE_APP_BUCKET}/${subject.thumbnailUrl}`}
                alt={subject.subjectName}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>

          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
            <div className="text-white text-2xl font-bold">
              {subject.subjectName}
            </div>
            <div className="mt-1 text-white/90 text-sm">
              Manage modules and upload content for this subject.
            </div>
          </div>
        </div>
        <CardContent className="pt-4">
          {/* Create module */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-900">
              Create Module
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div className="sm:col-span-1">
                <label className="text-xs text-slate-600">Title</label>
                <input
                  value={mTitle}
                  onChange={(e) => setMTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
                  placeholder="e.g. Unit 1"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-600">Description</label>
                <input
                  value={mDesc}
                  onChange={(e) => setMDesc(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
                  placeholder="Short description"
                />
              </div>
            </div>
            <div className="mt-3">
              <button
                disabled={creating}
                onClick={createModule}
                className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-70"
              >
                {creating ? "Creating..." : "Create Module"}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modules */}
      <div>
        <div className="text-lg font-semibold text-slate-900">Modules</div>

        <div className="mt-3 grid gap-3">
          {modules.length === 0 ? (
            <EmptyState
              title="No modules yet"
              hint="Create your first module above."
            />
          ) : (
            modules.map((m) => {
              const items = contentByModule[m.id] ?? [];
              const isLoading = loadingModuleId === m.id;

              return (
                <AccordionItem
                  key={m.id}
                  title={m.title}
                  subtitle={m.description ?? undefined}
                  right={
                    <Badge>{contentByModule[m.id]?.length ?? 0} items</Badge>
                  }
                  onToggle={(open) => open && fetchModuleContent(m.id)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm text-slate-600">
                      Upload videos / PDFs for this module.
                    </div>
                    <button
                      onClick={() => {
                        setActiveModuleId(m.id);
                        setUploadOpen(true);
                      }}
                      className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                    >
                      + Upload Content
                    </button>
                  </div>

                  {isLoading ? (
                    <div className="mt-3 grid gap-2">
                      <Skeleton className="h-12" />
                      <Skeleton className="h-12" />
                    </div>
                  ) : items.length === 0 ? (
                    <div className="mt-3">
                      <EmptyState title="No content in this module" />
                    </div>
                  ) : (
                    <div className="mt-3 grid gap-2">
                      {items.map((it) => (
                        <div
                          onClick={async () => {
                            if (it.type == "PDF") {
                              const data = await teacherApi.contentItemUrl(
                                it.id,
                              );
                              window.open(data.url, "_blank")?.focus();
                            } else if (it.type == "VIDEO") {
                              navigate(`/teacher/player/video/${it.id}`);
                            }
                          }}
                          key={it.id}
                          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 hover:cursor-pointer"
                        >
                          <ContentIcon type={it.type} />
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-slate-900 truncate">
                              {it.title}
                            </div>
                            <div className="mt-0.5 text-xs text-slate-500">
                              {it.type} •{" "}
                              {it.published ? "Published" : "Hidden"} •{" "}
                              {it.protectedContent ? "Paid" : "Free"}
                            </div>
                          </div>
                          <span className="text-xs rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-slate-700">
                            {it.uploadStatus ? "READY" : "UPLOADING"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </AccordionItem>
              );
            })
          )}
        </div>
      </div>

      <UploadContentModal
        open={uploadOpen}
        moduleId={activeModuleId}
        onClose={() => setUploadOpen(false)}
        onUploaded={async (moduleId, _newItem) => {
          // refresh content list for that module
          const items = await teacherApi.listModuleContent(moduleId);
          setContentByModule((p) => ({ ...p, [moduleId]: items }));
        }}
      />
    </div>
  );
}
