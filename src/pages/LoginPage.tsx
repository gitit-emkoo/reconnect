import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContainer as BaseAuthContainer } from '../styles/CommonStyles';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../utils/validationSchemas';
import { ReactComponent as CloseEye } from '../assets/Icon_CloseEye.svg';
import { ReactComponent as OpenEye } from '../assets/Icon_OpenEye.svg';
import { ReactComponent as AppleIcon } from '../assets/btn_apple.svg';
import { ReactComponent as GoogleIcon } from '../assets/btn_google.svg';
import { ReactComponent as KakaoIcon } from '../assets/btn_kakao.svg';
import axios from 'axios';
import axiosInstance from '../api/axios';
import { useGoogleLogin } from '@react-oauth/google';
import { getKakaoLoginUrl, signInWithApple } from '../utils/socialAuth';
import MainImg from '../assets/Img_couple-problems.jpg';
import logoImage from '../assets/Logo.png';
import useAuthStore from '../store/authStore';
import { User } from '../types/user';
import ConfirmationModal from '../components/common/ConfirmationModal';
import Popup from '../components/common/Popup';

const Container = styled(BaseAuthContainer)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  padding: 2rem 1.5rem;
  box-sizing: border-box;
`;

const Logo = styled.img`
  width: 180px;
  height: auto;
  margin-top: 2rem;
  margin-bottom: 1.5rem;
`;

const IllustrationWrapper = styled.div`
  width: 100%;
  max-width: 340px;
  position: relative;
  border-radius: 20px;
  margin-bottom: 2rem;
  padding: 3px;
  /* background: linear-gradient(to right, #FF69B4, #785ce2); */
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
  bottom: 10rem;
  left: 0;
  right: 0;
  z-index: 10;
  font-size: 1.2rem;
  color:rgb(255, 255, 255);
  font-weight: 500;
  text-align: center;
  line-height: 1.5;
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

const SocialLoginButtonStyled = styled.button<{ $isKakao?: boolean; $isApple?: boolean; $isEmail?: boolean }>`
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

  ${(props) => {
    if (props.$isKakao) {
      return `
        background-color: #FEE500;
        color: #191919;
        &:hover {
          background-color: #f0d800;
        }
      `;
    } else if (props.$isApple) {
      return `
        background-color: #000000;
        color: #FFFFFF;
        border-color: #000000;
        &:hover {
          background-color: #333333;
          border-color: #333333;
        }
      `;
    } else if (props.$isEmail) {
      return `
        background-color: #785cd2;
        color: #FFFFFF;
        border-color: #785cd2;
        &:hover {
          background-color: #6b4fc7;
          border-color: #6b4fc7;
        }
      `;
    } else {
      return `
        background-color: #FFFFFF;
        color: #444444;
        border-color: #E0E0E0;
        box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        &:hover {
          background-color: #f7f7f7;
          border-color: #d0d0d0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `;
    }
  }}
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

const FormWrapper = styled.form<{ $isVisible: boolean }>`
  width: 100%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  max-height: ${props => props.$isVisible ? '500px' : '0'};
  opacity: ${props => props.$isVisible ? '1' : '0'};
  transform: ${props => props.$isVisible ? 'translateY(0)' : 'translateY(-20px)'};
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
  margin-bottom: 1rem;  
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

const SignupPrompt = styled.p`
  width: 100%;
  max-width: 340px;
  text-align: center;
  font-size: 0.9rem;
  color: #fff;
