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
    let token;
    try {
      const { useAuthStore } = require('../store/authStore');
      token = useAuthStore.getState().accessToken;
    } catch (e) {}
    // fallback: localStorage/sessionStorage에서 직접 읽기
    if (!token) {
      token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    }
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance; 