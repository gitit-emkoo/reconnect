import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../utils/validationSchemas';
import { ReactComponent as CloseEye } from '../assets/Icon_CloseEye.svg';
import { ReactComponent as OpenEye } from '../assets/Icon_OpenEye.svg';
import axiosInstance from '../api/axios';
import { useGoogleLogin } from '@react-oauth/google';
import { getKakaoLoginUrl } from '../utils/socialAuth';
import MainImg from '../assets/MainImg.png';
import logoImage from '../assets/Logo.png';
import useAuthStore from '../store/authStore';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #FFE5E5 0%, #E5E5FF 100%);
  padding: 2rem 1.5rem;
  box-sizing: border-box;
`;

const Logo = styled.img`
  width: 180px;
  height: auto;
  margin-bottom: 1.5rem;
`;

const IllustrationWrapper = styled.div`
  width: 100%;
  max-width: 320px;
  aspect-ratio: 16/10;
  position: relative;
  border-radius: 20px;
  margin-bottom: 2rem;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 2px solid #9370DB;
  padding: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%);
  }
`;

const Title = styled.h1`
  font-size: 1.7rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 2rem;
  text-align: center;
  line-height: 1.4;
`;

const SocialLoginButtonContainer = styled.div`
  width: 100%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 1rem;
`;

const SocialLoginButtonStyled = styled.button<{ $isKakao?: boolean }>`
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, box-shadow 0.2s, border-color 0.2s;
  border: 1px solid transparent;

  ${(props) =>
    props.$isKakao
      ? `
    background-color: #FEE500;
    color: #191919;
    &:hover {
      background-color: #f0d800;
    }
  `
      : `
    background-color: #FFFFFF;
    color: #444444;
    border-color: #E0E0E0;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    &:hover {
      background-color: #f7f7f7;
      border-color: #d0d0d0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `}
`;

const DividerTextStyled = styled.p`
  font-size: 0.9rem;
  color: #999;
  text-align: center;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  width: 100%;
  max-width: 340px;
  display: flex;
  align-items: center;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #999;
    margin: 0 1rem;
  }
`;

const FormWrapper = styled.form`
  width: 100%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #fff;
  font-size: 0.9rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    outline: none;
    border-color: #FF69B4;
    box-shadow: 0 0 0 2px rgba(255, 105, 180, 0.2);
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
  padding: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;

  svg {
    width: 100%;
    height: 100%;
    opacity: 0.5;
  }
  &:hover svg {
    opacity: 0.8;
  }
`;

const FieldErrorMessage = styled.p`
  color: #D32F2F;
  font-size: 0.75rem;
  margin-top: 0.3rem;
  margin-left: 0.2rem;
  width: 100%;
  text-align: left;
`;

const GeneralErrorMessage = styled.p`
  color: #D32F2F;
  font-size: 0.8rem;
  text-align: center;
  margin-bottom: 0.5rem;
  width: 100%;
  max-width: 340px;
`;

const ForgotPasswordLinksContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 0.2rem;
  width: 100%;
  max-width: 340px;
`;

const ForgotLink = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 0.85rem;
  cursor: pointer;
  text-decoration: none;
  padding: 0.2rem;
  transition: color 0.2s;

  &:hover {
    color: #FF69B4;
    text-decoration: underline;
  }
`;

const Button = styled.button`
  width: 100%;
  max-width: 340px;
  padding: 1rem;
  border: none;
  border-radius: 30px;
  background: linear-gradient(to right, #FF69B4, #4169E1);
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
  margin-top: 0.2rem;
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SocialLoginButton: React.FC<{
  onClick: () => void;
  isKakao?: boolean;
  children: React.ReactNode;
}> = ({ onClick, isKakao, children }) => (
  <SocialLoginButtonStyled onClick={onClick} $isKakao={isKakao}>
    {children}
  </SocialLoginButtonStyled>
);

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleSuccessfulLogin = async (token: string) => {
    try {
      useAuthStore.getState().setToken(token);
      const userResponse = await axiosInstance.get('/users/me');
      useAuthStore.getState().setUser(userResponse.data);
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Failed to fetch user after login:', error);
      setLoginError('로그인 후 사용자 정보를 가져오는 데 실패했습니다.');
      useAuthStore.getState().logout();
    }
  };

  const onSubmitEmailLogin: SubmitHandler<LoginFormData> = async (data) => {
    setLoginError('');
    try {
      const response = await axiosInstance.post<{ accessToken: string }>(
        '/auth/login',
        data
      );
      if (response.data && response.data.accessToken) {
        await handleSuccessfulLogin(response.data.accessToken);
      } else {
        throw new Error('로그인 토큰이 없습니다.');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || '로그인에 실패했습니다. 다시 시도해주세요.';
      setLoginError(errorMessage);
    }
  };

  const handleSocialLoginSuccess = async (accessToken: string) => {
    try {
        const response = await axiosInstance.post('/auth/google', { token: accessToken });
        if (response.data && response.data.accessToken) {
            await handleSuccessfulLogin(response.data.accessToken);
        } else {
            setLoginError('소셜 로그인에 실패했습니다.');
        }
    } catch (error) {
        setLoginError('소셜 로그인 처리 중 오류가 발생했습니다.');
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => handleSocialLoginSuccess(tokenResponse.access_token),
    onError: () => {
        setLoginError('Google 로그인에 실패했습니다.');
    },
  });

  const handleKakaoLogin = () => {
    window.location.href = getKakaoLoginUrl();
  };


  return (
    <Container>
      <Logo src={logoImage} alt="Reconnect Logo" />
      <IllustrationWrapper>
        <img src={MainImg} alt="Couple Illustration"/>
      </IllustrationWrapper>

      <Title>다시, 연결</Title>
      <Subtitle>당신의 관계를 위한 새로운 시작</Subtitle>

      <SocialLoginButtonContainer>
        <SocialLoginButton onClick={handleKakaoLogin} isKakao>
          카카오로 시작하기
        </SocialLoginButton>
        <SocialLoginButton onClick={() => googleLogin()}>
          Google로 시작하기
        </SocialLoginButton>
      </SocialLoginButtonContainer>

      <DividerTextStyled>또는</DividerTextStyled>
      {loginError && <GeneralErrorMessage>{loginError}</GeneralErrorMessage>}

      <FormWrapper onSubmit={handleSubmit(onSubmitEmailLogin)}>
        <InputWrapper>
          <StyledInput
            {...register('email')}
            placeholder="이메일 주소"
            type="email"
          />
        </InputWrapper>
        {errors.email && <FieldErrorMessage>{errors.email.message}</FieldErrorMessage>}

        <InputWrapper>
          <StyledInput
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호"
          />
          <PasswordToggle type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <OpenEye /> : <CloseEye />}
          </PasswordToggle>
        </InputWrapper>
        {errors.password && <FieldErrorMessage>{errors.password.message}</FieldErrorMessage>}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '로그인 중...' : '로그인'}
        </Button>
      </FormWrapper>

      <ForgotPasswordLinksContainer>
        <ForgotLink onClick={() => navigate('/find-email')}>이메일 찾기</ForgotLink>
        <ForgotLink onClick={() => navigate('/forgot-password')}>비밀번호 재설정</ForgotLink>
      </ForgotPasswordLinksContainer>

      <Button
        style={{
          marginTop: '1.5rem',
          background: 'transparent',
          color: '#555',
          border: '1px solid #ccc',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
        onClick={() => navigate('/register')}
      >
        회원가입
      </Button>

    </Container>
  );
};

export default LoginPage; 