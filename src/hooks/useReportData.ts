// This is a new file.
import { useState, useEffect, useCallback } from 'react';
import { getMyReports, getAvailableWeeks, ReportData, AvailableWeek } from '../api/report';
import useAuthStore from '../store/authStore';
import { getLatestDiagnosisResult } from '../api/diagnosis';

export const useReportData = () => {
    const { user } = useAuthStore();
    const [reports, setReports] = useState<ReportData[]>([]);
    const [availableWeeks, setAvailableWeeks] = useState<AvailableWeek[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedWeekValue, setSelectedWeekValue] = useState<string>('');
    const [latestScore, setLatestScore] = useState<number>(0);
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

    const hasPartner = !!user?.partnerId;

    const fetchData = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            if (hasPartner) {
                const [reportsData, weeksData] = await Promise.all([
                    getMyReports(),
                    getAvailableWeeks()
                ]);
                
                const sortedReports = [...reportsData].sort((a, b) => new Date(b.weekStartDate).getTime() - new Date(a.weekStartDate).getTime());
                setReports(sortedReports);
                setAvailableWeeks(weeksData);
                
                if (sortedReports.length > 0) {
                    setSelectedWeekValue(sortedReports[0].id);
                    // 파트너가 있는 경우: 커플 온도 (user.temperature는 파트너 연결 시 동기화됨)
                    setLatestScore(user.temperature || 0);
                } else {
                    // 파트너가 있는 경우: 커플 온도
                    setLatestScore(user.temperature || 0);
                }
            } else {
                // 파트너가 없는 경우: 개인 결혼진단 결과
                const latestDiagnosis = await getLatestDiagnosisResult();
                setLatestScore(latestDiagnosis?.score || 0);
                setReports([]);
                setAvailableWeeks([]);
            }
        } catch (err) {
            console.error('리포트 데이터 로딩 실패:', err);
            setError('리포트를 불러오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }, [user, hasPartner]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (!loading && !hasLoadedOnce) setHasLoadedOnce(true);
    }, [loading, hasLoadedOnce]);

    const handleWeekChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedWeekValue(e.target.value);
    };

    // 백엔드에서 받은 정확한 주차 정보를 사용
    const weekOptions = availableWeeks.map(week => ({
        value: week.value,
        label: week.label,
    }));
    
    const selectedReportIndex = reports.findIndex(r => r.id === selectedWeekValue);
    const currentReport = selectedReportIndex !== -1 ? reports[selectedReportIndex] : null;
    const previousReport = selectedReportIndex !== -1 && reports[selectedReportIndex + 1] ? reports[selectedReportIndex + 1] : null;

    return {
        loading,
        hasLoadedOnce,
        error,
        reports,
        currentReport,
        previousReport,
        availableWeeks: weekOptions,
        selectedWeekValue,
        handleWeekChange,
        hasPartner,
        latestScore,
    };
}; 