import React, { useState } from 'react';
import { StudentSkill } from '../../types';

interface ReadinessRadarChartProps {
  skills: StudentSkill[];
  targetRole: string;
}

export const ReadinessRadarChart: React.FC<ReadinessRadarChartProps> = ({ skills, targetRole }) => {
  const [hoveredSkill, setHoveredSkill] = useState<StudentSkill | null>(null);

  // Take up to 6 key skills for a balanced polygon
  const displaySkills = skills.slice(0, 6);
  const count = displaySkills.length;
  if (count < 3) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
        Insufficient skill data to plot radar matrix.
      </div>
    );
  }

  const size = 320;
  const center = size / 2;
  const radius = center - 45;

  const getCoordinates = (index: number, value: number, max = 100) => {
    const angle = (Math.PI * 2 / count) * index - Math.PI / 2;
    const distance = (value / max) * radius;
    const x = center + distance * Math.cos(angle);
    const y = center + distance * Math.sin(angle);
    return { x, y };
  };

  // Concentric levels (25, 50, 75, 100)
  const levels = [25, 50, 75, 100];

  // Polygon for Benchmark
  const benchmarkPoints = displaySkills
    .map((s, idx) => {
      const { x, y } = getCoordinates(idx, s.industryBenchmark);
      return `${x},${y}`;
    })
    .join(' ');

  // Polygon for Student
  const studentPoints = displaySkills
    .map((s, idx) => {
      const { x, y } = getCoordinates(idx, s.proficiencyLevel);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible">
          {/* Web grid polygons */}
          {levels.map((level) => {
            const levelPoints = displaySkills
              .map((_, idx) => {
                const { x, y } = getCoordinates(idx, level);
                return `${x},${y}`;
              })
              .join(' ');

            return (
              <polygon
                key={level}
                points={levelPoints}
                fill="none"
                stroke="#E2E8F0"
                strokeWidth={level === 75 || level === 100 ? '1.5' : '1'}
                strokeDasharray={level === 75 ? '3 3' : 'none'}
              />
            );
          })}

          {/* Axis spoke lines */}
          {displaySkills.map((_, idx) => {
            const outer = getCoordinates(idx, 100);
            return (
              <line
                key={idx}
                x1={center}
                y1={center}
                x2={outer.x}
                y2={outer.y}
                stroke="#E2E8F0"
                strokeWidth="1"
              />
            );
          })}

          {/* Industry Benchmark Polygon (Slate/Blue dashed) */}
          <polygon
            points={benchmarkPoints}
            fill="rgba(148, 163, 184, 0.12)"
            stroke="#94A3B8"
            strokeWidth="2"
            strokeDasharray="4 3"
          />

          {/* Student Proficiency Polygon (Orange Vibrant) */}
          <polygon
            points={studentPoints}
            fill="rgba(234, 88, 12, 0.22)"
            stroke="#EA580C"
            strokeWidth="2.5"
            className="transition-all duration-500 ease-out"
          />

          {/* Axis Labels & Vertex Interactive Points */}
          {displaySkills.map((skill, idx) => {
            const studentCoord = getCoordinates(idx, skill.proficiencyLevel);
            const labelCoord = getCoordinates(idx, 122);
            const isHovered = hoveredSkill?.id === skill.id;

            return (
              <g key={skill.id}>
                {/* Vertex circle */}
                <circle
                  cx={studentCoord.x}
                  cy={studentCoord.y}
                  r={isHovered ? 6 : 4}
                  fill="#EA580C"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="cursor-pointer transition-all hover:scale-125"
                  onMouseEnter={() => setHoveredSkill(skill)}
                  onMouseLeave={() => setHoveredSkill(null)}
                />

                {/* Skill Name Label */}
                <text
                  x={labelCoord.x}
                  y={labelCoord.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-[10px] sm:text-[11px] font-medium fill-slate-600 select-none pointer-events-none"
                >
                  {skill.skillName.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hovered Skill Floating Tooltip */}
        {hoveredSkill && (
          <div className="absolute top-2 right-2 bg-slate-900/90 backdrop-blur-xs text-white p-2.5 rounded-xl text-xs shadow-lg pointer-events-none z-10 max-w-[190px]">
            <div className="font-bold text-orange-400">{hoveredSkill.skillName}</div>
            <div className="flex justify-between mt-1 text-[11px]">
              <span className="text-slate-300">Your Score:</span>
              <span className="font-bold text-white">{hoveredSkill.proficiencyLevel}%</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-300">Benchmark:</span>
              <span className="font-medium text-slate-300">{hoveredSkill.industryBenchmark}%</span>
            </div>
            <div className="mt-1 pt-1 border-t border-slate-700 text-[10px] text-slate-400">
              {hoveredSkill.verifiedByQuiz ? '✓ Verified by Diagnostic' : 'Self-assessed'}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-orange-600/30 border-2 border-orange-600" />
          <span className="font-semibold text-slate-700">Student Proficiency</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-slate-200 border-2 border-dashed border-slate-500" />
          <span className="text-slate-600">Industry Entry Target</span>
        </div>
      </div>
      <p className="text-[11px] text-slate-500 text-center mt-2">
        Benchmarked against Top Tier Placement requirements for {targetRole}.
      </p>
    </div>
  );
};
