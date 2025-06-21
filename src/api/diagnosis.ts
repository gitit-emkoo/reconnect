import authAxios from './axios';

interface DiagnosisResult {
  id: string;
  score: number;
  resultType: string;
  createdAt: string;
  userId: string;
}

export const getLatestDiagnosisResult = async (): Promise<DiagnosisResult | null> => {
  try {
    const response = await authAxios.get<DiagnosisResult>('/diagnosis/latest');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch latest diagnosis result:', error);
    // 404 Not Found의 경우, 결과가 없는 것이므로 null을 반환하는 것이 적절할 수 있음
    // 그 외의 에러는 그대로 throw 하거나 null 처리
    return null;
  }
}; 