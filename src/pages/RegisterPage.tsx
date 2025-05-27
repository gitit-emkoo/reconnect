import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '../utils/validationSchemas';

// 스타일 컴포넌트는 LoginPage.tsx와 유사하므로 재사용하거나 필요한 부분만 조정하여 사용하세요.
// 여기서는 코드 간결성을 위해 LoginPage.tsx에 정의된 스타일을 그대로 가져왔습니다.
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to top, #e0f2f7, #ffffff);
  padding: 1.5rem;
`;

const AuthBox = styled.div`
  background-color: white;
  padding: 2.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Logo = styled.h1`
  font-family: 'Georgia', serif; // 예시 로고 폰트
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 0.25rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.75rem;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #0ea5e9;
    box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.2);
  }
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 0.25rem;
`;

const SubmitButton = styled.button`
  background-color: #10b981;
  color: white;
  padding: 0.9rem 1.5rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #059669;
  }
  &:disabled {
    background-color: #94a3b8;
    cursor: not-allowed;
  }
`;

const LinkText = styled.p`
  margin-top: 1.5rem;
  font-size: 0.95rem;
  color: #555;

  a {
    color: #0ea5e9;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    console.log("회원가입 시도:", data);
    try {
      // 비밀번호 확인 필드는 백엔드로 전송하지 않음
      const { confirmPassword, ...registerData } = data;

      // 백엔드 회원가입 API URL
      const response = await fetch('http://localhost:3000/auth/register', { // 백엔드 회원가입 API URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // 백엔드 에러 메시지(예: 이메일 중복)를 사용자에게 보여주기
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
      <AuthBox>
        <Logo>Reconnet</Logo> {/* 로고 */}
        <Title>회원가입</Title>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputGroup>
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              {...register('email')}
            />
            {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
          </InputGroup>

<InputGroup>
            <Label htmlFor="nickname">닉네임</Label>
            <Input
              id="nickname"
              type="text" // 텍스트 타입
              placeholder="닉네임"
              {...register('nickname')} // 'nickname'으로 register
            />
            {errors.nickname && <ErrorMessage>{errors.nickname.message}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호 (최소 6자, 대문자, 소문자, 숫자, 특수문자 포함)"
              {...register('password')}
            />
            {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <Label htmlFor="confirmPassword">비밀번호 확인</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="비밀번호 재입력"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>}
          </InputGroup>

          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? '가입 중...' : '회원가입'}
          </SubmitButton>
        </Form>
        <LinkText>
          이미 계정이 있으신가요? <a href="#" onClick={() => navigate('/login')}>로그인</a>
        </LinkText>
      </AuthBox>
    </Container>
  );
};

export default RegisterPage;