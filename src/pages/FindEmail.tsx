import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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

const TabContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 340px;
  margin-bottom: 2rem;
`;

const Tab = styled.button<{ $isActive: boolean }>`
  flex: 1;
  padding: 1rem;
  border: none;
  background: none;
  border-bottom: 2px solid ${props => props.$isActive ? '#FF69B4' : '#eee'};
  color: ${props => props.$isActive ? '#333' : '#999'};
  font-size: 1rem;
  font-weight: ${props => props.$isActive ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #333;
  }
`;

const findEmailByPhoneSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  phone: z.string()
    .min(10, '올바른 휴대폰 번호를 입력해주세요')
    .regex(/^[0-9]+$/, '숫자만 입력해주세요'),
});

const findEmailByBirthSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  birthdate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '올바른 생년월일 형식(YYYY-MM-DD)으로 입력해주세요'),
});

type FindEmailByPhoneFormData = z.infer<typeof findEmailByPhoneSchema>;
type FindEmailByBirthFormData = z.infer<typeof findEmailByBirthSchema>;

const FindEmail: React.FC = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState<'phone' | 'birth'>('phone');
  
  const phoneForm = useForm<FindEmailByPhoneFormData>({
    resolver: zodResolver(findEmailByPhoneSchema),
  });

  const birthForm = useForm<FindEmailByBirthFormData>({
    resolver: zodResolver(findEmailByBirthSchema),
  });

  const onSubmitByPhone = async (data: FindEmailByPhoneFormData) => {
    try {
      const backendUrl = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000';
      const response = await fetch(`${backendUrl}/auth/find-email/phone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '이메일 찾기 실패');
      }

      const result = await response.json();
      alert(`찾은 이메일: ${result.email}`);
      navigate('/login');
    } catch (error: any) {
      console.error("이메일 찾기 에러:", error.message);
      alert(error.message || '알 수 없는 오류가 발생했습니다.');
    }
  };

  const onSubmitByBirth = async (data: FindEmailByBirthFormData) => {
    try {
      const backendUrl = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000';
      const response = await fetch(`${backendUrl}/auth/find-email/birth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '이메일 찾기 실패');
      }

      const result = await response.json();
      alert(`찾은 이메일: ${result.email}`);
      navigate('/login');
    } catch (error: any) {
      console.error("이메일 찾기 에러:", error.message);
      alert(error.message || '알 수 없는 오류가 발생했습니다.');
    }
  };

  return (
    <Container>
      <BackButton onClick={() => navigate('/login')}>←</BackButton>
      <Title>이메일 찾기</Title>
      <Description>
        가입 시 등록한 정보로 이메일을 찾을 수 있습니다.
      </Description>

      <TabContainer>
        <Tab 
          $isActive={method === 'phone'} 
          onClick={() => setMethod('phone')}
        >
          휴대폰 번호로 찾기
        </Tab>
        <Tab 
          $isActive={method === 'birth'} 
          onClick={() => setMethod('birth')}
        >
          생년월일로 찾기
        </Tab>
      </TabContainer>

      {method === 'phone' ? (
        <Form onSubmit={phoneForm.handleSubmit(onSubmitByPhone)}>
          <Input
            type="text"
            placeholder="이름"
            {...phoneForm.register('name')}
          />
          {phoneForm.formState.errors.name && (
            <ErrorMessage>{phoneForm.formState.errors.name.message}</ErrorMessage>
          )}

          <Input
            type="tel"
            placeholder="휴대폰 번호 ('-' 없이 입력)"
            {...phoneForm.register('phone')}
          />
          {phoneForm.formState.errors.phone && (
            <ErrorMessage>{phoneForm.formState.errors.phone.message}</ErrorMessage>
          )}

          <SubmitButton type="submit" disabled={phoneForm.formState.isSubmitting}>
            {phoneForm.formState.isSubmitting ? '처리 중...' : '이메일 찾기'}
          </SubmitButton>
        </Form>
      ) : (
        <Form onSubmit={birthForm.handleSubmit(onSubmitByBirth)}>
          <Input
            type="text"
            placeholder="이름"
            {...birthForm.register('name')}
          />
          {birthForm.formState.errors.name && (
            <ErrorMessage>{birthForm.formState.errors.name.message}</ErrorMessage>
          )}

          <Input
            type="date"
            placeholder="생년월일"
            {...birthForm.register('birthdate')}
          />
          {birthForm.formState.errors.birthdate && (
            <ErrorMessage>{birthForm.formState.errors.birthdate.message}</ErrorMessage>
          )}

          <SubmitButton type="submit" disabled={birthForm.formState.isSubmitting}>
            {birthForm.formState.isSubmitting ? '처리 중...' : '이메일 찾기'}
          </SubmitButton>
        </Form>
      )}
    </Container>
  );
};

export default FindEmail; 