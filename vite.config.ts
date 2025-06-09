// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';
import { visualizer } from 'rollup-plugin-visualizer'; // 이 줄을 추가합니다.

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    // 여기에 rollup-plugin-visualizer 플러그인을 추가합니다.
    // 보통 plugins 배열의 가장 마지막에 추가하는 것이 좋습니다.
    visualizer({
      open: true, // 빌드 완료 후 자동으로 리포트를 브라우저에서 엽니다.
      filename: 'bundle-report.html', // 리포트 파일 이름을 지정합니다. (기본적으로 'dist' 폴더에 생성)
      gzipSize: true, // Gzip 압축 후의 크기를 리포트에 표시합니다.
      brotliSize: true, // Brotli 압축 후의 크기를 리포트에 표시합니다.
    }),
  ],
})