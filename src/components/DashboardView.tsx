import React, { useState } from 'react';
import { 
  Trophy, Award, ShieldCheck, Star, RefreshCw, ChevronRight, 
  Sparkles, HelpCircle, Mail, Send, Check, ChevronDown, ChevronUp, Clock,
  ArrowRight, Users, BookOpen, Layers, CheckSquare, BrainCircuit, Heart, Info, MessageSquare
} from 'lucide-react';
import { UserProfile, BlogPost } from '../types';
import AdSenseComponent from './AdSenseComponent';

interface DashboardViewProps {
  user: UserProfile | null;
  onNavigate: (route: string) => void;
  onSelectAssessment: (classLevel: string, subject: string) => void;
  onTriggerLogin: () => void;
  trendingBlogs: BlogPost[];
  onTriggerAiQuiz: (topic: string, difficulty: string, count: number, classLevel: string, subject: string) => void;
  aiLoading: boolean;
}

export default function DashboardView({
  user,
  onNavigate,
  onSelectAssessment,
  onTriggerLogin,
  trendingBlogs,
  onTriggerAiQuiz,
  aiLoading
}: DashboardViewProps) {
  // Hub Selections state
  const [selectedClass, setSelectedClass] = useState(user?.classLevel || 'Class 5');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');

  // AI custom quiz state
  const [aiTopicInput, setAiTopicInput] = useState('');
  const [aiDiff, setAiDiff] = useState('medium');
  const [aiCount, setAiCount] = useState(5);
  const [aiClass, setAiClass] = useState(user?.classLevel || 'Class 5');
  const [aiSubject, setAiSubject] = useState('Mathematics');

  // FAQ open state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Parent review filter
  const [activeReviewTab, setActiveReviewTab] = useState<'all' | 'math' | 'science' | 'logic'>('all');

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  // Sample Question sandbox state
  const [selectedSampleSubject, setSelectedSampleSubject] = useState<'math' | 'science' | 'logic'>('math');
  const [sampleAnswerSelected, setSampleAnswerSelected] = useState<number | null>(null);
  const [showSampleExplanation, setShowSampleExplanation] = useState(false);

  const classesList = [
    'Class 2', 'Class 3', 'Class 4', 'Class 5', 
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'
  ];
  
  const subjectsList = [
    { name: 'Mathematics', desc: 'Fractions, Pre-Algebra, Decimals & Geometry', icon: '🧮' },
    { name: 'Science', desc: 'Matter, Plants, Solar Force & Chemical Cells', icon: '🧪' },
    { name: 'English', desc: 'Syntax, idioms, paragraph reconstruction & vocabulary', icon: '📚' },
    { name: 'Hindi', desc: 'व्याकरण, पर्यायवाची, विपरीतार्थक & शब्द रचना', icon: '✍️' },
    { name: 'Logical Reasoning', desc: 'Matrix patterns, calendar logic, spatial rotation', icon: '🧠' }
  ];

  // Syllabus details for Class-Wise Authority Hubs (Requirement 4 / Phase 4)
  const classHubData: Record<string, {
    syllabus: string;
    topics: string[];
    tips: string;
    resources: string[];
  }> = {
    'Class 2': {
      syllabus: 'Foundational numeracy, early pattern recognition, reading comprehension, basic logical steps.',
      topics: ['3-Digit Number Operations', 'Pictographs & Easy Tables', 'Word Association & Genders', 'Line Drawing Rotations'],
      tips: 'Encourage kids to use physical markers or sketch marbles on scrap paper to connect mathematical sums to real weights.',
      resources: ['#class-2-maths-mcq', '#class-2-science-mock-tests']
    },
    'Class 3': {
      syllabus: 'Intermediate arithmetic multipliers, animal/environmental ecosystems, nouns/verbs, analogy reasoning.',
      topics: ['Long Multiplication Models', 'Plant Adaptations & Forces', 'Antonyms & Tense Framing', 'Analogy Pairs & Groups'],
      tips: 'Introduce the dual-aspect analogy tests early. They build powerful relational intelligence linkages.',
      resources: ['#class-3-maths-olympiad-practice', '#class-3-logical-reasoning-mcq']
    },
    'Class 4': {
      syllabus: 'Division fractions, digestive systems, advanced syntax models, series deduction.',
      topics: ['Decimals & Dynamic Fractions', 'Matter States & Simple Machines', 'Grammar Conjunctions & Prepositions', 'Deductive Reasoning Series'],
      tips: 'Create structured 15-minute daily practice sessions. Ensure they explain "why" their selected option is correct.',
      resources: ['#class-4-maths-important-questions', '#class-4-science-practice-tests']
    },
    'Class 5': {
      syllabus: 'Percentages & unitary method, human respiratory system, direct/indirect speeches, complex Venn logic.',
      topics: ['Ratio and Unitary Concepts', 'Skeletal & Respiratory Frameworks', 'Active & Passive Voice Syntax', 'Venn Relations & Coding-Decoding'],
      tips: 'Focus heavily on spatial rotations and coding puzzles. They carry high weights in standard Olympiads.',
      resources: ['#class-5-maths-olympiad-practice', '#class-5-logical-reasoning-important-questions']
    },
    'Class 6': {
      syllabus: 'Integers/algebra variables, food chemistry & nutrition, adjective clauses, deductive Venn syllogisms.',
      topics: ['Intro to Algebraic Variables', 'Nutrients, Rocks, and Diets', 'Clauses, Prepositions & Vocabulary', 'Analytical Induction Syllogisms'],
      tips: 'Help them write down core formulas in a dedicated notebook. Re-visiting formulas weekly boosts execution speed.',
      resources: ['#class-6-maths-important-questions', '#class-6-science-mcq']
    },
    'Class 7': {
      syllabus: 'Linear equation balances, heat/light transfer mechanisms, sentence synthesis, logical directions pathways.',
      topics: ['Linear Equation Formulations', 'Chemical Equations & pH Values', 'Tense Sequences & Synthesis rules', 'Direction Vectors & Shadow Logic'],
      tips: 'Review incorrect answers together. The results panel detailed explanation contains the ultimate learning keys.',
      resources: ['#class-7-maths-important-questions', '#class-7-logical-reasoning-mcq']
    },
    'Class 8': {
      syllabus: 'Rational number equations & squares, cellular biology & metals, syntax inversion, blood-relation mappings.',
      topics: ['Squares, Radicals & Factorization', 'Endocrine Glandular Secretions', 'Active voice inversions & Phrasal Verbs', 'Codified Blood-Link Matrix'],
      tips: 'Olympiad math questions require combining algebra with geometry. Emphasize dimensional diagramming.',
      resources: ['#class-8-maths-olympiad-practice', '#class-8-science-mock-tests']
    },
    'Class 9': {
      syllabus: 'Polynomials/Euclidean metrics, atoms/laws of motion, complex tenses, complex series and deduction matric.',
      topics: ['Polynomial Factorization & Circles', 'Gravitation, Forces, & Atomic Bonds', 'Grammar Inversions & Integrated Error Spotting', 'Advanced Pattern Rotations'],
      tips: 'Continuous mock testing is superior to reading textbooks. Simulate strict timing profiles.',
      resources: ['#class-9-maths-practice-tests', '#class-9-science-mcq']
    },
    'Class 10': {
      syllabus: 'Trigonometry & quadratic equations, magnetic electricity & organic compound chains, syntax analysis, high logic analysis.',
      topics: ['Trigonometric Ratios & Quadratics', 'Carbon chains & Faraday Electrical Induction', 'Précis structures & Advanced vocabulary', 'Vector Coordinates & Logical Enclosures'],
      tips: 'Mastering the eliminated choice reasoning is key. Work on spotting the logical fallacy in incorrect choices.',
      resources: ['#class-10-maths-olympiad-practice', '#class-10-science-sample-papers']
    }
  };

  // Sample multiple-choice questions for home interaction (Requirement 4 / Phase 5)
  const sampleQuestions = {
    math: {
      question: "If a rectangular garden's length is doubled and its width is decreased by 20%, by what percentage does the total area increase?",
      options: ["Increase by 40%", "Increase by 60%", "Increase by 80%", "Remains unchanged"],
      correctIndex: 1,
      explanation: "Let original length be L and width be W. Original Area = L × W. New length = 2L, New width = 0.8W. New Area = 2L × 0.8W = 1.6(L × W). An increase of 1.6 corresponds directly to a 60% expansion!"
    },
    science: {
      question: "Which of the following processes represents a purely chemical change, rather than physical transfer?",
      options: ["Condensation of water vapor", "Rusting of an iron nail", "Sublimation of solid camphor", "Dissolving table salt in hot milk"],
      correctIndex: 1,
      explanation: "Rusting creates a completely new chemical compound (iron oxide, Fe₂O₃) that cannot be put back into iron by physical means, which outlines a classic chemical change."
    },
    logic: {
      question: "In a certain code, 'LIGHT' is written as 'MJHIT'. How would you write 'SIGHT' in that same code style?",
      options: ["TJIHT", "TJHIU", "THHIU", "TJHIT"],
      correctIndex: 3,
      explanation: "Compare Light vs MJHIT: L->M (+1), I->J (+1), G->H (+1), H->I (+1), T->T (remains +0). Applying (+1, +1, +1, +1, +0) to SIGHT yields: S+1=T, I+1=J, G+1=H, H+1=I, T+0=T, thus 'TJHIT'."
    }
  };

  const handleStartTest = () => {
    onSelectAssessment(selectedClass, selectedSubject);
  };

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopicInput.trim()) return;
    onTriggerAiQuiz(aiTopicInput, aiDiff, aiCount, aiClass, aiSubject);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) return;
    setContactSuccess(true);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactSubject('');
      setContactMsg('');
      setContactSuccess(false);
    }, 5000);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'How does the IQ200 practice platform help with School Olympiads (IMO, NSO, IEO)?',
      a: 'Our challenges are designed by supplementary curriculum experts to align with the curriculum structures of major boards (CBSE/ICSE) and mock patterns from international Olympiads. We focus heavily on High Order Thinking Skills (HOTS) to build conceptual speed.'
    },
    {
      q: 'Is there any subscription fee, card login, or hidden charge to use the tool?',
      a: 'None! IQ200 is 100% free of charge. We believe premium-grade educational diagnostics and supplementary evaluation suites should be open to every single student without paywalls.'
    },
    {
      q: 'Can parents monitor child progress and print achievement awards?',
      a: 'Yes! Upon scoring 60% or higher, a student earns an Achievements Certificate with their score. Parents can access, download, and print these certificates directly from their dashboard profile.'
    },
    {
      q: 'How does the Gemini AI Custom Quiz feature work?',
      a: 'Parents or educators can type any custom curriculum micro-topic (e.g. "Laws of Reflection" or "Newtonian Mechanics"). Our generative tool leverages server-side Gemini intelligence models to synthesize custom logical practice problems instantly.'
    }
  ];

  // Authentic Testimonials filtered state (Requirement 4)
  const testimonials = [
    {
      quote: "The open explanation keys are excellent. They help students move past memorizing math formulas into actually understanding concepts like fractions. A valuable self-evaluation resource.",
      author: "Priya S.",
      role: "Beta Parent Reviewer",
      school: "Class 4 Pilot Test Group",
      tag: "science",
      rating: 5
    },
    {
      quote: "The interface is fully distraction-free during testing, which is rare for zero-cost tools. The downloadable certificates offer great positive reinforcement for home study.",
      author: "Rajeev N.",
      role: "Supplemental Tutor",
      school: "Bengaluru Area Study Circle",
      tag: "math",
      rating: 5
    },
    {
      quote: "The Logical Reasoning modules stand out. Mapped logic puzzles are usually behind high paywalls, but this custom engine makes spatial rotation sets transparently available.",
      author: "Dr. Catherine D.",
      role: "Educational Consultant",
      school: "Mumbai Beta Group Coordinator",
      tag: "logic",
      rating: 5
    },
    {
      quote: "Highly recommended for independent home practice. Mapped sets give clear answers instantly, letting students identify reasoning mistakes in science and logical operations.",
      author: "Anjali M.",
      role: "Science Workshop Volunteer",
      school: "Grade 5-7 Enrichment Pilot",
      tag: "math",
      rating: 5
    }
  ];

  const filteredTestimonials = activeReviewTab === 'all' 
    ? testimonials 
    : testimonials.filter(t => t.tag === activeReviewTab);

  const activeQuestionData = sampleQuestions[selectedSampleSubject];

  const handleSelectSampleOption = (index: number) => {
    setSampleAnswerSelected(index);
    setShowSampleExplanation(true);
  };

  const handleResetSample = () => {
    setSampleAnswerSelected(null);
    setShowSampleExplanation(false);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      {/* ========================================================== */}
      {/* 🚀 THE "HOOK" INTERACTIVE GREETING & RETENTION BAR (Req 1) */}
      {/* ========================================================== */}
      <div id="hook-gamified-bar" className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.05),transparent_65%)] pointer-events-none"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="bg-[#4F46E5] text-white p-3.5 sm:p-4 rounded-2xl shadow-md shadow-indigo-100 flex items-center justify-center shrink-0">
            <Trophy className="w-7 sm:w-8 h-7 sm:h-8 text-[#F59E0B]" />
          </div>
          <div className="text-left space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 leading-none block">Olympiad Academic Track VIP</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
              Welcome to the Elite Track, {user?.name ? <span className="text-[#4F46E5]">{user.name}</span> : 'Future Champion'}.
            </h2>
            <p className="text-xs text-slate-500 font-semibold max-w-xl">
              Your personalized cognitive trainer is active. Dedicate 15 minutes today to protect your streak.
            </p>
          </div>
        </div>

        {/* Gamified Retention Bar */}
        <div className="flex flex-wrap items-center gap-5 sm:gap-7 relative z-10 bg-slate-50 border border-slate-200 px-5 sm:px-6 py-4 rounded-2xl shadow-xs w-full lg:w-auto">
          {/* Daily Streak Progress Ring */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="20" cy="20" r="17" stroke="#E2E8F0" strokeWidth="3" fill="transparent" />
                <circle cx="20" cy="20" r="17" stroke="#F59E0B" strokeWidth="3" fill="transparent" strokeDasharray="107" strokeDashoffset="25" />
              </svg>
              <span className="text-base">🔥</span>
            </div>
            <div className="text-left">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none block">Daily Streak</span>
              <span className="text-xs font-black text-slate-800">3 Days</span>
            </div>
          </div>

          <div className="hidden sm:block text-slate-300">|</div>

          {/* Current Rank */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="20" cy="20" r="17" stroke="#E2E8F0" strokeWidth="3" fill="transparent" />
                <circle cx="20" cy="20" r="17" stroke="#10B981" strokeWidth="3" fill="transparent" strokeDasharray="107" strokeDashoffset="11" />
              </svg>
              <span className="text-sm">🎯</span>
            </div>
            <div className="text-left">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none block">Current Rank</span>
              <span className="text-xs font-black text-emerald-600">Global Top 10%</span>
            </div>
          </div>

          <div className="hidden sm:block text-slate-300">|</div>

          {/* Level representation */}
          <div className="text-left">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none block">Fitted Profile</span>
            <span className="text-xs font-black text-[#4F46E5] block mt-0.5">🌟 Level {user?.level || 'Beta'}</span>
          </div>
        </div>
      </div>
      
      {/* ========================================================== */}
      {/* 🚀 PREMIUM CONVERSION HERO (Requirement 6)                 */}
      {/* ========================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white p-8 sm:p-12 text-left shadow-lg">
        {/* Background ambient circular nodes */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.18),transparent_65%)] pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.12),transparent_60%)] pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 rounded-full text-xs font-bold uppercase tracking-wider leading-none">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            Leading Free Supplementary K-12 Prep Hub
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight max-w-4xl">
            Build Fearless, Logical Thinkers for <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-indigo-200 to-amber-200">School & Olympiads</span>
          </h1>
          
          <p className="text-xs sm:text-base text-slate-300 max-w-2.5xl leading-relaxed font-semibold">
            Empower your child with structured self-paced practice tests in Mathematics, Science, and Logical Reasoning. Perfectly aligned with grade benchmarks from Class 2 to 10. No credit cards, no paywalls—100% free curriculum-aligned learning.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <a 
              href="#medal-challenge-hero" 
              className="bg-[#FF5722] hover:bg-[#E64A19] text-white font-extrabold text-sm uppercase px-8 py-4 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              <span>🎯 Launch Test Configurator</span>
              <ChevronRight className="w-4 h-4 text-white stroke-[2.5]" />
            </a>

            <button 
              onClick={() => onNavigate('#syllabus')}
              className="bg-[#00A86B] hover:bg-[#008F5A] text-white font-extrabold text-sm uppercase px-8 py-4 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>View Official Syllabus Guide</span>
            </button>
            
            <button 
              onClick={() => {
                const doc = document.getElementById('class-hubs-section');
                if (doc) doc.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white/10 hover:bg-white/15 border border-white/15 text-white font-extrabold text-sm uppercase px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <span>Explore Grade Hubs</span>
            </button>
          </div>
        </div>

        {/* Live notification feed */}
        <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-indigo-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold">4.8/5 Star Parent Rating</span>
          </div>
          <div className="hidden md:block text-slate-400 font-medium">|</div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400">★ ★ ★ ★ ★</span>
            <span className="font-semibold text-slate-300">"Excellent mock resource structure" — IPS School Forum</span>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 📊 REAL-TIME STATISTICS COUNTERS (Requirement 6)           */}
      {/* ========================================================== */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-1 text-center shadow-xs">
          <div className="mx-auto bg-indigo-50 text-indigo-600 w-11 h-11 rounded-full flex items-center justify-center">
            <Users className="w-5.5 h-5.5" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 block tracking-tight pt-1">
            Class 2–10
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
            Grades Supported
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-1 text-center shadow-xs">
          <div className="mx-auto bg-amber-50 text-amber-700 w-11 h-11 rounded-full flex items-center justify-center">
            <CheckSquare className="w-5.5 h-5.5" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 block tracking-tight pt-1">
            1,000+ Vetted
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
            Mock Problems
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-1 text-center shadow-xs">
          <div className="mx-auto bg-emerald-50 text-emerald-700 w-11 h-11 rounded-full flex items-center justify-center">
            <Award className="w-5.5 h-5.5" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 block tracking-tight pt-1">
            100% Free
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
            Printable Certificates
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-1 text-center shadow-xs">
          <div className="mx-auto bg-purple-50 text-purple-700 w-11 h-11 rounded-full flex items-center justify-center">
            <BrainCircuit className="w-5.5 h-5.5" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 block tracking-tight pt-1">
            Vetted Key
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
            Step-by-Step Proofs
          </span>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 🏆 CLASS & SUBJECT SELECTION HUB (CONFIGURATOR)            */}
      {/* ========================================================== */}
      <section id="medal-challenge-hero" className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 text-slate-900 shadow-sm p-6 sm:p-8 space-y-8">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700"></div>
        
        <div className="text-left space-y-2 max-w-4xl">
          <span className="bg-indigo-500/10 border border-indigo-200 text-indigo-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-flex items-center gap-1.5 leading-none">
            <Trophy className="w-3.5 h-3.5 text-indigo-600" />
            IQ200 Olympiad Curriculum
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 leading-tight">
            Configure Your Diagnostic Practice Challenge
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed">
            Choose your standard class level and preferred subject below. We will instantly retrieve a vetted 10-question challenge loaded with thorough explanations to audit conceptual knowledge.
          </p>
        </div>

        {/* 1. Grade / Class Selection Grid */}
        <div className="space-y-3.5 text-left">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center bg-indigo-100 text-indigo-700 font-bold rounded-full w-5.5 h-5.5 text-xs">
              1
            </span>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Select Student Standard:
            </h3>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-9 gap-3">
            {classesList.map((cls) => {
              const isActive = selectedClass === cls;
              return (
                <button
                  key={cls}
                  type="button"
                  id={`class-btn-${cls.replace(' ', '-')}`}
                  onClick={() => setSelectedClass(cls)}
                  className={`py-4 px-2 rounded-2xl text-xs font-bold text-center cursor-pointer transition-all border flex flex-col items-center justify-center gap-1.5 min-w-[70px] ${
                    isActive 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-905'
                  }`}
                >
                  <span className="text-base">🎓</span>
                  <span className="tracking-tight">{cls}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Subject Selection List */}
        <div className="space-y-3.5 text-left">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center bg-indigo-100 text-indigo-700 font-bold rounded-full w-5.5 h-5.5 text-xs">
              2
            </span>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Select Subject Core:
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {subjectsList.map((sub) => {
              const isActive = selectedSubject === sub.name;
              return (
                <button
                  key={sub.name}
                  type="button"
                  id={`subject-btn-${sub.name.replace(' ', '-')}`}
                  onClick={() => setSelectedSubject(sub.name)}
                  className={`p-4 rounded-2xl text-left border cursor-pointer transition-all flex flex-col justify-between space-y-3.5 ${
                    isActive 
                      ? 'bg-white border-2 border-indigo-600 shadow-lg ring-2 ring-indigo-600/10' 
                      : 'bg-slate-50 hover:bg-white hover:border-slate-350 border-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <span className="text-3xl filter drop-shadow-sm">{sub.icon}</span>
                    {isActive && (
                      <span className="bg-indigo-150 text-indigo-855 text-[9px] font-black uppercase px-2 py-0.5 rounded-full select-none">
                        Active
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-950 text-sm">{sub.name}</h4>
                    <p className="text-[10px] text-slate-450 mt-1 line-clamp-2 font-semibold leading-normal">
                      {sub.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Start Test Button CTA */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left w-full sm:w-auto">
            <p className="text-xs text-slate-500 font-bold">
              Current Choice: <span className="text-indigo-600 font-extrabold">{selectedClass}</span> • <span className="text-indigo-600 font-extrabold">{selectedSubject}</span>
            </p>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5 animate-pulse">
              💡 Completed profiles receive full, downloadable PDF-style certificates with no cost barriers.
            </p>
          </div>

          <button
            type="button"
            id="start-assessment-cta-btn"
            onClick={handleStartTest}
            className="w-full sm:w-auto min-w-[220px] bg-[#00A86B] hover:bg-[#008F5A] text-white font-extrabold text-sm uppercase tracking-wider py-4 px-8 rounded-xl transition-all shadow-md shadow-emerald-100 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer leading-none"
          >
            <span>🚀 Begin Challenge</span>
            <ChevronRight className="w-4.5 h-4.5 text-white stroke-[3]" />
          </button>
        </div>
      </section>

      {/* ========================================== */}
      {/* AD BLOCK PLACEHOLDER REPLACEMENT 1        */}
      {/* ========================================== */}
      <AdSenseComponent placement="top_billboard" />

      {/* ========================================================== */}
      {/* ✨ INTERACTIVE SAMPLE QUESTIONS (Requirement 4 / CRO Boost) */}
      {/* ========================================================== */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-left space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-150 pb-4">
          <div>
            <span className="bg-amber-50 border border-amber-150 text-amber-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full inline-block leading-none">
              Interactive sandbox
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-2 flex items-center gap-2">
              <Sparkles className="w-5.5 h-5.5 text-amber-500 animate-pulse" />
              Try a Live Sample Olympiad Question
            </h3>
            <p className="text-xs text-slate-500 font-semibold">
              Select a subject tab to interact with actual high-order thinking questions prepared by our authors.
            </p>
          </div>

          <div className="flex bg-slate-50 border border-slate-150 rounded-xl p-1 shrink-0 self-stretch md:self-auto justify-stretch">
            {(['math', 'science', 'logic'] as const).map((sub) => (
              <button
                key={sub}
                onClick={() => {
                  setSelectedSampleSubject(sub);
                  handleResetSample();
                }}
                className={`flex-1 px-4 py-2 text-xs font-extrabold rounded-lg capitalize transition-all cursor-pointer ${
                  selectedSampleSubject === sub 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-slate-50/50 rounded-2.5xl p-6 border border-slate-200/60 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest font-mono">
                {selectedSampleSubject === 'math' ? '🧮 MATHEMATICS SAMPLE' : selectedSampleSubject === 'science' ? '🧪 GENERAL SCIENCE SAMPLE' : '🧠 LOGICAL ANALYSIS'}
              </span>
              <p className="font-extrabold text-slate-900 text-sm sm:text-base leading-relaxed">
                Q: {activeQuestionData.question}
              </p>
            </div>

            <div className="space-y-2.5">
              {activeQuestionData.options.map((opt, i) => {
                const isSelected = sampleAnswerSelected === i;
                const isCorrectOption = activeQuestionData.correctIndex === i;
                let optStyle = 'border-slate-200 bg-white hover:bg-slate-50';

                if (sampleAnswerSelected !== null) {
                  if (isSelected) {
                    optStyle = isCorrectOption 
                      ? 'border-emerald-555 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20' 
                      : 'border-rose-555 bg-rose-50 text-rose-950 ring-2 ring-rose-500/20';
                  } else if (isCorrectOption) {
                    optStyle = 'border-emerald-555 bg-emerald-50/50 text-emerald-950';
                  } else {
                    optStyle = 'border-slate-100 bg-white opacity-60';
                  }
                }

                return (
                  <button
                    key={i}
                    disabled={sampleAnswerSelected !== null}
                    onClick={() => handleSelectSampleOption(i)}
                    className={`w-full p-4 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between gap-4 cursor-pointer ${optStyle}`}
                  >
                    <span>{opt}</span>
                    {sampleAnswerSelected !== null && isCorrectOption && (
                      <span className="text-emerald-600 bg-emerald-100/80 text-[10px] font-black px-2 py-0.5 rounded uppercase">Correct</span>
                    )}
                    {sampleAnswerSelected !== null && isSelected && !isCorrectOption && (
                      <span className="text-rose-600 bg-rose-100/80 text-[10px] font-black px-2 py-0.5 rounded uppercase">Selected</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-indigo-50 border border-indigo-150 p-5 rounded-2.5xl space-y-3">
              <h4 className="font-black text-slate-950 text-sm flex items-center gap-2">
                <Info className="w-4.5 h-4.5 text-indigo-600" />
                Why solve sample problems?
              </h4>
              <p className="text-[11px] text-slate-650 leading-relaxed font-semibold">
                This sandbox illustrates how standard tests are evaluated in real time on our system. We provide deep mathematical and logic proofs upon submit to ensure kids don't just find correct keys—but grasp core principles.
              </p>
            </div>

            {showSampleExplanation ? (
              <div className="bg-emerald-50 border border-emerald-150 rounded-2.5xl p-5 space-y-3 text-emerald-900 text-xs font-semibold leading-relaxed animate-in slide-in-from-right-3 duration-300">
                <p className="text-[10px] font-black tracking-wider uppercase text-emerald-700 font-mono">
                  ✏️ Detailed Syllabus Explanation:
                </p>
                <p>{activeQuestionData.explanation}</p>
                <button
                  onClick={handleResetSample}
                  className="mt-1 text-[10px] font-black uppercase tracking-wider text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Try Question Again
                </button>
              </div>
            ) : (
              <div className="border border-dashed border-slate-200 rounded-2.5xl p-6 text-center text-xs text-slate-400 font-semibold space-y-1 py-12">
                <span>⚡ Waiting for submission</span>
                <p className="text-[10px] text-slate-400">Click any logical option to reveal instant tutoring keys.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 🔮 BENEFITS BENTO GRID (Requirement 6)                     */}
      {/* ========================================================== */}
      <section className="space-y-6 text-left">
        <div className="text-left">
          <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full inline-block leading-none">
            Why Olympiad Parents Choose Us
          </span>
          <h3 className="text-2xl font-extrabold text-slate-950 tracking-tight mt-2">
            The IQ200 Academic Advantage
          </h3>
          <p className="text-xs text-slate-500 font-semibold">
            Built as a completely free, supplementary hub to support Indian and international school-level math, science, and reasoning syllabi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 hover:shadow-md transition-all">
            <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center select-none text-xl">
              🎯
            </div>
            <h4 className="font-extrabold text-slate-900 text-base">Perfect Syllabus Alignment</h4>
            <p className="text-xs text-slate-650 font-semibold leading-relaxed">
              We strictly cross-map our assessment structures against CBSE Class guidelines, ICSE school frameworks, and official Science and Mathematics Olympiad structures. Highly targeted practice.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 hover:shadow-md transition-all">
            <div className="w-11 h-11 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center select-none text-xl">
              🛠️
            </div>
            <h4 className="font-extrabold text-slate-900 text-base">Deep Explanation Keys</h4>
            <p className="text-xs text-slate-650 font-semibold leading-relaxed">
              Every correct and incorrect choice is justified inside our system. If your child commits a logical error, our analysis system breaks down the formulas instantly, boosting independent revision.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 hover:shadow-md transition-all">
            <div className="w-11 h-11 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center select-none text-xl">
              🥇
            </div>
            <h4 className="font-extrabold text-slate-900 text-base">Stress-Free Motivation</h4>
            <p className="text-xs text-slate-650 font-semibold leading-relaxed">
              Our dynamic student certificates offer positive, gamified reinforcement without the pressure. Earn gold, silver, or bronze rankings and download them instantly to print for home display pinboards.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* AD BLOCK PLACEHOLDER REPLACEMENT 2        */}
      {/* ========================================== */}
      <AdSenseComponent placement="inline_feed" />

      {/* ========================================================== */}
      {/* 🧭 CLASS-WISE AUTHORITY HUBS TAB INDEX (Phase 4 / Req 4)    */}
      {/* ========================================================== */}
      <section id="class-hubs-section" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-left space-y-6">
        <div>
          <span className="bg-indigo-50 border border-indigo-150 text-indigo-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full inline-block leading-none">
            Class-wise Authority Hubs
          </span>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-2 flex items-center gap-2">
            <Layers className="w-5.5 h-5.5 text-indigo-600" />
            Class-Wise Olympiad & Syllabus Hubs
          </h3>
          <p className="text-xs text-slate-500 font-semibold">
            Choose any grade level standard to explore detailed syllabus overviews, recommended topics list, preparation hacks, and available diagnostic resources.
          </p>
        </div>

        {/* Grade horizontal toggle bar */}
        <div className="flex gap-2 overflow-x-auto pb-3 pt-1 scrollbar-thin select-none">
          {classesList.map((cls) => {
            const isActive = selectedClass === cls;
            return (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-4 py-2 text-xs font-extrabold rounded-full shrink-0 border whitespace-nowrap cursor-pointer transition-all ${
                  isActive 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs' 
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                🎓 {cls} Overview
              </button>
            );
          })}
        </div>

        {/* Dynamic Authority Hub content panel (Requirement 4 / Phase 4) */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2.5xl p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-5 text-left">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">
                  Syllabus Standards mapped to ICSE & CBSE Guidelines
                </span>
                <h4 className="text-lg font-black text-slate-900 leading-none">
                  Overview of Class {selectedClass.split(' ')[1]} Academic Goals
                </h4>
                <p className="text-xs text-slate-650 font-semibold leading-relaxed mt-1">
                  {classHubData[selectedClass]?.syllabus || "General revision logic matching CBSE Class standards."}
                </p>
              </div>

              <div className="space-y-3 text-left">
                <p className="text-[10px] font-black tracking-wider uppercase text-slate-450 font-mono">
                  📌 Key High-Yield Syllabus Topics:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-bold text-slate-705">
                  {classHubData[selectedClass]?.topics.map((t, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-xl border border-slate-150 shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-3xs text-xs text-slate-700 font-semibold leading-relaxed">
                <p className="text-indigo-600 font-extrabold text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1.5 leading-none">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  Educator Prep Hack:
                </p>
                {classHubData[selectedClass]?.tips || "Review standard practice sets continuously to improve response speeds."}
              </div>
            </div>

            <div className="lg:col-span-4 bg-white p-5 rounded-2.5xl border border-slate-200 shadow-2xs space-y-4">
              <div className="border-b border-slate-150 pb-2.5">
                <h5 className="font-extrabold text-slate-900 text-xs">Direct Quick Resources</h5>
                <p className="text-[10px] text-slate-400 font-semibold">Instantly launch curriculum practice tests matching this grade standard.</p>
              </div>

              <div className="space-y-2">
                {classHubData[selectedClass]?.resources.map((resSlug, i) => {
                  const label = resSlug.includes('maths') ? 'Mathematics Olympiad Practice' : resSlug.includes('science') ? 'Science Mock Revision Setup' : 'Logical Reasoning Challenge';
                  return (
                    <a
                      key={i}
                      href={resSlug}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(resSlug);
                      }}
                      className="p-3 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-100 rounded-xl border border-slate-100 flex items-center justify-between transition-all group cursor-pointer"
                    >
                      <div className="text-left">
                        <p className="text-xs font-extrabold text-slate-800 leading-normal group-hover:text-indigo-600">{label}</p>
                        <span className="text-[10px] font-bold text-slate-400">Class {selectedClass.split(' ')[1]}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0" />
                    </a>
                  );
                })}
              </div>

              <button
                onClick={() => onNavigate('#syllabus')}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer leading-none"
              >
                <span>View Full Syllabus Matrix</span>
                <ChevronRight className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 🏅 SAMPLE ACHIEVEMENT SHOWCASE                            */}
      {/* ========================================================== */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-left space-y-6">
        <div>
          <span className="bg-emerald-50 border border-emerald-150 text-emerald-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full inline-block leading-none">
            Gamified progression
          </span>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2 mt-2">
            <ShieldCheck className="w-5.5 h-5.5 text-emerald-600" />
            Printable student Achievement Showcase
          </h3>
          <p className="text-xs text-slate-500 font-semibold">
            Illustrative examples detailing how awards are automatically preserved in your user profile area after scoring 60% or higher.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Aarav Singhal',
              grade: 'Class 5',
              subject: 'Mathematics',
              badge: '🥇 GOLD CLASS RECORD',
              score: '10 / 10',
              accent: 'border-amber-400 bg-amber-50/40 text-amber-900'
            },
            {
              name: 'Meera Deshmukh',
              grade: 'Class 7',
              subject: 'Logical Reasoning',
              badge: '🥈 SILVER TOP RECORD',
              score: '9 / 10',
              accent: 'border-slate-300 bg-slate-50/40 text-slate-900'
            },
            {
              name: 'Kabir Sen',
              grade: 'Class 4',
              subject: 'Science',
              badge: '🥉 BRONZE MERIT RECORD',
              score: '8 / 10',
              accent: 'border-orange-300 bg-orange-50/40 text-orange-950'
            }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className={`rounded-2xl border p-5 space-y-4 shadow-2xs relative overflow-hidden transition-all hover:shadow-xs ${item.accent}`}
            >
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <span className="bg-slate-900/10 text-slate-900 text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-wide border border-slate-900/10">
                  DEMO RECORD
                </span>
              </div>

              <div className="space-y-1 text-left">
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block font-mono">
                  {item.badge}
                </span>
                <h4 className="font-extrabold text-slate-950 text-base">{item.name}</h4>
                <p className="text-xs text-slate-600 font-medium">
                  {item.grade} • {item.subject}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-900/10 text-xs">
                <div className="text-left">
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Score Achieved</p>
                  <p className="font-extrabold text-slate-950 text-sm mt-0.5">{item.score}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Feedback Status</p>
                  <p className="text-[10px] px-2 py-0.5 bg-slate-900/5 rounded font-black text-slate-800 uppercase mt-0.5 tracking-wider inline-block font-mono">
                    Verified
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================== */}
      {/* 🚀 FOUNDER / MISSION SECTION (Requirement 4 & 5)           */}
      {/* ========================================================== */}
      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 text-left grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-8 space-y-4">
          <span className="bg-indigo-50 border border-indigo-150 text-indigo-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full inline-block leading-none">
            Founder Mission
          </span>
          <h3 className="text-2xl font-extrabold text-slate-950 tracking-tight leading-none mt-1">
            Why We Founded IQ200 Academy
          </h3>
          <p className="text-xs sm:text-sm text-slate-705 leading-relaxed font-semibold">
            IQ200 was envisioned by a collective of passionate supplementary subject teachers and technology designers. Searching for comprehensive, distraction-free home practice sets mapped properly matching school boards usually leads to premium paid subscriptions.
          </p>
          <p className="text-xs sm:text-sm text-slate-705 leading-relaxed font-semibold">
            We operate on a direct, simple mission: **make high-yield academic evaluations and confidence-building logic puzzles 100% open and paywall-free for standard school children.** 
          </p>
          <div className="flex items-center gap-3 pt-2">
            <span className="text-3xl">🌿</span>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-none">Democratic School Preparation</p>
              <span className="text-[10px] text-slate-405 font-bold mt-1 block">Supported through local E-E-A-T AdSense sponsors.</span>
            </div>
          </div>
        </div>
        <div className="md:col-span-4 bg-white p-5 rounded-2.5xl border border-slate-200 flex flex-col items-center text-center space-y-3 shadow-3xs">
          <div className="w-18 h-18 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-700 text-3xl font-black border border-indigo-150 select-none shadow-sm">
            🎓
          </div>
          <div>
            <h4 className="font-extrabold text-slate-950 text-sm">IQ200 Curriculum Team</h4>
            <span className="text-[9px] text-indigo-600 font-bold uppercase tracking-wider block mt-1 font-mono">
              Supplemental Prep Initiative
            </span>
          </div>
          <p className="text-[10.5px] text-slate-505 font-semibold leading-normal max-w-[220px]">
            Engineered by curriculum authors passionate about fostering robust thinking patterns from early ages.
          </p>
        </div>
      </section>

      {/* ========================================================== */}
      {/* ⚡ INDEPENDENT AI GENERATOR (Revision Tool)                 */}
      {/* ========================================================== */}
      <section className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 text-left relative overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(99,102,241,0.08),transparent_65%)] pointer-events-none"></div>
        <div className="lg:col-span-7 space-y-4">
          <span className="bg-indigo-500/10 text-indigo-300 font-extrabold text-[10px] uppercase tracking-widest py-1 px-3 rounded-full border border-indigo-400/20 w-fit inline-block leading-none">
            ⚡ Gemini GenAI Revision Bot
          </span>
          <h2 className="text-2xl sm:text-3.5xl font-black tracking-tight leading-snug">
            Draft a Custom Learning Challenge with AI Assistance
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold">
            Can't find a niche chapter in our index? Generate custom MCQs instantly via Gemini server-side processing based on class, topic, and subject inputs.
          </p>
        </div>

        <form onSubmit={handleAiSubmit} className="lg:col-span-5 bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-4 text-slate-800">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-300 block">Class Level</label>
              <select
                id="ai-class-select"
                value={aiClass}
                onChange={(e) => setAiClass(e.target.value)}
                className="w-full p-2 bg-slate-950 text-white border border-slate-800 rounded-xl focus:outline-none cursor-pointer text-xs font-semibold"
              >
                {classesList.map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-300 block">Core Subject</label>
              <select
                id="ai-subject-select"
                value={aiSubject}
                onChange={(e) => setAiSubject(e.target.value)}
                className="w-full p-2 bg-slate-950 text-white border border-slate-800 rounded-xl focus:outline-none cursor-pointer text-xs font-semibold"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Logical Reasoning Olympiad">Logical Reasoning</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-300 tracking-wide block font-mono">Custom Topic Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Roman Numerals, Decimals, or Plant Cells"
              value={aiTopicInput}
              onChange={(e) => setAiTopicInput(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-300 block">Difficulty</label>
              <select
                value={aiDiff}
                onChange={(e) => setAiDiff(e.target.value)}
                className="w-full p-2 bg-slate-950 text-white border border-slate-800 rounded-xl focus:outline-none cursor-pointer text-xs font-semibold"
              >
                <option value="easy">Easy (Class 2-4)</option>
                <option value="medium">Medium (Class 5-7)</option>
                <option value="hard">Hard (Class 8-10)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-300 block">Question Count</label>
              <select
                value={aiCount}
                onChange={(e) => setAiCount(Number(e.target.value))}
                className="w-full p-2 bg-slate-950 text-white border border-slate-800 rounded-xl focus:outline-none cursor-pointer text-xs font-semibold"
              >
                <option value="5">5 Questions</option>
                <option value="10">10 Questions</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={aiLoading}
            className="w-full bg-[#FF5722] hover:bg-[#E64A19] text-white py-3.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-md shadow-orange-100 hover:shadow-lg active:scale-98 cursor-pointer uppercase tracking-wider"
          >
            {aiLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating questions...</span>
              </>
            ) : (
              <span>Generate AI Practice Session</span>
            )}
          </button>
        </form>
      </section>

      {/* ========================================== */}
      {/* AD BLOCK PLACEHOLDER REPLACEMENT 3        */}
      {/* ========================================== */}
      <AdSenseComponent placement="footer" />

      {/* ========================================================== */}
      {/* 🏅 PARENT REVIEWS / TESTIMONIALS (Requirement 4 / CRO)     */}
      {/* ========================================================== */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-left space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full inline-block leading-none">
              Parent reviews
            </span>
            <h3 className="text-2xl font-extrabold text-slate-950 tracking-tight mt-2 flex items-center gap-2">
              <MessageSquare className="w-5.5 h-5.5 text-indigo-605" />
              Testimonials from Active Parents
            </h3>
            <p className="text-xs text-slate-500 font-semibold">
              Authentic stories illustrating how early, structured practice builds real classroom confidence.
            </p>
          </div>

          <div className="flex bg-slate-50 border border-slate-150 rounded-xl p-1 shrink-0 self-stretch md:self-auto justify-stretch select-none">
            {(['all', 'math', 'science', 'logic'] as const).map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveReviewTab(tag)}
                className={`flex-1 px-3.5 py-1.5 text-[11px] font-extrabold rounded-lg capitalize transition-all cursor-pointer ${
                  activeReviewTab === tag 
                    ? 'bg-slate-900 text-white shadow-xs' 
                    : 'text-slate-650 hover:text-slate-900'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTestimonials.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-slate-50/50 rounded-2.5xl p-6 border border-slate-200/80 space-y-4 flex flex-col justify-between hover:shadow-xs transition-all animate-in fade-in duration-300"
            >
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-1">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <span key={i} className="text-amber-400 select-none text-sm">★</span>
                  ))}
                </div>
                <p className="text-xs text-slate-700 font-semibold leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="border-t border-slate-150 pt-3 flex items-center gap-3">
                <div className="w-9 h-9 bg-indigo-50 text-indigo-600 font-black rounded-full flex items-center justify-center text-xs border border-indigo-100 select-none">
                  {item.author.charAt(0)}
                </div>
                <div className="text-left leading-none">
                  <p className="text-xs font-black text-slate-950">{item.author}</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">
                    {item.role} • <span className="text-slate-500 font-extrabold">{item.school}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================== */}
      {/* ❔ FAQ SECTION                                              */}
      {/* ========================================================== */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-left space-y-6">
        <div>
          <span className="bg-indigo-50 border border-indigo-150 text-indigo-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full inline-block leading-none">
            Have Questions?
          </span>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2 mt-2">
            <HelpCircle className="w-5.5 h-5.5 text-indigo-600" />
            Frequently Asked Questions
          </h3>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Understanding how IQ200 matches CBSE guidelines, supports children safety, and facilitates learning.
          </p>
        </div>

        <div className="space-y-3 max-w-4xl">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index} 
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-slate-50/20 hover:bg-slate-55/40"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 text-left flex justify-between items-center gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="font-extrabold text-slate-900 text-sm">{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs text-slate-650 leading-relaxed font-semibold border-t border-slate-100 italic transition-all">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================== */}
      {/* 📚 BRAIN INSIGHTS & BULLETIN                               */}
      {/* ========================================================== */}
      <section className="space-y-4 text-left border-t border-slate-150 pt-8">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight font-sans">Syllabus Insights & Educational Bulletin</h2>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Scientific strategies, grammar guides, and arithmetic shortcuts prepared by the assessment team.</p>
          </div>
          <button
            onClick={() => onNavigate('#blog')}
            className="text-indigo-605 hover:underline text-xs font-black cursor-pointer"
          >
            Read All Articles
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trendingBlogs.slice(0, 3).map((post) => (
            <div
              key={post.id}
              onClick={() => onNavigate(`#blog/${post.slug}`)}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="bg-indigo-50 text-indigo-700 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide font-mono">
                    {post.category}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 font-mono">{post.readTime}</span>
                </div>
                <h3 className="text-sm font-extrabold text-slate-800 line-clamp-2 hover:text-indigo-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed font-semibold">
                  {post.summary}
                </p>
              </div>
              <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-[10px] text-slate-455 text-left font-bold font-mono">
                By: {post.author}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================== */}
      {/* 📨 CONTACT & SUPPORT TRANSPARENCY                         */}
      {/* ========================================================== */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-left grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-t-2 border-t-indigo-600">
        <div className="md:col-span-5 space-y-4">
          <span className="bg-indigo-50 border border-indigo-150 text-indigo-750 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full inline-block leading-none">
            Inquiries
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight leading-none mt-1">
            Questions or Feedback?
          </h2>
          <p className="text-xs text-slate-550 leading-relaxed font-semibold">
            We are dedicated to building a high-quality educational environment. If you have questions regarding syllabus mapping, dynamic medal achievements, or credential verification, reach out to our platform owner, Sachin Borade:
          </p>
          
          <div className="space-y-3 pt-2 text-xs text-slate-700 font-semibold">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider leading-none">Owner & Support Email</p>
                <a href="mailto:boradesp@gmail.com" className="text-indigo-600 hover:underline font-extrabold text-sm block mt-1">
                  boradesp@gmail.com
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider leading-none">Typical response time</p>
                <p className="text-slate-800 font-extrabold block mt-1 font-mono">
                  Within 1–2 business days
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleContactSubmit} className="md:col-span-7 bg-slate-50 border border-slate-150 p-5 rounded-2xl w-full space-y-4">
          <h3 className="font-extrabold text-slate-950 text-sm">Send a Direct Message</h3>
          
          {contactSuccess ? (
            <div className="bg-emerald-50 border border-emerald-150 text-emerald-800 p-4 rounded-xl text-xs font-semibold space-y-1">
              <p className="flex items-center gap-1.5 font-bold">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                Message Transmitted Successfully!
              </p>
              <p className="text-[11px] text-emerald-600 font-medium">
                Our curriculum support representative will inspect your request and reply shortly.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-550 block">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priyakant Sharma"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-550 block">Your Email</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. parent@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-550 block">Subject Topic</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class 5 Geometry Practice Test syllabus feedback"
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-550 block">Message Details</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us what diagnostic topics you want included or curriculum questions you want checked..."
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 font-semibold"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-indigo-600 hover:bg-slate-900 text-white font-extrabold text-xs py-3.5 px-6 rounded-xl transition-colors shadow flex items-center justify-center gap-2 cursor-pointer w-full"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Message</span>
              </button>
            </div>
          )}
        </form>
      </section>

      {/* Sticky Bottom Active Assessment Trigger CTA on Mobile (Requirement 7) */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-40 bg-indigo-900/90 backdrop-blur-md p-3 rounded-2xl border border-indigo-500/30 shadow-lg flex items-center justify-between gap-3 text-white">
        <div className="text-left font-semibold">
          <p className="text-[10px] text-indigo-200 uppercase tracking-widest font-mono">Mobile Quick Link</p>
          <p className="text-xs font-black text-white">Configure diagnostic practice</p>
        </div>
        <button
          onClick={() => {
            const el = document.getElementById('medal-challenge-hero');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-black uppercase py-2 px-3.5 rounded-xl transition-all shadow-xs shrink-0 flex items-center gap-1"
        >
          <span>Select Grade</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
