import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import useAuthStore from '../store/authStore';
import { type User } from '../types/user';

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
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);

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
          setToken(data.accessToken);
          console.log('액세스 토큰 저장됨');
          const user: User = {
            id: data.userId || '',
            email: data.userEmail || '',
            nickname: data.userNickname,
            provider: 'KAKAO',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setUser(user);
          console.log('사용자 정보 저장됨');
          navigate('/dashboard', { replace: true });
        } else {
          console.error('카카오 인증 상세 에러:', response.data);
          if (axios.isAxiosError(response.data)) {
            console.error('에러 응답:', response.data.response?.data);
            console.error('에러 상태:', response.data.response?.status);
            console.error('에러 헤더:', response.data.response?.headers);
            
            if (response.data.response?.status === 409) {
              alert('이미 가입된 계정입니다. 로그인 페이지로 이동합니다.');
              navigate('/login');
              return;
            }
            alert(response.data.response?.data?.message || '카카오 인증 중 오류가 발생했습니다.');
          } else {
            alert('알 수 없는 오류가 발생했습니다.');
          }
          navigate('/login');
        }
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
  }, [navigate, location, isRegister, setToken, setUser]);

  return (
    <Container>
      <LoadingText>카카오 {isRegister ? '회원가입' : '로그인'} 처리 중...</LoadingText>
    </Container>
  );
};

export default KakaoCallback; 