// src/App.tsx (업데이트된 부분)

import  {useEffect}  from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import GlobalStyle from "./styles/GlobalStyle";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuthStore from './store/authStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoadingSpinner from './components/common/LoadingSpinner';
import ScrollToTop from './components/common/ScrollToTop';
import { useChallengeNotifications } from './hooks/useChallengeNotifications';
import { useEmotionCardNotifications } from './hooks/useEmotionCardNotifications';
import { fetchReceivedMessages } from './pages/EmotionCard';
import { useQuery } from '@tanstack/react-query';

// 페이지 컴포넌트 임포트
import WelcomePage from "./pages/WelcomePage";
import Onboarding from "./pages/Onboarding";
import Diagnosis from "./pages/Diagnosis";
import DiagnosisResult from "./pages/DiagnosisResult";
import Invite from "./pages/Invite";
import NotFound from "./pages/NotFound";
import RegisterPage from "./pages/RegisterPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import FindEmail from "./pages/FindEmail";
import TermsPage from "./pages/TermsPage";
import KakaoCallback from "./pages/KakaoCallback";
import Dashboard from "./pages/Dashboard";
import EmotionCard from "./pages/EmotionCard";
import EmotionDiary from "./pages/EmotionDiary";
import ChallengePage from "./pages/ChallengePage";
import Report from "./pages/Report";
import ContentCenter from "./pages/ContentCenter";
import Calendar from "./pages/Calendar";
import Community from "./pages/Community";
import MyPage from "./pages/MyPage";
import ExpertPage from "./pages/ExpertPage";
import { ProfileEditPage } from './pages/ProfileEditPage';
import PlaceholderPage from './pages/PlaceholderPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ThirdPartyConsentPage from './pages/ThirdPartyConsentPage';
import FaqPage from './pages/FaqPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import PostWritePage from './pages/PostWritePage';
import PostDetailPage from './pages/PostDetailPage';
import PostEditPage from './pages/PostEditPage';
import MarriageDiagnosis from './pages/MarriageDiagnosis';
import MarriageDiagnosisResult from './pages/MarriageDiagnosisResult';
import ContentAdmin from './pages/ContentAdmin';

const queryClient = new QueryClient();

// 알림 관련 훅을 관리하는 컴포넌트
const NotificationHooks = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  // 감정 카드 알림
  const { data: receivedMessages } = useQuery({
    queryKey: ['receivedMessagesForNotif'],
    queryFn: fetchReceivedMessages,
    enabled: isAuthenticated,
    refetchInterval: 5000,
  });
  useEmotionCardNotifications(receivedMessages);

  // 챌린지 알림
  useChallengeNotifications();

  return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다.
};

const App = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    console.log("checkAuth");
    checkAuth();
  }, [checkAuth]);

  // 인증 상태를 확인하는 동안 아무것도 렌더링하지 않거나 로딩 스피너를 보여줄 수 있습니다.
  if (isLoading) {
    return <LoadingSpinner size={60} />;
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={clientId || ''}>
        <Router>
          <ScrollToTop />
          <GlobalStyle />
          <NotificationHooks />
          <Routes>
            {/* 루트 경로를 웰컴 페이지로 변경 */}
            <Route path="/" element={<Onboarding />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* 공개 라우트 */}
            <Route path="/diagnosis" element={<Diagnosis />} />
            <Route path="/diagnosis/result" element={<DiagnosisResult />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<WelcomePage />} />
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
            <Route path="/challenge" element={<ProtectedRoute><ChallengePage /></ProtectedRoute>} />
            <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
            <Route path="/content-center" element={<ProtectedRoute><ContentCenter /></ProtectedRoute>} />
            <Route path="/content-admin" element={<ProtectedRoute><ContentAdmin /></ProtectedRoute>} />
            <Route path="/invite" element={<ProtectedRoute><Invite /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
            <Route path="/community/new" element={<ProtectedRoute><PostWritePage /></ProtectedRoute>} />
            <Route path="/community/:id" element={<ProtectedRoute><PostDetailPage /></ProtectedRoute>} />
            <Route path="/community/:id/edit" element={<ProtectedRoute><PostEditPage /></ProtectedRoute>} />
            <Route path="/my" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
            <Route path="/expert" element={<ProtectedRoute><ExpertPage /></ProtectedRoute>} />
            <Route path="/profile/edit" element={<ProtectedRoute><ProfileEditPage /></ProtectedRoute>} />
            <Route path="/marriage-diagnosis" element={<ProtectedRoute><MarriageDiagnosis /></ProtectedRoute>} />
            <Route path="/marriage-diagnosis-result" element={<ProtectedRoute><MarriageDiagnosisResult /></ProtectedRoute>} />

            {/* Placeholder Pages (보호된 라우트) - 일부는 실제 페이지로 교체 */}
            <Route path="/support/faq" element={<ProtectedRoute><FaqPage /></ProtectedRoute>} />
            <Route path="/support/contact" element={<ProtectedRoute><PlaceholderPage title="고객센터" /></ProtectedRoute>} />
            <Route path="/legal/privacy" element={<ProtectedRoute><PrivacyPolicyPage /></ProtectedRoute>} />
            <Route path="/legal/third-party-consent" element={<ProtectedRoute><ThirdPartyConsentPage /></ProtectedRoute>} />
            <Route path="/announcements" element={<ProtectedRoute><AnnouncementsPage /></ProtectedRoute>} />
            <Route path="/settings/notifications" element={<ProtectedRoute><PlaceholderPage title="알림 설정" /></ProtectedRoute>} />
            <Route path="/delete-account" element={<ProtectedRoute><PlaceholderPage title="회원탈퇴" /></ProtectedRoute>} />
            
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
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
};

export default App;