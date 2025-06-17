import React from 'react';
import styled from 'styled-components';
import { Challenge } from '../../api/challenge';
import challengeApi from '../../api/challenge';
import { useNotificationStore } from '../../store/notificationsStore';

const Container = styled.div`
  background: #fff;
  border-radius: 1rem;
  padding: 1.2rem;
  margin: 0 1rem 1.5rem 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const Title = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Description = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const ProgressBar = styled.div<{ progress: number }>`
  flex: 1;
  height: 6px;
  background: #eee;
  border-radius: 3px;
  margin-right: 1rem;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    width: ${({ progress }) => progress}%;
    height: 100%;
    background: #4CAF50;
    border-radius: 3px;
    transition: width 0.3s ease;
  }
`;

const ProgressText = styled.div`
  font-size: 0.8rem;
  color: #666;
  min-width: 60px;
`;

const CompleteButton = styled.button<{ isCompleted: boolean }>`
  width: 100%;
  padding: 0.8rem;
  border: none;
  border-radius: 0.7rem;
  background: ${({ isCompleted }) => isCompleted ? '#4CAF50' : '#ff6b81'};
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
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

const RemainingTime = styled.div`
  font-size: 0.8rem;
  color: #666;
  text-align: center;
  margin-top: 0.8rem;
`;

interface Props {
  challenge: Challenge;
  onComplete: () => void;
  isCurrentUserCompleted: boolean;
}

const ActiveChallenge: React.FC<Props> = ({ challenge, onComplete, isCurrentUserCompleted }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [remainingDays, setRemainingDays] = React.useState(0);
  const addNotification = useNotificationStore(state => state.addNotification);

  // 남은 일수 계산
  React.useEffect(() => {
    const calculateRemainingDays = () => {
      const end = new Date(challenge.endDate);
      const now = new Date();
      const diff = end.getTime() - now.getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      setRemainingDays(days > 0 ? days : 0);
    };

    calculateRemainingDays();
    const timer = setInterval(calculateRemainingDays, 1000 * 60 * 60); // 1시간마다 갱신

    return () => clearInterval(timer);
  }, [challenge.endDate]);

  // 완료 버튼 클릭 핸들러
  const handleComplete = async () => {
    if (isLoading || isCurrentUserCompleted) return;

    try {
      setIsLoading(true);
      await challengeApi.completeChallenge(challenge.id);
      // 알림 추가
      addNotification('챌린지가 완료되었습니다!', '/challenge');
      onComplete();
    } catch (error) {
      console.error('챌린지 완료 처리 중 오류 발생:', error);
      alert('챌린지 완료 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 진행률 계산
  const progress = ((challenge.isCompletedByMember1 ? 1 : 0) + (challenge.isCompletedByMember2 ? 1 : 0)) * 50;

  return (
    <Container>
      <Title>{challenge.title}</Title>
      <Description>{challenge.description}</Description>
      
      <ProgressContainer>
        <ProgressBar progress={progress} />
        <ProgressText>{progress}%</ProgressText>
      </ProgressContainer>

      <CompleteButton
        onClick={handleComplete}
        disabled={isLoading || isCurrentUserCompleted}
        isCompleted={isCurrentUserCompleted}
      >
        {isCurrentUserCompleted ? '완료됨' : '달성하기'}
      </CompleteButton>

      <RemainingTime>
        {remainingDays > 0
          ? `남은 기간: ${remainingDays}일`
          : '오늘 마감'}
      </RemainingTime>
    </Container>
  );
};

export default ActiveChallenge; 