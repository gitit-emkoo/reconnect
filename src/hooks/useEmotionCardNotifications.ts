import { useEffect, useRef } from 'react';
import useNotificationStore, { NotificationState } from '../store/notificationsStore';
import { SentMessage } from '../pages/EmotionCard';

export const useEmotionCardNotifications = (receivedMessages: SentMessage[] | undefined) => {
  const addNotification = useNotificationStore((state: NotificationState) => state.addNotification);
  const notifications = useNotificationStore((state: NotificationState) => state.notifications);
  const prevReceivedIds = useRef<string[] | null>(null);

  useEffect(() => {
    if (receivedMessages && receivedMessages.length > 0) {
      if (prevReceivedIds.current === null) {
        // First load, just store the IDs
        prevReceivedIds.current = receivedMessages.map(msg => msg.id);
        return;
      }

      // Find new messages
      const newCards = receivedMessages.filter(msg => !prevReceivedIds.current!.includes(msg.id));
      
      newCards.forEach(() => {
        const message = '새 감정카드가 도착했어요!';
        const url = '/emotion-card?tab=received';

        const lastNotification = notifications[notifications.length - 1];
        if (lastNotification?.message === message && lastNotification?.url === url) {
            return;
        }

        addNotification(message, url);
      });

      // Update the stored IDs
      if (newCards.length > 0) {
        prevReceivedIds.current = receivedMessages.map(msg => msg.id);
      }
    }
  }, [receivedMessages, addNotification, notifications]);
};