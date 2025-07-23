// 웹뷰 환경 관련 유틸리티 함수들

// 웹뷰 환경인지 확인
export const isWebView = (): boolean => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // 안드로이드 웹뷰 감지
  if (/android/i.test(userAgent)) {
    return /wv/i.test(userAgent) || /webview/i.test(userAgent);
  }
  
  // iOS 웹뷰 감지
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return /WebKit/i.test(userAgent) && !/CriOS/i.test(userAgent) && !/FxiOS/i.test(userAgent);
  }
  
  return false;
};

// 안전 영역(safe area) 값 가져오기
export const getSafeAreaInsets = () => {
  const style = getComputedStyle(document.documentElement);
  
  return {
    top: parseInt(style.getPropertyValue('--sat') || '0'),
    bottom: parseInt(style.getPropertyValue('--sab') || '0'),
    left: parseInt(style.getPropertyValue('--sal') || '0'),
    right: parseInt(style.getPropertyValue('--sar') || '0'),
  };
};

// CSS 환경 변수로 안전 영역 설정
export const setSafeAreaInsets = () => {
  const root = document.documentElement;
  
  // CSS 환경 변수 설정
  root.style.setProperty('--sat', `${env('safe-area-inset-top')}px`);
  root.style.setProperty('--sab', `${env('safe-area-inset-bottom')}px`);
  root.style.setProperty('--sal', `${env('safe-area-inset-left')}px`);
  root.style.setProperty('--sar', `${env('safe-area-inset-right')}px`);
};

// CSS env() 함수 대체 함수
const env = (variable: string): number => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable);
  return parseInt(value) || 0;
};

// 웹뷰에서 상태바 높이 계산
export const getStatusBarHeight = (): number => {
  if (!isWebView()) return 0;
  
  // 안드로이드 웹뷰에서 상태바 높이 추정
  const screenHeight = window.screen.height;
  const windowHeight = window.innerHeight;
  const statusBarHeight = screenHeight - windowHeight;
  
  return Math.max(0, statusBarHeight);
};

// 웹뷰 환경 초기화
export const initializeWebView = () => {
  if (isWebView()) {
    // 안전 영역 설정
    setSafeAreaInsets();
    
    // 웹뷰에서 스크롤 성능 최적화
    (document.body.style as any).webkitOverflowScrolling = 'touch';
    
    // 터치 이벤트 최적화
    document.addEventListener('touchstart', () => {}, { passive: true });
    document.addEventListener('touchmove', () => {}, { passive: true });
    
    console.log('웹뷰 환경이 감지되어 최적화를 적용했습니다.');
  }
};

// 동적 뷰포트 높이 설정
export const setDynamicViewportHeight = () => {
  const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  
  setVH();
  window.addEventListener('resize', setVH);
  window.addEventListener('orientationchange', setVH);
  
  return () => {
    window.removeEventListener('resize', setVH);
    window.removeEventListener('orientationchange', setVH);
  };
};

// 웹뷰에서 키보드 표시/숨김 감지
export const handleKeyboardVisibility = (callback: (isVisible: boolean) => void) => {
  let initialHeight = window.innerHeight;
  
  const handleResize = () => {
    const currentHeight = window.innerHeight;
    const isKeyboardVisible = currentHeight < initialHeight;
    callback(isKeyboardVisible);
  };
  
  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}; 