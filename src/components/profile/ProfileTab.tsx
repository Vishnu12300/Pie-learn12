import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Award,
  Mail,
  Calendar,
  Layers,
  Save,
  RotateCcw,
  Download,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DEPARTMENTS, TARGET_CAREERS } from '../../data/mockData';
import { Department, YearOfStudy, Semester, LearningStyle } from '../../types';
import { RoadmapPdfModal } from '../common/RoadmapPdfModal';

export const ProfileTab: React.FC = () => {
  const { currentStudent, learningPath, studentSkills, updateStudent, resetToDefaults, setNotification } = useApp();
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const [fullName, setFullName] = useState(currentStudent.fullName);
  const [rollNo, setRollNo] = useState(currentStudent.rollNo);
  const [email, setEmail] = useState(currentStudent.email || '');
  const [department, setDepartment] = useState<Department>(currentStudent.department);
  const [year, setYear] = useState<YearOfStudy>(currentStudent.year);
  const [semester, setSemester] = useState<Semester>(currentStudent.semester);
  const [cgpa, setCgpa] = useState<number>(currentStudent.cgpa);
  const [targetCareer, setTargetCareer] = useState<string>(currentStudent.targetCareer);
  const [learningStyle, setLearningStyle] = useState<LearningStyle>(currentStudent.learningStyle);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudent({
      fullName,
      rollNo,
      email,
      department,
      year,
      semester,
      cgpa,
      targetCareer,
      learningStyle,
    });
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentStudent, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `pietech_${currentStudent.rollNo}_profile.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setNotification({
      message: 'Student profile exported as JSON.',
      type: 'success',
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 font-bold text-lg flex items-center justify-center border border-orange-200">
              {currentStudent.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{currentStudent.fullName}</h2>
              <p className="text-xs text-slate-500 font-mono">
                {currentStudent.rollNo} · {currentStudent.department} · {currentStudent.year}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-semibold block">READINESS</span>
            <span className="text-xl font-black text-orange-600">
              {currentStudent.readinessScore}%
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Student Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Institutional Roll Number</label>
              <input
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">College Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Engineering Department</label>
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
              <label className="block font-semibold text-slate-700 mb-1">Year & Semester</label>
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
              <label className="block font-semibold text-slate-700 mb-1">Current Anna University CGPA</label>
              <input
                type="number"
                step="0.01"
                min="5.0"
                max="10.0"
                value={cgpa}
                onChange={(e) => setCgpa(parseFloat(e.target.value) || 7.5)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Career Pathway</label>
              <select
                value={targetCareer}
                onChange={(e) => setTargetCareer(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:border-orange-500"
              >
                {TARGET_CAREERS.map((c) => (
                  <option key={c.role} value={c.role}>
                    {c.role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pedagogical Learning Style</label>
              <select
                value={learningStyle}
                onChange={(e) => setLearningStyle(e.target.value as LearningStyle)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:border-orange-500"
              >
                <option value="Project-based">Project-based (Building Real-World Software)</option>
                <option value="Hands-on Labs">Hands-on Labs (Workstations & Maker Space)</option>
                <option value="Video Tutorials">Video Tutorials (Guided Courses)</option>
                <option value="Academic & Theoretical">Academic & Theoretical (GATE / Research)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportJson}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Export Record (JSON)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPdfModalOpen(true)}
                className="px-3.5 py-2 text-xs font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4 text-orange-600" />
                <span>Download Roadmap (PDF)</span>
              </button>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Institutional Note */}
      <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
        <div>
          <span className="font-bold text-slate-800">Pollachi Institute Academic Database:</span>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Synced with Anna University controller of examinations records for semester progression.
          </div>
        </div>
        <button
          onClick={resetToDefaults}
          className="text-orange-600 hover:underline font-semibold flex items-center gap-1 shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo</span>
        </button>
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
    </div>
  );
};
