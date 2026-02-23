import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { teacherAttendanceApi } from "../../api/teacherAttendanceApi";
import { Card } from "../../components/student/Card";
import { Skeleton } from "../../components/Skeleton";
import { EmptyState } from "../../components/EmptyState";
import type { TeacherAttendanceSubject } from "../../types/attendance";

export function TeacherAttendanceHome() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<TeacherAttendanceSubject[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setSubjects(await teacherAttendanceApi.listSubjects());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="grid gap-4">
      <div>
        <div className="text-2xl font-bold text-slate-900">Attendance</div>
        <div className="mt-1 text-sm text-slate-600">Select a subject to manage attendance sessions.</div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {loading ? (
          <>
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </>
        ) : subjects.length === 0 ? (
          <div className="col-span-2 sm:col-span-3 lg:col-span-4">
            <EmptyState title="No subjects assigned" hint="Admin will assign subjects to you." />
          </div>
        ) : (
          subjects.map((s) => (
            <button key={s.subjectId} onClick={() => nav(`/teacher/attendance/${s.subjectId}`)} className="w-full text-left">
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="font-semibold text-slate-900 truncate">{s.subjectName}</div>
                <div className="mt-1 text-xs text-slate-600">
                  {s.classRoomName} • {s.academicYearName}
                </div>
                <div className="mt-3 text-xs text-slate-500">View sessions →</div>
              </Card>
            </button>
          ))
        )}
      </div>
    </div>
  );
}