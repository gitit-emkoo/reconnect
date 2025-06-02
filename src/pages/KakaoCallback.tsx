import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

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
        const backendUrl = import.meta.env.VITE_APP_API_URL;
        const endpoint = isRegister ? '/auth/kakao/register' : '/auth/kakao/login';
        
        console.log('백엔드 URL:', backendUrl);
        console.log('요청 엔드포인트:', endpoint);
        console.log('전체 요청 URL:', `${backendUrl}${endpoint}`);
        
        const response = await axios.post(
          `${backendUrl}${endpoint}`,
          { code },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true
          }
        );

        console.log('백엔드 응답:', response.data);

        const { data } = response;
        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
          console.log('액세스 토큰 저장됨');
        }
        if (data.userNickname) {
          localStorage.setItem('userNickname', data.userNickname);
          console.log('사용자 닉네임 저장됨');
        }

        // 회원가입/로그인 성공 후 대시보드로 이동
        navigate('/dashboard', { replace: true });
      } catch (error) {
        console.error('카카오 인증 상세 에러:', error);
        if (axios.isAxiosError(error)) {
          console.error('에러 응답:', error.response?.data);
          console.error('에러 상태:', error.response?.status);
          console.error('에러 헤더:', error.response?.headers);
          
          if (error.response?.status === 409) {
            alert('이미 가입된 계정입니다. 로그인 페이지로 이동합니다.');
            navigate('/login');
            return;
          }
          alert(error.response?.data?.message || '카카오 인증 중 오류가 발생했습니다.');
        } else {
          alert('알 수 없는 오류가 발생했습니다.');
        }
        navigate('/login');
      }
    };

    handleKakaoCallback();
  }, [navigate, location, isRegister]);

  return (
    <Container>
      <LoadingText>카카오 {isRegister ? '회원가입' : '로그인'} 처리 중...</LoadingText>
    </Container>
  );
};

export default KakaoCallback; 