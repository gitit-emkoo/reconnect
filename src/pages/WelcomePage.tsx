import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../utils/validationSchemas';
import { ReactComponent as CloseEye } from '../assets/Icon_CloseEye.svg';
import { ReactComponent as OpenEye } from '../assets/Icon_OpenEye.svg';
import axiosInstance from '../api/axios';
import useAuthStore, { type AuthState } from '../store/authStore';
import { useGoogleLogin } from '@react-oauth/google';
import { getKakaoLoginUrl } from '../utils/socialAuth';
import MainImg from '../assets/MainImg.png';


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
  width: 130px;
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

  &:hover {
    transform: translateY(-2px);
  }
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const LinkText = styled.p`
  margin-top: 1.2rem;
  text-align: center;
  color: #666;
  font-size: 0.9rem;

  a {
    color: #FF69B4;
    text-decoration: underline;
    font-weight: 400;
    margin-left: 0.25rem;
    cursor: pointer;
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

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [googleError, setGoogleError] = useState<string>('');
  const [rememberMe, setRememberMe] = useState(false);
  const setToken = useAuthStore((state: AuthState) => state.setToken);
  const setUser = useAuthStore((state: AuthState) => state.setUser);

  const {
    register, 
    handleSubmit,
    formState: { errors, isSubmitting }, 
    reset, 
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema), 
  });

  const onSubmitEmailLogin: SubmitHandler<LoginFormData> = async (data) => {
    setError('');
    setGoogleError('');
    try {
      const response = await axiosInstance.post('/auth/login', data);
      console.log('로그인 응답:', response.data);
      if (response.data.accessToken) {
        console.log('setToken 호출:', response.data.accessToken, rememberMe);
        setToken(response.data.accessToken, rememberMe);
        if (response.data.user) {
          console.log('setUser 호출:', response.data.user);
          setUser(response.data.user);
        }
        reset();
        navigate('/dashboard', { replace: true });
      } else {
        setError(response.data.message || '이메일 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (err: any) {
      console.error('Email login error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError('');
      setGoogleError('');
      try {
        const response = await axiosInstance.post('/auth/google/login', {
          access_token: tokenResponse.access_token,
        });
        if (response.data.accessToken) {
          setToken(response.data.accessToken, rememberMe);
          if (response.data.user) {
            setUser(response.data.user);
          }
          navigate('/dashboard', { replace: true });
        } else {
          setGoogleError(response.data.message || '구글 로그인에 실패했습니다. 다시 시도해주세요.');
        }
      } catch (err: any) {
        console.error('Google login API error:', err);
        const errorMsg = err.response?.data?.message || '구글 로그인 중 오류가 발생했습니다.';
        if (err.response?.status === 404 && err.response?.data?.message.includes('User not found')){
          setGoogleError('등록되지 않은 사용자입니다. 회원가입을 먼저 진행해주세요.');
        } else if (err.response?.data?.message) {
          setGoogleError(err.response.data.message);
        } else {
          setGoogleError(errorMsg);
        }
      }
    },
    onError: (hookError) => {
      console.error('Google login hook error:', hookError);
      setError('');
      setGoogleError('구글 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.');
    },
  });

  const handleKakaoLogin = () => {
    setError('');
    setGoogleError('');
    window.location.href = getKakaoLoginUrl() + `&state=${rememberMe ? 'remember' : 'session'}`;
  };

  return (
    <Container>
      <Logo 
        src="/images/reconnect.png" 
        alt="Reconnect" 
        onLoad={() => setLogoLoaded(true)}
        style={{ opacity: logoLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
      />
      <IllustrationWrapper>
        <img 
          src={MainImg} 
          alt="Couple illustration" 
          onLoad={() => setImageLoaded(true)}
          style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
        />
      </IllustrationWrapper>
      <Title>다시한번 따뜻해지는 우리</Title>
      <Subtitle>마음을 다시 잇는 작은 습관! 리커넥트로 시작하세요</Subtitle>

      <SocialLoginButtonContainer>
        <SocialLoginButton isKakao onClick={handleKakaoLogin}>
          카카오로 로그인
        </SocialLoginButton>
        <SocialLoginButton onClick={() => googleLogin()}>
          구글로 로그인
        </SocialLoginButton>
      </SocialLoginButtonContainer>

      {googleError && 
        <GeneralErrorMessage 
          role="alert" 
          style={{ marginBottom: '1rem' }}
        >
          {googleError}
        </GeneralErrorMessage>
      }

      <DividerTextStyled>이메일로 로그인하기</DividerTextStyled>

      <FormWrapper onSubmit={handleSubmit(onSubmitEmailLogin)}>
        <InputWrapper>
          <StyledInput 
            type="email" 
            placeholder="이메일 주소" 
            {...register('email')}
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email && <FieldErrorMessage role="alert">{errors.email.message}</FieldErrorMessage>}
        </InputWrapper>

        <InputWrapper>
          <StyledInput 
            type={showPassword ? 'text' : 'password'} 
            placeholder="비밀번호" 
            {...register('password')}
            aria-invalid={errors.password ? "true" : "false"}
          />
          <PasswordToggle type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}>
            {showPassword ? <OpenEye /> : <CloseEye />}
          </PasswordToggle>
          {errors.password && <FieldErrorMessage role="alert">{errors.password.message}</FieldErrorMessage>}
        </InputWrapper>

        <div style={{ width: '100%', maxWidth: 340, margin: '0.5rem 0', display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={() => setRememberMe((prev) => !prev)}
            style={{ marginRight: 8 }}
          />
          <label htmlFor="rememberMe" style={{ fontSize: '0.9rem', color: '#666', cursor: 'pointer' }}>
            로그인 정보 저장
          </label>
        </div>

        {error && <GeneralErrorMessage role="alert">{error}</GeneralErrorMessage>}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '로그인 중...' : 'LOG IN'}
        </Button>

        <ForgotPasswordLinksContainer>
          <ForgotLink type="button" onClick={() => navigate('/find-email')}>
            이메일 찾기
          </ForgotLink>
          <ForgotLink type="button" onClick={() => navigate('/forgot-password')}>
            비밀번호 재설정
          </ForgotLink>
        </ForgotPasswordLinksContainer>
      </FormWrapper>

      <LinkText>
        계정이 없으신가요?
        <a onClick={() => navigate('/register')}>회원가입</a>
      </LinkText>
    </Container>
  );
};

export default WelcomePage; 