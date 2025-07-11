import React from 'react';
import styled from 'styled-components';
import { Challenge } from '../../api/challenge';
import challengeApi from '../../api/challenge';
import Skeleton from '../common/Skeleton';

// 뱃지 이미지 임포트
import badgeDaily from '../../assets/challenge (1).png';
import badgeTogether from '../../assets/challenge (2).png';
import badgeEmotion from '../../assets/challenge (3).png';
import badgeMemory from '../../assets/challenge (1).png'; // 임시로 1번 뱃지 사용
import badgeSelfCare from '../../assets/challenge (2).png'; // 임시로 2번 뱃지 사용
import badgeGrow from '../../assets/challenge (3).png'; // 임시로 3번 뱃지 사용

const badgeMap = {
  DAILY_SHARE: badgeDaily,
  TOGETHER_ACT: badgeTogether,
  EMOTION_EXPR: badgeEmotion,
  MEMORY_BUILD: badgeMemory,
  SELF_CARE: badgeSelfCare,
  GROW_TOGETHER: badgeGrow,
};

const Container = styled.div<{ status: 'inProgress' | 'completed' | 'noChallenge' }>`
  background: ${({ status }) => {
    if (status === 'completed') return 'linear-gradient(135deg, #f3e7e9, #e3eeff)';
    if (status === 'noChallenge') return '#f8f9fa';
    return '#ffffff';
  }};
  border-radius: 1.2rem;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
`;

const MainContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 1.5rem;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`;

const BadgeImage = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 1rem;
  background-color: #e9ecef;
  flex-shrink: 0;
  object-fit: cover;
`;

const FrequencyText = styled.div`
  font-size: 0.8rem;
  font-weight: 500;
  color: #868e96;
`;

const Title = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  color: #343a40;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
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

const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  margin: 8px 0 12px 0;

  &::after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: ${({ progress }) => progress}%;
    height: 100%;
    background: linear-gradient(90deg, #845ef7, #a992fe);
    border-radius: 4px;
    transition: width 0.5s ease-in-out;
  }
`;

const CompleteButton = styled.button`
  padding: 0.45em 1.2em;
  border: none;
  border-radius: 1em;
  background: #7048e8;
  color: #fff;
  font-weight: 600;
  font-size: 0.95rem;
  margin-left: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover:not(:disabled) {
    background: #5f3dc4;
  }
  &:disabled {
    background: #ced4da;
    cursor: not-allowed;
  }
`;

interface Props {
  challenge: Challenge | null;
  onComplete?: (completedChallenge: Challenge) => void;
  isCurrentUserCompleted: boolean;
  isWeeklyCompleted: boolean;
  isLoading?: boolean;
}

const ChallengeSkeleton: React.FC = () => (
  <Container status="inProgress">
    <MainContent>
      <LeftColumn>
        <Skeleton width={70} height={70} borderRadius={16} />
        <Skeleton width={32} height={18} borderRadius={8} style={{ marginTop: 8 }} />
      </LeftColumn>
      <RightColumn>
        <Skeleton width={120} height={20} borderRadius={8} style={{ marginBottom: 12 }} />
        <Skeleton width={180} height={14} borderRadius={8} style={{ marginBottom: 8 }} />
        <Skeleton width={90} height={14} borderRadius={8} />
      </RightColumn>
    </MainContent>
  </Container>
);

const ActiveChallenge: React.FC<Props> = ({ challenge, onComplete, isCurrentUserCompleted, isWeeklyCompleted, isLoading }) => {
  const [isLoadingInternal, setIsLoadingInternal] = React.useState(false);

  const handleComplete = async () => {
    if (!challenge || isLoadingInternal || isCurrentUserCompleted) return;
    try {
      setIsLoadingInternal(true);
      const completedChallenge = await challengeApi.completeChallenge(challenge.id);
      if (onComplete) onComplete(completedChallenge);
    } catch (error) {
      alert('챌린지 완료 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoadingInternal(false);
    }
  };

  if (isLoading) {
    return <ChallengeSkeleton />;
  }

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
          <h2>진행중인 챌린지가 없어요</h2>
          <p>새로운 챌린지를 시작해보세요!</p>
        </CenteredTextContainer>
      </Container>
    );
  }

  const progress = ((challenge.isCompletedByMember1 ? 1 : 0) + (challenge.isCompletedByMember2 ? 1 : 0)) * 50;
  const end = new Date(challenge.endDate);
  const now = new Date();
  const diff = Math.max(0, end.getTime() - now.getTime());

  const remainingDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  const remainingHours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const remainingMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  let timeText = '시간 종료';
  if (remainingDays > 0) {
    timeText = `${remainingDays}일`;
  } else if (remainingHours > 0) {
    timeText = `${remainingHours}시간`;
  } else if (remainingMinutes > 0) {
    timeText = `${remainingMinutes}분`;
  }

  return (
    <Container status="inProgress">
      <MainContent>
        <LeftColumn>
          <BadgeImage src={badgeMap[challenge.category]} alt={`${challenge.title} 뱃지`} />
          <FrequencyText>
            {challenge.isOneTime ? '1회' : `주 ${challenge.frequency}회`}
          </FrequencyText>
          {!isCurrentUserCompleted && (
            <CompleteButton onClick={handleComplete} disabled={isLoadingInternal}>
              {isLoadingInternal ? '처리중...' : '완료'}
            </CompleteButton>
          )}
        </LeftColumn>
        <RightColumn>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
            <Title style={{ fontSize: '1rem', margin: 0 }}>{challenge.title}</Title>
          </div>
          <ProgressBar progress={progress} />
          <div style={{ fontSize: 10, color: '#666', marginBottom: 6, lineHeight: 1.5 }}>
            파트너가 챌린지를 완료했을때 눌러주세요
          </div>
          <div style={{ fontSize: 13, color: '#845ef7', fontWeight: 500, marginBottom: 8 }}>
            종료까지 {timeText} 남음
          </div>
        </RightColumn>
      </MainContent>
    </Container>
  );
};

export default ActiveChallenge; 