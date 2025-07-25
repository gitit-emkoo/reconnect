import type { NavigateFunction } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { removeAuthToken } from './cookies';

export const logout = async (navigate: NavigateFunction) => {
  try {
    console.log('=== 로그아웃 시도 ===');
    
    await axiosInstance.post('/auth/logout');

    // 쿠키 클리어
    removeAuthToken();
    localStorage.removeItem('user');

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