import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import ProgressBar from '../components/common/ProgressBar';
import { diagnosisQuestions } from '../config/baselineDiagnosisQuestions';
import logoImage from '../assets/Logo.png';

const questions = diagnosisQuestions;

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

const Logo = styled.img`
  width: 150px;
  height: auto;
  margin: 0 auto 3rem;
  display: block;
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
    align-items: center;
  }
`;

const Button = styled.button<{ colorType: 'yes' | 'neutral' | 'no' }>`
  padding: 1rem 2rem;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  width: 100%;
  max-width: 200px;
  color: white;
  background: ${({ colorType }) =>
    colorType === 'yes'
      ? 'linear-gradient(to right, #FF69B4, #FF1493)'
      : colorType === 'no'
      ? 'linear-gradient(to right, #4169E1, #0000CD)'
      : 'linear-gradient(to right, #888, #666)'};
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 480px) {
    max-width: 100%;
  }
`;

const BaselineDiagnosis: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const handleAnswer = (answer: 'yes' | 'no' | 'unknown') => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      localStorage.setItem('hasVisited', 'true');
      localStorage.setItem(
        'baselineDiagnosisAnswers',
        JSON.stringify(newAnswers),
      );
      navigate('/diagnosis/result', { state: { answers: newAnswers } });
    }
  };

  return (
    <Container>
      <BackButton />
      <Header>
        <Logo src={logoImage} alt="Reconnect Logo" />
        <Title>기초 관계온도 진단</Title>
        <Subtitle>우리의 관계를 이해하기 위한 첫 단계예요</Subtitle>
      </Header>

      <ProgressBar 
        current={currentQuestion} 
        total={questions.length}
      />

      <QuestionCard>
        <Question>
          {questions[currentQuestion].text}
        </Question>
      </QuestionCard>

      <ButtonContainer>
        <Button colorType="yes" onClick={() => handleAnswer('yes')}>
          예
        </Button>
        <Button colorType="neutral" onClick={() => handleAnswer('unknown')}>
          잘 모르겠다
        </Button>
        <Button colorType="no" onClick={() => handleAnswer('no')}>
          아니요
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default BaselineDiagnosis; 