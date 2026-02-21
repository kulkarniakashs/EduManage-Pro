import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { profileApi } from "../api/profileApi";
import type { MeResponse } from "../types/me";
import { Avatar } from "./Avatar";
import { Skeleton } from "./Skeleton";

export function SidebarMeCard() {
  const nav = useNavigate();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const data = await profileApi.me();
        console.log(data ,"in Profile comp")
        if (!alive) return;
        setMe(data);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    nav("/", { replace: true });
  };

  const photoUrl =
    me?.profilePhotoKey
      ? `${import.meta.env.VITE_APP_BUCKET}/${me.profilePhotoKey}`
      : undefined;

  return (
    <div className="mt-auto">
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        {loading ? (
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-2 h-3 w-44" />
            </div>
          </div>
        ) : me ? (
          <div className="flex items-center gap-3">
            <Avatar name={me.name} src={photoUrl} size={40} />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-slate-900 truncate">
                {me.name}
              </div>
              <div className="text-xs text-slate-500 truncate">{me.email}</div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-600">Not signed in</div>
        )}

        <div className="mt-3 flex gap-2">
          <button
            onClick={logout}
            className="w-full inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}