import axios from './axios';
import axiosInstance from "./axios";

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

export interface Report {
  id: string;
  coupleId: string;
  weekStartDate: Date;
  overallScore: number;
  reason: string;
  cardsSentCount: number;
  challengesCompletedCount: number;
  expertSolutionsCount: number;
  marriageDiagnosisCount: number;
  createdAt: Date;
  updatedAt: Date;
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

export const getLatestOverallScore = async (): Promise<Report | null> => {
  try {
    const response = await axiosInstance.get('/reports/my-latest');
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getMyReports = async (): Promise<ReportData[]> => {
  const { data } = await axiosInstance.get('/reports/me');
  return data;
}; 