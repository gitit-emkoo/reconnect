import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

// 스타일 컴포넌트
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  height: 100vh;
  background-color: #fdfdfd;
`;

const ResultBox = styled.div`
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  max-width: 90%;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const Summary = styled.p`
  color: #4b5563;
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const OptionButton = styled.button<{ color: string }>`
  background-color: ${({ color }) => color};
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const DiagnosisResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const answers: string[] = location.state?.answers || [];

  // 간단한 결과 해석
  const yesCount = answers.filter((a) => a === "yes").length;
  const temperature = 36 + yesCount * 0.3;

  return (
    <Container>
      <ResultBox>
        <Title>진단 결과</Title>
        <Summary>
          당신의 관계 온도는 <strong>{temperature.toFixed(1)}℃</strong>입니다. <br />
          이대로 괜찮은 걸까요?
        </Summary>
        <ButtonGroup>
          <OptionButton color="#0ea5e9" onClick={() => navigate("/login")}>
            혼자 시작하기
          </OptionButton>
          <OptionButton color="#10b981" onClick={() => navigate("/invite")}>
            파트너 초대하기
          </OptionButton>
        </ButtonGroup>
      </ResultBox>
    </Container>
  );
};

export default DiagnosisResult;