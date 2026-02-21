import { NavLink } from "react-router-dom";
import { SidebarMeCard } from "../SidebarMeCard";

function Item({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium",
          isActive
            ? "bg-slate-900 text-white"
            : "text-slate-700 hover:bg-slate-100",
        ].join(" ")
      }
      end
    >
      <span className="text-base">•</span>
      {label}
    </NavLink>
  );
}

export function StudentSidebar() {
  return (
    <aside className="h-full w-full">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm h-full">
        <div className="flex flex-col justify-between h-full">
          <div>
            <div className="text-slate-900 font-semibold text-lg">
              EduManage
            </div>
            <div className="text-slate-600 text-sm">Student Portal</div>

            <div className="mt-4 space-y-1">
              <Item to="/student" label="Subjects" />
              <Item to="/student/announcements" label="Announcements" />
              <Item to="/student/profile" label="Profile" />
              <Item to="/student/fees" label="Fees" />
            </div>
          </div>

          <div>
            <SidebarMeCard />
          </div>
        </div>
      </div>
    </aside>
  );
}
