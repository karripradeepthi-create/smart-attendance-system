import React from 'react';
import { AttendanceSession } from '../../types';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Play, Pause, Square, Clock, Users, BookOpen } from 'lucide-react';

interface AttendanceSessionCardProps {
  session: AttendanceSession;
  onStateChange: (sessionId: string, newState: AttendanceSession['state']) => void;
  onSelect?: () => void;
  isSelected?: boolean;
}

export const AttendanceSessionCard: React.FC<AttendanceSessionCardProps> = ({
  session,
  onStateChange,
  onSelect,
  isSelected = false,
}) => {
  const percentage =
    session.totalEnrolled > 0
      ? ((session.presentCount / session.totalEnrolled) * 100).toFixed(1)
      : '0.0';

  return (
    <Card
      onClick={onSelect}
      className={`transition-all ${
        onSelect ? 'cursor-pointer hover:border-slate-300 dark:hover:border-slate-700' : ''
      } ${isSelected ? 'ring-2 ring-indigo-500 border-transparent' : ''}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <Badge status={session.state} />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {session.year} · {session.section}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          <span className="font-mono tabular-nums">{session.startTime} - {session.endTime}</span>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <BookOpen className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">{session.subjectCode}</span>
        </div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
          {session.subjectName}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Faculty: {session.facultyName} · {session.departmentName}
        </p>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-4 gap-2 mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-center">
        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-400 block">Enrolled</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {session.totalEnrolled}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-semibold text-emerald-600 dark:text-emerald-400 block">
            Present
          </span>
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
            {session.presentCount}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-semibold text-rose-500 block">Absent</span>
          <span className="text-sm font-bold text-rose-500 font-mono tabular-nums">
            {session.absentCount}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-semibold text-indigo-600 dark:text-indigo-400 block">
            Rate
          </span>
          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        {session.state === 'scheduled' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStateChange(session.id, 'active');
            }}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Start Attendance
          </button>
        )}

        {session.state === 'active' && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStateChange(session.id, 'paused');
              }}
              className="px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5" /> Pause
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStateChange(session.id, 'completed');
              }}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Square className="w-3.5 h-3.5" /> End Session
            </button>
          </>
        )}

        {session.state === 'paused' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStateChange(session.id, 'active');
            }}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Resume Session
          </button>
        )}

        {session.state === 'completed' && (
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> Session Closed & Synced
          </span>
        )}
      </div>
    </Card>
  );
};
