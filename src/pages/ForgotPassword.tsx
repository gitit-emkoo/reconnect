import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContainer as BaseAuthContainer } from '../styles/CommonStyles';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosInstance from '../api/axios';
import ConfirmationModal from '../components/common/ConfirmationModal';
import BackButton from '../components/common/BackButton';

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

const forgotPasswordSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMsg, setModalMsg] = React.useState('');
  const [modalTitle, setModalTitle] = React.useState('');
  const [isSuccess, setIsSuccess] = React.useState(false);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await axiosInstance.post('/users/forgot-password', { email: data.email });
      setModalTitle('이메일 전송 완료');
      setModalMsg('비밀번호 재설정 링크가 이메일로 발송되었습니다.');
      setIsSuccess(true);
      setModalOpen(true);
    } catch (error: any) {
      console.error("비밀번호 찾기 에러:", error.message);
      setModalTitle('이메일 전송 실패');
      setModalMsg(error?.response?.data?.message || error.message || '알 수 없는 오류가 발생했습니다.');
      setIsSuccess(false);
      setModalOpen(true);
    }
  };

  const handleModalConfirm = () => {
    setModalOpen(false);
    if (isSuccess) {
      navigate('/login');
    }
  };

  return (
    <Container>
      <BackButton onClick={() => navigate('/login')} />
      <Title>비밀번호 찾기</Title>
      <Description>
        가입하신 이메일 주소를 입력해주세요.
        비밀번호 재설정 링크를 보내드립니다.
      </Description>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="email"
          placeholder="이메일을 입력하세요"
          {...register('email')}
        />
        {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}

        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? '처리 중...' : '비밀번호 재설정 링크 받기'}
        </SubmitButton>
      </Form>
      <ConfirmationModal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        onConfirm={handleModalConfirm}
        title={modalTitle}
        message={modalMsg}
        confirmButtonText="확인"
        showCancelButton={false}
      />
    </Container>
  );
};

export default ForgotPassword; 