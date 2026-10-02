import React, { useState } from 'react';

interface DataPoint {
  day: string;
  attendance: number;
  present?: number;
  absent?: number;
}

interface AttendanceLineChartProps {
  data: DataPoint[];
  height?: number;
  title?: string;
}

export const AttendanceLineChart: React.FC<AttendanceLineChartProps> = ({
  data,
  height = 240,
  title,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const padding = { top: 20, right: 30, bottom: 35, left: 45 };
  const width = 560; // SVG coordinate width
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const minVal = 70;
  const maxVal = 100;

  const getX = (index: number) => padding.left + (index / (data.length - 1)) * chartWidth;
  const getY = (val: number) =>
    padding.top + chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;

  // Generate smooth cubic bezier SVG path
  const points = data.map((d, i) => ({ x: getX(i), y: getY(d.attendance) }));
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cpX1 = curr.x + (next.x - curr.x) / 2;
    const cpY1 = curr.y;
    const cpX2 = curr.x + (next.x - curr.x) / 2;
    const cpY2 = next.y;
    pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
  }

  // Area under line
  const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${
    points[0].x
  } ${padding.top + chartHeight} Z`;

  return (
    <div className="w-full">
      {title && (
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</h4>
          <span className="text-xs text-slate-500 tabular-nums">Benchmark: 75.0% min</span>
        </div>
      )}

      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[70, 80, 90, 100].map((tick) => {
            const y = getY(tick);
            return (
              <g key={tick} className="text-slate-300 dark:text-slate-700">
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
                  x={padding.left - 10}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {tick}%
                </text>
              </g>
            );
          })}

          {/* 75% threshold guide line */}
          <line
            x1={padding.left}
            y1={getY(75)}
            x2={width - padding.right}
            y2={getY(75)}
            stroke="#f43f5e"
            strokeDasharray="2 2"
            strokeWidth="1.5"
            opacity="0.8"
          />

          {/* Area fill */}
          <path d={areaD} fill="url(#lineGrad)" />

          {/* Line stroke */}
          <path
            d={pathD}
            fill="none"
            stroke="#4f46e5"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive points & X-axis labels */}
          {data.map((d, i) => {
            const x = getX(i);
            const y = getY(d.attendance);
            const isHovered = hoveredIdx === i;

            return (
              <g
                key={d.day}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Vertical hover indicator */}
                {isHovered && (
                  <line
                    x1={x}
                    y1={padding.top}
                    x2={x}
                    y2={padding.top + chartHeight}
                    stroke="#818cf8"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Point */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : 4}
                  className={`transition-all duration-150 ${
                    isHovered
                      ? 'fill-indigo-600 stroke-white stroke-2 shadow-lg dark:stroke-slate-900'
                      : 'fill-indigo-500'
                  }`}
                />

                {/* X-axis label */}
                <text
                  x={x}
                  y={height - 12}
                  textAnchor="middle"
                  className={`text-[11px] transition-colors ${
                    isHovered
                      ? 'fill-indigo-600 font-bold dark:fill-indigo-400'
                      : 'fill-slate-500 dark:fill-slate-400 font-medium'
                  }`}
                >
                  {d.day}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredIdx !== null && (
          <div
            className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3 py-1.5 rounded-lg shadow-xl text-xs flex items-center gap-3 pointer-events-none transition-all duration-150 border border-slate-700/50"
          >
            <span className="font-semibold">{data[hoveredIdx].day}</span>
            <span className="font-mono tabular-nums text-indigo-300 dark:text-indigo-600 font-bold">
              {data[hoveredIdx].attendance}%
            </span>
            {data[hoveredIdx].present !== undefined && (
              <span className="text-[11px] text-slate-300 dark:text-slate-600">
                P: {data[hoveredIdx].present} · A: {data[hoveredIdx].absent}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
