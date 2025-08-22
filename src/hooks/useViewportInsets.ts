import { useEffect } from 'react';

/**
 * visualViewport 기반으로 --vh, --kb CSS 변수를 업데이트합니다.
 * - 1vh 대체값(--vh)
 * - 키보드 높이 추정치(--kb)
 */
export function useViewportInsets() {
  useEffect(() => {
    const root = document.documentElement;

    const setVars = () => {
      // 1vh fallback 변수(키보드 열림/닫힘 반영)
      const vh = window.innerHeight * 0.01;
      root.style.setProperty('--vh', `${vh}px`);

      // 키보드 높이 추정: 전체 높이 - 가시 뷰포트 높이
      const vv = (window as any).visualViewport;
      if (vv) {
        const kb = Math.max(0, window.innerHeight - vv.height - (vv.offsetTop ?? 0));
        root.style.setProperty('--kb', `${Math.round(kb)}px`);
      } else {
        root.style.setProperty('--kb', `0px`);
      }
    };

    setVars();

    const vv = (window as any).visualViewport;
    const onResize = () => setVars();
    const onFocusChange = () => setVars();

    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    window.addEventListener('focusin', onFocusChange);
    window.addEventListener('focusout', onFocusChange);
    if (vv) {
      vv.addEventListener('resize', onResize);
      vv.addEventListener('scroll', onResize);
    }

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      window.removeEventListener('focusin', onFocusChange);
      window.removeEventListener('focusout', onFocusChange);
      if (vv) {
        vv.removeEventListener('resize', onResize);
        vv.removeEventListener('scroll', onResize);
      }
    };
  }, []);
}






