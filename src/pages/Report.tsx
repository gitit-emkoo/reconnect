import React, { useState, useEffect, useMemo, useContext } from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';

import { getAvailableWeeks, getReportByWeek, AvailableWeek, ReportData } from '../api/report';
import TemperatureDescription from "../components/report/TemperatureDescription";
import { getLatestDiagnosisResult } from '../api/diagnosis';
import { AuthContext } from "../contexts/AuthContext";
import HeartGauge from '../components/Dashboard/HeartGauge';

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
  const { user } = useContext(AuthContext);
  const [availableWeeks, setAvailableWeeks] = useState<AvailableWeek[]>([]);
  const [selectedWeekValue, setSelectedWeekValue] = useState<string>('');
  const [reports, setReports] = useState<{ [key: string]: ReportData }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [latestTemp, setLatestTemp] = useState<number | null>(null);

  const defaultReportData: ReportData = useMemo(() => ({
    id: 'default',
    coupleId: 'default',
    weekStartDate: new Date().toISOString(),
    overallScore: latestTemp ?? 61,
    reason: '파트너와 연결하고 활동을 시작하면 주간 리포트가 생성됩니다.',
    cardsSentCount: 0,
    challengesCompletedCount: 0,
    challengesFailedCount: 0,
    expertSolutionsCount: 0,
    marriageDiagnosisCount: 0,
  }), [latestTemp]);

  useEffect(() => {
    const fetchLatestTemp = async () => {
      try {
        const temp = await getLatestDiagnosisResult();
        if(temp) {
          setLatestTemp(temp.score);
        } else {
          setLatestTemp(61);
        }
      } catch (err) {
        console.error("Failed to fetch latest temperature:", err);
        setLatestTemp(61);
      }
    };
    
    const fetchWeeks = async () => {
      if (!user?.partner?.id) {
        setAvailableWeeks([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const weeks = await getAvailableWeeks();
        if (weeks.length > 0) {
          setAvailableWeeks(weeks);
          const latestWeek = weeks[weeks.length - 1];
          setSelectedWeekValue(latestWeek.value);
        } else {
          setAvailableWeeks([]);
          setSelectedWeekValue('');
        }
      } catch (err) {
        setError("리포트 주차 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestTemp();
    fetchWeeks();
  }, [user?.partner?.id]);

  useEffect(() => {
    if (!selectedWeekValue) return;
    if (reports[selectedWeekValue]) return;

    const fetchReport = async () => {
      setLoading(true);
      try {
        const [yearStr, weekStr] = selectedWeekValue.split('-');
        const year = parseInt(yearStr, 10);
        const week = parseInt(weekStr.replace('W',''), 10);
        
        const reportData = await getReportByWeek(year, week);
        setReports(prev => ({ ...prev, [selectedWeekValue]: reportData }));

      } catch (err) {
        setError('리포트 상세 정보를 불러오는데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [selectedWeekValue, reports]);
  

  const currentReport = useMemo(() => {
    if (!selectedWeekValue) return defaultReportData;
    return reports[selectedWeekValue] || null;
  }, [selectedWeekValue, reports, defaultReportData]);
  
  const previousReport = useMemo(() => {
    const currentIndex = availableWeeks.findIndex(w => w.value === selectedWeekValue);
    if (currentIndex <= 0) return null;

    const previousWeekValue = availableWeeks[currentIndex - 1]?.value;
    if (!previousWeekValue) return null;

    return reports[previousWeekValue];
  }, [selectedWeekValue, availableWeeks, reports]);

  const handleWeekChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWeekValue(e.target.value);
  };

  if (loading) return <Container><div>로딩 중...</div></Container>;
  if (error) return <Container><div>{error}</div></Container>;

  return (
    <>
      <Container>
        <Header>
          <WeekInfo>
            {availableWeeks.find(w => w.value === selectedWeekValue)?.label || '리포트'}
          </WeekInfo>
          {availableWeeks.length > 0 && (
            <WeekSelector value={selectedWeekValue} onChange={handleWeekChange}>
              {availableWeeks.map((week) => (
                <option key={week.value} value={week.value}>
                  {week.label}
                </option>
              ))}
            </WeekSelector>
          )}
        </Header>
        
        <Section>
          <Title>현재 관계 온도</Title>
          <GaugeWrapper>
            {latestTemp !== null ? (
              <HeartGauge percentage={latestTemp} size={140}/>
            ) : (
              <div>온도 정보 로딩 중...</div>
            )}
          </GaugeWrapper>
          {currentReport && (
            <TemperatureDescription 
              score={currentReport.overallScore} 
              reason={currentReport.reason} 
            />
          )}
        </Section>
        
        {availableWeeks.length > 0 && currentReport ? (
          <>
            <Section>
              <TemperatureDescription score={currentReport.overallScore} reason={currentReport.reason} />
            </Section>
            
            <Section>
              <ReportMetric label="🌡️관계 온도" value={currentReport.overallScore} unit="°C" previousValue={previousReport?.overallScore} />
              <ReportMetric label="💌보낸 감정 카드" value={currentReport.cardsSentCount} unit="개" previousValue={previousReport?.cardsSentCount} />
              <ReportMetric label="🏆완료한 챌린지" value={currentReport.challengesCompletedCount} unit="개" previousValue={previousReport?.challengesCompletedCount} />
              <ReportMetric label="💡전문가 솔루션" value={currentReport.expertSolutionsCount} unit="회" previousValue={previousReport?.expertSolutionsCount} />
              <ReportMetric label="💑결혼 생활 진단" value={currentReport.marriageDiagnosisCount} unit="회" previousValue={previousReport?.marriageDiagnosisCount} invertColors />
            </Section>

           
          </>
        ) : (
          !loading && (
            <Section>
              <p>생성된 리포트가 없습니다. 파트너와 활동을 시작해 보세요!</p>
            </Section>
          )
        )}


        <Section>
          <Title>전문가 솔루션</Title>
          <p>관계 개선에 도움이 되는 다양한 콘텐츠를 살펴보세요.</p>
          <CTA onClick={() => navigate('/expert')}>솔루션 보러가기</CTA>
        </Section>
      </Container>
      <NavigationBar />
    </>
  );
};

export default Report;
