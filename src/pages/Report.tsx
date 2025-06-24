import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import Popup from '../components/common/Popup';
import NavigationBar from '../components/NavigationBar';
import { formatInKST } from '../utils/date';

import {  ReportData } from '../api/report';
import TemperatureDescription from "../components/report/TemperatureDescription";

const Container = styled.div`
  background-color: #f9fafb;
  min-height: 100vh;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const WeekInfo = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
`;

const WeekSelector = styled.select`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
  cursor: pointer;
`;

const Section = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const ReportItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }
`;

const MetricGroup = styled.div`
  font-size: 1rem;
  color: #4b5563;
`;

const Highlight = styled.span`
  font-weight: bold;
  color: #333;
`;

const ComparisonGroup = styled.div<{ change: 'increase' | 'decrease' | 'same' }>`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ change }) =>
    change === 'increase' ? '#0ea5e9' :
    change === 'decrease' ? '#ef4444' :
    '#6b7280'};
  display: flex;
  align-items: center;
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

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
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

const mockAvailableWeeks = [
  { label: '6월 3주차', value: '2024-25' },
  { label: '6월 2주차', value: '2024-24' },
  { label: '6월 1주차', value: '2024-23' },
];

const mockReports: { [key: string]: ReportData } = {
  '2024-25': { // 6월 3주차
    id: '3', weekStartDate: '2024-06-17', overallScore: 38, cardsSentCount: 1, challengesCompletedCount: 2, challengesFailedCount: 0, expertSolutionsCount: 1, marriageDiagnosisCount: 0, reason: '', coupleId: '1'
  },
  '2024-24': { // 6월 2주차
    id: '2', weekStartDate: '2024-06-10', overallScore: 36, cardsSentCount: 2, challengesCompletedCount: 1, challengesFailedCount: 1, expertSolutionsCount: 1, marriageDiagnosisCount: 1, reason: '', coupleId: '1'
  },
  '2024-23': { // 6월 1주차
    id: '1', weekStartDate: '2024-06-03', overallScore: 33.5, cardsSentCount: 3, challengesCompletedCount: 2, challengesFailedCount: 2, expertSolutionsCount: 0, marriageDiagnosisCount: 0, reason: '', coupleId: '1'
  },
};

const ReportMetric: React.FC<{ label: string; value: number; unit: string; previousValue?: number; invertColors?: boolean }> =
  ({ label, value, unit, previousValue, invertColors = false }) => {
    
    if (previousValue === undefined) {
      return (
        <ReportItem>
          <MetricGroup>
            {label}: <Highlight>{value.toFixed(label === '관계 온도' ? 1 : 0)}{unit}</Highlight>
          </MetricGroup>
          <ComparisonGroup change={'same'}>-</ComparisonGroup>
        </ReportItem>
      );
    }
    
    const difference = value - previousValue;
    let change: 'increase' | 'decrease' | 'same' = 'same';
    if (difference > 0) change = 'increase';
    if (difference < 0) change = 'decrease';

    const isPositiveChangeGood = !invertColors;
    const changeColor = 
      (change === 'increase' && isPositiveChangeGood) || (change === 'decrease' && !isPositiveChangeGood) ? 'increase' :
      (change === 'decrease' && isPositiveChangeGood) || (change === 'increase' && !isPositiveChangeGood) ? 'decrease' : 
      'same';

    return (
      <ReportItem>
        <MetricGroup>
          {label}: <Highlight>{value.toFixed(label === '관계 온도' ? 1 : 0)}{unit}</Highlight>
        </MetricGroup>
        <ComparisonGroup change={changeColor}>
          {change === 'increase' && '▴'}
          {change === 'decrease' && '▾'}
          {change !== 'same' ? `${Math.abs(difference).toFixed(label === '관계 온도' ? 1 : 0)}${unit}` : '-'}
        </ComparisonGroup>
      </ReportItem>
    );
};

const Report: React.FC = () => {
  const navigate = useNavigate();
  const [selectedWeek, setSelectedWeek] = useState<string>(mockAvailableWeeks[0]?.value);

  const todayKey = 'report_popup';
  const today = new Date()
  const ymd = formatInKST(today, 'yyyyMMdd');
  const hideToday = typeof window !== 'undefined' && localStorage.getItem(`${todayKey}_${ymd}`) === 'true';
  const [showPopup, setShowPopup] = useState(!hideToday);


  const [diagnosisList, setDiagnosisList] = useState<any[]>([]);
  useEffect(() => {
    // 진단 내역 불러오기 (localStorage)
    const data = localStorage.getItem('diagnosisHistory');
    if (data) {
      setDiagnosisList(JSON.parse(data));
    }
  }, []);

  const handleWeekChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWeek(e.target.value);
  };

  const currentWeekLabel = mockAvailableWeeks.find(w => w.value === selectedWeek)?.label || '리포트';
  
  const reportData = useMemo(() => mockReports[selectedWeek], [selectedWeek]);
  
  const getPreviousWeekValue = (currentValue: string) => {
    const currentIndex = mockAvailableWeeks.findIndex(w => w.value === currentValue);
    if (currentIndex < mockAvailableWeeks.length - 1) {
      return mockAvailableWeeks[currentIndex + 1]?.value;
    }
    return undefined;
  };

  const previousReportData = useMemo(() => {
    const previousWeekValue = getPreviousWeekValue(selectedWeek);
    return previousWeekValue ? mockReports[previousWeekValue] : undefined;
  }, [selectedWeek]);

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
        <Header>
          <WeekInfo>{currentWeekLabel}</WeekInfo>
            <WeekSelector value={selectedWeek} onChange={handleWeekChange}>
              {mockAvailableWeeks.map(week => (
                <option key={week.value} value={week.value}>
                  {week.label}
                </option>
              ))}
            </WeekSelector>
        </Header>

        {reportData ? (
          <Section>
            <ReportMetric label="관계 온도" value={reportData.overallScore} unit="도" previousValue={previousReportData?.overallScore} />
            <ReportMetric label="감정카드 보낸 횟수" value={reportData.cardsSentCount} unit="회" previousValue={previousReportData?.cardsSentCount} />
            <ReportMetric label="챌린지 성공 횟수" value={reportData.challengesCompletedCount} unit="회" previousValue={previousReportData?.challengesCompletedCount} />
            <ReportMetric label="챌린지 실패 횟수" value={reportData.challengesFailedCount} unit="회" previousValue={previousReportData?.challengesFailedCount} invertColors />
            <TemperatureDescription score={reportData.overallScore} />
          </Section>
        ) : (
          <Section>
            <p>선택된 주의 리포트 데이터가 없습니다.</p>
          </Section>
        )}
        
        <CTA onClick={() => alert("전문가 솔루션 유도 (유료 진입)")}>전문가 솔루션 보기</CTA>

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
