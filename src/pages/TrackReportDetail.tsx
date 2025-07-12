import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import Header from '../components/common/Header';
import BackButton from '../components/common/BackButton';
import LoadingSpinner from '../components/common/LoadingSpinner';
import useAuthStore from '../store/authStore';
import axiosInstance from '../api/axios';

const Container = styled.div`
  background-color: #f9fafb;
  min-height: 100vh;
  padding: 2rem;
  padding-bottom: 80px;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1rem;
`;

const ContentGrid = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: grid;
  gap: 1.5rem;
`;

const Section = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatCard = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  border-left: 4px solid #785CD2;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.3rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const ChartContainer = styled.div`
  margin: 1.5rem 0;
`;

const ChartTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartItem = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 12px;
`;

const ChartBar = styled.div<{ percentage: number; color: string }>`
  height: 8px;
  background: ${props => props.color};
  border-radius: 4px;
  margin: 0.5rem 0;
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
`;

const ChartLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
`;

const ChartName = styled.span`
  font-weight: 500;
  color: #333;
`;

const ChartCount = styled.span`
  color: #666;
`;

const AnalysisSection = styled.div`
  background: linear-gradient(135deg, #f0f4ff 0%, #f8f9fa 100%);
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid #785CD2;
`;

const AnalysisText = styled.div`
  font-size: 1rem;
  line-height: 1.7;
  color: #333;
  white-space: pre-line;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #666;
  padding: 2rem;
`;

interface TrackReport {
  id: string;
  monthStartDate: string;
  emotionStats: Record<string, number>;
  triggerStats: Record<string, number>;
  aiAnalysis: string;
  totalDiaryCount: number;
  createdAt: string;
}

const TrackReportDetail: React.FC = () => {
  const navigate = useNavigate();
  const { year, month } = useParams<{ year: string; month: string }>();
  const user = useAuthStore(state => state.user);
  const [report, setReport] = useState<TrackReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 구독자가 아니면 구독 페이지로 리다이렉트
    if (user?.subscriptionStatus !== 'SUBSCRIBED') {
      navigate('/track');
      return;
    }

    if (year && month) {
      fetchTrackReport();
    }
  }, [user, navigate, year, month]);

  const fetchTrackReport = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/track-reports/me/${year}/${month}`);
      setReport(response.data);
    } catch (err) {
      setError('트랙 리포트를 불러오는데 실패했습니다.');
      console.error('트랙 리포트 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatMonth = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
  };

  const getTotalEmotions = (emotionStats: Record<string, number>) => {
    return Object.values(emotionStats).reduce((sum, count) => sum + count, 0);
  };

  const getTotalTriggers = (triggerStats: Record<string, number>) => {
    return Object.values(triggerStats).reduce((sum, count) => sum + count, 0);
  };

  const getTopItems = (stats: Record<string, number>, count: number = 5) => {
    return Object.entries(stats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, count);
  };

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      '행복': '#FFE179',
      '사랑': '#FFB3C6',
      '평온': '#A6E3E9',
      '슬픔': '#B8C9F0',
      '화남': '#FF8A80',
      '불안함': '#D7BCE8',
      '신남': '#FFBC8C',
      '외로움': '#a4d1eb',
      '감사함': '#F7C9B6',
      '무감각함': '#DADADA'
    };
    return colors[emotion] || '#785CD2';
  };

  if (loading) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner />
      </Container>
    );
  }

  if (error || !report) {
    return (
      <Container>
        <ErrorMessage>
          <p>{error || '트랙 리포트를 찾을 수 없습니다.'}</p>
          <button 
            onClick={() => navigate('/published-track-reports')}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#785CD2',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            목록으로 돌아가기
          </button>
        </ErrorMessage>
      </Container>
    );
  }

  const totalEmotions = getTotalEmotions(report.emotionStats);
  const totalTriggers = getTotalTriggers(report.triggerStats);
  const topEmotions = getTopItems(report.emotionStats, 5);
  const topTriggers = getTopItems(report.triggerStats, 5);

  return (
    <>
      <Header title={`${formatMonth(report.monthStartDate)} 트랙 리포트`} />
      <BackButton />
      <Container>
        <HeaderSection>
          <Title>{formatMonth(report.monthStartDate)} 트랙 리포트</Title>
          <Subtitle>AI가 분석한 월간 감정 흐름 분석 결과입니다</Subtitle>
        </HeaderSection>

        <ContentGrid>
          {/* 전체 통계 */}
          <Section>
            <SectionTitle>📊 전체 통계</SectionTitle>
            <StatsGrid>
              <StatCard>
                <StatValue>{report.totalDiaryCount}</StatValue>
                <StatLabel>총 일기 수</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{Object.keys(report.emotionStats).length}</StatValue>
                <StatLabel>감정 종류</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{Object.keys(report.triggerStats).length}</StatValue>
                <StatLabel>트리거 종류</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{Math.round((report.totalDiaryCount / 30) * 10) / 10}</StatValue>
                <StatLabel>일평균 작성률</StatLabel>
              </StatCard>
            </StatsGrid>
          </Section>

          {/* 감정 분석 */}
          <Section>
            <SectionTitle>💭 감정 분석</SectionTitle>
            <ChartContainer>
              <ChartTitle>가장 많이 경험한 감정 (총 {totalEmotions}회)</ChartTitle>
              <ChartGrid>
                <ChartItem>
                  {topEmotions.map(([emotion, count]) => (
                    <div key={emotion}>
                      <ChartLabel>
                        <ChartName>{emotion}</ChartName>
                        <ChartCount>{count}회</ChartCount>
                      </ChartLabel>
                      <ChartBar 
                        percentage={(count / totalEmotions) * 100} 
                        color={getEmotionColor(emotion)}
                      />
                    </div>
                  ))}
                </ChartItem>
              </ChartGrid>
            </ChartContainer>
          </Section>

          {/* 트리거 분석 */}
          <Section>
            <SectionTitle>🎯 트리거 분석</SectionTitle>
            <ChartContainer>
              <ChartTitle>가장 자주 나타난 트리거 (총 {totalTriggers}회)</ChartTitle>
              <ChartGrid>
                <ChartItem>
                  {topTriggers.map(([trigger, count]) => (
                    <div key={trigger}>
                      <ChartLabel>
                        <ChartName>{trigger}</ChartName>
                        <ChartCount>{count}회</ChartCount>
                      </ChartLabel>
                      <ChartBar 
                        percentage={(count / totalTriggers) * 100} 
                        color="#785CD2"
                      />
                    </div>
                  ))}
                </ChartItem>
              </ChartGrid>
            </ChartContainer>
          </Section>

          {/* AI 분석 */}
          <Section>
            <SectionTitle>🤖 AI 분석 결과</SectionTitle>
            <AnalysisSection>
              <AnalysisText>{report.aiAnalysis}</AnalysisText>
            </AnalysisSection>
          </Section>
        </ContentGrid>
      </Container>
      <NavigationBar />
    </>
  );
};

export default TrackReportDetail; 