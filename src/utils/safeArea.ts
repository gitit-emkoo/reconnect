// 안전 영역 계산 유틸리티
export const getSafeAreaBottom = (): number => {
  // CSS env() 값 직접 가져오기
  const safeAreaBottom = getComputedStyle(document.documentElement)
    .getPropertyValue('env(safe-area-inset-bottom)') || '0px';
  
  // px 값을 숫자로 변환
  const bottomValue = parseInt(safeAreaBottom, 10);
  
  // 폴더블 디바이스 감지
  const isFoldable = detectFoldableDevice();
  
  if (isFoldable) {
    // 폴더블 디바이스는 더 큰 기본값 사용
    return Math.max(bottomValue, 64);
  }
  
  // 감지된 값이 있으면 사용, 없으면 0px
  return bottomValue > 0 ? bottomValue : 0;
};

// 폴더블 디바이스 감지
export const detectFoldableDevice = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isSamsungFoldable = userAgent.includes('samsung') && (
    userAgent.includes('fold') || 
    userAgent.includes('flip') || 
    userAgent.includes('z fold') || 
    userAgent.includes('z flip')
  );
  
  const isFoldableRatio = window.innerWidth / window.innerHeight > 1.5 || 
                          window.innerHeight / window.innerWidth > 1.5;
  const isFoldableSize = window.innerWidth > 800 || window.innerHeight > 800;
  
  return isSamsungFoldable || (isFoldableRatio && isFoldableSize);
};

// CSS 변수로 안전 영역 설정
export const setSafeAreaCSS = (): void => {
  const bottom = getSafeAreaBottom();
  document.documentElement.style.setProperty('--safe-area-bottom', `${bottom}px`);
  
  // 디버깅용 로그
  console.log('Safe Area Bottom:', bottom, 'px');
};

// 강제 레이아웃 업데이트
export const forceSafeAreaUpdate = (): void => {
  // DOM 강제 리플로우
  document.body.offsetHeight;
  
  // Safe Area 재계산
  setSafeAreaCSS();
  
  // 뷰포트 높이 업데이트
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  
  // 네비게이션 바 높이 업데이트
  const navHeight = 60 + Math.max(getSafeAreaBottom(), 20);
  document.documentElement.style.setProperty('--nav-height', `${navHeight}px`);
  
  console.log('Safe Area Force Updated');
};

// 초기화
export const initializeSafeArea = (): void => {
  setSafeAreaCSS();
  
  // 웹뷰 생명주기 이벤트 추가
  window.addEventListener('pageshow', forceSafeAreaUpdate);
  window.addEventListener('pagehide', forceSafeAreaUpdate);
  window.addEventListener('focus', forceSafeAreaUpdate);
  window.addEventListener('blur', forceSafeAreaUpdate);
  window.addEventListener('resize', forceSafeAreaUpdate);
  window.addEventListener('orientationchange', () => {
    setTimeout(forceSafeAreaUpdate, 100);
  });
  
  // 가시성 변경 시 업데이트
  document.addEventListener('visibilitychange', forceSafeAreaUpdate);
  
  // 웹뷰 환경에서 추가 이벤트
  if ((window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches) {
    window.addEventListener('resize', forceSafeAreaUpdate);
    window.addEventListener('orientationchange', () => {
      setTimeout(forceSafeAreaUpdate, 200);
    });
  }
  
  console.log('Safe Area Initialized');
}; 