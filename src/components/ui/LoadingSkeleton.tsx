import React from 'react';

export const LoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="space-y-3 w-full animate-pulse p-4">
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-1/4 mb-4" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-sm w-3/5" />
            <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded-sm w-2/5" />
          </div>
          <div className="w-16 h-6 bg-slate-200 dark:bg-slate-800 rounded-md shrink-0" />
        </div>
      ))}
    </div>
  );
};
