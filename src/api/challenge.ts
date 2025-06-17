import axiosInstance from './axios';

export interface Challenge {
  id: string;
  templateId: string;
  title: string;
  description: string;
  category: 'DAILY_SHARE' | 'TOGETHER_ACT' | 'EMOTION_EXPR' | 'MEMORY_BUILD' | 'SELF_CARE' | 'GROW_TOGETHER';
  frequency: number;
  isOneTime: boolean;
  points: number;
  startDate: string;
  endDate: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  isCompletedByMember1: boolean;
  isCompletedByMember2: boolean;
  completedAt?: string;
}

export interface ChallengeHistory {
  completed: Challenge[];
  failed: Challenge[];
}

const challengeApi = {
  // 카테고리별 챌린지 목록 조회
  getChallengesByCategory: async (category: Challenge['category']) => {
    const response = await axiosInstance.get<Challenge[]>(`/challenges/template/category/${category}`);
    return response.data;
  },

  // 현재 진행중인 챌린지 조회
  getActiveChallenge: async () => {
    const response = await axiosInstance.get<Challenge>('/challenges/active');
    return response.data;
  },

  // 챌린지 시작
  startChallenge: async (challengeId: string) => {
    const response = await axiosInstance.post<Challenge>(`/challenges/start/${challengeId}`);
    return response.data;
  },

  // 챌린지 완료
  completeChallenge: async (challengeId: string) => {
    const response = await axiosInstance.post<Challenge>(`/challenges/complete/${challengeId}`);
    return response.data;
  },

  // 챌린지 히스토리 조회
  getChallengeHistory: async () => {
    const response = await axiosInstance.get<ChallengeHistory>('/challenges/history');
    return response.data;
  },

  // 이번 주 챌린지 달성 여부 확인
  checkWeeklyCompletion: async () => {
    const response = await axiosInstance.get<boolean>('/challenges/weekly-completion');
    return response.data;
  },
};

export default challengeApi; 