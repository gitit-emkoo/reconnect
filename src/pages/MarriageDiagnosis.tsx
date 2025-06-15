import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/common/BackButton';

// 30문항 리스트 (A~E 영역)
const questions = [
  // A. 나의 성향 (Q1~Q6)
  '나는 내 감정을 비교적 쉽게 표현하는 편이다.',
  '나는 상대방의 말보다 표정이나 태도에 민감한 편이다.',
  '갈등 상황이 생기면 먼저 대화를 시도하려고 한다.',
  '나는 혼자만의 시간이 꼭 필요한 사람이다.',
  '감정이 상해도 그 자리에서는 표현하지 않는 편이다.',
  '나는 관계 속에서 상대방을 자주 관찰하고 분석한다.',
  // B. 결혼생활에 대한 감정 (Q7~Q12)
  '나는 지금의 결혼생활이 대체로 만족스럽다고 느낀다.',
  '결혼한 이후 나 자신이 감정적으로 더 안정되었다.',
  '나는 결혼 후 외로움을 느끼는 일이 드물다.',
  '요즘 배우자에게 고마운 감정이 자주 든다.',
  '나는 배우자에게 애정을 느끼는 순간이 종종 있다.',
  '나의 결혼생활은 누군가에게 자랑할 수 있을 만큼 괜찮다.',
  // C. 감정 소진 및 불만 영역 (Q13~Q18, 역채점)
  '나는 결혼생활이 때때로 무의미하게 느껴진다.',
  '배우자와 함께 있어도 공허함을 느낀다.',
  '요즘 결혼생활이 점점 버겁다고 느껴진다.',
  '배우자에게 하고 싶은 말이 많지만 꺼내지 못한다.',
  '나는 배우자와 함께 있는 시간보다 혼자 있는 시간이 더 편하다.',
  '때로는 "결혼을 다시 생각해볼 걸"이라는 생각이 든다.',
  // D. 관계 소통과 공감 (Q19~Q24)
  '나는 배우자와 솔직한 감정 대화를 할 수 있다고 믿는다.',
  '우리는 말하지 않아도 서로를 어느 정도 이해한다고 느낀다.',
  '배우자와 사소한 것들을 함께 이야기하는 게 즐겁다.',
  '감정적으로 불안한 날, 배우자가 내 편이 되어준다.',
  '나는 상대의 감정을 자주 먼저 알아차리는 편이다.',
  '우리는 감정 갈등 후 시간이 지나면 자연스럽게 회복된다.',
  // E. 기대치와 관계의 미래 (Q25~Q30)
  '나는 이 결혼생활을 앞으로도 유지하고 싶다.',
  '우리는 앞으로 더 가까워질 수 있다고 생각한다.',
  '결혼생활이 지금보다 나아질 수 있다는 희망이 있다.',
  '나는 배우자와 함께 성장하고 있다고 느낀다.',
  '우리는 앞으로 더 나은 관계를 만들 수 있는 기반이 있다고 본다.',
  "지금은 관계를 다시 돌볼 수 있는 '시기'라고 생각한다."
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
  font-size: 0.95rem;
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
  font-size: 1.15rem;
  color: #333;
  line-height: 1.6;
  white-space: pre-line;
  margin: 0;
`;

const ScaleContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.7rem;
  margin-top: 1.5rem;
`;

const ScaleButton = styled.button<{ selected: boolean }>`
  padding: 0.7rem 1.2rem;
  border-radius: 50%;
  font-size: 1.1rem;
  font-weight: 600;
  border: 2px solid ${({ selected }) => (selected ? '#7c3aed' : '#e5e7eb')};
  background: ${({ selected }) => (selected ? '#ede9fe' : 'white')};
  color: ${({ selected }) => (selected ? '#7c3aed' : '#333')};
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    border-color: #7c3aed;
    background: #f3f0ff;
  }
`;

const Progress = styled.div`
  margin: 1.5rem auto 0.5rem auto;
  text-align: center;
  font-size: 1rem;
  color: #7c3aed;
`;

const MarriageDiagnosis: React.FC = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(30).fill(0));

  const handleSelect = (score: number) => {
    const newAnswers = [...answers];
    newAnswers[current] = score;
    setAnswers(newAnswers);
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      // 진단 완료: 결과 계산 및 저장
      const result = calculateDiagnosisResult(newAnswers);
      // 진단 내역 저장
      const history = JSON.parse(localStorage.getItem('diagnosisHistory') || '[]');
      const newItem = {
        id: Date.now(),
        date: new Date().toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        answers: newAnswers,
        score: result.totalScore,
        message: result.message,
        emotionalTemperature: result.emotionalTemperature
      };
      localStorage.setItem('diagnosisHistory', JSON.stringify([newItem, ...history]));
      navigate('/marriage-diagnosis-result', { state: { diagnosis: newItem } });
    }
  };

  return (
    <Container>
      <BackButton />
      <Header>
        <Title>결혼생활 심리진단</Title>
        <Subtitle>아래 30문항에 대해 솔직하게 답해주세요.<br/>1점: 전혀 그렇지 않다 ~ 5점: 매우 그렇다</Subtitle>
      </Header>
      <Progress>
        {current + 1} / {questions.length} 문항
      </Progress>
      <QuestionCard>
        <Question>{questions[current]}</Question>
        <ScaleContainer>
          {[1, 2, 3, 4, 5].map((score) => (
            <ScaleButton
              key={score}
              selected={answers[current] === score}
              onClick={() => handleSelect(score)}
            >
              {score}
            </ScaleButton>
          ))}
        </ScaleContainer>
      </QuestionCard>
    </Container>
  );
};

// 진단 결과 계산 함수
function calculateDiagnosisResult(answers: number[]) {
  // 역채점(Q13~Q18, index 12~17)
  const scored = [...answers];
  for (let i = 12; i <= 17; i++) {
    scored[i] = 6 - scored[i];
  }
  const totalScore = scored.reduce((a, b) => a + b, 0);
  const emotionalTemperature = Math.round((totalScore / 150) * 100);
  let message = '';
  if (totalScore >= 120) message = '지금의 결혼생활에 안정감이 있습니다. 작은 관심만 지속해도 좋아요!';
  else if (totalScore >= 90) message = '기본적인 애정과 공감은 있지만, 감정 표현과 회복의 노력이 필요해요.';
  else if (totalScore >= 60) message = '감정 피로가 누적 중입니다. 스스로와 관계를 돌볼 시점이에요.';
  else message = '마음이 지쳐 있을 가능성이 높습니다. 회복을 위한 외부 자극이 필요해요.';
  return { totalScore, emotionalTemperature, message };
}

export default MarriageDiagnosis; 