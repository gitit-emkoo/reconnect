// 최소 안전영역 초기화: 안드로이드 WebView에서도 안정적으로 하단 inset을 계산해 주입
export function initializeSafeArea(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const root = document.documentElement;

  const setVars = () => {
    try {
      const vv: any = (window as any).visualViewport;
      const layoutHeight = window.innerHeight;
      const visualHeight = vv?.height ?? layoutHeight;
      const offsetTop = vv?.offsetTop ?? 0;

      // 키보드 열림 여부 추정: layout과 visual의 차이가 큰 경우
      const keyboardOpen = layoutHeight - visualHeight > 150;

      // 하단 시스템 제스처/네비 영역 추정값 (키보드 열림 시 0으로 처리)
      const computedBottomInset = keyboardOpen
        ? 0
        : Math.max(0, layoutHeight - (visualHeight + offsetTop));

      // 안드로이드 WebView의 env()가 0인 경우가 많으므로 JS 계산값으로 덮어씀
      root.style.setProperty('--safe-area-inset-bottom', `${Math.round(computedBottomInset)}px`);
      // 키보드 높이 CSS 변수에 반영
      const keyboardHeight = Math.max(0, layoutHeight - visualHeight - (vv?.offsetTop ?? 0));
      root.style.setProperty('--kb', `${Math.round(keyboardHeight)}px`);

      // 기본 네비게이션 높이 값 (NavigationBar의 실제 높이에 맞춤)
      root.style.setProperty('--nav-height', '72px');

      // 동적 뷰포트 높이(dvh) 유사 값
      const viewportHeight = vv?.height || window.innerHeight;
      root.style.setProperty('--vh', `${viewportHeight * 0.01}px`);
    } catch {
      // 안전하게 무시
    }
  };

  setVars();

  const vv: any = (window as any).visualViewport;
  vv?.addEventListener?.('resize', setVars);
  vv?.addEventListener?.('scroll', setVars);
  window.addEventListener('resize', setVars);
  window.addEventListener('orientationchange', setVars);
}

