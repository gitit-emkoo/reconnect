import React from 'react';
import styled from 'styled-components';
import { Challenge } from '../../api/challenge';
import challengeApi from '../../api/challenge';
import LoadingSpinner from '../common/LoadingSpinner';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #f8f9fa;
  border-radius: 1.2rem;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 1.5rem 0.5rem;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem 1.5rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
`;

const Title = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  color: #343a40;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
`;

const ChallengeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
`;

const ChallengeCard = styled.div`
  background: #ffffff;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid #f1f3f5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const CardInfo = styled.div`
  flex: 1;
`;

const ChallengeTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #343a40;
  margin: 0 0 0.5rem 0;
`;

const ChallengeDescription = styled.p`
  font-size: 0.9rem;
  color: #868e96;
  margin: 0;
`;

const SelectButton = styled.button`
  background: #7048e8;
  color: white;
  border: none;
  border-radius: 0.7rem;
  padding: 0.7rem 0;
  width: 100%;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background: #5f3dc4;
  }
  
  &:disabled {
    background: #ced4da;
    cursor: not-allowed;
  }
`;


interface Props {
  isOpen: boolean;
  onClose: () => void;
  category: Challenge['category'];
  onSelect: (challenge: Challenge) => void;
  isChallengeActive: boolean;
}

const ChallengeListModal: React.FC<Props> = ({ isOpen, onClose, category, onSelect, isChallengeActive }) => {
  const [challenges, setChallenges] = React.useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (isOpen) {
      const loadChallenges = async () => {
        try {
          setIsLoading(true);
          const data = await challengeApi.getChallengesByCategory(category);
          setChallenges(data);
        } catch (error) {
          console.error('챌린지 목록 로드 오류:', error);
          setChallenges([]);
        } finally {
          setIsLoading(false);
        }
      };
      loadChallenges();
    }
  }, [isOpen, category]);

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <Title>챌린지 선택</Title>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <ChallengeList>
          {isLoading ? (
            <LoadingSpinner />
          ) : challenges.length === 0 ? (
            <div style={{ color: '#aaa', textAlign: 'center', padding: '2rem 0' }}>
              이 카테고리에는 아직 챌린지가 없어요.
            </div>
          ) : (
            challenges.map(challenge => (
              <ChallengeCard key={challenge.id}>
                <CardInfo>
                  <ChallengeTitle>{challenge.title}</ChallengeTitle>
                  <ChallengeDescription>{challenge.description}</ChallengeDescription>
                </CardInfo>
                <SelectButton onClick={() => onSelect(challenge)} disabled={isChallengeActive}>
                  {isChallengeActive ? '진행중인 챌린지 있음' : '이 챌린지 시작'}
                </SelectButton>
              </ChallengeCard>
            ))
          )}
        </ChallengeList>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ChallengeListModal; 