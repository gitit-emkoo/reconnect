// src/App.tsx (업데이트된 부분)

import  {useEffect}  from 'react';

// Window 객체에 커스텀 속성 타입 선언
declare global {
  interface Window {
    reconnectBrandLogged?: boolean;
  }
}
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import { initializeSafeArea } from './utils/safeArea';
import { initializeAppleSignIn } from './utils/socialAuth';
import { enableFullscreenMode, initializeWebViewOptimization } from './utils/webview';


// 페이지 컴포넌트 임포트
import LoginPage from "./pages/LoginPage";
import Onboarding from "./pages/Onboarding";
import BaselineDiagnosis from "./pages/BaselineDiagnosis";
import BaselineDiagnosisResult from "./pages/BaselineDiagnosisResult";
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
import ContentAdmin from './pages/ContentAdmin';
import UserAdmin from './pages/UserAdmin';
import SelfDiagnosisRoom from './pages/SelfDiagnosisRoom';
import GenericDiagnosis from './pages/GenericDiagnosis';
import GenericDiagnosisResult from './pages/GenericDiagnosisResult';
import AgreementPage from './pages/agreement';
import AgreementVerification from './pages/AgreementVerification';
import IssuedAgreementsPage from './pages/IssuedAgreementsPage';
import TrackPage from './pages/track';
import PublishedTrackReports from './pages/PublishedTrackReports';
import TrackReportDetail from './pages/TrackReportDetail';
import PointPage from './pages/point';
import SubscribePage from './pages/subscribe';
import AgreementCreatePage from './pages/AgreementCreatePage';
import SupportPage from './pages/SupportPage';
import DeleteAccountPage from './pages/DeleteAccountPage';
import PsychologicalCounseling from './pages/PsychologicalCounseling';
import CommunityAdmin from './pages/CommunityAdmin';

const queryClient = new QueryClient();

// 홈 라우트 핸들러: 인증 상태에 따라 리디렉션
const Home = () => {
  const { isAuthenticated, isLoading } = useAuthStore(state => ({
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading
  }));

  if (isLoading) {
    return <LoadingSpinner fullscreen={true} size={60} />;
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/onboarding" replace />;
};

// 알림 관련 훅을 관리하는 컴포넌트
const NotificationHooks = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  // 감정 카드 알림 - 최적화된 간격으로 복원
  const { data: receivedMessages } = useQuery({
    queryKey: ['receivedMessagesForNotif'],
    queryFn: fetchReceivedMessages,
    enabled: isAuthenticated,
    refetchInterval: 15000, // 15초마다 (성능 최적화)
    retry: 1,
    throwOnError: false,
  });
  useEmotionCardNotifications(receivedMessages || []);

  // 챌린지 알림
  useChallengeNotifications();

  return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다.
};

