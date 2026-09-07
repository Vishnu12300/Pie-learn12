import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Student,
  StudentSkill,
  LearningPath,
  PathMilestone,
  KnowledgeGapAlert,
  PaceFilter,
  QuizQuestion,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_STUDENT_SKILLS,
  INITIAL_LEARNING_PATHS,
  KNOWLEDGE_GAP_ALERTS,
} from '../data/mockData';
import {
  calculatePredictiveReadinessScore,
  detectKnowledgeGaps,
} from '../utils/recommendationEngine';

export type NavTab =
  | 'dashboard'
  | 'roadmap'
  | 'assessment'
  | 'career'
  | 'resources'
  | 'database'
  | 'profile';

interface AppContextType {
  students: Student[];
  currentStudent: Student;
  studentSkills: StudentSkill[];
  learningPath: LearningPath;
  knowledgeGaps: KnowledgeGapAlert[];
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  paceFilter: PaceFilter;
  setPaceFilter: (pace: PaceFilter) => void;
  selectStudent: (studentId: string) => void;
  updateStudent: (updated: Partial<Student>) => void;
  toggleMilestoneComplete: (milestoneId: string) => void;
  verifySkillWithQuiz: (skillId: string, score: number) => void;
  resolveKnowledgeGap: (gapId: string) => void;
  activeQuizModal: { isOpen: boolean; question?: QuizQuestion; milestoneId?: string } | null;
  openQuizModal: (question: QuizQuestion, milestoneId?: string) => void;
  closeQuizModal: () => void;
  submitQuizAnswer: (selectedIndex: number) => boolean;
  createEmptyStudent: () => void;
  resetToDefaults: () => void;
  notification: { message: string; type: 'success' | 'info' | 'warning' } | null;
  setNotification: (notif: { message: string; type: 'success' | 'info' | 'warning' } | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'pietech_learning_v2_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [currentStudentId, setCurrentStudentId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'current_student_id');
    return saved || 'std_01';
  });

  const [allStudentSkills, setAllStudentSkills] = useState<Record<string, StudentSkill[]>>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'skills');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_SKILLS;
  });

  const [allPaths, setAllPaths] = useState<Record<string, LearningPath>>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'paths');
    return saved ? JSON.parse(saved) : INITIAL_LEARNING_PATHS;
  });

  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [paceFilter, setPaceFilter] = useState<PaceFilter>('all');
  const [activeQuizModal, setActiveQuizModal] = useState<{
    isOpen: boolean;
    question?: QuizQuestion;
    milestoneId?: string;
  } | null>(null);

  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'info' | 'warning';
  } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'current_student_id', currentStudentId);
  }, [currentStudentId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'skills', JSON.stringify(allStudentSkills));
  }, [allStudentSkills]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'paths', JSON.stringify(allPaths));
  }, [allPaths]);

  // Current student object
  const currentStudent =
    students.find((s) => s.id === currentStudentId) || students[0] || INITIAL_STUDENTS[0];

  const studentSkills = allStudentSkills[currentStudent.id] || INITIAL_STUDENT_SKILLS['std_01'] || [];
  const learningPath = allPaths[currentStudent.id] || INITIAL_LEARNING_PATHS['std_01'];

  // Calculate dynamic knowledge gaps
  const dynamicGaps = learningPath ? detectKnowledgeGaps(studentSkills, learningPath) : [];
  const initialGaps = KNOWLEDGE_GAP_ALERTS[currentStudent.id] || [];
  const knowledgeGaps = [...dynamicGaps, ...initialGaps.filter(g => !dynamicGaps.some(dg => dg.skillName === g.skillName))];

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#EA580C', '#F97316', '#FDBA74', '#10B981', '#3B82F6'],
      });
    } catch {
      // ignore
    }
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  };

  const selectStudent = (studentId: string) => {
    setCurrentStudentId(studentId);
    showToast(`Switched profile to ${students.find((s) => s.id === studentId)?.fullName || 'Student'}`, 'info');
  };

  const updateStudent = (updated: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === currentStudent.id ? { ...s, ...updated } : s))
    );
    showToast('Student profile updated successfully', 'success');
  };

  const toggleMilestoneComplete = (milestoneId: string) => {
    if (!learningPath) return;

    let justCompleted = false;
    const updatedMilestones = learningPath.milestones.map((m) => {
      if (m.id === milestoneId) {
        const nextState = !m.isCompleted;
        if (nextState) justCompleted = true;
        return {
          ...m,
          isCompleted: nextState,
          status: (nextState ? 'completed' : 'in-progress') as PathMilestone['status'],
          completedAt: nextState ? new Date().toISOString().split('T')[0] : undefined,
        };
      }
      return m;
    });

    // Recalculate locked / in-progress states
    for (let i = 0; i < updatedMilestones.length; i++) {
      const m = updatedMilestones[i];
      if (m.isCompleted) {
        m.status = 'completed';
      } else {
        const prev = i > 0 ? updatedMilestones[i - 1] : null;
        if (!prev || prev.isCompleted) {
          m.status = 'in-progress';
        } else {
          m.status = 'locked';
        }
      }
    }

    const completedCount = updatedMilestones.filter((m) => m.isCompleted).length;
    const updatedPath: LearningPath = {
      ...learningPath,
      milestones: updatedMilestones,
      completedMilestones: completedCount,
      lastUpdated: new Date().toISOString(),
    };

    setAllPaths((prev) => ({
      ...prev,
      [currentStudent.id]: updatedPath,
    }));

    // Recalculate predictive readiness score
    const newReadiness = calculatePredictiveReadinessScore(
      currentStudent,
      studentSkills,
      updatedPath
    );

    setStudents((prev) =>
      prev.map((s) =>
        s.id === currentStudent.id ? { ...s, readinessScore: newReadiness } : s
      )
    );

    if (justCompleted) {
      triggerConfetti();
      showToast(
        `Milestone completed! Career readiness increased to ${newReadiness}%.`,
        'success'
      );
    } else {
      showToast('Milestone status updated.', 'info');
    }
  };

  const verifySkillWithQuiz = (skillId: string, score: number) => {
    const updatedSkills = studentSkills.map((s) => {
      if (s.skillId === skillId) {
        return {
          ...s,
          proficiencyLevel: Math.min(100, Math.max(s.proficiencyLevel, score)),
          verifiedByQuiz: true,
          quizScore: score,
          lastAssessed: new Date().toISOString().split('T')[0],
        };
      }
      return s;
    });

    setAllStudentSkills((prev) => ({
      ...prev,
      [currentStudent.id]: updatedSkills,
    }));

    // Recalculate score
    const newScore = calculatePredictiveReadinessScore(
      currentStudent,
      updatedSkills,
      learningPath
    );
    setStudents((prev) =>
      prev.map((s) =>
        s.id === currentStudent.id ? { ...s, readinessScore: newScore } : s
      )
    );

    triggerConfetti();
    showToast(`Skill diagnostic passed with ${score}%! Readiness updated to ${newScore}%.`, 'success');
  };

  const resolveKnowledgeGap = (gapId: string) => {
    const gap = knowledgeGaps.find((g) => g.id === gapId);
    if (!gap) return;

    // Boost the skill
    const updatedSkills = studentSkills.map((s) => {
      if (s.skillName.toLowerCase().includes(gap.skillName.toLowerCase().split(' ')[0])) {
        return {
          ...s,
          proficiencyLevel: gap.requiredScore + 5,
          verifiedByQuiz: true,
          lastAssessed: new Date().toISOString().split('T')[0],
        };
      }
      return s;
    });

    setAllStudentSkills((prev) => ({
      ...prev,
      [currentStudent.id]: updatedSkills,
    }));

    showToast(`Resolved critical gap: "${gap.skillName}". Roadmap re-routed!`, 'success');
  };

  const openQuizModal = (question: QuizQuestion, milestoneId?: string) => {
    setActiveQuizModal({
      isOpen: true,
      question,
      milestoneId,
    });
  };

  const closeQuizModal = () => {
    setActiveQuizModal(null);
  };

  const submitQuizAnswer = (selectedIndex: number): boolean => {
    if (!activeQuizModal?.question) return false;
    const isCorrect = selectedIndex === activeQuizModal.question.correctIndex;
    if (isCorrect) {
      const score = 92;
      verifySkillWithQuiz(activeQuizModal.question.skillId, score);
      if (activeQuizModal.milestoneId) {
        toggleMilestoneComplete(activeQuizModal.milestoneId);
      }
      closeQuizModal();
      return true;
    }
    return false;
  };

  const createEmptyStudent = () => {
    const newId = 'std_new_' + Date.now();
    const newStudent: Student = {
      id: newId,
      fullName: 'New Engineering Student',
      rollNo: '7214' + Math.floor(10000000 + Math.random() * 90000000),
      department: 'CSE',
      year: '1st Year',
      semester: 'Sem 1',
      cgpa: 8.0,
      targetCareer: 'Full-Stack Software Engineer',
      learningStyle: 'Project-based',
      readinessScore: 25,
      createdAt: new Date().toISOString(),
      email: 'student.pie@pietech.edu.in',
    };

    const newSkills: StudentSkill[] = INITIAL_STUDENT_SKILLS['std_01'].map((s) => ({
      ...s,
      studentId: newId,
      id: 'sk_new_' + Math.random().toString(36).substring(7),
      proficiencyLevel: 25,
      verifiedByQuiz: false,
      quizScore: undefined,
    }));

    const newPath: LearningPath = {
      ...INITIAL_LEARNING_PATHS['std_01'],
      id: 'lp_new_' + Date.now(),
      studentId: newId,
      completedMilestones: 0,
      milestones: INITIAL_LEARNING_PATHS['std_01'].milestones.map((m, idx) => ({
        ...m,
        id: 'ms_new_' + idx,
        isCompleted: false,
        status: idx === 0 ? 'in-progress' : 'locked',
        completedAt: undefined,
      })),
    };

    setStudents((prev) => [newStudent, ...prev]);
    setAllStudentSkills((prev) => ({ ...prev, [newId]: newSkills }));
    setAllPaths((prev) => ({ ...prev, [newId]: newPath }));
    setCurrentStudentId(newId);
    setCurrentTab('assessment');
    showToast('New student profile initialized. Launching Skill Diagnostic wizard...', 'info');
  };

  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_PREFIX + 'students');
    localStorage.removeItem(STORAGE_PREFIX + 'current_student_id');
    localStorage.removeItem(STORAGE_PREFIX + 'skills');
    localStorage.removeItem(STORAGE_PREFIX + 'paths');
    setStudents(INITIAL_STUDENTS);
    setCurrentStudentId('std_01');
    setAllStudentSkills(INITIAL_STUDENT_SKILLS);
    setAllPaths(INITIAL_LEARNING_PATHS);
    showToast('Reset data to institutional defaults.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        students,
        currentStudent,
        studentSkills,
        learningPath,
        knowledgeGaps,
        currentTab,
        setCurrentTab,
        paceFilter,
        setPaceFilter,
        selectStudent,
        updateStudent,
        toggleMilestoneComplete,
        verifySkillWithQuiz,
        resolveKnowledgeGap,
        activeQuizModal,
        openQuizModal,
        closeQuizModal,
        submitQuizAnswer,
        createEmptyStudent,
        resetToDefaults,
        notification,
        setNotification: showToast as any,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
