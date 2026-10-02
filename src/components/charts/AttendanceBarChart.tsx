import React, { useState } from 'react';

interface BarDataPoint {
  label: string;
  present: number;
  absent: number;
  total?: number;
}

interface AttendanceBarChartProps {
  data: BarDataPoint[];
  height?: number;
  title?: string;
}

export const AttendanceBarChart: React.FC<AttendanceBarChartProps> = ({
  data,
  height = 240,
  title,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const padding = { top: 25, right: 20, bottom: 35, left: 40 };
  const width = 560;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map((d) => d.present + d.absent), 100);

  const barGroupWidth = chartWidth / data.length;
  const barWidth = Math.min(barGroupWidth * 0.35, 24);

  return (
    <div className="w-full">
      {title && (
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</h4>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600 inline-block" /> Present
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-400 inline-block" /> Absent
            </span>
          </div>
        </div>
      )}

      <div className="relative w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding.top + chartHeight * (1 - ratio);
            const val = Math.round(maxVal * ratio);
            return (
              <g key={ratio} className="text-slate-200 dark:text-slate-800">
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="currentColor"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((d, i) => {
            const groupCenterX = padding.left + i * barGroupWidth + barGroupWidth / 2;
            const presentH = (d.present / maxVal) * chartHeight;
            const absentH = (d.absent / maxVal) * chartHeight;

            const isHovered = hoveredIdx === i;

            return (
              <g
                key={d.label}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Present Bar */}
                <rect
                  x={groupCenterX - barWidth - 2}
                  y={padding.top + chartHeight - presentH}
                  width={barWidth}
                  height={presentH}
                  rx="3"
                  className={`transition-colors ${
                    isHovered ? 'fill-indigo-500' : 'fill-indigo-600'
                  }`}
                />

                {/* Absent Bar */}
                <rect
                  x={groupCenterX + 2}
                  y={padding.top + chartHeight - absentH}
                  width={barWidth}
                  height={absentH}
                  rx="3"
                  className={`transition-colors ${
                    isHovered ? 'fill-rose-400' : 'fill-rose-500/80'
                  }`}
                />

                {/* Label */}
                <text
                  x={groupCenterX}
                  y={height - 12}
                  textAnchor="middle"
                  className={`text-[11px] font-medium transition-colors ${
                    isHovered ? 'fill-indigo-600 dark:fill-indigo-400 font-bold' : 'fill-slate-500'
                  }`}
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover info tooltip */}
        {hoveredIdx !== null && (
          <div className="absolute top-1 right-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3 py-1 rounded shadow-md text-xs pointer-events-none tabular-nums flex items-center gap-3">
            <span className="font-semibold">{data[hoveredIdx].label}</span>
            <span className="text-emerald-400 dark:text-emerald-600 font-mono">
              P: {data[hoveredIdx].present}
            </span>
            <span className="text-rose-400 dark:text-rose-600 font-mono">
              A: {data[hoveredIdx].absent}
            </span>
            <span className="text-slate-400">
              Rate:{' '}
              {(
                (data[hoveredIdx].present / (data[hoveredIdx].present + data[hoveredIdx].absent)) *
                100
              ).toFixed(1)}
              %
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
