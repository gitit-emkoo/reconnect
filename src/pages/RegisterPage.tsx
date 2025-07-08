import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '../utils/validationSchemas';
import { ReactComponent as CloseEye } from '../assets/Icon_CloseEye.svg';
import { ReactComponent as OpenEye } from '../assets/Icon_OpenEye.svg';
import { useGoogleLogin } from '@react-oauth/google';
import { getKakaoRegisterUrl } from '../utils/socialAuth';
import axios from 'axios';
import axiosInstance from '../api/axios';
import useAuthStore from '../store/authStore';
import ConfirmationModal from '../components/common/ConfirmationModal';
import TermsContent from './TermsContent';
import PrivacyContent from './PrivacyContent';

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

const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  color: #666;
  cursor: pointer;

  a {
    color: #FF69B4;
      text-decoration: underline;
  }
`;

const AlreadyMember = styled.div`
  margin-top: 1rem;
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

const getUnauthDiagnosisData = () => {
  const unauthResult = localStorage.getItem('baselineDiagnosisAnswers');
  if (unauthResult) {
    try {
      const { score, answers } = JSON.parse(unauthResult);
      return { unauthDiagnosis: { score, answers } };
    } catch (e) {
      console.error('Failed to parse unauth diagnosis data', e);
      return {};
    }
  }
  return {};
};

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
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

  useEffect(() => {
    const unauthResult = localStorage.getItem('baselineDiagnosisAnswers');
    if (!unauthResult) {
      setShowDiagnosisModal(true);
    }
  }, []);

  const handleConfirmDiagnosis = () => {
    navigate('/diagnosis');
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const payload: any = {
          accessToken: tokenResponse.access_token,
          ...getUnauthDiagnosisData(),
        };

        const response = await axiosInstance.post('/auth/google/register', payload);
        const { accessToken, user } = response.data;
        setAuth(accessToken, user);
        navigate(from, { replace: true });
      } catch (error: any) {
        console.error('Google login error:', error);
        setApiError(error.response?.data?.message || '구글 로그인에 실패했습니다.');
      }
    },
    onError: (error) => {
      console.error('Google login failed:', error);
      setApiError('구글 로그인 과정에서 오류가 발생했습니다.');
    },
  });

  const handleKakaoRegister = () => {
    window.location.href = getKakaoRegisterUrl();
  };

  const onSubmit = async (data: RegisterFormData) => {
    if (!agreedToTerms) {
      setApiError('이용약관 및 개인정보 처리방침에 동의해야 합니다.');
      return;
    }
    setApiError(null);
    try {
      const payload = {
        email: data.email,
        password: data.password,
        nickname: data.nickname,
        ...getUnauthDiagnosisData(),
      };
      
      const response = await axiosInstance.post('/auth/register', payload);
      const { accessToken, user } = response.data;
      setAuth(accessToken, user);
      
      localStorage.removeItem('baselineDiagnosisAnswers');

      navigate(from, { replace: true });
    } catch (error: any) {
      console.error(error);
      if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else {
        setApiError('회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    }
  };

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>←</BackButton>
      <Title>회원가입</Title>
      
      <SocialLoginButton onClick={() => googleLogin()}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google logo" />
        구글로 회원가입
      </SocialLoginButton>
      <SocialLoginButton $isKakao onClick={handleKakaoRegister}>
        카카오톡으로 회원가입
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

      <ConfirmationModal
        isOpen={showDiagnosisModal}
        onRequestClose={() => setShowDiagnosisModal(false)}
        onConfirm={handleConfirmDiagnosis}
        message="관계온도 진단 기록이 없습니다. 정확한 진단을 위해 먼저 관계온도 진단을 진행해주세요."
        confirmButtonText="진단하러 가기"
        showCancelButton={false}
      />

      {showTermsModal && (
        <ConfirmationModal
          isOpen={showTermsModal}
          onRequestClose={() => setShowTermsModal(false)}
          onConfirm={() => setShowTermsModal(false)}
          title="이용약관"
          confirmButtonText="확인"
          showCancelButton={false}
        >
          <div style={{maxHeight:'50vh',overflowY:'auto'}}><TermsContent /></div>
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
          <div style={{maxHeight:'50vh',overflowY:'auto'}}><PrivacyContent /></div>
        </ConfirmationModal>
      )}
    </Container>
  );
};

export default RegisterPage;