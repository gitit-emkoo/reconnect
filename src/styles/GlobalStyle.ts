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
    /* 웹뷰 전체 화면 지원 */
    height: 100%;
    overflow-x: hidden;
  }
  
  #root {
    min-height: 100vh;
    min-height: 100dvh;
    height: 100%;
    
    /* 하단 네비게이션을 위한 여백 확보 */
    padding-bottom: 80px;
  }
  
  /* 전체 화면 모드에서 네비게이션 여백 조정 */
  @media (display-mode: fullscreen) {
    #root {
      padding-bottom: 80px;
    }
  }
  
  @media (display-mode: standalone) {
    #root {
      padding-bottom: 80px;
    }
  }
  
  @media (display-mode: minimal-ui) {
    #root {
      padding-bottom: 80px;
    }
  }
  
  /* 웹뷰 최적화 */
  @media screen and (max-width: 768px) {
    body {
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: none;
    }
  }
  
  /* 스크롤 최적화 */
  html {
    scroll-behavior: auto; /* 부드러운 스크롤 비활성화로 즉시 이동 */
  }
  
  body {
    scroll-behavior: auto;
  }
  
  /* 페이지 전환 시 스크롤 위치 초기화 보장 */
  * {
    scroll-behavior: auto;
  }
  
  /* 모바일에서 스크롤 성능 최적화 */
  @media screen and (max-width: 768px) {
    html, body {
      -webkit-overflow-scrolling: touch;
      scroll-behavior: auto;
    }
  }
`;

export default GlobalStyle;

