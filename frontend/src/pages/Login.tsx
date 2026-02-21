import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "../lib/http";
import { decodeToken, useJwt } from "react-jwt";

function colorFromSeed(seed: string) {
  const colors = [
    "bg-indigo-100",
    "bg-emerald-100",
    "bg-sky-100",
    "bg-rose-100",
    "bg-amber-100",
    "bg-violet-100",
  ];
  let sum = 0;
  for (let i = 0; i < seed.length; i++) sum += seed.charCodeAt(i);
  return colors[sum % colors.length];
}

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleHint, setRoleHint] = useState<"STUDENT" | "TEACHER" | "ADMIN">(
    "STUDENT",
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const sideColor = useMemo(() => colorFromSeed(roleHint), [roleHint]);

  const token = localStorage.getItem("token");
  const { decodedToken, isExpired } = useJwt(token || "");
  if (decodedToken && !isExpired) {
    let role: String = (decodedToken as any).role;
    navigate(`${role.toLocaleLowerCase}`);
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await http.post("/auth/login", { email, password });

      const token: string | undefined = res.data?.token;

      if (!token) throw new Error("No token received from server");
      localStorage.setItem("token", token);

      const data = decodeToken(token);
      let role: String = (data as any).role;
      navigate(`/${role.toLocaleLowerCase}`);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please check your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen max-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-2 py-10">
        <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-2">
          {/* Left: Brand / Visual */}
          <div className="relative hidden lg:block">
            <div className={["absolute inset-0", sideColor].join(" ")} />
            <div className="absolute inset-0 bg-linear-to-br from-white/40 via-white/10 to-transparent" />

            <div className="relative p-6">
              <div className="inline-flex items-center gap-2 rounded-2xl bg-white/70 px-4 py-2 text-slate-900 shadow-sm">
                <img src="./logo.png" alt="logo" className="h-8 w-full"></img>
              </div>

              <div className="mt-10">
                <div className="text-3xl font-bold text-slate-900">
                  Learn. Manage. Track.
                </div>
                <div className="mt-2 max-w-md text-slate-700">
                  Access your subjects, modules, announcements and learning
                  content through a clean, modern portal.
                </div>

                <div className="mt-8 grid gap-3">
                  <div className="rounded-2xl border border-white/60 bg-white/60 p-4 backdrop-blur">
                    <div className="font-semibold text-slate-900">Student</div>
                    <div className="text-sm text-slate-700">
                      View subjects, modules, videos & PDFs (based on fee
                      access).
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/60 bg-white/60 p-4 backdrop-blur">
                    <div className="font-semibold text-slate-900">Teacher</div>
                    <div className="text-sm text-slate-700">
                      Upload content, create modules, manage announcements.
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/60 bg-white/60 p-4 backdrop-blur">
                    <div className="font-semibold text-slate-900">Admin</div>
                    <div className="text-sm text-slate-700">
                      Manage users, class structure, and fee settings.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Login Form */}
          <div className="p-6 sm:p-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-2xl font-bold text-slate-900">Sign in</div>
                <div className="mt-1 text-sm text-slate-600">
                  Use the credentials provided by your institute admin.
                </div>
              </div>

              {/* Role hint (purely visual) */}
              <div className="hidden sm:block">
                <label className="text-xs text-slate-600 mr-1.5">Role</label>
                <select
                  value={roleHint}
                  onChange={(e) => setRoleHint(e.target.value as any)}
                  className="mt-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
                >
                  <option value="STUDENT">Student</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>

            {error ? (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <form onSubmit={onSubmit} className="mt-6 grid gap-4">
              <div>
                <label className="text-xs text-slate-600">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="student@college.com"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-600">Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={[
                  "mt-2 inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition",
                  "bg-slate-900 text-white hover:bg-slate-800",
                  "disabled:opacity-60 disabled:cursor-not-allowed",
                ].join(" ")}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <div className="text-xs text-slate-500">
                No public signup. Accounts are created by Admin.
              </div>
            </form>

            {/* Mobile brand header */}
            <div className="mt-8 lg:hidden">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="font-bold text-slate-900">EduManage Pro</div>
                <div className="text-sm text-slate-600">
                  Institutional learning & administration portal.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer
        <div className="mt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} EduManage Pro
        </div> */}
      </div>
    </div>
  );
}
