// 안전 영역 계산 유틸리티
export const getSafeAreaBottom = (): number => {
  // CSS env() 값 직접 가져오기
  const safeAreaBottom = getComputedStyle(document.documentElement)
    .getPropertyValue('env(safe-area-inset-bottom)') || '0px';
  
  // px 값을 숫자로 변환
  const bottomValue = parseInt(safeAreaBottom, 10);
  
  // 감지된 값이 있으면 사용, 없으면 0px
  return bottomValue > 0 ? bottomValue : 0;
};

// CSS 변수로 안전 영역 설정
export const setSafeAreaCSS = (): void => {
  const bottom = getSafeAreaBottom();
  document.documentElement.style.setProperty('--safe-area-bottom', `${bottom}px`);
  
  // 디버깅용 로그
  console.log('Safe Area Bottom:', bottom, 'px');
};

// 초기화
export const initializeSafeArea = (): void => {
  // 초기 설정
  setSafeAreaCSS();
  
  // 화면 방향 변경 시 재계산
  window.addEventListener('orientationchange', () => {
    setTimeout(setSafeAreaCSS, 100);
  });
  
  // 리사이즈 시 재계산
  window.addEventListener('resize', setSafeAreaCSS);
}; 