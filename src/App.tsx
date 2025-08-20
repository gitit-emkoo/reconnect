// src/App.tsx (업데이트된 부분)

import React from 'react';

// Window 객체에 커스텀 속성 타입 선언
declare global {
  interface Window {
    reconnectBrandLogged?: boolean;
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import GlobalStyle from "./styles/GlobalStyle";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer, toast } from 'react-toastify';
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
import { setAuthToken } from './utils/cookies';


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
import PublicContentDetail from './pages/PublicContentDetail';
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
import EventEntriesAdmin from './pages/EventEntriesAdmin';
import BlockedUsersPage from './pages/BlockedUsersPage';

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

// 네이티브(WebView) 소셜 로그인 메시지 핸들러
const SocialLoginHandler: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  React.useEffect(() => {
    function handleNativeSocialLogin(event: MessageEvent) {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        // 애플 로그인 처리
        if (data.type === 'apple-login-success') {
          console.log('[Web] 애플 로그인 메시지 수신:', data);
          if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'debug',
              message: '[Web] 애플 로그인 메시지 수신:' + JSON.stringify(data)
            }));
          }
          fetch('/auth/apple/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              idToken: data.credential.identityToken,
              authorizationCode: data.credential.authorizationCode
            })
          })
          .then(async res => {
            const contentType = res.headers.get('content-type');
            if (res.status === 401) {
              // 로그인 화면에서 미가입이면 안내 후 회원가입 페이지로 이동
              if (location.pathname === '/login') {
                toast.error('가입되지 않은 사용자입니다. 회원가입을 진행해주세요.');
                if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'debug',
                    message: '[Web] /auth/apple/login 401 → 로그인 화면: 회원가입 페이지로 이동'
                  }));
                }
                navigate('/register', { replace: true });
                // 이후 체인 중단을 위해 빈 Response 반환
                return new Response(new Blob([JSON.stringify({})], { type: 'application/json' }), { status: 204 });
              }
              // 기타 화면에서는 회원가입 폴백
              if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'debug',
                  message: '[Web] /auth/apple/login 401 감지 → /auth/apple/register 폴백'
                }));
              }
              return fetch('/auth/apple/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  idToken: data.credential.identityToken,
                  authorizationCode: data.credential.authorizationCode
                })
              });
            }
            if (contentType && contentType.includes('application/json')) {
              const json = await res.json();
              return new Response(new Blob([JSON.stringify(json)], { type: 'application/json' }), { status: res.status });
            }
            return new Response(new Blob([JSON.stringify({})], { type: 'application/json' }), { status: res.status });
          })
          .then(async res => {
            const contentType = res.headers.get('content-type');
            if (res.status === 204) {
              // 앞 단계에서 리다이렉트 처리됨 (예: 로그인 화면에서 회원가입 페이지 이동)
              return; // 체인 중단
            }
            if (res.status === 409) {
              // 이미 가입된 사용자: 로그인으로 안내
              toast.error('이미 가입된 계정입니다. 로그인으로 이동합니다.');
              if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'debug',
                  message: '[Web] /auth/apple/register 409 → 로그인 페이지로 이동'
                }));
              }
              navigate('/login', { replace: true });
              return;
            }
            if (contentType && contentType.includes('application/json')) {
              const result = await res.json();
              if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'debug',
                  message: '[Web] /auth/apple 최종 결과:' + JSON.stringify(result)
                }));
              }
              if (result && typeof result === 'object' && 'accessToken' in result) {
                setAuthToken((result as any).accessToken);
                localStorage.setItem('accessToken', (result as any).accessToken);
                localStorage.setItem('user', JSON.stringify((result as any).user));
                useAuthStore.getState().setAuth((result as any).accessToken, (result as any).user);
                useAuthStore.getState().checkAuth();
                setTimeout(() => {
                  navigate('/dashboard', { replace: true });
                }, 150);
                return;
              }
              navigate('/dashboard', { replace: true });
              return;
            }
            navigate('/dashboard', { replace: true });
          })
          .catch((e) => {
            console.error('[Web] /auth/apple 처리 에러:', e);
            if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'debug',
                message: '[Web] /auth/apple 처리 에러:' + String(e)
              }));
            }
            toast.error('애플 로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            navigate('/dashboard', { replace: true });
          });
        }
        // 구글 로그인 처리
        if (data.type === 'google-login-success') {
          console.log('[Web] 구글 로그인 메시지 수신:', data);
          if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'debug',
              message: '[Web] 구글 로그인 메시지 수신:' + JSON.stringify(data)
            }));
          }
          const googleAccessToken = data?.credential?.accessToken;
          if (!googleAccessToken) {
            toast.error('구글 로그인 토큰이 유효하지 않습니다. 다시 시도해주세요.');
            return;
          }
          fetch('/auth/google/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accessToken: googleAccessToken })
          })
          .then(async res => {
            const contentType = res.headers.get('content-type');
            if (res.status === 401) {
              // 로그인 화면에서 미가입이면 안내 후 회원가입 페이지로 이동
              if (location.pathname === '/login') {
                toast.error('가입되지 않은 사용자입니다. 회원가입을 진행해주세요.');
                if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'debug',
                    message: '[Web] /auth/google/login 401 → 로그인 화면: 회원가입 페이지로 이동'
                  }));
                }
                navigate('/register', { replace: true });
                return new Response(new Blob([JSON.stringify({})], { type: 'application/json' }), { status: 204 });
              }
              // 기타 화면에서는 회원가입 폴백
              if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'debug',
                  message: '[Web] /auth/google/login 401 감지 → /auth/google/register 폴백'
                }));
              }
              return fetch('/auth/google/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accessToken: googleAccessToken })
              });
            }
            if (contentType && contentType.includes('application/json')) {
              const json = await res.json();
              return new Response(new Blob([JSON.stringify(json)], { type: 'application/json' }), { status: res.status });
            }
            return new Response(new Blob([JSON.stringify({})], { type: 'application/json' }), { status: res.status });
          })
          .then(async res => {
            if (!res) return; // 안전장치
            const contentType = res.headers.get('content-type');
            if (res.status === 204) {
              return;
            }
            if (res.status === 409) {
              toast.error('이미 가입된 구글 계정입니다. 로그인으로 이동합니다.');
              if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'debug',
                  message: '[Web] /auth/google/register 409 → 로그인 페이지로 이동'
                }));
              }
              navigate('/login', { replace: true });
              return;
            }
            if (contentType && contentType.includes('application/json')) {
              const result = await res.json();
              if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'debug',
                  message: '[Web] /auth/google 최종 결과:' + JSON.stringify(result)
                }));
              }
              if (result && typeof result === 'object' && 'accessToken' in result) {
                setAuthToken((result as any).accessToken);
                localStorage.setItem('accessToken', (result as any).accessToken);
                localStorage.setItem('user', JSON.stringify((result as any).user));
                useAuthStore.getState().setAuth((result as any).accessToken, (result as any).user);
                useAuthStore.getState().checkAuth();
                setTimeout(() => {
                  navigate('/dashboard', { replace: true });
                }, 150);
                return;
              }
              navigate('/dashboard', { replace: true });
              return;
            }
            navigate('/dashboard', { replace: true });
          })
          .catch((e) => {
            console.error('[Web] /auth/google 처리 에러:', e);
            if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'debug',
                message: '[Web] /auth/google 처리 에러:' + String(e)
              }));
            }
            toast.error('구글 로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            navigate('/dashboard', { replace: true });
          });
        }
      } catch (e) {
        console.error('[Web] message 이벤트 처리 에러', e);
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'debug',
            message: '[Web] message 이벤트 처리 에러:' + String(e)
          }));
        }
      }
    }
    window.addEventListener('message', handleNativeSocialLogin);
    return () => {
      window.removeEventListener('message', handleNativeSocialLogin);
    };
  }, [navigate, location]);
  return null;
};

