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
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
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

const ChallengeInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #888;
`;

const StartButton = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const NoPartnerWarning = styled.div`
  background: #fff3cd;
  border: 1px solid #ffeeba;
  color: #856404;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  text-align: center;
`;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  category: Challenge['category'];
  hasPartner: boolean;
  onChallengeStart: () => void;
}

const ChallengeListModal: React.FC<Props> = ({
  isOpen,
  onClose,
  category,
  hasPartner,
  onChallengeStart,
}) => {
  const [challenges, setChallenges] = React.useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  // 챌린지 목록 로드
  React.useEffect(() => {
    if (isOpen) {
      loadChallenges();
    }
  }, [isOpen, category]);

  const loadChallenges = async () => {
    try {
      setIsLoading(true);
      const data = await challengeApi.getChallengesByCategory(category);
      setChallenges(data);
    } catch (error) {
      console.error('챌린지 목록 로드 중 오류 발생:', error);
      alert('챌린지 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChallengeStart = async (challenge: Challenge) => {
    if (!hasPartner) {
      alert('연결된 파트너가 없습니다. 파트너와 연결 후 챌린지에 도전해 주세요.');
      return;
    }

    if (window.confirm('선택한 챌린지를 시작하시겠습니까?')) {
      try {
        setIsLoading(true);
        await challengeApi.startChallenge(challenge.id);
        onChallengeStart();
        onClose();
      } catch (error) {
        console.error('챌린지 시작 중 오류 발생:', error);
        alert('챌린지 시작에 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
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

        {!hasPartner && (
          <NoPartnerWarning>
            연결된 파트너가 없습니다. 파트너와 연결 후 챌린지에 도전해 주세요.
          </NoPartnerWarning>
        )}

        <ChallengeList>
          {challenges.map(challenge => (
            <ChallengeCard
              key={challenge.id}
              onClick={() => handleChallengeStart(challenge)}
            >
              <ChallengeTitle>{challenge.title}</ChallengeTitle>
              <ChallengeDescription>{challenge.description}</ChallengeDescription>
              <ChallengeInfo>
                <div>
                  {challenge.isOneTime ? '1회성' : `주 ${challenge.frequency}회`}
                </div>
                <StartButton
                  onClick={() => handleChallengeStart(challenge)}
                  disabled={isLoading || !hasPartner}
                >
                  시작하기
                </StartButton>
              </ChallengeInfo>
            </ChallengeCard>
          ))}
        </ChallengeList>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ChallengeListModal; 