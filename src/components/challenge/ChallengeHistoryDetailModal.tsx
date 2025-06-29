import React from 'react';
import styled from 'styled-components';
import { Challenge } from '../../api/challenge';
import { formatInKST } from '../../utils/date';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
`;

const ModalTitle = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #888;
  line-height: 1;
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: #555;
`;

const DetailValue = styled.span`
  color: #333;
`;

interface Props {
  challenge: Challenge | null;
  isOpen: boolean;
  onClose: () => void;
}

const ChallengeHistoryDetailModal: React.FC<Props> = ({ challenge, isOpen, onClose }) => {
  if (!isOpen || !challenge) return null;

  const dateToFormat = challenge.completedAt || challenge.updatedAt;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{challenge.title}</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <ModalBody>
          <DetailItem>
            <DetailLabel>달성 조건</DetailLabel>
            <DetailValue>{challenge.frequency}회</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>완료일</DetailLabel>
            <DetailValue>{dateToFormat ? formatInKST(dateToFormat, 'yyyy년 M월 d일') : '날짜 정보 없음'}</DetailValue>
          </DetailItem>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ChallengeHistoryDetailModal; 