import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; 
import svgr from 'vite-plugin-svgr'; 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    svgr()   
  ],
  define: {
    'import.meta.env.VITE_APP_API_URL': JSON.stringify('https://reconnect-backend.onrender.com')
  }
});