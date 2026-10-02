import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ChevronLeft, ChevronRight, Calendar as CalIcon, Clock, User, BookOpen } from 'lucide-react';
import { DEMO_CALENDAR_LOGS } from '../../data/demoData';

export const AttendanceCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 2)); // Oct 2026
  const [selectedDateKey, setSelectedDateKey] = useState<string>('2026-10-02');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 for Sunday

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const selectedDetails = DEMO_CALENDAR_LOGS[selectedDateKey];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Calendar Grid */}
      <Card className="lg:col-span-8 flex flex-col gap-4">
        {/* Month Header Navigation */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <CalIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {monthNames[month]} {year}
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Month Days */}
        <div className="grid grid-cols-7 gap-1.5">
          {/* Empty cells before 1st */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const log = DEMO_CALENDAR_LOGS[dateStr];
            const isSelected = selectedDateKey === dateStr;

            let indicatorColor = 'bg-transparent';
            if (log) {
              if (log.status === 'present') indicatorColor = 'bg-emerald-500';
              else if (log.status === 'absent') indicatorColor = 'bg-rose-500';
              else if (log.status === 'late') indicatorColor = 'bg-amber-500';
              else if (log.status === 'excused') indicatorColor = 'bg-blue-500';
              else if (log.status === 'holiday') indicatorColor = 'bg-slate-300 dark:bg-slate-600';
            }

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDateKey(dateStr)}
                className={`aspect-square p-1 rounded-xl flex flex-col items-center justify-between border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold ring-2 ring-indigo-500/20'
                    : 'border-slate-100 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <span className="text-xs tabular-nums">{dayNum}</span>
                <span className={`w-2 h-2 rounded-full ${indicatorColor} mb-0.5`} />
              </button>
            );
          })}
        </div>

        {/* Calendar Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Present
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Absent
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Late
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Excused
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" /> Weekend / Holiday
          </div>
        </div>
      </Card>

      {/* Selected Day Details Panel */}
      <Card className="lg:col-span-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400">Date Log</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {selectedDateKey}
              </h4>
            </div>
            {selectedDetails && <Badge status={selectedDetails.status} />}
          </div>

          <div className="mt-4 space-y-3">
            {!selectedDetails ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No recorded lectures or attendance on this date.
              </p>
            ) : selectedDetails.sessions.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center text-xs text-slate-500">
                Official Campus Holiday / Weekend
              </div>
            ) : (
              selectedDetails.sessions.map((sess, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                      {sess.subject}
                    </span>
                    <Badge status={sess.status} />
                  </div>
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {sess.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" /> {sess.faculty}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 text-center">
          Attendance records are synchronized in real-time with university registers.
        </div>
      </Card>
    </div>
  );
};
