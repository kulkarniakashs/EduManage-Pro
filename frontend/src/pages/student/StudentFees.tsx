import { useEffect, useState } from "react";
import { studentApi } from "../../api/studentApi";
import type { StudentFeeSummaryResponse } from "../../types/fees";
import { Card } from "../../components/student/Card";
import { Skeleton } from "../../components/Skeleton";
import { EmptyState } from "../../components/EmptyState";

function money(amount: string, currency: string) {
  return `${currency} ${amount}`;
}

export function StudentFees() {
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [data, setData] = useState<StudentFeeSummaryResponse | null>(null);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setErr("");
      const res = await studentApi.getFeeSummary();
      setData(res);
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || "Failed to load fee info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const simulatePay = async () => {
    if (!data) return;
    try {
      setPaying(true);
      await studentApi.simulatePay({ feeStructureId: data.feeStructureId });
      await load(); // refresh summary (should flip feeCleared on SUCCESS)
      alert("Payment simulated. Status refreshed.");
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-40" />
        <Skeleton className="h-28" />
      </div>
    );
  }

  if (err) return <EmptyState title="Cannot load fee details" hint={err} />;
  if (!data) return <EmptyState title="No fee details" />;

  const locked = !data.feeCleared;

  return (
    <div className="grid gap-4">
      <div>
        <div className="text-2xl font-bold text-slate-900">Fees & Payment</div>
        <div className="mt-1 text-sm text-slate-600">
          {data.classRoomName} <span className="mx-2 text-slate-300">•</span> {data.academicYearName}
        </div>
      </div>

      <Card className="p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-sm text-slate-500">Fee Amount</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">
              {money(data.amount, data.currency)}
            </div>
            <div className="mt-2 text-sm text-slate-600">
              Access to learning content is{" "}
              <span className={locked ? "font-semibold text-amber-700" : "font-semibold text-emerald-700"}>
                {locked ? "LOCKED" : "UNLOCKED"}
              </span>{" "}
              based on payment status.
            </div>
          </div>

          <div className="flex items-center gap-2">
            {locked ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                🔒 Fees Pending
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                ✅ Fees Cleared
              </span>
            )}
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs text-slate-500">Class</div>
            <div className="mt-1 font-semibold text-slate-900">{data.classRoomName}</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs text-slate-500">Academic Year</div>
            <div className="mt-1 font-semibold text-slate-900">{data.academicYearName}</div>
          </div>

          {/* <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs text-slate-500">Fee Structure</div>
            <div className="mt-1 font-semibold text-slate-900 break-all">
              {data.fee}
            </div>
          </div> */}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            disabled={!locked || paying}
            onClick={simulatePay}
            className={[
              "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition",
              locked ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-slate-200 text-slate-600 cursor-not-allowed",
              paying ? "opacity-70" : "",
            ].join(" ")}
          >
            {paying ? "Processing..." : "Pay Now (Simulated)"}
          </button>

          <button
            onClick={load}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Refresh
          </button>
        </div>
      </Card>

      <Card className="p-5">
        <div className="text-lg font-semibold text-slate-900">Latest Payment</div>

        {!data.latestPayment ? (
          <div className="mt-2 text-sm text-slate-600">No payment record yet.</div>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs text-slate-500">Status</div>
              <div className="mt-1 font-semibold text-slate-900">{data.latestPayment.status}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs text-slate-500">Provider</div>
              <div className="mt-1 font-semibold text-slate-900">{data.latestPayment.provider}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
              <div className="text-xs text-slate-500">Payment ID</div>
              <div className="mt-1 font-semibold text-slate-900 break-all">
                {data.latestPayment.paymentId}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}