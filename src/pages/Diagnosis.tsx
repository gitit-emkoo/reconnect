import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// 샘플 진단 질문 리스트
const questions = [
  "최근 1주일 안에 포옹이나 스킨십을 했나요?",
  "요즘 배우자와 대화할 때 감정이 통한다고 느끼시나요?",
  "서로의 기분이나 일상에 관심을 표현하나요?",
  "최근 배우자에게 고맙다고 표현한 적이 있나요?",
  "마지막 스킨십 시도가 어색하거나 불편했나요?",
  "요즘 배우자와 단둘이 보내는 시간이 있나요?"
];

// 스타일 정의
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 2rem;
  background-color: #f0fdf4;
`;

const QuestionBox = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 90%;
`;

const QuestionText = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const AnswerButton = styled.button<{ color: string }>`
  background-color: ${({ color }) => color};
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const Diagnosis: React.FC = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleAnswer = (answer: string) => {
    const updated = [...answers, answer];
    setAnswers(updated);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // 진단 완료 → 결과 페이지로
      navigate("/diagnosis/result", { state: { answers: updated } });
    }
  };

  return (
    <Container>
      <QuestionBox>
        <QuestionText>{questions[step]}</QuestionText>
        <ButtonGroup>
          <AnswerButton color="#10b981" onClick={() => handleAnswer("yes")}>네</AnswerButton>
          <AnswerButton color="#ef4444" onClick={() => handleAnswer("no")}>아니요</AnswerButton>
        </ButtonGroup>
      </QuestionBox>
    </Container>
  );
};

export default Diagnosis;