import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../components/Layout/PageLayout';
import { DIAGNOSIS_TEMPLATES } from '../templates/diagnosisTemplates';
import axios from '../api/axios';

const ResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 120px); /* 헤더, 네비게이션바 높이 제외 */
  text-align: center;
  padding: 2rem;
`;

const ResultCard = styled.div`
  background: #fff;
  border-radius: 1.5rem;
  padding: 3rem 2.5rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
`;

const Score = styled.h2`
  font-size: 4rem;
  font-weight: 800;
  color: #7c3aed;
  margin-bottom: 1rem;
`;

const ScoreLabel = styled.p`
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 2rem;
`;

const Message = styled.p`
  font-size: 1.1rem;
  margin-bottom: 2.5rem;
  line-height: 1.7;
  color: #333;
  white-space: pre-wrap; /* 줄바꿈 문자를 인식하도록 설정 */
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #8e44ad, #7c3aed);
  color: #fff;
  border: none;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
  }
`;

const GenericDiagnosisResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { diagnosisId } = useParams<{ diagnosisId: string }>();

  const diagnosis = location.state?.diagnosis;
  const template = DIAGNOSIS_TEMPLATES.find(t => t.id === diagnosisId);

  useEffect(() => {
    if (diagnosis && template) {
      // MarriageDiagnosisResult에 있던 서버 전송 로직을 가져옴
      (async () => {
        try {
          const res = await axios.post('/diagnosis', {
            score: diagnosis.score,
            resultType: template.title, // 템플릿의 타이틀을 resultType으로 사용
            diagnosisType: template.id,
          });
          // 비회원 진단 ID 저장
          if (res.data?.id) {
            localStorage.setItem('unauthDiagnosisId', res.data.id);
          }
          console.log('진단 결과 저장 성공:', res.data);
        } catch (err) {
          console.error('진단 결과 저장 실패:', err);
        }
      })();
    }
  }, [diagnosis, template]);


  if (!diagnosis || !template) {
    return (
      <PageLayout title="진단 결과">
        <ResultWrapper>
          <ResultCard>
            <Message>결과를 불러올 수 없습니다. 다시 시도해주세요.</Message>
            <ActionButton onClick={() => navigate('/expert/self-diagnosis')}>진단실로 이동하기</ActionButton>
          </ResultCard>
        </ResultWrapper>
      </PageLayout>
    );
  }

  const resultMessage = template.getResultMessage(diagnosis.score);

  return (
    <PageLayout title={template.title + " 결과"}>
      <ResultWrapper>
        <ResultCard>
          <ScoreLabel>나의 점수는?</ScoreLabel>
          <Score>{diagnosis.score}점</Score>
          <Message>{resultMessage}</Message>
        </ResultCard>
        <ActionButton onClick={() => navigate('/expert/self-diagnosis')}>
          진단실로 이동하기
        </ActionButton>
      </ResultWrapper>
    </PageLayout>
  );
};

export default GenericDiagnosisResult; 