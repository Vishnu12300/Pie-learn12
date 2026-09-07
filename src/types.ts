export type Department =
  | 'CSE'
  | 'ECE'
  | 'EEE'
  | 'MECH'
  | 'CIVIL'
  | 'AI_DS';

export type YearOfStudy = '1st Year' | '2nd Year' | '3rd Year' | 'Final Year';

export type Semester = 'Sem 1' | 'Sem 2' | 'Sem 3' | 'Sem 4' | 'Sem 5' | 'Sem 6' | 'Sem 7' | 'Sem 8';

export type LearningStyle =
  | 'Project-based'
  | 'Hands-on Labs'
  | 'Video Tutorials'
  | 'Academic & Theoretical';

export type PaceFilter = 'all' | 'fast-track' | 'deep-dive' | 'exam-prep';

export type MilestoneStatus = 'locked' | 'in-progress' | 'completed';
export type MilestoneDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Student {
  id: string;
  fullName: string;
  rollNo: string;
  department: Department;
  year: YearOfStudy;
  semester: Semester;
  cgpa: number;
  targetCareer: string;
  learningStyle: LearningStyle;
  readinessScore: number; // 0 - 100
  createdAt: string;
  avatarUrl?: string;
  email: string;
}

export interface Skill {
  id: string;
  name: string;
  domain: string;
  difficultyLevel: MilestoneDifficulty;
  category: 'core' | 'framework' | 'cloud' | 'problem_solving' | 'hardware' | 'soft_skills';
}

export interface StudentSkill {
  id: string;
  studentId: string;
  skillId: string;
  skillName: string;
  category: string;
  proficiencyLevel: number; // 0 - 100
  industryBenchmark: number; // 0 - 100
  verifiedByQuiz: boolean;
  quizScore?: number;
  lastAssessed: string;
  weight: number; // 0.1 to 1.0
}

export interface CareerBenchmark {
  role: string;
  department: Department;
  description: string;
  targetReadiness: number;
  expectedSalaryRange: string;
  skills: {
    skillId: string;
    skillName: string;
    category: string;
    targetScore: number;
    weight: number;
    isMandatory: boolean;
  }[];
}

export interface QuizQuestion {
  id: string;
  skillId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: MilestoneDifficulty;
}

export interface PathMilestone {
  id: string;
  pathId: string;
  stepOrder: number;
  title: string;
  description: string;
  category: string;
  estimatedWeeks: number;
  difficulty: MilestoneDifficulty;
  status: MilestoneStatus;
  relevancePercent: number;
  prerequisiteId?: string;
  prerequisiteTitle?: string;
  resourceUrl: string;
  resourceType: 'Video' | 'Documentation' | 'Interactive Lab' | 'Campus Lab';
  resourceTitle: string;
  isCompleted: boolean;
  completedAt?: string;
  quizQuestion?: QuizQuestion;
  practicalTask?: string;
  tag: 'Core' | 'Elective' | 'Project' | 'Certification';
}

export interface LearningPath {
  id: string;
  studentId: string;
  title: string;
  targetRole: string;
  pace: PaceFilter;
  totalMilestones: number;
  completedMilestones: number;
  estimatedTotalWeeks: number;
  status: 'active' | 'completed' | 'paused';
  milestones: PathMilestone[];
  lastUpdated: string;
}

export interface KnowledgeGapAlert {
  id: string;
  skillName: string;
  currentScore: number;
  requiredScore: number;
  reason: string;
  recommendation: string;
  prerequisiteMilestoneId?: string;
  severity: 'high' | 'medium' | 'low';
}

export interface FacultyMentor {
  id: string;
  name: string;
  title: string;
  department: string;
  specialization: string;
  email: string;
  availableHours: string;
  matchingScore: number;
}

export interface PIETechElective {
  code: string;
  title: string;
  department: Department;
  semester: string;
  credits: number;
  syllabusOverview: string;
  relevanceToTarget: number;
  instructor: string;
}

export interface CampusLabChallenge {
  id: string;
  title: string;
  facility: string; // e.g. "PIE Tech Maker Space & IoT Hub"
  deadline: string;
  participants: number;
  difficulty: MilestoneDifficulty;
  relevanceScore: number;
  badge: string;
}

export interface ReadinessTrajectoryPoint {
  week: number;
  dateLabel: string;
  projectedScore: number;
  actualScore?: number;
  hiringBenchmark: number; // 85%
  milestoneTitle?: string;
}
