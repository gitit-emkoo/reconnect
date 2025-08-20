import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContainer as BaseAuthContainer } from '../styles/CommonStyles';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '../utils/validationSchemas';
import { ReactComponent as CloseEye } from '../assets/Icon_CloseEye.svg';
import { ReactComponent as OpenEye } from '../assets/Icon_OpenEye.svg';
import { ReactComponent as AppleIcon } from '../assets/btn_apple.svg';
import { ReactComponent as GoogleIcon } from '../assets/btn_google.svg';
import { ReactComponent as KakaoIcon } from '../assets/btn_kakao.svg';
import { useGoogleLogin } from '@react-oauth/google';
import { getKakaoRegisterUrl, signInWithApple } from '../utils/socialAuth';
import axiosInstance from '../api/axios';
import { isAxiosError } from 'axios';
import useAuthStore from '../store/authStore';
import ConfirmationModal from '../components/common/ConfirmationModal';
import BackButton from '../components/common/BackButton';
import TermsContent from './TermsContent';
import PrivacyContent from './PrivacyContent';

const Container = styled(BaseAuthContainer)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin: 3rem 0 2rem;
  text-align: center;
`;

const SocialLoginButton = styled.button<{ $isKakao?: boolean; $isApple?: boolean }>`
  width: 100%;
  max-width: 340px;
  padding: 1rem;
  border: none;
  border-radius: 15px;
  background: ${props => {
    if (props.$isKakao) return '#FEE500';
    if (props.$isApple) return '#000000';
    return '#fff';
  }};
  color: ${props => {
    if (props.$isKakao) return '#000';
    if (props.$isApple) return '#FFFFFF';
    return '#333';
  }};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s;

  &:hover {
    background: ${props => {
      if (props.$isKakao) return '#f0d800';
      if (props.$isApple) return '#333333';
      return '#f7f7f7';
    }};
  }

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
    background: #999;
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

const RegisterButton = styled.button`
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

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  cursor: pointer;
`;

const CustomCheckbox = styled.div<{ $isChecked: boolean }>`
  width: 20px;
  height: 20px;
  border: 2px solid ${props => props.$isChecked ? '#FF69B4' : '#666'};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  background-color: ${props => props.$isChecked ? '#FF69B4' : 'transparent'};
  position: relative;

  &:after {
    content: '';
    display: ${props => props.$isChecked ? 'block' : 'none'};
    width: 6px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    position: absolute;
    top: 2px;
  }
`;

// 약관/개인정보처리방침 모달 텍스트 스타일
const PolicyModalContent = styled.div`
  font-size: 0.7rem;
  line-height: 1;
  color: #333;
  text-align: left;
  margin-bottom: 1rem; 
`;

// CheckboxLabel 폰트 크기 약간 줄임
const CheckboxLabel = styled.label`
  font-size: 0.86rem;
  color: #666;
  cursor: pointer;

  a {
    color: #FF69B4;
    text-decoration: underline;
  }
`;

