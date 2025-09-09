import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import useAuthStore from '../store/authStore';
import { type User } from '../types/user';
import axios from 'axios';
import axiosInstance from '../api/axios';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: white;
`;

const LoadingText = styled.p`
  font-size: 1.2rem;
  color: #333;
`;

const KakaoCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isRegister = location.pathname.includes('register');
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const handleKakaoCallback = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get('code');
      
      console.log('현재 경로:', location.pathname);
      console.log('isRegister:', isRegister);
      console.log('인증 코드:', code);
      
      if (!code) {
        alert('카카오 인증 코드를 받아오지 못했습니다.');
        navigate('/login');
        return;
      }

      try {
        // 통합 API 사용 (로그인/회원가입 구분 없음)
        const endpoint = '/auth/kakao/signin';
        
        console.log('요청 엔드포인트:', endpoint);
        console.log('전체 요청 URL:', `${import.meta.env.VITE_APP_API_URL}${endpoint}`);
        
        const response = await axiosInstance.post<{ user: User; accessToken: string; isNewUser: boolean }>(
          endpoint,
          { code }
        );

        const { user, accessToken, isNewUser } = response.data;
        if (user && accessToken) {
          setAuth(accessToken, user);
          console.log('액세스 토큰 저장됨');
          console.log('사용자 정보 저장됨');
          
          // 신규 사용자인 경우 환영 메시지 표시
          if (isNewUser) {
            alert('리커넥트에 오신 것을 환영합니다! 🎉\n자동으로 회원가입이 완료되었습니다.');
          }
          
          navigate('/dashboard', { replace: true });
        } else {
          console.error('카카오 인증 상세 에러:', response.data);
          alert('카카오 인증 중 오류가 발생했습니다.');
          navigate('/login');
        }
      } catch (error) {
        console.error('카카오 인증 상세 에러:', error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 409) {
            alert('이미 다른 방식으로 가입된 이메일입니다.');
          } else {
            alert(error.response?.data?.message || '카카오 인증 중 오류가 발생했습니다.');
          }
        } else {
          alert('알 수 없는 오류가 발생했습니다.');
        }
        navigate('/login');
      }
    };

    handleKakaoCallback();
  }, [navigate, location, isRegister, setAuth]);

  return (
    <Container>
      <LoadingText>카카오 {isRegister ? '회원가입' : '로그인'} 처리 중...</LoadingText>
    </Container>
  );
};

export default KakaoCallback; 