import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import TemperatureDescription from "../components/report/TemperatureDescription";
import HeartGauge from '../components/Dashboard/HeartGauge';
import { useReportData } from '../hooks/useReportData';
import { ReportData } from "../api/report";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ConfirmationModal from '../components/common/ConfirmationModal';

const Container = styled.div`
  background-color: #f9fafb;
  min-height: 100vh;
  padding: 2rem;
  padding-bottom: 80px;
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
  background-color: rgb(255, 255, 255);
  border-radius: 8px;
  border: 1px solid #785CD2;
  font-size: 1rem;
  cursor: pointer;

  option {
    background-color: white;
    border: 1px solid #785CD2;
    font-size: 1rem;
    padding: 0.5rem;
    
    &:hover {
      background-color: #ff69b4;
      color: white;
    }
  }
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
  background: linear-gradient(135deg, #FF89B5 0%, #9471FF 100%);
  color: white;
  font-weight: bold;
  font-size: 1rem;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
`;

const Title = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const GaugeWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const CenteredSection = styled(Section)`
  text-align: center;
`;

const PlaceholderText = styled.p`
  margin: 1rem 0;
  color: #6b7280;
`;

const LoadingContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AnnouncementText = styled.div`
  text-align: center;
  margin-bottom: 16px;
  color: #785CD2;
  font-weight: 600;
  font-size: 16px;
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

const RelationshipTemperature: React.FC<{ score: number; reason?: string }> = ({ score, reason }) => {
  return (
    <Section>
      <Title>이번 주 관계 온도</Title>
      <GaugeWrapper>
        <HeartGauge percentage={score} size={150} />
      </GaugeWrapper>
      {reason && <TemperatureDescription score={score} reason={reason} />}
    </Section>
  );
};

const WeeklyActivitySummary: React.FC<{ report: ReportData | null, previousReport: ReportData | null }> = ({ report, previousReport }) => (
  <Section>
    <Title>주간 활동 요약</Title>
    <ReportMetric label="🌡️ 관계 온도" value={report?.overallScore ?? 0} unit="°" previousValue={previousReport?.overallScore} />
    <ReportMetric label="📩 교환한 카드" value={report?.cardsSentCount ?? 0} unit="개" previousValue={previousReport?.cardsSentCount} />
    <ReportMetric label="🏆 완료한 챌린지" value={report?.challengesCompletedCount ?? 0} unit="개" previousValue={previousReport?.challengesCompletedCount} />
    <ReportMetric label="❌ 놓친 챌린지" value={report?.challengesFailedCount ?? 0} unit="개" previousValue={previousReport?.challengesFailedCount} invertColors />
    <ReportMetric label="💡 전문가 솔루션" value={report?.expertSolutionsCount ?? 0} unit="개" previousValue={previousReport?.expertSolutionsCount} />
    <ReportMetric label="🔍 셀프 진단" value={report?.marriageDiagnosisCount ?? 0} unit="회" previousValue={previousReport?.marriageDiagnosisCount} />
  </Section>
);

const NoDataPlaceholder: React.FC<{ title: string; text: string; buttonText: string; onNavigate: () => void; }> = 
  ({ title, text, buttonText, onNavigate }) => (
    <CenteredSection>
      <Title>{title}</Title>
      <PlaceholderText>{text}</PlaceholderText>
      <CTA onClick={onNavigate}>{buttonText}</CTA>
    </CenteredSection>
);

// 간단한 모달 컴포넌트
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
    latestScore,
  } = useReportData();
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState('');

  // 리포트 발행 모달 로직
  useEffect(() => {
    if (currentReport && hasPartner) {
      // 주차 정보(예: '2024-06-4')를 value로 받는다고 가정
      const reportKey = `report_issued_${currentReport.id}`;
      if (!localStorage.getItem(reportKey)) {
        // availableWeeks에서 현재 선택된 주차의 label 찾기
        const currentWeek = availableWeeks.find(week => week.value === selectedWeekValue);
        const label = currentWeek?.label || '';
        setModalText(`${label} 리포트가 발행되었습니다.`);
        setShowModal(true);
        localStorage.setItem(reportKey, 'shown');
      }
    }
  }, [currentReport, hasPartner, availableWeeks, selectedWeekValue]);

  if (loading) {
    return <LoadingContainer><LoadingSpinner /></LoadingContainer>;
  }

  if (error) {
    return <div>에러: {error}</div>;
  }

  const renderContent = () => {
    if (hasPartner) {
      if (currentReport) {
        // 파트너 O, 리포트 O
        return (
          <>
            <ReportHeader 
              availableWeeks={availableWeeks}
              selectedWeekValue={selectedWeekValue}
              onWeekChange={handleWeekChange}
            />
            <RelationshipTemperature score={currentReport.overallScore} reason={currentReport.reason} />
            <WeeklyActivitySummary report={currentReport} previousReport={previousReport} />
          </>
        );
      } else {
        // 파트너 O, 리포트 X (미리보기)
        return (
          <>
            <Header><WeekInfo>주간 리포트</WeekInfo></Header>
            <RelationshipTemperature score={latestScore} />
            <NoDataPlaceholder
              title="관계리포트는 주1회 발행됩니다."
              text="다양한 활동으로 관계 온도를 높여보세요!"
              buttonText="추천활동 : 감정카드 보내기기"
              onNavigate={() => navigate('/emotion-card')}
            />
            <WeeklyActivitySummary report={null} previousReport={null} />
          </>
        );
      }
    } else {
      // 파트너 X
      return (
        <>
          <Header><WeekInfo>리포트</WeekInfo></Header>
          <RelationshipTemperature score={latestScore} />
          <NoDataPlaceholder
            title="함께한 노력이'리포트'로 쌓여 갑니다."
            text="지금부터 더 따뜻한 관계를 만들어 보세요."
            buttonText="파트너 초대하기"
            onNavigate={() => navigate('/dashboard')}
          />
          <WeeklyActivitySummary report={null} previousReport={null} />
        </>
      );
    }
  };

  return (
    <>
      <Container>
        {/* 상단 안내문구 */}
        <AnnouncementText>
          리포트는 매주 월요일 오전 10시에 발행됩니다.
        </AnnouncementText>
        {renderContent()}
        <ExpertSolutionCTA onNavigate={() => navigate('/expert')} />
      </Container>
      <NavigationBar isSolo={!hasPartner}/>
      {/* 리포트 발행 모달 - ConfirmationModal로 교체 */}
      <ConfirmationModal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        onConfirm={() => setShowModal(false)}
        title="리포트 발행 안내"
        message={modalText}
        confirmButtonText="확인"
        showCancelButton={false}
      />
    </>
  );
};

export default Report;
