import React, { useState } from 'react';
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

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { answers } = location.state || {};
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  const setAuth = useAuthStore((state) => state.setAuth);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await axiosInstance.post(
          `/auth/google/register`,
          { 
            access_token: tokenResponse.access_token,
            answers,
          },
          { 
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true 
          }
        );

        const data = response.data;
        if (data.accessToken && data.user) {
          setAuth(data.accessToken, data.user);
          console.log("구글 회원가입 성공! 🎉", data);
          alert('구글 회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
          navigate('/login');
        } else {
          // 데이터 구조가 예상과 다를 경우에 대한 처리
          console.error("서버 응답에 accessToken 또는 user 정보가 없습니다.", data);
          alert('회원가입 처리 중 문제가 발생했습니다. 다시 시도해 주세요.');
        }
      } catch (error) {
        console.error('구글 회원가입 에러:', error);
        
        if (axios.isAxiosError(error)) {
          // 409 Conflict - 이미 가입된 사용자
          if (error.response?.status === 409) {
            alert('이미 가입된 이메일입니다. 로그인 페이지로 이동합니다.');
            navigate('/welcome');
            return;
          }

          // 기타 에러
          alert(error.response?.data?.message || '구글 회원가입 중 오류가 발생했습니다.');
        } else {
          alert('알 수 없는 오류가 발생했습니다.');
        }
      }
    },
    onError: () => {
      alert('구글 회원가입 중 오류가 발생했습니다.');
    }
  });

  const handleKakaoRegister = () => {
    const kakaoUrl = getKakaoRegisterUrl();
    const finalUrl = answers ? `${kakaoUrl}&state=${answers}` : kakaoUrl;
    window.location.href = finalUrl;
  };

  const onSubmit = async (data: RegisterFormData) => {
    if (!isChecked) {
      alert("이용약관 및 개인정보 처리방침에 동의해 주세요.");
      return;
    }
    try {
      // 로컬 스토리지에서 비회원 진단 ID 가져오기
      const unauthDiagnosisId = localStorage.getItem('unauthDiagnosisId');

      const response = await axiosInstance.post('/auth/register', {
        email: data.email,
        password: data.password,
        nickname: data.nickname,
        unauthDiagnosisId: unauthDiagnosisId, // 요청에 ID 추가
      });

      if (response.data && response.data.accessToken) {
        setAuth(response.data.user, response.data.accessToken);
        // 성공적으로 연결되었으므로 로컬 스토리지에서 ID 제거
        if (unauthDiagnosisId) {
          localStorage.removeItem('unauthDiagnosisId');
          localStorage.removeItem('baselineDiagnosisAnswers');
        }
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 409) {
            alert("이미 사용 중인 이메일입니다.");
          } else {
            alert("회원가입 중 오류가 발생했습니다.");
          }
        } else {
          alert("알 수 없는 오류가 발생했습니다.");
        }
      }
    }
  };

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>←</BackButton>
      <Title>회원가입</Title>
      
      <SocialLoginButton $isKakao onClick={handleKakaoRegister}>
        카카오톡으로 회원가입
      </SocialLoginButton>
      
      <SocialLoginButton onClick={() => googleLogin()}>
        구글로 회원가입
      </SocialLoginButton>

      <Divider>이메일로 회원가입</Divider>

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
            type="text"
            placeholder="닉네임을 입력하세요"
            {...register('nickname')}
          />
        </InputWrapper>
            {errors.nickname && <ErrorMessage>{errors.nickname.message}</ErrorMessage>}

        <InputWrapper>
            <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호"
              {...register('password')}
            />
          <PasswordToggle type="button" onClick={() => setShowPassword(!showPassword)}>
            {!showPassword ? <CloseEye /> : <OpenEye />}
          </PasswordToggle>
        </InputWrapper>
            {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}

        <InputWrapper>
            <Input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="비밀번호 확인"
              {...register('confirmPassword')}
            />
          <PasswordToggle type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {!showConfirmPassword ? <CloseEye /> : <OpenEye />}
          </PasswordToggle>
        </InputWrapper>
            {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>}

        <CheckboxWrapper onClick={() => setIsChecked(!isChecked)}>
          <CustomCheckbox $isChecked={isChecked} />
          <CheckboxLabel>
            <a onClick={(e) => {
              e.stopPropagation();
              navigate('/terms');
            }}>약관</a>에 동의합니다
          </CheckboxLabel>
        </CheckboxWrapper>

        <RegisterButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? '가입중.....' : '회원 가입하기'}
        </RegisterButton>
        </Form>

        <AlreadyMember>이미 회원이신가요? <a onClick={() => navigate('/login')}>로그인</a></AlreadyMember>
    </Container>
  );
};

export default RegisterPage;