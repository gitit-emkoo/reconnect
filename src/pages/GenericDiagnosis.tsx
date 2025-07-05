import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import ProgressBar from '../components/common/ProgressBar';
import logoImage from '../assets/Logo.png';
import { DIAGNOSIS_TEMPLATES } from '../templates/diagnosisTemplates';
import useAuthStore from '../store/authStore';
import { postDiagnosisResult } from '../api/diagnosis';

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
  flex-direction: column;
  gap: 0.8rem;
  align-items: center;
  padding: 0 1rem;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  width: 100%;
  max-width: 400px;
  color: #333;
  transition: all 0.2s;

  &:hover {
    background: #f0f0f0;
    border-color: #ccc;
  }
`;

const GenericDiagnosis: React.FC = () => {
  const navigate = useNavigate();
  const { diagnosisId } = useParams<{ diagnosisId: string }>();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const accessToken = useAuthStore(state => state.accessToken);

  const template = DIAGNOSIS_TEMPLATES.find(t => t.id === diagnosisId);

  const handleAnswer = async (answerValue: number) => {
    if (!template) return;

    const newAnswers = [...answers, answerValue];
    setAnswers(newAnswers);

    if (currentQuestion < template.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 점수 계산
      const score = template.calculateScore(newAnswers);
      const newHistoryItem = {
        id: Date.now(), // Unique ID
        date: new Date().toLocaleString('ko-KR'),
        score,
        answers: newAnswers,
      };

      if (accessToken) {
        // 로그인 상태면 서버에 저장
        try {
          await postDiagnosisResult({
            resultType: diagnosisId!,
            score,
            diagnosisType: diagnosisId!,
          });
        } catch (e) {
          alert('진단 결과 저장에 실패했습니다. 네트워크 상태를 확인해주세요.');
        }
      } else {
        // 비회원(베이스라인 진단 등)만 로컬스토리지 저장
        const storageKey = `diagnosisHistory_${diagnosisId}`;
        const existingHistory = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const updatedHistory = [newHistoryItem, ...existingHistory];
        localStorage.setItem(storageKey, JSON.stringify(updatedHistory));
      }
      // 결과 페이지로 이동
      navigate(`/generic-diagnosis-result/${diagnosisId}`, { state: { diagnosis: newHistoryItem } });
    }
  };

  if (!template) {
    return <Container>잘못된 접근이거나 유효하지 않은 진단입니다.</Container>;
  }

  if (template.questions.length === 0) {
    return (
      <Container>
        <BackButton />
        <Header>
          <Logo src={logoImage} alt='Reconnect Logo' />
          <Title>{template.title}</Title>
          <Subtitle>{template.subtitle}</Subtitle>
        </Header>
        <QuestionCard>
          <Question>진단 질문이 아직 준비되지 않았습니다.</Question>
        </QuestionCard>
      </Container>
    );
  }

  const currentQ = template.questions[currentQuestion];

  return (
    <Container>
      <BackButton />
      <Header>
        <Logo src={logoImage} alt="Reconnect Logo" />
        <Title>{template.title}</Title>
        <Subtitle>{template.subtitle}</Subtitle>
      </Header>

      <ProgressBar 
        current={currentQuestion} 
        total={template.questions.length}
      />

      <QuestionCard>
        <Question>{currentQ.text}</Question>
      </QuestionCard>

      <ButtonContainer>
        {currentQ.options ? (
          currentQ.options.map(opt => (
            <Button key={opt.value} onClick={() => handleAnswer(opt.value)}>
              {opt.text}
            </Button>
          ))
        ) : currentQ.scores ? (
          <>
            <Button onClick={() => handleAnswer(currentQ.scores!.yes)}>
              그렇다
            </Button>
            <Button onClick={() => handleAnswer(currentQ.scores!.neutral)}>
              보통이다
            </Button>
            <Button onClick={() => handleAnswer(currentQ.scores!.no)}>
              아니다
            </Button>
          </>
        ) : (
          <p>이 질문에 대한 선택지가 없습니다.</p>
        )}
      </ButtonContainer>
    </Container>
  );
};

export default GenericDiagnosis; 