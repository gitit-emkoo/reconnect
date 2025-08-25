import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import ProgressBar from '../components/common/ProgressBar';
import { diagnosisQuestions } from '../config/baselineDiagnosisQuestions';
import logoImage from '../assets/Logo.png';
import BrainIcon from '../assets/Icon_Brain.png';
import { incrementDiagnosisCounter } from '../api/diagnosis';


// 5점(매우 그렇다) ~ 1점(전혀 아니다) 합산
const calculateScore = (answers: number[]) => {
  return answers.reduce((sum, v) => sum + (typeof v === 'number' ? v : 0), 0);
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #FFFFFF;
  padding: 0 1rem;
  position: relative;
  
  @media (min-width: 768px) {
    padding: 0 2rem;
  }
`;

const Logo = styled.img`
  width: 150px;
  height: auto;
  margin: 0 auto 1rem;
  display: block;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  margin-top: 2rem;
  background-color: #f0f0f0;
  padding: 2rem;
  border-radius: 14px;
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

const BrainImg = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  display: block;
  margin: 0.5rem auto 0.75rem;
`;

const TimeNotice = styled.p`
  text-align: center;
  color:rgb(68, 89, 131);
  font-size: 1rem;
  margin: -0.5rem 0 0.75rem;
`;

const Question = styled.p`
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
  line-height: 1.6;
  white-space: pre-line;
  margin: 0 auto 2rem;
  text-align: center;
  max-width: 500px;
`;

const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.6rem;
  padding: 0 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    padding: 0 1rem 2rem;
  }
`;

const ScaleButton = styled.button<{ $tone: 'strongPos' | 'pos' | 'neutral' | 'neg' | 'strongNeg' }>`
  padding: 0.9rem 0.6rem;
  border-radius: 14px;
  font-size: 0.95rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  color: #fff;
  transition: transform 0.15s ease, opacity 0.15s ease;
  /* 신뢰감 있는 단일 톤(블루-인디고 계열)으로 통일 */
  background: linear-gradient(135deg,rgb(163, 198, 255), #785cd2);

  &:active { transform: translateY(1px); opacity: 0.95; }
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
  const [answers, setAnswers] = useState<number[]>([]);
  const [counter, setCounter] = useState<number | null>(null);
  const [counterLoaded, setCounterLoaded] = useState(false);

  useEffect(() => {
    // 첫 질문에 진입할 때만 카운터 증가 및 조회
    if (currentQuestion === 0 && !counterLoaded) {
      setCounterLoaded(true);
      incrementDiagnosisCounter()
        .then((count) => setCounter(5692 + count)) 
        .catch(() => setCounter(5692));
    }
  }, [currentQuestion, counterLoaded]);

  const handleAnswer = (value: 1 | 2 | 3 | 4 | 5) => {
    const newAnswers = [...answers, value];
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
      <BackButton fallbackTo="/diagnosis" />
      <Header style={{ marginBottom: currentQuestion === 0 ? '2rem' : '0.5rem' }}>
        <Logo src={logoImage} alt="Reconnect Logo" />
        <BrainImg src={BrainIcon} alt="brain" />
        {currentQuestion === 0 && (
          <>
            <Title>EmoMap: 감정지도 진단</Title>
            <Subtitle>신경과학, 사회심리학, 감정인지 모델을 통합한 정서 진단 프레임워크로, UCLA대학 심리학 연구 기관의 검증된 이론을 기반으로 본 진단은 개인의 감정을 결정짓는 7가지 핵심 심리 영역을 기반으로, 현재의 정서적 균형과 감정 건강 상태를 정밀하게 분석합니다.  
            정서적 안정성, 긍정 정서 결핍, 자기 인식, 대인관계 연결감, 회복탄력성, 감정 조절 능력, 동기 및 에너지 수준 등 각 영역을 통해 감정의 흐름과 불균형 요인을 파악하고, 감정 회복을 위한 방향성을 제시합니다. </Subtitle>
          </>
        )}
        {currentQuestion === 0 && (
        <TimeNotice>이 진단은 약 3분 정도 소요됩니다.</TimeNotice>
      )}

      {/* 첫 번째 질문에서만 카운터 표시 */}
      {currentQuestion === 0 && counter !== null && (
        <CounterText> 현재 {counter.toLocaleString()}명이 테스트를 완료했어요</CounterText>
      )}
      </Header>

      

      <ProgressBar 
        current={currentQuestion} 
        total={diagnosisQuestions.length}
      />

      <Question>
        {diagnosisQuestions[currentQuestion].text}
      </Question>

      <ButtonContainer>
        <ScaleButton $tone="strongPos" onClick={() => handleAnswer(5)}>매우 그렇다</ScaleButton>
        <ScaleButton $tone="pos" onClick={() => handleAnswer(4)}>그렇다</ScaleButton>
        <ScaleButton $tone="neutral" onClick={() => handleAnswer(3)}>보통이다</ScaleButton>
        <ScaleButton $tone="neg" onClick={() => handleAnswer(2)}>아니다</ScaleButton>
        <ScaleButton $tone="strongNeg" onClick={() => handleAnswer(1)}>전혀 아니다</ScaleButton>
      </ButtonContainer>
    </Container>
  );
};

export default BaselineDiagnosis; 