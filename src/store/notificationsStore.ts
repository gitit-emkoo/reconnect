import { create } from 'zustand';
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../api/notification';

export interface Notification {
  id: string;
  message: string;
  url: string;
  read: boolean;
  createdAt: string;
  type?: string;
}

export interface NotificationState {
  notifications: Notification[];
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (message: string, url?: string) => void;
  hasUnread: boolean;
  unreadCount: number;
  updateHasUnread: () => void;
}

const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  hasUnread: false,
  unreadCount: 0,

  fetchNotifications: async () => {
    try {
      const notifications = await getNotifications();
      const hasUnread = notifications.some((n) => !n.read);
      const unreadCount = notifications.filter((n) => !n.read).length;
      set({ notifications, hasUnread, unreadCount });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  },

  fetchUnreadCount: async () => {
    try {
      const { count } = await getUnreadCount();
      set({ unreadCount: count, hasUnread: count > 0 });
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  },

  markAsRead: async (id) => {
    const originalNotifications = get().notifications;
    const updatedNotifications = originalNotifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    const unreadCount = updatedNotifications.filter((n) => !n.read).length;
    const hasUnread = unreadCount > 0;
    
    set({ 
      notifications: updatedNotifications, 
      hasUnread,
      unreadCount
    });

    try {
      await markNotificationAsRead(id);
      // 서버 기준으로 카운트 동기화
      const { count } = await getUnreadCount();
      set({ unreadCount: count, hasUnread: count > 0 });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      // Rollback optimistic update if API call fails
      const originalUnreadCount = originalNotifications.filter((n) => !n.read).length;
      set({ 
        notifications: originalNotifications, 
        hasUnread: originalUnreadCount > 0,
        unreadCount: originalUnreadCount
      });
    }
  },

  markAllAsRead: async () => {
    const originalNotifications = get().notifications;
    const updatedNotifications = originalNotifications.map((n) => ({ ...n, read: true }));
    
    set({ 
      notifications: updatedNotifications, 
      hasUnread: false,
      unreadCount: 0
    });
    
    try {
      await markAllNotificationsAsRead();
      // 서버 기준으로 카운트 동기화
      const { count } = await getUnreadCount();
      set({ unreadCount: count, hasUnread: count > 0 });
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      const originalUnreadCount = originalNotifications.filter((n) => !n.read).length;
      set({ 
        notifications: originalNotifications, 
        hasUnread: originalUnreadCount > 0,
        unreadCount: originalUnreadCount
      });
    }
  },

  addNotification: (message, url = '') => {
    const newNotification = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      url,
      read: false,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      hasUnread: true,
      unreadCount: state.unreadCount + 1,
    }));
  },

  // 로컬 재계산 제거: 서버 카운트를 단일 소스로 사용
  updateHasUnread: () => {},
}));

export default useNotificationStore; 