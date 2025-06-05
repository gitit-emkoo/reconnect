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
      <Title>이번 주 connect 약속</Title>
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

//이번주 약속, 미션완료누르면 완료처리되고 온도가 상승함. 
//이런약속 어때요? 각 테마버튼 4개정도. 1번:여행,데이트 2번:스킨쉽 3번:선물(사이트 이동) 4번:일상(존댓말쓰기, 시댁에 전화하기)
//테마버튼 선택하면 모달로 리스트 나오고 선택할수 있음. 확인모달한번더 뜨고 확인누르면 상단에 이번주 미션으로 표시됨
//미션완료버튼 누르면 사진과 코멘트등록하고 사진을 익명으로 공개하시겠습니까? 에 선택가능하게하게 
export default Challenge;
