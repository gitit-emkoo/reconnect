import React from 'react';
import styled from 'styled-components';
import { Challenge } from '../../api/challenge';
import challengeApi from '../../api/challenge';

const Container = styled.div<{ status: 'inProgress' | 'completed' | 'noChallenge' }>`
  background: ${({ status }) => {
    if (status === 'completed') return '#FFE0E7';
    if (status === 'noChallenge') return '#f1f3f7';
    return '#fff';
  }};
  border-radius: 1rem;
  padding: 1.5rem;
  margin: 0 1rem 2rem 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  min-height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Title = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.75rem;
`;

const Description = styled.div`
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 1.2rem;
  line-height: 1.5;
`;

const ProgressContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 1.2rem;
`;

const ProgressBar = styled.div<{ progress: number }>`
  flex: 1;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  margin-right: 1rem;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: ${({ progress }) => progress}%;
    height: 100%;
    background: linear-gradient(90deg, #4CAF50, #81C784);
    border-radius: 4px;
    transition: width 0.5s ease-in-out;
  }
`;

const ProgressText = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  min-width: 40px;
`;

const CompleteButton = styled.button`
  width: 100%;
  max-width: 200px;
  padding: 0.8rem;
  border: none;
  border-radius: 0.7rem;
  background: #ff6b81;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const RemainingTime = styled.div`
  font-size: 0.9rem;
  color: #e74c3c;
  font-weight: 500;
  margin-top: 1rem;
`;


interface Props {
  challenge: Challenge | null;
  onComplete: () => void;
  isCurrentUserCompleted: boolean;
  isWeeklyCompleted: boolean;
}

const ActiveChallenge: React.FC<Props> = ({ challenge, onComplete, isCurrentUserCompleted, isWeeklyCompleted }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleComplete = async () => {
    if (!challenge || isLoading || isCurrentUserCompleted) return;

    try {
      setIsLoading(true);
      await challengeApi.completeChallenge(challenge.id);
      onComplete();
    } catch (error) {
      console.error('챌린지 완료 처리 중 오류 발생:', error);
      alert('챌린지 완료 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isWeeklyCompleted) {
    return (
      <Container status="completed">
        <Title>이번주 챌린지를 이미 성공했습니다!</Title>
        <Description>다음주를 기다려 주세요 😊</Description>
      </Container>
    );
  }

  if (!challenge) {
    return (
      <Container status="noChallenge">
        <Title>진행 가능한 챌린지가 없어요</Title>
        <Description>새로운 챌린지를 시작해보세요!</Description>
      </Container>
    );
  }

  const progress = ((challenge.isCompletedByMember1 ? 1 : 0) + (challenge.isCompletedByMember2 ? 1 : 0)) * 50;
  const end = new Date(challenge.endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  const remainingDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  const remainingHours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return (
    <Container status="inProgress">
      <Title>{challenge.title}</Title>
      <Description>{challenge.description}</Description>
      
      <ProgressContainer>
        <ProgressBar progress={progress} />
        <ProgressText>{progress}%</ProgressText>
      </ProgressContainer>

      <RemainingTime>
        챌린지 종료까지 {remainingDays > 0 ? `${remainingDays}일 ` : ''}
        {remainingHours > 0 ? `${remainingHours}시간 남음` : (remainingDays <= 0 ? '곧 종료돼요!' : '남음')}
      </RemainingTime>
      
      <CompleteButton onClick={handleComplete} disabled={isLoading || isCurrentUserCompleted}>
        {isLoading ? '처리 중...' : (isCurrentUserCompleted ? '파트너 기다리는 중' : '나의 챌린지 완료')}
      </CompleteButton>
    </Container>
  );
};

export default ActiveChallenge; 