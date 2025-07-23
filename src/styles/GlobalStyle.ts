// src/styles/GlobalStyle.ts
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans KR", sans-serif;
  }
  
  html {
    /* 웹뷰 환경에서 스크롤바 숨기기 */
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  
  body {
    background-color: #fafafa;
    /* 웹뷰 환경에서 상단 여백 확보 */
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
    
    /* 안드로이드 웹뷰에서 스크롤바 숨기기 */
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }
  
  /* 웹뷰 환경에서 전체 높이 설정 */
  #root {
    min-height: 100vh;
    min-height: 100dvh; /* dynamic viewport height */
    min-height: calc(100vh - var(--vh, 1vh) * 100); /* fallback for older browsers */
    display: flex;
    flex-direction: column;
    /* 웹뷰에서 상단 여백 확보 */
    padding-top: env(safe-area-inset-top);
  }
  
  /* 안드로이드 웹뷰에서 터치 하이라이트 제거 */
  * {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  
  /* 텍스트 입력 필드는 선택 가능하도록 */
  input, textarea, [contenteditable] {
    -webkit-user-select: text;
    -khtml-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
  }
  
  /* 웹뷰에서 스크롤 성능 최적화 */
  .scroll-container {
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }
  
  /* 안드로이드 웹뷰에서 폰트 렌더링 최적화 */
  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }
  
  /* 웹뷰 환경에서 상단 여백 추가 보장 */
  .webview-container {
    padding-top: max(env(safe-area-inset-top), 20px);
  }
  
  /* 안드로이드 웹뷰에서 상태바 영역 확보 */
  @supports (padding-top: env(safe-area-inset-top)) {
    body {
      padding-top: env(safe-area-inset-top);
    }
  }
  
  /* 웹뷰에서 스크롤 성능 최적화 */
  .webview-scroll {
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }
`;

export default GlobalStyle;