// App 컴포넌트에서는 useNavigate/useAuthStore import 없이 기존대로 유지
const App = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  React.useEffect(() => {
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
    // 웹뷰 최적화는 safeArea/socialAuth 내에서 처리
    
    // 뷰포트 높이 실시간 업데이트 함수 및 중복 리스너 제거
    // safeArea와 webview 모듈에서 관리하므로 여기서는 추가 리스너를 붙이지 않습니다.
  }, [checkAuth]);

  // 네비게이션 존재 여부에 따라 #root에 has-nav 클래스 토글
  React.useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;
    const update = () => {
      const path = window.location.pathname;
      const hasNav = ['/dashboard', '/expert', '/content-center', '/community', '/my']
        .some(p => path.startsWith(p));
      root.classList.toggle('has-nav', hasNav);
    };
    update();
    const unlisten = () => update();
    window.addEventListener('popstate', unlisten);
    window.addEventListener('pushstate', unlisten as any);
    window.addEventListener('replacestate', unlisten as any);
    return () => {
      window.removeEventListener('popstate', unlisten);
      window.removeEventListener('pushstate', unlisten as any);
      window.removeEventListener('replacestate', unlisten as any);
    };
  });

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
          <SocialLoginHandler />
          <AppRoutes />
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

// AppRoutes 컴포넌트 정의 (useNavigate 사용을 위해)
const AppRoutes = () => {
  return (
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
            
            {/* 공개 컨텐츠 라우트 */}
            <Route path="/content/:id" element={<PublicContentDetail />} />

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
            <Route path="/event-entries" element={<ProtectedRoute><EventEntriesAdmin /></ProtectedRoute>} />
            <Route path="/blocked-users" element={<ProtectedRoute><BlockedUsersPage /></ProtectedRoute>} />
            
            {/* 404 페이지 - 항상 마지막에 위치해야 함 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        );
      };

export default App;