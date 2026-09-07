import React, { useState } from 'react';
import { ReadinessTrajectoryPoint } from '../../types';
import { Calendar, TrendingUp, CheckCircle, Flag } from 'lucide-react';

interface WeeklyTrajectoryMeterProps {
  trajectory: ReadinessTrajectoryPoint[];
  currentScore: number;
}

export const WeeklyTrajectoryMeter: React.FC<WeeklyTrajectoryMeterProps> = ({
  trajectory,
  currentScore,
}) => {
  const [activePoint, setActivePoint] = useState<ReadinessTrajectoryPoint | null>(null);

  if (!trajectory || trajectory.length === 0) return null;

  const width = 580;
  const height = 180;
  const paddingX = 40;
  const paddingY = 24;

  const minX = 0;
  const maxX = trajectory[trajectory.length - 1].week || 16;
  const minY = 20;
  const maxY = 100;

  const scaleX = (val: number) => paddingX + ((val - minX) / (maxX - minX)) * (width - paddingX * 2);
  const scaleY = (val: number) => height - paddingY - ((val - minY) / (maxY - minY)) * (height - paddingY * 2);

  // Projected line path
  const projectedPathD = trajectory
    .map((p, idx) => {
      const x = scaleX(p.week);
      const y = scaleY(p.projectedScore);
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  // Actual history line path
  const actualPoints = trajectory.filter((p) => p.actualScore !== undefined);
  const actualPathD = actualPoints
    .map((p, idx) => {
      const x = scaleX(p.week);
      const y = scaleY(p.actualScore!);
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  // Projected Area fill
  const areaPathD = `${projectedPathD} L ${scaleX(maxX)} ${scaleY(minY)} L ${scaleX(0)} ${scaleY(minY)} Z`;

  // Benchmark line Y (85%)
  const benchmarkY = scaleY(85);

  // Find projected graduation job-readiness date
  const readinessTargetPoint = trajectory.find((p) => p.projectedScore >= 85) || trajectory[trajectory.length - 1];

  return (
    <div className="flex flex-col">
      {/* Top Banner Stat */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">
              Projected Job-Ready by:{' '}
              <span className="text-orange-600 font-extrabold">{readinessTargetPoint.dateLabel}</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Pacing at +4.2% readiness/bi-week · Anna University Placement Cohort
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-semibold">On Track for Day 1 Hiring</span>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[480px]">
          <defs>
            <linearGradient id="trajectoryGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EA580C" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#EA580C" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[40, 60, 80, 100].map((level) => (
            <g key={level}>
              <line
                x1={paddingX}
                y1={scaleY(level)}
                x2={width - paddingX}
                y2={scaleY(level)}
                stroke="#F1F5F9"
                strokeWidth="1"
              />
              <text
                x={paddingX - 8}
                y={scaleY(level) + 3}
                textAnchor="end"
                className="text-[9px] fill-slate-400 font-mono"
              >
                {level}%
              </text>
            </g>
          ))}

          {/* 85% Benchmark Line */}
          <line
            x1={paddingX}
            y1={benchmarkY}
            x2={width - paddingX}
            y2={benchmarkY}
            stroke="#10B981"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <text
            x={width - paddingX - 4}
            y={benchmarkY - 6}
            textAnchor="end"
            className="text-[10px] font-bold fill-emerald-600"
          >
            Tier-1 Placement Target (85%)
          </text>

          {/* Area Fill */}
          <path d={areaPathD} fill="url(#trajectoryGradient)" />

          {/* Projected Path (Dashed) */}
          <path
            d={projectedPathD}
            fill="none"
            stroke="#F97316"
            strokeWidth="2"
            strokeDasharray="5 4"
          />

          {/* Actual Historical Path (Solid Orange) */}
          {actualPathD && (
            <path
              d={actualPathD}
              fill="none"
              stroke="#EA580C"
              strokeWidth="3"
            />
          )}

          {/* Points */}
          {trajectory.map((point) => {
            const x = scaleX(point.week);
            const isActual = point.actualScore !== undefined;
            const y = scaleY(isActual ? point.actualScore! : point.projectedScore);
            const isTargetCrossed = point.projectedScore >= 85;

            return (
              <g
                key={point.week}
                className="cursor-pointer group"
                onMouseEnter={() => setActivePoint(point)}
                onMouseLeave={() => setActivePoint(null)}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={isActual ? 5 : 4}
                  fill={isActual ? '#EA580C' : '#FFFFFF'}
                  stroke={isTargetCrossed ? '#10B981' : '#EA580C'}
                  strokeWidth="2"
                  className="transition-transform group-hover:scale-150"
                />

                {/* X Axis label */}
                <text
                  x={x}
                  y={height - 6}
                  textAnchor="middle"
                  className="text-[10px] fill-slate-500 font-medium select-none"
                >
                  W{point.week}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Point tooltip */}
        {activePoint && (
          <div className="absolute top-1 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white px-3 py-1.5 rounded-lg text-xs shadow-md pointer-events-none flex items-center gap-3">
            <div>
              <span className="text-slate-400">Week {activePoint.week} ({activePoint.dateLabel}):</span>
              <span className="ml-1 font-bold text-orange-400">
                {activePoint.actualScore !== undefined
                  ? `${activePoint.actualScore}% (Current)`
                  : `${activePoint.projectedScore}% (Projected)`}
              </span>
            </div>
            {activePoint.milestoneTitle && (
              <div className="border-l border-slate-700 pl-2 text-[11px] text-slate-300 truncate max-w-[200px]">
                {activePoint.milestoneTitle}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Trajectory Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 text-[11px] text-slate-500 border-t border-slate-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-orange-600 rounded-full" />
            <span className="font-semibold text-slate-700">Verified Past Performance</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-b-2 border-dashed border-orange-400" />
            <span>Projected Pacing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-b-2 border-emerald-500" />
            <span className="text-emerald-700 font-medium">Placement Threshold (85%)</span>
          </div>
        </div>
        <div className="font-mono text-slate-400">Model: Weighted-ARIMA Vectorizer</div>
      </div>
    </div>
  );
};
