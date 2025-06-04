'use client'

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGoogleLogin } from '@react-oauth/google';
import { loginSchema, type LoginFormData } from '../utils/validationSchemas';
import { getKakaoLoginUrl } from '../utils/socialAuth';
import CloseEye from '../assets/Icon_CloseEye.svg?react';
import OpenEye from '../assets/Icon_OpenEye.svg?react';
import { AxiosError } from 'axios';
import axiosInstance from '../api/axios';
import { AuthContext } from '../contexts/AuthContext';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: white;
  padding: 2rem;
`;

const BackButton = styled.button`
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  color: #333;
  font-size: 1.5rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin: 3rem 0 2rem;
  text-align: center;
`;

const SocialLoginButton = styled.button<{ $isKakao?: boolean }>`
  width: 100%;
  max-width: 340px;
  padding: 1rem;
  border: none;
  border-radius: 15px;
  background: ${props => props.$isKakao ? '#FEE500' : '#fff'};
  color: ${props => props.$isKakao ? '#000' : '#333'};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  img {
    width: 24px;
    height: 24px;
    margin-right: 0.5rem;
  }
`;

const Divider = styled.div`
  width: 100%;
  max-width: 340px;
  display: flex;
  align-items: center;
  margin: 2rem 0;
  color: #999;
  font-size: 0.9rem;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #eee;
    margin: 0 1rem;
  }
`;

const Form = styled.form`
  width: 100%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 15px;
  background-color: white;
  font-size: 1rem;
  transition: all 0.2s;

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
    -webkit-text-fill-color: #333 !important;
  }

  &:focus {
    outline: none;
    border-color: #FF69B4;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  &::placeholder {
    color: #999;
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;

  svg {
    width: 100%;
    height: 100%;
    opacity: 0.5;
    transition: opacity 0.2s;
  }

  &:hover svg {
    opacity: 0.8;
  }
`;

const ErrorMessage = styled.p`
  color: #FF1493;
  font-size: 0.85rem;
  margin-left: 0.5rem;
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 15px;
  background: linear-gradient(to right, #FF69B4, #4169E1);
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ForgotPassword = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;
  text-align: center;
  text-decoration: underline;
  padding: 0;

  &:hover {
    color: #333;
  }
`;

const SignUpText = styled.p`
  margin-top: 3rem;
  text-align: center;
  color: #666;
  font-size: 0.9rem;

  a {
    color: #4169E1;
    text-decoration: none;
    font-weight: 500;
    margin-left: 0.5rem;
    cursor: pointer;

    &:hover {
    text-decoration: underline;
    }
  }
`;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [googleError, setGoogleError] = useState<string>('');
  const { setUser } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setGoogleError('');
        const response = await axiosInstance.post(
          '/auth/google/login',
          { access_token: tokenResponse.access_token }
        );
        if (response.data.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken);
          if (response.data.user) {
            setUser(response.data.user);
          }
          navigate('/dashboard', { replace: true });
        }
      } catch (error: any) {
        console.error('구글 로그인 에러 전체:', error);
        console.log('error.response:', error?.response);
        console.log('error.response.data:', error?.response?.data);
        console.log('error.response.data.message:', error?.response?.data?.message);
        console.log('error.message:', error?.message);

        // 가능한 모든 경로에서 메시지를 우선적으로 찾기
        const backendMsg =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          '구글 로그인 중 오류가 발생했습니다.';
        setGoogleError(backendMsg);
      }
    },
    onError: () => {
      setGoogleError('구글 로그인 중 오류가 발생했습니다.');
    }
  });

  const handleKakaoLogin = () => {
    window.location.href = getKakaoLoginUrl();
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      const requestUrl = `${axiosInstance.defaults.baseURL}/auth/login`;
      console.log('[Login onSubmit] Requesting URL:', requestUrl);
      console.log('[Login onSubmit] Request data:', data);

      const response = await axiosInstance.post('/auth/login', data);
      
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        
        if (response.data.user) {
          setUser(response.data.user);
          console.log('로그인 성공:', response.data.user);
        }
        
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('[Login onSubmit] Full error object:', error);
      if (error instanceof AxiosError) {
        console.error('[Login onSubmit] Axios error response:', error.response);
        setError(error.response?.data?.message || '로그인에 실패했습니다.');
      } else {
        setError('로그인 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <Container>
      <BackButton onClick={() => navigate('/')}>←</BackButton>
      <Title>Welcome Back!</Title>
      
      <SocialLoginButton $isKakao onClick={handleKakaoLogin}>
        카카오톡으로 로그인하기
      </SocialLoginButton>
      
      <SocialLoginButton onClick={() => googleLogin()}>
        구글로 로그인하기
      </SocialLoginButton>
      {googleError && <ErrorMessage style={{ textAlign: 'center', margin: '0.5rem 0' }}>{googleError}</ErrorMessage>}

      <Divider>이메일로 로그인하기</Divider>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputWrapper>
          <Input
            type="email"
            placeholder="이메일을 입력하세요"
            {...register('email')}
          />
        </InputWrapper>
        {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        
        <InputWrapper>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호를 입력하세요"
            {...register('password')}
          />
          <PasswordToggle 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <OpenEye /> : <CloseEye />}
          </PasswordToggle>
        </InputWrapper>
        {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <LoginButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? '로그인 중...' : '로그인'}
        </LoginButton>

        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '0.5rem' }}>
          <ForgotPassword type="button" onClick={() => navigate('/find-email')}>
            이메일을 잊으셨나요?
          </ForgotPassword>
          <ForgotPassword type="button" onClick={() => navigate('/forgot-password')}>
            비밀번호를 잊으셨나요?
          </ForgotPassword>
        </div>
      </Form>

      <SignUpText>
        계정이 없으신가요?
        <a onClick={() => navigate('/register')}>회원가입</a>
      </SignUpText>
    </Container>
  );
};

export default LoginPage;