import React, { useState } from 'react';
import styled from 'styled-components';
import { partnerInvitesApi } from '../../api/partnerInvites';
import useAuthStore from '../../store/authStore';
import ConfirmationModal from '../common/ConfirmationModal';
import LoadingSpinner from '../common/LoadingSpinner';

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
  text-align: center;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  &:hover {
    color: #333;
  }
`;

const Title = styled.h2`
  font-size: 1.3rem;
  margin-bottom: 1.2rem;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #eee;
  border-radius: 0.5rem;
  font-size: 1rem;
  margin-bottom: 1.2rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  border: none;
  border-radius: 0.5rem;
  background: linear-gradient(to right, #FF69B4, #4169E1);
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 1rem;
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  margin: 1rem 0;
`;

interface InviteCodeInputModalProps {
  onClose: () => void;
}

const InviteCodeInputModal: React.FC<InviteCodeInputModalProps> = ({ onClose }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, setAuth } = useAuthStore();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError("초대 코드를 입력해주세요.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await partnerInvitesApi.respondToInvite(code);
      if (user?.id === response.invitee.id) {
        setAuth(response.inviteeToken, response.invitee);
      } else if (user?.id === response.inviter.id) {
        setAuth(response.inviterToken, response.inviter);
      }
      setShowSuccessModal(true);
    } catch (err) {
      setError("코드가 유효하지 않거나 만료되었습니다. 다시 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    onClose();
  };

  if (showSuccessModal) {
    return (
      <ConfirmationModal
        isOpen={showSuccessModal}
        onRequestClose={handleCloseSuccessModal}
        message="파트너와 성공적으로 연결되었습니다!"
        onConfirm={handleCloseSuccessModal}
      />
    );
  }

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Title>초대 코드 입력</Title>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <Input
            type="text"
            placeholder="초대 코드를 입력하세요"
            value={code}
            onChange={e => setCode(e.target.value)}
            maxLength={16}
            required
            autoFocus
          />
          <SubmitButton type="submit" disabled={isLoading || !code.trim()}>
            {isLoading ? <LoadingSpinner /> : '파트너 연결하기'}
          </SubmitButton>
        </form>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </ModalContent>
    </ModalBackdrop>
  );
};

export default InviteCodeInputModal; 