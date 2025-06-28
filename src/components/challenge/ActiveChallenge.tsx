import React from 'react';
import styled from 'styled-components';
import { Challenge } from '../../api/challenge';
import challengeApi from '../../api/challenge';

const Container = styled.div<{ status: 'inProgress' | 'completed' | 'noChallenge' }>`
  background: ${({ status }) => {
    if (status === 'completed') return 'linear-gradient(135deg, #f3e7e9, #e3eeff)';
    if (status === 'noChallenge') return '#f8f9fa';
    return '#ffffff';
  }};
  border-radius: 1.2rem;
  padding: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: left;
  min-height: 220px;
`;

const InfoSection = styled.div``;

const Title = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  color: #343a40;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: #868e96;
  margin: 0;
`;

const ProgressSection = styled.div`
  margin-top: 1.5rem;
`;

const ProgressContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.5rem;
`;

const ProgressBar = styled.div<{ progress: number }>`
  flex: 1;
  height: 10px;
  background: #e9ecef;
  border-radius: 5px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: ${({ progress }) => progress}%;
    height: 100%;
    background: linear-gradient(90deg, #845ef7, #a992fe);
    border-radius: 5px;
    transition: width 0.5s ease-in-out;
  }
`;

const ProgressText = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #5f3dc4;
  min-width: 35px;
  text-align: right;
`;

const RemainingTime = styled.div`
  font-size: 0.85rem;
  color: #868e96;
  font-weight: 500;
  text-align: right;
`;

const ActionSection = styled.div`
  margin-top: 1.5rem;
`;

const CompleteButton = styled.button`
  width: 100%;
  padding: 0.9rem;
  border: none;
  border-radius: 0.8rem;
  background: #785cd2;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background:rgb(146, 114, 250);
    transform: translateY(-2px);
  }

  &:disabled {
    background: #ced4da;
    cursor: not-allowed;
  }
`;

const CenteredTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  padding: 1rem;

  h2 {
    font-size: 1.2rem;
    font-weight: 600;
    color: #495057;
  }

  p {
    color: #868e96;
  }
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
        <CenteredTextContainer>
          <h2>이번주 챌린지를 이미 성공했습니다!</h2>
          <p>다음주를 기다려 주세요 😊</p>
        </CenteredTextContainer>
      </Container>
    );
  }

  if (!challenge) {
    return (
      <Container status="noChallenge">
        <CenteredTextContainer>
          <h2>진행 가능한 챌린지가 없어요</h2>
          <p>새로운 챌린지를 시작해보세요!</p>
        </CenteredTextContainer>
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
      <InfoSection>
        <Title>{challenge.title}</Title>
        <Description>{challenge.description}</Description>
      </InfoSection>
      
      <ProgressSection>
        <ProgressContainer>
          <ProgressBar progress={progress} />
          <ProgressText>{progress}%</ProgressText>
        </ProgressContainer>
        <RemainingTime>
          챌린지 종료까지 {remainingDays > 0 ? `${remainingDays}일 ` : ''}
          {remainingHours > 0 ? `${remainingHours}시간 남음` : (remainingDays <= 0 ? '곧 종료돼요!' : '남음')}
        </RemainingTime>
      </ProgressSection>

      <ActionSection>
        <CompleteButton onClick={handleComplete} disabled={isLoading || isCurrentUserCompleted}>
          {isLoading ? '처리 중...' : (isCurrentUserCompleted ? '파트너 기다리는 중' : '나의 챌린지 완료')}
        </CompleteButton>
      </ActionSection>
    </Container>
  );
};

export default ActiveChallenge; 