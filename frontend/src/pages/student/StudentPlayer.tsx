import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { studentApi } from "../../api/studentApi";
import type { ContentAccessUrlResponse } from "../../types/student";
import { Card } from "../../components/student/Card";
import { Skeleton } from "../../components/Skeleton";
import { EmptyState } from "../../components/EmptyState";

function formatMins(mins: number) {
  if (!Number.isFinite(mins)) return "-";
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

export function StudentVideoPlayer() {
  const { contentId = "" } = useParams();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ContentAccessUrlResponse | null>(null);
  const [error, setError] = useState<string>("");

  // small key to force reload when URL changes
  const playerKey = useMemo(() => contentId, [contentId]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError("");
        setData(null);

        const res = await studentApi.contentItemUrl(contentId);

        // protect if component unmounted / param changed quickly
        if (!alive) return;

        setData(res);
      } catch (e: any) {
        if (!alive) return;
        setError(
          e?.response?.data?.message ||
            e?.message ||
            "Unable to load video. Please try again.",
        );
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [contentId]);

  // Auto play once URL arrives
  useEffect(() => {
    if (!data?.url) return;
    const v = videoRef.current;
    if (!v) return;

    // try autoplay politely (may be blocked without user gesture)
    v.play().catch(() => {
      // ignore autoplay block
    });
  }, [data?.url]);

  if (loading) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-95" />
        <Skeleton className="h-24" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid gap-4">
        <Link
          to="/student"
          className="text-sm font-medium text-slate-700 hover:text-slate-900"
        >
          ← Back
        </Link>
        <EmptyState title="Failed to load video" hint={error} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="grid gap-4">
        <Link
          to="/student"
          className="text-sm font-medium text-slate-700 hover:text-slate-900"
        >
          ← Back
        </Link>
        <EmptyState title="No data" hint="No access URL received." />
      </div>
    );
  }

  const { contentItem, url, expiresInMinutes } = data;

  return (
    <div className="grid gap-4">
      <Link
        to="/student"
        className="text-sm font-medium text-slate-700 hover:text-slate-900"
      >
        ← Back to Subjects
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="text-2xl font-bold text-slate-900 truncate">
            {contentItem.title}
          </div>
          {contentItem.description ? (
            <div className="mt-1 text-sm text-slate-600">
              {contentItem.description}
            </div>
          ) : (
            <div className="mt-1 text-sm text-slate-500">Video content</div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            Expires in {formatMins(expiresInMinutes)}
          </span>
        </div>
      </div>

      {/* Player */}
      <Card className="overflow-hidden">
        <div className="bg-slate-900">
          <video
            key={playerKey}
            ref={videoRef}
            className="w-full aspect-video"
            controls
            playsInline
            preload="metadata"
            src={url}
          />
        </div>
      </Card>
    </div>
  );
}
