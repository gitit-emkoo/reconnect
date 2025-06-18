import React from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Popup from '../components/common/Popup';
import NavigationBar from '../components/NavigationBar';
import { formatInKST } from '../utils/date';

const Container = styled.div`
  background-color: #f9fafb;
  min-height: 100vh;
  padding: 2rem;
`;

const Section = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Metric = styled.p`
  font-size: 1rem;
  color: #4b5563;
  margin: 0.25rem 0;
`;

const Highlight = styled.span`
  font-weight: bold;
  color: #0ea5e9;
`;

const CTA = styled.button`
  display: block;
  width: 100%;
  margin-top: 1rem;
  padding: 1rem;
  background-color: #0ea5e9;
  color: white;
  font-weight: 500;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  &:hover {
    background-color: #0284c7;
  }
`;

const DiagnosisSection = styled(Section)`
  margin-top: 2rem;
`;

const DiagnosisList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const DiagnosisItem = styled.li`
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: #f3f4f6;
  }
`;

const DiagnosisButton = styled(CTA)`
  background-color: #7c3aed;
  margin-top: 0.5rem;
  &:hover {
    background-color: #5b21b6;
  }
`;

const Report: React.FC = () => {
  const relationTemp = 37.2;
  const emotionShares = 4;
  const missionCount = 2;
  const navigate = useNavigate();
  const [diagnosisList, setDiagnosisList] = useState<any[]>([]);
  const todayKey = 'report_popup';
  const today = new Date();
  const ymd = formatInKST(today, 'yyyyMMdd');
  const hideToday = typeof window !== 'undefined' && localStorage.getItem(`${todayKey}_${ymd}`) === 'true';
  const [showPopup, setShowPopup] = useState(!hideToday);

  useEffect(() => {
    // 진단 내역 불러오기 (localStorage)
    const data = localStorage.getItem('diagnosisHistory');
    if (data) {
      setDiagnosisList(JSON.parse(data));
    }
  }, []);

  return (
    <>
      <Popup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        title="리포트 안내"
        emoji="📊"
        description={<>
          이번 주 리포트와 진단 결과를<br />
          한눈에 확인해보세요!<br />
          
        </>}
        buttonText="확인"
        onButtonClick={() => setShowPopup(false)}
        todayKey="report_popup"
      />
      <Container>
        <Section>
          <Title>이번 주 리포트 📊</Title>
          <Metric>
            관계 온도: <Highlight>{relationTemp.toFixed(1)}℃</Highlight>
          </Metric>
          <Metric>
            감정 나눔 횟수: <Highlight>{emotionShares}회</Highlight>
          </Metric>
          <Metric>
            미션 수행 횟수: <Highlight>{missionCount}회</Highlight>
          </Metric>
          <CTA onClick={() => alert("전문가 솔루션 유도 (유료 진입)")}>전문가 솔루션 보기</CTA>
        </Section>

        <DiagnosisSection>
          <Title>결혼생활 심리진단</Title>
          <DiagnosisButton onClick={() => navigate('/marriage-diagnosis')}>심리진단하기</DiagnosisButton>
          <div style={{ margin: '1.5rem 0 0.5rem 0', fontWeight: 500 }}>진단 내역</div>
          {diagnosisList.length === 0 ? (
            <div style={{ color: '#64748b', fontSize: '0.95rem' }}>아직 진단 내역이 없습니다.</div>
          ) : (
            <DiagnosisList>
              {diagnosisList.map((item, idx) => (
                <DiagnosisItem key={idx} onClick={() => navigate(`/diagnosis-result/${item.id ?? idx}`)}>
                  <div style={{ fontWeight: 600 }}>{item.date || '진단일 미상'}</div>
                  <div style={{ fontSize: '0.95rem', color: '#7c3aed', fontWeight: 500 }}>점수: {item.score}점</div>
                  <div style={{ fontSize: '0.92rem', color: '#64748b' }}>{item.message}</div>
                </DiagnosisItem>
              ))}
            </DiagnosisList>
          )}
        </DiagnosisSection>
      </Container>
      <NavigationBar />
    </>
  );
}; 

//전문가 상담을 위한 심리검사를 하시겠씁니까? 예-> 심리검사 페이지로 이동

export default Report;
