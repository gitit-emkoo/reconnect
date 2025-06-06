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
    const token = localStorage.getItem('accessToken');
    console.log('요청 인터셉터: 로컬 스토리지에서 토큰 가져옴', token); // 로그 추가
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('요청 헤더에 토큰 설정 완료:', config.headers['Authorization']); // 로그 추가
    }
    return config;
  },
  (error) => {
    console.error('요청 인터셉터 에러:', error); // 로그 추가
    return Promise.reject(error);
  }
);

export default axiosInstance; 