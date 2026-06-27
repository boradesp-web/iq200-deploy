import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Award, CheckCircle2, XCircle, RefreshCw, Star, Heart, Flame, ShieldAlert, GraduationCap } from 'lucide-react';
import { DailyQuestion, UserProfile } from '../types';

interface QuestionOfDaySectionProps {
  user: UserProfile | null;
  onUpdateUser: (updated: UserProfile) => void;
  onTriggerLogin: () => void;
}

export default function QuestionOfDaySection({ user, onUpdateUser, onTriggerLogin }: QuestionOfDaySectionProps) {
  const [questions, setQuestions] = useState<DailyQuestion[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('IQ');
  const [loading, setLoading] = useState(true);

  // Attempt records for current session state
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<Record<string, { correct: boolean; chosenIdx: number; xpEarned: number }>>({});
  const [reporting, setReporting] = useState(false);

  useEffect(() => {
    const fetchQOTD = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/qotd');
        const data = await res.json();
        if (data.success && data.questions) {
          setQuestions(data.questions);
          if (data.questions.length > 0) {
            setActiveCategory(data.questions[0].category);
          }
        }
      } catch (err) {
        console.error('Failed to retrieve baseline QOTD catalog:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQOTD();
  }, [user]);

  const activeQuestion = questions.find(q => q.category.toLowerCase() === activeCategory.toLowerCase());

  const handleSubmit = async () => {
    if (selectedIdx === null || !activeQuestion) return;
    
    setReporting(true);
    try {
      const res = await fetch('/api/qotd/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: activeQuestion.category,
          selectedOptionIndex: selectedIdx,
          userId: user ? user.uid : 'guest'
        })
      });

      const data = await res.json();
      if (data.success) {
        // Log attempt response in state
        setSubmitted(prev => ({
          ...prev,
          [activeQuestion.category]: {
            correct: data.isCorrect,
            chosenIdx: selectedIdx,
            xpEarned: data.xpEarned
          }
        }));

        // Adjust user experience stats on frontend for instant gratification
        if (user && data.isCorrect) {
          const updatedUser = {
            ...user,
            xp: user.xp + data.xpEarned,
            streak: user.streak + 1,
            level: Math.floor((user.xp + data.xpEarned) / 100) + 1
          };
          onUpdateUser(updatedUser);
        }
      }
    } catch (err) {
      console.error('Failed to submit daily response:', err);
    } finally {
      setReporting(false);
    }
  };

  const handleTabChange = (cat: string) => {
    setActiveCategory(cat);
    setSelectedIdx(null);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3 shadow-sm">
        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
        <p className="text-slate-500 font-bold text-xs">Parsing Daily Intellect Quarters...</p>
      </div>
    );
  }

  if (questions.length === 0 || !activeQuestion) {
    return null; // Don't block workspace home if empty
  }

  const currentAttempt = submitted[activeCategory];

  return (
    <div id="qotd-container" className="bg-gradient-to-br from-slate-50 to-indigo-50/20 border border-slate-200 rounded-3xl p-6 sm:p-8 text-left space-y-6 shadow-sm relative overflow-hidden">
      
      {/* Decorative Light effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/20 blur-3xl pointer-events-none rounded-full" />

      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <span className="bg-indigo-100 text-indigo-800 font-black text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 fill-indigo-200" /> Topic Mini-Trivia
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
            <Brain className="w-5.5 h-5.5 text-indigo-600" />
            Active Question of the Day
          </h2>
          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            Gain <strong className="text-indigo-600">+20 XP Merit Points</strong> and automatically expand your login and Quiz Streak indexes by answering today's verified textbook tasks below!
          </p>
        </div>

        {/* Home Streaks board summary widgets */}
        {user && (
          <div className="flex flex-wrap gap-2">
            <div className="bg-orange-50 border border-orange-100/60 rounded-xl px-3 py-1.5 text-xs font-black text-orange-800 flex items-center gap-1 shadow-sm">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>{user.streak} Days Streak</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-1.5 text-xs font-black text-emerald-800 flex items-center gap-1 shadow-sm">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Invite: Gold Vault</span>
            </div>
          </div>
        )}
      </div>

      {/* CATEGORY TABS selectors */}
      <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-2xl border w-fit">
        {questions.map(q => {
          const isSubmitted = !!submitted[q.category];
          const attempt = submitted[q.category];
          const catLower = q.category.toLowerCase();
          const isCurrentActive = activeCategory.toLowerCase() === catLower;
          return (
            <button
              key={q.category}
              onClick={() => handleTabChange(q.category)}
              className={`px-3 py-2 text-xs font-black rounded-xl transition-all ${
                isCurrentActive
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              {catLower === 'iq' ? '🧠 IQ Challenge' : 
               catLower === 'maths' ? '📐 Maths' :
               catLower === 'science' ? '🔬 Science' :
               catLower === 'english' ? '📖 English' : '🇮🇳 Hindi'}
              {isSubmitted && (
                <span className={`ml-1.5 text-[9px] px-1 py-0.5 rounded-md text-white font-black uppercase ${attempt?.correct ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                  {attempt?.correct ? '✓' : '✗'}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* MAIN QUESTIONS BLOCK */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="space-y-1 text-left">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">
            National Syllabus Standard
          </span>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
            {activeQuestion.questionText}
          </h3>
        </div>

        {/* Options grid selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {activeQuestion.options.map((option, oIdx) => {
            const isSelected = selectedIdx === oIdx;
            const hasSubmittedThis = !!currentAttempt;
            const isCorrectOption = oIdx === activeQuestion.correctOptionIndex;
            const wasChosenThis = currentAttempt?.chosenIdx === oIdx;

            let optStyleClass = 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800';
            if (isSelected && !hasSubmittedThis) {
              optStyleClass = 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500 text-slate-900';
            } else if (hasSubmittedThis) {
              if (isCorrectOption) {
                optStyleClass = 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-1 ring-emerald-300 pointer-events-none';
              } else if (wasChosenThis && !currentAttempt.correct) {
                optStyleClass = 'bg-rose-50 border-rose-300 text-rose-950 pointer-events-none';
              } else {
                optStyleClass = 'bg-slate-50 border-slate-100 text-slate-400 pointer-events-none opacity-50';
              }
            }

            return (
              <button
                key={oIdx}
                disabled={hasSubmittedThis || reporting}
                onClick={() => setSelectedIdx(oIdx)}
                className={`w-full text-left p-3.5 rounded-xl border font-bold text-xs transition-all flex items-center justify-between ${optStyleClass}`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-white border rounded-full text-[10px] font-black shrink-0 flex items-center justify-center text-slate-500 shadow-sm">
                    {String.fromCharCode(65 + oIdx)}
                  </span>
                  <span>{option}</span>
                </span>
                {hasSubmittedThis && isCorrectOption && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                {hasSubmittedThis && wasChosenThis && !currentAttempt.correct && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Action button status */}
        {!currentAttempt ? (
          <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {!user ? (
              <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-150 tracking-wide text-center">
                ⚠️ Attempting as Guest. Login to persist streak scores.
              </span>
            ) : (
              <span className="text-[10px] font-medium text-slate-400 italic">
                You have not submitted a response for today's {activeCategory.toUpperCase()} question.
              </span>
            )}

            <button
              onClick={handleSubmit}
              disabled={selectedIdx === null || reporting}
              className="bg-[#00A86B] hover:bg-[#008F5A] disabled:opacity-50 text-white font-black text-xs py-3 px-6 rounded-xl shadow-md shadow-emerald-100 hover:shadow-lg hover:scale-101 active:scale-98 transition-all shrink-0 cursor-pointer text-center uppercase tracking-wider"
            >
              {reporting ? 'Uploading Response...' : 'Verify Answer'}
            </button>
          </div>
        ) : (
          /* SHOW FEEDBACK & EXPLANATION DETAILS */
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4.5 space-y-2 animate-in slide-in-from-top-2 duration-200 text-left">
            <h4 className="text-xs font-black text-indigo-950 flex items-center gap-1">
              <Star className="w-4 h-4 text-indigo-600 fill-indigo-200 animate-pulse" />
              Detailed Solution Explanation
            </h4>
            <div className="text-xs text-slate-700 leading-relaxed font-semibold">
              <p className="mb-2 text-slate-800">
                {activeQuestion.explanation || 'Verify dynamic academic concepts in corresponding class reference chapters.'}
              </p>
              {currentAttempt.correct ? (
                <span className="text-emerald-700 font-extrabold flex items-center gap-0.5">
                  ✓ Your response was correct! +20 XP awarded!
                </span>
              ) : (
                <span className="text-rose-700 font-extrabold flex items-center gap-0.5">
                  ✗ Incorrect response. Best of luck on the next attempt!
                </span>
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
