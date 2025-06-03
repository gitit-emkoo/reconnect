// src/App.tsx (업데이트된 부분)
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import GlobalStyle from "./styles/GlobalStyle";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from "./contexts/AuthContext";

// 페이지 컴포넌트 임포트
import RootPage from "./pages/RootPage";
import Onboarding from "./pages/Onboarding";
import Diagnosis from "./pages/Diagnosis";
import DiagnosisResult from "./pages/DiagnosisResult";
import Invite from "./pages/Invite";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import FindEmail from "./pages/FindEmail";
import TermsPage from "./pages/TermsPage";
import KakaoCallback from "./pages/KakaoCallback";
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
import { ProfileEditPage } from './pages/ProfileEditPage';
import { PasswordChange } from './components/Profile/PasswordChange';

const App = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={clientId || ''}>
      <AuthProvider>
        <Router>
          <GlobalStyle />
          <Routes>
            {/* 루트 경로를 온보딩으로 변경 */}
            <Route path="/" element={<Onboarding />} />
            <Route path="/welcome" element={<RootPage />} />

            {/* 공개 라우트 */}
            <Route path="/diagnosis" element={<Diagnosis />} />
            <Route path="/diagnosis/result" element={<DiagnosisResult />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/find-email" element={<FindEmail />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
            <Route path="/auth/kakao/register/callback" element={<KakaoCallback />} />

            {/* 보호된 라우트 */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/emotion-card" element={<ProtectedRoute><EmotionCard /></ProtectedRoute>} />
            <Route path="/emotion-diary" element={<ProtectedRoute><EmotionDiary /></ProtectedRoute>} />
            <Route path="/challenge" element={<ProtectedRoute><Challenge /></ProtectedRoute>} />
            <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
            <Route path="/content-center" element={<ProtectedRoute><ContentCenter /></ProtectedRoute>} />
            <Route path="/invite" element={<ProtectedRoute><Invite /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
            <Route path="/my" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
            <Route path="/expert" element={<ProtectedRoute><ExpertPage /></ProtectedRoute>} />
            <Route path="/profile/edit" element={<ProtectedRoute><ProfileEditPage /></ProtectedRoute>} />
            <Route path="/profile/password" element={<ProtectedRoute><PasswordChange /></ProtectedRoute>} />
            
            {/* 404 페이지 - 항상 마지막에 위치해야 함 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;