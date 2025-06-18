import axios from 'axios';
import { toKST } from '../utils/date';

const axiosInstance = axios.create({
  baseURL: 'https://reconnect-backend.onrender.com/api',
  withCredentials: true,
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

// 응답 인터셉터 추가
axiosInstance.interceptors.response.use(
  (response) => {
    // 응답 데이터에 대해 날짜 변환 함수 실행
    if (response.data) {
      response.data = convertDates(response.data);
    }
    return response;
  },
  (error) => {
    // 응답 에러 처리
    return Promise.reject(error);
  }
);

export default axiosInstance; 