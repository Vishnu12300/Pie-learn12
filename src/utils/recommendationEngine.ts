import {
  Student,
  StudentSkill,
  CareerBenchmark,
  LearningPath,
  PathMilestone,
  KnowledgeGapAlert,
  ReadinessTrajectoryPoint,
  PaceFilter,
} from '../types';
import { CAREER_BENCHMARKS } from '../data/mockData';

export interface VectorizerResult {
  overallMatchPercentage: number;
  weightedReadinessScore: number;
  skillGaps: {
    skillId: string;
    skillName: string;
    category: string;
    currentScore: number;
    targetScore: number;
    gap: number;
    weight: number;
    isCritical: boolean;
  }[];
  criticalBlockers: string[];
  recommendedElectiveCodes: string[];
}

/**
 * 1. Weighted Skill-Gap Vectorizer
 * Compares student's current proficiency vector against industry target benchmarks
 */
export function calculateWeightedSkillGaps(
  studentSkills: StudentSkill[],
  targetRole: string
): VectorizerResult {
  const benchmark = CAREER_BENCHMARKS[targetRole];
  if (!benchmark) {
    // Default fallback
    return {
      overallMatchPercentage: 70,
      weightedReadinessScore: 70,
      skillGaps: [],
      criticalBlockers: [],
      recommendedElectiveCodes: ['CS8080'],
    };
  }

  let totalWeight = 0;
  let weightedEarned = 0;
  const criticalBlockers: string[] = [];

  const skillGaps = benchmark.skills.map((benchSkill) => {
    const studentSkill = studentSkills.find((s) => s.skillId === benchSkill.skillId);
    const currentScore = studentSkill ? studentSkill.proficiencyLevel : 20; // default baseline if not assessed
    const gap = Math.max(0, benchSkill.targetScore - currentScore);

    // Contribution to readiness score
    const ratio = Math.min(1, currentScore / benchSkill.targetScore);
    weightedEarned += ratio * benchSkill.weight * 100;
    totalWeight += benchSkill.weight;

    const isCritical = benchSkill.isMandatory && gap >= 15;
    if (isCritical) {
      criticalBlockers.push(benchSkill.skillName);
    }

    return {
      skillId: benchSkill.skillId,
      skillName: benchSkill.skillName,
      category: benchSkill.category,
      currentScore,
      targetScore: benchSkill.targetScore,
      gap,
      weight: benchSkill.weight,
      isCritical,
    };
  });

  const rawWeightedScore = totalWeight > 0 ? Math.round(weightedEarned / totalWeight) : 60;
  const overallMatchPercentage = Math.min(100, Math.max(0, rawWeightedScore));

  const recommendedElectiveCodes =
    targetRole.includes('Embedded') || targetRole.includes('IoT')
      ? ['EC8702']
      : targetRole.includes('Full-Stack') || targetRole.includes('Cloud')
      ? ['CS8080', 'IT8076']
      : ['CS8083'];

  return {
    overallMatchPercentage,
    weightedReadinessScore: rawWeightedScore,
    skillGaps,
    criticalBlockers,
    recommendedElectiveCodes,
  };
}

/**
 * 2. Predictive Career Readiness Score (0 - 100%)
 * Analyzes test scores, completed milestones, project verifications, and CGPA coursework
 */
export function calculatePredictiveReadinessScore(
  student: Student,
  studentSkills: StudentSkill[],
  learningPath?: LearningPath
): number {
  const vectorizer = calculateWeightedSkillGaps(studentSkills, student.targetCareer);
  
  // Weights:
  // 1. Skill Proficiencies (Vector Match) = 45%
  const skillComponent = vectorizer.overallMatchPercentage * 0.45;

  // 2. Quiz Verifications & Confidence = 20%
  const verifiedSkills = studentSkills.filter((s) => s.verifiedByQuiz);
  const quizAvg =
    verifiedSkills.length > 0
      ? verifiedSkills.reduce((acc, s) => acc + (s.quizScore || s.proficiencyLevel), 0) /
        verifiedSkills.length
      : 55;
  const quizComponent = quizAvg * 0.20;

  // 3. Roadmap Milestones Completed = 20%
  let milestoneRatio = 0.5;
  if (learningPath && learningPath.totalMilestones > 0) {
    milestoneRatio = learningPath.completedMilestones / learningPath.totalMilestones;
  }
  const milestoneComponent = milestoneRatio * 100 * 0.20;

  // 4. Academic Coursework / CGPA Baseline (scale 0 - 10) = 15%
  const cgpaComponent = (student.cgpa / 10) * 100 * 0.15;

  const finalScore = Math.round(
    skillComponent + quizComponent + milestoneComponent + cgpaComponent
  );

  return Math.min(99, Math.max(15, finalScore));
}

/**
 * 3. Dynamic Knowledge Gap & Adaptive Re-routing Engine
 * Detects prerequisite knowledge shortages before starting upcoming milestones
 */
