import React, { useState } from 'react';
import {
  Award,
  Compass,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  Clock,
  Target,
  BookOpen,
  FileText,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReadinessRadarChart } from './ReadinessRadarChart';
import { WeeklyTrajectoryMeter } from './WeeklyTrajectoryMeter';
import { PIETechHighlights } from './PIETechHighlights';
import { RoadmapPdfModal } from '../common/RoadmapPdfModal';
import {
  calculateWeightedSkillGaps,
  generateReadinessTrajectory,
} from '../../utils/recommendationEngine';

export const OverviewTab: React.FC = () => {
  const {
    currentStudent,
    studentSkills,
    learningPath,
    knowledgeGaps,
    setCurrentTab,
    resolveKnowledgeGap,
    toggleMilestoneComplete,
    setNotification,
  } = useApp();

  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const vectorResult = calculateWeightedSkillGaps(studentSkills, currentStudent.targetCareer);
  const trajectory = generateReadinessTrajectory(currentStudent.readinessScore, learningPath);

  // Active milestone
  const activeMilestone = learningPath?.milestones.find((m) => m.status === 'in-progress');
  const completedMilestonesCount = learningPath?.completedMilestones || 0;
  const totalMilestonesCount = learningPath?.totalMilestones || 8;
  const progressPercent = Math.round((completedMilestonesCount / (totalMilestonesCount || 1)) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome & Student Hero Bar */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 rounded-3xl p-6 text-white shadow-lg shadow-orange-500/15 relative overflow-hidden">
        {/* Subtle background crest accent */}
        <div className="absolute right-0 -bottom-8 opacity-10 pointer-events-none transform rotate-12 scale-150">
          <Award className="w-80 h-80" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold border border-white/25">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>Pollachi Institute of Engineering & Technology · Student Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentStudent.fullName.split(' ')[0]}!
            </h1>
            <p className="text-orange-50 text-xs sm:text-sm leading-relaxed">
              Your personalized pathway is actively tuned for{' '}
              <strong className="text-white underline decoration-orange-300 font-bold">
                {currentStudent.targetCareer}
              </strong>
              . Your predicted hiring readiness score is{' '}
              <strong className="text-white font-bold">{currentStudent.readinessScore}%</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm border border-white/30 transition-all shadow-xs flex items-center gap-2"
              title="Download formatted career planning roadmap as PDF"
            >
              <FileText className="w-4 h-4" />
              <span>Export PDF Dossier</span>
            </button>
            <button
              onClick={() => setCurrentTab('roadmap')}
              className="px-4 py-2.5 rounded-xl bg-white text-orange-600 font-bold text-xs sm:text-sm hover:bg-orange-50 transition-all shadow-md flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Resume Roadmap</span>
            </button>
            <button
              onClick={() => setCurrentTab('assessment')}
              className="px-4 py-2.5 rounded-xl bg-orange-700/60 hover:bg-orange-700 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all flex items-center gap-2"
            >
              <span>Take Diagnostic Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Readiness Score */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Career Readiness</span>
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {currentStudent.readinessScore}%
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>+6% over last checkpoint</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-orange-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${currentStudent.readinessScore}%` }}
            />
          </div>
        </div>

        {/* Stat 2: Roadmap Progress */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Milestones Done</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {completedMilestonesCount}
              <span className="text-sm font-semibold text-slate-400">/{totalMilestonesCount}</span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">
              {progressPercent}% curriculum completion
            </div>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Stat 3: Vector Match Index */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Skill Vector Match</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {vectorResult.overallMatchPercentage}%
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">
              Across {studentSkills.length} evaluated domains
            </div>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${vectorResult.overallMatchPercentage}%` }}
            />
          </div>
        </div>

        {/* Stat 4: Placement Target */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Placement Target</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 truncate">
              Day-1 Ready
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">
              Graduation: June 2027
            </div>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-purple-600 h-full rounded-full w-[85%]" />
          </div>
        </div>
      </div>

      {/* Critical Knowledge Gap Alert Banner (if any) */}
      {knowledgeGaps.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 shadow-2xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-amber-950">
                    Adaptive Engine Alert: Critical Knowledge Gap Detected
                  </h3>
                  <span className="px-2 py-0.2 rounded-md text-[10px] font-bold bg-amber-200 text-amber-900 uppercase">
                    High Priority
                  </span>
                </div>
                <p className="text-xs text-amber-900/90 leading-relaxed">
                  {knowledgeGaps[0].reason} Your current evaluated score for{' '}
                  <strong className="text-amber-950 underline">{knowledgeGaps[0].skillName}</strong> is{' '}
                  <strong>{knowledgeGaps[0].currentScore}%</strong> (Target:{' '}
                  <strong>{knowledgeGaps[0].requiredScore}%</strong>).
                </p>
                <p className="text-xs text-amber-800 italic mt-1">
                  Recommendation: {knowledgeGaps[0].recommendation}
                </p>
              </div>
            </div>

            <button
              onClick={() => resolveKnowledgeGap(knowledgeGaps[0].id)}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 shadow-2xs transition-all whitespace-nowrap"
            >
              Auto-Resolve & Re-route
            </button>
          </div>
        </div>
      )}

      {/* Main Analytics Grid: Radar Chart + Trajectory Meter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Readiness Radar Chart */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Readiness Radar Matrix</h3>
                <p className="text-xs text-slate-500">
                  Student Proficiency vs. Industry Benchmark
                </p>
              </div>
              <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-orange-50 text-orange-700 border border-orange-200">
                Vector Analysis
              </span>
            </div>

            {/* Radar Component */}
            <div className="mt-4">
              <ReadinessRadarChart
                skills={studentSkills}
                targetRole={currentStudent.targetCareer}
              />
            </div>
          </div>

          {/* Critical Skill Gaps List */}
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Priority Skill Deficits
            </span>
            <div className="space-y-1.5">
              {vectorResult.skillGaps.slice(0, 3).map((g) => (
                <div
                  key={g.skillId}
                  className="flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-slate-50"
                >
                  <span className="font-medium text-slate-700">{g.skillName}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-mono text-[11px]">
                      {g.currentScore}% / {g.targetScore}%
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        g.gap > 15
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-orange-50 text-orange-700'
                      }`}
                    >
                      -{g.gap}% gap
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Weekly Trajectory Meter + Active Step */}
        <div className="lg:col-span-7 space-y-6">
          {/* Weekly Trajectory Meter */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Weekly Trajectory Meter</h3>
                <p className="text-xs text-slate-500">
                  Projected career readiness trajectory towards graduation placement
                </p>
              </div>
              <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                Predictive Model
              </span>
            </div>

            <div className="mt-4">
              <WeeklyTrajectoryMeter
                trajectory={trajectory}
                currentScore={currentStudent.readinessScore}
              />
            </div>
          </div>

          {/* Active Milestone Card */}
          {activeMilestone && (
            <div className="bg-gradient-to-br from-white to-orange-50/30 rounded-2xl border-2 border-orange-200 p-5 shadow-xs">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-orange-600 text-white">
                      ACTIVE STEP #{activeMilestone.stepOrder}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Est. {activeMilestone.estimatedWeeks} Weeks · {activeMilestone.difficulty}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mt-2">
                    {activeMilestone.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {activeMilestone.description}
                  </p>
                </div>

                <button
                  onClick={() => toggleMilestoneComplete(activeMilestone.id)}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs shrink-0 flex items-center gap-1.5 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Complete</span>
                </button>
              </div>

              {activeMilestone.practicalTask && (
                <div className="mt-3.5 p-3 rounded-xl bg-white border border-orange-200/80 text-xs flex items-center justify-between gap-2">
                  <div className="text-slate-700">
                    <strong className="text-orange-700 font-bold">PIE Tech Lab Verification:</strong>{' '}
                    {activeMilestone.practicalTask}
                  </div>
                  <button
                    onClick={() => setCurrentTab('roadmap')}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 shrink-0"
                  >
                    <span>View Lab</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* PIE Tech Highlights Component */}
      <PIETechHighlights />

      {/* Career Planning Session PDF Export Modal */}
      {learningPath && (
        <RoadmapPdfModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          student={currentStudent}
          learningPath={learningPath}
          studentSkills={studentSkills}
          onSuccess={() => {
            setNotification({
              message: 'Official PIE Tech Career Planning Roadmap PDF downloaded successfully.',
              type: 'success',
            });
          }}
        />
      )}
    </div>
  );
};
