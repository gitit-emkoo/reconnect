import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
  margin: 3rem 0 1rem;
  text-align: center;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #666;
  text-align: center;
  margin-bottom: 2rem;
  max-width: 340px;
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

  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
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

const SubmitButton = styled.button`
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

const ErrorMessage = styled.p`
  color: #FF1493;
  font-size: 0.85rem;
  margin-left: 0.5rem;
`;

const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      alert('유효하지 않은 접근입니다.');
      navigate('/login');
    }
  }, [location, navigate]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      alert('토큰이 없습니다.');
      return;
    }

    try {
      const backendUrl = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000';
      const response = await fetch(`${backendUrl}/users/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword: data.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '비밀번호 재설정 실패');
      }

      alert('비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.');
      navigate('/login');
    } catch (error: any) {
      console.error("비밀번호 재설정 에러:", error.message);
      alert(error.message || '알 수 없는 오류가 발생했습니다.');
    }
  };

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>←</BackButton>
      <Title>비밀번호 재설정</Title>
      <Description>
        새로운 비밀번호를 입력해주세요.
      </Description>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputWrapper>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="새 비밀번호"
            {...register('newPassword')}
          />
          <PasswordToggle 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <CloseEye /> : <OpenEye />}
          </PasswordToggle>
        </InputWrapper>
        {errors.newPassword && <ErrorMessage>{errors.newPassword.message}</ErrorMessage>}

        <InputWrapper>
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="새 비밀번호 확인"
            {...register('confirmPassword')}
          />
          <PasswordToggle 
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <CloseEye /> : <OpenEye />}
          </PasswordToggle>
        </InputWrapper>
        {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>}

        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? '변경 중...' : '비밀번호 변경'}
        </SubmitButton>
      </Form>
    </Container>
  );
};

export default ResetPasswordPage; 