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
    return Math.max(bottomValue, 24);
  }
  
  // 감지된 값이 있으면 사용, 없으면 0px
  return bottomValue > 0 ? bottomValue : 0;
};

// 폴더블 디바이스 감지
export const detectFoldableDevice = (): boolean => {
  const userAgent = navigator.userAgent;
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  
  // 갤럭시 Z 플립/폴드 감지
  const isSamsungFoldable = userAgent.includes('SM-F') || userAgent.includes('SM-G998');
  
  // 화면 비율로 감지 (폴더블은 정사각형 또는 세로 긴 직사각형)
  const aspectRatio = screenWidth / screenHeight;
  const isFoldableRatio = (aspectRatio > 0.85 && aspectRatio < 1.15) || // 정사각형 (Z 폴드)
                         (aspectRatio > 0.4 && aspectRatio < 0.5); // 세로 긴 직사각형 (Z 플립)
  
  // 화면 크기로 감지
  const isFoldableSize = (screenWidth <= 412 && screenHeight <= 915) || 
                        (screenWidth >= 720 && screenWidth <= 840);
  
  return isSamsungFoldable || (isFoldableRatio && isFoldableSize);
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
  
  // 폴더블 디바이스 화면 변화 감지
  if (detectFoldableDevice()) {
    // 폴더블 디바이스는 더 자주 체크
    window.addEventListener('resize', () => {
      setTimeout(setSafeAreaCSS, 50);
    });
    
    // 화면 크기 변화 감지 (접힘/펼침)
    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;
    
    const checkScreenChange = () => {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;
      
      if (Math.abs(currentWidth - lastWidth) > 10 || Math.abs(currentHeight - lastHeight) > 10) {
        setSafeAreaCSS();
        lastWidth = currentWidth;
        lastHeight = currentHeight;
      }
    };
    
    window.addEventListener('resize', checkScreenChange);
  }
}; 