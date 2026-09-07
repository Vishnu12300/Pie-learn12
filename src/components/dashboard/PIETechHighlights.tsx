import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  FlaskConical,
  Users,
  Calendar,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  Mail,
  Award,
  ChevronRight,
} from 'lucide-react';
import {
  PIE_TECH_ELECTIVES,
  PIE_TECH_CAMPUS_CHALLENGES,
  PIE_TECH_FACULTY_MENTORS,
} from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export const PIETechHighlights: React.FC = () => {
  const { currentStudent, setNotification } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'electives' | 'labs' | 'mentors'>('electives');
  const [enrolledChallenges, setEnrolledChallenges] = useState<string[]>([]);
  const [contactModalMentor, setContactModalMentor] = useState<any | null>(null);

  const handleEnrollChallenge = (challengeId: string, title: string) => {
    if (enrolledChallenges.includes(challengeId)) {
      setEnrolledChallenges(enrolledChallenges.filter((id) => id !== challengeId));
      setNotification({
        message: `Withdrawn from "${title}"`,
        type: 'info',
      });
    } else {
      setEnrolledChallenges([...enrolledChallenges, challengeId]);
      setNotification({
        message: `Successfully registered for "${title}". PIE Tech lab slot assigned.`,
        type: 'success',
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-orange-100 text-orange-700 tracking-wider">
              POLLACHI INSTITUTE TAILORED
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Department & Campus Ecosystem
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Internal electives, Maker Space lab hackathons, and mentors for {currentStudent.department} · {currentStudent.targetCareer}
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('electives')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'electives'
                ? 'bg-white text-orange-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Electives</span>
          </button>
          <button
            onClick={() => setActiveSubTab('labs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'labs'
                ? 'bg-white text-orange-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Campus Labs</span>
          </button>
          <button
            onClick={() => setActiveSubTab('mentors')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'mentors'
                ? 'bg-white text-orange-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Faculty Mentors</span>
          </button>
        </div>
      </div>

      {/* Sub-tab 1: Recommended Electives */}
      {activeSubTab === 'electives' && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {PIE_TECH_ELECTIVES.map((elec) => (
            <div
              key={elec.code}
              className="p-4 rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50/20 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                      {elec.code}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1.5">
                      {elec.title}
                    </h4>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {elec.relevanceToTarget}% Match
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{elec.credits} Credits</div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                  {elec.syllabusOverview}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="truncate">Instructor: <strong className="text-slate-700">{elec.instructor}</strong></span>
                <span className="text-[11px] text-slate-400">{elec.semester}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sub-tab 2: Campus Innovation Labs */}
      {activeSubTab === 'labs' && (
        <div className="mt-4 space-y-3">
          {PIE_TECH_CAMPUS_CHALLENGES.map((challenge) => {
            const isEnrolled = enrolledChallenges.includes(challenge.id);
            return (
              <div
                key={challenge.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-orange-200 bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                      {challenge.badge}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Deadline: {challenge.deadline}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {challenge.title}
                  </h4>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1 text-slate-600">
                      <FlaskConical className="w-3.5 h-3.5 text-orange-600" />
                      {challenge.facility}
                    </span>
                    <span>{challenge.participants} students active</span>
                  </div>
                </div>

                <button
                  onClick={() => handleEnrollChallenge(challenge.id, challenge.title)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    isEnrolled
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100'
                  }`}
                >
                  {isEnrolled ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Slot Reserved</span>
                    </>
                  ) : (
                    <>
                      <span>Join Challenge</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Sub-tab 3: Faculty Mentors */}
      {activeSubTab === 'mentors' && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {PIE_TECH_FACULTY_MENTORS.map((mentor) => (
            <div
              key={mentor.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-orange-300 bg-white transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{mentor.name}</h4>
                    <p className="text-xs text-orange-700 font-medium">{mentor.title} · {mentor.department}</p>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                    {mentor.matchingScore}% Match
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-2">
                  Specialization: <span className="font-semibold text-slate-800">{mentor.specialization}</span>
                </p>
                <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{mentor.availableHours}</span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 truncate max-w-[150px]">{mentor.email}</span>
                <button
                  onClick={() => setContactModalMentor(mentor)}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  <span>Request Advisory</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mentor Advisory Modal */}
      {contactModalMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Book Consultation with {contactModalMentor.name}
              </h3>
              <button
                onClick={() => setContactModalMentor(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs text-slate-600">
              <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 text-orange-900">
                <div className="font-bold">Institutional Office Hours:</div>
                <div className="mt-0.5">{contactModalMentor.availableHours}</div>
              </div>
              <p>
                You are requesting pathway guidance regarding your target career:{' '}
                <strong className="text-slate-900">{currentStudent.targetCareer}</strong>.
              </p>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Topic of Discussion / Prerequisite Doubts:
                </label>
                <textarea
                  rows={3}
                  defaultValue={`Dear ${contactModalMentor.name}, I would like advice on closing my skill gaps in ${currentStudent.targetCareer} and selecting final semester project topics.`}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-xs"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setContactModalMentor(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setContactModalMentor(null);
                  setNotification({
                    message: `Advisory meeting requested with ${contactModalMentor.name}. PIE Tech intranet notification dispatched.`,
                    type: 'success',
                  });
                }}
                className="px-4 py-2 text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-xs"
              >
                Send Request via PIE Tech Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
