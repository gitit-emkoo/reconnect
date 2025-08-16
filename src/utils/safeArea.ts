// 최소 안전영역 초기화: 하단 네비게이션/키보드 대응을 위한 CSS 변수 세팅
// 기존 복잡 로직이 제거된 상태이므로, 필수 변수만 설정합니다.

export function initializeSafeArea(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const root = document.documentElement;

  const setVars = () => {
    try {
      // 모바일 환경에서 안전영역 하단 inset 적용 (지원되지 않으면 0으로 동작)
      root.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom)');
      // 기본 네비게이션 높이 값 (페이지 전역에서 사용)
      if (!root.style.getPropertyValue('--nav-height')) {
        root.style.setProperty('--nav-height', '80px');
      }
      // 동적 뷰포트 높이(dvh)와 유사하게 화면 높이 기준값 설정
      const viewportHeight = (window as any).visualViewport?.height || window.innerHeight;
      root.style.setProperty('--vh', `${viewportHeight * 0.01}px`);
    } catch {
      // 안전하게 무시
    }
  };

  setVars();

  const vv: any = (window as any).visualViewport;
  if (vv && typeof vv.addEventListener === 'function') {
    vv.addEventListener('resize', setVars);
  }
  window.addEventListener('orientationchange', setVars);
}

