import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://reconnect-backend.onrender.com/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('[axiosInstance] baseURL:', axiosInstance.defaults.baseURL); // baseURL 확인 로그 추가

// 요청 인터셉터 추가
axiosInstance.interceptors.request.use(
  (config) => {
    // Zustand에서 토큰을 동적으로 가져옴
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { useAuthStore } = require('../store/authStore');
      const token = useAuthStore.getState().accessToken;
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (e) {
      // Zustand store가 아직 초기화되지 않았을 때는 무시
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance; 