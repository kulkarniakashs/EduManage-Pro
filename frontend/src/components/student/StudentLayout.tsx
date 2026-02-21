import { Outlet } from "react-router-dom";
import { StudentSidebar } from "./StudentSidebar";

export function StudentLayout() {
  return (
    <div className="max-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 h-screen">
        <div className="h-full grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <StudentSidebar />
          <main className="min-w-0 max-h-full overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}