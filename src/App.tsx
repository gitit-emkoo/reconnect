// src/App.tsx

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Onboarding from "./pages/Onboarding"; // 오타 수정: Onboading -> Onboarding
import Diagnosis from "./pages/Diagnosis";
import DiagnosisResult from "./pages/DiagnosisResult";
import Invite from "./pages/Invite";
import MainShared from "./pages/MainShared";
import EmotionCard from "./pages/EmotionCard";
import EmotionDiary from "./pages/EmotionDiary";
import Challenge from "./pages/Challenge";
import Report from "./pages/Report";
import ContentCenter from "./pages/ContentCenter";
import GlobalStyle from "./styles/GlobalStyle";

// 새로 추가될 페이지 임포트
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";


const App = () => {
  return (
    <>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/onboarding" />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/diagnosis" element={<Diagnosis />} />
          <Route path="/diagnosis/result" element={<DiagnosisResult />} />

          {/* DiagnosisResult에서 "혼자 시작하기"를 누르면 이 경로로 오게 되므로,
              이 경로를 로그인 페이지로 연결합니다. */}
          <Route path="/main/solo" element={<LoginPage />} />

          {/* 로그인 및 회원가입 페이지 라우트 추가 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 기존 라우트들 */}
          <Route path="/invite" element={<Invite />} />
          <Route path="/main/shared" element={<MainShared />} />
          <Route path="/emotion-card" element={<EmotionCard />} />
          <Route path="/emotion-diary" element={<EmotionDiary />} />
          <Route path="/challenge" element={<Challenge />} />
          <Route path="/report" element={<Report />} />
          <Route path="/content-center" element={<ContentCenter />} />

          {/* 로그인 성공 시 이동할 대시보드 등의 예시 라우트 (필요에 따라 추가) */}
          <Route path="/dashboard" element={<div>로그인 후 대시보드 페이지입니다!</div>} />
        </Routes>
      </Router>
    </>
  );
};

export default App;