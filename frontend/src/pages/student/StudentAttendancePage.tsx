import { useEffect, useMemo, useState } from "react";
import { studentAttendanceApi } from "../../api/studentAttendanceApi";
import { AccordionItem } from "../../components/Accordion";
import { Card } from "../../components/student/Card";
import { Badge } from "../../components/Badge";
import { Skeleton } from "../../components/Skeleton";
import { EmptyState } from "../../components/EmptyState";
import { Avatar } from "../../components/Avatar";
import { AttendanceHeatmap } from "../../components/student/AttendanceHeatmap";
import type {
  StudentAttendanceDay,
  StudentSubjectAttendanceSummary,
} from "../../types/attendance";

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function StudentAttendancePage() {
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<StudentSubjectAttendanceSummary[]>(
    [],
  );
  const [calendar, setCalendar] = useState<
    Record<string, StudentAttendanceDay[]>
  >({});
  const [loadingCal, setLoadingCal] = useState<Record<string, boolean>>({});

  const to = useMemo(() => iso(new Date()), []);
  const from = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 120);
    return iso(d);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setSubjects(await studentAttendanceApi.subjectSummary());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const loadCal = async (subjectId: string) => {
    if (calendar[subjectId]) return;
    setLoadingCal((p) => ({ ...p, [subjectId]: true }));
    try {
      const days = await studentAttendanceApi.calendar(subjectId, from, to);
      setCalendar((p) => ({ ...p, [subjectId]: days }));
    } finally {
      setLoadingCal((p) => ({ ...p, [subjectId]: false }));
    }
  };

  return (
    <div className="grid gap-4">
      <div>
        <div className="text-2xl font-bold text-slate-900">Attendance</div>
        <div className="mt-1 text-sm text-slate-600">
          Your subject-wise attendance percentage and calendar heatmap.
        </div>
      </div>

      {loading ? (
        <>
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </>
      ) : subjects.length === 0 ? (
        <EmptyState
          title="No subjects found"
          hint="You will see attendance after enrollment."
        />
      ) : (
        <div className="grid gap-3">
          {subjects.map((s) => (
            <AccordionItem
              key={s.subjectId}
              title={s.subjectName}
              subtitle={`Teacher: ${s.teacherName}`}
              right={<Badge>{s.percentage}%</Badge>}
              onToggle={(open) => {
                if (open) loadCal(s.subjectId);
              }}
            >
              <Card className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Avatar
                      name={s.teacherName}
                      src={
                        s.teacherProfilePhotoKey
                          ? `${import.meta.env.VITE_APP_BUCKET}/${s.teacherProfilePhotoKey}`
                          : undefined
                      }
                      size={34}
                    />
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {s.teacherName}
                      </div>
                      <div className="text-xs text-slate-500">
                        Sessions: {s.totalSessions} • Present: {s.presentCount}
                      </div>
                    </div>
                  </div>

                  <div className="text-sm font-semibold text-slate-900">
                    {s.percentage}%
                  </div>
                </div>

                <div className="mt-4">
                  {loadingCal[s.subjectId] ? (
                    <Skeleton className="h-28" />
                  ) : (
                    <AttendanceHeatmap
                      days={calendar[s.subjectId] ?? []}
                      from={from}
                      to={to}
                    />
                  )}
                </div>
              </Card>
            </AccordionItem>
          ))}
        </div>
      )}
    </div>
  );
}
