import type { NavigateFunction } from 'react-router-dom';

export const logout = async (navigate: NavigateFunction) => {
  try {
    const backendUrl = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000';
    
    // 백엔드에 로그아웃 요청
    await fetch(`${backendUrl}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    // 로컬 스토리지 클리어
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userNickname');

    // fetch 프록시 제거
    delete (window as any).fetch;

    // 홈페이지로 리다이렉트
    navigate('/');

    return true;
  } catch (error) {
    console.error('로그아웃 중 에러 발생:', error);
    return false;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  return !!token;
}; 