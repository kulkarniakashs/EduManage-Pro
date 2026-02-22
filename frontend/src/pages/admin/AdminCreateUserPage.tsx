import { useMemo, useState } from "react";
import type { CreateUserRequest, Role } from "../../types/adminUsers";
import { Card } from "../../components/student/Card";
import { adminUsersApi } from "../../api/adminUserApi";

function roleHint(role: Role) {
  if (role === "ADMIN") return "Full access to setup, users, fees, subjects, announcements.";
  if (role === "TEACHER") return "Can manage modules, upload content, and take attendance (if enabled).";
  return "Can view subjects/modules/content only if fee is cleared.";
}

export function AdminCreateUsersPage() {
  const [form, setForm] = useState<CreateUserRequest>({
    fullName: "",
    email: "",
    password: "",
    role: "STUDENT",
  });

  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState<{ fullName: string; email: string; role: Role } | null>(null);

  const validEmail = useMemo(() => /\S+@\S+\.\S+/.test(form.email.trim()), [form.email]);

  const canSubmit = useMemo(() => {
    return (
      form.fullName.trim().length >= 2 &&
      validEmail &&
      form.password.length >= 6 &&
      !!form.role
    );
  }, [form.fullName, form.password, form.role, validEmail]);

  const submit = async () => {
    if (!canSubmit) return;

    try {
      setSaving(true);
      const res = await adminUsersApi.createUser({
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
      });

      setCreated({ fullName: res.fullName, email: res.email, role: res.role });

      // reset for next user
      setForm((p) => ({ ...p, fullName: "", email: "", password: "" }));
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || "Failed to create user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-4">
      <div>
        <div className="text-2xl font-bold text-slate-900">Create Users</div>
        <div className="mt-1 text-sm text-slate-600">
          Admin creates accounts for students/teachers (no public signup).
        </div>
      </div>

      {created ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="text-sm font-semibold text-emerald-800">User created</div>
          <div className="mt-1 text-sm text-emerald-900">
            {created.fullName} • {created.email} • <span className="font-semibold">{created.role}</span>
          </div>
        </div>
      ) : null}

      <Card className="p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-600">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as Role }))}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
              disabled={saving}
            >
              <option value="STUDENT">STUDENT</option>
              <option value="TEACHER">TEACHER</option>
              <option value="ADMIN">ADMIN</option>
            </select>

            <div className="mt-2 text-xs text-slate-500">{roleHint(form.role)}</div>
          </div>

          <div>
            <label className="text-xs text-slate-600">Full Name</label>
            <input
              value={form.fullName}
              onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
              placeholder="e.g. Akash Kulkarni"
              disabled={saving}
            />
            {form.fullName.trim() && form.fullName.trim().length < 2 ? (
              <div className="mt-1 text-xs text-rose-600">Name is too short.</div>
            ) : null}
          </div>

          <div>
            <label className="text-xs text-slate-600">Email</label>
            <input
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
              placeholder="e.g. user@school.edu"
              disabled={saving}
            />
            {form.email.trim() && !validEmail ? (
              <div className="mt-1 text-xs text-rose-600">Enter a valid email.</div>
            ) : null}
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs text-slate-600">Temporary Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
              placeholder="Min 6 characters"
              disabled={saving}
            />
            {form.password && form.password.length < 6 ? (
              <div className="mt-1 text-xs text-rose-600">Password must be at least 6 characters.</div>
            ) : null}

            <div className="mt-2 text-xs text-slate-500">
              Tip: user can change password from Profile later.
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            onClick={submit}
            disabled={!canSubmit || saving}
            className="rounded-2xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {saving ? "Creating..." : "Create User"}
          </button>

          <button
            onClick={() => {
              setForm({ fullName: "", email: "", password: "", role: "STUDENT" });
              setCreated(null);
            }}
            disabled={saving}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
          >
            Reset
          </button>
        </div>
      </Card>
    </div>
  );
}