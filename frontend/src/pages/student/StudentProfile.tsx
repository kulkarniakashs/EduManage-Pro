import { useEffect, useState } from "react";
import { studentApi } from "../../api/studentApi";
import type { StudentMe } from "../../types/student";
import { Avatar } from "../../components/student/Avatar";
import { Card, CardContent, CardHeader } from "../../components/student/Card";
import { Skeleton } from "../../components/student/Skeleton";
export function StudentProfile() {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<StudentMe | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await studentApi.me();
        setMe(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Skeleton className="h-40" />;
  if (!me) return null;

  return (
    <div className="grid gap-4">
      <div>
        <div className="text-2xl font-bold text-slate-900">Profile</div>
        <div className="text-sm text-slate-600">Your student account details.</div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Avatar name={me.name} src={me.profilePhotoUrl || undefined} size={52} />
            <div>
              <div className="text-lg font-semibold text-slate-900">{me.name}</div>
              <div className="text-sm text-slate-600">{me.email}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-slate-700">
            Later you can add: edit profile, change password, upload profile photo, etc.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}