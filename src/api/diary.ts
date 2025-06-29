import axiosInstance from './axios';

export interface DiaryEntry {
  id?: string;
  date: string;
  emotion: {
    name: string;
    color: string;
  };
  triggers: Array<{
    name: string;
    iconComponent: string;
  }>;
  comment: string;
  palette: Array<{
    type: 'emotion' | 'trigger';
    data: any;
  }>;
  randomInfo: Array<any>;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Diary {
  id: string;
  date: string;
  content: string;
  emotion: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// 다이어리 목록 조회
export const fetchDiaries = async (): Promise<DiaryEntry[]> => {
  const response = await axiosInstance.get('/diaries');
  return response.data;
};

// 특정 날짜의 다이어리 조회
export const fetchDiaryByDate = async (date: string): Promise<DiaryEntry | null> => {
  try {
    const { data } = await axiosInstance.get(`/diaries/${date}`);
    return data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

// 새 다이어리 작성
export const createDiary = async (diaryData: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<DiaryEntry> => {
  const { data } = await axiosInstance.post('/diaries', diaryData);
  return data;
};

// 다이어리 수정
export const updateDiary = async (id: string, diaryData: Partial<DiaryEntry>): Promise<DiaryEntry> => {
  const { data } = await axiosInstance.patch(`/diaries/${id}`, diaryData);
  return data;
};

// 다이어리 삭제
export const deleteDiary = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/diaries/${id}`);
}; 