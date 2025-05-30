'use client'

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../utils/validationSchemas';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #FFE5E5 0%, #E5E5FF 100%);
  padding: 3rem 1.5rem;
`;

const Logo = styled.img`
  width: 140px;
  height: auto;
  margin-bottom: 2rem;
`;

const IllustrationWrapper = styled.div`
  width: 100%;
  max-width: 340px;
  aspect-ratio: 16/10;
  position: relative;
  border-radius: 20px;
  margin-bottom: 2.5rem;
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

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 2.5rem;
  text-align: center;
`;

const Form = styled.form`
  width: 100%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 15px;
  background-color: white;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    background-color: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  &::placeholder {
    color: #999;
  }
`;

const ErrorMessage = styled.p`
  color: #FF1493;
  font-size: 0.85rem;
  margin-left: 0.5rem;
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 30px;
  background: linear-gradient(to right, #FF69B4, #4169E1);
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s;

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
  margin-top: 1rem;
  text-align: center;
  color: #666;
  font-size: 0.85rem;

  a {
    color: #FF69B4;
    text-decoration: underline;
    font-weight: 400;
    margin-left: 0.25rem;
  }
`;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const backendUrl = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000';
      const response = await fetch(`${backendUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '로그인 실패');
      }

      const result = await response.json();
      console.log("로그인 성공:", result);
      navigate('/Dashboard');
    } catch (error: any) {
      console.error("로그인 에러:", error.message);
      alert(`로그인 실패: ${error.message || '알 수 없는 오류'}`);
    }
  };

  return (
    <Container>
      <Logo src="/src/assets/reconnect.png" alt="Reconnect" />
      <IllustrationWrapper>
        <img src="/src/assets/img1.jpg" alt="Couple illustration" />
      </IllustrationWrapper>
      <Title>다시 관계를 이어보세요</Title>
      <Subtitle>당신의 관계, 리커넥트가 도와줄게요</Subtitle>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="email"
          placeholder="example@email.com"
          {...register('email')}
        />
        {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        
        <Input
          type="password"
          placeholder="비밀번호를 입력하세요"
          {...register('password')}
        />
        {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}

        <LoginButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? '로그인 중...' : 'LOG IN'}
        </LoginButton>
      </Form>

      <LinkText>
        계정이 없으신가요?
        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>
          회원가입
        </a>
      </LinkText>
    </Container>
  );
};

export default LoginPage;