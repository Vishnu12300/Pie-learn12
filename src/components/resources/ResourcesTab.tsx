import React, { useState } from 'react';
import {
  BookOpen,
  ExternalLink,
  Download,
  GraduationCap,
  FlaskConical,
  Code2,
  FileText,
  Video,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RoadmapPdfModal } from '../common/RoadmapPdfModal';

export const ResourcesTab: React.FC = () => {
  const { currentStudent, learningPath, studentSkills, setNotification } = useApp();
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const curatedResources = [
    {
      title: 'Anna University 2021 Regulation Curriculum & Syllabus',
      type: 'Curriculum PDF',
      icon: GraduationCap,
      category: 'Academic',
      description: 'Official Anna University B.E. / B.Tech course structures, elective lists, and evaluation criteria.',
      url: 'https://cac.annauniv.edu',
      badge: 'Official Syllabus',
    },
    {
      title: 'NPTEL SWAYAM Credit Transfer Course Catalog',
      type: 'Online Certifications',
      icon: Award,
      category: 'Certifications',
      description: 'Pre-approved 8-week and 12-week online courses eligible for credit transfer at PIE Tech.',
      url: 'https://nptel.ac.in',
      badge: 'Credit Eligible',
    },
    {
      title: 'PIE Tech Maker Space & IoT Lab Manuals',
      type: 'Lab Manual',
      icon: FlaskConical,
      category: 'Campus Lab',
      description: 'Schematics, STM32 pinout references, FreeRTOS quick-start guide, and ESP32 WiFi telemetry code.',
      url: 'https://pietech.edu.in',
      badge: 'PIE Tech Repository',
    },
    {
      title: 'NeetCode 150 Algorithmic Coding Practice Track',
      type: 'Interactive Coding',
      icon: Code2,
      category: 'Placement',
      description: 'Structured Data Structures & Algorithms problem roadmap categorized by patterns (Two Pointers, DP, Graphs).',
      url: 'https://neetcode.io',
      badge: 'Technical Interviews',
    },
    {
      title: 'System Design Primer & Scalable Architecture Blueprints',
      type: 'Engineering Guide',
      icon: FileText,
      category: 'Architecture',
      description: 'Comprehensive engineering guide for caching, microservices, load balancers, and distributed databases.',
      url: 'https://github.com/donnemartin/system-design-primer',
      badge: 'Open Source',
    },
    {
      title: 'PostgreSQL Deep Dive & Performance Optimization Handbook',
      type: 'Documentation',
      icon: BookOpen,
      category: 'Databases',
      description: 'Detailed guide to indexes, EXPLAIN plans, transactions, and relational schema normalization.',
      url: 'https://www.postgresql.org/docs',
      badge: 'Industry Standard',
    },
  ];

  const handleDownloadOfflineGuide = () => {
    setIsPdfModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-orange-100 text-orange-700">
              ACADEMIC REPOSITORY
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Anna University & PIE Tech Curated
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Learning Resources & Campus Lab Portals
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified study materials, laboratory manuals, question banks, and competitive coding roadmaps for {currentStudent.department}.
          </p>
        </div>

        <button
          onClick={handleDownloadOfflineGuide}
          className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download Roadmap & Study Dossier (PDF)</span>
        </button>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {curatedResources.map((res, idx) => {
          const Icon = res.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-orange-300 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-200/60">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {res.badge}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-3 line-clamp-2">
                  {res.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-3">
                  {res.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500">{res.category}</span>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1"
                >
                  <span>Access Material</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* PDF Export Modal */}
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
