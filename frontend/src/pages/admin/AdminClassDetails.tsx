import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { adminApi } from "../../api/adminApi";
import type {
  AdminFeeStructure,
  AdminSubjectWithTeacher,
  AdminTeacherOption,
} from "../../types/admin";
import { Card } from "../../components/student/Card";
import { EmptyState } from "../../components/EmptyState";
import { Skeleton } from "../../components/Skeleton";
import { Avatar } from "../../components/Avatar";
import { CreateSubjectModal } from "../../components/admin/CreateSubjectModal";
import { EnrollStudentModal } from "../../components/admin/EnrollmentStudentModal";

export function AdminClassDetail() {
  const { academicYearId = "", classRoomId = "" } = useParams();
  const [showEnroll, setShowEnroll] = useState(false);

  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<AdminSubjectWithTeacher[]>([]);
  const [teachers, setTeachers] = useState<AdminTeacherOption[]>([]);
  const [fee, setFee] = useState<AdminFeeStructure | null>(null);
  const [showCreateSubject, setShowCreateSubject] = useState(false);
  const [showFee, setShowFee] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const [subs, ts, fs] = await Promise.all([
        adminApi.listSubjects(academicYearId, classRoomId),
        adminApi.listTeachers(),
        adminApi.getFeeStructure(academicYearId, classRoomId),
      ]);
      setSubjects(subs);
      setTeachers(ts);
      setFee(fs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [academicYearId, classRoomId]);

  if (loading) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-24" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <Link
          to="/admin"
          className="text-sm font-medium text-slate-700 hover:text-slate-900"
        >
          ← Back
        </Link>

        <div className="flex gap-2">
          <button
            onClick={() => setShowFee(true)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Set Fee
          </button>
          <button
            onClick={() => setShowCreateSubject(true)}
            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            + Create Subject
          </button>
          <button
            onClick={() => setShowEnroll(true)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Enroll Student
          </button>
        </div>
      </div>

      <Card className="p-4">
        <div className="text-lg font-semibold text-slate-900">
          Fee Structure
        </div>
        <div className="mt-2 text-sm text-slate-700">
          {fee?.active && fee.amount
            ? `Active: ${fee.currency} ${fee.amount}`
            : "Not set for this class (students will be locked)."}
        </div>
      </Card>

      <div>
        <div className="text-lg font-semibold text-slate-900">Subjects</div>

        <div className="mt-3 grid gap-3">
          {subjects.length === 0 ? (
            <EmptyState
              title="No subjects created"
              hint="Create your first subject for this class."
            />
          ) : (
            subjects.map((s) => (
              <Card key={s.subjectId} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900">
                      {s.subjectName}
                    </div>
                    {s.description ? (
                      <div className="mt-1 text-sm text-slate-600">
                        {s.description}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-2">
                    {s.teacherName ? (
                      <>
                        <Avatar
                          name={s.teacherName ?? "Teacher"}
                          src={
                            s.teacherProfilePhotoKey
                              ? `${import.meta.env.VITE_APP_BUCKET}/${s.teacherProfilePhotoKey}`
                              : undefined
                          }
                          size={34}
                        />
                        <div className="text-sm text-slate-700">
                          {s.teacherName}
                        </div>
                      </>
                    ) : (
                      <span className="text-xs rounded-full border border-amber-200 bg-amber-50 px-3 py-1 font-semibold text-amber-700">
                        Unassigned
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {showCreateSubject ? (
        <CreateSubjectModal
          open={showCreateSubject}
          academicYearId={academicYearId}
          classRoomId={classRoomId}
          teachers={teachers}
          onClose={() => setShowCreateSubject(false)}
          onCreated={async () => {
            await load();
            setShowCreateSubject(false);
          }}
        />
      ) : null}

      {showFee ? (
        <SetFeeModal
          academicYearId={academicYearId}
          classRoomId={classRoomId}
          current={fee}
          onClose={() => setShowFee(false)}
          onDone={async () => {
            await load();
            setShowFee(false);
          }}
        />
      ) : null}
      <EnrollStudentModal
        open={showEnroll}
        academicYearId={academicYearId}
        classRoomId={classRoomId}
        onClose={() => setShowEnroll(false)}
        onEnrolled={async () => {
          // keep as is: reload page data (subjects + fee etc.)
          await load();
        }}
      />
    </div>
  );
}

function ModalShell({ title, children, onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div className="text-lg font-semibold text-slate-900">{title}</div>
          <button
            onClick={onClose}
            className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            ✕
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

// /** Step 1: create subject. Step 2: assign teacher (same modal) */
// function CreateSubjectAssignTeacherModal({
//   academicYearId,
//   classRoomId,
//   teachers,
//   onClose,
//   onDone,
// }: {
//   academicYearId: string;
//   classRoomId: string;
//   teachers: AdminTeacherOption[];
//   onClose: () => void;
//   onDone: () => void;
// }) {
//   const [step, setStep] = useState<1 | 2>(1);

//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");

//   const [createdSubjectId, setCreatedSubjectId] = useState<string>("");
//   const [teacherId, setTeacherId] = useState<string>("");

//   const [saving, setSaving] = useState(false);

//   const teachersSorted = useMemo(
//     () => [...teachers].sort((a, b) => a.name.localeCompare(b.name)),
//     [teachers]
//   );

//   return (
//     <ModalShell title={step === 1 ? "Create Subject" : "Assign Teacher"} onClose={onClose}>
//       {step === 1 ? (
//         <>
//           <label className="text-xs text-slate-600">Subject Name</label>
//           <input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
//             placeholder="e.g. Data Structures"
//           />

//           <label className="mt-3 text-xs text-slate-600">Description</label>
//           <input
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
//             placeholder="Optional"
//           />

//           <div className="mt-4 flex gap-2">
//             <button
//               disabled={saving}
//               onClick={async () => {
//                 if (!name.trim()) return alert("Subject name required");
//                 try {
//                   setSaving(true);
//                   const created = await adminApi.createSubject({
//                     academicYearId,
//                     classRoomId,
//                     name: name.trim(),
//                     description: description.trim() || undefined,
//                   });
//                   setCreatedSubjectId(created.id ?? created.subjectId ?? created.uuid ?? created); // tolerate backend entity response
//                   setStep(2);
//                 } finally {
//                   setSaving(false);
//                 }
//               }}
//               className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
//             >
//               {saving ? "Creating..." : "Create"}
//             </button>
//             <button onClick={onClose} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50">
//               Cancel
//             </button>
//           </div>
//         </>
//       ) : (
//         <>
//           <div className="text-sm text-slate-600">
//             Assign a teacher now (you can keep it unassigned and assign later too).
//           </div>

//           <label className="mt-3 text-xs text-slate-600">Teacher</label>
//           <select
//             value={teacherId}
//             onChange={(e) => setTeacherId(e.target.value)}
//             className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
//           >
//             <option value="">-- Select Teacher --</option>
//             {teachersSorted.map((t) => (
//               <option key={t.id} value={t.id}>
//                 {t.name} ({t.email})
//               </option>
//             ))}
//           </select>

//           <div className="mt-4 flex gap-2">
//             <button
//               disabled={saving}
//               onClick={async () => {
//                 if (!createdSubjectId) return alert("Subject not created");
//                 if (!teacherId) {
//                   await onDone(); // allow finish without assignment
//                   return;
//                 }
//                 try {
//                   setSaving(true);
//                   await adminApi.assignTeacher(createdSubjectId, { teacherId });
//                   await onDone();
//                 } finally {
//                   setSaving(false);
//                 }
//               }}
//               className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
//             >
//               {saving ? "Saving..." : teacherId ? "Assign & Finish" : "Finish"}
//             </button>

//             <button onClick={onClose} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50">
//               Close
//             </button>
//           </div>
//         </>
//       )}
//     </ModalShell>
//   );
// }

function SetFeeModal({
  academicYearId,
  classRoomId,
  current,
  onClose,
  onDone,
}: {
  academicYearId: string;
  classRoomId: string;
  current: AdminFeeStructure | null;
  onClose: () => void;
  onDone: () => void;
}) {
  const [amount, setAmount] = useState<number>(
    current?.amount ? Number(current.amount) : 0,
  );
  const [currency, setCurrency] = useState(current?.currency ?? "INR");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  return (
    <ModalShell title="Set Fee Structure" onClose={onClose}>
      <label className="text-xs text-slate-600">Amount</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
      />

      <label className="mt-3 text-xs text-slate-600">Currency</label>
      <input
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
      />

      <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
        />
        Active
      </label>

      <div className="mt-4 flex gap-2">
        <button
          disabled={saving}
          onClick={async () => {
            if (!amount || amount <= 0) return alert("Amount must be > 0");
            try {
              setSaving(true);
              await adminApi.setFeeStructure({
                academicYearId,
                classRoomId,
                amount,
                currency,
                active,
              });
              await onDone();
            } finally {
              setSaving(false);
            }
          }}
          className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>

        <button
          onClick={onClose}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </ModalShell>
  );
}
