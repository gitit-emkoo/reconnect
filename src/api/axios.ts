import axios from 'axios';
import { toKST } from '../utils/date';
import useAuthStore from '../store/authStore';

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'https://reconnect-backend.onrender.com'}/api`,
  withCredentials: true,
  timeout: 10000, // 10초 전역 타임아웃 추가
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('[axiosInstance] baseURL:', axiosInstance.defaults.baseURL); // baseURL 확인 로그 추가

// ISO 8601 날짜 형식 (YYYY-MM-DDTHH:mm:ss.sssZ)을 감지하는 정규식
const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

// 응답 데이터를 재귀적으로 탐색하며 날짜 형식의 문자열을 Date 객체로 변환
const convertDates = (data: any): any => {
  if (data === null || data === undefined || typeof data !== 'object') {
    return data;
  }

  for (const key of Object.keys(data)) {
    const value = data[key];
    if (typeof value === 'string' && isoDateRegex.test(value)) {
      data[key] = toKST(new Date(value));
    } else if (typeof value === 'object') {
      convertDates(value); // 재귀적으로 내부 객체도 변환
    }
  }
  return data;
};

// 요청 인터셉터 추가
axiosInstance.interceptors.request.use(
  (config) => {
    // 쿠키에서 토큰을 읽어옵니다.
    const getCookie = (name: string): string | null => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
      return null;
    };
    
    const accessToken = getCookie('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가 (토큰 갱신 로직 - 임시 비활성화)
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // 임시로 토큰 갱신 로직 비활성화 (무한 루프 방지)
    if (error.response?.status === 401) {
      console.log('401 Unauthorized - 로그아웃 처리');
      useAuthStore.getState().logout();
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 