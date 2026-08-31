import React, { useState } from 'react';

interface ChartSegment {
  label: string;
  count: number;
  percentage: number;
  color: string;
  textColor: string;
  bgDot: string;
}

interface DonutChartProps {
  completed: number;
  dueSoon: number;
  overdue: number;
  upcoming: number;
  total: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  completed,
  dueSoon,
  overdue,
  upcoming,
  total
}) => {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-slate-400 dark:text-slate-500">
        <p className="text-sm">No vaccination data available</p>
      </div>
    );
  }

  const completedPct = Math.round((completed / total) * 100);
  const dueSoonPct = Math.round((dueSoon / total) * 100);
  const overduePct = Math.round((overdue / total) * 100);
  const upcomingPct = Math.max(0, 100 - completedPct - dueSoonPct - overduePct);

  const segments: ChartSegment[] = [
    {
      label: 'Completed',
      count: completed,
      percentage: completedPct,
      color: '#10b981', // emerald-500
      textColor: 'text-emerald-600 dark:text-emerald-400',
      bgDot: 'bg-emerald-500'
    },
    {
      label: 'Due Soon',
      count: dueSoon,
      percentage: dueSoonPct,
      color: '#f59e0b', // amber-500
      textColor: 'text-amber-600 dark:text-amber-400',
      bgDot: 'bg-amber-500'
    },
    {
      label: 'Overdue',
      count: overdue,
      percentage: overduePct,
      color: '#ef4444', // red-500
      textColor: 'text-rose-600 dark:text-rose-400',
      bgDot: 'bg-rose-500'
    },
    {
      label: 'Upcoming',
      count: upcoming,
      percentage: upcomingPct,
      color: '#38bdf8', // sky-400
      textColor: 'text-sky-600 dark:text-sky-400',
      bgDot: 'bg-sky-400'
    }
  ].filter(s => s.count > 0 || total === 0);

  // SVG parameters
  const size = 160;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
      {/* SVG Donut */}
      <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800"
          />

          {/* Segment strokes */}
          {segments.map((seg) => {
            const strokeDasharray = `${(seg.count / total) * circumference} ${circumference}`;
            const strokeDashoffset = -((accumulatedPercent / total) * circumference);
            accumulatedPercent += seg.count;

            const isHovered = hoveredSegment === seg.label;

            return (
              <circle
                key={seg.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredSegment(seg.label)}
                onMouseLeave={() => setHoveredSegment(null)}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          {hoveredSegment ? (
            (() => {
              const hovered = segments.find(s => s.label === hoveredSegment);
              return (
                <div>
                  <span className={`text-xl font-extrabold ${hovered?.textColor}`}>
                    {hovered?.percentage}%
                  </span>
                  <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                    {hovered?.label}
                  </div>
                </div>
              );
            })()
          ) : (
            <div>
              <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
                {completedPct}%
              </span>
              <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                Completed
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend list */}
      <div className="space-y-2.5 w-full sm:w-auto">
        {segments.map((seg) => {
          const isHovered = hoveredSegment === seg.label;
          return (
            <div
              key={seg.label}
              onMouseEnter={() => setHoveredSegment(seg.label)}
              onMouseLeave={() => setHoveredSegment(null)}
              className={`flex items-center justify-between gap-4 px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                isHovered ? 'bg-slate-50 dark:bg-slate-700/50' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${seg.bgDot}`} />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {seg.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {seg.count}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 w-10 text-right">
                  ({seg.percentage}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
