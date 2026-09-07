import React, { useState } from 'react';
import {
  Target,
  TrendingUp,
  Sparkles,
  Award,
  DollarSign,
  Building2,
  CheckCircle2,
  Sliders,
  RotateCcw,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CAREER_BENCHMARKS } from '../../data/mockData';
import { calculateWeightedSkillGaps } from '../../utils/recommendationEngine';

export const CareerPredictorTab: React.FC = () => {
  const { currentStudent, studentSkills, learningPath } = useApp();

  const benchmark = CAREER_BENCHMARKS[currentStudent.targetCareer];
  const vectorResult = calculateWeightedSkillGaps(studentSkills, currentStudent.targetCareer);

  // What-If Simulator state
  const [simulatedBoosts, setSimulatedBoosts] = useState<{ [skillId: string]: number }>({});
  const [simulatedCgpa, setSimulatedCgpa] = useState<number>(currentStudent.cgpa);
  const [simulatedExtraMilestones, setSimulatedExtraMilestones] = useState<number>(0);

  const resetSimulator = () => {
    setSimulatedBoosts({});
    setSimulatedCgpa(currentStudent.cgpa);
    setSimulatedExtraMilestones(0);
  };

  // Calculate simulated readiness score
  const baseScore = currentStudent.readinessScore;
  let simulatedScore = baseScore;

  // Each skill boost adds points proportional to weight
  Object.entries(simulatedBoosts).forEach(([skillId, boost]) => {
    const skill = studentSkills.find((s) => s.skillId === skillId);
    if (skill) {
      simulatedScore += Number(boost) * 0.15;
    }
  });

  // CGPA change impact
  const cgpaDiff = simulatedCgpa - currentStudent.cgpa;
  simulatedScore += cgpaDiff * 6;

  // Extra milestones completed
  simulatedScore += simulatedExtraMilestones * 4.5;

  simulatedScore = Math.min(99, Math.max(15, Math.round(simulatedScore)));

  // Recruiters hiring for this role at PIE Tech
  const recruiters = [
    { name: 'Zoho Corporation', role: 'Software Development Engineer', tier: 'Super Dream (₹8.5 - 12 LPA)' },
    { name: 'Robert Bosch Engineering', role: 'Embedded Systems Engineer', tier: 'Dream (₹7.0 - 10 LPA)' },
    { name: 'TCS Digital / Prime', role: 'Systems Engineer / Cloud Associate', tier: 'Prime (₹7.5 - 9 LPA)' },
    { name: 'Texas Instruments / Qualcomm', role: 'Firmware & Hardware Validation', tier: 'Marquee (₹14 - 18 LPA)' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-orange-100 text-orange-700">
                PREDICTIVE CAREER ENGINE
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Model: Multivariate ML Vectorizer
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Career Readiness & Placement Probability
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Machine learning forecast correlating your coursework, project submissions, and skill mastery against PIE Tech campus hiring thresholds.
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-2xl border border-orange-200 shrink-0">
            <Award className="w-8 h-8 text-orange-600 shrink-0" />
            <div>
              <div className="text-[11px] text-orange-800 font-medium">Predictive Score</div>
              <div className="text-2xl font-extrabold text-orange-950">
                {currentStudent.readinessScore}%
              </div>
            </div>
          </div>
        </div>

        {/* Salary & Role Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 font-semibold">Target Domain</span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              {currentStudent.targetCareer}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 font-semibold">Expected Campus Placement Range</span>
            <div className="text-sm font-bold text-emerald-700 mt-0.5">
              {benchmark?.expectedSalaryRange || '₹6.5 - 15 LPA'}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 font-semibold">Placement Confidence Tier</span>
            <div className="text-sm font-bold text-orange-600 mt-0.5">
              {currentStudent.readinessScore >= 80 ? 'Tier-1 Product Tier' : 'High Core Placement Tier'}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: What-If Simulator + Hiring Recruiters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Interactive What-If Simulator */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-orange-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  "What-If" Career Readiness Simulator
                </h3>
                <p className="text-xs text-slate-500">
                  Simulate how mastering skills or raising your CGPA affects placement readiness
                </p>
              </div>
            </div>

            <button
              onClick={resetSimulator}
              className="text-xs font-semibold text-slate-500 hover:text-orange-600 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Simulator Score Result Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-orange-800">
                Simulated Hiring Readiness:
              </div>
              <div className="text-2xl font-black text-orange-950 mt-0.5 flex items-center gap-2">
                <span>{simulatedScore}%</span>
                {simulatedScore > baseScore && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">
                    +{simulatedScore - baseScore}% Boost
                  </span>
                )}
              </div>
            </div>

            <div className="text-right text-xs">
              <div className="text-slate-500">Baseline Current:</div>
              <div className="font-bold text-slate-800">{baseScore}%</div>
            </div>
          </div>

          {/* Interactive Sliders */}
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Projected Extra Roadmap Milestones Completed:</span>
                <span className="font-mono text-orange-600 font-bold">
                  +{simulatedExtraMilestones} Milestones
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="4"
                value={simulatedExtraMilestones}
                onChange={(e) => setSimulatedExtraMilestones(parseInt(e.target.value))}
                className="w-full accent-orange-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Academic CGPA Target:</span>
                <span className="font-mono text-orange-600 font-bold">
                  {simulatedCgpa.toFixed(2)} / 10.0
                </span>
              </div>
              <input
                type="range"
                min="6.0"
                max="10.0"
                step="0.1"
                value={simulatedCgpa}
                onChange={(e) => setSimulatedCgpa(parseFloat(e.target.value))}
                className="w-full accent-orange-600 cursor-pointer"
              />
            </div>

            {/* Skill Boost Sliders */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Skill Mastery Boosters
              </span>
              {studentSkills.slice(0, 4).map((skill) => {
                const boost = simulatedBoosts[skill.skillId] || 0;
                return (
                  <div key={skill.skillId}>
                    <div className="flex justify-between text-xs text-slate-700 mb-1">
                      <span className="font-medium">{skill.skillName}</span>
                      <span className="font-mono text-xs font-bold text-orange-600">
                        +{boost}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      step="5"
                      value={boost}
                      onChange={(e) =>
                        setSimulatedBoosts({
                          ...simulatedBoosts,
                          [skill.skillId]: parseInt(e.target.value),
                        })
                      }
                      className="w-full accent-orange-600 cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: PIE Tech Campus Recruiters & Benchmarks */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Building2 className="w-5 h-5 text-orange-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  PIE Tech Campus Placement Recruiters
                </h3>
                <p className="text-xs text-slate-500">
                  Target companies aligned with {currentStudent.targetCareer}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {recruiters.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-200 hover:border-orange-200 bg-slate-50/50 flex flex-col justify-between gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{rec.name}</span>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                      {rec.tier}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Role: <span className="font-medium text-slate-800">{rec.role}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Anna University Placement Cell Note:</span>
              </div>
              <p className="mt-1 leading-relaxed text-[11px]">
                Students maintaining &ge; 75% Readiness Score on PIE Tech LMS gain direct pass access to Day-1 Super Dream coding assessments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