`;

const SignupButton = styled.button`
  width: 100%;
  max-width: 340px;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  background: #785cd2;
  color: white;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  transition: all 0.2s;
  margin-top: 1rem;

  &:hover {
    background: #6B4FC7;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(120, 92, 210, 0.3);
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 340px;
  margin-bottom: 1rem;
`;

const DividerLine = styled.div`
  flex-grow: 1;
  height: 1px;
  background-color: #E0E0E0;
`;

const DividerText = styled.span`
  margin: 0 10px;
  color: #E0E0E0;
  font-size: 0.85rem;
`;

const SocialLoginButton: React.FC<{
  onClick: () => void;
  $isKakao?: boolean;
  $isApple?: boolean;
  $isEmail?: boolean;
  children: React.ReactNode;
}> = ({ onClick, $isKakao, $isApple, $isEmail, children }) => (
  <SocialLoginButtonStyled onClick={onClick} $isKakao={$isKakao} $isApple={$isApple} $isEmail={$isEmail}>
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
  const [showEmailForm, setShowEmailForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleSuccessfulLogin = async (user: User, token: string, isSocialLogin = false) => {
    setAuth(token, user);
    
    if (isSocialLogin) {
      // 소셜 로그인 성공 시 대시보드로 이동 (이전 페이지가 없을 수 있음)
      navigate('/dashboard', { replace: true });
    } else {
      // 이메일 로그인 성공 시 이전 페이지로 이동
      navigate(from, { replace: true });
    }
  };

  const handleEmailLoginToggle = () => {
    setShowEmailForm(!showEmailForm);
    setLoginError(''); // 폼을 토글할 때 에러 메시지 초기화
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
        await handleSuccessfulLogin(user, token);
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
        axiosInstance.post<{ user: User; accessToken: string; isNewUser: boolean }>(
          '/auth/google/signin',
          { 
            accessToken: googleAccessToken
          },
          { timeout: 8000 } // 8초 타임아웃
        ),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Login timeout')), 8000)
        )
      ]);

      const { user, accessToken: token, isNewUser } = response.data;
      if (user && token) {
        await handleSuccessfulLogin(user, token, true);
        
        // 신규 사용자인 경우 환영 메시지 표시
        if (isNewUser) {
          alert('리커넥트에 오신 것을 환영합니다! 🎉\n자동으로 회원가입이 완료되었습니다.');
        }
      } else {
        setLoginError('로그인에 실패했습니다. 응답 데이터가 올바르지 않습니다.');
      }
    } catch (error: any) {
      console.error('Google login failed:', error);
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          setLoginError('가입되지 않은 사용자입니다. 회원가입을 진행해주세요.');
        } else if (error.response.status === 409) {
          setLoginError('이미 다른 방식으로 가입된 이메일입니다.');
        } else {
          setLoginError(`오류가 발생했습니다: ${error.response.data.message || '다시 시도해주세요.'}`);
        }
      } else {
        setLoginError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => handleSocialLoginSuccess(tokenResponse.access_token),
    onError: (errorResponse: { error?: string; error_description?: string; error_uri?: string }) => {
      // 팝업이 사용자에 의해 닫힌 경우 조용히 처리 (에러 메시지 표시 안함)
      if (errorResponse.error === 'access_denied') {
        console.log('Google 로그인 팝업이 사용자에 의해 닫힘');
        return; // 에러 메시지 표시하지 않고 조용히 종료
      }
      setLoginError('구글 로그인 중 오류가 발생했습니다.');
    },
  });

  const handleKakaoLogin = () => {
    window.location.href = getKakaoLoginUrl();
  };

  const handleAppleLogin = async () => {
    try {
      const appleResponse = await signInWithApple();
      
      const response = await axiosInstance.post<{ user: User; accessToken: string; isNewUser: boolean }>(
        '/auth/apple/signin',
        { 
          idToken: appleResponse.idToken,
          authorizationCode: appleResponse.authorizationCode
        }
      );

      const { user, accessToken: token, isNewUser } = response.data;
      if (user && token) {
        await handleSuccessfulLogin(user, token, true);
        
        // 신규 사용자인 경우 환영 메시지 표시
        if (isNewUser) {
          alert('리커넥트에 오신 것을 환영합니다! 🎉\n자동으로 회원가입이 완료되었습니다.');
        }
      } else {
        setLoginError('로그인에 실패했습니다. 응답 데이터가 올바르지 않습니다.');
      }
    } catch (error: any) {
      console.error('Apple login failed:', error);
      
      // 팝업이 사용자에 의해 닫힌 경우 조용히 처리 (에러 메시지 표시 안함)
      if (error?.error === 'popup_closed_by_user' || error?.error === 'user_cancel') {
        console.log('Apple 로그인 팝업이 사용자에 의해 닫힘');
        return; // 에러 메시지 표시하지 않고 조용히 종료
      }
      
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          setLoginError('가입되지 않은 사용자입니다. 회원가입을 진행해주세요.');
        } else if (error.response.status === 409) {
          setLoginError('이미 다른 방식으로 가입된 이메일입니다.');
        } else {
          setLoginError(`오류가 발생했습니다: ${error.response.data.message || '다시 시도해주세요.'}`);
        }
      } else {
        setLoginError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    }
  };

  const handleFindEmailClick = () => {
    setShowFindEmailModal(true);
  };

  return (
    <Container>
      <Logo src={logoImage} alt="Reconnect Logo" />
      
      <IllustrationWrapper>
        <img src={MainImg} alt="Login Illustration" />
        <Subtitle>"내 감정과 관계를 안전하게 만드는 <br/>가장 쉬운 루틴, 지금 시작하세요"</Subtitle>
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
        9.30까지 무료 혜택이 제공됩니다<br />
        바로 혜택을 받아보세요!
      </Notice>
      <SocialLoginButtonContainer>
        <SocialLoginButton onClick={handleKakaoLogin} $isKakao>
          <KakaoIcon style={{ marginRight: '8px', width: '28px', height: '28px' }} />
          카카오로 시작하기
        </SocialLoginButton>
        <SocialLoginButton onClick={googleLogin} $isKakao={false}>
          <GoogleIcon style={{ marginRight: '8px', width: '18px', height: '18px' }} />
          Google로 시작하기
        </SocialLoginButton>
        <SocialLoginButton onClick={handleAppleLogin} $isKakao={false} $isApple={true}>
          <AppleIcon style={{ marginRight: '8px', width: '18px', height: '18px', filter: 'brightness(0) invert(1)' }} />
          Apple로 시작하기
        </SocialLoginButton>
        
        {showEmailForm && (
          <>
            <Divider>
              <DividerLine />
              <DividerText>이메일로 시작하기</DividerText>
              <DividerLine />
            </Divider>
          </>
        )}
        
        {!showEmailForm && (
          <SocialLoginButton onClick={handleEmailLoginToggle} $isKakao={false} $isApple={false} $isEmail>
            <img src="/images/favicon.png" style={{ marginRight: '8px', width: '18px', height: '18px' }} alt="Reconnect" />
            이메일로 시작하기
          </SocialLoginButton>
        )}
      </SocialLoginButtonContainer>

      {loginError && <GeneralErrorMessage>{loginError}</GeneralErrorMessage>}

      {showEmailForm && (
        <FormWrapper onSubmit={handleSubmit(onSubmitEmailLogin)} $isVisible={showEmailForm}>
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

          <ForgotPasswordLinksContainer>
            <ForgotLink onClick={handleFindEmailClick}>이메일 찾기</ForgotLink>
            <ForgotLink onClick={() => navigate('/forgot-password')}>비밀번호 재설정</ForgotLink>
          </ForgotPasswordLinksContainer>

          <SignupPrompt>
            이메일 계정이 없으신가요? <br/>간편하게 생성 후 시작하세요
          </SignupPrompt>
          
          <SignupButton type="button" onClick={() => navigate('/register')}>
            <img src="/images/favicon.png" style={{ marginRight: '8px', width: '18px', height: '18px' }} alt="Reconnect" />
            이메일 계정 생성
          </SignupButton>
        </FormWrapper>
      )}

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