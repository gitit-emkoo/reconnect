// src/App.tsx (업데이트된 부분)
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import GlobalStyle from "./styles/GlobalStyle";
import ProtectedRoute from "./components/ProtectedRoute";

// 페이지 컴포넌트 임포트
import RootPage from "./pages/RootPage";
import Onboarding from "./pages/Onboarding";
import Diagnosis from "./pages/Diagnosis";
import DiagnosisResult from "./pages/DiagnosisResult";
import Invite from "./pages/Invite";

import LoginPage from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import FindEmail from "./pages/FindEmail";
import TermsPage from "./pages/TermsPage";

import Dashboard from "./pages/Dashboard";
import EmotionCard from "./pages/EmotionCard";
import EmotionDiary from "./pages/EmotionDiary";
import Challenge from "./pages/Challenge";
import Report from "./pages/Report";
import ContentCenter from "./pages/ContentCenter";
import Calendar from "./pages/Calendar";
import Community from "./pages/Community";
import MyPage from "./pages/MyPage";
import ExpertPage from "./pages/ExpertPage";

const App = () => {
  return (
    <>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<RootPage />} />

          {/* 공개 라우트 */}
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/diagnosis" element={<Diagnosis />} />
          <Route path="/diagnosis/result" element={<DiagnosisResult />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/find-email" element={<FindEmail />} />
          <Route path="/terms" element={<TermsPage />} />

          {/* 보호된 라우트 */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/emotion-card" element={
            <ProtectedRoute>
              <EmotionCard />
            </ProtectedRoute>
          } />
          <Route path="/emotion-diary" element={
            <ProtectedRoute>
              <EmotionDiary />
            </ProtectedRoute>
          } />
          <Route path="/challenge" element={
            <ProtectedRoute>
              <Challenge />
            </ProtectedRoute>
          } />
          <Route path="/report" element={
            <ProtectedRoute>
              <Report />
            </ProtectedRoute>
          } />
          <Route path="/content-center" element={
            <ProtectedRoute>
              <ContentCenter />
            </ProtectedRoute>
          } />
          <Route path="/invite" element={
            <ProtectedRoute>
              <Invite />
            </ProtectedRoute>
          } />
          <Route path="/calendar" element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          } />
          <Route path="/community" element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          } />
          <Route path="/my" element={
            <ProtectedRoute>
              <MyPage />
            </ProtectedRoute>
          } />
          <Route path="/expert" element={
            <ProtectedRoute>
              <ExpertPage />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </>
  );
};

export default App;