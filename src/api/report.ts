import axios from './axios';

export interface AvailableWeek {
  year: number;
  month: number;
  week: number;
  label: string;
  value: string;
}

export interface ReportData {
  id: string;
  weekStartDate: string;
  overallScore: number;
  cardsSentCount: number;
  challengesCompletedCount: number;
  challengesFailedCount: number;
  expertSolutionsCount: number;
  marriageDiagnosisCount: number;
  reason: string;
  coupleId: string;
}

export const getAvailableWeeks = async (): Promise<AvailableWeek[]> => {
  const { data } = await axios.get('/reports/available-weeks');
  return data;
};

export const getReportByWeek = async (year: number, week: number): Promise<ReportData> => {
  const { data } = await axios.get('/reports', {
    params: { year, week },
  });
  return data;
}; 