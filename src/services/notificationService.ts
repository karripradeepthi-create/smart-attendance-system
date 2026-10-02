import { NotificationItem } from '../types';
import { DEMO_NOTIFICATIONS } from '../data/demoData';

const NOTIFICATIONS_STORAGE_KEY = 'smart_attendance_notifs_v1';

export const notificationService = {
  getNotifications(): NotificationItem[] {
    const data = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error(e);
      }
    }
    return DEMO_NOTIFICATIONS;
  },

  saveNotifications(notifs: NotificationItem[]): void {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifs));
  },

  markAsRead(id: string): NotificationItem[] {
    const list = this.getNotifications().map((n) => (n.id === id ? { ...n, isRead: true } : n));
    this.saveNotifications(list);
    return list;
  },

  markAllAsRead(): NotificationItem[] {
    const list = this.getNotifications().map((n) => ({ ...n, isRead: true }));
    this.saveNotifications(list);
    return list;
  },

  addNotification(item: Omit<NotificationItem, 'id' | 'isRead' | 'createdAt'>): void {
    const list = this.getNotifications();
    list.unshift({
      ...item,
      id: `NOTIF-${Date.now()}`,
      isRead: false,
      createdAt: 'Just now',
    });
    this.saveNotifications(list);
  },
};
