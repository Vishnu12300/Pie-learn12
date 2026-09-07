/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { OverviewTab } from './components/dashboard/OverviewTab';
import { RoadmapTab } from './components/roadmap/RoadmapTab';
import { AssessmentTab } from './components/assessment/AssessmentTab';
import { CareerPredictorTab } from './components/career/CareerPredictorTab';
import { ResourcesTab } from './components/resources/ResourcesTab';
import { DatabaseTab } from './components/database/DatabaseTab';
import { ProfileTab } from './components/profile/ProfileTab';
import { QuizModal } from './components/common/QuizModal';
import { GraduationCap, ShieldCheck, Database, Compass, Award } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentTab, setCurrentTab, currentStudent } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Institutional Navigation Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'dashboard' && <OverviewTab />}
        {currentTab === 'roadmap' && <RoadmapTab />}
        {currentTab === 'assessment' && <AssessmentTab />}
        {currentTab === 'career' && <CareerPredictorTab />}
        {currentTab === 'resources' && <ResourcesTab />}
        {currentTab === 'database' && <DatabaseTab />}
        {currentTab === 'profile' && <ProfileTab />}
      </main>

      {/* Institutional Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black text-sm shadow-sm shrink-0">
                PIE
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-900">
                  Pollachi Institute of Engineering and Technology
                </div>
                <p className="text-[11px] text-slate-500">
                  Affiliated to Anna University, Chennai · Approved by AICTE, New Delhi · Pollachi, Tamil Nadu - 642205
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
              <button
                onClick={() => setCurrentTab('database')}
                className="hover:text-orange-600 transition-colors flex items-center gap-1"
              >
                <Database className="w-3.5 h-3.5" />
                <span>PostgreSQL Schema</span>
              </button>
              <button
                onClick={() => setCurrentTab('roadmap')}
                className="hover:text-orange-600 transition-colors flex items-center gap-1"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Roadmap Engine</span>
              </button>
              <button
                onClick={() => setCurrentTab('assessment')}
                className="hover:text-orange-600 transition-colors flex items-center gap-1"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Skill Diagnostic</span>
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <div>
              &copy; {new Date().getFullYear()} Pollachi Institute of Engineering & Technology (PIE Tech). Career Recommendation Architecture v2.4.
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Multi-axis Vectorizer Active</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Checkpoint Quiz Modal */}
      <QuizModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
