// src/pages/LoginPage.tsx
'use client'

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema,type LoginFormData } from '../utils/validationSchemas';

// 스타일 컴포넌트 (생략 - 변경 없음)
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
  font-family: 'Georgia', serif;
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
  background-color: #0ea5e9;
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
    background-color: #0284c7;
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


const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log("로그인 시도:", data);
    try {
      // 주석 해제 및 백엔드 로그인 API URL로 변경
      const response = await fetch('http://localhost:3000/auth/login', { // 백엔드 로그인 API URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // 백엔드 에러 메시지(예: 이메일 또는 비밀번호 불일치)를 사용자에게 보여주기
        throw new Error(errorData.message || '로그인 실패');
      }

      const result = await response.json();
      console.log("로그인 성공 응답:", result); // 백엔드에서 받은 응답 확인

      // --- 핵심 변경 부분 시작 ---
      // 1. 백엔드에서 받은 accessToken을 localStorage에 저장
      if (result.accessToken) {
        localStorage.setItem('accessToken', result.accessToken);
        console.log('Access Token 저장 완료:', result.accessToken);
      }

      // 2. 사용자 정보 (선택 사항, 필요에 따라 저장)
      // 백엔드에서 user 객체를 보낼 경우, 여기서 닉네임 등을 저장할 수 있습니다.
      if (result.user && result.user.nickname) {
          localStorage.setItem('userNickname', result.user.nickname);
          console.log('User Nickname 저장 완료:', result.user.nickname);
      }
      // --- 핵심 변경 부분 끝 ---

      alert('로그인 성공!');
      navigate('/dashboard'); // 예시 경로 (대시보드 페이지 등으로 이동)

    } catch (error: any) {
      console.error("로그인 에러:", error.message);
      alert(`로그인 실패: ${error.message || '알 수 없는 오류'}`);
    }
  };

  return (
    <Container>
      <AuthBox>
        <Logo>Reconnect</Logo>
        <Title>로그인</Title>
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
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호"
              {...register('password')}
            />
            {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
          </InputGroup>

          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? '로그인 중...' : '로그인'}
          </SubmitButton>
        </Form>
        <LinkText>
          계정이 없으신가요? <a href="#" onClick={() => navigate('/register')}>회원가입</a>
        </LinkText>
      </AuthBox>
    </Container>
  );
};

export default LoginPage;