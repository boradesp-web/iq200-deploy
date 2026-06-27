import React, { useState, useEffect } from 'react';
import { Award, Trophy, User, ArrowRight, Share2, Copy, Check, RefreshCw, Star, Zap, Clock, ShieldCheck, Heart } from 'lucide-react';
import { FriendChallenge, Question } from '../types';

interface FriendChallengeViewProps {
  challengeId: string;
  user: any;
  onNavigate: (route: string) => void;
}

export default function FriendChallengeView({ challengeId, user, onNavigate }: FriendChallengeViewProps) {
  const [challenge, setChallenge] = useState<FriendChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Challenge attempt state
  const [friendName, setFriendName] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [curQuestions, setCurQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [userScore, setUserScore] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load challenge detail
  useEffect(() => {
    const fetchChallenge = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/challenge/${challengeId}`);
        const data = await res.json();
        if (data.success && data.challenge) {
          setChallenge(data.challenge);
          
          // Generate procedural questions based on the challenge's class & subject
          // This ensures the friend does the IDENTICAL test as the creator!
          const generatedQuestions = generateProceduralQuiz(data.challenge.classLevel, data.challenge.subject);
          setCurQuestions(generatedQuestions);
        } else {
          setError('Specified challenge index has expired or does not exist.');
        }
      } catch (err) {
        console.error('Challenge fetch error:', err);
        setError('Connection timeout searching for challenge session.');
      } finally {
        setLoading(false);
      }
    };

    if (challengeId) {
      fetchChallenge();
    }
  }, [challengeId]);

  // Timer run loop when challenge accepted
  useEffect(() => {
    let interval: any;
    if (accepted && !isFinished) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [accepted, isFinished]);

  const generateProceduralQuiz = (classLevel: string, subject: string): Question[] => {
    // Standard questions based on subjects that matches original generator patterns
    const isMath = subject.toLowerCase().includes('math');
    const isScience = subject.toLowerCase().includes('science');
    const isEnglish = subject.toLowerCase().includes('english');
    const isHindi = subject.toLowerCase().includes('hindi');

    const list: Question[] = [];
    const subjectsForGen = isMath ? 'Maths' : isScience ? 'Science' : isEnglish ? 'English' : 'Hindi';

    for (let i = 1; i <= 5; i++) {
      let qText = `Sample Challenge Practice Field #${i} on general grade compliance`;
      let options = ['Option Level A', 'Option Level B', 'Option Level C', 'Option Level D'];
      let correctIdx = 0;
      let expl = 'Verify standard textbook patterns.';

      if (isMath) {
        const a = i * 4 + 3;
        const b = i * 3 + 2;
        qText = `Solve the arithmetic equation: ${a} + ${b} = ?`;
        options = [`${a + b - 2}`, `${a + b}`, `${a + b + 5}`, `${a * b}`];
        correctIdx = 1;
        expl = `The sum of ${a} plus ${b} is precisely ${a + b}.`;
      } else if (isScience) {
        if (i === 1) {
          qText = 'Which celestial body acts as the pivotal gravitational center of our solar family?';
          options = ['Venus', 'The Sun', 'Jupiter', 'The Moon'];
          correctIdx = 1;
          expl = 'The Sun contains 99.8% of solar system mass.';
        } else if (i === 2) {
          qText = 'What compound component forms approximately 71% of Earth’s surface crust?';
          options = ['Methane Gas', 'Nitrous Oxide', 'Liquid Water', 'Granitestone'];
          correctIdx = 2;
          expl = 'Earth oceans cover ~71 percent of surface.';
        } else {
          qText = `Identify the common properties catalog of Class i Elements: i = ${i}`;
          options = ['Conduct Electricity', 'Resist Heat', 'Gaseous Ambient', 'Inert Acid'];
          correctIdx = 0;
          expl = 'Conductive state is standard.';
        }
      } else if (isEnglish) {
        qText = `Choose the correct lexical noun identifier for sentence i = ${i}:`;
        options = ['Adjective Modifier', 'Proper Noun Segment', 'Intransitive Verb', 'Direct Conjunction'];
        correctIdx = 1;
        expl = 'Capital nouns reference specific identities.';
      } else if (isHindi) {
        qText = `बताएं कि निम्न वर्णमाला सूची में स्वर ध्वनि कौनसी है? (Syllable #${i})`;
        options = ['क (Ka)', 'अ (Aa)', 'म (Ma)', 'ट (Ta)'];
        correctIdx = 1;
        expl = 'अ स्वर ध्वनि है।';
      }

      list.push({
        id: `cq-${i}-${Date.now()}`,
        questionText: qText,
        options,
        correctOptionIndex: correctIdx,
        explanation: expl,
        difficulty: 'medium',
        topic: 'General Challenge Practice',
        classLevel: classLevel,
        subjectCategory: subjectsForGen
      });
    }

    return list;
  };

  const startChallenge = () => {
    if (!friendName.trim()) {
      alert('Please write your first name to accept your peer\'s challenge.');
      return;
    }
    setAccepted(true);
    setSeconds(0);
  };

  const handleSelectOption = (idx: number) => {
    setSelectedOpt(idx);
  };

  const submitQuestion = () => {
    if (selectedOpt === null) {
      alert('Please check one option field to continue.');
      return;
    }

    const currentQ = curQuestions[currentIdx];
    if (selectedOpt === currentQ.correctOptionIndex) {
      setUserScore(prev => prev + 1);
    }

    setSelectedOpt(null);
    if (currentIdx + 1 < curQuestions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      finishChallenge();
    }
  };

  const finishChallenge = async () => {
    setIsFinished(true);
    setSubmitLoading(true);
    try {
      await fetch(`/api/challenge/${challengeId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: friendName,
          score: userScore + (selectedOpt === curQuestions[currentIdx]?.correctOptionIndex ? 1 : 0),
          totalQuestions: curQuestions.length,
          timeSpent: seconds,
          userId: user ? user.uid : 'guest'
        })
      });
      
      // Reload challenge detail to see the updated standings with friends attempts
      const res = await fetch(`/api/challenge/${challengeId}`);
      const data = await res.json();
      if (data.success && data.challenge) {
        setChallenge(data.challenge);
      }
    } catch (err) {
      console.error('Failed to report score submission:', err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCopyLink = () => {
    const inviteUrl = `https://www.iq200olympiad.org/challenge/${challengeId}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <RefreshCw className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
        <p className="text-slate-500 font-bold">Establishing secure combat room link...</p>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 space-y-4 shadow-sm">
          <Trophy className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-2xl font-black text-rose-950">Challenger Log Unavailable</h2>
          <p className="text-sm text-slate-500">{error || 'This challenge has ended or was cleared.'}</p>
        </div>
        <button onClick={() => onNavigate('#home')} className="bg-slate-900 text-white rounded-xl px-4 py-2 text-xs font-black cursor-pointer">
          Go To Home Hub
        </button>
      </div>
    );
  }

  // Calculate results if finished
  const finalizedScore = isFinished ? userScore : 0;
  const isWinner = isFinished && (userScore > challenge.creatorScore);
  const isTie = isFinished && (userScore === challenge.creatorScore);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-300 space-y-8">
      
      {/* HEADER HERO AREA */}
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 text-left relative overflow-hidden shadow-lg border border-indigo-950">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <Trophy className="w-64 h-64 -mr-16 -mt-16 text-yellow-500" />
        </div>
        <div className="space-y-4 relative z-10 max-w-2xl">
          <span className="bg-indigo-500/30 text-indigo-200 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 
            Active Friendship Duel
          </span>
          <h1 className="text-2.5xl sm:text-3.5xl font-black tracking-tight leading-none text-white">
            Score Battle: {challenge.creatorName} Passed a Challenge!
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
            {challenge.creatorName} completed the dynamic <strong className="text-white">{challenge.classLevel} {challenge.subject} ({challenge.quizTitle})</strong> with a proud score of <strong className="text-amber-400 text-base">{challenge.creatorScore}/{challenge.creatorTotal}</strong>. Think you can beat their accuracy or complete it even quicker? Accept and prove it!
          </p>
        </div>
      </div>

      {!accepted && !isFinished ? (
        /* ACCEPTER ENTER GATEWAY CARD */
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm text-left max-w-xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <Trophy className="w-12 h-12 text-amber-500 fill-amber-100 mx-auto" />
            <h3 className="text-xl font-black text-slate-900">Enter Your First Name Only</h3>
            <p className="text-xs text-slate-500">
              No registration needed! Type your name to jump into the identical assessment challenge.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">My First Name</label>
              <input
                type="text"
                placeholder="e.g. Priyah, Rahul"
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800"
              />
            </div>

            <button
              onClick={startChallenge}
              disabled={!friendName.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-750 disabled:opacity-50 text-white font-black text-xs py-3.5 px-4 rounded-xl transition-all shadow cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1"
            >
              Start Duel Assessment <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="h-px bg-slate-100" />
          
          {/* CHALLENGER PRECEDING HIGH SCOREBOARD */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-indigo-600" /> Room Scoreboard Standings
            </h4>
            <div className="divide-y divide-slate-100 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
              <div className="p-3.5 flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  👑 {challenge.creatorName} <span className="text-[8px] bg-indigo-100 text-indigo-700 font-extrabold uppercase px-1.5 py-0.5 rounded">Host</span>
                </span>
                <span className="font-mono font-black text-indigo-600 font-xl">{challenge.creatorScore} / {challenge.creatorTotal} Correct</span>
              </div>
              {challenge.attempts?.map((att, index) => (
                <div key={index} className="p-3.5 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                    👤 {att.studentName}
                  </span>
                  <span className="font-mono font-bold text-slate-700">{att.score} / {att.totalQuestions} ({att.timeSpent}s)</span>
                </div>
              ))}
              {(!challenge.attempts || challenge.attempts.length === 0) && (
                <p className="p-4 text-center text-slate-400 italic text-[10px]">No peer attempts logged yet. Be the first to try!</p>
              )}
            </div>
          </div>
        </div>
      ) : accepted && !isFinished ? (
        /* QUIZ Duel IN PROGRESS */
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm text-left max-w-2xl mx-auto space-y-6">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-black tracking-widest text-indigo-600">Question {currentIdx + 1} of {curQuestions.length}</span>
              <h4 className="text-sm font-semibold text-slate-550 italic leading-relaxed">
                Topic: {challenge.subject}
              </h4>
            </div>
            <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-100 px-3.5 py-1.5 rounded-xl font-mono text-orange-700 font-bold text-xs">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              <span>{seconds}s Elapsed</span>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-900 leading-snug">
              {curQuestions[currentIdx]?.questionText}
            </h2>

            <div className="space-y-2 pt-2">
              {curQuestions[currentIdx]?.options.map((opt, oIdx) => (
                <button
                  key={oIdx}
                  onClick={() => handleSelectOption(oIdx)}
                  className={`w-full text-left p-4 rounded-xl border font-bold text-xs sm:text-sm transition-all text-slate-800 ${
                    selectedOpt === oIdx 
                      ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500' 
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="inline-flex items-center justify-center bg-white text-slate-600 rounded-full w-5 h-5 text-center text-[10px] font-black border mr-2.5">
                    {String.fromCharCode(65 + oIdx)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end">
            <button
              onClick={submitQuestion}
              disabled={selectedOpt === null}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-xs py-3.5 px-6 rounded-xl transition-all shadow cursor-pointer uppercase tracking-wider inline-flex items-center gap-1"
            >
              {currentIdx + 1 === curQuestions.length ? 'Submit Result Card' : 'Save & Proceed'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* DUEL FINISHED RESULTS COMPARISON */
        <div className="space-y-8 animate-in zoom-in-95 duration-200">
          
          {/* COMPARISON CARD HERO */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-10 shadow text-center space-y-6 max-w-2xl mx-auto">
            <div className="space-y-2">
              <span className="bg-indigo-100 text-indigo-800 text-[10px] px-3 py-1 font-black uppercase tracking-widest rounded-full">
                Result Card Verdict
              </span>
              
              {isWinner ? (
                <div className="space-y-1">
                  <span className="text-4xl">👑🏆🥇</span>
                  <h2 className="text-2.5xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Immense Victory! You Beat {challenge.creatorName}!
                  </h2>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    Splendid execution! You outscored your challenger by racking up <strong className="text-indigo-600">{userScore}/{curQuestions.length}</strong> correct answers!
                  </p>
                </div>
              ) : isTie ? (
                <div className="space-y-1">
                  <span className="text-4xl">🤝🤝</span>
                  <h2 className="text-2.5xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Honorable Equilateral Tie!
                  </h2>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    Outstanding compatibility! You both got the identical score of <strong className="text-indigo-600">{userScore}</strong>!
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-4xl">💪⚔️</span>
                  <h2 className="text-2.5xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Valiant Attempt! Keep Training!
                  </h2>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    You scored <strong className="text-indigo-600">{userScore}/{curQuestions.length}</strong>. Host {challenge.creatorName} retains their crown. Challenge them on another subject!
                  </p>
                </div>
              )}
            </div>

            {/* Duel side-by-side card blocks */}
            <div className="grid grid-cols-2 gap-4 pt-3">
              <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 text-center space-y-2">
                <span className="text-[10px] uppercase font-black text-indigo-700 tracking-widest">HOST CHALLENGER</span>
                <p className="text-base font-black text-slate-900 truncate">{challenge.creatorName}</p>
                <div className="space-y-0.5">
                  <span className="text-2.5xl font-extrabold text-indigo-950">{challenge.creatorScore} / {challenge.creatorTotal}</span>
                  <p className="text-[8px] uppercase tracking-widest font-black text-slate-400">Correct answers</p>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center space-y-2">
                <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest">YOU</span>
                <p className="text-base font-black text-slate-900 truncate">{friendName}</p>
                <div className="space-y-0.5">
                  <span className="text-2.5xl font-extrabold text-slate-800">{userScore} / {curQuestions.length}</span>
                  <p className="text-[8px] uppercase tracking-widest font-black text-slate-400">In {seconds} seconds</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 items-center justify-center pt-2">
              <button
                onClick={handleCopyLink}
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-1.5 transition-all outline-none"
              >
                <Copy className="w-4 h-4 text-slate-500" />
                {copied ? 'Invite Copied!' : 'Copy Multi-Player Invite Link'}
              </button>
              <button
                onClick={() => onNavigate('#leaderboard')}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-750 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow transition-all"
              >
                View Global Scholar Rankings
              </button>
            </div>
          </div>

          {/* INTEGRATED FULL ROOM SCOREBOARD Standings */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-left max-w-2xl mx-auto space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5 justify-start">
              <Trophy className="w-5 h-5 text-amber-500 fill-amber-100" />
              Verifiable Combat Scoreboard Directory
            </h3>
            <p className="text-xs text-slate-500">
              The immutable ranking ledger for Duel ID <code className="font-mono bg-slate-100 rounded p-1 text-indigo-600">{challengeId}</code>:
            </p>
            
            <div className="divide-y divide-slate-150 border border-slate-200 bg-slate-50 rounded-2xl overflow-hidden font-semibold">
              <div className="p-3.5 flex items-center justify-between text-xs bg-indigo-50/70">
                <span className="font-extrabold text-indigo-950 flex items-center gap-1.5">
                  🥇 {challenge.creatorName} <span className="text-[8px] bg-indigo-200 text-indigo-800 font-black uppercase px-2 py-0.5 rounded-full">Host</span>
                </span>
                <span className="font-mono font-black text-indigo-600 text-sm">{challenge.creatorScore}/{challenge.creatorTotal} Correct</span>
              </div>
              
              {challenge.attempts?.map((att, index) => {
                const isHostWinner = challenge.creatorScore > att.score;
                return (
                  <div key={index} className="p-3.5 flex items-center justify-between text-xs hover:bg-white transition-all text-slate-700">
                    <span className="font-bold flex items-center gap-1.5 justify-start">
                      👤 {att.studentName}
                    </span>
                    <span className="font-mono text-slate-600 flex items-center gap-2">
                      <span className="font-black text-slate-800">{att.score}/{att.totalQuestions}</span>
                      <span>in {att.timeSpent} seconds</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
