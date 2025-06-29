import { useEffect, useRef } from 'react';
import useNotificationStore from '../store/notificationsStore';
import { SentMessage as Message } from '../pages/EmotionCard';

// 이전 값을 기억하는 커스텀 훅
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function useEmotionCardNotifications(receivedMessages: Message[]) {
  const { fetchNotifications } = useNotificationStore();
  const prevMessageCount = usePrevious(receivedMessages.length);

  useEffect(() => {
    // 이전 메시지 개수보다 현재 메시지 개수가 많아졌다면, 새로운 메시지가 도착한 것
    if (prevMessageCount !== undefined && receivedMessages.length > prevMessageCount) {
      // 서버로부터 최신 알림 목록을 다시 불러옴
      fetchNotifications();
    }
  }, [receivedMessages, prevMessageCount, fetchNotifications]);
}