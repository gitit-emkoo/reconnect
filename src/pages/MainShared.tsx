import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// 스타일 컴포넌트
const Container = styled.div`
  padding: 2rem;
  background-color: #ecfdf5;
  min-height: 100vh;
`;

const Section = styled.div`
  background-color: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Text = styled.p`
  color: #4b5563;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin-top: 2rem;
`;

const NavButton = styled.button`
  flex: 1;
  padding: 1rem;
  background-color: #14b8a6;
  color: white;
  font-weight: 500;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background-color: #0d9488;
  }
`;

const MainShared: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Section>
        <Title>오늘의 감정카드</Title>
        <Text>상대방이 감정카드를 아직 작성하지 않았어요.</Text>
      </Section>

      <Section>
        <Title>이번 주 연결 미션</Title>
        <Text>함께 저녁 만들기 🍳 (2일 남음)</Text>
      </Section>

      <Section>
        <Title>관계 온도</Title>
        <Text>현재 온도: 37.2℃ — 안정적인 거리입니다.</Text>
      </Section>

      <ButtonRow>
        <NavButton onClick={() => navigate("/emotion-card")}>감정카드</NavButton>
        <NavButton onClick={() => navigate("/challenge")}>챌린지</NavButton>
        <NavButton onClick={() => navigate("/report")}>리포트</NavButton>
      </ButtonRow>
    </Container>
  );
};

export default MainShared;
