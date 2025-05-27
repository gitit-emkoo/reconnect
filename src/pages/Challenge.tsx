import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  background-color: #f0fdf4;
  min-height: 100vh;
  padding: 2rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #065f46;
`;

const Card = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
`;

const Description = styled.p`
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #374151;
`;

const Progress = styled.div`
  height: 10px;
  border-radius: 5px;
  background-color: #d1fae5;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const ProgressBar = styled.div<{ percent: number }>`
  width: ${({ percent }) => percent}%;
  height: 100%;
  background-color: #10b981;
  transition: width 0.3s ease;
`;

const Button = styled.button`
  background-color: #10b981;
  color: white;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  &:hover {
    background-color: #059669;
  }
`;

const Challenge: React.FC = () => {
  const [progress, setProgress] = useState(33);
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setProgress(100);
    setCompleted(true);
  };

  return (
    <Container>
      <Title>이번 주 연결 미션</Title>
      <Card>
        <Description>함께 저녁 준비하기 🍽️</Description>
        <Progress>
          <ProgressBar percent={progress} />
        </Progress>
        {!completed ? (
          <Button onClick={handleComplete}>오늘 미션 완료!</Button>
        ) : (
          <p style={{ color: '#16a34a', fontWeight: 'bold' }}>미션 완료! 🎉</p>
        )}
      </Card>
    </Container>
  );
};

export default Challenge;
