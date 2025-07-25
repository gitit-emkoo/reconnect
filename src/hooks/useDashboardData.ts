import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../store/authStore';
import { fetchDiaries } from '../api/diary';
import { fetchSentMessages, fetchReceivedMessages } from '../pages/EmotionCard';
import { getLatestDiagnosisResult } from '../api/diagnosis';
import challengeApi from '../api/challenge';

export const useDashboardData = () => {
  const { user, partner } = useAuthStore();
  const temperature = user?.temperature;

  const { data: diaryList = [], isLoading: isDiaryLoading } = useQuery({
    queryKey: ['diaries', user?.id],
    queryFn: fetchDiaries,
    enabled: !!user,
  });

  const { data: sentMessages = [], isLoading: isSentMessagesLoading } = useQuery({
    queryKey: ['sentMessages', user?.id],
    queryFn: fetchSentMessages,
    enabled: !!partner,
  });

  const { data: receivedMessages = [], isLoading: isReceivedMessagesLoading } = useQuery({
    queryKey: ['receivedMessages', user?.id],
    queryFn: fetchReceivedMessages,
    enabled: !!user,
    // refetchInterval: 5000, // 중복 호출 방지를 위해 제거
  });

  const { data: latestDiagnosis, isLoading: isDiagnosisLoading } = useQuery({
    queryKey: ['latestDiagnosis', user?.id],
    queryFn: () => getLatestDiagnosisResult(),
    enabled: !!user,
  });

  const { data: activeChallenge, isLoading: isChallengeLoading } = useQuery({
    queryKey: ['activeChallenge', user?.id],
    queryFn: () => challengeApi.getActiveChallenge(),
    enabled: !!partner,
  });
  
  const isLoading = isDiaryLoading || isSentMessagesLoading || isReceivedMessagesLoading || isDiagnosisLoading || isChallengeLoading;
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
  };
}; 