export function detectKnowledgeGaps(
  studentSkills: StudentSkill[],
  learningPath: LearningPath
): KnowledgeGapAlert[] {
  const alerts: KnowledgeGapAlert[] = [];

  // Inspect in-progress or next milestone
  const activeMilestone = learningPath.milestones.find((m) => m.status === 'in-progress');

  if (activeMilestone) {
    if (activeMilestone.title.includes('Docker') || activeMilestone.title.includes('Containerization')) {
      const dockerSkill = studentSkills.find((s) => s.skillId === 's_docker');
      if (dockerSkill && dockerSkill.proficiencyLevel < 65) {
        alerts.push({
          id: 'gap_auto_docker',
          skillName: 'Docker & Multi-stage Containers',
          currentScore: dockerSkill.proficiencyLevel,
          requiredScore: 70,
          reason: `Critical knowledge gap before starting "${activeMilestone.title}"`,
          recommendation:
            'Review Dockerfile layers, bind mounts, and container network isolation in PIE Tech Cloud Sandbox.',
          prerequisiteMilestoneId: activeMilestone.id,
          severity: 'high',
        });
      }
    }

    if (activeMilestone.title.includes('React') || activeMilestone.title.includes('Frontend')) {
      const jsSkill = studentSkills.find((s) => s.skillId === 's_js_ts');
      if (jsSkill && jsSkill.proficiencyLevel < 80) {
        alerts.push({
          id: 'gap_auto_js',
          skillName: 'JavaScript ES6+ Closures & Async/Await',
          currentScore: jsSkill.proficiencyLevel,
          requiredScore: 85,
          reason: 'Essential prerequisite before state machine architecture in React',
          recommendation:
            'Brush up on Promise chaining, Event Loop microtasks, and object destructuring before tackling React 19 hooks.',
          prerequisiteMilestoneId: activeMilestone.id,
          severity: 'high',
        });
      }
    }

    if (activeMilestone.title.includes('FreeRTOS') || activeMilestone.title.includes('RTOS')) {
      const rtosSkill = studentSkills.find((s) => s.skillId === 's_rtos');
      if (rtosSkill && rtosSkill.proficiencyLevel < 60) {
        alerts.push({
          id: 'gap_auto_rtos',
          skillName: 'FreeRTOS Task Scheduling & Queues',
          currentScore: rtosSkill.proficiencyLevel,
          requiredScore: 75,
          reason: 'Severe gap: High risk of deadlocks in multi-threaded firmware',
          recommendation:
            'Practice mutexes and binary semaphore signaling in the PIE Tech Embedded Systems Lab simulator.',
          prerequisiteMilestoneId: activeMilestone.id,
          severity: 'high',
        });
      }
    }
  }

  return alerts;
}

/**
 * 4. Generate Weekly Trajectory Meter Projection
 * Generates 16-24 week readiness velocity projection
 */
export function generateReadinessTrajectory(
  currentScore: number,
  learningPath: LearningPath
): ReadinessTrajectoryPoint[] {
  const points: ReadinessTrajectoryPoint[] = [];
  const totalWeeks = learningPath.estimatedTotalWeeks || 16;
  const currentWeekIndex = Math.min(
    totalWeeks,
    Math.round((learningPath.completedMilestones / (learningPath.totalMilestones || 1)) * totalWeeks)
  );

  const startScore = Math.max(30, currentScore - (learningPath.completedMilestones * 7));
  const stepGrowth = (92 - currentScore) / Math.max(1, totalWeeks - currentWeekIndex);

  const today = new Date('2026-09-05');

  for (let w = 0; w <= totalWeeks; w += 2) {
    const d = new Date(today);
    d.setDate(d.getDate() + (w - currentWeekIndex) * 7);
    const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    let projected: number;
    let actual: number | undefined = undefined;

    if (w <= currentWeekIndex) {
      // Historical or current progress
      const progressFraction = w / (currentWeekIndex || 1);
      actual = Math.round(startScore + progressFraction * (currentScore - startScore));
      projected = actual;
    } else {
      // Projected progress
      const weeksAhead = w - currentWeekIndex;
      projected = Math.min(96, Math.round(currentScore + weeksAhead * stepGrowth));
    }

    // Match milestone milestones
    const matchingMilestone = learningPath.milestones.find(
      (m) => Math.abs(m.stepOrder * (totalWeeks / learningPath.milestones.length) - w) < 1.5
    );

    points.push({
      week: w,
      dateLabel,
      projectedScore: projected,
      actualScore: actual,
      hiringBenchmark: 85,
      milestoneTitle: matchingMilestone?.title,
    });
  }

  return points;
}

/**
 * 5. Adaptive Re-routing: Filters and re-orders milestones based on Pace Filter
 */
export function filterMilestonesByPace(
  milestones: PathMilestone[],
  pace: PaceFilter
): PathMilestone[] {
  if (pace === 'all') return milestones;

  if (pace === 'fast-track') {
    // Only core critical milestones and projects
    return milestones.filter(
      (m) => m.tag === 'Core' || m.tag === 'Project' || m.stepOrder <= 5
    );
  }

  if (pace === 'deep-dive') {
    // All milestones including elective research and full capstones
    return milestones;
  }

  if (pace === 'exam-prep') {
    // Milestones with academic, core CS, and technical interview focus
    return milestones.filter(
      (m) => m.category === 'Core CS' || m.category === 'Languages' || m.category === 'Databases' || m.tag === 'Core'
    );
  }

  return milestones;
}