const AlreadyMember = styled.div`
  margin-top: 1rem;
  margin-bottom: 8rem;  
  font-size: 0.9rem;
  color: #666;
  text-align: center;

  a {
    color: #FF1493;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { setAuth } = useAuthStore();
  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const payload: any = {
          accessToken: tokenResponse.access_token
        };

        const response = await axiosInstance.post('/auth/google/register', payload);
        const { accessToken, user } = response.data;
        setAuth(accessToken, user);
        
        navigate(from, { replace: true });
      } catch (error: any) {
        console.error('Google register error:', error);
        if (isAxiosError(error) && error.response?.status === 409) {
          setApiError('이미 가입된 사용자입니다. 로그인을 진행해주세요.');
        } else {
          setApiError(error.response?.data?.message || '구글 회원가입에 실패했습니다.');
        }
      }
    },
    onError: (error) => {
      console.error('Google register failed:', error);
      setApiError('구글 회원가입 과정에서 오류가 발생했습니다.');
    },
  });

  const handleKakaoRegister = () => {
    window.location.href = getKakaoRegisterUrl();
  };

  const handleAppleRegister = async () => {
    try {
      const appleResponse = await signInWithApple();
      
      const payload: any = {
        idToken: appleResponse.idToken,
        authorizationCode: appleResponse.authorizationCode,
        user: appleResponse.user
      };

      const response = await axiosInstance.post('/auth/apple/register', payload);
      const { accessToken, user } = response.data;
      setAuth(accessToken, user);
      
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('Apple register error:', error);
      if (isAxiosError(error) && error.response?.status === 409) {
        setApiError('이미 가입된 사용자입니다. 로그인을 진행해주세요.');
      } else {
        setApiError(error.response?.data?.message || 'Apple ID 회원가입에 실패했습니다.');
      }
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    setApiError(null);
    try {
      const payload = {
        email: data.email,
        password: data.password,
        nickname: data.nickname
      };
      
      const response = await axiosInstance.post('/auth/register', payload);
      const { accessToken, user } = response.data;
      setAuth(accessToken, user);
      
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('Register error:', error);
      if (isAxiosError(error) && error.response?.status === 409) {
        setApiError('이미 가입된 사용자입니다. 로그인을 진행해주세요.');
      } else {
        setApiError(error.response?.data?.message || '회원가입에 실패했습니다.');
      }
    }
  };

  return (
    <Container>
      <BackButton />
      <Title>회원가입</Title>
      
      <SocialLoginButton onClick={() => googleLogin()}>
        <GoogleIcon style={{ marginRight: '8px', width: '18px', height: '18px' }} />
        구글로 회원가입
      </SocialLoginButton>
      <SocialLoginButton $isKakao onClick={handleKakaoRegister}>
        <KakaoIcon style={{ marginRight: '8px', width: '28px', height: '28px' }} />
        카카오톡으로 회원가입
      </SocialLoginButton>
      <SocialLoginButton onClick={handleAppleRegister} $isApple={true}>
        <AppleIcon style={{ marginRight: '8px', width: '18px', height: '18px', filter: 'brightness(0) invert(1)' }} />
        Apple로 회원가입
      </SocialLoginButton>

      <Divider>또는 이메일로 회원가입</Divider>

      <Form onSubmit={handleSubmit(onSubmit)}>
        {apiError && <ErrorMessage style={{ textAlign: 'center', marginBottom: '1rem' }}>{apiError}</ErrorMessage>}
        <InputWrapper>
          <Input
            type="email"
            placeholder="이메일"
            {...register('email')}
          />
        </InputWrapper>
        {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        <InputWrapper>
          <Input
            type="text"
            placeholder="닉네임"
            {...register('nickname')}
          />
        </InputWrapper>
        {errors.nickname && <ErrorMessage>{errors.nickname.message}</ErrorMessage>}

        <InputWrapper>
          <Input
            type={passwordShown ? 'text' : 'password'}
            placeholder="비밀번호"
            {...register('password')}
          />
          <PasswordToggle type="button" onClick={() => setPasswordShown(!passwordShown)}>
            {!passwordShown ? <CloseEye /> : <OpenEye />}
          </PasswordToggle>
        </InputWrapper>
        {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}

        <InputWrapper>
          <Input
            type={confirmPasswordShown ? 'text' : 'password'}
            placeholder="비밀번호 확인"
            {...register('confirmPassword')}
          />
          <PasswordToggle type="button" onClick={() => setConfirmPasswordShown(!confirmPasswordShown)}>
            {!confirmPasswordShown ? <CloseEye /> : <OpenEye />}
          </PasswordToggle>
        </InputWrapper>
        {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>}

        <CheckboxWrapper onClick={() => setAgreedToTerms(!agreedToTerms)}>
          <CustomCheckbox $isChecked={agreedToTerms} />
          <CheckboxLabel>
            <a onClick={e => { e.stopPropagation(); setShowTermsModal(true); }}>이용약관</a> 및 <a onClick={e => { e.stopPropagation(); setShowPrivacyModal(true); }}>개인정보 처리방침</a>에 동의합니다.
          </CheckboxLabel>
        </CheckboxWrapper>

        <RegisterButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? '가입 중...' : '회원가입'}
        </RegisterButton>
      </Form>

      <AlreadyMember>이미 회원이신가요? <a onClick={() => navigate('/login')}>로그인</a></AlreadyMember>

      {showTermsModal && (
        <ConfirmationModal
          isOpen={showTermsModal}
          onRequestClose={() => setShowTermsModal(false)}
          onConfirm={() => setShowTermsModal(false)}
          title="이용약관"
          confirmButtonText="확인"
          showCancelButton={false}
        >
          <PolicyModalContent style={{maxHeight:'50vh',overflowY:'auto'}}>
            <TermsContent />
          </PolicyModalContent>
        </ConfirmationModal>
      )}
      {showPrivacyModal && (
        <ConfirmationModal
          isOpen={showPrivacyModal}
          onRequestClose={() => setShowPrivacyModal(false)}
          onConfirm={() => setShowPrivacyModal(false)}
          title="개인정보 처리방침"
          confirmButtonText="확인"
          showCancelButton={false}
        >
          <PolicyModalContent style={{maxHeight:'50vh',overflowY:'auto'}}>
            <PrivacyContent />
          </PolicyModalContent>
        </ConfirmationModal>
      )}
    </Container>
  );
};

export default RegisterPage;