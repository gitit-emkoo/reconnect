import React from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import TemperatureDescription from "../components/report/TemperatureDescription";
import HeartGauge from '../components/Dashboard/HeartGauge';
import { useReportData } from '../hooks/useReportData';
import { ReportData } from "../api/report";

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

const GaugeWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const ReportHeader: React.FC<{
  availableWeeks: { value: string; label: string }[];
  selectedWeekValue: string;
  onWeekChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ availableWeeks, selectedWeekValue, onWeekChange }) => (
  <Header>
    <WeekInfo>주간 리포트</WeekInfo>
    <WeekSelector value={selectedWeekValue} onChange={onWeekChange} disabled={availableWeeks.length === 0}>
      {availableWeeks.length > 0 ? (
        availableWeeks.map(week => (
          <option key={week.value} value={week.value}>{week.label}</option>
        ))
      ) : (
        <option>리포트 없음</option>
      )}
    </WeekSelector>
  </Header>
);

const NoReportPlaceholder: React.FC<{ onNavigate: () => void; hasPartner: boolean }> = ({ onNavigate, hasPartner }) => (
  <Section>
    <Title>아직 리포트가 없어요</Title>
    <p>파트너와 연결하고 활동을 시작하면 첫 번째 주간 리포트가 생성됩니다.</p>
    {!hasPartner && <CTA onClick={onNavigate}>파트너 초대하기</CTA>}
  </Section>
);

const ExpertSolutionCTA: React.FC<{ onNavigate: () => void }> = ({ onNavigate }) => (
  <Section>
    <Title>전문가 솔루션</Title>
    <p>관계 개선에 도움이 되는 다양한 콘텐츠를 살펴보세요.</p>
    <CTA onClick={onNavigate}>솔루션 보러가기</CTA>
  </Section>
);

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

const RelationshipTemperature: React.FC<{ report: ReportData }> = ({ report }) => {
  const score = report.overallScore;

  return (
    <Section>
      <Title>이번 주 관계 온도</Title>
      <GaugeWrapper>
        <HeartGauge percentage={(score / 100) * 100} />
      </GaugeWrapper>
      <TemperatureDescription score={score} reason={report.reason} />
    </Section>
  );
};

const WeeklyActivitySummary: React.FC<{ report: ReportData, previousReport: ReportData | null }> = ({ report, previousReport }) => (
  <Section>
    <Title>주간 활동 요약</Title>
    <ReportMetric label="관계 온도" value={report.overallScore} unit="°" previousValue={previousReport?.overallScore} />
    <ReportMetric label="보낸 마음 카드" value={report.cardsSentCount} unit="개" previousValue={previousReport?.cardsSentCount} />
    <ReportMetric label="완료한 챌린지" value={report.challengesCompletedCount} unit="개" previousValue={previousReport?.challengesCompletedCount} />
    <ReportMetric label="놓친 챌린지" value={report.challengesFailedCount} unit="개" previousValue={previousReport?.challengesFailedCount} invertColors />
    <ReportMetric label="전문가 솔루션" value={report.expertSolutionsCount} unit="개" previousValue={previousReport?.expertSolutionsCount} />
    <ReportMetric label="관계 진단" value={report.marriageDiagnosisCount} unit="회" previousValue={previousReport?.marriageDiagnosisCount} />
  </Section>
);

const Report: React.FC = () => {
  const navigate = useNavigate();
  const {
    loading,
    error,
    currentReport,
    previousReport,
    availableWeeks,
    selectedWeekValue,
    handleWeekChange,
    hasPartner,
  } = useReportData();

  if (error) {
    return <div>에러: {error}</div>;
  }
  
  return (
    <>
      <Container>
        {loading ? (
          <div>리포트를 불러오는 중입니다...</div>
        ) : currentReport ? (
          <>
            <RelationshipTemperature report={currentReport} />
            <ReportHeader 
              availableWeeks={availableWeeks}
              selectedWeekValue={selectedWeekValue}
              onWeekChange={handleWeekChange}
            />
            <WeeklyActivitySummary report={currentReport} previousReport={previousReport} />
            <ExpertSolutionCTA onNavigate={() => navigate('/expert')} />
          </>
        ) : (
          <NoReportPlaceholder 
            onNavigate={() => navigate('/invite')}
            hasPartner={hasPartner}
          />
        )}
      </Container>
      <NavigationBar />
    </>
  );
};

export default Report;
