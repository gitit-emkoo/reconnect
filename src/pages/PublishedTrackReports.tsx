import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Container as BaseContainer } from '../styles/CommonStyles';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import Header from '../components/common/Header';
import BackButton from '../components/common/BackButton';
import LoadingSpinner from '../components/common/LoadingSpinner';
import useAuthStore from '../store/authStore';
import axiosInstance from '../api/axios';

const Container = styled(BaseContainer)`
  background-color: #f9fafb;
  padding: 2rem;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const ReportGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
`;

const ReportCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: default;
  transition: all 0.3s ease;
  border: 2px solid transparent;
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ReportDate = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
`;

const ReportBadge = styled.span`
  background: linear-gradient(135deg, #785CD2 0%, #FF69B4 100%);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const ReportStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 0.8rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.3rem;
`;

const StatValue = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
`;

const ReportPreview = styled.div`
  background: #f0f4ff;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #555;
  line-height: 1.5;
  border-left: 4px solid #785CD2;
`;

const CardFooter = styled.div`
  margin-top: 1rem;
`;

const DetailButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 10px;
  background: #785CD2;
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

const EmptyDescription = styled.p`
  font-size: 1rem;
  line-height: 1.5;
`;

const AdminButton = styled.button`
  margin: 2rem auto;
  display: block;
  padding: 1rem 2rem;
  background: linear-gradient(90deg, #FF6B6B 0%, #FF8E53 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(255, 107, 107, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const AdminButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin: 2rem 0;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 0 0 0.5rem 0;
  margin-bottom: 0.5rem;
`;

const Chip = styled.button<{ $active?: boolean }>`
  flex: 0 0 auto;
  padding: 6px 12px;
  border-radius: 16px;
  border: 1px solid ${p => (p.$active ? '#785CD2' : '#e5e7eb')};
  background: ${p => (p.$active ? '#f4f0ff' : '#fff')};
  color: ${p => (p.$active ? '#5b44b8' : '#444')};
  font-weight: 600;
  font-size: 0.85rem;
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

const PublishedTrackReports: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const [reports, setReports] = useState<TrackReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [selectedMonthKey, setSelectedMonthKey] = useState<string>('ALL');

  useEffect(() => {
    // 구독자가 아니면 구독 페이지로 리다이렉트
    if (user?.subscriptionStatus !== 'SUBSCRIBED') {
      navigate('/track');
      return;
    }

    fetchTrackReports();
  }, [user, navigate]);

  const fetchTrackReports = async (force?: boolean) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/track-reports/me', { params: force ? { t: Date.now() } : undefined });
      setReports(response.data);
    } catch (err) {
      setError('트랙 리포트를 불러오는데 실패했습니다.');
      console.error('트랙 리포트 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReportClick = (report: TrackReport) => {
    const date = new Date(report.monthStartDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    navigate(`/published-track-reports/${year}/${month}`);
  };

  const formatMonth = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
  };

  const getTopEmotion = (emotionStats: Record<string, number>) => {
    const entries = Object.entries(emotionStats);
    if (entries.length === 0) return '없음';
    return entries.sort(([,a], [,b]) => b - a)[0][0];
  };

  const getTopTrigger = (triggerStats: Record<string, number>) => {
    const entries = Object.entries(triggerStats);
    if (entries.length === 0) return '없음';
    return entries.sort(([,a], [,b]) => b - a)[0][0];
  };

  const getAnalysisPreview = (analysis: string) => {
    const normalize = (text: string) =>
      text
        .replace(/```json|```/g, '')
        .replace(/[“”]/g, '"')
        .replace(/[‘’]/g, "'")
        .replace(/,\s*([}\]])/g, '$1')
        .trim();

    const parseAi = (text: string): any | null => {
      if (!text) return null;
      const cleaned = normalize(text);
      try {
        return JSON.parse(cleaned);
      } catch {
        const start = cleaned.indexOf('{');
        const end = cleaned.lastIndexOf('}');
        if (start !== -1 && end !== -1 && end > start) {
          const candidate = cleaned.slice(start, end + 1).replace(/,\s*([}\]])/g, '$1');
          try { return JSON.parse(candidate); } catch { /* noop */ }
        }
        return null;
      }
    };

    const parsed = parseAi(analysis);
    if (parsed && typeof parsed.summary === 'string') {
      const s = parsed.summary as string;
      return s.length > 100 ? s.substring(0, 100) + '...' : s;
    }

    // 최후 수단: 요약 텍스트만 정규식으로 추출
    const cleaned = normalize(analysis);
    // 1) 텍스트 형식(제목: 요약)에서 요약 본문만 추출
    const byHeading = cleaned.match(/요약\s*([\s\S]*?)(?:\n\s*전월 대비 변화|\n\s*실천 제안|$)/);
    if (byHeading && byHeading[1]) {
      const s = byHeading[1].trim();
      if (s) return s.length > 100 ? s.substring(0, 100) + '...' : s;
    }

    const m = cleaned.match(/\"summary\"\s*:\s*\"([\s\S]*?)\"\s*(,|})/);
    if (m && m[1]) {
      const s = m[1];
      return s.length > 100 ? s.substring(0, 100) + '...' : s;
    }

    // 2) 여전히 중괄호가 많은 경우, JSON 노출을 피하고 안내 문구로 대체
    if (cleaned.includes('{') || cleaned.includes('"metrics"')) {
      return '요약은 상세 보기에서 확인하세요.';
    }

    const plain = cleaned.replace(/^{|}$/g, '');
    return plain.length > 100 ? plain.substring(0, 100) + '...' : plain;
  };

  const handleManualGenerate = async () => {
    if (!confirm('개발용 트랙 리포트를 생성하시겠습니까?\n(지난 달 데이터, 7개 제한 없음)')) {
      return;
    }

    try {
      setGenerating(true);
      await axiosInstance.get('/track-reports/generate-manual');
      alert('개발용 트랙 리포트 생성이 완료되었습니다!');
      fetchTrackReports(true); // 캐시 우회하여 새로고침
    } catch (err) {
      alert('트랙 리포트 생성에 실패했습니다.');
      console.error('수동 생성 실패:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleManualGenerateCurrent = async () => {
    if (!confirm('현재 월 데이터를 개발용으로 즉시 생성하시겠습니까?')) return;
    try {
      setGenerating(true);
      await axiosInstance.get('/track-reports/me/current/generate-manual');
      alert('현재 월 개발용 생성이 완료되었습니다!');
      fetchTrackReports(true);
    } catch (err) {
      alert('현재 월 생성에 실패했습니다.');
      console.error('현재 월 수동 생성 실패:', err);
    } finally {
      setGenerating(false);
    }
  };

  const monthKey = (d: string) => {
    const date = new Date(d);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  };

  const monthOptions = React.useMemo(() => {
    const set = new Set<string>();
    for (const r of reports) set.add(monthKey(r.monthStartDate));
    const arr = Array.from(set).sort().reverse();
    return arr;
  }, [reports]);

  const filteredReports = selectedMonthKey === 'ALL'
    ? reports
    : reports.filter(r => monthKey(r.monthStartDate) === selectedMonthKey);

  if (loading) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div style={{ textAlign: 'center', color: '#666' }}>
          <p>{error}</p>
          <button 
            onClick={() => fetchTrackReports()}
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
            다시 시도
          </button>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Header title="트랙 리포트" />
      <BackButton fallbackTo="/my" />
      <Container>
        <HeaderSection>
          <Subtitle>
            AI가 분석한 월간 감정 흐름 리포트입니다.<br/>
            매월 1일 오전 10시에 자동으로 발행됩니다.
          </Subtitle>
        </HeaderSection>

        {/* 관리자용 개발 테스트 버튼 */}
        {user?.role === 'ADMIN' && (
          <AdminButtons>
            <AdminButton onClick={handleManualGenerate} disabled={generating}>
              {generating ? '생성 중...' : '🧪 지난 달 개발용 생성'}
            </AdminButton>
            <AdminButton onClick={handleManualGenerateCurrent} disabled={generating}>
              {generating ? '생성 중...' : '🧪 현재 월 개발용 생성'}
            </AdminButton>
          </AdminButtons>
        )}

        {/* 월 필터 */}
        {reports.length > 0 && (
          <FilterBar>
            <Chip $active={selectedMonthKey === 'ALL'} onClick={() => setSelectedMonthKey('ALL')}>전체</Chip>
            {monthOptions.map((k) => {
              const [y, m] = k.split('-');
              return (
                <Chip key={k} $active={selectedMonthKey === k} onClick={() => setSelectedMonthKey(k)}>
                  {Number(y)}년 {Number(m)}월
                </Chip>
              );
            })}
          </FilterBar>
        )}

        <ReportGrid>
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <ReportCard key={report.id}>
                <ReportHeader>
                  <ReportDate>{formatMonth(report.monthStartDate)}</ReportDate>
                  <ReportBadge>발행됨</ReportBadge>
                </ReportHeader>
                
                <ReportStats>
                  <StatItem>
                    <StatLabel>총 일기 수</StatLabel>
                    <StatValue>{report.totalDiaryCount}개</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>주요 감정</StatLabel>
                    <StatValue>{getTopEmotion(report.emotionStats)}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>주요 트리거</StatLabel>
                    <StatValue>{getTopTrigger(report.triggerStats)}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>감정 종류</StatLabel>
                    <StatValue>{Object.keys(report.emotionStats).length}가지</StatValue>
                  </StatItem>
                </ReportStats>

                <ReportPreview>
                  {getAnalysisPreview(report.aiAnalysis)}
                </ReportPreview>

                <CardFooter>
                  <DetailButton onClick={() => handleReportClick(report)}>상세 보기</DetailButton>
                </CardFooter>
              </ReportCard>
            ))
          ) : (
            <EmptyState>
              <EmptyIcon>📊</EmptyIcon>
              <EmptyTitle>아직 발행된 트랙 리포트가 없습니다</EmptyTitle>
              <EmptyDescription>
                감정일기를 7개 이상 작성하면<br/>
                다음 월 1일에 트랙 리포트가 발행됩니다.
              </EmptyDescription>
            </EmptyState>
          )}
        </ReportGrid>
      </Container>
      <NavigationBar />
    </>
  );
};

export default PublishedTrackReports; 