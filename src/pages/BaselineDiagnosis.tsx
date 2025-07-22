import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import ProgressBar from '../components/common/ProgressBar';
import { diagnosisQuestions } from '../config/baselineDiagnosisQuestions';
import logoImage from '../assets/Logo.png';
import { incrementDiagnosisCounter } from '../api/diagnosis';

// 진단 이미지들 import
import diagnosisImage1 from '../assets/Img_diagnosis (1).png';
import diagnosisImage2 from '../assets/Img_diagnosis (2).png';
import diagnosisImage3 from '../assets/Img_diagnosis (3).png';
import diagnosisImage4 from '../assets/Img_diagnosis (4).png';
import diagnosisImage5 from '../assets/Img_diagnosis (5).png';
import diagnosisImage6 from '../assets/Img_diagnosis (6).png';

// 진단 이미지 배열
const diagnosisImages = [
  diagnosisImage1,
  diagnosisImage2,
  diagnosisImage3,
  diagnosisImage4,
  diagnosisImage6,
  diagnosisImage5,
];

const calculateScore = (answers: (string | null)[]) => {
  let calculatedScore = 0;
  answers.forEach((answer: string | null, index: number) => {
    const question = diagnosisQuestions[index];
    if (question && answer) {
      const key = answer === 'unknown' ? 'neutral' : (answer as 'yes' | 'no');
      if (question.scores.hasOwnProperty(key)) {
        calculatedScore += question.scores[key];
      }
    }
  });
  return calculatedScore;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #FFFFFF;
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

const DiagnosisImage = styled.img`
  width: 100%;
  max-width: 260px;
  height: auto;
  margin: 0 auto 1.5rem;
  
`;

const Question = styled.p`
  font-size: 1.2rem;
  color: #333;
  line-height: 1.6;
  white-space: pre-line;
  margin: 0 auto 2rem;
  text-align: center;
  max-width: 500px;
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

const CounterText = styled.div`
  text-align: center;
  font-size: 1.05rem;
  color: #FF69B4;
  font-weight: 600;
  margin-bottom: 1.2rem;
`;

const BaselineDiagnosis: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [counter, setCounter] = useState<number | null>(null);
  const [counterLoaded, setCounterLoaded] = useState(false);

  useEffect(() => {
    // 첫 질문에 진입할 때만 카운터 증가 및 조회
    if (currentQuestion === 0 && !counterLoaded) {
      setCounterLoaded(true);
      incrementDiagnosisCounter()
        .then((count) => setCounter(2391 + count)) // 2391은 기본값(원하면 0으로)
        .catch(() => setCounter(2391));
    }
  }, [currentQuestion, counterLoaded]);

  const handleAnswer = (answer: 'yes' | 'no' | 'unknown') => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    if (currentQuestion < diagnosisQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const finalScore = calculateScore(newAnswers);
      navigate('/diagnosis/result', { state: { answers: newAnswers, score: finalScore } });
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

      {/* 첫 번째 질문에서만 카운터 표시 */}
      {currentQuestion === 0 && counter !== null && (
        <CounterText> 현재 {counter.toLocaleString()}명이 테스트를 완료했어요</CounterText>
      )}

      <ProgressBar 
        current={currentQuestion} 
        total={diagnosisQuestions.length}
      />

      <DiagnosisImage 
        src={diagnosisImages[currentQuestion]} 
        alt={`진단 질문 ${currentQuestion + 1}`}
      />
      <Question>
        {diagnosisQuestions[currentQuestion].text}
      </Question>

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