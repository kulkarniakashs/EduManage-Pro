import { useEffect, useMemo, useRef, useState } from "react";
import { profileApi } from "../api/profileApi";
import type { MeResponse } from "../types/me";
import { Card } from "../components/student/Card";
import { Skeleton } from "../components/Skeleton";
import { EmptyState } from "../components/EmptyState";
import { Avatar } from "../components/Avatar";

function roleBadge(role: string) {
  const map: Record<string, string> = {
    STUDENT: "bg-sky-50 text-sky-700 border-sky-200",
    TEACHER: "bg-violet-50 text-violet-700 border-violet-200",
    ADMIN: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return map[role] ?? "bg-slate-50 text-slate-700 border-slate-200";
}

export default function ProfilePage() {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<MeResponse | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>("");

  const [savingName, setSavingName] = useState(false);
  const [fullName, setFullName] = useState("");

  const [uploading, setUploading] = useState(false);

  const [changingPw, setChangingPw] = useState(false);
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");

  const [err, setErr] = useState("");

  const displayPhoto = useMemo(() => photoUrl || undefined, [photoUrl]);

  const load = async () => {
    try {
      setLoading(true);
      setErr("");
      const m = await profileApi.me();
      setMe(m);
      setFullName(m.name || "");

      // photo URL is separate (cached disabled)
      try {
        const url = await profileApi.getMyProfilePhotoUrl();
        setPhotoUrl(url);
      } catch {
        setPhotoUrl("");
      }
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const saveName = async () => {
    if (!fullName.trim()) {
      alert("Full name is required.");
      return;
    }
    try {
      setSavingName(true);
      const updated = await profileApi.updateProfile({ fullName: fullName.trim() });
      setMe(updated);
      alert("Profile updated.");
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || "Failed to update profile");
    } finally {
      setSavingName(false);
    }
  };

  const pickPhoto = () => fileRef.current?.click();

  const uploadPhoto = async (file: File) => {
    try {
      setUploading(true);

      const presign = await profileApi.presignProfilePhoto(file.type || "image/jpeg");

      // upload file to storage
      const putRes = await fetch(presign.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "image/jpeg" },
        body: file,
      });
      if (!putRes.ok) throw new Error("Upload failed");

      // confirm objectKey to attach to user
      const updated = await profileApi.confirmProfilePhoto({ objectKey: presign.objectKey });
      setMe(updated);

      // refresh photo URL
      try {
        const url = await profileApi.getMyProfilePhotoUrl();
        setPhotoUrl(url);
      } catch {
        // fallback (if endpoint fails, still show avatar initials)
        setPhotoUrl("");
      }

      alert("Profile photo updated.");
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || "Failed to update profile photo");
    } finally {
      setUploading(false);
    }
  };

  const changePassword = async () => {
    if (!oldPw || !newPw) {
      alert("Please enter old and new password.");
      return;
    }
    if (newPw.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }

    try {
      setChangingPw(true);
      await profileApi.changePassword({ oldPassword: oldPw, newPassword: newPw });
      setOldPw("");
      setNewPw("");
      alert("Password changed.");
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || "Failed to change password");
    } finally {
      setChangingPw(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  if (err) return <EmptyState title="Could not load profile" hint={err} />;
  if (!me) return <EmptyState title="No profile data" />;

  return (
    <div className="grid gap-4">
      <div>
        <div className="text-2xl font-bold text-slate-900">Profile</div>
        <div className="mt-1 text-sm text-slate-600">
          View and update your account details.
        </div>
      </div>

      {/* Header Card */}
      <Card className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={me.name || ""} src={displayPhoto} size={56} />
            <div className="min-w-0">
              <div className="text-lg font-semibold text-slate-900 truncate">
                {me.name}
              </div>
              <div className="mt-1">
                <span
                  className={[
                    "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
                    roleBadge(me.role),
                  ].join(" ")}
                >
                  {me.role}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={pickPhoto}
              disabled={uploading}
              className={[
                "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition",
                "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
                uploading ? "opacity-70 cursor-not-allowed" : "",
              ].join(" ")}
            >
              {uploading ? "Uploading..." : "Change Photo"}
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                uploadPhoto(f);
                e.currentTarget.value = "";
              }}
            />
          </div>
        </div>
      </Card>

      {/* Update Profile */}
      <Card className="p-5">
        <div className="text-lg font-semibold text-slate-900">Personal Info</div>
        <div className="mt-1 text-sm text-slate-600">
          Update your name.
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-600">Full Name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
              placeholder={fullName}
            />
          </div>

          <div>
            <label className="text-xs text-slate-600">User ID</label>
            <input
              value={me.id}
              readOnly
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
            />
          </div>

          <div>
            <label className="text-xs text-slate-600">Email</label>
            <input
              value={me.email}
              readOnly
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={saveName}
            disabled={savingName}
            className={[
              "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition",
              "bg-slate-900 text-white hover:bg-slate-800",
              savingName ? "opacity-70 cursor-not-allowed" : "",
            ].join(" ")}
          >
            {savingName ? "Saving..." : "Save Changes"}
          </button>

          <button
            onClick={load}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Refresh
          </button>
        </div>
      </Card>

      {/* Security */}
      <Card className="p-5">
        <div className="text-lg font-semibold text-slate-900">Security</div>
        <div className="mt-1 text-sm text-slate-600">Change your password.</div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs text-slate-600">Old Password</label>
            <input
              type="password"
              value={oldPw}
              onChange={(e) => setOldPw(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="text-xs text-slate-600">New Password</label>
            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={changePassword}
            disabled={changingPw}
            className={[
              "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition",
              "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
              changingPw ? "opacity-70 cursor-not-allowed" : "",
            ].join(" ")}
          >
            {changingPw ? "Updating..." : "Change Password"}
          </button>
        </div>
      </Card>
    </div>
  );
}