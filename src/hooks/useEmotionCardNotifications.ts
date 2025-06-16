import { useEffect, useRef } from 'react';
import { useNotificationStore } from '../store/notificationsStore';

export const useEmotionCardNotifications = (receivedMessages: any[]) => {
  const prevReceivedIds = useRef<string[] | null>(null);

  useEffect(() => {
    if (receivedMessages && receivedMessages.length > 0) {
      if (prevReceivedIds.current === null) {
        // 최초 마운트: 알림 추가하지 않고 id만 저장
        prevReceivedIds.current = receivedMessages.map((msg: any) => msg.id);
        return;
      }
      const newCards = receivedMessages.filter((msg: any) => {
        const isNew = !prevReceivedIds.current!.includes(msg.id);
        // 이미 읽은 카드는 알림을 보내지 않음
        return isNew && !msg.isRead;
      });
      newCards.forEach(() => {
        useNotificationStore.getState().addNotification('새 감정카드가 도착했어요!', '/emotion-card?tab=received');
      });
      prevReceivedIds.current = receivedMessages.map((msg: any) => msg.id);
    }
  }, [receivedMessages]);
}; 