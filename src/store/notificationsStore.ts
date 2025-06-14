import { create } from 'zustand';

export interface Notification {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
  link?: string;
}

interface NotificationState {
  notifications: Notification[];
  hasUnread: boolean;
  addNotification: (msg: string, link?: string) => void;
  markAllRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  hasUnread: false,
  addNotification: (msg, link) => set(state => {
    const newNoti = { id: Date.now().toString(), message: msg, createdAt: new Date().toISOString(), read: false, link };
    const notifications = [newNoti, ...state.notifications].slice(0, 10); // 최대 10개
    return { notifications, hasUnread: true };
  }),
  markAllRead: () => set(state => ({
    notifications: state.notifications.map(n => ({ ...n, read: true })),
    hasUnread: false
  }))
})); 