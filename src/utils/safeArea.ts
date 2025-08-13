// 안전 영역 계산 유틸리티 (안정화 버전)

let isSafeAreaInitialized = false;
let updateTimeoutId: number | null = null;

// CSS 커스텀 변수에서 안전 영역 하단 값을 읽어 숫자로 반환
export const getSafeAreaBottom = (): number => {
  const cssBottom = getComputedStyle(document.documentElement)
    .getPropertyValue('--safe-area-inset-bottom')
    .trim();

  // '0px' 형태를 숫자로 변환
  const parsed = parseInt(cssBottom || '0', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

// CSS 변수로 안전 영역 설정 (혼용 방지를 위해 --safe-area-bottom도 함께 세팅)
export const setSafeAreaCSS = (): void => {
  const bottom = getSafeAreaBottom();

  // 프로젝트 내 사용되는 두 변수를 모두 갱신
  document.documentElement.style.setProperty('--safe-area-bottom', `${bottom}px`);
  // 네비게이션 바 높이 업데이트
  const navHeight = 60 + Math.max(bottom, 20);
  document.documentElement.style.setProperty('--nav-height', `${navHeight}px`);

  // 동적 뷰포트 높이도 여기서 함께 업데이트 (visualViewport 우선)
  const visual = (window as any).visualViewport;
  const viewportHeight = visual?.height ? visual.height : window.innerHeight;
  const vh = viewportHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  // 디버깅 로그(필요 시 주석 처리 가능)
  console.log('[safeArea] bottom:', bottom, 'vh:', vh, 'navHeight:', navHeight);
};

// 디바운스된 강제 업데이트 (중복 호출 최소화)
export const forceSafeAreaUpdate = (): void => {
  if (updateTimeoutId !== null) {
    window.clearTimeout(updateTimeoutId);
  }
  updateTimeoutId = window.setTimeout(() => {
    // DOM 강제 리플로우로 레이아웃 확정 후 계산
    void document.body.offsetHeight;
    setSafeAreaCSS();
    updateTimeoutId = null;
    console.log('[safeArea] force update');
  }, 100);
};

// 초기화: 중복 방지 + 이벤트 축소(resize, orientationchange만)
export const initializeSafeArea = (): void => {
  if (isSafeAreaInitialized) {
    return;
  }
  isSafeAreaInitialized = true;

  // 최초 1회 설정
  setSafeAreaCSS();

  // 창 크기/회전 변경 시에만 디바운스 업데이트
  window.addEventListener('resize', forceSafeAreaUpdate);
  window.addEventListener('orientationchange', () => {
    // 회전은 약간의 지연 후에 안정된 값을 반영
    setTimeout(forceSafeAreaUpdate, 120);
  });

  // 키보드 토글 등으로 visualViewport 변화 감지 (Android WebView 대응)
  const visual = (window as any).visualViewport;
  if (visual && typeof visual.addEventListener === 'function') {
    visual.addEventListener('resize', forceSafeAreaUpdate);
  }

  // 입력 포커스 해제(키보드 닫힘) 직후 안정화
  window.addEventListener('focusout', () => setTimeout(forceSafeAreaUpdate, 50));

  console.log('[safeArea] initialized');
}; 