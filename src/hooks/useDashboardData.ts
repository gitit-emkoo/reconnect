import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../store/authStore';
import { fetchDiaries } from '../api/diary';
import { fetchSentMessages, fetchReceivedMessages } from '../pages/EmotionCard';
import { getLatestDiagnosisResult } from '../api/diagnosis';
import { getLatestOverallScore } from '../api/report';
import challengeApi from '../api/challenge';

export const useDashboardData = () => {
  const { user, partner } = useAuthStore();

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
    refetchInterval: 5000,
  });

  const { data: latestDiagnosis, isLoading: isDiagnosisLoading } = useQuery({
    queryKey: ['latestDiagnosis', user?.id],
    queryFn: () => getLatestDiagnosisResult(),
    enabled: !!user,
  });

  const { data: temperature, isLoading: isReportLoading } = useQuery({
    queryKey: ['temperature', user?.id],
    queryFn: getLatestOverallScore,
    enabled: !!partner,
  });

  const { data: activeChallenge, isLoading: isChallengeLoading } = useQuery({
    queryKey: ['activeChallenge', user?.id],
    queryFn: () => challengeApi.getActiveChallenge(),
    enabled: !!partner,
  });
  
  const isLoading = isDiaryLoading || isSentMessagesLoading || isReceivedMessagesLoading || isDiagnosisLoading || isReportLoading || isChallengeLoading;

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
  };
}; 