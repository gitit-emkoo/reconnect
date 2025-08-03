// 웹뷰 최적화 유틸리티 함수들

/**
 * 웹뷰 환경인지 확인
 */
export const isWebView = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();
  return (
    userAgent.includes('wv') || // Android WebView
    userAgent.includes('mobile') && userAgent.includes('safari') && !userAgent.includes('chrome') || // iOS WebView
    (window as any).ReactNativeWebView !== undefined || // React Native WebView
    (window as any).webkit?.messageHandlers !== undefined // iOS WKWebView
  );
};

/**
 * 안전 영역 값들을 가져오는 함수
 */
export const getSafeAreaInsets = () => {
  return {
    top: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top')) || 0,
    bottom: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom')) || 0,
    left: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-left')) || 0,
    right: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-right')) || 0,
  };
};

/**
 * 뷰포트 높이를 동적으로 계산
 */
export const getViewportHeight = (): number => {
  // 먼저 CSS 변수 시도
  const vh = getComputedStyle(document.documentElement).getPropertyValue('--vh');
  if (vh) {
    return parseInt(vh);
  }
  
  // 동적 뷰포트 높이 계산
  const vhValue = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vhValue}px`);
  return window.innerHeight;
};

/**
 * 웹뷰에서 전체 화면 모드 활성화
 */
export const enableFullscreenMode = () => {
  if (isWebView()) {
    // Android WebView 전체 화면 설정
    if (typeof (window as any).Android !== 'undefined') {
      (window as any).Android.enableFullscreen();
    }
    
    // iOS WebView 전체 화면 설정
    if (typeof (window as any).webkit !== 'undefined' && (window as any).webkit.messageHandlers) {
      (window as any).webkit.messageHandlers.enableFullscreen?.postMessage({});
    }
  }
};

/**
 * 뷰포트 크기 변경 시 동적 업데이트
 */
export const updateViewportHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

/**
 * 초기화 함수
 */
export const initializeWebViewOptimization = () => {
  // 초기 뷰포트 높이 설정
  updateViewportHeight();
  
  // 뷰포트 크기 변경 감지
  window.addEventListener('resize', updateViewportHeight);
  window.addEventListener('orientationchange', () => {
    setTimeout(updateViewportHeight, 100);
  });
  
  // 웹뷰 생명주기 이벤트 추가
  window.addEventListener('pageshow', updateViewportHeight);
  window.addEventListener('pagehide', updateViewportHeight);
  window.addEventListener('focus', updateViewportHeight);
  window.addEventListener('blur', updateViewportHeight);
  
  // 웹뷰에서 전체 화면 모드 활성화
  if (isWebView()) {
    enableFullscreenMode();
  }
  
  // 스크롤 동작 최적화
  if (isWebView()) {
    (document.body.style as any).webkitOverflowScrolling = 'touch';
    document.body.style.overscrollBehavior = 'none';
  }
  
  // Safe Area 실시간 업데이트
  const updateSafeArea = () => {
    import('./safeArea').then(({ forceSafeAreaUpdate }) => {
      forceSafeAreaUpdate();
    });
  };
  
  // 웹뷰 환경에서 추가 이벤트
  if (isWebView()) {
    window.addEventListener('resize', updateSafeArea);
    window.addEventListener('orientationchange', () => {
      setTimeout(updateSafeArea, 200);
    });
    window.addEventListener('focus', updateSafeArea);
    window.addEventListener('blur', updateSafeArea);
  }
};

/**
 * 네비게이션 바 높이 계산
 */
export const getNavigationBarHeight = (): number => {
  const safeAreaBottom = getSafeAreaInsets().bottom;
  const baseHeight = 60; // 기본 네비게이션 높이
  return baseHeight + Math.max(safeAreaBottom, 20);
};