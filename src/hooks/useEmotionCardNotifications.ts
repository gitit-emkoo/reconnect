import { useEffect, useRef } from 'react';
import { useNotificationStore } from '../store/notificationsStore';
import { SentMessage } from '../pages/EmotionCard'; // 타입 임포트

export const useEmotionCardNotifications = (receivedMessages: SentMessage[]) => {
  const addNotification = useNotificationStore((state) => state.addNotification);
  const prevReceivedIds = useRef<string[] | null>(null);

  useEffect(() => {
    // 메시지 목록이 유효한 배열인지 확인
    if (!Array.isArray(receivedMessages)) {
      prevReceivedIds.current = null; // 배열이 아니면 초기화
      return;
    }

    if (prevReceivedIds.current === null) {
      // 최초 마운트 시 또는 목록이 초기화된 후: 현재 ID 목록만 저장하고 알림은 보내지 않음
      prevReceivedIds.current = receivedMessages.map((msg) => msg.id);
      return;
    }

    // 이전 ID 목록과 비교하여 새로 도착하고 아직 읽지 않은 카드를 필터링
    const newUnreadCards = receivedMessages.filter((msg) => {
      const isNew = !prevReceivedIds.current!.includes(msg.id);
      return isNew && !msg.isRead;
    });

    // 새로 도착한 카드가 있을 경우에만 알림을 한 번 보냄
    if (newUnreadCards.length > 0) {
      const message = newUnreadCards.length > 1
        ? `${newUnreadCards.length}개의 새 감정카드가 도착했어요!`
        : '새 감정카드가 도착했어요!';
      
      addNotification(message, '/emotion-card?tab=received');
    }

    // 현재 메시지 ID 목록을 prevReceivedIds에 저장하여 다음 렌더링에서 비교할 수 있도록 함
    prevReceivedIds.current = receivedMessages.map((msg) => msg.id);

  }, [receivedMessages, addNotification]);
}; 