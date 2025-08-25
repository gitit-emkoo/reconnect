import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 2rem auto 2rem;
  padding: 0 1rem;
`;

const ProgressContainer = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  overflow: hidden;
`;

const Progress = styled.div<{ percent: number }>`
  width: ${({ percent }) => percent}%;
  height: 100%;
  background: linear-gradient(to right, #FF69B4, #FF1493);
  border-radius: 2px;
  transition: width 0.3s ease;
`;

const StepText = styled.p`
  text-align: right;
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  margin-bottom: 0;
`;

const ProgressText = styled.p`
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  margin-bottom: 0;
  font-weight: 500;
`;

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, className }) => {
  const percent = (current / (total - 1)) * 100;
  
  // 특정 페이지에서만 진행률 메시지 표시
  const getProgressMessage = () => {
    const currentPage = current + 1;
    if (currentPage === 10) return "30% 진행중입니다";
    if (currentPage === 24) return "70% 진행중입니다";
    return null;
  };

  const progressMessage = getProgressMessage();

  return (
    <Container className={className}>
      <ProgressContainer>
        <Progress percent={percent} />
      </ProgressContainer>
      <StepText>{current + 1} / {total}</StepText>
      {progressMessage && <ProgressText>{progressMessage}</ProgressText>}
    </Container>
  );
};

export default ProgressBar; 