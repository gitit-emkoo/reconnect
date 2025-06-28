// This is a new file.
import { useState, useEffect, useMemo, useContext } from 'react';
import { getAvailableWeeks, getReportByWeek, AvailableWeek, ReportData } from '../api/report';
import { AuthContext } from '../contexts/AuthContext';
import { getLatestDiagnosisResult } from '../api/diagnosis';

function useLatestTemperature() {
  const [latestTemp, setLatestTemp] = useState<number | null>(null);

  useEffect(() => {
    const fetchTemp = async () => {
      try {
        const temp = await getLatestDiagnosisResult();
        setLatestTemp(temp?.score ?? 61);
      } catch (err) {
        console.error("Failed to fetch latest temperature:", err);
        setLatestTemp(61); // Fallback
      }
    };
    fetchTemp();
  }, []);

  return latestTemp;
}


export function useReportData() {
  const { user } = useContext(AuthContext);
  const latestTemp = useLatestTemperature();

  const [availableWeeks, setAvailableWeeks] = useState<AvailableWeek[]>([]);
  const [selectedWeekValue, setSelectedWeekValue] = useState<string>('');
  const [reports, setReports] = useState<{ [key: string]: ReportData }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const defaultReportData: ReportData = useMemo(() => ({
    id: 'default',
    coupleId: user?.partner?.id || 'default',
    weekStartDate: new Date().toISOString(),
    overallScore: latestTemp ?? 61,
    reason: '파트너와 연결하고 활동을 시작하면 주간 리포트가 생성됩니다.',
    cardsSentCount: 0,
    challengesCompletedCount: 0,
    challengesFailedCount: 0,
    expertSolutionsCount: 0,
    marriageDiagnosisCount: 0,
  }), [latestTemp, user?.partner?.id]);

  useEffect(() => {
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

    return reports[previousWeekValue] || null;
  }, [selectedWeekValue, availableWeeks, reports]);

  const handleWeekChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWeekValue(event.target.value);
  };

  return {
    loading,
    error,
    currentReport,
    previousReport,
    availableWeeks,
    selectedWeekValue,
    handleWeekChange,
    hasPartner: !!user?.partner?.id,
  };
} 