import type { NavigateFunction } from 'react-router-dom';
import axiosInstance from '../api/axios';

export const logout = async (navigate: NavigateFunction) => {
  try {
    console.log('=== 로그아웃 시도 ===');
    
    await axiosInstance.post('/auth/logout');

    // 로컬 스토리지 클리어
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user'); // 'user' 객체도 삭제

    console.log('=== 로그아웃 완료 ===');
    console.log('⏰ 로그아웃 시간:', new Date().toLocaleString());
    console.log('==================');

    // 홈페이지로 리다이렉트
    navigate('/');

    return true;
  } catch (error) {
    console.error('❌ 로그아웃 중 에러 발생:', error);
    return false;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  return !!token;
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken');
}; 