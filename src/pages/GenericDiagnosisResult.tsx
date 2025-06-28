import React from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../components/Layout/PageLayout';
import { DIAGNOSIS_TEMPLATES } from '../templates/diagnosisTemplates';

const ResultContainer = styled.div`
  text-align: center;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
`;

const Score = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  color: #7c3aed;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ActionButton = styled.button`
  background: #7c3aed;
  color: #fff;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin: 0 0.5rem;
`;

const GenericDiagnosisResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { diagnosisId } = useParams<{ diagnosisId: string }>();
  
  const diagnosis = location.state?.diagnosis;
  const template = DIAGNOSIS_TEMPLATES.find(t => t.id === diagnosisId);

  if (!diagnosis || !template) {
    return (
      <PageLayout title="진단 결과">
        <ResultContainer>
          <p>결과를 불러올 수 없습니다. 다시 시도해주세요.</p>
          <ActionButton onClick={() => navigate('/expert')}>진단 목록으로</ActionButton>
        </ResultContainer>
      </PageLayout>
    );
  }

  const resultMessage = template.getResultMessage(diagnosis.score);

  return (
    <PageLayout title={template.title + " 결과"}>
      <ResultContainer>
        <Score>{diagnosis.score}점</Score>
        <Message>{resultMessage}</Message>
        <ActionButton onClick={() => navigate('/expert/self-diagnosis-room')}>완료</ActionButton>
      </ResultContainer>
    </PageLayout>
  );
};

export default GenericDiagnosisResult; 