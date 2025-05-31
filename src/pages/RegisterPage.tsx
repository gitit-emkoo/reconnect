import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '../utils/validationSchemas';
import CloseEye from '../assets/Icon_CloseEye.svg?react';
import OpenEye from '../assets/Icon_OpenEye.svg?react';

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

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    if (!isChecked) {
      alert('약관에 동의해주세요.');
      return;
    }

    try {
      const { confirmPassword, ...registerData } = data;
      const backendUrl = import.meta.env.VITE_APP_API_URL;
      console.log('백엔드 URL:', backendUrl);
      console.log('전송할 데이터:', registerData);
      const fullUrl = `${backendUrl}/auth/register`;
      console.log('전체 요청 URL:', fullUrl);
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      console.log('서버 응답 상태:', response.status);
      console.log('서버 응답 헤더:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json();
        console.log('에러 응답 데이터:', errorData);
        throw new Error(errorData.message || '회원가입 실패');
      }

      const result = await response.json();
      console.log("회원가입 성공:", result);
      alert('회원가입 성공! 로그인 페이지로 이동합니다.');
      navigate('/login');
    } catch (error: any) {
      console.error("회원가입 에러:", error.message);
      alert(`회원가입 실패: ${error.message || '알 수 없는 오류'}`);
    }
  };

  return (
    <Container>
      <BackButton onClick={() => navigate('/')}>←</BackButton>
      <Title>Create your account</Title>
      
      <SocialLoginButton $isKakao>
        카카오톡으로 회원가입하기
      </SocialLoginButton>
      
      <SocialLoginButton>
        구글로 회원가입하기
      </SocialLoginButton>

      <Divider>이메일로 회원가입하기</Divider>

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
          {isSubmitting ? '가입중.....' : 'GET STARTED'}
        </RegisterButton>
      </Form>
    </Container>
  );
};

export default RegisterPage;