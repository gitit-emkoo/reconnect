// src/pages/Calendar.tsx
import React from "react";
import styled from "styled-components";
import { Container as BaseContainer } from '../styles/CommonStyles';

const Container = styled(BaseContainer)`
  background-color: #f0f4f8; /* 약간 푸른 회색 계열 */
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
`;

const Card = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 600px;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Text = styled.p`
  font-size: 1rem;
  color: #555;
  line-height: 1.5;
`;

const ComingSoon = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #ffe0b2; /* 주황색 계열 */
  color: #e65100;
  border-radius: 0.75rem;
  font-weight: bold;
  font-size: 1.1rem;
`;

const Calendar: React.FC = () => {
  return (
    <Container>
      <Title>나의 연결 캘린더 📅</Title>
      <Card>
        <Text>
          중요한 기념일, 미션 수행일, 그리고 서로의 감정 변화를 한눈에 볼 수 있는
          캘린더입니다.
        </Text>
        <ComingSoon>✨ 곧 만나요! ✨</ComingSoon>
        <Text style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#777' }}>
          파트너와 함께 기록하는 소중한 순간들을 캘린더에서 확인해보세요.
        </Text>
      </Card>
      {/* 실제 캘린더 컴포넌트가 들어갈 자리 */}
      {/* 예를 들어, react-calendar 라이브러리 등을 활용할 수 있습니다. */}
    </Container>
  );
};

export default Calendar;