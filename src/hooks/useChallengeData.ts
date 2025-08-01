import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../store/authStore';
import challengeApi from '../api/challenge';

export const useChallengeData = () => {
  const { user, partner } = useAuthStore();

  // 디버깅 로그
  console.log('useChallengeData - User info:', {
    userId: user?.id,
    coupleId: user?.coupleId,
    partnerId: user?.partnerId,
    hasPartner: !!partner,
    partnerInfo: partner,
    isAuthenticated: !!user
  });

  // 활성 챌린지 (커플이 연결되어 있으면 폴링)
  const { 
    data: activeChallenge, 
    isLoading: isActiveChallengeLoading,
    error: activeChallengeError 
  } = useQuery({
    queryKey: ['activeChallenge', user?.id],
    queryFn: async () => {
      console.log('활성 챌린지 API 호출 시작');
      const result = await challengeApi.getActiveChallenge();
      console.log('활성 챌린지 API 호출 완료:', result);
      return result;
    },
    enabled: !!user?.coupleId && !!user?.id, // 더 강력한 조건
    staleTime: 10 * 1000, // 10초간 캐시 (단축)
    gcTime: 1 * 60 * 1000, // 1분간 캐시 유지 (단축)
    refetchInterval: !!user?.coupleId ? 10000 : false, // 커플이 연결되어 있으면 10초마다 폴링
    refetchOnWindowFocus: true, // 페이지 포커스 시 리페치
    refetchOnMount: true, // 컴포넌트 마운트 시 리페치
    retry: 3, // 재시도 횟수 증가
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 지수 백오프
  });

  // 챌린지 히스토리
  const { 
    data: challengeHistory = { completed: [], failed: [] }, 
    isLoading: isHistoryLoading,
    error: historyError 
  } = useQuery({
    queryKey: ['challengeHistory', user?.id],
    queryFn: async () => {
      console.log('챌린지 히스토리 API 호출 시작');
      const result = await challengeApi.getChallengeHistory();
      console.log('챌린지 히스토리 API 호출 완료:', result);
      return result;
    },
    enabled: !!user && !!user.id, // 더 강력한 조건
    staleTime: 30 * 1000, // 30초간 캐시 (단축)
    gcTime: 2 * 60 * 1000, // 2분간 캐시 유지 (단축)
    refetchOnWindowFocus: true, // 페이지 포커스 시 리페치
    refetchOnMount: true, // 컴포넌트 마운트 시 리페치
    retry: 3, // 재시도 횟수 증가
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 지수 백오프
  });

  // 전체 로딩 상태 (활성 챌린지만 체크)
  const isLoading = isActiveChallengeLoading;
  
  // 에러 상태
  const hasError = activeChallengeError || historyError;

  // 에러 로깅
  if (activeChallengeError) {
    console.error('활성 챌린지 에러:', activeChallengeError);
  }
  if (historyError) {
    console.error('챌린지 히스토리 에러:', historyError);
  }

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