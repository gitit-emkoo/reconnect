import React from 'react';
import styled from 'styled-components';
import { Challenge } from '../../api/challenge';
import challengeApi from '../../api/challenge';

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
`;

const ConfirmModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const ConfirmModalContent = styled.div`
  background: #fff;
  border-radius: 1rem;
  padding: 2rem 1.5rem;
  max-width: 320px;
  text-align: center;
`;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  category: Challenge['category'];
  onSelectChallenge: (challenge: Challenge) => void;
  isWeeklyCompleted: boolean;
  onShowCompletionModal: () => void;
}

const ChallengeListModal: React.FC<Props> = ({ isOpen, onClose, category, onSelectChallenge, isWeeklyCompleted, onShowCompletionModal }) => {
  const [challenges, setChallenges] = React.useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [confirmChallenge, setConfirmChallenge] = React.useState<Challenge | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      loadChallenges();
    }
    // eslint-disable-next-line
  }, [isOpen, category]);

  const loadChallenges = async () => {
    try {
      setIsLoading(true);
      const data = await challengeApi.getChallengesByCategory(category);
      setChallenges(data);
    } catch (error) {
      setChallenges([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <Title>
            {category === 'DAILY_SHARE' && '일상 공유'}
            {category === 'TOGETHER_ACT' && '함께하기'}
            {category === 'EMOTION_EXPR' && '감정표현'}
            {category === 'MEMORY_BUILD' && '기억쌓기'}
            {category === 'SELF_CARE' && '마음 돌보기'}
            {category === 'GROW_TOGETHER' && '함께 성장'}
          </Title>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <ChallengeList>
          {isLoading && <div style={{ color: '#aaa', textAlign: 'center' }}>로딩 중...</div>}
          {!isLoading && challenges.length === 0 && <div style={{ color: '#aaa', textAlign: 'center' }}>챌린지 목록이 없습니다.</div>}
          {challenges.map(challenge => (
            <ChallengeCard key={challenge.id}>
              <div>
                <ChallengeTitle>{challenge.title}</ChallengeTitle>
                <ChallengeDescription>{challenge.description}</ChallengeDescription>
              </div>
              <SelectButton onClick={() => {
                if (isWeeklyCompleted) {
                  onShowCompletionModal();
                } else {
                  setConfirmChallenge(challenge);
                }
              }}>선택</SelectButton>
            </ChallengeCard>
          ))}
        </ChallengeList>
      </ModalContent>
      {confirmChallenge && (
        <ConfirmModalOverlay>
          <ConfirmModalContent>
            <div style={{ marginBottom: 18 }}>
              이 챌린지로 선택하시겠습니까?
              <br />
              <b>{confirmChallenge.title}</b>
            </div>
            <SelectButton onClick={() => { onSelectChallenge(confirmChallenge); setConfirmChallenge(null); onClose(); }}>예</SelectButton>
            <button style={{ marginLeft: 12, background: 'none', border: 'none', color: '#888', fontWeight: 600, cursor: 'pointer' }} onClick={() => setConfirmChallenge(null)}>아니오</button>
          </ConfirmModalContent>
        </ConfirmModalOverlay>
      )}
    </ModalOverlay>
  );
};

export default ChallengeListModal; 