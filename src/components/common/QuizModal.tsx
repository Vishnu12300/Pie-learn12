import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const QuizModal: React.FC = () => {
  const { activeQuizModal, closeQuizModal, submitQuizAnswer } = useApp();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  if (!activeQuizModal?.isOpen || !activeQuizModal.question) return null;

  const q = activeQuizModal.question;

  const handleSelect = (idx: number) => {
    if (submitted) return;
    setSelectedIndex(idx);
  };

  const handleConfirm = () => {
    if (selectedIndex === null) return;
    const correct = submitQuizAnswer(selectedIndex);
    setIsCorrect(correct);
    setSubmitted(true);
  };

  const handleClose = () => {
    setSelectedIndex(null);
    setSubmitted(false);
    setIsCorrect(false);
    closeQuizModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-orange-100 text-orange-700">
              PIE TECH CHECKPOINT VERIFICATION
            </span>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              Difficulty: {q.difficulty}
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            ✕
          </button>
        </div>

        <div className="py-4 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 leading-snug">
            {q.question}
          </h3>

          <div className="space-y-2">
            {q.options.map((opt, idx) => {
              const isChosen = selectedIndex === idx;
              let optionStyle = 'border-slate-200 bg-white hover:border-slate-300 text-slate-700';

              if (submitted) {
                if (idx === q.correctIndex) {
                  optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                } else if (isChosen && !isCorrect) {
                  optionStyle = 'border-red-500 bg-red-50 text-red-950 font-semibold';
                }
              } else if (isChosen) {
                optionStyle = 'border-orange-500 bg-orange-50 text-orange-950 font-bold';
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${optionStyle}`}
                >
                  <span>{opt}</span>
                  {submitted && idx === q.correctIndex && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  {submitted && isChosen && !isCorrect && (
                    <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          {submitted && (
            <div
              className={`p-3.5 rounded-xl border text-xs leading-relaxed animate-in fade-in ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5 mb-1">
                {isCorrect ? (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Checkpoint Passed! Verification Logged.</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span>Incorrect Option. Recommended Review:</span>
                  </>
                )}
              </div>
              <p>{q.explanation}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          {!submitted ? (
            <button
              disabled={selectedIndex === null}
              onClick={handleConfirm}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-40 transition-all flex items-center gap-1.5"
            >
              <span>Verify Answer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleClose}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
            >
              Close Checkpoint
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
