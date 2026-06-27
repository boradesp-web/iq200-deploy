import React, { useState, useEffect, useRef } from 'react';
import { Clock, ArrowLeft, ArrowRight, CheckCircle2, HelpCircle } from 'lucide-react';
import { Quiz, Question } from '../types';

interface QuizSessionProps {
  quiz: Quiz;
  onCancel: () => void;
  onSubmit: (answers: { [questionId: string]: number }) => void;
}

export default function QuizSession({ quiz, onCancel, onSubmit }: QuizSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [qId: string]: number }>({});
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit || 600);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Tick timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          // Auto submit
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const selectOption = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  const activeQuestion = quiz.questions[currentIndex];
  const percentComplete = Math.round(((currentIndex + 1) / quiz.questions.length) * 100);

  // Formatting seconds into MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${String(remaining).padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Quiz Top Action Banner */}
      <div className="bg-slate-900 rounded-2xl p-5 sm:p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg text-left">
        <div className="space-y-1">
          <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{quiz.subcategory}</span>
          <h2 className="text-lg font-extrabold tracking-tight leading-snug">{quiz.title}</h2>
          <p className="text-[10px] text-slate-300 font-semibold">{quiz.classLevel} standards test. Minimum 6/10 items required to claim certificate.</p>
        </div>

        {/* Live ticking timer representation */}
        <div className="flex items-center gap-2 bg-indigo-600 px-4.5 py-2 rounded-xl border border-indigo-400/20 shrink-0">
          <Clock className="w-4 h-4 text-indigo-100 animate-pulse" />
          <span className="font-mono font-bold text-sm tracking-widest text-emerald-100">
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>

      {/* Progress status bar representing tracking index */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
          style={{ width: `${percentComplete}%` }}
        ></div>
      </div>

      {/* Question Main and Nav sections split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Number trackers list grid Left/Right panel */}
        <div className="lg:col-span-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-left">
          <span className="text-[9px] font-extrabold uppercase text-slate-400 db select-none block mb-3">Questions list Grid</span>
          <div className="grid grid-cols-5 gap-2">
            {quiz.questions.map((q, idx) => {
              const answered = answers[q.id] !== undefined;
              const isSelected = idx === currentIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-10 h-10 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                    isSelected 
                      ? 'bg-indigo-600 text-white shadow'
                      : answered
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <button
            onClick={onCancel}
            className="w-full text-center mt-6 text-[10px] text-red-600 font-bold tracking-wider hover:underline block uppercase"
          >
            Abort Test Section
          </button>
        </div>

        {/* Question detail card Right/Main Panel */}
        <div className="lg:col-span-9 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 text-left">
          
          <div className="flex items-center gap-3">
            <span className="bg-indigo-150 text-indigo-700 font-extrabold px-3 py-1 text-xs rounded-xl">
              Q{currentIndex + 1}
            </span>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Category: {activeQuestion.subjectCategory} • Level: {activeQuestion.difficulty}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed font-sans pre-line">
            {activeQuestion.questionText}
          </h3>

          {/* Option elements list row */}
          <div className="grid grid-cols-1 gap-3.5 pt-4">
            {activeQuestion.options.map((opt, oIdx) => {
              const isSelected = answers[activeQuestion.id] === oIdx;
              const letterIndex = ['A', 'B', 'C', 'D'][oIdx];

              return (
                <button
                  key={oIdx}
                  onClick={() => selectOption(activeQuestion.id, oIdx)}
                  className={`w-full p-4 text-left rounded-2xl text-xs sm:text-sm font-semibold border flex items-center justify-between group transition-all ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-950 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {letterIndex}
                    </span>
                    <span className="leading-relaxed font-sans">{opt}</span>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                  }`}>
                    {isSelected && <span className="text-[10px] font-black">✔</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Nav Controls bottom row */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-100">
            <button
              disabled={currentIndex === 0}
              onClick={handlePrev}
              className="px-4 py-2 rounded-xl text-slate-500 border border-slate-200 hover:bg-slate-50 text-xs font-black transition-all flex items-center gap-1.5 disabled:opacity-40"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>

            {currentIndex < quiz.questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs font-black rounded-xl transition-all shadow-md shadow-orange-100 flex items-center justify-center gap-1 hover:shadow-lg active:scale-98"
              >
                Next Item <ArrowRight className="w-4 h-4 inline-block ml-0.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-[#00A86B] hover:bg-[#008F5A] text-white text-xs font-black rounded-xl transition-all shadow-md shadow-emerald-100 flex items-center gap-1.5 hover:shadow-lg active:scale-98"
              >
                Submit Solutions <CheckCircle2 className="w-4.5 h-4.5" />
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
