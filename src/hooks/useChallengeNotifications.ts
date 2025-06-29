import { useEffect } from 'react';
import useAuthStore from '../store/authStore';
import useNotificationStore from '../store/notificationsStore';
import challengeApi from '../api/challenge';

export function useChallengeNotifications() {
    const { partner } = useAuthStore();
    const { fetchNotifications } = useNotificationStore();

    useEffect(() => {
        if (!partner) return;

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
    }, [partner, fetchNotifications]);
} 