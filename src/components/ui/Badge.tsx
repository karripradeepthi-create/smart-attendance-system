import React from 'react';
import { AttendanceStatus } from '../../types';

interface BadgeProps {
  status: AttendanceStatus | 'active' | 'probation' | 'inactive' | 'scheduled' | 'completed' | 'paused' | 'pending' | 'approved' | 'rejected' | string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ status, size = 'sm' }) => {
  const norm = status.toLowerCase();

  let styles = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  let dotColor = 'bg-slate-400';

  if (norm === 'present' || norm === 'active' || norm === 'approved' || norm === 'completed') {
    styles = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40';
    dotColor = 'bg-emerald-500';
  } else if (norm === 'absent' || norm === 'probation' || norm === 'rejected') {
    styles = 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/40';
    dotColor = 'bg-rose-500';
  } else if (norm === 'late' || norm === 'pending' || norm === 'paused') {
    styles = 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/40';
    dotColor = 'bg-amber-500';
  } else if (norm === 'excused' || norm === 'scheduled') {
    styles = 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40';
    dotColor = 'bg-blue-500';
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md capitalize whitespace-nowrap ${padding} ${styles}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {norm}
    </span>
  );
};
