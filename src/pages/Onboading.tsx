import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to bottom, #d1fae5, #ffffff);
  padding: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #4b5563;
  margin-bottom: 2rem;
`;

const StartButton = styled.button`
  background-color: #14b8a6;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0d9488;
  }
`;

const Onboarding: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/diagnosis");
  };

  return (
    <Container>
      <Title>지금, 당신의 관계는 괜찮으신가요?</Title>
      <Subtitle>우리는 부부 사이, 어느 순간부터 대화를 놓쳤을지도 몰라요.</Subtitle>
      <StartButton onClick={handleStart}>지금 시작하기</StartButton>
    </Container>
  );
};

export default Onboarding;
