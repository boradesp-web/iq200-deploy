import React, { useState, useEffect } from 'react';
import { 
  Award, CheckCircle, RefreshCw, Trophy, Flame, Eye, Lock, ShieldAlert, 
  ArrowRight, Share2, Compass, Edit, ShieldCheck, Copy, Check, MessageSquare, 
  Twitter, Facebook, Send, Smartphone, Sparkles, Users, Target, ThumbsUp, 
  TrendingUp, BookOpen, Star, AlertCircle, Smile
} from 'lucide-react';
import { QuizResult, Quiz, Question, Certificate, FriendChallenge } from '../types';

interface ResultPanelProps {
  result: QuizResult;
  quiz: Quiz;
  answers?: { [qId: string]: number };
  onReviewCertificate: () => void;
  onNavigateHome: () => void;
  onAttemptAgain: () => void;
  onRetryExact?: () => void;
}

export default function ResultPanel({
  result,
  quiz,
  answers = {},
  onReviewCertificate,
  onNavigateHome,
  onAttemptAgain,
  onRetryExact
}: ResultPanelProps) {
  
  // Local state for student name editing on the certificate
  const [studentName, setStudentName] = useState(result.studentName || 'EVALUATION STUDENT');
  const [isNameUpdating, setIsNameUpdating] = useState(false);
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [nameError, setNameError] = useState('');

  // Friends Challenge state
  const [challenge, setChallenge] = useState<FriendChallenge | null>(null);
  const [challengeLoading, setChallengeLoading] = useState(false);
  const [copiedChallenge, setCopiedChallenge] = useState(false);
  const [copiedCardData, setCopiedCardData] = useState(false);
  const [challengeError, setChallengeError] = useState('');

  // Auto-fill student name if we have a logged-in user or previous session name
  useEffect(() => {
    if (result.studentName && result.studentName !== 'EVALUATION STUDENT') {
      setStudentName(result.studentName);
      setNameSubmitted(true);
    }
  }, [result]);

  const handleUpdateCertificateName = async () => {
    if (!studentName.trim() || studentName.trim() === 'EVALUATION STUDENT') {
      setNameError('Please write your real first and last name to stamp the certificate.');
      return;
    }
    
    setIsNameUpdating(true);
    setNameError('');
    try {
      // 1. Update Certificate name in DB
      if (result.certificateId) {
        const resCert = await fetch(`/api/certificates/${result.certificateId}/update-name`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: studentName.trim() })
        });
        const dataCert = await resCert.json();
        if (!dataCert.success) {
          throw new Error(dataCert.error || 'Failed to stamp name on certificate');
        }
      }

      // Also update auth profile name if logged in
      if (result.userId && result.userId !== 'guest' && !result.userId.startsWith('guest-')) {
        await fetch('/api/auth/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: result.userId, name: studentName.trim(), classLevel: result.classLevel })
        });
      }

      setNameSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setNameError(err.message || 'Error updating credential name. Please try again.');
    } finally {
      setIsNameUpdating(false);
    }
  };

  const handleCreateFriendChallenge = async () => {
    setChallengeLoading(true);
    setChallengeError('');
    try {
      const res = await fetch('/api/challenge/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: quiz.id,
          quizTitle: quiz.title,
          classLevel: result.classLevel,
          subject: result.subject,
          creatorUid: result.userId || 'guest-temporary-uid',
          creatorName: studentName.trim(),
          creatorScore: result.score,
          creatorTotal: result.totalQuestions,
          creatorTimeSpent: result.timeSpent || 120
        })
      });

      const data = await res.json();
      if (data.success && data.challenge) {
        setChallenge(data.challenge);
      } else {
        throw new Error(data.error || 'Failed to establish friendship combat link');
      }
    } catch (err: any) {
      console.error(err);
      setChallengeError('Failed to generate challenge link. Please try again.');
    } finally {
      setChallengeLoading(false);
    }
  };

  const handleCopyChallengeLink = () => {
    if (!challenge) return;
    const link = `https://www.iq200olympiad.org/challenge/${challenge.id}`;
    navigator.clipboard.writeText(link);
    setCopiedChallenge(true);
    setTimeout(() => setCopiedChallenge(false), 2000);
  };

  const handleCopyCardText = () => {
    const text = `🏆 Social Achievement Card\n-----------------------\nStudent Name: ${studentName}\nMedal Earned: ${result.score >= 9 ? '🥇 Gold Medal' : result.score >= 7 ? '🥈 Silver Medal' : result.score >= 6 ? '🥉 Bronze Medal' : 'No Medal Yet'}\nSubject: ${result.subject}\nScore achieved: ${result.score}/${result.totalQuestions} (${result.percentage}%)\nAchievement Badge: ⭐ Peak Scholar Level Verified!`;
    navigator.clipboard.writeText(text);
    setCopiedCardData(true);
    setTimeout(() => setCopiedCardData(false), 2000);
  };

  const getShareLink = (platform: 'whatsapp' | 'whatsapp_web' | 'x' | 'facebook' | 'telegram') => {
    if (!challenge) return '#';
    const link = `https://www.iq200olympiad.org/challenge/${challenge.id}`;
    const statement = `🏆 I scored ${result.score}/${result.totalQuestions} on the IQ200 ${result.subject} challenge for ${result.classLevel}! Think you can beat me? Click to take the identical test and compare score results live: `;
    const encodedText = encodeURIComponent(statement + link);

    switch (platform) {
      case 'whatsapp':
        return `https://api.whatsapp.com/send?text=${encodedText}`;
      case 'x':
        return `https://twitter.com/intent/tweet?text=${encodedText}`;
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
      case 'telegram':
        return `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(statement)}`;
      default:
        return '#';
    }
  };

  const score = result.score;
  const isMedalWinner = score >= 6;

  // Premium social card layouts config
  const activeMedalScheme = {
    gold: {
      badge: '🥇 Gold Medal Winner',
      glow: 'shadow-yellow-500/20 shadow-xl border-amber-400',
      headerGrad: 'from-amber-400 via-amber-200 to-yellow-600',
      bodyGrad: 'from-amber-50 to-amber-100/40',
      badgeLabel: 'Future Hall-of-Famer',
      cardIcon: '🏆',
      bgGlowCircle: 'bg-yellow-400/10'
    },
    silver: {
      badge: '🥈 Silver Medal Winner',
      glow: 'shadow-slate-400/20 shadow-xl border-slate-300',
      headerGrad: 'from-zinc-400 via-zinc-100 to-slate-500',
      bodyGrad: 'from-slate-50 to-slate-100/40',
      badgeLabel: 'Elite Contender',
      cardIcon: '🥈',
      bgGlowCircle: 'bg-slate-400/10'
    },
    bronze: {
      badge: '🥉 Bronze Medal Winner',
      glow: 'shadow-amber-700/20 shadow-xl border-orange-400',
      headerGrad: 'from-amber-600 via-orange-200 to-orange-850',
      bodyGrad: 'from-stone-50 to-orange-100/20',
      badgeLabel: 'Rising Contender',
      cardIcon: '🥉',
      bgGlowCircle: 'bg-orange-500/10'
    }
  };

  const getActiveScheme = () => {
    if (score >= 9) return activeMedalScheme.gold;
    if (score >= 7) return activeMedalScheme.silver;
    return activeMedalScheme.bronze;
  };

  const scheme = getActiveScheme();

  // Gamification & Progression Messages
  const getMilestoneInfo = () => {
    if (score >= 9) {
      return {
        nextText: 'Outstanding Achievement!',
        badgeText: '🥇 GOLD MEDAL',
        desc: 'You performed at an exceptional Olympiad level and earned a Gold Medal Certificate.',
        gamificationBadge: '⭐ Mastermind Champion'
      };
    }
    if (score >= 7) {
      return {
        nextText: 'Excellent Performance!',
        badgeText: '🥈 SILVER MEDAL',
        desc: 'You demonstrated strong understanding and earned a Silver Medal Certificate.',
        gamificationBadge: '⭐ Rising Scholar',
        progressHint: `You need ${9 - score} more correct answer${9 - score > 1 ? 's' : ''} for Gold.`
      };
    }
    if (score === 6) {
      return {
        nextText: 'Good Effort!',
        badgeText: '🥉 BRONZE MEDAL',
        desc: 'You have earned a Bronze Medal Certificate and are on your way to Olympiad success.',
        gamificationBadge: '⭐ Medal Within Reach',
        progressHint: 'You need 1 more correct answer for Silver, and 3 more for Gold!'
      };
    }
    
    // No medal yet (< 6)
    const neededForBronze = 6 - score;
    const neededForSilver = 7 - score;
    const neededForGold = 9 - score;

    let gamificationBadge = '⭐ Keep Going';
    if (score === 5) gamificationBadge = '⭐ Almost There';
    else if (score === 4) gamificationBadge = '⭐ Medal Within Reach';
    else if (score >= 2) gamificationBadge = '⭐ Rising Scholar';
    else gamificationBadge = '⭐ Future Olympiad Champion';

    return {
      nextText: 'You are closer than you think.',
      badgeText: 'No Medal Yet',
      desc: 'Every Olympiad champion improves by learning from mistakes. Review your answers below and try again to earn your medal certificate.',
      gamificationBadge,
      progressHint: `You need ${neededForBronze} more correct answer${neededForBronze > 1 ? 's' : ''} for Bronze.`
    };
  };

  const milestone = getMilestoneInfo();

  // Pick unique educational key concept and learning tip based on question
  const getAdHocKeyConceptAndTip = (q: Question) => {
    const txt = q.questionText.toLowerCase();
    let keyConcept = 'Logical System Reasoning';
    let learningTip = 'Draw visual diagrams or build mathematical models to organize complex conditions.';

    if (txt.includes('ratio') || txt.includes('fraction') || txt.includes('/') || txt.includes('%')) {
      keyConcept = 'Quantitative Part-Whole Relationships';
      learningTip = 'Always establish equivalent common denominators before executing logic computations.';
    } else if (txt.includes('angle') || txt.includes('shape') || txt.includes('triangle') || txt.includes('circle')) {
      keyConcept = 'Spatial Geometry Configurations';
      learningTip = 'Label all given vertex segments first to surface congruent hidden relationships.';
    } else if (txt.includes('sum') || txt.includes('equation') || txt.includes(' x ') || txt.includes('=')) {
      keyConcept = 'Algebraic Logic Variables';
      learningTip = 'Test small boundary numbers like 0 or 1 to safely eliminate false option paths quickly.';
    } else if (txt.includes('not') || txt.includes('false') || txt.includes('correct')) {
      keyConcept = 'Double-Negative Inference';
      learningTip = 'Slowly read key exclusions: translate statements into simple true/false checklist sheets.';
    }

    return {
      keyConcept: q.topic || keyConcept,
      learningTip
    };
  };

  // Generate parent-friendly diagnostics based on performance
  const getParentFeedback = () => {
    const subjectName = result.subject || 'Olympiad Syllabus';
    
    // Analyze wrong vs correct
    const missedIndexCount = result.totalQuestions - result.score;
    let strengths = 'Demonstrates fantastic cognitive speed and structural comprehension of primary problems.';
    let areasForImprovement = 'Needs extra attention validating initial answers under fast multi-step reasoning constraints.';
    let practiceTopics = [`Advanced analytical models in ${subjectName}`, `Synthesizing problem variables`];

    if (score >= 9) {
      strengths = 'Absolute outstanding mastery profile! Showcases supreme retention, structural fluency, and flawless inference mechanics.';
      areasForImprovement = 'Excellent accuracy; continue sustaining peak focus times by practicing hard logical dilemmas.';
      practiceTopics = [`National Olympiad Finals sets in ${subjectName}`, 'Pre-collegiate critical verification structures'];
    } else if (score >= 7) {
      strengths = 'Strong conceptual foundations. Handles secondary quantitative steps with high competence and logical speed.';
      areasForImprovement = 'Minor slip-ups under stress. Review border parameters and double check units before concluding.';
      practiceTopics = ['Multi-step algebraic variables', `Deductive evaluation benchmarks in ${subjectName}`];
    } else if (score < 6) {
      strengths = 'Shows excellent grit and a willingness to tackle rigorous school syllabus challenge frameworks.';
      areasForImprovement = 'Conceptual gaps in core definitions and inference logic. Needs persistent step-by-step review patterns.';
      practiceTopics = [`Foundational drill mechanics of ${subjectName} topics`, 'Process-of-elimination test-taking strategies'];
    }

    return {
      strengths,
      areasForImprovement,
      practiceTopics
    };
  };

  const parentFeedback = getParentFeedback();

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* 1. MAIN MEDAL STATUS BANNER OR ONE STEP AWAY MOTIVATIONAL SCREEN */}
      {!isMedalWinner ? (
        /* MOTIVATIONAL FAILURE HERO SCREEN */
        <div className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden text-left border-2 border-indigo-500/20">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="flex items-center gap-3">
              <span className="p-3 bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 rounded-2xl text-2xl animate-spin-slow">
                🌟
              </span>
              <div>
                <span className="text-[10px] bg-indigo-500/30 text-indigo-300 font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-indigo-400/20">
                  {milestone.gamificationBadge}
                </span>
                <h1 className="text-2xl sm:text-3.5xl font-black mt-1 text-white">
                  You Are One Step Away From Your Medal!
                </h1>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Many top Olympiad performers do not succeed on their first attempt. The difference is that they learn from their mistakes and try again. Review the explanations below, understand where you went wrong, and come back stronger. You can still earn your medal today.
            </p>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left leading-tight">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">🎯 Medal Progress</span>
                <p className="text-xs sm:text-sm font-black text-amber-300">
                  {milestone.progressHint}
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  Current score: {result.score} / {result.totalQuestions} ({Math.round(result.percentage)}%)
                </p>
              </div>

              {onRetryExact && (
                <button
                  onClick={onRetryExact}
                  className="bg-indigo-500 hover:bg-indigo-450 text-white text-xs font-black uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all shadow-md active:translate-y-0.5 cursor-pointer flex items-center gap-2 shrink-0 border border-indigo-400/30"
                >
                  <span>🚀 Retry This Exact Test</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* MEDAL SUCCESS PROUD HERO BANNER */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 text-left">
          
          {/* Circular metric wheel or medal representation */}
          <div className="md:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white flex flex-col justify-between space-y-6 text-center md:text-left relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,215,0,0.06),transparent_70%)] pointer-events-none"></div>

            <div className="space-y-2 relative z-10">
              <div className="flex items-center justify-center md:justify-start gap-1.5">
                <span className="text-xs bg-emerald-500/20 text-emerald-400 font-extrabold px-3 py-1 rounded-full uppercase border border-emerald-500/20 tracking-wider">
                  Verified Score
                </span>
                <span className="text-xs bg-slate-800 text-amber-400 px-3 py-1 rounded-full font-bold uppercase">
                  {milestone.gamificationBadge}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">{result.quizTitle}</h2>
              <span className="text-sm font-black text-amber-500 font-mono block">
                {milestone.badgeText} ACHIEVED
              </span>
            </div>

            {/* Medal Large Wheel Graphic */}
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center relative z-10 select-none">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="60" stroke="#111827" strokeWidth="10" fill="transparent" />
                <circle 
                  cx="72" 
                  cy="72" 
                  r="60" 
                  stroke={score >= 9 ? '#fbbf24' : '#94a3b8'} 
                  strokeWidth="10" 
                  fill="transparent" 
                  strokeDasharray={376.8}
                  strokeDashoffset={376.8 - (376.8 * result.percentage) / 100}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2.5xl filter drop-shadow">
                  {score >= 9 ? '🥇' : '🥈'}
                </span>
                <span className="text-xl font-mono font-black text-white leading-none mt-1">{result.percentage}%</span>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">
                  {result.score} / {result.totalQuestions} Correct
                </span>
              </div>
            </div>

            {/* Award Points Container */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center space-y-1 relative z-10 leading-none">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">+ {result.xpEarned} XP LOGGED</span>
              <p className="text-xs text-slate-300 font-bold leading-normal">{milestone.desc}</p>
            </div>

            <p className="text-[9px] text-slate-500 font-mono relative z-10">
              Syllabus level: {result.classLevel} • Completed: {result.completedAt}
            </p>
          </div>

          {/* Premium custom Certificate Name Registration portal */}
          <div className="md:col-span-7 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono block">Endorsement Verification Profile</span>
              <h3 className="text-xl font-black text-slate-900 leading-tight">
                Claim & Personalize Your Prestigious Medal Certificate!
              </h3>
              
              <div className="p-4 sm:p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-3.5">
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  Excellent work! Your high score qualifies you to receive a registered printable national credential document. Enter the exact candidate name for printing:
                </p>

                {!nameSubmitted ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Priyah Sharma, Aarav Patel"
                        value={studentName === 'EVALUATION STUDENT' ? '' : studentName}
                        onChange={(e) => {
                          setStudentName(e.target.value);
                          setNameError('');
                        }}
                        className="flex-1 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-550 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 placeholder-slate-400 shadow-sm"
                      />
                      <button
                        onClick={handleUpdateCertificateName}
                        disabled={isNameUpdating}
                        className="bg-indigo-600 hover:bg-indigo-750 text-white font-extrabold text-xs px-5 rounded-xl transition-all shadow flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {isNameUpdating ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <span>Stamp Name</span>
                        )}
                      </button>
                    </div>
                    {nameError && (
                      <p className="text-[10px] font-bold text-rose-600">{nameError}</p>
                    )}
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 flex items-center justify-between text-xs font-bold text-emerald-800">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                      <span>Printed Name: <strong className="text-slate-900 underline font-extrabold">{studentName}</strong></span>
                    </div>
                    <button 
                      onClick={() => setNameSubmitted(false)}
                      className="text-indigo-600 hover:text-indigo-800 text-[10px] underline font-black leading-none"
                    >
                      Change Name
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-150 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest font-mono">Format: High-Res Vectors Print Ready</span>
              <button
                onClick={onReviewCertificate}
                disabled={!nameSubmitted}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none text-white font-black text-xs px-6 py-3.5 rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Unveil Verified certificate</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* 2. SOCIAL MEDIA ACHIEVEMENT CARD (Only showing if score >= 6) */}
      {isMedalWinner && (
        <section id="social-card" className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 text-left space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-indigo-600" />
              🌟 Social Media Achievement Card
            </h3>
            <p className="text-xs text-slate-500 font-semibold">
              This card is visually optimized for instant sharing on WhatsApp Status, Instagram, Facebook, and with family channels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            {/* Visual Social Card Mockup */}
            <div className={`relative rounded-2xl border-4 ${scheme.glow} p-6 overflow-hidden ${scheme.bodyGrad}`}>
              
              {/* Subtle visual radial circle in background */}
              <div className={`absolute -right-10 -bottom-10 w-44 h-44 rounded-full ${scheme.bgGlowCircle} filter blur-xl pointer-events-none`}></div>
              
              <div className="space-y-5 relative z-10 text-slate-900">
                
                {/* Visual Header */}
                <div className="flex justify-between items-center pb-3 border-b border-slate-200/50">
                  <span className="text-[10px] uppercase tracking-widest font-mono font-black text-indigo-600">
                    IQ200 OLYMPIAD CHAMPION
                  </span>
                  <span className="text-xl">{scheme.cardIcon}</span>
                </div>

                {/* Candidate name & score */}
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-slate-500">🏆 Student Name</span>
                  <h4 className="text-2xl font-serif font-black tracking-tight text-slate-950 uppercase break-words leading-tight">
                    {studentName}
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-slate-500">🏅 Medal Earned</span>
                    <p className="text-sm font-black text-indigo-950 flex items-center gap-1">
                      {scheme.badge}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-slate-500">📚 Subject</span>
                    <p className="text-sm font-black text-indigo-950 truncate">
                      {result.subject}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-slate-500">🎯 Score achived</span>
                    <p className="text-sm font-black text-slate-900 font-mono">
                      {result.score} / {result.totalQuestions} ({result.percentage}%)
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-slate-500">⭐ Achievement Badge</span>
                    <p className="text-xs font-extrabold text-indigo-600 bg-indigo-50 py-0.5 px-2 rounded-md inline-block">
                      {scheme.badgeLabel}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-200/50 pt-2.5 flex justify-between items-center text-[8px] font-mono text-slate-400">
                  <span>SYSTEM UNIQUE ID: {result.certificateId || 'VERIFIED-LEDGER'}</span>
                  <span>www.iq200olympiad.org</span>
                </div>

              </div>
            </div>

            {/* Share controls panel */}
            <div className="space-y-4 text-left">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest font-mono">
                Speed Dispatch Tools
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Generate high engagement card feedback. You can copy the raw text metadata blueprint description to make pasting easy on mobile social clips!
              </p>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleCopyCardText}
                  className="flex-1 bg-white hover:bg-slate-50 border border-slate-250 text-slate-800 font-extrabold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copiedCardData ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                      <span>Card Details Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500" />
                      <span>Copy Card Text Template</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-indigo-50/60 p-3.5 border border-indigo-100 rounded-xl leading-relaxed text-[11px] text-indigo-950 flex gap-2">
                <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Family Share:</strong> Copy the text card and paste with your official link in family chat groups. Keep your schoolmates motivated!
                </p>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* 3. MULTIPLAYER FRIEND CHALLENGE HUB */}
      <section id="viral-challenge" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 text-white text-left relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08),transparent_65%)] pointer-events-none"></div>

        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="space-y-2">
            <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-flex items-center gap-1.5 leading-none">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Multiplayer Combat Hub
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              🎯 Challenge Your Friends & Verify Who Has Peak IQ!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Establish a dynamic battle room holding the identity of your test score. Relatives, friends, or classmates can accept using the exact same questions to log comparative stands in real-time.
            </p>
          </div>

          {!challenge ? (
            <div className="pt-2">
              <button
                onClick={handleCreateFriendChallenge}
                disabled={challengeLoading}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform duration-200 active:scale-95"
              >
                {challengeLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Establishing Duel Session...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Peer Combat Duel Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              {challengeError && (
                <p className="text-xs font-bold text-rose-400 pt-2">{challengeError}</p>
              )}
            </div>
          ) : (
            <div className="bg-slate-950/70 rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-5 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                
                <div className="col-span-12 md:col-span-5 bg-gradient-to-br from-indigo-950 to-slate-900 border border-slate-800 rounded-xl p-4 space-y-3.5 text-center md:text-left">
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Trophy className="w-7 h-7 text-amber-400 fill-amber-400/20" />
                    <div>
                      <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block font-mono">My High Score Card</span>
                      <span className="text-xs font-bold font-mono text-white">Duel Lobby Standby</span>
                    </div>
                  </div>
                  <div className="border-t border-slate-800/80 my-2"></div>
                  <div className="flex justify-between items-center px-2 text-xs">
                    <span className="text-slate-400">{studentName} ({result.classLevel})</span>
                    <span className="font-mono font-black text-amber-400">{result.score} / {result.totalQuestions}</span>
                  </div>
                  <span className="text-[8px] font-bold text-slate-400 block tracking-wider uppercase bg-slate-900 px-2 py-1 rounded text-center font-mono">
                    ID: {challenge.id}
                  </span>
                </div>

                <div className="col-span-12 md:col-span-7 space-y-3">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest font-mono block">Sharable Duel Invite link</span>
                  
                  <div className="flex gap-2 bg-slate-900 p-1 rounded-xl border border-slate-850">
                    <input
                      type="text"
                      readOnly
                      value={`https://www.iq200olympiad.org/challenge/${challenge.id}`}
                      className="flex-1 bg-transparent border-none text-slate-350 px-3 py-2 text-xs truncate focus:outline-none font-semibold"
                    />
                    <button
                      onClick={handleCopyChallengeLink}
                      className="bg-indigo-600 hover:bg-indigo-750 text-white font-extrabold text-xs px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                    >
                      {copiedChallenge ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Social dispatch options Row */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <a
                      href={getShareLink('whatsapp')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href={getShareLink('x')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-black text-white font-extrabold text-[11px] px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      <Twitter className="w-3.5 h-3.5" />
                      <span>X Twitter</span>
                    </a>

                    <a
                      href={getShareLink('telegram')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-[11px] px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Telegram</span>
                    </a>

                    <a
                      href={getShareLink('facebook')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      <Facebook className="w-3.5 h-3.5" />
                      <span>Facebook</span>
                    </a>
                  </div>
                </div>

              </div>

              {/* Dynamic Live Leaderboard standing indicator */}
              <div className="border-t border-slate-800/80 pt-4 space-y-2.5 text-left">
                <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest font-mono flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-500" /> Active Duel Scoreboard Directory
                </span>
                <div className="divide-y divide-slate-900 bg-slate-950 border border-slate-850 rounded-xl overflow-hidden text-xs">
                  <div className="p-3 flex items-center justify-between font-bold text-slate-200">
                    <span className="flex items-center gap-1.5">
                      🥇 {studentName} <span className="text-[8px] bg-indigo-500/20 text-indigo-300 font-extrabold uppercase px-1.5 py-0.5 rounded leading-none border border-indigo-500/10">Host</span>
                    </span>
                    <span className="font-mono text-amber-400">{result.score} / {result.totalQuestions} ({Math.floor(result.timeSpent / 60)}m {result.timeSpent % 60}s)</span>
                  </div>
                  <p className="p-3 text-center text-slate-500 italic text-[10px]">
                    Lobby is live! Share your verified custom challenge link above to see friend scorecards record comparison indexes immediately.
                  </p>
                </div>
              </div>

            </div>
          )}
        </div>
      </section>

      {/* 4. PARENT-FRIENDLY DIAGNOSTIC FEEDBACK REPORT */}
      <section id="parent-feedback" className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 text-left space-y-5 shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
          <span className="text-xl">👨‍👩‍👦</span>
          <div>
            <h3 className="text-base font-black text-slate-950">Parent-Friendly Performance Diagnostics</h3>
            <p className="text-xs text-slate-500 font-medium">Empower parents to understand their child's cognitive strengths and targeted improvements.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1 text-xs">
          
          {/* Strengths card */}
          <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-2">
            <span className="text-emerald-700 font-black flex items-center gap-1.5 text-xs font-mono uppercase">
              <ThumbsUp className="w-4 h-4 text-emerald-600" />
              ✅ Current Strengths
            </span>
            <p className="text-slate-600 font-semibold leading-relaxed">
              {parentFeedback.strengths}
            </p>
          </div>

          {/* Improvement goals card */}
          <div className="bg-white border border-slate-150 p-4 rounded-2xl space-y-2">
            <span className="text-indigo-900 font-black flex items-center gap-1.5 text-xs font-mono uppercase">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              🎯 Areas For Improvement
            </span>
            <p className="text-slate-600 font-semibold leading-relaxed">
              {parentFeedback.areasForImprovement}
            </p>
          </div>

          {/* Recommended curriculum practices */}
          <div className="bg-gradient-to-br from-indigo-50/50 to-indigo-100/30 border border-indigo-100 p-4 rounded-2xl space-y-2">
            <span className="text-indigo-950 font-black flex items-center gap-1.5 text-[11px] font-mono uppercase">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              📚 Recommended Study Topics
            </span>
            <ul className="space-y-1.5 text-slate-700 font-bold">
              {parentFeedback.practiceTopics.map((item, id) => (
                <li key={id} className="flex items-start gap-1">
                  <span className="text-indigo-600 shrink-0 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* 5. DETAILED ERROR REVIEW OR GENERAL QUESTION SCRIPT */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 text-left shadow-sm">
        
        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-indigo-600" /> 
              {!isMedalWinner ? '🔍 Meticulous Learning From Mistakes Review' : '🔍 Review Completed Questions Keys & Explanations'}
            </h4>
            <p className="text-xs text-slate-500 font-semibold">
              {!isMedalWinner ? 'Every incorrect response is mapped below with step-by-step guidance. Read carefully before re-attempting.' : 'Understand the underlying scientific reasoning of answers to sharpen speed skills.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-mono border border-slate-200">
              Total questions: {quiz.questions.length}
            </span>
          </div>
        </div>
        
        <div className="space-y-6">
          {(() => {
            // Filter down if error review is requested for scores < 6
            const questionsToShow = !isMedalWinner 
              ? quiz.questions.filter(q => answers[q.id] !== q.correctOptionIndex)
              : quiz.questions;

            if (questionsToShow.length === 0) {
              return (
                <div className="p-8 text-center text-slate-500 bg-emerald-50/20 border border-dashed border-emerald-150 rounded-2xl space-y-1.5">
                  <Smile className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p className="text-sm font-bold text-slate-800">Perfect Score Accomplished!</p>
                  <p className="text-xs">No questions missed in this Olympiad trial.</p>
                </div>
              );
            }

            return questionsToShow.map((q, idx) => {
              const studentChoiceIdx = answers[q.id];
              const isCorrect = studentChoiceIdx === q.correctOptionIndex;
              const hasAnswered = studentChoiceIdx !== undefined;
              const diagnostic = getAdHocKeyConceptAndTip(q);

              return (
                <div 
                  key={q.id} 
                  className={`p-5 rounded-2xl border transition-all ${
                    !isCorrect 
                      ? 'border-rose-200 bg-rose-50/5 shadow-sm' 
                      : 'border-slate-150 bg-slate-50/40'
                  }`}
                >
                  <div className="flex justify-between items-center pb-2.5 border-b border-slate-100/80 mb-3 text-xs font-mono">
                    <span className="font-black text-slate-400">
                      Problem Item #{idx + 1}
                    </span>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                      isCorrect 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {isCorrect ? '✅ Correct' : '❌ Incorrect'}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-slate-900 leading-relaxed whitespace-pre-line mb-4">
                    {q.questionText}
                  </p>
                  
                  {/* Visual options summary */}
                  <div className="space-y-3.5 pl-3.5 border-l-3 border-indigo-500/80">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1 leading-normal">
                        <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-widest block font-mono">
                          ❌ Student Answer
                        </span>
                        <p className="font-extrabold text-slate-700 bg-rose-50/40 border border-rose-100/50 p-2.5 rounded-lg italic">
                          {hasAnswered ? q.options[studentChoiceIdx] : 'No answer selected'}
                        </p>
                      </div>

                      <div className="space-y-1 leading-normal">
                        <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest block font-mono">
                          🟢 Correct Blueprint Option
                        </span>
                        <p className="font-extrabold text-slate-900 bg-emerald-50/40 border border-emerald-150/55 p-2.5 rounded-lg font-mono">
                          {q.options[q.correctOptionIndex]}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1 text-xs">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block font-mono">
                        ⚙️ Step-by-Step Explanation
                      </span>
                      <p className="font-semibold text-slate-650 bg-slate-50/80 p-3 rounded-xl border border-slate-150 leading-relaxed italic">
                        {q.explanation || 'Detailed deductive steps verify options matrix matches curriculum parameters.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1 border-t border-slate-100">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block font-mono">
                          🔑 Key Concept
                        </span>
                        <p className="font-black text-slate-800">{diagnostic.keyConcept}</p>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[9px] font-extrabold text-indigo-500 uppercase tracking-widest block font-mono">
                          💡 Study Learning Tip
                        </span>
                        <p className="font-medium text-slate-650 leading-normal">{diagnostic.learningTip}</p>
                      </div>
                    </div>

                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* Large RETRY BUTTON at the very bottom for convenience */}
      {onRetryExact && !isMedalWinner && (
        <div className="p-8 bg-indigo-50/50 border border-indigo-100 rounded-3xl text-center space-y-4">
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            Ready to apply everything you just learned? Go ahead and re-run this test! We keep these exact same questions to maximize your score retention.
          </p>
          <button
            onClick={onRetryExact}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase px-8 py-4 rounded-xl shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-transform cursor-pointer"
          >
            <span>🚀 Retry This Exact Test Now</span>
          </button>
        </div>
      )}

      {/* 6. BOTTOM CONTINUOUS LEARNING NAV CONTROLS */}
      <div className="flex items-center justify-between text-xs pt-2">
        <button
          onClick={onNavigateHome}
          className="text-slate-500 hover:text-indigo-600 font-black underline"
        >
          Return to Portal Home
        </button>
        
        <button
          onClick={onAttemptAgain}
          className="text-indigo-600 hover:text-indigo-800 font-black underline"
        >
          Explore Other Subject Assessments
        </button>
      </div>

    </div>
  );
}
