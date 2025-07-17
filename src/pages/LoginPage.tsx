import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../utils/validationSchemas';
import { ReactComponent as CloseEye } from '../assets/Icon_CloseEye.svg';
import { ReactComponent as OpenEye } from '../assets/Icon_OpenEye.svg';
import axios from 'axios';
import axiosInstance from '../api/axios';
import { useGoogleLogin } from '@react-oauth/google';
import { getKakaoLoginUrl } from '../utils/socialAuth';
import MainImg from '../assets/Img_LogIn.png';
import logoImage from '../assets/Logo.png';
import useAuthStore from '../store/authStore';
import { User } from '../types/user';
import ConfirmationModal from '../components/common/ConfirmationModal';
import Popup from '../components/common/Popup';

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
  padding: 3px;
  background: linear-gradient(to right, #FF69B4, #785ce2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 17px;
    display: block;
  }
`;

const Subtitle = styled.p`
  position: absolute;
  bottom: 1.5rem;
  left: 0;
  right: 0;
  z-index: 10;
  font-size: 1.3rem;
  color: #785cd2;
  font-weight: 500;
  text-align: center;
  line-height: 1.5;
  text-shadow: 0 2px 4px rgb(248, 242, 242);
  padding: 0 1rem;
`;

const Notice = styled.p`
  font-size: 0.95rem;
  color: #888;
  font-weight: 400;
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

const RegisterPrompt = styled.p`
  width: 100%;
  max-width: 340px;
  text-align: center;
  margin: 1.5rem 0;
  font-size: 0.9rem;
  color: #666;

  span {
    color: #FF69B4;
    font-weight: 600;
    text-decoration: underline;
    cursor: pointer;

    &:hover {
      color: #E0559A;
    }
  }
`;

const ModalRegisterButton = styled.button`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 2px solid #FF69B4;
  border-radius: 12px;
  background-color: #FF69B4;
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;

  &:hover {
    background-color: #FF69B4;
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 105, 180, 0.3);
  }
`;

