import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Award, Clock, ArrowRight, CheckCircle, XCircle, 
  HelpCircle, RefreshCw, Layers, ShieldCheck, ChevronRight, Share2, 
  Download, Sparkles, Star, ChevronLeft, LogIn, ExternalLink, MessageCircle
} from 'lucide-react';
import { Quiz, Question, UserProfile, Certificate, QuizResult } from '../types';
import AdSenseComponent from './AdSenseComponent';

interface CurriculumLandingViewProps {
  routeSlug: string; 
  user: UserProfile | null;
  onNavigate: (route: string) => void;
  onTriggerLogin: () => void;
  onSaveCertificate: (certificate: Certificate) => void;
}

export default function CurriculumLandingView({
  routeSlug,
  user,
  onNavigate,
  onTriggerLogin,
  onSaveCertificate
}: CurriculumLandingViewProps) {
  
  // State for assessment simulation
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [answeredStates, setAnsweredStates] = useState<boolean[]>([]); // whether each question has been submitted
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(300); // 5 minutes standard
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [unlockedCertificate, setUnlockedCertificate] = useState<Certificate | null>(null);
  
  // Friend Challenge Duel integration states
  const [challengeLink, setChallengeLink] = useState('');
  const [challengeLoading, setChallengeLoading] = useState(false);
  const [challengeCopied, setChallengeCopied] = useState(false);

  // Parse details from routeSlug
  // Expected structure: "class-X-subject-resource"
  // e.g. "class-5-maths-sample-paper"
  const parseRoute = () => {
    const parts = routeSlug.split('-');
    
    // Default fallback
    let classLevelNum = '5';
    let subjectKey = 'maths';
    let resourceSlug = 'mcq';

    if (parts.length >= 2) {
      // Find class part
      const classIdx = parts.findIndex(p => p === 'class');
      if (classIdx !== -1 && classIdx + 1 < parts.length) {
        classLevelNum = parts[classIdx + 1];
      }
      
      // Find subject part (maths, science, english, hindi, grammar)
      if (parts.includes('maths') || parts.includes('mathematics')) {
        subjectKey = 'maths';
      } else if (parts.includes('science')) {
        subjectKey = 'science';
      } else if (parts.includes('english')) {
        subjectKey = 'english';
      } else if (parts.includes('hindi')) {
        subjectKey = 'hindi';
      }

      // Find resourceType part
      if (parts.includes('mcq')) {
        resourceSlug = 'mcq';
      } else if (parts.includes('quiz')) {
        resourceSlug = 'quiz';
      } else if (parts.includes('practice') || parts.includes('practice-tests')) {
        resourceSlug = 'practice-tests';
      } else if (parts.includes('mock') || parts.includes('mock-tests')) {
        resourceSlug = 'mock-tests';
      } else if (parts.includes('olympiad') || parts.includes('olympiad-practice')) {
        resourceSlug = 'olympiad-practice';
      } else if (parts.includes('sample') || parts.includes('sample-papers')) {
        resourceSlug = 'sample-papers';
      } else if (parts.includes('important') || parts.includes('important-questions')) {
        resourceSlug = 'important-questions';
      } else if (parts.includes('topic') || parts.includes('topic-wise-questions')) {
        resourceSlug = 'topic-wise-questions';
      }
    }

    const classLabel = `Class ${classLevelNum}`;
    const subjectLabel = subjectKey === 'maths' ? 'Mathematics' : 
                         subjectKey === 'science' ? 'Science' : 
                         subjectKey === 'english' ? 'English' : 'Hindi';
    
    const resourceLabels: Record<string, string> = {
      'mcq': 'MCQ Questions',
      'quiz': 'Practice Quiz',
      'practice-tests': 'Practice Tests',
      'mock-tests': 'Mock Tests',
      'olympiad-practice': 'Olympiad Practice Paper',
      'sample-papers': 'Exam Sample Papers',
      'important-questions': 'Important Questions Checklist',
      'topic-wise-questions': 'Topic Wise Questions Bank'
    };

    const resourceLabel = resourceLabels[resourceSlug] || 'Diagnostic Test';

    return {
      classLevelNum,
      classLabel,
      subjectKey,
      subjectLabel,
      resourceSlug,
      resourceLabel,
      slug: routeSlug
    };
  };

  const info = parseRoute();

  // Procedural dynamic question generator to keep pages 100% functional
  useEffect(() => {
    const generated: Question[] = [];
    const seedQuestions = () => {
      const clsNum = Number(info.classLevelNum) || 5;
      const sub = info.subjectLabel;

      if (sub === 'Mathematics') {
        const topics = ['Mental Arithmetic', 'Fractions & Ratios', 'Decimals', 'Basic Algebra', 'Geometry Angles', 'Data Interpretation'];
        for (let i = 1; i <= 5; i++) {
          const val1 = Math.floor(Math.random() * (12 * (clsNum - 1))) + (5 * i);
          const val2 = Math.floor(Math.random() * (10 * (clsNum - 1))) + 3;
          const sum = val1 * val2;

          generated.push({
            id: `q-math-${clsNum}-${i}`,
            questionText: `Solve the curricular math riddle (Grade ${clsNum} Level):\nIf there are ${val1} crates, each containing ${val2} geometry instruments, what is the combined total instruments?`,
            options: [
              `${sum}`,
              `${sum - i - 2}`,
              `${sum + i + 5}`,
              `${sum * 2}`
            ],
            correctOptionIndex: 0,
            explanation: `Simple calculation yields ${val1} * ${val2} = ${sum}. This serves as basic multiplication curriculum alignment.`,
            difficulty: clsNum > 7 ? 'hard' : clsNum > 4 ? 'medium' : 'easy',
            topic: topics[i % topics.length],
            classLevel: info.classLabel,
            subjectCategory: 'Mathematics'
          });
        }
      } else if (sub === 'Science') {
        const scienceDocs = [
          { q: 'Which elemental state changes from ice directly into water vapor under normal standard pressures?', opts: ['Sublimation', 'Evaporation', 'Condensation', 'Melting'], correct: 0, expl: 'Sublimation is the direct transition from solid to gaseous phase without liquid states.', topic: 'Matter Changes' },
          { q: 'Identify the chemical abbreviation denoting standard Carbon Dioxide molecules:', opts: ['CO', 'CO2', 'O2', 'H2O'], correct: 1, expl: 'CO2 denotes carbon dioxide. CO is carbon monoxide.', topic: 'Molecular Chemistry' },
          { q: 'What is the master organ facilitating atmospheric gas respiration in mammals?', opts: ['Lungs', 'Liver', 'Kidneys', 'Heart'], correct: 0, expl: 'The lungs facilitate modern ventilation gaseous cycle exchanges.', topic: 'Human Biology' },
          { q: 'Which planetary orbital sphere represents the closest coordinate to Earth within the solar model?', opts: ['Mars', 'Venus', 'Mercury', 'Jupiter'], correct: 1, expl: 'Venus is structurally the closest planetary neighbor orbiting inside.', topic: 'Solar Physics' },
          { q: 'The units denoting general force within Newtonian mechanics equations are styled as:', opts: ['Joules', 'Watts', 'Newtons', 'Volts'], correct: 2, expl: 'Named after Sir Isaac Newton, the Newton is the standard metric measurement for force.', topic: 'Newtonian Physics' }
        ];
        scienceDocs.forEach((d, idx) => {
          generated.push({
            id: `q-sci-${clsNum}-${idx}`,
            questionText: `[Grade ${clsNum} Science] ${d.q}`,
            options: d.opts,
            correctOptionIndex: d.correct,
            explanation: d.expl,
            difficulty: 'medium',
            topic: d.topic,
            classLevel: info.classLabel,
            subjectCategory: 'Science'
          });
        });
      } else if (sub === 'English') {
        const engDocs = [
          { q: 'Choose the grammatically pristine spelling option representing high professional intelligence:', opts: ['Accommodate', 'Acomodate', 'Accomodate', 'Acommodate'], correct: 0, expl: 'Accommodate is spelled with double "c" and double "m".', topic: 'Orthography' },
          { q: 'Find the appropriate grammatical conjunction: "He was incredibly fatigued, ______ he resolved to complete his geometry paper."', opts: ['yet', 'or', 'so', 'because'], correct: 0, expl: 'The contrasting meaning indicates "yet" as the ideal compound transition choice.', topic: 'Coordinate Conjunctive Connectors' },
          { q: 'Identify the synonym representing "diligent" within student academic activities:', opts: ['Assiduous', 'Lethargic', 'Careless', 'Indifferent'], correct: 0, expl: 'Assiduous denotes persistent determination or diligence.', topic: 'Lexical Semantics' },
          { q: 'What tense is modeled by: "By next week, Sarah will have finished her IMO prep quiz."', opts: ['Future Perfect Simple', 'Future Continuous', 'Present Perfect Simple', 'Past Perfect'], correct: 0, expl: 'Will have finished denotes completions before standard chronological future boundaries.', topic: 'Tense Syntax' }
        ];
        engDocs.forEach((d, idx) => {
          generated.push({
            id: `q-eng-${clsNum}-${idx}`,
            questionText: `[Grammar Standard] ${d.q}`,
            options: d.opts,
            correctOptionIndex: d.correct,
            explanation: d.expl,
            difficulty: 'medium',
            topic: d.topic,
            classLevel: info.classLabel,
            subjectCategory: 'English'
          });
        });
      } else {
        // Hindi questions
        const hindiDocs = [
          { q: '\'सूर्योदय\' शब्द का सही संधि-विच्छेद चुनिए:', opts: ['सूर्य + उदय', 'सूर्यो + दय', 'सूर्य + दय', 'सूर्यः + उदय'], correct: 0, expl: '\'सूर्य + उदय = सूर्योदय\'। यह गुण स्वर संधि का प्रमुख उदाहरण है।', topic: 'संधि विच्छेद' },
          { q: 'निम्नलिखित में से \'कमल\' शब्द का उचित पर्यायवाची चुनें:', opts: ['जलज', 'पंकज', 'वारिद', 'दोनों जलज और पंकज'], correct: 3, expl: 'जलज और पंकज दोनों ही कमल के पर्यायवाची विशेषण हैं।', topic: 'पर्यायवाची' },
          { q: 'दिए गए मुहावरे का सही अर्थ चुनिंदा करें: \'लोहे के चने चबाना\'', opts: ['बहुत कठिन काम करना', 'लोहे से बनी वस्तु खाना', 'क्रोधित हो उठना', 'हार मान लेना'], correct: 0, expl: '\'लोहे के चने चबाना\' मुहावरे का अर्थ अत्यंत संघर्ष या कठिन कार्य करना होता है।', topic: 'मुहावरे एवं लोकोक्तियाँ' }
        ];
        hindiDocs.forEach((d, idx) => {
          generated.push({
            id: `q-hin-${clsNum}-${idx}`,
            questionText: `[हिन्दी व्याकरण Grade ${clsNum}] ${d.q}`,
            options: d.opts,
            correctOptionIndex: d.correct,
            explanation: d.expl,
            difficulty: 'medium',
            topic: d.topic,
            classLevel: info.classLabel,
            subjectCategory: 'Hindi'
          });
        });
      }
    };

    seedQuestions();
    setQuestions(generated);
    setSelectedAnswers(new Array(generated.length).fill(-1));
    setAnsweredStates(new Array(generated.length).fill(false));
    setTestCompleted(false);
    setUnlockedCertificate(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimer(300);
    setIsTimerRunning(true);
    setChallengeLink(''); // Reset share link on retakes/slug switch
  }, [routeSlug]);

  const handleCreateChallenge = async () => {
    setChallengeLoading(true);
    try {
      const res = await fetch('/api/challenge/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: info.slug,
          quizTitle: info.resourceLabel,
          classLevel: info.classLabel,
          subject: info.subjectLabel,
          creatorUid: user ? user.uid : `guest-${Date.now()}`,
          creatorName: user ? user.name : 'Olympiad Scholar',
          creatorScore: score,
          creatorTotal: questions.length,
          creatorTimeSpent: 300 - timer
        })
      });
      const data = await res.json();
      if (data.success && data.challenge) {
        setChallengeLink(`https://www.iq200olympiad.org/challenge/${data.challenge.id}`);
      }
    } catch (err) {
      console.error('Failed to instantiate friend challenge link:', err);
    } finally {
      setChallengeLoading(false);
    }
  };

  // Handle countdown Timer
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(t => t - 1);
      }, 1000);
    } else if (timer === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      handleFinishSimulation();
    }
    return () => clearInterval(interval);
  }, [timer, isTimerRunning]);

  const handleOptionSelect = (optionIdx: number) => {
    if (answeredStates[currentQuestionIndex]) return; // locked in
    const nextAnswers = [...selectedAnswers];
    nextAnswers[currentQuestionIndex] = optionIdx;
    setSelectedAnswers(nextAnswers);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswers[currentQuestionIndex] === -1) return;
    const nextStates = [...answeredStates];
    nextStates[currentQuestionIndex] = true;
    setAnsweredStates(nextStates);

    const correct = questions[currentQuestionIndex].correctOptionIndex;
    if (selectedAnswers[currentQuestionIndex] === correct) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(c => c + 1);
    } else {
      handleFinishSimulation();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(c => c - 1);
    }
  };

  const handleFinishSimulation = () => {
    setIsTimerRunning(false);
    setTestCompleted(true);
    
    // Evaluate if candidate qualifies for credential diploma (> 60% standard)
    const pct = Math.round((score / questions.length) * 100);
    if (pct >= 60) {
      const isGold = pct >= 90;
      const isSilver = pct >= 80;
      const medalType = isGold ? 'gold' : isSilver ? 'silver' : 'bronze';
      
      const certificateId = `cert-${Date.now()}-${Math.floor(Math.random()*1000)}`;
      const cert: Certificate = {
        id: certificateId,
        studentName: user ? user.name : 'Guest Scholar',
        classLevel: info.classLabel,
        subject: info.subjectLabel,
        category: `${info.subjectLabel} ${info.resourceLabel}`,
        score: score,
        totalQuestions: questions.length,
        medal: medalType as any,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        uniqueId: `IQ200-${Math.floor(100000 + Math.random() * 900000)}`,
        qrVerification: `https://iq200-olympiad-academy.global/#certificate/${certificateId}`
      };
      
      setUnlockedCertificate(cert);
      onSaveCertificate(cert);
      setFeedbackMsg(`Congratulations! Absolute triumph. You have qualified for an official ${medalType.toUpperCase()} Credential Code!`);
    } else {
      setFeedbackMsg(`Syllabus practice completed successfully. You scored ${pct}%. Score at least 60% on your subsequent run to redeem your Verified Medal Diploma.`);
    }
  };

  const handleReset = () => {
    setSelectedAnswers(new Array(questions.length).fill(-1));
    setAnsweredStates(new Array(questions.length).fill(false));
    setCurrentQuestionIndex(0);
    setScore(0);
    setTestCompleted(false);
    setUnlockedCertificate(null);
    setTimer(300);
    setIsTimerRunning(true);
  };

  const formattedTime = () => {
    const mins = Math.floor(timer / 60);
    const secs = timer % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Generate related dynamic resource linkages
  const getSubstitutes = () => {
    const classNum = info.classLevelNum;
    const subSlug = info.subjectKey;
    const items = [
      { label: 'MCQ Questions', slug: 'mcq' },
      { label: 'Practice Tests', slug: 'practice-tests' },
      { label: 'Olympiad Series', slug: 'olympiad-practice' },
      { label: 'Sample Papers', slug: 'sample-papers' }
    ].filter(v => v.slug !== info.resourceSlug);

    return items;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in fade-in duration-300">
      
      {/* 1. SEAMLESS INTERACTIVE SECTIONS & ACCESSIBLE BREADCRUMB */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => onNavigate('#syllabus')} 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors bg-white border border-slate-200 hover:border-indigo-100 rounded-xl px-3.5 py-2 shadow-sm"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Back to K-12 Catalog Index
        </button>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Syllabus-Aligned Dynamic Page
        </span>
      </div>

      {/* 2. DYNAMICAL SEO EXAM BANNER HERO */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 text-white shadow-lg text-left relative overflow-hidden space-y-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent)] pointer-events-none"></div>
        <div className="space-y-3 max-w-4xl relative z-10">
          <span className="bg-indigo-500/10 text-indigo-300 inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-indigo-400/20">
            {info.classLabel} &bull; {info.subjectLabel} Exam Preparation
          </span>
          <h1 className="text-2.5xl sm:text-4.5xl font-black tracking-tight leading-tight">
            Advanced {info.subjectLabel} {info.resourceLabel}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Boost performance results on upcoming evaluations. Study NCERT board topics, practice standard problem variations, and secure real certification awards kept securely in the centralized credential hub.
          </p>
        </div>

        {/* Dynamic Meta Tag Badges */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs border-t border-slate-800/80 z-10 relative">
          <span className="text-slate-400 font-medium">Keywords:</span>
          {[`#${info.subjectKey}-prep`, `#class-${info.classLevelNum}`, `#board-prep`, `#sample-answers`].map(kw => (
            <span key={kw} className="bg-slate-800/80 text-indigo-300 pointer-events-none text-[10px] sm:text-xs font-mono px-2.5 py-1 rounded-lg">
              {kw}
            </span>
          ))}
        </div>
      </section>

      {/* 3. CORE TWO COLUMN MAIN SECTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        
        {/* LEFT COLUMN: ACTIVE DIAGNOSTIC TEST PANEL */}
        <div className="lg:col-span-2 space-y-6">
          
          {!testCompleted ? (
            <div className="bg-white border border-slate-200/95 rounded-3xl shadow-sm overflow-hidden flex flex-col">
              
              {/* Test Session Header */}
              <div className="bg-slate-50/80 border-b border-slate-100 p-4 sm:px-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                    Progress: {currentQuestionIndex + 1} / {questions.length}
                  </span>
                  {selectedAnswers[currentQuestionIndex] !== -1 && (
                    <span className="text-emerald-600 text-xs font-semibold flex items-center gap-0.5">
                      <CheckCircle className="w-3.5 h-3.5" /> Checked
                    </span>
                  )}
                </div>
                
                {/* Timer Clock */}
                <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-100 rounded-xl px-3 py-1 text-rose-700 font-mono text-xs font-bold">
                  <Clock className="w-3.5 h-3.5 animate-pulse" />
                  <span>{formattedTime()}</span>
                </div>
              </div>

              {/* Assessment Question Content */}
              {questions.length > 0 ? (
                <div className="p-6 sm:p-8 space-y-6">
                  <div className="space-y-2">
                    <span className="bg-slate-100 text-slate-500 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md">
                      Subtopic: {questions[currentQuestionIndex].topic}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug whitespace-pre-line">
                      {questions[currentQuestionIndex].questionText}
                    </h3>
                  </div>

                  {/* Options List */}
                  <div className="space-y-3">
                    {questions[currentQuestionIndex].options.map((option, index) => {
                      const isSelected = selectedAnswers[currentQuestionIndex] === index;
                      const hasChecked = answeredStates[currentQuestionIndex];
                      const isCorrect = questions[currentQuestionIndex].correctOptionIndex === index;

                      let styleClasses = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700';
                      if (isSelected) {
                        styleClasses = 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-semibold';
                      }
                      if (hasChecked) {
                        if (isCorrect) {
                          styleClasses = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                        } else if (isSelected) {
                          styleClasses = 'border-rose-500 bg-rose-50 text-rose-900';
                        } else {
                          styleClasses = 'border-slate-100 bg-slate-50 text-slate-400 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={index}
                          disabled={hasChecked}
                          onClick={() => handleOptionSelect(index)}
                          className={`w-full p-4 text-xs font-medium rounded-2xl border text-left flex items-start justify-between gap-3 transition-all ${styleClasses}`}
                        >
                          <span>{option}</span>
                          {hasChecked && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />}
                          {hasChecked && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation feedback panel */}
                  {answeredStates[currentQuestionIndex] && (
                    <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-4.5 space-y-1.5">
                      <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider block">Method Explanation:</span>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {questions[currentQuestionIndex].explanation}
                      </p>
                    </div>
                  )}

                  {/* Interaction Control actions */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                    <button
                      disabled={currentQuestionIndex === 0}
                      onClick={handlePrev}
                      className="px-4 py-2 text-xs font-black text-slate-500 hover:text-slate-800 disabled:opacity-40 transition-colors"
                    >
                      &larr; Previous Item
                    </button>

                    <div className="flex items-center gap-2">
                      {!answeredStates[currentQuestionIndex] ? (
                        <button
                          disabled={selectedAnswers[currentQuestionIndex] === -1}
                          onClick={handleCheckAnswer}
                          className="bg-indigo-600 hover:bg-indigo-750 disabled:bg-slate-100 disabled:text-slate-400 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-100/50"
                        >
                          Submit Response
                        </button>
                      ) : (
                        <button
                          onClick={handleNext}
                          className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all"
                        >
                          {currentQuestionIndex === questions.length - 1 ? 'Analyze Outcomes' : 'Next Question &rarr;'}
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="p-12 text-center text-slate-400 font-mono text-xs">Generating analytical dynamic query syllabus arrays...</div>
              )}

            </div>
          ) : (
            /* COMPLETED SUMMARY DIAGNOSTICS */
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="text-center space-y-4 max-w-xl mx-auto py-4">
                <span className="bg-emerald-100 text-emerald-800 font-black uppercase tracking-wider text-[10px] px-3 py-1 rounded-full">
                  Exams Completed
                </span>
                <h3 className="text-2xl font-black text-slate-900">Evaluation Diagnostics Output</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Excellent focus on completing {info.classLabel} {info.subjectLabel} practice resources. Here is your structured compliance scorecard report.
                </p>

                {/* Performance Matrix Circle */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 grid grid-cols-2 gap-4">
                  <div className="text-center space-y-0.5">
                    <span className="text-3xl font-black text-indigo-600">{score} / {questions.length}</span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Correct Fields</p>
                  </div>
                  <div className="text-center space-y-0.5">
                    <span className="text-3xl font-black text-slate-800">{Math.round((score / questions.length) * 100)}%</span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Score</p>
                  </div>
                </div>
              </div>

              {/* Verified Certificate Award Output */}
              {unlockedCertificate ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 text-left">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] font-extrabold uppercase">
                      <Award className="w-3.5 h-3.5 fill-emerald-600" />
                      Diploma Generated
                    </div>
                    <h4 className="text-base font-black text-emerald-950">Credential Record Authenticated!</h4>
                    <p className="text-xs text-emerald-700 leading-relaxed max-w-md">
                      Congratulations to scholar <strong className="font-bold">{unlockedCertificate.studentName}</strong>. You scored over 60% and have unlocked a verifiable diploma for <strong className="font-bold">{info.classLabel} {info.subjectLabel}</strong> with code <strong className="font-mono">{unlockedCertificate.uniqueId}</strong>.
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('#certificates')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow transition-all shrink-0"
                  >
                    View in Certificate Vault
                  </button>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 text-center space-y-3">
                  <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
                    Score at least 60% (3 correct responses out of 5) on standard exercises to automatically generate a verifiable student printable certificate.
                  </p>
                  <button
                    onClick={handleReset}
                    className="bg-indigo-600 hover:bg-indigo-750 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all"
                  >
                    Attempt Test Retake
                  </button>
                </div>
              )}

              {/* FRIEND CHALLENGE DUEL GENERATOR */}
              <div id="friend-challenge-panel" className="bg-gradient-to-br from-indigo-50 to-indigo-150/40 border border-indigo-200 rounded-3xl p-6 text-left space-y-4 shadow-sm">
                <div className="space-y-1">
                  <h4 className="text-base font-black text-indigo-950 flex items-center gap-1.5 justify-start">
                    🎮 Challenge a Classmate!
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Generate an online multiplayer challenge link representing your <strong className="font-extrabold text-indigo-700">{score}/{questions.length}</strong> scorecard. Your friends can accept and answer the exact same questions to compete in real-time speed & accuracy.
                  </p>
                </div>

                {!challengeLink ? (
                  <button
                    onClick={handleCreateChallenge}
                    disabled={challengeLoading}
                    className="bg-indigo-600 hover:bg-indigo-750 disabled:opacity-50 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {challengeLoading ? 'Creating Combat Room...' : 'Generate challenge Link ⚡'}
                  </button>
                ) : (
                  <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={challengeLink}
                        className="bg-white border text-indigo-950 border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono font-semibold flex-1 select-all focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(challengeLink);
                          setChallengeCopied(true);
                          setTimeout(() => setChallengeCopied(false), 2000);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-black px-4 py-2.5 rounded-xl transition-all shrink-0 cursor-pointer"
                      >
                        {challengeCopied ? 'Copied!' : 'Copy Link'}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`🎯 I dare you to beat my score of ${score}/${questions.length} on the IQ200 Olympiad Assessment! Try here: `)}%20${encodeURIComponent(challengeLink)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] uppercase font-black tracking-wider py-1.5 px-3.5 rounded-lg flex items-center gap-1.5 cursor-pointer text-center"
                      >
                        WhatsApp Invite
                      </a>
                      <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(challengeLink)}&text=${encodeURIComponent(`Who is ready? I got ${score}/${questions.length} on IQ200. Dare to beat me! ⚡`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-slate-900 hover:bg-black text-white text-[10px] uppercase font-black tracking-wider py-1.5 px-3.5 rounded-lg flex items-center gap-1.5 cursor-pointer text-center"
                      >
                        X Share
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Question Audit List for thorough SEO comprehension */}
              <div className="space-y-4">
                <h4 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">Full Question Compliance Audit Log</h4>
                <div className="space-y-3">
                  {questions.map((q, idx) => {
                    const sel = selectedAnswers[idx];
                    const corr = q.correctOptionIndex;
                    const isCorr = sel === corr;
                    
                    return (
                      <div key={idx} className="bg-slate-50 rounded-2xl p-4 flex gap-4 text-xs">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${isCorr ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                          {idx + 1}
                        </span>
                        <div className="space-y-1.5 text-left flex-1">
                          <p className="font-bold text-slate-800 leading-snug">{q.questionText}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] font-semibold text-slate-500">
                            <div>Your response: <span className="text-slate-800">{sel !== -1 ? q.options[sel] : 'Skipped'}</span></div>
                            <div>Correct choice: <span className="text-emerald-700">{q.options[corr]}</span></div>
                          </div>
                          <p className="text-[10px] italic text-slate-400 font-medium bg-white p-2 border border-slate-200/50 rounded-lg">
                            Reason: {q.explanation}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3 rounded-2xl transition-all"
                >
                  Retake Examination
                </button>
                <button
                  onClick={() => onNavigate('#syllabus')}
                  className="flex-1 bg-white border border-slate-200 hover:border-indigo-100 hover:text-indigo-600 text-slate-700 font-extrabold text-xs py-3 rounded-2xl transition-all"
                >
                  Return to Syllabus Core
                </button>
              </div>

            </div>
          )}

        </div>

        {/* RIGHT COLUMN: SEARCH ENGINES & COMPLEMENTARY LINKS LINKING SILO */}
        <div className="space-y-6">
          
          {/* AdSense Side Pillar Placement */}
          <AdSenseComponent placement="sidebar" />

          {/* INTERNAL ROUTING LISTS - IMPORTANT SEO TRAFFIC INTERLINKING */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5.5 space-y-4">
            <h4 className="text-xs font-black uppercase text-indigo-600 tracking-wider">Related Resources & Material</h4>
            <div className="space-y-2">
              {getSubstitutes().map(v => {
                const subSlug = info.subjectKey;
                const linkCode = `class-${info.classLevelNum}-${subSlug}-${v.slug}`;
                return (
                  <a
                    key={v.slug}
                    href={`#${linkCode}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(`#${linkCode}`);
                    }}
                    className="p-3 bg-slate-50 hover:bg-slate-100 hover:border-indigo-100 rounded-2xl border border-slate-100 flex items-center justify-between transition-all group"
                  >
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-600 leading-none group-hover:text-indigo-600 block">
                        {info.classLabel} {info.subjectLabel}
                      </span>
                      <p className="text-xs font-bold text-slate-800 leading-normal">{v.label}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* CROSS GRADED HYPERLINKING SILO */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5.5 space-y-4">
            <h4 className="text-xs font-black uppercase text-indigo-600 tracking-wider">Alternate Grade Syllabus</h4>
            <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
              Quickly pivot to higher or lower grades to test matching subjects across different complexities.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              {Array.from({ length: 9 }).map((_, i) => {
                const num = i + 2;
                if (String(num) === info.classLevelNum) return null;
                const altSlug = `class-${num}-${info.subjectKey}-${info.resourceSlug}`;
                return (
                  <a
                    key={num}
                    href={`#${altSlug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(`#${altSlug}`);
                    }}
                    className="bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-indigo-100 p-2 rounded-xl text-center text-slate-700 hover:text-indigo-600 block transition-all"
                  >
                    Class {num} Prep
                  </a>
                );
              })}
            </div>
          </div>

          {/* EDUCATOR FEEDBACK OR INTEGRATION ADVERTISEMENT */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5.5 space-y-3">
            <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4.5 h-4.5 text-indigo-600" />
              Syllabus Auditing
            </h4>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Found a spelling or computational typo in our Grade {info.classLevelNum} syllabus resources? Share feedback instantly with the school validator board using our inquiries engine.
            </p>
            <button
              onClick={() => onNavigate('#contact')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[10px] uppercase py-2.5 rounded-xl transition-all tracking-wider"
            >
              Report Typo Or Request Topic
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
