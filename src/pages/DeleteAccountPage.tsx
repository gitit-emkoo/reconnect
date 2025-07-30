import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useAuthStore from '../store/authStore';
import NavigationBar from '../components/NavigationBar';
import ConfirmationModal from '../components/common/ConfirmationModal';
import BackButton from '../components/common/BackButton';
import axiosInstance from '../api/axios';

const Container = styled.div`
  height: auto;
  background-color: #f8f9fa;
  padding: 1rem;
  padding-bottom: 80px;
`;

const Content = styled.div`
  max-width: 420px;
  margin: 0 auto;
  background-color: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const WarningText = styled.p`
  color: #e74c3c;
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.5;
`;

const QuestionText = styled.h2`
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 1.5rem;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const RadioItem = styled.label`
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #785ce2;
    background-color: #f8f9ff;
  }

  input[type="radio"] {
    margin-right: 0.75rem;
    width: 18px;
    height: 18px;
    accent-color: #785ce2;
  }

  span {
    font-size: 0.95rem;
    color: #333;
  }
`;

const WithdrawButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(to right, #e74c3c, #c0392b);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
  }

  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const DeleteAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const withdrawalReasons = [
    { value: 'divorced', label: '이미 이혼을 했어요' },
    { value: 'relationship_better', label: '관계가 좋아져서 더 이상 필요 없어요' },
    { value: 'not_satisfied', label: '서비스가 기대에 못 미쳐서' },
    { value: 'inconvenient', label: '사용이 불편해서' },
  ];

  const handleWithdraw = async () => {
    if (!selectedReason) {
      alert('탈퇴 사유를 선택해주세요.');
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmWithdraw = async () => {
    setIsLoading(true);
    try {
      await axiosInstance.post('/users/me/withdraw', {
        reason: selectedReason,
      });

      alert('탈퇴가 완료되었습니다.');
      logout();
      navigate('/login');
    } catch (error) {
      console.error('탈퇴 실패:', error);
      alert('탈퇴 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <>
      <Container>
        <BackButton />
        <Content>
          <Title>회원 탈퇴</Title>
          
          <WarningText>
            ⚠️ 탈퇴 시 <b>파트너와 주고받은 감정카드, 합의서, 챌린지 등 모든 기록</b>이 영구적으로 삭제되며,<br />
            복구할 수 없습니다.<br />
            <b>필요하다면 미리 백업</b>해 주세요.
          </WarningText>

          <QuestionText>탈퇴하시는 이유를 알려주세요.</QuestionText>
          
          <RadioGroup>
            {withdrawalReasons.map((reason) => (
              <RadioItem key={reason.value}>
                <input
                  type="radio"
                  name="withdrawalReason"
                  value={reason.value}
                  checked={selectedReason === reason.value}
                  onChange={(e) => setSelectedReason(e.target.value)}
                />
                <span>{reason.label}</span>
              </RadioItem>
            ))}
          </RadioGroup>

          <WithdrawButton
            onClick={handleWithdraw}
            disabled={!selectedReason || isLoading}
          >
            {isLoading ? '처리 중...' : '탈퇴하기'}
          </WithdrawButton>
        </Content>
      </Container>

      <NavigationBar />

      <ConfirmationModal
        isOpen={showConfirmModal}
        onRequestClose={() => setShowConfirmModal(false)}
        onConfirm={confirmWithdraw}
        message={
          "정말로 탈퇴하시겠습니까?\n\n리커넥트에서의 모든 기록(파트너와의 감정카드, 합의서 등)이 영구적으로 삭제되며, 복구할 수 없습니다."
        }
        confirmButtonText="탈퇴하기"
        cancelButtonText="취소"
      />
    </>
  );
};

export default DeleteAccountPage; 