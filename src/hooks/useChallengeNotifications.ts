import { useEffect } from 'react';
import useAuthStore from '../store/authStore';
import useNotificationStore from '../store/notificationsStore';
import challengeApi from '../api/challenge';

export function useChallengeNotifications() {
    const { user } = useAuthStore();
    const { fetchNotifications } = useNotificationStore();

    useEffect(() => {
        if (!user?.coupleId) return; // 파트너 대신 coupleId로 조건 변경

        let isMounted = true;
        const intervalId = setInterval(async () => {
            try {
                await challengeApi.checkWeeklyCompletion();
                if (isMounted) {
                    fetchNotifications();
                }
            } catch (error) {
                console.error('Error checking weekly challenge completion:', error);
            }
        }, 5 * 60 * 1000); // 5분마다

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, [user?.coupleId, fetchNotifications]); // 의존성 배열도 coupleId로 변경
} 