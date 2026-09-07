import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  Compass,
  FileCheck2,
  LineChart,
  BookOpen,
  Database,
  User,
  ChevronDown,
  Award,
  PlusCircle,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  X,
  Target,
  FileText,
} from 'lucide-react';
import { useApp, NavTab } from '../../context/AppContext';
import { RoadmapPdfModal } from '../common/RoadmapPdfModal';

export const Header: React.FC = () => {
  const {
    currentStudent,
    students,
    selectStudent,
    currentTab,
    setCurrentTab,
    createEmptyStudent,
    resetToDefaults,
    notification,
    setNotification,
    knowledgeGaps,
    learningPath,
    studentSkills,
  } = useApp();

  const [studentDropdownOpen, setStudentDropdownOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LineChart },
    { id: 'assessment', label: 'Skill Diagnostic', icon: FileCheck2 },
    { id: 'roadmap', label: 'My Roadmap', icon: Compass },
    { id: 'career', label: 'Career Predictor', icon: Target },
    { id: 'resources', label: 'Resources & Labs', icon: BookOpen },
    { id: 'database', label: 'SQL Schema', icon: Database },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // Readiness color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-300';
    if (score >= 60) return 'text-orange-700 bg-orange-50 border-orange-300';
    return 'text-amber-700 bg-amber-50 border-amber-300';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner / Toast Notification if present */}
      {notification && (
        <div
          className={`px-4 py-2 text-xs md:text-sm font-medium flex items-center justify-between transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-b border-emerald-200'
              : notification.type === 'warning'
              ? 'bg-amber-50 text-amber-900 border-b border-amber-200'
              : 'bg-orange-50 text-orange-950 border-b border-orange-200'
          }`}
        >
          <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-orange-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Institution Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-2 gap-4">
          {/* Institution Crest & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0 border border-orange-400/40">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 truncate">
                  Pollachi Institute of Engineering and Technology
                </span>
                <span className="px-2 py-0.5 text-[11px] font-bold tracking-wider rounded-md bg-orange-100 text-orange-700 border border-orange-200">
                  PIE TECH
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate hidden sm:block">
                AICTE Approved · Affiliated to Anna University · Personalized Adaptive Career Roadmaps
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar & Student Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Metrics Chips */}
            <div className="hidden lg:flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
              <div className="px-2.5 py-1 text-xs font-semibold text-slate-700 flex items-center gap-1.5 border-r border-slate-200">
                <span className="text-slate-400">CGPA:</span>
                <span className="text-slate-900 font-bold">{currentStudent.cgpa.toFixed(2)}</span>
                <span className="text-[11px] text-slate-500">({currentStudent.semester})</span>
              </div>
              <div className="px-2.5 py-1 text-xs font-medium text-slate-700 flex items-center gap-1.5 border-r border-slate-200 max-w-[180px] truncate">
                <span className="text-slate-400">Target:</span>
                <span className="text-orange-700 font-semibold truncate">{currentStudent.targetCareer}</span>
              </div>
              {/* Readiness Score Pill */}
              <div
                className={`px-3 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-all shadow-2xs ${getScoreColor(
                  currentStudent.readinessScore
                )}`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Readiness: {currentStudent.readinessScore}%</span>
              </div>
            </div>

            {/* PDF Export Action Button */}
            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-orange-200 bg-orange-50/70 hover:bg-orange-100/80 text-orange-800 transition-all text-xs font-bold shadow-2xs"
              title="Download formatted career roadmap as PDF for career planning sessions"
            >
              <FileText className="w-3.5 h-3.5 text-orange-600" />
              <span className="hidden sm:inline">PDF Roadmap</span>
            </button>

            {/* Student Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setStudentDropdownOpen(!studentDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50/40 bg-white transition-all text-left shadow-2xs focus:outline-hidden"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-xs border border-orange-200">
                  {currentStudent.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                    {currentStudent.fullName}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    {currentStudent.department} · {currentStudent.rollNo}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {studentDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setStudentDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-2 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Switch Student Profile
                      </p>
                      <p className="text-xs text-slate-500">
                        PIE Tech Engineering Cohort
                      </p>
                    </div>

                    <div className="py-1 space-y-1">
                      {students.map((st) => (
                        <button
                          key={st.id}
                          onClick={() => {
                            selectStudent(st.id);
                            setStudentDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                            st.id === currentStudent.id
                              ? 'bg-orange-50 border border-orange-200 text-orange-950 font-semibold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div>
                            <div className="font-bold">{st.fullName}</div>
                            <div className="text-[11px] text-slate-500">
                              {st.department} · {st.year} · {st.targetCareer}
                            </div>
                          </div>
                          <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-white border border-slate-200">
                            {st.readinessScore}%
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <button
                        onClick={() => {
                          setStudentDropdownOpen(false);
                          createEmptyStudent();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-orange-600 hover:bg-orange-50 rounded-xl transition-colors"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Add New Student / Diagnostic</span>
                      </button>
                      <button
                        onClick={() => {
                          setStudentDropdownOpen(false);
                          resetToDefaults();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Institutional Demo Data</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Metrics Strip */}
        <div className="lg:hidden flex items-center justify-between py-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Target:</span>
            <span className="font-semibold text-slate-900 truncate max-w-[150px]">
              {currentStudent.targetCareer}
            </span>
          </div>
          <div
            className={`px-2.5 py-0.5 rounded-md font-bold text-xs border ${getScoreColor(
              currentStudent.readinessScore
            )}`}
          >
            Readiness: {currentStudent.readinessScore}%
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-none border-t border-slate-100">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.id === 'roadmap' && knowledgeGaps.length > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-orange-800 text-orange-100' : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {knowledgeGaps.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

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
    </header>
  );
};
