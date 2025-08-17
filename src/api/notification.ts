import api from './axios';
import { Notification } from '../store/notificationsStore';

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await api.get('/notifications');
  const items = Array.isArray(response.data) ? response.data : [];
  // 서버 응답의 isRead -> 클라이언트 모델 read로 매핑 통일
  return items.map((n: any) => ({
    id: String(n.id),
    message: String(n.message ?? ''),
    url: typeof n.url === 'string' ? n.url : '',
    read: Boolean(n.isRead ?? n.read ?? false),
    createdAt: n.createdAt ?? new Date().toISOString(),
    type: typeof n.type === 'string' ? n.type : undefined,
  }));
};

export const getUnreadCount = async (): Promise<{ count: number }> => {
  const response = await api.get('/notifications/unread-count');
  return response.data;
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  await api.patch(`/notifications/${id}/read`);
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await api.patch('/notifications/read-all');
}; 

export const getNotificationPreferences = async () => {
  const res = await api.get('/notifications/preferences');
  return res.data as { muteAll: boolean; muteCommunity: boolean; muteChallenge: boolean; muteEmotionCard: boolean };
};

export const updateNotificationPreferences = async (prefs: Partial<{ muteAll: boolean; muteCommunity: boolean; muteChallenge: boolean; muteEmotionCard: boolean }>) => {
  const res = await api.patch('/notifications/preferences', prefs);
  return res.data as { muteAll: boolean; muteCommunity: boolean; muteChallenge: boolean; muteEmotionCard: boolean };
};