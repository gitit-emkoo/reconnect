import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import ProgressBar from '../components/common/ProgressBar';

// 샘플 진단 질문 리스트
const questions = [
  "최근 1주일 안에 포옹이나 스킨십을 했나요?",
  "요즘 배우자와 대화할 때 감정이 통한다고 느끼시나요?",
  "서로의 기분이나 일상에 관심을 표현하나요?",
  "최근 배우자에게 고맙다고 표현한 적이 있나요?",
  "마지막 스킨십 시도가 어색하거나 불편했나요?",
  "요즘 배우자와 단둘이 보내는 시간이 있나요?"
];

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #FAF9F6;
  padding: 0 1rem;
  justify-content: center;
  position: relative;
  
  @media (min-width: 768px) {
    padding: 0 2rem;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 2rem;
`;

const QuestionCard = styled.div`
  background: #FFE5EE;
  border-radius: 20px;
  padding: 2rem;
  margin: 0 auto 2rem;
  width: 100%;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
`;

const Question = styled.p`
  font-size: 1.2rem;
  color: #333;
  line-height: 1.6;
  white-space: pre-line;
  margin: 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding: 0 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.8rem;
  }
`;

const Button = styled.button<{ isYes?: boolean }>`
  padding: 1rem 3rem;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  width: 100%;
  max-width: 200px;
  color: white;
  background: ${({ isYes }) =>
    isYes
      ? 'linear-gradient(to right, #FF69B4, #FF1493)'
      : 'linear-gradient(to right, #4169E1, #0000CD)'};
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 480px) {
    max-width: 100%;
  }
`;

const Diagnosis: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  useEffect(() => {
    if (localStorage.getItem('hasVisited') === 'true') {
      navigate('/welcome', { replace: true });
    }
  }, [navigate]);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      localStorage.setItem('hasVisited', 'true');
      navigate('/diagnosis-result', { state: { answers: newAnswers } });
    }
  };

  return (
    <Container>
      <BackButton />
      <Header>
        <Title>관계온도 테스트</Title>
        <Subtitle>솔직하게 대답해 주세요</Subtitle>
      </Header>

      <ProgressBar 
        current={currentQuestion} 
        total={questions.length}
      />

      <QuestionCard>
        <Question>
          {questions[currentQuestion]}
        </Question>
      </QuestionCard>

      <ButtonContainer>
        <Button isYes onClick={() => handleAnswer("yes")}>
          예
        </Button>
        <Button onClick={() => handleAnswer("no")}>
          아니요
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default Diagnosis;