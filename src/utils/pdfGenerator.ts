import { jsPDF } from 'jspdf';
import { Student, StudentSkill, LearningPath, PathMilestone } from '../types';
import { calculateWeightedSkillGaps } from './recommendationEngine';

interface GenerateRoadmapPdfOptions {
  student: Student;
  learningPath: LearningPath;
  studentSkills: StudentSkill[];
  sessionNotes?: string;
}

/**
 * Generates and downloads a beautifully formatted, official PDF document
 * of the student's personalized learning roadmap for career planning sessions.
 */
export function generateRoadmapPdf({
  student,
  learningPath,
  studentSkills,
  sessionNotes,
}: GenerateRoadmapPdfOptions): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const primaryColor = [234, 88, 12]; // PIE Tech Orange #EA580C
  const darkColor = [15, 23, 42]; // Slate 900
  const grayColor = [100, 116, 139]; // Slate 500
  const lightBgColor = [248, 250, 252]; // Slate 50
  const borderColor = [226, 232, 240]; // Slate 200
  const accentGreen = [22, 163, 74]; // Emerald 600

  const vectorResult = calculateWeightedSkillGaps(studentSkills, student.targetCareer);

  // Helper to add page header & footer
  const addPageHeaderAndFooter = (pageNum: number, totalPages: number) => {
    // Header line
    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, 10, pageWidth - margin, 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.text(
      'POLLACHI INSTITUTE OF ENGINEERING AND TECHNOLOGY · CAREER PLANNING DOSSIER',
      margin,
      8.5
    );

    const docId = `REF: PIE-CP-${student.rollNo}-${new Date().getFullYear()}`;
    doc.text(docId, pageWidth - margin - doc.getTextWidth(docId), 8.5);

    // Footer
    doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);
    doc.text(
      'Pollachi - 642205, Tamil Nadu | Affiliated to Anna University | Approved by AICTE | pietech.edu.in',
      margin,
      pageHeight - 7
    );
    const pageStr = `Page ${pageNum} of ${totalPages}`;
    doc.text(pageStr, pageWidth - margin - doc.getTextWidth(pageStr), pageHeight - 7);
  };

  // Helper to check for page break
  const ensureSpace = (neededHeight: number): void => {
    if (y + neededHeight > pageHeight - 18) {
      doc.addPage();
      y = 16;
    }
  };

  // ==========================================
  // 1. INSTITUTIONAL CREST & HEADER BANNER
  // ==========================================
  // Header background bar
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'F');

  // Institution text in banner
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('POLLACHI INSTITUTE OF ENGINEERING AND TECHNOLOGY', margin + 6, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(
    'Affiliated to Anna University, Chennai · Approved by AICTE, New Delhi · Pollachi, TN - 642205',
    margin + 6,
    y + 13
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('INTERNAL QUALITY ASSURANCE CELL & PLACEMENT TRAINING DIVISION', margin + 6, y + 19);

  // Crest Pill on right
  const crestText = 'PIE TECH';
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(pageWidth - margin - 26, y + 4.5, 20, 15, 2, 2, 'F');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(crestText, pageWidth - margin - 24, y + 13.5);

  y += 28;

  // Title Block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('PERSONALIZED LEARNING ROADMAP & CAREER DOSSIER', margin, y);

  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  const dateStr = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  doc.text(`Official Academic & Placement Review Report · Generated on: ${dateStr}`, margin, y);

  y += 6;

  // ==========================================
  // 2. STUDENT ACADEMIC PROFILE CARD
  // ==========================================
  const profileCardHeight = 36;
  doc.setFillColor(lightBgColor[0], lightBgColor[1], lightBgColor[2]);
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, profileCardHeight, 2, 2, 'FD');

  // Left column: Student credentials
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('STUDENT CREDENTIALS', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);

  const leftX = margin + 4;
  const colW = (contentWidth - 8) / 3;

  // Column 1
  doc.text(`Full Name:`, leftX, y + 12);
  doc.setFont('helvetica', 'bold');
  doc.text(`${student.fullName}`, leftX + 18, y + 12);
  doc.setFont('helvetica', 'normal');

  doc.text(`Roll Number:`, leftX, y + 18);
  doc.setFont('helvetica', 'bold');
  doc.text(`${student.rollNo}`, leftX + 18, y + 18);
  doc.setFont('helvetica', 'normal');

  doc.text(`Department:`, leftX, y + 24);
  doc.setFont('helvetica', 'bold');
  doc.text(`${student.department} Engineering`, leftX + 18, y + 24);
  doc.setFont('helvetica', 'normal');

  doc.text(`Year & Sem:`, leftX, y + 30);
  doc.setFont('helvetica', 'bold');
  doc.text(`${student.year} · ${student.semester}`, leftX + 18, y + 30);
  doc.setFont('helvetica', 'normal');

  // Column 2
  const col2X = leftX + colW;
  doc.text(`Current CGPA:`, col2X, y + 12);
  doc.setFont('helvetica', 'bold');
  doc.text(`${student.cgpa.toFixed(2)} / 10.0 (Anna Univ)`, col2X + 22, y + 12);
  doc.setFont('helvetica', 'normal');

  doc.text(`Learning Style:`, col2X, y + 18);
  doc.setFont('helvetica', 'bold');
  doc.text(`${student.learningStyle}`, col2X + 22, y + 18);
  doc.setFont('helvetica', 'normal');

  doc.text(`Target Career:`, col2X, y + 24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`${student.targetCareer}`, col2X + 22, y + 24);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFont('helvetica', 'normal');

  doc.text(`College Email:`, col2X, y + 30);
  doc.setFont('helvetica', 'bold');
  doc.text(`${student.email || `${student.rollNo.toLowerCase()}@pietech.edu.in`}`, col2X + 22, y + 30);
  doc.setFont('helvetica', 'normal');

  // Column 3: Readiness Badge
  const col3X = leftX + colW * 2;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.roundedRect(col3X + 4, y + 5, colW - 8, 26, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('CAREER READINESS', col3X + 8, y + 11);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text(`${student.readinessScore}%`, col3X + 8, y + 19);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(accentGreen[0], accentGreen[1], accentGreen[2]);
  const placementTier =
    student.readinessScore >= 80
      ? 'Tier 1 Super Dream (8-12 LPA)'
      : student.readinessScore >= 70
      ? 'Tier 2 Dream Core (5-8 LPA)'
      : 'Tier 3 Day-1 Placement Track';
  doc.text(placementTier, col3X + 8, y + 26);

  y += profileCardHeight + 6;

  // ==========================================
  // 3. SKILL GAP VECTOR SUMMARY TABLE
  // ==========================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('1. COMPETENCY MATRIX & SKILL VECTOR EVALUATION', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  const vectorSub = `Vector Match Index: ${vectorResult.overallMatchPercentage}% | Benchmarked against PIE Tech Campus Placement Standards for ${student.targetCareer}`;
  doc.text(vectorSub, margin + 85, y);

  y += 4;

  // Skill Table Header
  const skillHeaderHeight = 6;
  doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.rect(margin, y, contentWidth, skillHeaderHeight, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('Evaluated Domain / Skill', margin + 3, y + 4.2);
  doc.text('Category', margin + 65, y + 4.2);
  doc.text('Evaluated Score', margin + 105, y + 4.2);
  doc.text('Industry Benchmark', margin + 135, y + 4.2);
  doc.text('Verification Status', margin + 165, y + 4.2);

  y += skillHeaderHeight;

  // Skill rows (show evaluated skills)
  const displaySkills = studentSkills.slice(0, 6);
  displaySkills.forEach((sk, idx) => {
    const rowHeight = 5.5;
    if (idx % 2 === 0) {
      doc.setFillColor(lightBgColor[0], lightBgColor[1], lightBgColor[2]);
      doc.rect(margin, y, contentWidth, rowHeight, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text(sk.skillName, margin + 3, y + 4);
    doc.text(sk.category, margin + 65, y + 4);

    // Score
    doc.setFont('helvetica', 'bold');
    doc.text(`${sk.proficiencyLevel}%`, margin + 107, y + 4);
    doc.setFont('helvetica', 'normal');
    doc.text(`${sk.industryBenchmark}%`, margin + 137, y + 4);

    // Status
    if (sk.verifiedByQuiz) {
      doc.setTextColor(accentGreen[0], accentGreen[1], accentGreen[2]);
      doc.text('Verified (Diagnostic Quiz)', margin + 165, y + 4);
    } else if (sk.proficiencyLevel >= sk.industryBenchmark) {
      doc.setTextColor(accentGreen[0], accentGreen[1], accentGreen[2]);
      doc.text('Satisfactory Benchmark', margin + 165, y + 4);
    } else {
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(`Deficit (-${sk.industryBenchmark - sk.proficiencyLevel}%)`, margin + 165, y + 4);
    }

    y += rowHeight;
  });

  y += 5;

  // ==========================================
  // 4. THE ROADMAP MILESTONES (THE CORE FEATURE)
  // ==========================================
  ensureSpace(20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('2. STEP-BY-STEP LEARNING ROADMAP & VERIFIED MILESTONES', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  const paceLabel = `Pace: ${learningPath.pace.toUpperCase()} | ${learningPath.completedMilestones} of ${learningPath.totalMilestones} Milestones Completed (${Math.round((learningPath.completedMilestones / (learningPath.totalMilestones || 1)) * 100)}%)`;
  doc.text(paceLabel, margin + 105, y);

  y += 4;

  // Roadmap Table Header
  const roadHeaderH = 6;
  doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.rect(margin, y, contentWidth, roadHeaderH, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('#', margin + 2, y + 4.2);
  doc.text('Milestone & Learning Objectives', margin + 8, y + 4.2);
  doc.text('Category', margin + 90, y + 4.2);
  doc.text('Difficulty', margin + 115, y + 4.2);
  doc.text('Est. Time', margin + 135, y + 4.2);
  doc.text('Status', margin + 155, y + 4.2);

  y += roadHeaderH;

  // Milestones rows
  learningPath.milestones.forEach((m) => {
    // Height calculation based on description length
    const descLines = doc.splitTextToSize(m.description, 78);
    const lineCount = descLines.length;
    const itemHeight = Math.max(12, 6 + lineCount * 3.2 + (m.practicalTask ? 5 : 0));

    ensureSpace(itemHeight + 2);

    // Row border
    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    doc.setLineWidth(0.2);
    doc.line(margin, y, margin + contentWidth, y);

    // Background highlight for active/in-progress or completed
    if (m.isCompleted) {
      doc.setFillColor(240, 253, 244); // light green
      doc.rect(margin, y, contentWidth, itemHeight, 'F');
    } else if (m.status === 'in-progress') {
      doc.setFillColor(255, 247, 237); // light orange
      doc.rect(margin, y, contentWidth, itemHeight, 'F');
    }

    // Step Order
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text(`${m.stepOrder}`, margin + 2, y + 4.5);

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(m.isCompleted ? accentGreen[0] : darkColor[0], m.isCompleted ? accentGreen[1] : darkColor[1], m.isCompleted ? accentGreen[2] : darkColor[2]);
    doc.text(m.title, margin + 8, y + 4.5);

    // Description lines
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    let textY = y + 8;
    descLines.forEach((line: string) => {
      doc.text(line, margin + 8, textY);
      textY += 3;
    });

    // Practical verification task line if present
    if (m.practicalTask) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(6.5);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(`[PIE Tech Lab Verification] ${m.practicalTask}`, margin + 8, textY + 1);
    }

    // Category
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text(m.category, margin + 90, y + 4.5);

    // Difficulty
    doc.text(m.difficulty, margin + 115, y + 4.5);

    // Est. Time
    doc.text(`${m.estimatedWeeks} wks`, margin + 135, y + 4.5);

    // Status
    if (m.isCompleted) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(accentGreen[0], accentGreen[1], accentGreen[2]);
      doc.text('[x] Completed', margin + 155, y + 4.5);
    } else if (m.status === 'in-progress') {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('[>] In-Progress', margin + 155, y + 4.5);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.text('[ ] Pending', margin + 155, y + 4.5);
    }

    y += itemHeight;
  });

  // Table bottom border
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.line(margin, y, margin + contentWidth, y);

  y += 6;

  // ==========================================
  // 5. CAREER PLANNING SESSION ACTION PLAN & ADVISOR NOTES
  // ==========================================
  ensureSpace(42);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('3. CAREER COUNSELING ACTION PLAN & ADVISOR RECOMMENDATIONS', margin, y);
  y += 4;

  const notesHeight = 24;
  doc.setFillColor(lightBgColor[0], lightBgColor[1], lightBgColor[2]);
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.roundedRect(margin, y, contentWidth, notesHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('FACULTY ADVISOR & PLACEMENT CELL MANDATE:', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);

  const defaultMandate = sessionNotes || 
    `1. Target to complete in-progress milestone #${learningPath.milestones.find((m) => m.status === 'in-progress')?.stepOrder || 2} within 3 weeks and submit lab codebase to PIE Tech evaluator.\n` +
    `2. Maintain continuous Anna University CGPA above ${Math.max(7.5, student.cgpa).toFixed(2)} to qualify for Tier-1 Super Dream campus placements.\n` +
    `3. Attend weekly PIE Tech Maker Space & IoT lab sprint sessions every Friday (3:30 PM - 5:00 PM).\n` +
    `4. Next milestone progress review scheduled with Department Placement Coordinator on: _______________`;

  const mandateLines = doc.splitTextToSize(defaultMandate, contentWidth - 8);
  let mandY = y + 9.5;
  mandateLines.forEach((mLine: string) => {
    doc.text(mLine, margin + 4, mandY);
    mandY += 3.2;
  });

  y += notesHeight + 6;

  // ==========================================
  // 6. OFFICIAL SIGNATURE SIGN-OFF BLOCK
  // ==========================================
  ensureSpace(25);

  const sigColW = contentWidth / 3;
  const sigY = y + 14;

  doc.setDrawColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.setLineWidth(0.3);

  // Sig 1
  doc.line(margin + 4, sigY, margin + sigColW - 6, sigY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('Student Signature', margin + 4, sigY + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text(`${student.fullName} (${student.rollNo})`, margin + 4, sigY + 7);

  // Sig 2
  doc.line(margin + sigColW + 4, sigY, margin + sigColW * 2 - 6, sigY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('Faculty Academic Mentor / HOD', margin + sigColW + 4, sigY + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text(`Department of ${student.department}`, margin + sigColW + 4, sigY + 7);

  // Sig 3
  doc.line(margin + sigColW * 2 + 4, sigY, margin + contentWidth - 4, sigY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('Training & Placement Officer (TPO)', margin + sigColW * 2 + 4, sigY + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text('PIE Tech Placement Cell, Pollachi', margin + sigColW * 2 + 4, sigY + 7);

  // ==========================================
  // 7. FINALIZE & ADD HEADERS / FOOTERS
  // ==========================================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addPageHeaderAndFooter(i, totalPages);
  }

  // Save the document with clean naming convention
  const fileName = `PIETech_Career_Roadmap_${student.rollNo}_${student.targetCareer.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  doc.save(fileName);
}
