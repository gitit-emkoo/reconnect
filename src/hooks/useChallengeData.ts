import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../store/authStore';
import challengeApi from '../api/challenge';

export const useChallengeData = () => {
  const { user, partner } = useAuthStore();

  // 활성 챌린지 (파트너 있을 때만)
  const { 
    data: activeChallenge, 
    isLoading: isActiveChallengeLoading,
    error: activeChallengeError 
  } = useQuery({
    queryKey: ['activeChallenge', user?.id],
    queryFn: () => challengeApi.getActiveChallenge(),
    enabled: !!partner,
    staleTime: 1 * 60 * 1000, // 1분간 캐시
    gcTime: 3 * 60 * 1000, // 3분간 캐시 유지
    refetchInterval: !!partner ? 10000 : false, // 10초마다 폴링 (파트너 있을 때만)
  });

  // 챌린지 히스토리
  const { 
    data: challengeHistory = { completed: [], failed: [] }, 
    isLoading: isHistoryLoading,
    error: historyError 
  } = useQuery({
    queryKey: ['challengeHistory', user?.id],
    queryFn: () => challengeApi.getChallengeHistory(),
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2분간 캐시
    gcTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });

  // 전체 로딩 상태 (활성 챌린지만 체크)
  const isLoading = isActiveChallengeLoading;
  
  // 에러 상태
  const hasError = activeChallengeError || historyError;

  return {
    activeChallenge,
    challengeHistory,
    isLoading,
    hasError,
    // 개별 로딩 상태
    isActiveChallengeLoading,
    isHistoryLoading,
    // 개별 에러 상태
    activeChallengeError,
    historyError,
  };
}; 