import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Lock,
  PlayCircle,
  ExternalLink,
  BookOpen,
  HelpCircle,
  Sparkles,
  Filter,
  Search,
  ArrowRight,
  Clock,
  Layers,
  AlertTriangle,
  UploadCloud,
  FileCode,
  Zap,
  FileText,
  Download,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PathMilestone, PaceFilter, MilestoneDifficulty } from '../../types';
import { filterMilestonesByPace } from '../../utils/recommendationEngine';
import { DIAGNOSTIC_QUIZ_QUESTIONS } from '../../data/mockData';
import { RoadmapPdfModal } from '../common/RoadmapPdfModal';

export const RoadmapTab: React.FC = () => {
  const {
    currentStudent,
    learningPath,
    studentSkills,
    paceFilter,
    setPaceFilter,
    toggleMilestoneComplete,
    openQuizModal,
    knowledgeGaps,
    resolveKnowledgeGap,
    setNotification,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [selectedMilestone, setSelectedMilestone] = useState<PathMilestone | null>(null);
  const [projectSubmitting, setProjectSubmitting] = useState(false);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  if (!learningPath) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <Compass className="w-12 h-12 text-orange-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">No Learning Path Initialized</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
          Complete the diagnostic assessment to generate an adaptive branching roadmap tailored to your career goal.
        </p>
      </div>
    );
  }

  // Filter milestones by pace
  let milestones = filterMilestonesByPace(learningPath.milestones, paceFilter);

  // Apply search query
  if (searchQuery.trim()) {
    milestones = milestones.filter(
      (m) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Apply difficulty filter
  if (difficultyFilter !== 'all') {
    milestones = milestones.filter((m) => m.difficulty === difficultyFilter);
  }

  const handleStartCheckpointQuiz = (milestone: PathMilestone) => {
    // Pick relevant question from quiz bank
    const deptQuestions = DIAGNOSTIC_QUIZ_QUESTIONS[currentStudent.department] || DIAGNOSTIC_QUIZ_QUESTIONS['CSE'];
    const matchedQ = deptQuestions.find((q) => milestone.title.toLowerCase().includes(q.skillId.replace('s_', ''))) || deptQuestions[0];
    openQuizModal(matchedQ, milestone.id);
  };

  const handleSimulateProjectSubmit = (milestone: PathMilestone) => {
    if (!submissionUrl.trim()) {
      setNotification({ message: 'Please enter a valid GitHub repo or demo URL.', type: 'warning' });
      return;
    }

    setProjectSubmitting(true);
    setTimeout(() => {
      setProjectSubmitting(false);
      toggleMilestoneComplete(milestone.id);
      setSelectedMilestone(null);
      setSubmissionUrl('');
      setNotification({
        message: `Project verified by PIE Tech Automated Evaluator! Milestone marked complete.`,
        type: 'success',
      });
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Roadmap Header & Filter Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-orange-100 text-orange-700">
                DYNAMIC BRANCHING GRAPH
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Pace: {paceFilter.toUpperCase()}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              {learningPath.title}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Interactive prerequisite chains, verified checkpoints, and institutional milestones for {currentStudent.targetCareer}.
            </p>
          </div>

          {/* Interactive Pace Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold shrink-0">
            <button
              onClick={() => setPaceFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                paceFilter === 'all'
                  ? 'bg-white text-orange-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Full Curriculum
            </button>
            <button
              onClick={() => setPaceFilter('fast-track')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                paceFilter === 'fast-track'
                  ? 'bg-orange-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Fast Track (8 Wks)</span>
            </button>
            <button
              onClick={() => setPaceFilter('deep-dive')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                paceFilter === 'deep-dive'
                  ? 'bg-white text-orange-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Deep Dive (24 Wks)
            </button>
            <button
              onClick={() => setPaceFilter('exam-prep')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                paceFilter === 'exam-prep'
                  ? 'bg-white text-orange-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Exam Prep / Placement
            </button>
          </div>
        </div>

        {/* Search & Difficulty Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search milestones, skills, tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Difficulty:</span>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:border-orange-500"
              >
                <option value="all">All Difficulties</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all shrink-0 active:scale-95"
              title="Download formatted personalized career roadmap PDF for career planning and placement sessions"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export PDF Roadmap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Adaptive Knowledge Gap Alert in Roadmap View */}
      {knowledgeGaps.length > 0 && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950">
              <span className="font-bold">Adaptive Alert:</span> {knowledgeGaps[0].reason} —{' '}
              <span className="text-amber-800">{knowledgeGaps[0].recommendation}</span>
            </div>
          </div>
          <button
            onClick={() => resolveKnowledgeGap(knowledgeGaps[0].id)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 whitespace-nowrap shadow-2xs"
          >
            Insert Brush-up & Re-route
          </button>
        </div>
      )}

      {/* Interactive Branching Timeline / Graph */}
      <div className="relative pl-6 sm:pl-10 space-y-6 before:absolute before:left-[17px] sm:before:left-[27px] before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
        {milestones.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
            No milestones match your search or difficulty filter.
          </div>
        ) : (
          milestones.map((milestone, idx) => {
            const isCompleted = milestone.isCompleted;
            const isInProgress = milestone.status === 'in-progress';
            const isLocked = milestone.status === 'locked';

            return (
              <div key={milestone.id} className="relative group">
                {/* Node Status Icon in Timeline Track */}
                <div
                  className={`absolute -left-[24px] sm:-left-[35px] top-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all z-10 ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : isInProgress
                      ? 'bg-orange-600 text-white ring-4 ring-orange-100 shadow-md shadow-orange-600/30 animate-pulse'
                      : 'bg-slate-100 text-slate-400 border border-slate-300'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isInProgress ? (
                    <PlayCircle className="w-4 h-4" />
                  ) : (
                    <Lock className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Milestone Node Card */}
                <div
                  className={`p-5 rounded-2xl border transition-all ${
                    isInProgress
                      ? 'bg-gradient-to-r from-orange-50/50 via-white to-white border-orange-300 shadow-sm'
                      : isCompleted
                      ? 'bg-white border-emerald-200/80 shadow-2xs opacity-95'
                      : 'bg-slate-50/80 border-slate-200 opacity-75'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 text-slate-700">
                          Step #{milestone.stepOrder}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                            milestone.difficulty === 'Beginner'
                              ? 'bg-emerald-50 text-emerald-700'
                              : milestone.difficulty === 'Intermediate'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-purple-50 text-purple-700'
                          }`}
                        >
                          {milestone.difficulty}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-orange-50 text-orange-700">
                          {milestone.category}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3" />
                          Est. {milestone.estimatedWeeks} Weeks
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-base font-bold text-slate-900">
                        {milestone.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                        {milestone.description}
                      </p>

                      {/* Prerequisite Link Info */}
                      {milestone.prerequisiteTitle && (
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 pt-1 font-mono">
                          <span className="text-slate-400">Prerequisite:</span>
                          <span className="font-medium text-slate-700 underline">
                            {milestone.prerequisiteTitle}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Right Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0 md:flex-col md:items-end">
                      <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        {milestone.relevancePercent}% Relevance
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => setSelectedMilestone(milestone)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50/40 text-xs font-semibold text-slate-700 transition-colors"
                        >
                          Details & Resources
                        </button>

                        <button
                          onClick={() => toggleMilestoneComplete(milestone.id)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : isInProgress
                              ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-xs'
                              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                          }`}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Completed</span>
                            </>
                          ) : (
                            <>
                              <span>Mark Complete</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Strip: Resource Link & Checkpoint Quiz */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <a
                      href={milestone.resourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{milestone.resourceTitle}</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartCheckpointQuiz(milestone)}
                        className="text-slate-600 hover:text-orange-600 font-medium flex items-center gap-1"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-orange-500" />
                        <span>Diagnostic Quiz</span>
                      </button>

                      {milestone.practicalTask && (
                        <span className="text-[11px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200 font-medium">
                          PIE Tech Lab Verification Included
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Milestone Detail & Project Verification Drawer / Modal */}
      {selectedMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-orange-100 text-orange-700">
                  MILESTONE #{selectedMilestone.stepOrder} · {selectedMilestone.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedMilestone.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMilestone(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs text-slate-600">
              <p className="text-slate-700 leading-relaxed text-sm">
                {selectedMilestone.description}
              </p>

              {/* Status and relevance */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 font-medium">Relevance to Role:</span>
                  <div className="text-sm font-bold text-slate-900">
                    {selectedMilestone.relevancePercent}% Match
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Current Status:</span>
                  <div className="text-sm font-bold text-orange-600 capitalize">
                    {selectedMilestone.status}
                  </div>
                </div>
              </div>

              {/* Curated Resource */}
              <div className="p-3.5 bg-orange-50/50 rounded-xl border border-orange-200">
                <div className="font-bold text-orange-900 mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-orange-600" />
                  <span>Curated Learning Material:</span>
                </div>
                <div className="text-slate-700 font-semibold mb-1">
                  {selectedMilestone.resourceTitle}
                </div>
                <a
                  href={selectedMilestone.resourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-orange-600 hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
                >
                  <span>{selectedMilestone.resourceUrl}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Project / Lab Verification Simulator */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <UploadCloud className="w-4 h-4 text-orange-600" />
                  <span>Submit Project or Lab Verification (PIE Tech Hub)</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Submit your GitHub repository link or PIE Tech local lab testbench URL to automatically verify this milestone and recalculate your readiness score.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="https://github.com/your-username/pie-tech-project"
                    value={submissionUrl}
                    onChange={(e) => setSubmissionUrl(e.target.value)}
                    className="flex-1 p-2 rounded-xl border border-slate-200 text-xs focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                  <button
                    onClick={() => handleSimulateProjectSubmit(selectedMilestone)}
                    disabled={projectSubmitting}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-xs shadow-xs disabled:opacity-50"
                  >
                    {projectSubmitting ? 'Evaluating...' : 'Verify Code'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => handleStartCheckpointQuiz(selectedMilestone)}
                className="text-orange-600 hover:text-orange-700 font-bold text-xs flex items-center gap-1"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Take Diagnostic Checkpoint</span>
              </button>

              <button
                onClick={() => {
                  toggleMilestoneComplete(selectedMilestone.id);
                  setSelectedMilestone(null);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs"
              >
                Toggle Completion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Career Planning Session PDF Export Modal */}
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
    </div>
  );
};
