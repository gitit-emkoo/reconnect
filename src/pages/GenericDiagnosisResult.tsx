import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../components/Layout/PageLayout';
import { DIAGNOSIS_TEMPLATES } from '../templates/diagnosisTemplates';
import Image  from '../assets/Icon_Brain.png';

const ResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 120px); /* 헤더, 네비게이션바 높이 제외 */
  text-align: center;
  padding: 2rem;
`;


const ResultImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 1.5rem;
`;

const Score = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  color: #7c3aed;
  margin-bottom: 1rem;
`;

const ScoreLabel = styled.p`
  font-size: 1rem;
  color: #555;
  margin-bottom: 2rem;
`;

const Message = styled.p`
  font-size: 0.9rem;
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
    // 진단 결과 저장 API 호출 및 비회원 로컬스토리지 저장 코드 제거
  }, [diagnosis, template]);


  if (!diagnosis || !template) {
    return (
      <PageLayout title="진단 결과">
        <ResultWrapper>
          
            <Message>결과를 불러올 수 없습니다. 다시 시도해주세요.</Message>
            <ActionButton onClick={() => navigate('/expert/self-diagnosis')}>진단실로 이동하기</ActionButton>
          
        </ResultWrapper>
      </PageLayout>
    );
  }

  const resultMessage = template.getResultMessage
    ? template.getResultMessage(diagnosis.score)
    : '진단이 완료되었습니다.';

  // 제목/설명 분리 ("제목\n설명" 형태)
  let resultTitle = '';
  let resultDesc = '';
  if (resultMessage.includes('\n')) {
    [resultTitle, resultDesc] = resultMessage.split('\n');
  } else {
    resultTitle = resultMessage;
    resultDesc = '';
  }

  return (
    <PageLayout title={template.title + " 결과"}>
      <ResultWrapper>
        
          <ResultImage src={Image} alt="진단 결과 이미지" />
          <ScoreLabel>나의 진단 결과는?</ScoreLabel>
          <Score>{diagnosis.score}점</Score>
          <h3 style={{ fontWeight: 700, fontSize: '1rem', margin: '1.2rem 0 0.7rem', color: '#7c3aed' }}>{resultTitle}</h3>
          <Message>{resultDesc}</Message>
        
        <ActionButton onClick={() => navigate('/expert/self-diagnosis')}>
          진단실로 이동하기
        </ActionButton>
      </ResultWrapper>
    </PageLayout>
  );
};

export default GenericDiagnosisResult; 