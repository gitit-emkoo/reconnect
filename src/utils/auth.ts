import type { NavigateFunction } from 'react-router-dom';

export const logout = async (navigate: NavigateFunction) => {
  try {
    console.log('=== 로그아웃 시도 ===');
    console.log('📧 현재 로그인된 사용자:', localStorage.getItem('userNickname'));
    
    const backendBaseUrl = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000';
    const token = localStorage.getItem('accessToken');
    
    // 백엔드에 로그아웃 요청 (경로에 '/api' 추가)
    await fetch(`${backendBaseUrl}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // 로컬 스토리지 클리어
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userNickname');

    // 토큰이 정상적으로 삭제되었는지 확인
    const remainingToken = localStorage.getItem('accessToken');
    const remainingNickname = localStorage.getItem('userNickname');

    console.log('=== 로그아웃 완료 ===');
    console.log('🔑 토큰 삭제 여부:', remainingToken === null ? '성공' : '실패');
    console.log('👤 닉네임 삭제 여부:', remainingNickname === null ? '성공' : '실패');
    console.log('⏰ 로그아웃 시간:', new Date().toLocaleString());
    console.log('==================');

    // fetch 프록시 제거
    delete (window as any).fetch;

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