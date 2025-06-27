import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from '../api/axios';

const Container = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const ResultContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const ResultText = styled.p`
  font-size: 18px;
  margin: 10px 0;
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius 4px;
  cursor: pointer;
`;

const MarriageDiagnosisResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState<{ diagnosis: { id: string; date: string; score: number; answers: number[]; } } | null>(null);

  useEffect(() => {
    // (1) state에서 진단 결과를 받아옵니다.
    const stateResult = (location.state as { diagnosis?: { id: string; date: string; score: number; answers: number[]; } })?.diagnosis;
    if (stateResult) {
      setResult({ diagnosis: stateResult });
      // 진단 완료 시, 진단 결과를 서버에 저장(또는 조회)하는 API를 호출합니다.
      (async () => {
         try {
           // 수정한 /diagnosis 엔드포인트로 점수와 결과 타입을 전송
           const res = await axios.post('/diagnosis', { 
             score: stateResult.score,
             resultType: '결혼생활 심리진단' 
           });
           // 회원가입 시 사용하기 위해 진단 ID를 localStorage에 저장
           if (res.data && res.data.id) {
             localStorage.setItem('unauthDiagnosisId', res.data.id);
           }
           console.log('진단 결과 저장 성공 (Report 생성/업데이트):', res.data);
         } catch (err) {
           console.error('진단 결과 저장 실패:', err);
         }
      })();
    } else {
      // (2) localStorage에서 진단 내역을 불러와서 최신 진단 결과를 사용합니다.
      const history = JSON.parse(localStorage.getItem('diagnosisHistory') || '[]');
      if (history.length > 0) {
         setResult({ diagnosis: history[0] });
         // (※ 진단 결과가 localStorage에 있으면, 서버에 저장(또는 조회)하는 API를 호출하지 않습니다.)
      }
    }
  }, [location]);

  const handleBack = () => {
    navigate('/expert/self-diagnosis');
  };

  if (!result) {
    return <Container>진단 결과를 불러오는 중입니다...</Container>;
  }

  const { diagnosis } = result;

  return (
    <Container>
      <Title>결혼생활 심리 진단 결과</Title>
      <ResultContainer>
        <ResultText> 진단 ID: {diagnosis.id} </ResultText>
        <ResultText> 진단 날짜: {diagnosis.date} </ResultText>
        <ResultText> 총 점수: {diagnosis.score} </ResultText>
        <ResultText> (※ 진단 문항별 답변: {diagnosis.answers.join(', ')} ) </ResultText>
      </ResultContainer>
      <Button onClick={handleBack}> 자기이해 진단 페이지로 돌아가기 </Button>
    </Container>
  );
};

export default MarriageDiagnosisResult; 