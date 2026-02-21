import { useMemo, useRef, useState } from "react";
import axios from "axios";
import type { ContentType, ContentItem } from "../../types/teacher";
import { teacherApi } from "../../api/teacherApi";

type Props = {
  open: boolean;
  moduleId: string | null;
  onClose: () => void;
  onUploaded: (moduleId: string, newItem: ContentItem) => void;
};

function humanSize(bytes: number) {
  if (!Number.isFinite(bytes)) return "-";
  const units = ["B", "KB", "MB", "GB"];
  let b = bytes;
  let i = 0;
  while (b >= 1024 && i < units.length - 1) {
    b /= 1024;
    i++;
  }
  return `${b.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function UploadContentModal({
  open,
  moduleId,
  onClose,
  onUploaded,
}: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<ContentType>("VIDEO");
  const [published, setPublished] = useState(true);
  const [protectedContent, setProtectedContent] = useState(true);

  const [file, setFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const accept = useMemo(
    () => (type === "PDF" ? "application/pdf" : "video/*"),
    [type],
  );

  const reset = () => {
    setTitle("");
    setDescription("");
    setType("VIDEO");
    setPublished(true);
    setProtectedContent(true);
    setFile(null);
    setUploading(false);
    setProgress(0);
    if (fileRef.current) fileRef.current.value = "";
  };

  const close = () => {
    if (uploading) return; // prevent closing mid-upload
    reset();
    onClose();
  };

  const pickFile = () => fileRef.current?.click();

  const startUpload = async () => {
    if (!moduleId) return;
    if (!title.trim()) return alert("Title is required.");
    if (!file) return alert("Please choose a file.");

    try {
      setUploading(true);
      setProgress(0);

      const contentType =
        file.type || (type === "PDF" ? "application/pdf" : "video/mp4");

      // 1) init upload (get presigned PUT url + contentItem id)
      const init = await teacherApi.initUpload(moduleId, {
        title: title.trim(),
        description: description.trim() || undefined,
        type,
        contentType,
        published,
        protectedContent,
      });

      // 2) upload to presigned URL with progress (axios)
      await axios.put(init.uploadUrl, file, {
        headers: { "Content-Type": contentType },
        onUploadProgress: (evt) => {
          const total = evt.total ?? file.size ?? 0;
          if (!total) return;
          const pct = Math.round((evt.loaded * 100) / total);
          setProgress(Math.min(100, Math.max(0, pct)));
        },
      });

      // 3) confirm upload
      const confirmed = await teacherApi.confirmUpload(init.contentItem.id);

      onUploaded(moduleId, confirmed.contentItem);

      alert("Content uploaded.");
      reset();
      onClose();
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || "Upload failed");
      setUploading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-semibold text-slate-900">
              Upload Content
            </div>
            <div className="text-sm text-slate-600">
              Upload Video or PDF to this module (presigned upload).
            </div>
          </div>

          <button
            onClick={close}
            disabled={uploading}
            className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 grid gap-3">
          <div>
            <label className="text-xs text-slate-600">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
              placeholder="e.g. Introduction Video"
              disabled={uploading}
            />
          </div>

          <div>
            <label className="text-xs text-slate-600">Description</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
              placeholder="Optional"
              disabled={uploading}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="text-xs text-slate-600">Type</label>
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value as any);
                  // if user switches type, clear file to avoid mismatch
                  setFile(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
                disabled={uploading}
              >
                <option value="VIDEO">VIDEO</option>
                <option value="PDF">PDF</option>
              </select>
            </div>

            {/* <label className="flex items-center gap-2 text-sm text-slate-700 mt-6">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                disabled={uploading}
              />
              Published
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-700 mt-6">
              <input
                type="checkbox"
                checked={protectedContent}
                onChange={(e) => setProtectedContent(e.target.checked)}
                disabled={uploading}
              />
              Paid/Protected
            </label> */}
          </div>

          {/* File picker */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 max-w-full">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:min-w-0">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-slate-900">
                    Selected file
                  </div>

                  {file ? (
                    <div className="mt-1 text-sm text-slate-700 min-w-0">
                      <div className="">{file.name.length < 40 ? file.name : file.name.slice(0, 40)}</div>
                      <div className="truncate">{humanSize(file.size)}</div>
                    </div>
                  ) : (
                    <div className="mt-1 text-sm text-slate-600">
                      No file selected
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={pickFile}
                  disabled={uploading}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
                >
                  Choose File
                </button>

                <input
                  ref={fileRef}
                  type="file"
                  accept={accept}
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    setFile(f);
                    setProgress(0);
                  }}
                />
              </div>
            </div>

            {/* Progress bar */}
            {uploading ? (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Uploading…</span>
                  <span className="font-semibold text-slate-900">
                    {progress}%
                  </span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-slate-900 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : null}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={startUpload}
              disabled={uploading}
              className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>

            <button
              onClick={close}
              disabled={uploading}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
