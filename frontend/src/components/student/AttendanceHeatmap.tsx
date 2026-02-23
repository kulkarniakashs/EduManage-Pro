import { useMemo } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import type { ReactCalendarHeatmapValue } from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "react-tooltip/dist/react-tooltip.css";

import type { StudentAttendanceDay } from "../../types/attendance";

type Props = {
  days: StudentAttendanceDay[];
  from: string;
  to: string;
};

type HeatValue = ReactCalendarHeatmapValue<string> & {
  status?: "PRESENT" | "ABSENT";
  count?: number;
};

export function AttendanceHeatmap({ days, from, to }: Props) {
  const values: HeatValue[] = useMemo(() => {
    return days.map((d) => ({
      date: d.date,
      count: d.status === "PRESENT" ? 2 : 1,
      status: d.status,
    }));
  }, [days]);

  const classForValue = (value: HeatValue | undefined) => {
    if (!value) return "color-empty";
    if (value.count === 2) return "color-present";
    return "color-absent";
  };

  const titleForValue = (value?: HeatValue) => {
    if (!value) return "No session";
    return `${value.date}: ${value.status}`;
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-1">
      <div className="mb-2 text-sm font-semibold text-slate-900">
        Attendance
      </div>

      <div className="overflow-x-auto p-0.5">
        <CalendarHeatmap
          startDate={new Date(from)}
          endDate={new Date(to)}
          values={values}
          classForValue={classForValue}
          titleForValue={titleForValue}
          showWeekdayLabels={false}
          showMonthLabels={false}
        />
      </div>
      {/* <Tooltip id="attendance-tip" /> */}
    </div>
  );
}
