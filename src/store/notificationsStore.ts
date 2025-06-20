import { create } from 'zustand';

export interface Notification {
  id: number;
  message: string;
  url: string;
  read: boolean;
}

export interface NotificationState {
  notifications: Notification[];
  addNotification: (message: string, url: string) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  hasUnread: boolean;
}

const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  hasUnread: false,

  addNotification: (message, url) => {
    set((state) => ({
      notifications: [...state.notifications, { id: Date.now(), message, url, read: false }],
      hasUnread: true,
    }));
  },

  markAsRead: (id) => {
    set((state) => {
      const notifications = state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
      const hasUnread = notifications.some((n) => !n.read);
      return { notifications, hasUnread };
    });
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      hasUnread: false,
    }));
  },
}));

export default useNotificationStore; 