import { create } from 'zustand';

export interface Notification {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface NotificationState {
  notifications: Notification[];
  hasUnread: boolean;
  addNotification: (msg: string) => void;
  markAllRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  hasUnread: false,
  addNotification: (msg) => set(state => ({
    notifications: [
      { id: Date.now().toString(), message: msg, createdAt: new Date().toISOString(), read: false },
      ...state.notifications
    ],
    hasUnread: true
  })),
  markAllRead: () => set(state => ({
    notifications: state.notifications.map(n => ({ ...n, read: true })),
    hasUnread: false
  }))
})); 