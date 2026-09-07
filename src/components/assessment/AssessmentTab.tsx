import React, { useState } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Award,
  AlertCircle,
  HelpCircle,
  Clock,
  Layers,
  GraduationCap,
  BookOpen,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  Department,
  YearOfStudy,
  Semester,
  LearningStyle,
  StudentSkill,
  QuizQuestion,
} from '../../types';
import {
  DEPARTMENTS,
  TARGET_CAREERS,
  DIAGNOSTIC_QUIZ_QUESTIONS,
} from '../../data/mockData';
import {
  calculatePredictiveReadinessScore,
  calculateWeightedSkillGaps,
} from '../../utils/recommendationEngine';

export const AssessmentTab: React.FC = () => {
  const {
    currentStudent,
    updateStudent,
    studentSkills,
    setCurrentTab,
    verifySkillWithQuiz,
    setNotification,
  } = useApp();

  // Multi-step state: 1 -> 2 -> 3 -> 4 -> 5
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [fullName, setFullName] = useState(currentStudent.fullName);
  const [rollNo, setRollNo] = useState(currentStudent.rollNo);
  const [department, setDepartment] = useState<Department>(currentStudent.department);
  const [year, setYear] = useState<YearOfStudy>(currentStudent.year);
  const [semester, setSemester] = useState<Semester>(currentStudent.semester);
  const [cgpa, setCgpa] = useState<number>(currentStudent.cgpa);
  const [targetCareer, setTargetCareer] = useState<string>(currentStudent.targetCareer);
  const [learningStyle, setLearningStyle] = useState<LearningStyle>(currentStudent.learningStyle);

  // Self-rated skill proficiencies
  const [ratedSkills, setRatedSkills] = useState<{ [skillId: string]: number }>(() => {
    const map: { [skillId: string]: number } = {};
    studentSkills.forEach((s) => {
      map[s.skillId] = s.proficiencyLevel;
    });
    return map;
  });

  // Diagnostic Quiz State
  const questions: QuizQuestion[] =
    DIAGNOSTIC_QUIZ_QUESTIONS[department] || DIAGNOSTIC_QUIZ_QUESTIONS['CSE'] || [];
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: number }>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const handleSliderChange = (skillId: string, val: number) => {
    setRatedSkills((prev) => ({ ...prev, [skillId]: val }));
  };

  const handleSelectOption = (qId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / Math.max(1, questions.length)) * 100);
    setQuizScore(calculatedScore);
    setQuizCompleted(true);

    // Apply to current skills
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        verifySkillWithQuiz(q.skillId, 85);
      }
    });

    setNotification({
      message: `Diagnostic Quiz completed! Evaluated Score: ${calculatedScore}%`,
      type: 'success',
    });
    setCurrentStep(5);
  };

  const handleSaveAndGenerateRoadmap = () => {
    updateStudent({
      fullName,
      rollNo,
      department,
      year,
      semester,
      cgpa,
      targetCareer,
      learningStyle,
    });

    setNotification({
      message: 'Assessment completed! New adaptive roadmap calibrated successfully.',
      type: 'success',
    });

    setCurrentTab('roadmap');
  };

  const steps = [
    { num: 1, title: 'Academic Standing' },
    { num: 2, title: 'Career & Learning' },
    { num: 3, title: 'Skill Matrix' },
    { num: 4, title: 'Diagnostic Quiz' },
    { num: 5, title: 'Adaptive Results' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Wizard Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-orange-100 text-orange-700">
                PIE TECH DIAGNOSTIC ENGINE
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Step {currentStep} of 5
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Student Diagnostic & Pathway Calibration
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Calibrate your engineering profile, evaluate skill vectors, and generate personalized Anna University curriculum roadmaps.
            </p>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-5 gap-2 mt-4">
          {steps.map((s) => (
            <div
              key={s.num}
              onClick={() => s.num < currentStep && setCurrentStep(s.num)}
              className={`cursor-pointer transition-all ${
                s.num === currentStep
                  ? 'border-b-2 border-orange-600 pb-1 text-orange-600 font-bold'
                  : s.num < currentStep
                  ? 'border-b-2 border-emerald-500 pb-1 text-emerald-700 font-semibold'
                  : 'border-b-2 border-slate-200 pb-1 text-slate-400 font-medium'
              }`}
            >
              <div className="text-[10px] uppercase tracking-wider">Step {s.num}</div>
              <div className="text-xs truncate hidden sm:block">{s.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Academic Standing */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 animate-in fade-in">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Academic Standing & PIE Tech Credentials</h3>
            <p className="text-xs text-slate-500">Provide your official institutional details</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Roll Number (Anna Univ / PIE Tech)</label>
              <input
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                placeholder="721421104042"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:border-orange-500"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Year & Semester</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value as YearOfStudy)}
                  className="p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="Final Year">Final Year</option>
                </select>

                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value as Semester)}
                  className="p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  {['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'].map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current CGPA (Anna University Scale: 0.0 - 10.0)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.05"
                  min="5.0"
                  max="10.0"
                  value={cgpa}
                  onChange={(e) => setCgpa(parseFloat(e.target.value) || 7.5)}
                  className="w-32 p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                />
                <span className="text-xs text-slate-500">
                  Impacts 15% of your predictive career readiness score.
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2"
            >
              <span>Next: Career Target & Learning Style</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Career Goal & Learning Style */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 animate-in fade-in">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Career Trajectory & Learning Preference</h3>
            <p className="text-xs text-slate-500">Choose your industry target and preferred pedagogy</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Target Engineering Career Domain
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TARGET_CAREERS.map((c) => (
                  <div
                    key={c.role}
                    onClick={() => setTargetCareer(c.role)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      targetCareer === c.role
                        ? 'border-orange-500 bg-orange-50/50 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{c.role}</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {c.avgSalary}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                      <span>Dept: {c.department}</span>
                      <span className="text-orange-600 font-semibold">{c.demand} Hiring Demand</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Preferred Learning Style
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  {
                    id: 'Project-based',
                    title: 'Project-based',
                    desc: 'Build real-world SaaS, firmware prototypes, and deploy code.',
                  },
                  {
                    id: 'Hands-on Labs',
                    title: 'Hands-on Labs',
                    desc: 'Work on physical workstations, PIE Tech Maker Space & IoT hardware.',
                  },
                  {
                    id: 'Video Tutorials',
                    title: 'Video Tutorials',
                    desc: 'Structured lecture videos, visual walkthroughs, and code-alongs.',
                  },
                  {
                    id: 'Academic & Theoretical',
                    title: 'Academic / GATE',
                    desc: 'Mathematical proofs, formal specifications, and competitive exam prep.',
                  },
                ].map((style) => (
                  <div
                    key={style.id}
                    onClick={() => setLearningStyle(style.id as LearningStyle)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      learningStyle === style.id
                        ? 'border-orange-500 bg-orange-50/50 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-xs text-slate-900">{style.title}</div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{style.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2"
            >
              <span>Next: Self-Rated Skill Matrix</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Self-Rated Skill Matrix */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 animate-in fade-in">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Self-Rated Skill Matrix</h3>
            <p className="text-xs text-slate-500">
              Rate your current confidence in foundational and advanced engineering domains
            </p>
          </div>

          <div className="space-y-4">
            {studentSkills.map((skill) => {
              const currentVal = ratedSkills[skill.skillId] ?? skill.proficiencyLevel;
              return (
                <div key={skill.skillId} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <span className="text-xs font-bold text-slate-900">{skill.skillName}</span>
                      <span className="ml-2 text-[10px] text-slate-500">({skill.category})</span>
                    </div>
                    <span className="text-xs font-bold font-mono text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                      {currentVal}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={currentVal}
                    onChange={(e) => handleSliderChange(skill.skillId, parseInt(e.target.value))}
                    className="w-full accent-orange-600 cursor-pointer"
                  />

                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>Novice (10%)</span>
                    <span>Intermediate (50%)</span>
                    <span>Industry Benchmark ({skill.industryBenchmark}%)</span>
                    <span>Expert (100%)</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setCurrentStep(4)}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2"
            >
              <span>Next: Take Diagnostic Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Diagnostic Quiz */}
      {currentStep === 4 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Technical Diagnostic Quiz ({department})
              </h3>
              <p className="text-xs text-slate-500">
                Verifies your claimed proficiency with standardized Anna University / industry screening items
              </p>
            </div>
            <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
              Question {quizIndex + 1} of {questions.length}
            </span>
          </div>

          {questions.length > 0 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
                  Item #{quizIndex + 1} · {questions[quizIndex].difficulty}
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {questions[quizIndex].question}
                </h4>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {questions[quizIndex].options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[questions[quizIndex].id] === optIdx;
                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(questions[quizIndex].id, optIdx)}
                      className={`p-3.5 rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50 text-orange-950 font-bold shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <span>{opt}</span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'border-orange-600 bg-orange-600 text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quiz navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  disabled={quizIndex === 0}
                  onClick={() => setQuizIndex(quizIndex - 1)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 disabled:opacity-30 rounded-xl hover:bg-slate-100"
                >
                  Previous Question
                </button>

                {quizIndex < questions.length - 1 ? (
                  <button
                    onClick={() => setQuizIndex(quizIndex + 1)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
                  >
                    <span>Submit & Score Assessment</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 5: Adaptive Results & Recalibration */}
      {currentStep === 5 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 animate-in fade-in">
          <div className="text-center space-y-2 py-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Assessment Verified & Pathway Calibrated!
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your weighted skill-gap vector has been updated. Checkpoint quiz score:{' '}
              <strong className="text-emerald-600 font-extrabold">{quizScore ?? 85}%</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400">Target Role:</span>
              <div className="font-bold text-slate-900 mt-0.5">{targetCareer}</div>
            </div>
            <div>
              <span className="text-slate-400">Institution Department:</span>
              <div className="font-bold text-slate-900 mt-0.5">{department} ({year})</div>
            </div>
            <div>
              <span className="text-slate-400">Predicted Readiness:</span>
              <div className="font-bold text-orange-600 mt-0.5">Calculated & Adaptive</div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={handleSaveAndGenerateRoadmap}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md flex items-center gap-2"
            >
              <span>Apply to Profile & Open Interactive Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
