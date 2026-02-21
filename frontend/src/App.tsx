import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StudentLayout } from "./components/student/StudentLayout";
import { StudentHome } from "./pages/student/StudentHome";
import { StudentSubject } from "./pages/student/StudentSubject"
import { StudentAnnouncements } from "./pages/student/StudentAnnouncements";
// import { StudentProfile } from "./pages/student/StudentProfile";
import { StudentVideoPlayer } from "./pages/student/StudentPlayer";
import { StudentFees } from "./pages/student/StudentFees";
import LoginPage from "./pages/Login";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage/>} />

        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentHome />} />
          <Route path="subject/:subjectId" element={<StudentSubject />} />
          <Route path="announcements" element={<StudentAnnouncements />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="player/:kind/:contentId" element={<StudentVideoPlayer />} />
          <Route path="fees" element={<StudentFees />}></Route>
        </Route>

        <Route path="*" element={<Navigate to="/student" replace />} />
      </Routes>
    </BrowserRouter>
  );
}