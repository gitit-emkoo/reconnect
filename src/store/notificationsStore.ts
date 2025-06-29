import { create } from 'zustand';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../api/notification';

export interface Notification {
  id: string;
  message: string;
  url: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationState {
  notifications: Notification[];
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  hasUnread: boolean;
}

const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  hasUnread: false,

  fetchNotifications: async () => {
    try {
      const notifications = await getNotifications();
      const hasUnread = notifications.some((n) => !n.read);
      set({ notifications, hasUnread });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  },

  markAsRead: async (id) => {
    const originalNotifications = get().notifications;
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
    const hasUnread = get().notifications.some((n) => !n.read);
    set({ hasUnread });

    try {
      await markNotificationAsRead(id);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      // Rollback optimistic update if API call fails
      set({ notifications: originalNotifications, hasUnread: originalNotifications.some(n => !n.read) });
    }
  },

  markAllAsRead: async () => {
    const originalNotifications = get().notifications;
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      hasUnread: false,
    }));
    try {
      await markAllNotificationsAsRead();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      set({ notifications: originalNotifications, hasUnread: originalNotifications.some(n => !n.read) });
    }
  },
}));

export default useNotificationStore; 