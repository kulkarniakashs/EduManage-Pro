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

export function TeacherSidebar() {
  return (
    <aside className="h-full w-full">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm h-full">
        <div className="flex flex-col justify-between h-full">
          <div>
            <div className="h-fit w-full flex justify-center">
              <img className="h-20 w-[80%] object-contain" src="./logo.png" alt="logo"></img>
            </div>

            <div className="mt-4 space-y-1">
              <Item to="/teacher" label="Subjects" />
              <Item to="/teacher/profile" label="Profile" />
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
