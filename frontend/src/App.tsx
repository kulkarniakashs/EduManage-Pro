import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StudentLayout } from "./components/student/StudentLayout";
import { StudentHome } from "./pages/student/StudentHome";
import { StudentSubject } from "./pages/student/StudentSubject";
import { StudentAnnouncements } from "./pages/student/StudentAnnouncements";
// import { StudentProfile } from "./pages/student/StudentProfile";
import { TeacherLayout } from "./components/teacher/TeacherLayout";
import { TeacherHome } from "./pages/teacher/TeacherHome";
import { TeacherSubject } from "./pages/teacher/TeacherSubject";
import { StudentFees } from "./pages/student/StudentFees";
import LoginPage from "./pages/Login";
import ProfilePage from "./pages/ProfilePage";
import { VideoPlayer } from "./pages/VideoPlayer";
import { studentApi } from "./api/studentApi";
import { teacherApi } from "./api/teacherApi";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentHome />} />
          <Route path="subject/:subjectId" element={<StudentSubject />} />
          <Route path="announcements" element={<StudentAnnouncements />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route
            path="player/:kind/:contentId"
            element={< VideoPlayer contentItemUrl={studentApi.contentItemUrl}/>}
          />
          <Route path="fees" element={<StudentFees />}></Route>
        </Route>

        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<TeacherHome />} />
          <Route path="subject/:subjectId" element={<TeacherSubject />} />
          <Route
            path="player/:kind/:contentId"
            element={<VideoPlayer contentItemUrl={teacherApi.contentItemUrl}/>}
          />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* <Route path="*" element={<Navigate to="/student" replace />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
