import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Container as BaseContainer } from '../styles/CommonStyles';
import { partnerInvitesApi } from '../api/partnerInvites';
import NavigationBar from '../components/NavigationBar';
import useAuthStore from '../store/authStore';


const Container = styled(BaseContainer)`
  padding: 1.5rem;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
`;

const Form = styled.form`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1.2rem;
  text-align: center;
  letter-spacing: 0.2rem;
  text-transform: uppercase;

  &:focus {
    outline: none;
    border-color: #E64A8D;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #E64A8D;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #c33764;
  }

  &:disabled {
    background-color: #e2e8f0;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  text-align: center;
  margin-top: 1rem;
`;

const SuccessMessage = styled.div`
  color: #059669;
  text-align: center;
  margin-top: 1rem;
`;

const EnterInviteCode: React.FC = () => {
  const navigate = useNavigate();
  const { user, setAuth } = useAuthStore();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('초대 코드를 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await partnerInvitesApi.respondToInvite(code.trim());
      
      // 현재 사용자가 초대한 사람인지, 초대받은 사람인지 확인하여
      // 그에 맞는 토큰과 유저 정보로 인증 상태를 업데이트합니다.
      const currentUserIsInviter = user?.id === response.inviter.id;
      const token = currentUserIsInviter ? response.inviterToken : response.inviteeToken;
      const updatedUser = currentUserIsInviter ? response.inviter : response.invitee;

      setAuth(token, updatedUser);
      // (중복 알림 방지: addNotification 코드 삭제)
      setSuccess('파트너 연결이 완료되었습니다!');
      // 2초 후 대시보드로 이동
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || '초대 코드 입력에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Container>
        <Title>파트너 초대 코드 입력</Title>
        
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="초대 코드 8자리"
            maxLength={8}
            disabled={isLoading}
          />
          
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? '처리 중...' : '초대 코드 입력하기'}
          </SubmitButton>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
        </Form>
      </Container>
      <NavigationBar />
    </>
  );
};

export default EnterInviteCode; 