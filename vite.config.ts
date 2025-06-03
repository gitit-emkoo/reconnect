import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; 
import svgr from 'vite-plugin-svgr'; 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    svgr()
  ],
  // server.proxy 섹션 제거 (항상 배포된 백엔드 사용)
  // define 섹션도 불필요 (axiosInstance에 직접 URL 설정)
});