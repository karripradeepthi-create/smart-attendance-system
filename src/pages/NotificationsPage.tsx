import React from 'react';
import { NotificationItem } from '../types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Bell, CheckCheck, Clock, ShieldAlert, Sparkles, CheckCircle } from 'lucide-react';

interface NotificationsPageProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Notification Center
            {unreadCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-mono font-bold">
                {unreadCount} Unread
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-500">
            Automated alerts, attendance verifications, and department notifications
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" /> Mark All as Read
          </button>
        )}
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {notifications.length === 0 ? (
          <p className="py-8 text-center text-xs text-slate-400">
            No notifications in your inbox.
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.isRead && onMarkAsRead(n.id)}
              className={`py-3.5 px-3 rounded-xl transition-all cursor-pointer flex items-start justify-between gap-3 ${
                !n.isRead
                  ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100/60 dark:border-indigo-900/40'
                  : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                    n.type === 'attendance_alert'
                      ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                      : n.type === 'session_start'
                      ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400'
                      : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                  }`}
                >
                  {n.type === 'attendance_alert' ? (
                    <ShieldAlert className="w-4 h-4" />
                  ) : n.type === 'session_start' ? (
                    <Clock className="w-4 h-4" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {n.title}
                    {!n.isRead && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 inline-block" />
                    )}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    {n.message}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap shrink-0">
                {n.createdAt}
              </span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
