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
  }
  
  body {
    background-color: #fafafa;
    /* 폴더블 디바이스 최적화 */
    min-height: 100vh;
    min-height: 100dvh; /* dynamic viewport height */
  }
  
  #root {
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
  }
  
  /* 폴더블 디바이스 특별 처리 */
  @media screen and (max-width: 412px) and (max-height: 915px) {
    /* 갤럭시 Z 플립 감지 */
    html {
      padding-bottom: max(env(safe-area-inset-bottom), 32px);
    }
  }
  
  @media screen and (min-width: 720px) and (max-width: 840px) {
    /* 갤럭시 Z 폴드 감지 */
    html {
      padding-bottom: max(env(safe-area-inset-bottom), 24px);
    }
  }
  
  /* 폴더블 디바이스 화면 변화 감지 */
  @media (display-mode: fullscreen) {
    /* 전체 화면 모드 */
  }
  
  @media (display-mode: minimal-ui) {
    /* 최소 UI 모드 */
  }
`;

export default GlobalStyle;

