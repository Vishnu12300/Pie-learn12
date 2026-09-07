import React, { useState } from 'react';
import {
  FileText,
  Download,
  X,
  CheckCircle2,
  Calendar,
  User,
  GraduationCap,
  Award,
  Sparkles,
  FileCheck,
  Building,
} from 'lucide-react';
import { Student, LearningPath, StudentSkill } from '../../types';
import { generateRoadmapPdf } from '../../utils/pdfGenerator';

interface RoadmapPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  learningPath: LearningPath;
  studentSkills: StudentSkill[];
  onSuccess?: () => void;
}

export const RoadmapPdfModal: React.FC<RoadmapPdfModalProps> = ({
  isOpen,
  onClose,
  student,
  learningPath,
  studentSkills,
  onSuccess,
}) => {
  const [sessionNotes, setSessionNotes] = useState(
    `1. Target to complete active milestone (#${learningPath.milestones.find((m) => m.status === 'in-progress')?.stepOrder || 2}: ${learningPath.milestones.find((m) => m.status === 'in-progress')?.title || 'Core Frameworks'}) within 3 weeks.\n` +
    `2. Maintain continuous Anna University CGPA above ${Math.max(7.5, student.cgpa).toFixed(2)} to secure Tier-1 Super Dream campus placement eligibility.\n` +
    `3. Participate in weekly PIE Tech Maker Space & IoT sandbox hack-sessions on Fridays (3:30 PM - 5:00 PM).\n` +
    `4. Next milestone progress review scheduled with Faculty Mentor on: _________________`
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsGenerating(true);
    try {
      generateRoadmapPdf({
        student,
        learningPath,
        studentSkills,
        sessionNotes,
      });

      setDownloadSuccess(true);
      if (onSuccess) onSuccess();

      setTimeout(() => {
        setIsGenerating(false);
      }, 600);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      setIsGenerating(false);
    }
  };

  const completedCount = learningPath.completedMilestones;
  const totalCount = learningPath.totalMilestones;
  const progressPercent = Math.round((completedCount / (totalCount || 1)) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header with Institutional Crest styling */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-5 text-white rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shrink-0">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-white/25 text-white">
                  PIE TECH ACADEMIC DOSSIER
                </span>
                <span className="text-xs text-orange-100">
                  Anna University Affiliated
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Download Career Planning Roadmap (PDF)
              </h2>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs text-slate-600 flex-1">
          {/* Document Specifications Summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h3 className="text-xs font-bold text-slate-900 mb-2.5 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-orange-600" />
              <span>Document Metadata & Student Profile</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Candidate</span>
                <span className="font-bold text-slate-800">{student.fullName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Roll Number</span>
                <span className="font-bold text-slate-800 font-mono">{student.rollNo}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Department / Sem</span>
                <span className="font-bold text-slate-800">{student.department} · {student.semester}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Target Career</span>
                <span className="font-bold text-orange-600">{student.targetCareer}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Current Readiness</span>
                <span className="font-bold text-emerald-600">{student.readinessScore}% (Tier 1 Super Dream)</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Roadmap Milestones</span>
                <span className="font-bold text-slate-800">{completedCount}/{totalCount} Completed ({progressPercent}%)</span>
              </div>
            </div>
          </div>

          {/* Included Sections Checklist */}
          <div className="space-y-2">
            <span className="font-bold text-slate-900 block text-xs">
              Formatted PDF Sections Included:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Institutional PIE Tech Crest & Affiliation</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Competency & Weighted Skill-Gap Vector</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Ordered Step-by-Step Learning Milestones</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tri-Party Sign-Off (Student, Mentor, TPO)</span>
              </div>
            </div>
          </div>

          {/* Advisor & Placement Cell Notes */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-orange-600" />
                <span>Career Planning Session Mandate & Action Items:</span>
              </label>
              <button
                type="button"
                onClick={() =>
                  setSessionNotes(
                    `1. Target to complete active milestone (#${learningPath.milestones.find((m) => m.status === 'in-progress')?.stepOrder || 2}: ${learningPath.milestones.find((m) => m.status === 'in-progress')?.title || 'Core Frameworks'}) within 3 weeks.\n` +
                    `2. Maintain continuous Anna University CGPA above ${Math.max(7.5, student.cgpa).toFixed(2)} to secure Tier-1 Super Dream campus placement eligibility.\n` +
                    `3. Participate in weekly PIE Tech Maker Space & IoT sandbox hack-sessions on Fridays (3:30 PM - 5:00 PM).\n` +
                    `4. Next milestone progress review scheduled with Faculty Mentor on: _________________`
                  )
                }
                className="text-[11px] text-orange-600 hover:text-orange-700 font-semibold"
              >
                Reset Default
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              These points will appear in Section 3 of the official PDF dossier for review by your Faculty Academic Advisor and Placement Officer.
            </p>
            <textarea
              rows={4}
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-slate-50/50"
              placeholder="Enter specific academic mentor recommendations..."
            />
          </div>

          {downloadSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>PDF Document Downloaded Successfully!</strong> Check your browser downloads for{' '}
                <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono text-[10px]">
                  PIETech_Career_Roadmap_{student.rollNo}.pdf
                </code>
              </span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500 text-center sm:text-left">
            Ready for submission at Department Career Review & Placement Cell interviews.
          </span>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={isGenerating}
              className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Generating PDF...' : 'Download Formatted PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
