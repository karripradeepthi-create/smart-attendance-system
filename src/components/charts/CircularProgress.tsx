import React from 'react';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 180,
  strokeWidth = 14,
  label = 'Overall Attendance',
  sublabel,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(Math.max(percentage, 0), 100) / 100) * circumference;

  const isLow = percentage < 75;
  const isExcellent = percentage >= 90;

  const colorClass = isLow
    ? 'text-rose-500'
    : isExcellent
    ? 'text-emerald-500'
    : 'text-indigo-600 dark:text-indigo-400';

  const strokeColor = isLow ? '#f43f5e' : isExcellent ? '#10b981' : '#4f46e5';

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Track background */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className="stroke-slate-100 dark:stroke-slate-800"
            fill="transparent"
          />
          {/* Progress stroke */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke={strokeColor}
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-4xl font-extrabold tracking-tight tabular-nums ${colorClass}`}>
            {percentage}%
          </span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            {isLow ? 'Action Required' : isExcellent ? 'Exemplary' : 'Good Standing'}
          </span>
        </div>
      </div>

      {label && (
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-3">
          {label}
        </span>
      )}
      {sublabel && (
        <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {sublabel}
        </span>
      )}
    </div>
  );
};
