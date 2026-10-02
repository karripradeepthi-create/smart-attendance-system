import React from 'react';

interface Segment {
  label: string;
  value: number;
  color: string;
}

interface AttendanceDonutChartProps {
  segments: Segment[];
  title?: string;
  size?: number;
}

export const AttendanceDonutChart: React.FC<AttendanceDonutChartProps> = ({
  segments,
  title,
  size = 180,
}) => {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  const radius = size / 2 - 16;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col items-center">
      {title && (
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 self-start">
          {title}
        </h4>
      )}

      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {segments.map((seg) => {
            const percent = seg.value / total;
            const strokeDasharray = `${circumference * percent} ${circumference * (1 - percent)}`;
            const strokeDashoffset = -circumference * accumulatedPercent;
            accumulatedPercent += percent;

            return (
              <circle
                key={seg.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={20}
                stroke={seg.color}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            );
          })}
        </svg>

        {/* Center Total Count */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
            {total}
          </span>
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Total Logs
          </span>
        </div>
      </div>

      {/* Legend list */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-4 w-full">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                style={{ backgroundColor: seg.color }}
              />
              <span className="truncate">{seg.label}</span>
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums ml-2">
              {seg.value} ({((seg.value / total) * 100).toFixed(0)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
