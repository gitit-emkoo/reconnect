import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import useNotificationStore, { NotificationState } from '../store/notificationsStore';
import useAuthStore, { AuthState } from '../store/authStore';
import challengeApi, { Challenge } from '../api/challenge';

export const useChallengeNotifications = () => {
    const addNotification = useNotificationStore((state: NotificationState) => state.addNotification);
    const isAuthenticated = useAuthStore((state: AuthState) => state.isAuthenticated);
    const user = useAuthStore((state: AuthState) => state.user);

    const { data: activeChallenge } = useQuery<Challenge>({
        queryKey: ['activeChallengeForNotif', user?.couple?.id],
        queryFn: () => challengeApi.getActiveChallenge(),
        enabled: isAuthenticated && !!user?.couple?.id,
        refetchInterval: 10000, // 10초마다 챌린지 상태 확인
        staleTime: 10000,
    });

    useEffect(() => {
        const key = `challenge-completed-${activeChallenge?.id}`;
        
        // 챌린지가 'COMPLETED' 상태이고, 이 알림을 받은 적이 없는 경우
        if (activeChallenge?.status === 'COMPLETED' && !localStorage.getItem(key)) {
            addNotification('두 분 모두 챌린지를 완료했어요! 🎉', '/challenge');
            // 알림을 다시 받지 않도록 localStorage에 기록
            localStorage.setItem(key, 'true');
        }
    }, [activeChallenge, addNotification]);
}; 