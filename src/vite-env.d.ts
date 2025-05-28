/// <reference types="vite/client" />

// 선택적으로 VITE_APP_API_URL 같은 커스텀 환경 변수 타입을 여기에 추가할 수 있습니다.
interface ImportMetaEnv {
  readonly VITE_APP_API_URL: string; // VITE_APP_API_URL 타입을 명시적으로 선언
  // 다른 VITE_로 시작하는 환경 변수가 있다면 여기에 추가
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}