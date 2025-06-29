// This is a new file.
import { useState, useEffect, useCallback } from 'react';
import { getMyReports, ReportData } from '../api/report';
import useAuthStore from '../store/authStore';
import { getLatestDiagnosisResult } from '../api/diagnosis';

export const useReportData = () => {
    const { user } = useAuthStore();
    const [reports, setReports] = useState<ReportData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedWeekValue, setSelectedWeekValue] = useState<string>('');
    const [latestScore, setLatestScore] = useState<number>(61);

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
                const reportsData = await getMyReports();
                const sortedReports = [...reportsData].sort((a, b) => new Date(b.weekStartDate).getTime() - new Date(a.weekStartDate).getTime());
                setReports(sortedReports);
                if (sortedReports.length > 0) {
                    setSelectedWeekValue(sortedReports[0].id);
                    setLatestScore(sortedReports[0].overallScore);
                } else {
                    setLatestScore((user as any)?.temperature ?? 61);
                }
            } else {
                // 파트너가 없으면 개인의 마지막 진단 점수를 가져옴
                const soloDiagnosis = await getLatestDiagnosisResult();
                setLatestScore(soloDiagnosis?.score ?? 61);
                setReports([]);
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

    const handleWeekChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedWeekValue(e.target.value);
    };

    const availableWeeks = reports.map(report => ({
        value: report.id,
        label: `${new Date(report.weekStartDate).getMonth() + 1}월 ${Math.ceil(new Date(report.weekStartDate).getDate() / 7)}주차`,
    }));
    
    const selectedReportIndex = reports.findIndex(r => r.id === selectedWeekValue);
    const currentReport = selectedReportIndex !== -1 ? reports[selectedReportIndex] : null;
    const previousReport = selectedReportIndex !== -1 && reports[selectedReportIndex + 1] ? reports[selectedReportIndex + 1] : null;

    return {
        loading,
        error,
        reports,
        currentReport,
        previousReport,
        availableWeeks,
        selectedWeekValue,
        handleWeekChange,
        hasPartner,
        latestScore,
    };
}; 