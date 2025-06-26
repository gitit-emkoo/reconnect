import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import useAuthStore from "../store/authStore";

import { getAvailableWeeks, getReportByWeek, AvailableWeek, ReportData } from '../api/report';
import TemperatureDescription from "../components/report/TemperatureDescription";
import { getLatestDiagnosisResult } from '../api/diagnosis';

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

const getCurrentWeekLabel = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const week = Math.ceil(now.getDate() / 7);
  return `${year}년 ${month}월 ${week}주차`;
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
  const { user } = useAuthStore();
  const [availableWeeks, setAvailableWeeks] = useState<AvailableWeek[]>([]);
  const [selectedWeekValue, setSelectedWeekValue] = useState<string>('');
  const [reports, setReports] = useState<{ [key: string]: ReportData }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [diagnosisList, setDiagnosisList] = useState<any[]>([]);
  const [latestTemp, setLatestTemp] = useState<number>(36.5);

  const defaultReportData: ReportData = useMemo(() => ({
    id: 'default',
    coupleId: 'default',
    weekStartDate: new Date().toISOString(),
    overallScore: latestTemp,
    reason: '파트너와 연결하고 활동을 시작하면 주간 리포트가 생성됩니다.',
    cardsSentCount: 0,
    challengesCompletedCount: 0,
    challengesFailedCount: 0,
    expertSolutionsCount: 0,
    marriageDiagnosisCount: 0,
  }), [latestTemp]);

  useEffect(() => {
    const data = localStorage.getItem('diagnosisHistory');
    if (data) {
      setDiagnosisList(JSON.parse(data));
    }

    const fetchLatestTemp = async () => {
      const result = await getLatestDiagnosisResult();
      if (result) {
        setLatestTemp(result.score);
      }
    };

    fetchLatestTemp();

    if (user?.partner) {
      const fetchWeeks = async () => {
        try {
          setLoading(true);
          const weeks = await getAvailableWeeks();
          setAvailableWeeks(weeks);
          if (weeks.length > 0) {
            setSelectedWeekValue(weeks[0].value);
          }
        } catch (err) {
          setError('리포트 주차 정보를 불러오는데 실패했습니다.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchWeeks();
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!selectedWeekValue || !user?.partner) return;
    if (reports[selectedWeekValue]) return;

    const fetchReport = async () => {
      try {
        const [yearStr, weekStr] = selectedWeekValue.split('-');
        const year = parseInt(yearStr, 10);
        const week = parseInt(weekStr, 10);
        
        const reportData = await getReportByWeek(year, week);
        setReports(prev => ({ ...prev, [selectedWeekValue]: reportData }));
      } catch (err) {
        setError('리포트 상세 정보를 불러오는데 실패했습니다.');
        console.error(err);
      }
    };

    fetchReport();
  }, [selectedWeekValue, reports, user]);

  const currentWeekLabel = useMemo(() => {
    if (availableWeeks.length > 0) {
      return availableWeeks.find(w => w.value === selectedWeekValue)?.label || '리포트';
    }
    return getCurrentWeekLabel(); // 데이터 없을 시 현재 주차 표시
  }, [availableWeeks, selectedWeekValue]);
  
  const reportData = useMemo(() => {
    if (user?.partner && availableWeeks.length > 0 && reports[selectedWeekValue]) {
      return reports[selectedWeekValue];
    }
    return defaultReportData;
  }, [user, reports, selectedWeekValue, availableWeeks, defaultReportData]);
  
  const previousReportData = useMemo(() => {
    if (user?.partner && availableWeeks.length > 1) {
      const currentIndex = availableWeeks.findIndex(w => w.value === selectedWeekValue);
      if (currentIndex < availableWeeks.length - 1) {
        const previousWeekValue = availableWeeks[currentIndex + 1]?.value;
        return reports[previousWeekValue];
      }
    }
    return undefined;
  }, [selectedWeekValue, availableWeeks, reports, user]);

  const handleWeekChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWeekValue(e.target.value);
  };

  if (loading) return <Container><div>로딩 중...</div></Container>;
  if (error) return <Container><div>{error}</div></Container>;

  return (
    <>
      <Container>
        <Header>
          <WeekInfo>{currentWeekLabel}</WeekInfo>
          {user?.partner && availableWeeks.length > 1 && (
            <WeekSelector value={selectedWeekValue} onChange={handleWeekChange}>
              {availableWeeks.map((week) => (
                <option key={week.value} value={week.value}>{week.label}</option>
              ))}
            </WeekSelector>
          )}
        </Header>

        <Section>
          <TemperatureDescription score={reportData.overallScore} reason={reportData.reason} />
        </Section>
        
        <Section>
          <ReportMetric label="관계 온도" value={reportData.overallScore} unit="°C" previousValue={previousReportData?.overallScore} />
          <ReportMetric label="보낸 감정 카드" value={reportData.cardsSentCount} unit="개" previousValue={previousReportData?.cardsSentCount} />
          <ReportMetric label="완료한 챌린지" value={reportData.challengesCompletedCount} unit="개" previousValue={previousReportData?.challengesCompletedCount} />
          <ReportMetric label="전문가 솔루션" value={reportData.expertSolutionsCount} unit="회" previousValue={previousReportData?.expertSolutionsCount} />
          <ReportMetric label="결혼 생활 진단" value={reportData.marriageDiagnosisCount} unit="회" previousValue={previousReportData?.marriageDiagnosisCount} invertColors />
        </Section>

        <Section>
          <Title>주간 리포트</Title>
          <p>{reportData.reason}</p>
        </Section>
        
        <DiagnosisSection>
          <Title>지난 나의 진단 내역</Title>
          {diagnosisList.length > 0 ? (
            <DiagnosisList>
              {diagnosisList.slice(0, 3).map((item, index) => (
                <DiagnosisItem key={index} onClick={() => navigate('/diagnosis/result', { state: { answers: item.answers }})}>
                  {new Date(item.date).toLocaleString('ko-KR')} - {item.score}점
                </DiagnosisItem>
              ))}
            </DiagnosisList>
          ) : (
            <p>진단 내역이 없습니다.</p>
          )}
          <DiagnosisButton onClick={() => navigate('/diagnosis')}>새로운 진단 시작하기</DiagnosisButton>
        </DiagnosisSection>

        <Section>
          <Title>전문가 솔루션</Title>
          <p>관계 개선에 도움이 되는 다양한 콘텐츠를 살펴보세요.</p>
          <CTA onClick={() => navigate('/contents')}>솔루션 보러가기</CTA>
        </Section>
      </Container>
      <NavigationBar />
    </>
  );
};

export default Report;