const App = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    // RECONNECT 브랜드 콘솔 출력 (개발 환경에서만 한 번 출력)
    if (!window.reconnectBrandLogged) {
      console.log(`%c
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMWNNNNWMMMMMMMWWNXXNWWMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMWXOxollcloxOKNNKkdolcclodOXWMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMXkl:;clddoc:;cllc;:coddoc:;cxKWMMMMMMMMMMMMMM
MMMMMMMMMMMMMWKo:;lkKNWWWKo:;;:cx0XWWWWXOo:;l0WMMMMMMMMMMMMM
MMMMMMMMMMMMMXd;:oKWMMMMWOc;:dOKWMMMMMMMMNx:;oKMMMMMMMMMMMMM
MMMMMMMMMMMMM0c;c0MMMMMMNd;;oXMMMMMMMMMMMMKl;:OMMMMMMMMMMMMM
MMMMMMMMMMMMM0c;c0MMMMMMXo;;dNMMMMMMMMMMMMKl;:OMMMMMMMMMMMMM
MMMMMMMMMMMMMNd;:oKWMMMMWk:;cONWMMMMMMMMMMN0odXMMMMMMMMMMMMM
MMMMMMMMMMMMMMXd::cxKWMMMNx:;cld0XWWWNXNMMMMWWMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMW0d:;cxKWMMW0oc:;:cooolcoONMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMW0d:;cd0WMMWK0kdoc::::lONMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMW0dc;:d0NMMMMNkl:;lkNMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMWKdc;:o0XX0o:;lkXMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMWKxc;:cc:;cxXWMMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMWKxc;;cxXWMMMMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMWKOkKWMMMMMMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
`, 'color: #785cd2; font-family: monospace; font-size: 10px; line-height: 1;');
      
      console.log('%c리커넥트에 오신 것을 환영합니다!\n함께 성장하는 커플을 위한 서비스', 'color: #ff69b4; font-weight: bold; font-size: 16px;');
      
      window.reconnectBrandLogged = true;
    }
    
    console.log("checkAuth");
    checkAuth();
    // 안전 영역 초기화
    initializeSafeArea();
    // Apple ID 로그인 초기화
    initializeAppleSignIn();
    // 웹뷰 최적화 및 전체 화면 모드 활성화
    initializeWebViewOptimization();
    
    // 뷰포트 높이 실시간 업데이트 함수
    const updateViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // 초기 설정
    updateViewportHeight();

    // 리사이즈, 오리엔테이션 변경, 가시성 변경 시 업데이트
    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', updateViewportHeight);
    document.addEventListener('visibilitychange', updateViewportHeight);
    
    // 앱 포커스/블러 시에도 업데이트 (웹뷰에서 중요)
    window.addEventListener('focus', updateViewportHeight);
    window.addEventListener('blur', updateViewportHeight);
    
    // 웹뷰 환경에서 강제 레이아웃 업데이트
    const forceLayoutUpdate = () => {
      updateViewportHeight();
      // DOM 강제 리플로우
      document.body.offsetHeight;
      // Safe Area 재계산
      const root = document.documentElement;
      root.style.setProperty('--safe-area-bottom', `${window.innerHeight - document.body.clientHeight}px`);
    };
    
    // 웹뷰 환경 감지 및 추가 이벤트 리스너
    if ((window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches) {
      window.addEventListener('resize', forceLayoutUpdate);
      window.addEventListener('orientationchange', () => {
        setTimeout(forceLayoutUpdate, 100);
      });
    }

    // 클린업
    return () => {
      window.removeEventListener('resize', updateViewportHeight);
      window.removeEventListener('orientationchange', updateViewportHeight);
      document.removeEventListener('visibilitychange', updateViewportHeight);
      window.removeEventListener('focus', updateViewportHeight);
      window.removeEventListener('blur', updateViewportHeight);
      
      // 웹뷰 환경 이벤트 리스너 제거
      if ((window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches) {
        window.removeEventListener('resize', forceLayoutUpdate);
      }
    };
  }, [checkAuth]);

  // 인증 상태를 확인하는 동안 로딩 스피너를 전체 화면에 표시
  if (isLoading) {
    return <LoadingSpinner fullscreen={true} size={60} />;
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={clientId || ''}>
        <Router>
          <ScrollToTop />
          <GlobalStyle />
          {isAuthenticated && <NotificationHooks />}
          <Routes>
            {/* 루트 경로는 Home 컴포넌트가 처리하여 리디렉션 */}
            <Route path="/" element={<Home />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* 공개 라우트 */}
            <Route path="/diagnosis" element={<BaselineDiagnosis />} />
            <Route path="/diagnosis/result" element={<BaselineDiagnosisResult />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/find-email" element={<FindEmail />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/support/faq" element={<FaqPage />} />
            <Route path="/legal/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
            <Route path="/auth/kakao/login/callback" element={<KakaoCallback />} />
            <Route path="/auth/kakao/register/callback" element={<KakaoCallback />} />

            {/* 보호된 라우트 */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/emotion-card" element={<ProtectedRoute><EmotionCard /></ProtectedRoute>} />
            <Route path="/emotion-diary" element={<ProtectedRoute><EmotionDiary /></ProtectedRoute>} />
            <Route path="/challenge" element={<ProtectedRoute><ChallengePage /></ProtectedRoute>} />
            <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
            <Route path="/content-center" element={<ProtectedRoute><ContentCenter /></ProtectedRoute>} />
            <Route path="/content-admin" element={<ProtectedRoute><ContentAdmin /></ProtectedRoute>} />
            <Route path="/user-admin" element={<ProtectedRoute><UserAdmin /></ProtectedRoute>} />
            <Route path="/invite" element={<ProtectedRoute><Invite /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
            <Route path="/community/new" element={<ProtectedRoute><PostWritePage /></ProtectedRoute>} />
            <Route path="/community/:id/edit" element={<ProtectedRoute><PostEditPage /></ProtectedRoute>} />
            <Route path="/community/:id" element={<ProtectedRoute><PostDetailPage /></ProtectedRoute>} />
            <Route path="/my" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
            <Route path="/expert" element={<ProtectedRoute><ExpertPage /></ProtectedRoute>} />
            <Route path="/expert/self-diagnosis" element={<ProtectedRoute><SelfDiagnosisRoom /></ProtectedRoute>} />
            <Route path="/profile/edit" element={<ProtectedRoute><ProfileEditPage /></ProtectedRoute>} />
            <Route path="/generic-diagnosis/:diagnosisId" element={<ProtectedRoute><GenericDiagnosis /></ProtectedRoute>} />
            <Route path="/generic-diagnosis-result/:diagnosisId" element={<ProtectedRoute><GenericDiagnosisResult /></ProtectedRoute>} />

            {/* Placeholder Pages (보호된 라우트) - 일부는 실제 페이지로 교체 */}
            
            <Route path="/support/contact" element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />
            <Route path="/legal/third-party-consent" element={<ProtectedRoute><ThirdPartyConsentPage /></ProtectedRoute>} />
            <Route path="/announcements" element={<ProtectedRoute><AnnouncementsPage /></ProtectedRoute>} />
            <Route path="/settings/notifications" element={<ProtectedRoute><PlaceholderPage title="알림 설정" /></ProtectedRoute>} />
            <Route path="/delete-account" element={<ProtectedRoute><DeleteAccountPage /></ProtectedRoute>} />
            <Route path="/agreement" element={<ProtectedRoute><AgreementPage /></ProtectedRoute>} />
            <Route path="/agreement/create" element={<ProtectedRoute><AgreementCreatePage /></ProtectedRoute>} />
            <Route path="/issued-agreements" element={<ProtectedRoute><IssuedAgreementsPage /></ProtectedRoute>} />
            <Route path="/agreement-verification" element={<ProtectedRoute><AgreementVerification /></ProtectedRoute>} />
            <Route path="/track" element={<ProtectedRoute><TrackPage /></ProtectedRoute>} />
            <Route path="/published-track-reports" element={<ProtectedRoute><PublishedTrackReports /></ProtectedRoute>} />
            <Route path="/published-track-reports/:year/:month" element={<ProtectedRoute><TrackReportDetail /></ProtectedRoute>} />
            <Route path="/point" element={<ProtectedRoute><PointPage /></ProtectedRoute>} />
            <Route path="/subscribe" element={<ProtectedRoute><SubscribePage /></ProtectedRoute>} />
            <Route path="/psychological-counseling" element={<ProtectedRoute><PsychologicalCounseling /></ProtectedRoute>} />
            <Route path="/community-admin" element={<ProtectedRoute><CommunityAdmin /></ProtectedRoute>} />
            
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