// src/styles/GlobalStyle.ts
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  :root {
    --font-size-scale: 0.95; /* 전체 폰트 크기 5% 축소로 완화 */
    --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
    --safe-area-inset-top: env(safe-area-inset-top, 0px);
    --safe-area-inset-left: env(safe-area-inset-left, 0px);
    --safe-area-inset-right: env(safe-area-inset-right, 0px);
    --vh: 1vh; /* 동적 뷰포트 높이 */
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans KR", sans-serif;
  }
  
  /* 기본 텍스트 크기 조정 (전체적으로 약간 축소) */
  body {
    font-size: calc(1em * var(--font-size-scale));
    background-color: #fafafa;
      /* 폴더블 디바이스 최적화 */
  min-height: 100vh;
  min-height: 100dvh; /* dynamic viewport height */
  min-height: calc(var(--vh, 1vh) * 100); /* 동적 뷰포트 높이 우선 적용 */
  height: 100%;
  overflow-x: hidden;
    
    /* 상단 여백은 헤더 컴포넌트가 자연스럽게 처리하도록 제거 */
    
    /* 하단 시스템 UI 안전 영역 확보 */
    padding-bottom: max(env(safe-area-inset-bottom), 20px);
  }
  
  /* 제목 요소들은 원래 크기 유지 */
  h1, h2, h3, h4, h5, h6 {
    font-size: revert;
    font-weight: 600;
  }
  
  /* 버튼과 중요한 UI 요소들은 적절한 크기 유지 */
  button, input, select, textarea {
    font-size: revert;
  }
  
  /* 네비게이션 텍스트는 약간만 축소 */
  nav button, nav a {
    font-size: calc(0.9em * var(--font-size-scale));
  }
  
  /* 작은 텍스트는 더 적극적으로 축소 */
  small, .text-sm {
    font-size: calc(0.85em * var(--font-size-scale));
  }
  
  /* 큰 텍스트는 원래 크기 유지 */
  .text-lg, .text-xl, .text-2xl {
    font-size: revert;
  }
  
  /* 특정 컴포넌트별 글씨 크기 조정 */
  .nav-text {
    font-size: 0.75rem !important;
  }
  
  .card-title {
    font-size: 1.1rem !important;
    font-weight: 600;
  }
  
  .card-content {
    font-size: 0.9rem !important;
  }
  
  .button-text {
    font-size: 0.9rem !important;
  }
  
  .input-text {
    font-size: 1rem !important;
  }
  
  /* 모바일에서 더 세밀한 조정 */
  @media screen and (max-width: 768px) {
    body {
      font-size: calc(1em * var(--font-size-scale));
    }
    
    /* 모바일에서 네비게이션 텍스트는 약간 더 크게 */
    nav button, nav a {
      font-size: 0.8rem !important;
    }
    
    /* 모바일에서 버튼 텍스트는 적당한 크기 */
    button {
      font-size: 0.9rem !important;
    }
    
    /* 모바일에서 입력 필드는 원래 크기 */
    input, select, textarea {
      font-size: 1rem !important;
    }
  }
  
  /* 작은 화면에서 추가 조정 */
  @media screen and (max-width: 480px) {
    body {
      font-size: calc(1em * var(--font-size-scale));
    }
    
    /* 작은 화면에서 네비게이션 텍스트는 더 크게 */
    nav button, nav a {
      font-size: 0.85rem !important;
    }
  }
  
  html {
    /* iOS 11 이하 호환성 */
    padding-top: constant(safe-area-inset-top);
    padding-left: constant(safe-area-inset-left);
    padding-right: constant(safe-area-inset-right);
    padding-bottom: constant(safe-area-inset-bottom);
    
    /* iOS 11+ 및 Android */
    padding-top: env(safe-area-inset-top);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
    padding-bottom: env(safe-area-inset-bottom);
    
    /* 웹뷰 전체 화면 지원 */
    height: 100%;
    overflow-x: hidden;
    
    /* 웹뷰 환경에서 Window Insets 통일 처리 */
    @media screen and (display-mode: standalone) {
      padding-bottom: max(env(safe-area-inset-bottom), 24px);
    }
  }
  
  #root {
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    height: 100%;
    
    /* 하단 네비게이션을 위한 여백 확보 (AdBox 사용으로 줄임) */
    padding-bottom: calc(80px + max(env(safe-area-inset-bottom), 8px));
  }
  
  /* Android Chrome 주소창 숨김 처리 */
  @media screen and (display-mode: standalone) {
    body {
      padding-bottom: max(env(safe-area-inset-bottom), 20px);
    }
  }
  
  /* 폴더블 디바이스 특별 처리 */
  @media screen and (max-width: 412px) and (max-height: 915px) {
    /* 갤럭시 Z 플립 감지 */
    html {
      padding-bottom: max(env(safe-area-inset-bottom), 64px);
    }
    
    #root {
      padding-bottom: calc(80px + max(env(safe-area-inset-bottom), 8px));
    }
  }
  
  @media screen and (min-width: 720px) and (max-width: 840px) {
    /* 갤럭시 Z 폴드 감지 */
    html {
      padding-bottom: max(env(safe-area-inset-bottom), 24px);
    }
    
    #root {
      padding-bottom: calc(80px + max(env(safe-area-inset-bottom), 8px));
    }
  }
  
  /* iPhone X 이상 디바이스 */
  @supports (padding: max(0px)) {
    body {
      padding-bottom: max(env(safe-area-inset-bottom), 20px);
    }
    
    #root {
      padding-bottom: calc(80px + max(env(safe-area-inset-bottom), 8px));
    }
  }
  
  /* 폴더블 디바이스 화면 변화 감지 */
  @media (display-mode: fullscreen) {
    /* 전체 화면 모드 */
    body {
      padding-bottom: max(env(safe-area-inset-bottom), 20px);
    }
  }
  
  @media (display-mode: minimal-ui) {
    /* 최소 UI 모드 */
    body {
      padding-bottom: max(env(safe-area-inset-bottom), 20px);
    }
  }
  
  /* 웹뷰 최적화 */
  @media screen and (max-width: 768px) {
    body {
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: none;
    }
  }
`;

export default GlobalStyle;

