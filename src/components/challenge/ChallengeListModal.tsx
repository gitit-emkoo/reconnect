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
  background: white;
  border-radius: 1rem;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 1.5rem;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
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
`;

const ChallengeCard = styled.div`
  background: #f8f9fa;
  border-radius: 0.8rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ChallengeTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
`;

const ChallengeDescription = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.8rem;
`;

const SelectButton = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  margin-left: 1rem;

  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;


interface Props {
  isOpen: boolean;
  onClose: () => void;
  category: Challenge['category'];
  onSelect: (challenge: Challenge) => void;
  isWeeklyCompleted: boolean;
}

const ChallengeListModal: React.FC<Props> = ({ isOpen, onClose, category, onSelect, isWeeklyCompleted }) => {
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
                <div>
                  <ChallengeTitle>{challenge.title}</ChallengeTitle>
                  <ChallengeDescription>{challenge.description}</ChallengeDescription>
                </div>
                <SelectButton onClick={() => onSelect(challenge)} disabled={isWeeklyCompleted}>
                  {isWeeklyCompleted ? '완료됨' : '선택'}
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