// src/App.tsx (업데이트된 부분)
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import GlobalStyle from "./styles/GlobalStyle";

// 페이지 컴포넌트 임포트
import Onboarding from "./pages/Onboarding";
import Diagnosis from "./pages/Diagnosis";
import DiagnosisResult from "./pages/DiagnosisResult";
import Invite from "./pages/Invite";

import LoginPage from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";

import Dashboard from "./pages/Dashboard";
import EmotionCard from "./pages/EmotionCard";
import EmotionDiary from "./pages/EmotionDiary";
import Challenge from "./pages/Challenge";
import Report from "./pages/Report";
import ContentCenter from "./pages/ContentCenter";
import Calendar from "./pages/Calendar";
import Community from "./pages/Community";
import MyPage from "./pages/MyPage";
import ExpertPage from "./pages/ExpertPage"; // 새로운 전문가 페이지 임포트

const App = () => {
  return (
    <>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/onboarding" replace />} />

          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/diagnosis" element={<Diagnosis />} />
          <Route path="/diagnosis/result" element={<DiagnosisResult />} />

          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* 메인 대시보드와 모든 기능 페이지들 */}
          {/* 이제 각 페이지에서 NavigationBar를 직접 렌더링합니다. */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/emotion-card" element={<EmotionCard />} />
          <Route path="/emotion-diary" element={<EmotionDiary />} />
          <Route path="/challenge" element={<Challenge />} />
          <Route path="/report" element={<Report />} />
          <Route path="/content-center" element={<ContentCenter />} />
          <Route path="/invite" element={<Invite />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/community" element={<Community />} />
          <Route path="/my" element={<MyPage />} />
          <Route path="/expert" element={<ExpertPage />} /> {/* 전문가 페이지 라우트 추가 */}
        </Routes>
      </Router>
    </>
  );
};

export default App;