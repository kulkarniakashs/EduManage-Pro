import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StudentLayout } from "./components/student/StudentLayout";
import { StudentHome } from "./pages/student/StudentHome";
import { StudentSubject } from "./pages/student/StudentSubject"
import { StudentAnnouncements } from "./pages/student/StudentAnnouncements";
import { StudentProfile } from "./pages/student/StudentProfile";
import { StudentVideoPlayer } from "./pages/student/StudentPlayer";
import LoginPage from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage/>} />

        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentHome />} />
          <Route path="subject/:subjectId" element={<StudentSubject />} />
          <Route path="announcements" element={<StudentAnnouncements />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="player/:kind/:contentId" element={<StudentVideoPlayer />} />
        </Route>

        <Route path="*" element={<Navigate to="/student" replace />} />
      </Routes>
    </BrowserRouter>
  );
}