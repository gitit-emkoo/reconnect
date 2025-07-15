import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../store/authStore';
import { fetchDiaries } from '../api/diary';
import { fetchSentMessages, fetchReceivedMessages } from '../pages/EmotionCard';
import { getLatestDiagnosisResult } from '../api/diagnosis';
import challengeApi from '../api/challenge';

export const useDashboardData = () => {
  const { user, partner } = useAuthStore();
  const temperature = user?.temperature;

  // 필수 데이터: 진단 결과 (즉시 로드)
  const { data: latestDiagnosis, isLoading: isDiagnosisLoading } = useQuery({
    queryKey: ['latestDiagnosis', user?.id],
    queryFn: () => getLatestDiagnosisResult(),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5분간 캐시
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
  });

  // 다이어리 목록 (백그라운드 로드)
  const { data: diaryList = [], isLoading: isDiaryLoading } = useQuery({
    queryKey: ['diaries', user?.id],
    queryFn: fetchDiaries,
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2분간 캐시
    gcTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });

  // 보낸 감정카드 (파트너 있을 때만)
  const { data: sentMessages = [], isLoading: isSentMessagesLoading } = useQuery({
    queryKey: ['sentMessages', user?.id],
    queryFn: fetchSentMessages,
    enabled: !!partner,
    staleTime: 1 * 60 * 1000, // 1분간 캐시
    gcTime: 3 * 60 * 1000, // 3분간 캐시 유지
  });

  // 받은 감정카드 (폴링 유지, 캐시 추가)
  const { data: receivedMessages = [], isLoading: isReceivedMessagesLoading } = useQuery({
    queryKey: ['receivedMessages', user?.id],
    queryFn: fetchReceivedMessages,
    enabled: !!user,
    refetchInterval: 5000,
    staleTime: 30 * 1000, // 30초간 캐시
    gcTime: 2 * 60 * 1000, // 2분간 캐시 유지
  });

  // 활성 챌린지 (파트너 있을 때만)
  const { data: activeChallenge, isLoading: isChallengeLoading } = useQuery({
    queryKey: ['activeChallenge', user?.id],
    queryFn: () => challengeApi.getActiveChallenge(),
    enabled: !!partner,
    staleTime: 1 * 60 * 1000, // 1분간 캐시
    gcTime: 3 * 60 * 1000, // 3분간 캐시 유지
  });
  
  // 필수 데이터만 로딩 상태로 사용 (진단 결과)
  const isLoading = isDiagnosisLoading;
  const isHeartGaugeLoading = isDiagnosisLoading || !user;

  return {
    user,
    partner,
    diaryList,
    sentMessages,
    receivedMessages,
    latestDiagnosis,
    temperature,
    activeChallenge,
    isLoading,
    isHeartGaugeLoading,
    // 개별 로딩 상태도 제공
    isDiaryLoading,
    isSentMessagesLoading,
    isReceivedMessagesLoading,
    isChallengeLoading,
  };
}; 