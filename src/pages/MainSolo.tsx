import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  background-color: #f3f4f6;
  min-height: 100vh;
  padding: 2rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
`;

const Card = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
`;

const Text = styled.p`
  color: #4b5563;
  font-size: 1rem;
`;

const Button = styled.button`
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  &:hover {
    background-color: #2563eb;
  }
`;

const MainSolo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Title>혼자 시작한 당신의 공간</Title>
      <Card>
        <Text>
          파트너와 아직 연결되지 않았지만, 지금부터 당신의 감정을 기록하고 되돌아볼 수 있어요.
        </Text>
      </Card>
      <Card>
        <Text>감정카드를 통해 마음을 표현해보세요.</Text>
        <Button onClick={() => navigate("/emotion-card")}>감정카드 작성</Button>
      </Card>
      <Card>
        <Text>파트너를 초대하고 싶다면 아래 버튼을 눌러보세요.</Text>
        <Button onClick={() => navigate("/invite")}>파트너 초대</Button>
      </Card>
    </Container>
  );
};

export default MainSolo;
