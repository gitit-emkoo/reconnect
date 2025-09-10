// src/styles/GlobalStyle.ts
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  :root {
    --font-size-scale: 0.95; /* 전체 폰트 크기 5% 축소로 완화 */
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
    height: 100%;
    overflow-x: hidden;
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
    /* OS 텍스트 크기 변경과 관계없이 레이아웃 안정화 */
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
    /* 웹뷰 전체 화면 지원 */
    height: 100%;
    overflow-x: hidden;
    /* 초기 edge-to-edge 미적용 시 검정 하단 노출 방지 */
    background-color: #fafafa;
  }
  
  #root {
    height: 100%;
    padding-top: env(safe-area-inset-top, 0px);
    padding-bottom: env(safe-area-inset-bottom, 0px);
    padding-left: env(safe-area-inset-left, 0px);
    padding-right: env(safe-area-inset-right, 0px);
    box-sizing: border-box;
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