const DividerTextStyled = styled.p`
  font-size: 0.9rem;
  color: #999;
  text-align: center;
  margin-top: 0;
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
  color: #d32f2f;
  font-size: 0.85rem;
  text-align: center;
  width: 100%;
  max-width: 340px;
  margin-bottom: 1rem;
  min-height: 1.2em; 
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
  background: linear-gradient(to right, #FF69B4, #785ce2);
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
  $isKakao?: boolean;
  children: React.ReactNode;
}> = ({ onClick, $isKakao, children }) => (
  <SocialLoginButtonStyled onClick={onClick} $isKakao={$isKakao}>
    {children}
  </SocialLoginButtonStyled>
);

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();
  const from = location.state?.from?.pathname || '/dashboard';

  const [passwordShown, setPasswordShown] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showFindEmailModal, setShowFindEmailModal] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleSuccessfulLogin = async (user: User, token: string) => {
    setAuth(token, user);
    
    // 즉시 대시보드로 이동 (사용자 경험 개선)
    navigate(from, { replace: true });
    
    // 백그라운드에서 비회원 진단 결과 마이그레이션 (Fire-and-forget)
    const unauthDiagnosisRaw = localStorage.getItem('baselineDiagnosisAnswers');
    if (unauthDiagnosisRaw) {
      try {
        const { score, answers } = JSON.parse(unauthDiagnosisRaw);
        // 비동기로 처리하고 에러 무시
        axiosInstance.post('/diagnosis/unauth', { score, answers }, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000 // 5초 타임아웃
        }).then(() => {
          localStorage.removeItem('baselineDiagnosisAnswers');
        }).catch(err => {
          console.error("Failed to migrate unauth diagnosis", err);
          // 실패해도 사용자 경험에 영향 없음
        });
      } catch (err) {
        console.error("Failed to parse unauth diagnosis", err);
      }
    }

    // 백그라운드에서 온보딩 완료 여부 확인
    try {
      await Promise.race([
        axiosInstance.get('/diagnosis/my-latest', {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 3000 // 3초 타임아웃
        }),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 3000)
        )
      ]);
      
      // 온보딩이 필요한 경우에만 리다이렉트
      // 이미 대시보드에 있으므로 추가 리다이렉트 불필요
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        // 온보딩이 필요한 경우에만 리다이렉트
        navigate('/onboarding/1', { replace: true });
      } else {
        console.error('Failed to check for latest diagnosis, staying on dashboard', error);
        // 에러가 있어도 대시보드에 머무름
      }
    }
  };

  const onSubmitEmailLogin: SubmitHandler<LoginFormData> = async (data) => {
    setLoginError('');
    try {
      const response = await axiosInstance.post<{ user: User; accessToken: string }>(
        '/auth/login',
        data
      );
      const { user, accessToken: token } = response.data;
      if (user && token) {
        setAuth(token, user);
        navigate('/dashboard');
      } else {
        setLoginError('로그인에 실패했습니다. 응답 데이터가 올바르지 않습니다.');
      }
    } catch (error: any) {
      console.error('Email login failed:', error);
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          setLoginError('이메일 또는 비밀번호가 올바르지 않습니다.');
        } else {
          setLoginError(`오류가 발생했습니다: ${error.response.data.message || '다시 시도해주세요.'}`);
        }
      } else {
        setLoginError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    }
  };

  const handleSocialLoginSuccess = async (googleAccessToken: string) => {
    setLoginError('');
    try {
      const response = await Promise.race([
        axiosInstance.post<{ user: User; accessToken: string }>(
          '/auth/google/login',
          { accessToken: googleAccessToken },
          { timeout: 8000 } // 8초 타임아웃
        ),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Login timeout')), 8000)
        )
      ]) as { data: { user: User; accessToken: string } };
      await handleSuccessfulLogin(response.data.user, response.data.accessToken);
    } catch (error) {
      console.error('Google login failed:', error);
      if (error instanceof Error && error.message === 'Login timeout') {
        setLoginError('로그인이 시간 초과되었습니다. 네트워크 상태를 확인하고 다시 시도해주세요.');
      } else {
        setLoginError('구글 로그인에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => handleSocialLoginSuccess(tokenResponse.access_token),
    onError: () => {
      setLoginError('구글 로그인 중 오류가 발생했습니다.');
    },
  });

  const handleKakaoLogin = () => {
    window.location.href = getKakaoLoginUrl();
  };

  const handleFindEmailClick = () => {
    setShowFindEmailModal(true);
  };

  return (
    <Container>
      <Logo src={logoImage} alt="Reconnect Logo" />
      
      <IllustrationWrapper>
        <img src={MainImg} alt="Login Illustration" />
        <Subtitle>
          나를 더 아끼고 행복하게 해줄<br />
          정서기반 케어 솔루션
        </Subtitle>
      </IllustrationWrapper>

      {/* 환영 팝업 */}
      {showWelcomePopup && (
        <Popup
          isOpen={showWelcomePopup}
          onClose={() => setShowWelcomePopup(false)}
          title="리커넥트에 오신 것을 환영해요! 💕"
        >
          <div style={{ textAlign: 'left', lineHeight: '1.6' }}>
            <p style={{ marginBottom: '20px', fontSize: '16px', color: '#333' }}>
              나를 더 아끼고 행복하게 해줄 정서기반 케어 솔루션 리커넥트에 오신 것을 환영해요!
            </p>
            
            <div style={{ 
              background: 'linear-gradient(135deg, #FFE5E5 0%, #E5E5FF 100%)', 
              padding: '20px', 
              borderRadius: '12px',
              marginBottom: '20px'
            }}>
              <h3 style={{ 
                color: '#FF69B4', 
                marginBottom: '15px', 
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                🎉 이벤트 기간 가입 혜택
              </h3>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                margin: 0,
                fontSize: '15px',
                color: '#555'
              }}>
                <li style={{ marginBottom: '8px' }}>✅ 결혼생활 정식 진단</li>
                <li style={{ marginBottom: '8px' }}>✅ 책임이 담긴 인증 합의서 무제한 발행</li>
                <li style={{ marginBottom: '8px' }}>✅ 감정 일기 분석 + AI감정 리포트 제공</li>
              </ul>
            </div>
            
            <p style={{ 
              fontSize: '16px', 
              color: '#FF69B4', 
              fontWeight: 'bold',
              textAlign: 'center',
              margin: 0
            }}>
              지금 바로 나와 우리의 관계를 더 깊고 건강하게 만들어 보세요! 💖
            </p>
          </div>
          <ModalRegisterButton onClick={() => navigate('/register')}>
            시작하기
          </ModalRegisterButton>
        </Popup>
      )}

      {/* 기존 로그인 폼 */}
      <Notice>
        소셜 계정으로 간편하게 로그인하거나<br />
        이메일과 비밀번호를 입력해주세요
      </Notice>
      <SocialLoginButtonContainer>
        <SocialLoginButton onClick={handleKakaoLogin} $isKakao>
          카카오로 시작하기
        </SocialLoginButton>
        <SocialLoginButton onClick={googleLogin} $isKakao={false}>
          <svg width="18" height="18" viewBox="0 0 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}><g clipPath="url(#clip0_105_2)"><path d="M17.64 9.20455C17.64 8.56682 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.9705 13.0009 12.9232 12.0477 13.5618V15.8195H14.7564C16.4836 14.2418 17.64 11.9464 17.64 9.20455Z" fill="#4285F4"></path><path d="M9 18C11.43 18 13.4673 17.1941 14.7564 15.8195L12.0477 13.5618C11.2418 14.1018 10.2118 14.4205 9 14.4205C6.96182 14.4205 5.23455 13.0218 4.50909 11.1714H1.70273V13.495C3.01273 16.1495 5.79545 18 9 18Z" fill="#34A853"></path><path d="M4.50909 11.1714C4.28864 10.5214 4.15636 9.82682 4.15636 9.11C4.15636 8.39318 4.28864 7.69864 4.50909 7.04864V4.725H1.70273C1.03773 6.04636 0.635455 7.53318 0.635455 9.11C0.635455 10.6868 1.03773 12.1736 1.70273 13.495L4.50909 11.1714Z" fill="#FBBC05"></path><path d="M9 3.79955C10.3173 3.79955 11.5073 4.265 12.4782 5.19182L14.8218 2.84818C13.4636 1.58773 11.43 0.889545 9 0.889545C5.79545 0.889545 3.01273 2.85045 1.70273 5.50409L4.50909 7.75182C5.23455 5.90136 6.96182 3.79955 9 3.79955Z" fill="#EA4335"></path></g><defs><clipPath id="clip0_105_2"><rect width="18" height="18" fill="white"></rect></clipPath></defs></svg>
          Google로 계속하기
        </SocialLoginButton>
      </SocialLoginButtonContainer>
      
      <RegisterPrompt>
        아직 회원이 아니신가요?{' '}
        <span onClick={() => navigate('/register')}>회원가입</span>
      </RegisterPrompt>

      <DividerTextStyled>OR</DividerTextStyled>

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
            type={passwordShown ? 'text' : 'password'}
            placeholder="비밀번호"
          />
          <PasswordToggle type="button" onClick={() => setPasswordShown(!passwordShown)}>
            {passwordShown ? <OpenEye /> : <CloseEye />}
          </PasswordToggle>
        </InputWrapper>
        {errors.password && <FieldErrorMessage>{errors.password.message}</FieldErrorMessage>}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '로그인 중...' : '이메일로 계속하기'}
        </Button>
      </FormWrapper>

      <ForgotPasswordLinksContainer>
        <ForgotLink onClick={handleFindEmailClick}>이메일 찾기</ForgotLink>
        <ForgotLink onClick={() => navigate('/forgot-password')}>비밀번호 재설정</ForgotLink>
      </ForgotPasswordLinksContainer>

      <ConfirmationModal
        isOpen={showFindEmailModal}
        onRequestClose={() => setShowFindEmailModal(false)}
        onConfirm={() => setShowFindEmailModal(false)}
        title="이메일 찾기"
        message="고객센터에 문의 바랍니다."
        confirmButtonText="확인"
        showCancelButton={false}
      />
    </Container>
  );
};

export default LoginPage; 