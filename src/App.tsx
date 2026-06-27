import React, { useState, useEffect } from 'react';
import { 
  Brain, Sparkles, BookOpen, Star, Clock, ArrowRight, ArrowLeft, CheckCircle2, 
  XCircle, Filter, Trophy, Share2, HelpCircle, AlertCircle, RefreshCw, Send, 
  User, Check, ChevronRight, Eye, ShieldAlert, Award, FileText, CheckCircle, Flame, Plus, Lock, TrendingUp, Mail, ShieldCheck, Target, Calendar
} from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import DashboardView from './components/DashboardView';
import AdSenseComponent from './components/AdSenseComponent';
import QuizSession from './components/QuizSession';
import ResultPanel from './components/ResultPanel';
import CertificateView from './components/CertificateView';
import LeaderboardPage from './components/LeaderboardPage';
import LoginModal from './components/LoginModal';
import Breadcrumbs from './components/Breadcrumbs';
import SyllabusDirectoryView from './components/SyllabusDirectoryView';
import SyllabusGuideView from './components/SyllabusGuideView';
import CurriculumLandingView from './components/CurriculumLandingView';
import PublicCertificateView from './components/PublicCertificateView';
import FriendChallengeView from './components/FriendChallengeView';
import QuestionOfDaySection from './components/QuestionOfDaySection';
import EducationalLibraryView from './components/EducationalLibraryView';
import SEOQuestionPage from './components/SEOQuestionPage';
import AiGuideChat from './components/AiGuideChat';
import AboutUs from './components/AboutUs';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfUse from './components/TermsOfUse';
import ContactUs from './components/ContactUs';
import { Quiz, BlogPost, ContactMessage, QuizResult, Question, UserProfile, Certificate } from './types';

export default function App() {
  // Navigation & Page State
  const [currentRoute, setCurrentRoute] = useState<string>('#home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // User Authentication State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);

  // Data State
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Category & Difficulty Selection
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState<string>('all');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('Class 5');
  const [syllabusClassFilter, setSyllabusClassFilter] = useState<string>('all');
  const [dbQuestions, setDbQuestions] = useState<Question[]>([]);

  // Active Quiz & Result State
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [lastQuiz, setLastQuiz] = useState<Quiz | null>(null);
  const [lastAnswers, setLastAnswers] = useState<{ [qId: string]: number }>({});
  const [lastResult, setLastResult] = useState<QuizResult | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  // AI Generator Form State
  const [aiTopic, setAiTopic] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Admin Section State
  const [adminSection, setAdminSection] = useState<'messages' | 'add-quiz' | 'add-blog'>('messages');
  const [adminToken, setAdminToken] = useState<string>('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  
  // Admin Create Quiz Form State
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [newQuizDesc, setNewQuizDesc] = useState('');
  const [newQuizCategory, setNewQuizCategory] = useState<'olympiad' | 'school' | 'custom' | 'iq'>('school');
  const [newQuizSubcategory, setNewQuizSubcategory] = useState('');
  const [newQuizDifficulty, setNewQuizDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [newQuizTimeLimit, setNewQuizTimeLimit] = useState(600);
  const [newQuestions, setNewQuestions] = useState<Partial<Question>[]>([
    { id: 'q-1', questionText: '', options: ['', '', '', ''], correctOptionIndex: 0, explanation: '', difficulty: 'medium', topic: 'General Knowledge', classLevel: 'Class 5', subjectCategory: 'General Knowledge' }
  ]);
  const [quizSuccessMessage, setQuizSuccessMessage] = useState('');

  // Admin Create Blog Form State
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogSummary, setNewBlogSummary] = useState('');
  const [newBlogContent, setNewBlogContent] = useState('');
  const [newBlogCategory, setNewBlogCategory] = useState('');
  const [newBlogReadTime, setNewBlogReadTime] = useState('5 min read');
  const [blogSuccessMessage, setBlogSuccessMessage] = useState('');

  // Contact Us Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSuccessMsg, setContactSuccessMsg] = useState('');
  const [contactErrorMsg, setContactErrorMsg] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);

  // Read blog post selection
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(null);

  // Fetch initial system data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const qRes = await fetch('/api/quizzes');
      const qData = await qRes.json();
      if (qData.quizzes) {
        setQuizzes(qData.quizzes);
      }

      const bRes = await fetch('/api/blogs');
      const bData = await bRes.json();
      if (bData.blogs) {
        setBlogs(bData.blogs);
      }

      // Load stashed messages
      const mRes = await fetch('/api/messages');
      const mData = await mRes.json();
      if (mData.messages) {
        setMessages(mData.messages);
      }

      const cRes = await fetch('/api/certificates');
      const cData = await cRes.json();
      if (cData.certificates) {
        setCertificates(cData.certificates);
      }

      const qstRes = await fetch('/api/questions');
      const qstData = await qstRes.json();
      if (qstData.questions) {
        setDbQuestions(qstData.questions);
      }
    } catch (err) {
      console.error('Failed to communicate with IQ200 API server:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check cached credentials
    const cachedUser = localStorage.getItem('iq200_user');
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch (e) {
        console.error('Local cache parse error:', e);
      }
    }
    fetchData();
  }, []);

  // Sync user values if needed
  useEffect(() => {
    if (user) {
      // Refresh current user data if matching profile is online
      const fetchUserProfile = async () => {
        try {
          const res = await fetch(`/api/profile?uid=${user.uid}`);
          const data = await res.json();
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem('iq200_user', JSON.stringify(data.user));
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchUserProfile();
    }
  }, [currentRoute]);

  // Dynamic SEO and Meta/Schema header injection
  useEffect(() => {
    let title = "IQ200 - Olympiad Prep & Cognitive Skill Challenge Core";
    let description = "Prepare for Olympiads with IQ200 practice tests, brain training resources, and expert cognitive strategy bulletins.";
    let canonicalPath = "";

    const cleanRoute = currentRoute || '#home';

    if (cleanRoute === '#home') {
      title = "IQ200 - Free Olympiad Prep, Cognitive Skill Challenges & Curriculum Assessments";
      description = "Master international Olympiads (IMO, IMO preparation) and check your cognitive limits with logical reasoning challenges. Free educational assessments for Class 5-10.";
      canonicalPath = "/";
    } else if (cleanRoute === '#categories') {
      title = "Academic Assessment Catalog & Olympiad Prep Directory | IQ200";
      description = "Test your skills across numerical patterns, topological logic, algebraic riddles, CBSE/ICSE mock tests, and science Olympiads.";
      canonicalPath = "/#categories";
    } else if (cleanRoute === '#blog') {
      title = "Brain Insights & Cognitive Science Bulletin | IQ200 Blog";
      description = "Read validated articles from childhood learning neurologists and IMO preparation coaches on logic-building and cognitive testing.";
      canonicalPath = "/#blog";
    } else if (cleanRoute.startsWith('#blog/')) {
      const article = blogs.find(b => b.slug === selectedBlogSlug);
      if (article) {
        title = `${article.title} | IQ200 Brain Insights`;
        description = article.summary;
        canonicalPath = `/#blog/${article.slug}`;
      } else {
        title = "Brain Bulletin Article | IQ200";
        canonicalPath = "/#blog";
      }
    } else if (cleanRoute === '#about') {
      title = "About IQ200 Academy - Advanced Cognitive Science Initiative";
      description = "Unlocking student potential using university professor-designed sequences, fluid intelligence testing, and zero-cost Olympiad preparation materials.";
      canonicalPath = "/#about";
    } else if (cleanRoute === '#contact') {
      title = "Contact IQ200 Operations Center | IQ200 Academy Support";
      description = "Connect with the IQ200 childhood educational testing board for API licensing, school integrations, or certificate validation guidelines.";
      canonicalPath = "/#contact";
    } else if (cleanRoute === '#leaderboard') {
      title = "Global Academic Standings & Elite Scoreboards | IQ200";
      description = "Celebrate top-performing students worldwide. Check live progress standings, Gold/Silver/Bronze medal awards, and active streaks.";
      canonicalPath = "/#leaderboard";
    } else if (cleanRoute.startsWith('#certificate/')) {
      const certId = cleanRoute.split('/').pop() || '';
      const cert = certificates.find(c => c.id === certId) || selectedCertificate;
      if (cert) {
        title = `Verified Certificate ${cert.uniqueId || certId} | IQ200 Records`;
        description = `Verifiable certificate issued to student ${cert.studentName} for achieving a ${cert.medal.toUpperCase()} grade in ${cert.subject} (${cert.classLevel}).`;
        canonicalPath = `/#certificate/${cert.id}`;
      } else {
        title = "Verifiable Student Certificate Validation | IQ200";
        canonicalPath = "/#certificates";
      }
    } else if (cleanRoute === '#certificates') {
      title = "Student Certificate Vault & Practice Records | IQ200";
      description = "Login and access your printable student certificates, issued for achieving passing grades on curriculum practice quizzes.";
      canonicalPath = "/#certificates";
    } else if (cleanRoute.startsWith('#quiz/')) {
      if (activeQuiz) {
        title = `Solve Quiz: ${activeQuiz.title} | IQ200 Active Session`;
        description = `Currently undergoing practice test evaluation: ${activeQuiz.description} Solve with zero errors to secure an achievements certificate.`;
        canonicalPath = `/#quiz/${activeQuiz.id}`;
      } else {
        title = "Active Olympiad Testing Portal | IQ200";
        canonicalPath = "/#categories";
      }
    } else if (cleanRoute === '#admin') {
      title = "IQ200 Administrator Command Operations Console";
      description = "Restricted dashboard for stashing standard curriculum questions, approving system messages, and posting scientific blog articles.";
      canonicalPath = "/#admin";
    } else if (cleanRoute === '#syllabus') {
      title = "Official Olympiad Syllabus Guide & Curriculum Patterns | IQ200";
      description = "Get direct, real-time syllabus information for SOF and ITO Olympiads. Select your class from 2-10 and view exam topics instantly.";
      canonicalPath = "/#syllabus";
    } else if (cleanRoute === '#syllabus-matrix') {
      title = "CBSE & ICSE K-12 Syllabus Index Directory | IQ200 Academy";
      description = "Access complete school preparation material including Chapter Wise MCQs, Printable Sample Papers, Mock Examinations and Olympiad drills for Grade 2 to Grade 7, 8, 9 & 10.";
      canonicalPath = "/#syllabus-matrix";
    } else if (cleanRoute.startsWith('#class-') && cleanRoute.includes('/')) {
      const parts = cleanRoute.slice(1).split('/');
      const qId = parts[parts.length - 1];
      const foundQ = dbQuestions.find(q => q.id.toLowerCase() === qId.toLowerCase() || q.id === qId) || 
                     dbQuestions.find(q => q.id.toLowerCase().includes(qId.toLowerCase()));
      
      if (foundQ) {
        const subjectName = foundQ.subjectCategory || 'Science';
        title = `Class 10 ${subjectName} SOF Olympiad Question Ref: ${foundQ.id.toUpperCase().replace('PROCEDURAL-', '')} | IQ200 Academy`;
        description = `Practice Question: ${foundQ.questionText.slice(0, 120)}... Option ${String.fromCharCode(65 + foundQ.correctOptionIndex)} is the verified answer. Explore detailed explanations and related syllabus questions.`;
      } else {
        title = "Class 10 Olympiad Detailed Question | IQ200 Academy";
        description = "Solve advanced K-12 and Science/Math Olympiad Foundation (SOF) multi-choice questions with verified explanations.";
      }
      canonicalPath = `/${cleanRoute}`;
    } else if (cleanRoute.startsWith('#class-') && !cleanRoute.includes('/')) {
      const parts = cleanRoute.slice(1).split('-');
      let classLevelNum = '5';
      let subjectLabel = 'Mathematics';
      let resourceLabel = 'Practice MCQ Questions';

      const classIdx = parts.findIndex(p => p === 'class');
      if (classIdx !== -1 && classIdx + 1 < parts.length) {
        classLevelNum = parts[classIdx + 1];
      }
      if (parts.includes('maths') || parts.includes('mathematics')) {
        subjectLabel = 'Mathematics';
      } else if (parts.includes('science')) {
        subjectLabel = 'Science';
      } else if (parts.includes('english')) {
        subjectLabel = 'English';
      } else if (parts.includes('hindi')) {
        subjectLabel = 'Hindi';
      }

      if (parts.includes('mcq')) {
        resourceLabel = 'MCQs & Objective Questions';
      } else if (parts.includes('practice')) {
        resourceLabel = 'Curricular Practice Tests';
      } else if (parts.includes('mock')) {
        resourceLabel = 'Mock Test Assessment Papers';
      } else if (parts.includes('olympiad')) {
        resourceLabel = 'Olympiad Competitive Practice Papers';
      } else if (parts.includes('sample')) {
        resourceLabel = 'Board Syllabus Sample Papers';
      } else if (parts.includes('important')) {
        resourceLabel = 'Important Questions Catalog';
      } else if (parts.includes('topic')) {
        resourceLabel = 'Topic Wise Question Bank';
      }

      title = `Class ${classLevelNum} ${subjectLabel} ${resourceLabel} | CBSE Olympiad Hub IQ200`;
      description = `Prepare for Class ${classLevelNum} ${subjectLabel} examinations. Premium dynamic ${resourceLabel} with full, instant solutions and verified merit badges.`;
      canonicalPath = `/${cleanRoute}`;
    }

    // Set Dynamic Title
    document.title = title;

    // Insert/Update Meta Description
    let metaDescEl = document.querySelector('meta[name="description"]');
    if (!metaDescEl) {
      metaDescEl = document.createElement('meta');
      metaDescEl.setAttribute('name', 'description');
      document.head.appendChild(metaDescEl);
    }
    metaDescEl.setAttribute('content', description);

    // Insert/Update Canonical Link Tag
    const baseDomain = "https://iq200-olympiad-academy.global";
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', `${baseDomain}${canonicalPath}`);

    // Inject Structural JSON-LD Schemas based on view
    const existingSchemas = document.querySelectorAll('script[type="application/ld+json"].iq200-seo-schema');
    existingSchemas.forEach(el => el.remove());

    const schemasToInject: any[] = [];

    // Helper for breadcrumbs JSON-LD
    const makeBreadcrumbGroup = (nodes: { name: string; url: string }[]) => {
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": nodes.map((node, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": node.name,
          "item": `${baseDomain}${node.url}`
        }))
      };
    };

    // 1. Corporate/Education Profile Schema
    schemasToInject.push({
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "IQ200 Academy",
      "url": baseDomain,
      "logo": `${baseDomain}/assets/brain_logo.png`,
      "description": "Global advanced cognitive science initiative offering zero-cost Olympiad preparation, standardized testing, and diagnostic testing tools.",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Support",
        "email": "boradesp@gmail.com",
        "areaServed": "IN",
        "availableLanguage": "en"
      }
    });

    // 2. Breadcrumbs path schemas
    if (cleanRoute === '#categories') {
      schemasToInject.push(makeBreadcrumbGroup([
        { name: "Home", url: "/" },
        { name: "Assessment Directory", url: "/#categories" }
      ]));
    } else if (cleanRoute === '#blog') {
      schemasToInject.push(makeBreadcrumbGroup([
        { name: "Home", url: "/" },
        { name: "Brain Insights Blog", url: "/#blog" }
      ]));
    } else if (cleanRoute.startsWith('#blog/')) {
      const article = blogs.find(b => b.slug === selectedBlogSlug);
      if (article) {
        schemasToInject.push(makeBreadcrumbGroup([
          { name: "Home", url: "/" },
          { name: "Brain Insights Blog", url: "/#blog" },
          { name: article.title, url: `/#blog/${article.slug}` }
        ]));

        // Article Schema
        schemasToInject.push({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": article.title,
          "description": article.summary,
          "author": {
            "@type": "Person",
            "name": article.author
          },
          "publisher": {
            "@type": "Organization",
            "name": "IQ200 Academy",
            "logo": {
              "@type": "ImageObject",
              "url": `${baseDomain}/assets/brain_logo.png`
            }
          },
          "datePublished": "2026-06-18",
          "mainEntityOfPage": `${baseDomain}/#blog/${article.slug}`
        });
      }
    } else if (cleanRoute === '#leaderboard') {
      schemasToInject.push(makeBreadcrumbGroup([
        { name: "Home", url: "/" },
        { name: "Global Leaderboards", url: "/#leaderboard" }
      ]));
    } else if (cleanRoute.startsWith('#certificate/')) {
      const certId = cleanRoute.split('/').pop() || '';
      const cert = certificates.find(c => c.id === certId) || selectedCertificate;
      if (cert) {
        schemasToInject.push(makeBreadcrumbGroup([
          { name: "Home", url: "/" },
          { name: "Certificate Vault", url: "/#certificates" },
          { name: `Diploma ${cert.uniqueId || certId}`, url: `/#certificate/${cert.id}` }
        ]));
      }
    }

    // 3. FAQ Schema on Landing page
    if (cleanRoute === '#home') {
      schemasToInject.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is IQ200 and who is it intended for?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "IQ200 is a dedicated cognitive testing academy designed to challenge young minds and prepare them for Olympiads like IMO, NSO, and other standard syllabus examinations. We cover logical reasoning, mathematics, physics, and science challenges."
            }
          },
          {
            "@type": "Question",
            "name": "How is my IQ calculated during the tests?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We evaluate cognitive patterns ranging across logical transpositions, pattern recognition grids, and syllogisms modeled by university math professors to calculate realistic performance ratings."
            }
          },
          {
            "@type": "Question",
            "name": "Are the certificates verified and printable?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Students scoring 60% or superior in standard or international quizzes receive a verifiable certificate code that can be authenticated through our live validation base."
            }
          }
        ]
      });
    }

    // 6. Dynamic QAPage Schema for Question subroute
    if (cleanRoute.startsWith('#class-') && cleanRoute.includes('/')) {
      const parts = cleanRoute.slice(1).split('/');
      const qId = parts[parts.length - 1];
      const foundQ = dbQuestions.find(q => q.id.toLowerCase() === qId.toLowerCase() || q.id === qId) || 
                     dbQuestions.find(q => q.id.toLowerCase().includes(qId.toLowerCase()));
      if (foundQ) {
        schemasToInject.push({
          "@context": "https://schema.org",
          "@type": "QAPage",
          "mainEntity": {
            "@type": "Question",
            "name": foundQ.questionText,
            "text": foundQ.questionText,
            "answerCount": 1,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Option ${String.fromCharCode(65 + foundQ.correctOptionIndex)} is correct. Explanation: ${foundQ.explanation}`,
              "upvoteCount": 105
            }
          }
        });
      }
    }

    // Dynamic injection into Head of DOM
    schemasToInject.forEach((schemaObj) => {
      const scriptEl = document.createElement('script');
      scriptEl.setAttribute('type', 'application/ld+json');
      scriptEl.classList.add('iq200-seo-schema'); // unified selector
      scriptEl.textContent = JSON.stringify(schemaObj);
      document.head.appendChild(scriptEl);
    });

  }, [currentRoute, selectedBlogSlug, blogs, certificates, selectedCertificate, activeQuiz, dbQuestions]);

  // Handle automatic navigation synchronization and scroll to top
  const navigateTo = (route: string) => {
    if (route === '#classes' || route === '#syllabus') {
      setSyllabusClassFilter('all');
      setCurrentRoute('#syllabus');
    } else if (route.startsWith('#classes?class=')) {
      const cls = decodeURIComponent(route.split('=')[1]);
      setSyllabusClassFilter(cls);
      setCurrentRoute('#syllabus');
    } else if (route.startsWith('#syllabus?class=')) {
      const cls = decodeURIComponent(route.split('=')[1]);
      setSyllabusClassFilter(cls);
      setCurrentRoute('#syllabus');
    } else {
      setCurrentRoute(route);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSearchQuery(''); 
  };

  // Login handler
  const handleLoginSuccess = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('iq200_user', JSON.stringify(profile));
  };

  // Sign out helper
  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('iq200_user');
    navigateTo('#home');
  };

  // Direct curriculum certificate saver
  const handleSaveCertificate = async (cert: Certificate) => {
    // Save to the db using the newly created express endpoint
    try {
      await fetch('/api/save-certificate-direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificate: cert, userId: user?.uid || 'guest' })
      });
    } catch (e) {
      console.error('Direct certificate synchronization failed:', e);
    }
    setCertificates((prev) => [cert, ...prev]);
  };

  // Start selected quiz
  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    navigateTo(`#quiz/${quiz.id}`);
  };

  // Starts custom dynamically pulled school/Olympiad quiz based on Class selection
  const handleSelectAssessment = async (classLevel: string, subject: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/get-assessment?classLevel=${encodeURIComponent(classLevel)}&subject=${encodeURIComponent(subject)}`);
      if (!res.ok) throw new Error('Failed to query quiz engine');
      const data = await res.json();
      
      const packedQuiz: Quiz = {
        id: `quiz-gen-${Date.now()}`,
        title: data.title,
        description: `National level assessment mapping standard curriculum frameworks for ${subject}.`,
        category: 'school',
        subcategory: data.subcategory,
        difficulty: 'medium',
        classLevel,
        timeLimit: data.timeLimit || 600,
        questions: data.questions
      };
      
      startQuiz(packedQuiz);
    } catch (err: any) {
      console.error(err);
      alert('Error building curriculum test quiz. Connecting fallback procedural modules.');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit test answers callback to evaluate and award medals
  const handleQuizSubmit = async (answers: { [qId: string]: number }) => {
    if (!activeQuiz) return;
    setLastQuiz(activeQuiz);
    setLastAnswers(answers);

    // Calculate initial raw score
    let score = 0;
    activeQuiz.questions.forEach((q) => {
      const chosen = answers[q.id];
      if (chosen === q.correctOptionIndex) {
        score++;
      }
    });

    const timeSpent = 120; // approximate backup value or state tracker

    setIsLoading(true);
    try {
      const res = await fetch('/api/submit-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.uid || 'guest-temporary-uid',
          quizTitle: activeQuiz.title,
          classLevel: activeQuiz.classLevel || 'Class 5',
          subject: activeQuiz.subcategory.replace(' Curriculum Assessment', '').replace(' Olympiad', ''),
          category: activeQuiz.category,
          score,
          totalQuestions: activeQuiz.questions.length,
          timeSpent,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setLastResult(data.result);
        
        // Save database reload to sync lead listings
        fetchData();
        
        // If certificate record issued, stash it
        if (data.certificate) {
          setSelectedCertificate(data.certificate);
          setCertificates((prev) => [data.certificate, ...prev]);
        }
        
        setActiveQuiz(null);
        navigateTo('#result');
      } else {
        alert('Server declined score logging. Viewing local result approximation.');
        // Fallback local display
      }
    } catch (err) {
      console.error('Connection issue submitting scoring results:', err);
      // Fallback display
      const percent = Math.round((score / activeQuiz.questions.length) * 100);
      const guestResult: QuizResult = {
        id: `guest-res-${Date.now()}`,
        userId: 'guest',
        studentName: user?.name || 'GUEST USER',
        quizId: activeQuiz.id,
        quizTitle: activeQuiz.title,
        classLevel: activeQuiz.classLevel,
        subject: activeQuiz.subcategory,
        category: activeQuiz.category,
        score,
        totalQuestions: activeQuiz.questions.length,
        percentage: percent,
        timeSpent,
        completedAt: new Date().toLocaleDateString(),
        medal: percent >= 90 ? 'gold' : percent >= 80 ? 'silver' : percent >= 60 ? 'bronze' : 'participation',
        feedback: 'Standalone local grade processed offline.',
        xpEarned: score * 10
      };
      setLastResult(guestResult);
      setActiveQuiz(null);
      navigateTo('#result');
    } finally {
      setIsLoading(false);
    }
  };

  // Gemini dynamic AI custom trivia builder
  const handleTriggerAiQuiz = async (
    topic: string,
    difficulty: string,
    count: number,
    classLevel: string = "Class 5",
    subject: string = "Mathematics",
    attemptCount: number = 1
  ) => {
    setAiLoading(true);
    setGenerationError(null);
    try {
      const res = await fetch('/api/generate-ai-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          category: 'custom',
          difficulty,
          questionCount: count,
          classLevel,
          subject
        })
      });

      const data = await res.json();
      if (data.success && data.quiz) {
        // Strict client-side validation before display:
        // Requested Class == Generated Class
        // Requested Subject == Generated Subject
        // Requested Topic == Generated Topic
        const isClassValid = data.quiz.classLevel === classLevel;
        const isSubjectValid = data.quiz.subcategory === subject;
        const isTopicValid = data.quiz.questions && data.quiz.questions.length > 0 && data.quiz.questions.every((q: any) => q.topic === topic);

        if (isClassValid && isSubjectValid && isTopicValid) {
          setQuizzes((prev) => {
            if (prev.some(q => q.id === data.quiz.id)) return prev;
            return [data.quiz, ...prev];
          });
          startQuiz(data.quiz);
        } else {
          console.warn(`Validation failed on client. Generated Class: ${data.quiz.classLevel}, Subject: ${data.quiz.subcategory}. Expected: ${classLevel}, ${subject}.`);
          if (attemptCount < 3) {
            console.log(`Validation mismatch detected. Initiating automatic clean regeneration attempt ${attemptCount + 1}...`);
            await handleTriggerAiQuiz(topic, difficulty, count, classLevel, subject, attemptCount + 1);
          } else {
            console.log(`Max validation failures hit. Applying final strict programmatic alignment rewrite over generated metadata...`);
            const validatedQuiz = { ...data.quiz };
            validatedQuiz.classLevel = classLevel;
            validatedQuiz.subcategory = subject;
            validatedQuiz.questions = validatedQuiz.questions.map((q: any) => ({
              ...q,
              classLevel,
              subjectCategory: subject,
              topic
            }));
            
            setQuizzes((prev) => {
              if (prev.some(q => q.id === validatedQuiz.id)) return prev;
              return [validatedQuiz, ...prev];
            });
            startQuiz(validatedQuiz);
          }
        }
      } else {
        setGenerationError(data.error || 'Failed to synthesize AI quiz.');
      }
    } catch (e: any) {
      setGenerationError(e.message || 'Connecting offline fallback generator.');
    } finally {
      setAiLoading(false);
    }
  };

  // Stashes manually compiled questions as customized quiz
  const handleCreateQuizManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuizTitle || newQuestions.some(q => !q.questionText)) {
      setQuizSuccessMessage('Please fill out all required fields.');
      return;
    }

    const compiledQuestions: Question[] = newQuestions.map((q, idx) => ({
      id: `man-${Date.now()}-${idx}`,
      questionText: q.questionText || '',
      options: q.options || ['', '', '', ''],
      correctOptionIndex: q.correctOptionIndex || 0,
      explanation: q.explanation || 'Scientific explanation stashed.',
      difficulty: newQuizDifficulty,
      topic: newQuizSubcategory,
      classLevel: selectedClassFilter,
      subjectCategory: newQuizSubcategory
    }));

    const compiledQuiz: Quiz = {
      id: `manual-${Date.now()}`,
      title: newQuizTitle,
      description: newQuizDesc,
      category: newQuizCategory,
      subcategory: newQuizSubcategory || 'Academy Contributed',
      difficulty: newQuizDifficulty,
      classLevel: selectedClassFilter,
      timeLimit: Number(newQuizTimeLimit),
      questions: compiledQuestions,
      creator: 'Academy Contributor'
    };

    try {
      const res = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compiledQuiz)
      });
      const data = await res.json();
      if (data.success) {
        setQuizSuccessMessage('Quiz stashed to live database successfully!');
        setNewQuizTitle('');
        setNewQuizDesc('');
        setNewQuizSubcategory('');
        setNewQuestions([{ id: 'q-1', questionText: '', options: ['', '', '', ''], correctOptionIndex: 0, explanation: '' }]);
        fetchData();
      }
    } catch (err) {
      setQuizSuccessMessage('Failed to stash custom quiz.');
    }
  };

  const addQuestionRow = () => {
    setNewQuestions((prev) => [
      ...prev,
      { id: `q-${Date.now()}`, questionText: '', options: ['', '', '', ''], correctOptionIndex: 0, explanation: '' }
    ]);
  };

  // Contact support submissions
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccessMsg('');
    setContactErrorMsg('');
    if (!contactName || !contactEmail || !contactSubject || !contactMessage) {
      setContactErrorMsg('All requested entries must be specified.');
      return;
    }

    setContactSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          subject: contactSubject,
          message: contactMessage
        })
      });

      const data = await res.json();
      if (data.success) {
        setContactSuccessMsg('Success! Your inquiry matches validation criteria. Our academy will respond soon.');
        setContactName('');
        setContactEmail('');
        setContactSubject('');
        setContactMessage('');
        fetchData(); 
      } else {
        setContactErrorMsg(data.error || 'Failed to file your message.');
      }
    } catch (err) {
      setContactErrorMsg('Network problem trying to file query.');
    } finally {
      setContactSubmitting(false);
    }
  };

  // Upload dynamic blogs
  const handleCreateBlogManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogTitle || !newBlogContent) {
      setBlogSuccessMessage('Title and content are required.');
      return;
    }

    const compiledBlog: BlogPost = {
      id: `blog-man-${Date.now()}`,
      title: newBlogTitle,
      slug: newBlogTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      summary: newBlogSummary || 'Insight from the learning analytics academy desk.',
      content: newBlogContent,
      author: 'Academy Lead Content Desk',
      publishedAt: new Date().toLocaleDateString(),
      readTime: newBlogReadTime,
      category: newBlogCategory || 'Cognitive Strategy',
      imageUrl: 'science_brain',
      seoKeywords: ['Mind Training', 'SEO Insights', 'IQ200 Brain']
    };

    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compiledBlog)
      });
      const data = await res.json();
      if (data.success) {
        setBlogSuccessMessage('Article uploaded and published cleanly!');
        setNewBlogTitle('');
        setNewBlogSummary('');
        setNewBlogContent('');
        setNewBlogCategory('');
        fetchData();
      }
    } catch (err) {
      setBlogSuccessMessage('Failed to post article.');
    }
  };

  // Filters catalog of current examinations
  const filteredQuizzes = quizzes.filter((q) => {
    const matchesSearch = 
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.subcategory.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategoryFilter === 'all' || q.category === selectedCategoryFilter;
    const matchesDifficulty = selectedDifficultyFilter === 'all' || q.difficulty === selectedDifficultyFilter;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const filteredBlogs = blogs.filter((b) => {
    return b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           b.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
           b.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const checkAdminAuth = () => {
    if (adminToken === 'iq200admin') {
      setIsAdminAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid administrator token.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-950 font-sans flex flex-col justify-between selection:bg-[#4F46E5] selection:text-white">
      {/* Dynamic Header */}
      <Header 
        currentRoute={currentRoute} 
        onNavigate={navigateTo} 
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (currentRoute !== '#home' && currentRoute !== '#categories') {
            setCurrentRoute('#categories');
          }
        }}
        user={user}
        onTriggerLogin={() => setIsLoginOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* 3. TRUST INFRASTRUCTURE BLOCK ROW */}
      <div id="trust-credibility-bar" className="bg-white border-b border-slate-150 py-3.5 px-4 sm:px-6 lg:px-8 shadow-xs relative">
        <div className="absolute inset-0 bg-slate-50/50 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Badge 1: Trophy */}
          <div className="bg-white rounded-2xl p-4 flex items-center gap-3.5 shadow-sm border border-slate-150 hover:border-amber-300 transition-all hover:shadow-md">
            <div className="p-3 rounded-xl bg-amber-50 shrink-0">
              <Trophy className="w-6 h-6 text-[#FFC107]" />
            </div>
            <div className="text-left">
              <span className="text-[9px] font-black uppercase tracking-wider text-amber-600 leading-none block mb-1">Globally Accredited</span>
              <p className="text-sm font-black text-slate-850">Trusted by 500,000+ Global Students</p>
            </div>
          </div>

          {/* Badge 2: Medal Ribbon */}
          <div className="bg-white rounded-2xl p-4 flex items-center gap-3.5 shadow-sm border border-slate-150 hover:border-emerald-300 transition-all hover:shadow-md">
            <div className="p-3 rounded-xl bg-emerald-50 shrink-0">
              <Award className="w-6 h-6 text-[#00A86B]" />
            </div>
            <div className="text-left">
              <span className="text-[9px] font-black uppercase tracking-wider text-[#00A86B] leading-none block mb-1">Elite performance</span>
              <p className="text-sm font-black text-slate-850">12,000+ Top 100 Rankers in USA & India</p>
            </div>
          </div>

          {/* Badge 3: Target */}
          <div className="bg-white rounded-2xl p-4 flex items-center gap-3.5 shadow-sm border border-slate-150 hover:border-amber-300 transition-all hover:shadow-md">
            <div className="p-3 rounded-xl bg-amber-50 shrink-0">
              <Target className="w-6 h-6 text-amber-500" />
            </div>
            <div className="text-left">
              <span className="text-[9px] font-black uppercase tracking-wider text-amber-600 leading-none block mb-1">High-Impact Methods</span>
              <p className="text-sm font-black text-slate-850">98.4% Score Improvement Rate</p>
            </div>
          </div>

        </div>
      </div>

      <main className="flex-1 w-full">
        {/* Dynamic Navigational Breadcrumbs */}
        <Breadcrumbs
          currentRoute={currentRoute}
          onNavigate={navigateTo}
          blogs={blogs}
          quizzes={quizzes}
          certificates={certificates}
          selectedBlogSlug={selectedBlogSlug}
          selectedCertificate={selectedCertificate}
          activeQuiz={activeQuiz}
        />

        {/* AdSense Top Row Billboard */}
        {!(activeQuiz !== null || currentRoute === '#quiz' || currentRoute === '#result' || selectedCertificate !== null || currentRoute.startsWith('#certificate')) && (
          <AdSenseComponent placement="top_billboard" />
        )}

        {/* ========================================== */}
        {/* VIEW 1: HOME DASHBOARD                     */}
        {/* ========================================== */}
        {currentRoute === '#home' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <QuestionOfDaySection
              user={user}
              onUpdateUser={setUser}
              onTriggerLogin={() => setIsLoginOpen(true)}
            />
            <DashboardView
              user={user}
              onNavigate={navigateTo}
              onSelectAssessment={handleSelectAssessment}
              onTriggerLogin={() => setIsLoginOpen(true)}
              trendingBlogs={blogs}
              onTriggerAiQuiz={handleTriggerAiQuiz}
              aiLoading={aiLoading}
            />
          </div>
        )}

        {/* ========================================== */}
        {/* VIEW 2: CATEGORY EXPLORER DIRECTORY        */}
        {/* ========================================== */}
        {currentRoute === '#categories' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-300 space-y-8">
            <div className="space-y-2">
              <h1 className="text-3.5xl font-extrabold tracking-tight text-slate-900">Cognitive Assessment Directory</h1>
              <p className="text-sm text-slate-500 max-w-3xl">
                Choose from our comprehensive school and Olympiad practice catalog. Filter through practice questions, mental math exercises, and curriculum assessments designed for logic-building.
              </p>
            </div>

            {/* ========================================================== */}
            {/* ⭐ THE "TRUST INFRASTRUCTURE" SOCIAL PROOF RIBBON (Req 3)   */}
            {/* ========================================================== */}
            <div id="social-proof-ribbon" className="bg-slate-900 text-white rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-around gap-6 border border-slate-800 shadow-xl overflow-hidden relative text-left">
              {/* Dynamic bottom glowing indicator bar */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#4F46E5] via-[#F59E0B] to-[#10B981] animate-pulse"></div>
              
              <div className="flex items-center gap-3">
                <span className="text-2xl animate-bounce shrink-0">⭐</span>
                <div className="text-left">
                  <span className="text-base sm:text-lg font-black text-white tracking-tight">1.5M+</span>
                  <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider font-mono">Tests Attempted</span>
                </div>
              </div>

              <div className="hidden sm:block text-slate-700">|</div>

              <div className="flex items-center gap-3">
                <span className="text-2xl shrink-0">🏆</span>
                <div className="text-left">
                  <span className="text-base sm:text-lg font-black text-[#F59E0B] tracking-tight">18,000+</span>
                  <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider font-mono">Ranked in Top 99th Percentile</span>
                </div>
              </div>

              <div className="hidden sm:block text-slate-700">|</div>

              <div className="flex items-center gap-3">
                <span className="text-2xl text-emerald-400 shrink-0">📈</span>
                <div className="text-left">
                  <span className="text-base sm:text-lg font-black text-emerald-400 tracking-tight">+34%</span>
                  <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider font-mono">Avg. Score Increase</span>
                </div>
              </div>
            </div>

            {/* Comprehensive filters & Search inputs */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap gap-4 items-center justify-between shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Filter by Focus</span>
                  <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                    {[
                      { id: 'all', label: 'All Catalog' },
                      { id: 'iq', label: 'Cognitive Skills' },
                      { id: 'olympiad', label: 'Olympiad Prep' },
                      { id: 'school', label: 'Class Syllabus' }
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        type="button"
                        onClick={() => setSelectedCategoryFilter(btn.id)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                          selectedCategoryFilter === btn.id 
                            ? 'bg-indigo-600 text-white shadow-sm' 
                            : 'text-slate-600 hover:text-slate-800'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Complexity Scale</span>
                  <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                    {[
                      { id: 'all', label: 'All Levels' },
                      { id: 'easy', label: 'Easy' },
                      { id: 'medium', label: 'Medium' },
                      { id: 'hard', label: 'Hard' }
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        type="button"
                        onClick={() => setSelectedDifficultyFilter(btn.id)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                          selectedDifficultyFilter === btn.id 
                            ? 'bg-indigo-600 text-white shadow-sm' 
                            : 'text-slate-600 hover:text-slate-800'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex-1 max-w-xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Interactive Keyword Search</span>
                <input
                  type="text"
                  placeholder="Type parameters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            {/* Dynamic Focus Spotlight & Academic Insights Card (CRO & User Engagement Boost) */}
            <div className="bg-gradient-to-r from-indigo-50 via-slate-50 to-blue-50 p-5 rounded-2xl border border-indigo-100/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-300 mb-6 text-left">
              <div className="space-y-2 max-w-2xl">
                {selectedCategoryFilter === 'all' && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🌟</span>
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">Comprehensive Academic Catalog</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Explore our fully aligned diagnostic modules, official Olympiad practice tests, and certified cognitive assessment portals. Everything on IQ200 is 100% free of charge to build student confidence. Let's unlock your potential!
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase px-2.5 py-1 rounded-md">🧠 3,500+ Active Questions</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2.5 py-1 rounded-md">🏆 Verifiable Certificates</span>
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase px-2.5 py-1 rounded-md">⭐ No Credit Card Required</span>
                    </div>
                  </>
                )}
                {selectedCategoryFilter === 'iq' && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🧠</span>
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">Cognitive & Logical Reasoning Focus</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Did you know? **Fluid intelligence ($G_f$)** governs abstract pattern-matching and quick deduction. Practicing topological patterns, numerical series, and syllogisms increases cognitive literacy and speed.
                    </p>
                    <div className="bg-white/90 p-3 rounded-xl border border-indigo-100/50 text-[11px] text-slate-700 font-medium space-y-1">
                      <div className="font-black text-indigo-700 uppercase tracking-wider text-[10px]">💡 Mini Brainteaser of the Day:</div>
                      <div>If <span className="font-mono bg-slate-100 px-1 py-0.5 rounded font-bold text-slate-950">2, 6, 14, 30, 62...</span>, the next number is calculated via <span className="font-mono bg-slate-100 px-1 py-0.5 rounded font-bold text-slate-950">(n * 2) + 2 = 126</span>. Ready to sharpen your mind? Try our Cognitive Skill Challenge below!</div>
                    </div>
                  </>
                )}
                {selectedCategoryFilter === 'olympiad' && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🧮</span>
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">Elite Olympiad Preparation</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Targeting a national rank in **SOF (Science Olympiad Foundation)** or **ITO (Indian Talent Olympiad)**? Our prep quizzes feature rigorous problems across math, science, and english that push beyond standard school board limits.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <a href="#syllabus" className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-sm">
                        📋 View Olympiad Syllabus
                      </a>
                      <button 
                        onClick={() => {
                          const chatInput = document.getElementById('olymbot-chat-input');
                          if (chatInput) {
                            (chatInput as HTMLInputElement).value = "Give me study tips for SOF Maths Olympiad!";
                            chatInput.focus();
                          }
                          const chatBtn = document.getElementById('olymbot-trigger-button');
                          if (chatBtn) chatBtn.click();
                        }} 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                      >
                        🗣️ Ask OlymBot for Prep Tips
                      </button>
                    </div>
                  </>
                )}
                {selectedCategoryFilter === 'school' && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📚</span>
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">Class Curriculum Alignment</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Align your learning with school board standards for Classes 1 through 10. These quizzes ensure standard textbook topics (fractions, thermodynamics, gravitation, grammar) are mastered in an interactive exam format.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <a href="#syllabus" className="text-indigo-600 hover:text-indigo-800 text-xs font-black underline flex items-center gap-1">
                        Syllabus & Curriculum Guide →
                      </a>
                    </div>
                  </>
                )}
              </div>

              <div className="bg-white px-5 py-4 rounded-2xl border border-slate-100 text-center shrink-0 w-full md:w-auto shadow-xs flex flex-row md:flex-col items-center justify-between md:justify-center gap-3">
                <div className="text-left md:text-center">
                  <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider font-mono">Current Focus Goal</span>
                  <span className="text-sm font-black text-indigo-600 block">
                    {selectedCategoryFilter === 'all' && "Mastery Catalog"}
                    {selectedCategoryFilter === 'iq' && "Cognitive Accuracy"}
                    {selectedCategoryFilter === 'olympiad' && "SOF/ITO Top Tier"}
                    {selectedCategoryFilter === 'school' && "Class Excellence"}
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (selectedCategoryFilter === 'all' || selectedCategoryFilter === 'school') {
                      window.location.hash = '#syllabus';
                    } else {
                      const chatBtn = document.getElementById('olymbot-trigger-button');
                      if (chatBtn) chatBtn.click();
                    }
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black py-2.5 px-4 rounded-xl shadow-xs transition-transform active:scale-95 uppercase tracking-wider"
                >
                  {(selectedCategoryFilter === 'all' || selectedCategoryFilter === 'school') ? "Explore Syllabus" : "Talk with AI"}
                </button>
              </div>
            </div>

            {/* List block */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredQuizzes.length === 0 ? (
                <div className="col-span-3 py-12 text-center text-slate-400">
                  <AlertCircle className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  No results match current filters. Check again or create custom quizzes.
                </div>
              ) : (
                filteredQuizzes.map((quiz) => {
                  const gradientMap: { [key: string]: string } = {
                    iq: 'from-purple-500 to-indigo-600',
                    olympiad: 'from-amber-400 to-[#FF5722]',
                    trivia: 'from-blue-400 to-indigo-500',
                    school: 'from-emerald-400 to-teal-600',
                    custom: 'from-pink-500 to-rose-500'
                  };

                  const iconMap: { [key: string]: string } = {
                    iq: '🧠',
                    olympiad: '🧮',
                    trivia: '🌎',
                    school: '📚',
                    custom: '✨'
                  };

                  // Peer pass rate generator
                  const passRate = quiz?.title ? (quiz.title.charCodeAt(0) % 25) + 55 : 78;

                  return (
                    <div 
                      key={quiz.id}
                      className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:-translate-y-1.5 hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between text-left group"
                    >
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="bg-slate-100 text-slate-850 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                            {quiz.subcategory}
                          </span>
                          
                          {/* Urgency & Exclusivity dynamic tags */}
                          {quiz.difficulty === 'easy' && (
                            <span className="text-[9px] font-black px-2.5 py-1 rounded-full uppercase bg-emerald-50 text-emerald-600 flex items-center gap-1 shadow-2xs">
                              <span className="w-1 h-1 rounded-full bg-emerald-550 bg-emerald-500 animate-ping"></span>
                              ✨ Foundation
                            </span>
                          )}
                          {quiz.difficulty === 'medium' && (
                            <span className="text-[9px] font-black px-2.5 py-1 rounded-full uppercase bg-amber-50 text-[#F59E0B] flex items-center gap-1 shadow-2xs">
                              <span className="w-1 h-1 rounded-full bg-amber-550 bg-amber-500 animate-ping"></span>
                              🔥 Trending
                            </span>
                          )}
                          {quiz.difficulty === 'hard' && (
                            <span className="text-[9px] font-black px-2.5 py-1 rounded-full uppercase bg-rose-50 text-rose-600 flex items-center gap-1 shadow-2xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-550 bg-rose-500 animate-pulse"></span>
                              ⚡ Elite Challenge
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3.5">
                          {/* Vibrant gradient icon container */}
                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradientMap[quiz.category] || 'from-indigo-500 to-indigo-600'} text-white flex items-center justify-center text-2xl shadow-md shrink-0`}>
                            {iconMap[quiz.category] || '💡'}
                          </div>
                          <div>
                            <h3 className="font-extrabold text-slate-900 text-base tracking-tight leading-snug group-hover:text-[#4F46E5] transition-colors">{quiz.title}</h3>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">Mission Lock active</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          {quiz.description}
                        </p>

                        <div className="grid grid-cols-2 gap-3 pt-3 text-[11px] text-slate-500 font-bold border-t border-slate-100">
                          <div className="flex items-center gap-1.5">
                            <HelpCircle className="w-3.5 h-3.5 text-indigo-500" /> {quiz.questions?.length || 0} Questions
                          </div>
                          <div className="flex items-center gap-1.5 text-right justify-end">
                            <Clock className="w-3.5 h-3.5 text-indigo-500" /> {Math.round((quiz.timeLimit || 600) / 60)} Mins
                          </div>
                        </div>

                        {/* Simulated Completion rate Progress Bar (CRO Boost) */}
                        <div className="space-y-1.5 pt-3 border-t border-slate-100">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-400">
                            <span>Avg. peer pass rate</span>
                            <span className="text-[#00A86B]">{passRate}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 rounded-full group-hover:bg-[#00A86B] transition-all duration-500" 
                              style={{ width: `${passRate}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">{quiz.creator || 'IQ200 lead creators'}</span>
                        <button
                          onClick={() => startQuiz(quiz)}
                          className="bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs font-black py-2.5 px-5 rounded-xl shadow-md hover:shadow-lg transition-all group-hover:scale-103 active:scale-97 cursor-pointer uppercase tracking-wider"
                        >
                          Start Mission
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            {/* AdSense Inline Feed Ad Slot */}
            <AdSenseComponent placement="inline_feed" />

          </div>
        )}

        {/* ========================================== */}
        {/* VIEW: OFFICIAL SYLLABUS DISCOVERY GUIDE   */}
        {/* ========================================== */}
        {currentRoute === '#syllabus' && (
          <SyllabusGuideView />
        )}

        {/* ========================================== */}
        {/* VIEW: SYLLABUS DIRECTORY MATRIX INDEX     */}
        {/* ========================================== */}
        {currentRoute === '#syllabus-matrix' && (
          <SyllabusDirectoryView 
            onNavigate={navigateTo} 
            initialClass={syllabusClassFilter}
          />
        )}

        {/* ========================================== */}
        {/* VIEW: DYNAMIC CURRICULUM LANDING TESTS    */}
        {/* ========================================== */}
        {currentRoute.startsWith('#class-') && !currentRoute.includes('/') && (
          <CurriculumLandingView 
            routeSlug={currentRoute.slice(1)} 
            user={user} 
            onNavigate={navigateTo} 
            onTriggerLogin={() => setIsLoginOpen(true)}
            onSaveCertificate={handleSaveCertificate}
          />
        )}

        {/* ========================================== */}
        {/* VIEW: SEO PROGRAMMATIC QUESTION DETAIL VIEW*/}
        {/* ========================================== */}
        {currentRoute.startsWith('#class-') && currentRoute.includes('/') && (() => {
          const parts = currentRoute.slice(1).split('/');
          const qId = parts[parts.length - 1];
          const foundQ = dbQuestions.find(q => q.id.toLowerCase() === qId.toLowerCase() || q.id === qId) || 
                         dbQuestions.find(q => q.id.toLowerCase().includes(qId.toLowerCase()));
          
          if (foundQ) {
            return (
              <SEOQuestionPage
                question={foundQ}
                allQuestions={dbQuestions}
                onNavigate={navigateTo}
              />
            );
          } else {
            return (
              <div className="max-w-4xl mx-auto py-12 px-4 text-center space-y-4">
                <h2 className="text-xl font-bold text-slate-850">Olympiad Question Not Found</h2>
                <p className="text-slate-500 text-sm">The syllabus resource item you requested is being synthesized or loaded. Please explore other question sheets.</p>
                <button onClick={() => navigateTo('#syllabus')} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-black cursor-pointer shadow transition-all hover:bg-indigo-700">
                  Explore Syllabus Directory
                </button>
              </div>
            );
          }
        })()}

        {/* ========================================== */}
        {/* VIEW 3: ACTIVE QUIZ EXECUTOR SESSION      */}
        {/* ========================================== */}
        {activeQuiz && currentRoute.startsWith('#quiz/') && (
          <div className="max-w-4xl mx-auto px-4 py-12">
            <QuizSession
              quiz={activeQuiz}
              onCancel={() => {
                setActiveQuiz(null);
                navigateTo('#home');
              }}
              onSubmit={handleQuizSubmit}
            />
          </div>
        )}

        {/* ========================================== */}
        {/* VIEW 4: RESULTS PAGE                       */}
        {/* ========================================== */}
        {currentRoute === '#result' && lastResult && (
          <div className="max-w-5xl mx-auto px-4 py-8">
            <ResultPanel
              result={lastResult}
              quiz={lastQuiz || {
                id: lastResult.quizId,
                title: lastResult.quizTitle,
                description: 'Evaluation results summary scorecard.',
                category: 'school',
                subcategory: lastResult.subject,
                difficulty: 'medium',
                classLevel: lastResult.classLevel,
                timeLimit: lastResult.timeSpent,
                questions: []
              }}
              answers={lastAnswers}
              onReviewCertificate={() => {
                if (lastResult.certificateId) {
                  navigateTo(`#certificate/${lastResult.certificateId}`);
                } else {
                  alert('Complete tests with scoring 6/10 or above (60%) to unlock verified print achievements!');
                }
              }}
              onNavigateHome={() => navigateTo('#home')}
              onAttemptAgain={() => navigateTo('#categories')}
              onRetryExact={() => {
                if (lastQuiz) {
                  startQuiz(lastQuiz);
                }
              }}
            />
          </div>
        )}

        {/* ========================================== */}
        {/* VIEW 5: CERTIFICATE VIEW                   */}
        {/* ========================================== */}
        {currentRoute.startsWith('#certificate/') && (() => {
          const certId = currentRoute.split('/').pop() || '';
          return (
            <div className="max-w-5xl mx-auto py-6">
              <PublicCertificateView certificateId={certId} />
            </div>
          );
        })()}

        {/* ========================================== */}
        {/* VIEW 5.5: FRIEND CHALLENGE VIEW             */}
        {/* ========================================== */}
        {currentRoute.startsWith('#challenge/') && (() => {
          const challengeId = currentRoute.split('/').pop() || '';
          return (
            <div className="max-w-5xl mx-auto py-6">
              <FriendChallengeView 
                challengeId={challengeId} 
                user={user} 
                onNavigate={navigateTo} 
              />
            </div>
          );
        })()}

        {/* ========================================== */}
        {/* VIEW 6: CERTIFICATE VAULT LIST             */}
        {/* ========================================== */}
        {currentRoute === '#certificates' && (
          <div className="max-w-4xl mx-auto px-4 py-12 text-left space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold text-slate-900">Your Verifiable Student Certificate Vault</h1>
              <p className="text-sm text-slate-500">
                Access digital records automatically issued for achievements of 60% or superior in Olympiads or curriculum practice exams.
              </p>
            </div>

            {!user ? (
              <div className="bg-white p-8 rounded-2xl border text-center space-y-3">
                <Lock className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">Authentication Required</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">Please identify your student practice profile to load achieved award parameters.</p>
                <button onClick={() => setIsLoginOpen(true)} className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl">
                  Sign In / Create Account
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.filter(c => c.studentName === user.name).length === 0 ? (
                  <div className="col-span-2 bg-white rounded-2xl p-12 text-center border space-y-2">
                    <Award className="w-10 h-10 text-indigo-100 mx-auto" />
                    <p className="font-bold text-slate-700">No Diplomas In Your Vault Yet</p>
                    <p className="text-xs text-slate-400">Score 6/10 elements correct on any curriculum exam, and your certification generates live!</p>
                    <button onClick={() => navigateTo('#home')} className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl mt-2">
                      Start Test
                    </button>
                  </div>
                ) : (
                  certificates.filter(c => c.studentName === user.name).map((cert) => (
                    <div 
                      key={cert.id}
                      onClick={() => navigateTo(`#certificate/${cert.id}`)}
                      className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-400 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase text-indigo-600 tracking-wider">
                          Standard: {cert.classLevel} ({cert.medal.toUpperCase()} GRADE)
                        </span>
                        <h4 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">
                          {cert.subject} Skill Evaluation
                        </h4>
                        <p className="text-[11px] text-slate-400">Serial Code: {cert.uniqueId}</p>
                      </div>
                      <Eye className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================== */}
        {/* VIEW 7: LEADERSBOARD STANDINGS             */}
        {/* ========================================== */}
        {currentRoute === '#leaderboard' && (
          <div className="max-w-5xl mx-auto py-10">
            <LeaderboardPage user={user} />
          </div>
        )}

        {/* ========================================== */}
        {/* VIEW 8: CLINICAL EDUCATIONAL LIBRARY HUB   */}
        {/* ========================================== */}
        {(currentRoute === '#blog' || currentRoute.startsWith('#blog/')) && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-300">
            <EducationalLibraryView
              blogs={blogs}
              selectedBlogSlug={selectedBlogSlug}
              onSelectBlog={setSelectedBlogSlug}
              onNavigate={navigateTo}
            />
          </div>
        )}

        {/* ========================================== */}
        {/* VIEW 9: ABOUT US MANIFESTO (EEAT Cred)     */}
        {/* ========================================== */}
        {currentRoute === '#about' && (
          <div className="max-w-5xl mx-auto px-4 py-12 animate-in fade-in duration-300 space-y-12 text-left">
            
            {/* Mission Hero Header */}
            <div className="space-y-4 max-w-4xl">
              <span className="bg-indigo-50 border border-indigo-150 text-indigo-700 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full inline-block leading-none">
                E-E-A-T Curriculum Statement
              </span>
              <h1 className="text-3.5xl sm:text-4.5xl font-extrabold text-slate-900 tracking-tight leading-none">
                Democratizing K-12 Logic: <span className="text-indigo-600">Our Human Commitment</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-semibold">
                Designed by supplementary school teachers, Olympiad authors, and child psychologists. Built from the ground up to offer 100% paywall-free, high-yield diagnostic resources for Class 2 to 10.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Human Story & Reviews Panel */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* 1. Our Origin Story */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-5 shadow-xs">
                  <h3 className="text-lg font-black text-slate-950 flex items-center gap-2">
                    <span className="text-xl">🌿</span> Our Origin Story
                  </h3>
                  <div className="text-xs sm:text-sm text-slate-655 leading-relaxed font-semibold space-y-4">
                    <p>
                      As supplemental classroom instructors, we frequently observed a worrying trend: children were often guided toward rote formula memorization rather than building true relational logic. Worse, finding comprehensive, distraction-free home evaluation exercises aligned with boards like CBSE or ICSE almost always led to high subscription fees, forced credit card logins, or predatory email lockouts.
                    </p>
                    <p>
                      <strong>IQ200 was established to break this friction.</strong> We set a strict, non-negotiable principle: all evaluation suites, diagnostic practice models, and printable achievement certificates must remain completely free of cost. We believe that a child's academic confidence and preparation velocity should never be limited by financial capabilities.
                    </p>
                    <p>
                      IQ200 is built, owned, and operated by <strong>Sachin Borade</strong>. Under Sachin's active stewardship and domain curation, the platform supplies supplementary math, science, and verbal Olympiad challenges directly to families around the globe with maximum cognitive comfort and strict security. You can contact our team at <a href="mailto:boradesp@gmail.com" className="text-indigo-600 hover:underline">boradesp@gmail.com</a>.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-center">
                    <div className="p-4 bg-indigo-50/40 rounded-xl space-y-1 border border-indigo-100">
                      <span className="text-indigo-700 font-extrabold text-lg block leading-none">100% Free</span>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block font-mono">No Premium Paywalls</span>
                    </div>
                    <div className="p-4 bg-amber-50/40 rounded-xl space-y-1 border border-amber-200">
                      <span className="text-amber-700 font-extrabold text-lg block leading-none">Syllabus Mapped</span>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block font-mono">CBSE & ICSE Aligned</span>
                    </div>
                    <div className="p-4 bg-emerald-50/40 rounded-xl space-y-1 border border-emerald-200">
                      <span className="text-emerald-700 font-extrabold text-lg block leading-none">Positive Boost</span>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block font-mono">Printable Certificates</span>
                    </div>
                  </div>
                </div>

                {/* 2. Editorial Vetting Policy (E-E-A-T compliance) */}
                <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-5.5 h-5.5 text-indigo-600" />
                      Editorial Vetting & Accessibility Guidelines
                    </h3>
                    <p className="text-xs text-slate-450 font-bold">How we formulate and verify content for pediatric learners.</p>
                  </div>

                  <div className="text-xs text-slate-650 font-semibold space-y-3 leading-relaxed">
                    <p>
                      To maximize parental trust and protect mental safety, every single multiple-choice question and syllabus roadmap on IQ200 passes through a highly structured 4-step validation pipeline:
                    </p>
                    <ul className="space-y-2.5 pl-4 list-decimal list-inside text-slate-705">
                      <li>
                        <strong className="text-slate-900">Expert Drafting:</strong> Senior curriculum instructors draft items based on official NCERT, CBSE, ICSE, and Science Olympiad Guidelines.
                      </li>
                      <li>
                        <strong className="text-slate-900">Psychological Screening:</strong> Questions are screened for age-incompatible phrasing. We strictly prohibit high-stress countdown timers or punitive messaging.
                      </li>
                      <li>
                        <strong className="text-slate-900">Double-Verification:</strong> All correct answers and detailed explanation prompts are peer-reviewed by our author grid to eliminate computational errors.
                      </li>
                      <li>
                        <strong className="text-slate-900">AdSense Policy Compliance & Privacy Protection:</strong> We serve strictly family-friendly, non-personalized contextual ads to cover cloud hosting. We collect no child identifying coordinates. No behavior tracking is allowed.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* 3. Interactive Content Strategy plan matrix (Phases 2 & 5) */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-5 shadow-xs">
                  <div className="space-y-1">
                    <span className="bg-purple-100 text-purple-800 text-[9px] px-2.5 py-0.5 rounded font-black uppercase tracking-wider block w-fit">Content Strategy Matrix</span>
                    <h3 className="text-lg font-black text-slate-950">
                      100 High-Value Article Content Roadmap
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">
                      Below is our transparent curriculum publication roadmap designed to transform this portal into a premier authority.
                    </p>
                  </div>

                  {/* Curated list representing core articles from SEO 100 planned roadmap */}
                  <div className="border border-slate-150 rounded-2xl overflow-hidden text-xs">
                    <div className="bg-slate-900 text-white p-3.5 font-bold grid grid-cols-12 gap-2">
                      <div className="col-span-4 uppercase tracking-wider text-[10px]">Article title (SEO Guide)</div>
                      <div className="col-span-3 uppercase tracking-wider text-[10px]">Focus Keyword</div>
                      <div className="col-span-2 uppercase tracking-wider text-[10px]">Search intent</div>
                      <div className="col-span-3 uppercase tracking-wider text-[10px]">Lilo Mapping</div>
                    </div>
                    
                    <div className="divide-y divide-slate-150 bg-slate-50/20 font-semibold text-slate-750">
                      {[
                        { title: "IMO Olympiad Class 4 Preparation Blueprint", kw: "olympiad prepare class 4", intent: "Commercial", lilo: "Class 4 Hub" },
                        { title: "Decoding the CBSE Board Evaluation Grid", kw: "cbse evaluation standard", intent: "Informational", lilo: "Class 10 Syllabus" },
                        { title: "Fraction Division: The 'Keep-Change-Flip' Proof", kw: "how to divide fractions", intent: "Transactional", lilo: "Class 5 Maths" },
                        { title: "Science of IQ: Cognitive Training Score Explained", kw: "child cognitive training", intent: "Informational", lilo: "Parent Guides" },
                        { title: "Mastering Conjunctions & Syntax for Class 6 IEO", kw: "english conjunction test", intent: "Commercial", lilo: "Class 6 English" },
                        { title: "Hindi Grammar: Mastering Genders & Sandhi Rules", kw: "hindi vyakaran sandhi", intent: "Informational", lilo: "Hindi Hubs" },
                        { title: "Syllabus Matrix for Class 5 National Science Olympiad", kw: "class 5 nso syllabus", intent: "Commercial", lilo: "Class 5 Hub" },
                        { title: "Venn Diagram Logic Rules for Competitive Exams", kw: "venn diagram puzzle tricks", intent: "Transactional", lilo: "Logical Reasoning" },
                        { title: "How parents can manage pre-test anxiety in children", kw: "child test anxiety tips", intent: "Informational", lilo: "Parent Guides" },
                        { title: "Matrix Coding: Solved Examples for Grade 8", kw: "matrix reasoning tricks", intent: "Commercial", lilo: "Class 8 Logic" }
                      ].map((art, idx) => (
                        <div key={idx} className="p-3.5 grid grid-cols-12 gap-2 hover:bg-white transition-colors">
                          <div className="col-span-4 text-slate-900 font-extrabold">{art.title}</div>
                          <div className="col-span-3 font-mono text-[10.5px] text-slate-500 font-bold">{art.kw}</div>
                          <div className="col-span-2 text-indigo-700 font-extrabold">{art.intent}</div>
                          <div className="col-span-3 text-emerald-700 font-bold">{art.lilo}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-[10.5px] text-indigo-900 font-semibold leading-normal">
                    💡 <strong>SEO Compliance Authority Note:</strong> Publication follows strict organic silos. The priority 20 articles listed represent high-relevance terms with substantial local student volume to secure smooth Google AdSense approvals.
                  </div>
                </div>

              </div>

              {/* Right Column: Database and Editorial Sourcing Standards */}
              <div className="lg:col-span-4 space-y-6">
                
                <div className="bg-white border border-slate-200 rounded-3xl p-5.5 space-y-4 shadow-xs">
                  <h4 className="text-xs font-black uppercase text-indigo-600 tracking-wider">Sourcing & Curriculum Standards</h4>
                  <p className="text-[10px] text-slate-450 font-semibold leading-relaxed">
                    How we construct and validate our diagnostic content.
                  </p>

                  <div className="space-y-4 divide-y divide-slate-100">
                    
                    {/* Standard 1 */}
                    <div className="pt-3 first:pt-0 space-y-2 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">📚</span>
                        <div>
                          <h5 className="text-xs font-black text-slate-950">Curriculum Source Mapping</h5>
                          <span className="text-[9px] text-slate-400 font-bold block">CBSE & General Olympiad Frameworks</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 font-semibold leading-normal">
                        Our mock papers and practice questions are systematically mapped against the latest official NCERT books, CBSE guidelines, and typical Science & Mathematics Olympiad syllabi.
                      </p>
                    </div>

                    {/* Standard 2 */}
                    <div className="pt-4 space-y-2 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🔬</span>
                        <div>
                          <h5 className="text-xs font-black text-slate-950">Step-by-Step Proof Verification</h5>
                          <span className="text-[9px] text-slate-400 font-bold block">Conceptual Accuracy Audit</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 font-semibold leading-normal">
                        Rather than displaying simple correct/incorrect flags, every question has a thoroughly typed logical proof or breakdown to resolve children's conceptual friction.
                      </p>
                    </div>

                    {/* Standard 3 */}
                    <div className="pt-4 space-y-2 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🛡️</span>
                        <div>
                          <h5 className="text-xs font-black text-slate-950">Child Safety & Cognitive Comfort</h5>
                          <span className="text-[9px] text-slate-400 font-bold block">Age-Appropriate Complexity</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 font-semibold leading-normal">
                        We regulate the text length and vocabulary complexity profiles of each problem grade-by-grade to encourage focused attention and prevent cognitive fatigue.
                      </p>
                    </div>

                  </div>
                </div>

                {/* Google Policy Whitelist Shield */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5.5 space-y-3">
                  <h4 className="text-xs font-black text-slate-950 flex items-center gap-1.5 uppercase tracking-wider">
                    🛡️ AdSense Compliance
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                    IQ200 fully aligns with the Google Publisher Policies for Children's Educational Platforms. Any display advertising served during information-reading routes is heavily filtered, non-personalized, family-suitable, and completely safe.
                  </p>
                </div>

              </div>
              
            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* VIEW 10: CONTACT US FORM                   */}
        {/* ========================================== */}
        {currentRoute === '#contact' && (
          <div className="max-w-5xl mx-auto px-4 py-12 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <h1 className="text-3.5xl font-extrabold text-slate-900">Get in Touch</h1>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Have questions about specific syllabus criteria, verification codes, or student learning activities? Fill in our contact parameters.
                  </p>
                </div>

                <div className="space-y-4 text-xs font-semibold text-slate-600 text-left bg-slate-50 p-6 rounded-2xl border border-slate-150">
                  <h3 className="font-extrabold text-slate-900 text-sm">Ownership & Transparency</h3>
                  <p>👑 <strong>Owner/Operator:</strong> Sachin Borade</p>
                  <p>🏢 <strong>Institution:</strong> IQ200 Learning Solutions Educational Hub</p>
                  <p>📍 <strong>Registered Address:</strong> Unit 4B, Sector 62, Noida, NCR, India</p>
                  <p>✉️ <strong>Direct Contact Email:</strong> <a href="mailto:boradesp@gmail.com" className="text-indigo-600 hover:underline">boradesp@gmail.com</a></p>
                  <p>🕒 <strong>Response Timeframe:</strong> We respond to all inquiries within 24–48 hours.</p>
                  <p>💼 <strong>Business Registry:</strong> Operational as an independent sole proprietorship and school practice platform.</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Full Name</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Parent Name"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Email Address</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="parent@example.com"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Subject Inquiry</label>
                    <input
                      type="text"
                      required
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      placeholder="e.g. Verifying my certificate 10328"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Inquiry Details</label>
                    <textarea
                      required
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Please compose your query elements..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                    ></textarea>
                  </div>

                  {contactSuccessMsg && (
                    <p className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg">{contactSuccessMsg}</p>
                  )}
                  {contactErrorMsg && (
                    <p className="p-3 bg-rose-50 text-rose-600 text-xs font-bold rounded-lg">{contactErrorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={contactSubmitting}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
                  >
                    {contactSubmitting ? 'Submitting query...' : 'Deliver Inquiry Message'}
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* VIEW 10.1: PRIVACY POLICY & COPPA DISPUTE */}
        {/* ========================================== */}
        {currentRoute === '#privacy' && (
          <div className="max-w-4xl mx-auto px-4 py-12 text-left space-y-8 animate-in fade-in duration-300">
            <div className="space-y-3">
              <h1 className="text-3.5xl font-extrabold text-slate-900 tracking-tight">Privacy Policy & Child Safety</h1>
              <p className="text-sm text-slate-500">Effective Date: June 20, 2026 | Last Updated: June 20, 2026</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 text-sm text-slate-755 leading-relaxed">
              <section className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 border-b pb-1">1. Commitment to Child & Student Safety (COPPA Compliance)</h3>
                <p>
                  At IQ200 Academy, we are deeply committed to protecting the privacy of child users. Our platform offers curriculum practice and educational self-assessments. In full compliance with the <strong>Children's Online Privacy Protection Act (COPPA)</strong>:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-650">
                  <li>We <strong>do not</strong> require children to provide any personal information or identifiers to complete learning quizzes.</li>
                  <li>Account registration is completely optional. If a child elects to participate in scoring leaderboards, they are encouraged to register using a stylized, anonymous <strong>nickname or first name only</strong>.</li>
                  <li>We do not collect physical addresses, telephone numbers, or behavioral advertising cookies from child-directed sections of our platform.</li>
                  <li>We have <strong>no targeted behavioral ads</strong> aimed at children. Any AdSense or display ads activated on our contextual content pages are non-personalized, family-safe, and vetted.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 border-b pb-1">2. Parent Control Rights</h3>
                <p>
                  Parents have absolute control over their children's saved self-assessment records:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-650">
                  <li>You can request the immediate deletion of your child's student practice profile and any associated medals/certificates.</li>
                  <li>If you wish to review, audit, or permanently wipe any practice record registry from our system, simply write to our privacy officer, <strong>Sachin Borade</strong>, at <a href="mailto:boradesp@gmail.com" className="text-indigo-600 underline font-semibold">boradesp@gmail.com</a> with the candidate's registration details.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 border-b pb-1">3. Cookies & Analytical Data</h3>
                <p>
                  We utilize standard, secure first-party essential cookies strictly to maintain user authentication status, keep the theme context stable, and facilitate safe quiz state saves. We do not engage in cross-site tracking or compile behavioral profiles.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 border-b pb-1">4. Information Sharing & Third Parties</h3>
                <p>
                  We <strong>never sell, lease, or distribute</strong> student assessment logs, names, or performance scores to any marketing brokers, advertisers, or programmatic targeting networks.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 border-b pb-1">5. Contact Our Privacy Officer</h3>
                <p>
                  For child-safety and privacy audits, please contact our dedicated Trust officer and platform owner:
                  <br />
                  <strong>Owner:</strong> Sachin Borade
                  <br />
                  <strong>Email:</strong> <a href="mailto:boradesp@gmail.com" className="text-indigo-600 underline">boradesp@gmail.com</a>
                </p>
              </section>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* VIEW 10.2: TERMS OF SERVICE & REFUNDS      */}
        {/* ========================================== */}
        {currentRoute === '#terms' && (
          <div className="max-w-4xl mx-auto px-4 py-12 text-left space-y-8 animate-in fade-in duration-350">
            <div className="space-y-3">
              <h1 className="text-3.5xl font-extrabold text-slate-900 tracking-tight">Terms of Service & Disclaimers</h1>
              <p className="text-sm text-slate-500">Effective Date: June 20, 2026 | Last Updated: June 20, 2026</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 text-sm text-slate-755 leading-relaxed">
              <section className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 border-b pb-1">1. Scope of Service</h3>
                <p>
                  IQ200 Academy matches practice curriculums, Math and Science Olympiad structures, and basic educational general knowledge quizzes to support home studies and academic review. All access to standard assessment suites, mock challenges, and certificate generations is <strong>100% free of charge</strong>.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 border-b pb-1">2. No Billing & Refund Policy</h3>
                <p>
                  Because all our core student tools, educational library systems, and practice certificates are offered completely free of cost:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-650">
                  <li>No subscription payments or credit card parameters are collected or authorized on our servers.</li>
                  <li>In the event of custom physical certificate printing distributions or optional school-sponsored premium events (if introduced via separate institutional agreements), refund parameters will be governed separately by simple money-back guarantees on local support channels.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 border-b pb-1">3. General Medical & Educational Disclaimer</h3>
                <p className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 text-slate-700 font-semibold text-xs leading-relaxed">
                  <strong>DISCLAIMER:</strong> IQ200 educational assessments, cognitive practice exercises, and relative scoring matrices are organized strictly for illustrative training, practice, and logical entertainment purposes. These challenges do not represent clinical, neurological, psychological, or medical evaluation standards. The score indicators generated by practice metrics do not guarantee official eligibility in independent national Olympiads, and should not be used as clinical diagnostic parameters.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 border-b pb-1">4. Acceptable Conduct Guidelines</h3>
                <p>
                  Students, teachers, and parents are welcome to utilize our material for classroom teaching aids or supplementary home study. Scraping, DDoS operations, or abusing the custom AI Quiz writer with inappropriate prompts is strictly prohibited.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 border-b pb-1">5. Registry & Licensing Info</h3>
                <p>
                  Owner/Operator: Sachin Borade, IQ200 Learning Solutions Educational Hub, India. For official curriculum licenses, teachers can file submissions at <a href="mailto:boradesp@gmail.com" className="text-indigo-600 underline">boradesp@gmail.com</a>.
                </p>
              </section>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* VIEW 11: ADMIN PANEL                       */}
        {/* ========================================== */}
        {currentRoute === '#admin' && (
          <div className="max-w-5xl mx-auto px-4 py-12 text-left">
            <div className="border-b border-slate-100 pb-4 mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Operations Center</h1>
                <p className="text-xs text-slate-500 mt-1">Stash custom quizzes, view inquiries, or publish content metrics.</p>
              </div>
              {isAdminAuthenticated && (
                <button 
                  onClick={() => setIsAdminAuthenticated(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Admin Logout
                </button>
              )}
            </div>

            {!isAdminAuthenticated ? (
              <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
                <Lock className="w-10 h-10 text-indigo-500 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">Passcode Required</h3>
                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold text-slate-500">Master Authentication Token</label>
                  <input
                    type="password"
                    placeholder="Enter admin token (Use: iq200admin)"
                    value={adminToken}
                    onChange={(e) => setAdminToken(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                {authError && <p className="text-xs text-rose-600 font-bold">{authError}</p>}
                <button
                  onClick={checkAdminAuth}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-xs"
                >
                  Unlock Operations Console
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                
                {/* Lateral panel controllers */}
                <div className="md:col-span-1 space-y-2">
                  {[
                    { id: 'messages', label: 'Inquiries Audit', icon: Mail },
                    { id: 'add-quiz', label: 'Compose Quiz', icon: Plus },
                    { id: 'add-blog', label: 'Write Blog', icon: BookOpen }
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setAdminSection(sub.id as any)}
                      className={`w-full text-left p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                        adminSection === sub.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-50 border'
                      }`}
                    >
                      <sub.icon className="w-4 h-4" />
                      {sub.label}
                    </button>
                  ))}
                </div>

                <div className="md:col-span-3 bg-white border border-slate-200 p-6 md:p-8 rounded-3xl min-h-[450px]">
                  
                  {/* Messages tab */}
                  {adminSection === 'messages' && (
                    <div className="space-y-4">
                      <h3 className="text-base font-extrabold text-slate-800">Support Inquiries Audit</h3>
                      <div className="space-y-3">
                        {messages.length === 0 ? (
                          <p className="text-xs text-slate-400">No support letters stashed currently.</p>
                        ) : (
                          messages.map((m) => (
                            <div key={m.id} className="p-4 bg-slate-50 rounded-xl space-y-2 border">
                              <div className="flex justify-between text-[11px] font-bold">
                                <span className="text-indigo-600">{m.name} ({m.email})</span>
                                <span className="text-slate-400">{m.sentAt}</span>
                              </div>
                              <h4 className="font-bold text-slate-700 text-xs">Subject: {m.subject}</h4>
                              <p className="text-xs text-slate-600 leading-relaxed font-semibold italic">{m.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* Manual quiz writer */}
                  {adminSection === 'add-quiz' && (
                    <form onSubmit={handleCreateQuizManual} className="space-y-4">
                      <h3 className="text-base font-bold text-slate-800">Compile Custom Curriculum Assessment</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600">Quiz Title</label>
                          <input
                            type="text"
                            required
                            value={newQuizTitle}
                            onChange={(e) => setNewQuizTitle(e.target.value)}
                            placeholder="e.g. Class 8 Cyber Olympiad qualifying rounds"
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600">Class Target Level</label>
                          <select
                            value={selectedClassFilter}
                            onChange={(e) => setSelectedClassFilter(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                          >
                            {Array.from({ length: 9 }).map((_, i) => (
                              <option key={i} value={`Class ${i + 2}`}>{`Class ${i + 2}`}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600">Subclassification Label (Subject)</label>
                          <input
                            type="text"
                            required
                            value={newQuizSubcategory}
                            onChange={(e) => setNewQuizSubcategory(e.target.value)}
                            placeholder="e.g. Mathematics"
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                          />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-xs font-bold text-slate-600">Description Overview</label>
                          <input
                            type="text"
                            required
                            value={newQuizDesc}
                            onChange={(e) => setNewQuizDesc(e.target.value)}
                            placeholder="A brief overview challenge description details..."
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600">Category Tag</label>
                          <select
                            value={newQuizCategory}
                            onChange={(e) => setNewQuizCategory(e.target.value as any)}
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                          >
                            <option value="school">Class Syllabus</option>
                            <option value="olympiad">Olympiad Prep</option>
                            <option value="iq">IQ Battery Core</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600">Difficulty Grade</label>
                          <select
                            value={newQuizDifficulty}
                            onChange={(e) => setNewQuizDifficulty(e.target.value as any)}
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                          >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600">Time Limit Allowed (Seconds)</label>
                          <input
                            type="number"
                            required
                            value={newQuizTimeLimit}
                            onChange={(e) => setNewQuizTimeLimit(Number(e.target.value))}
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                          />
                        </div>
                      </div>

                      {/* Manage questions row block */}
                      <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Question Items</h4>
                          <button
                            type="button"
                            onClick={addQuestionRow}
                            className="text-[11px] bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded"
                          >
                            Add Question Item
                          </button>
                        </div>

                        {newQuestions.map((question, qIdx) => (
                          <div key={qIdx} className="p-4 bg-slate-50 rounded-xl space-y-3 border text-left">
                            <span className="text-[10px] font-black text-indigo-600">Question Item #{qIdx + 1}</span>
                            
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-500">Core Query Text</label>
                              <input
                                type="text"
                                required
                                value={question.questionText || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setNewQuestions((prev) => {
                                    const copy = [...prev];
                                    copy[qIdx] = { ...copy[qIdx], questionText: val };
                                    return copy;
                                  });
                                }}
                                placeholder="State the question logic sequence clearly..."
                                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              {['A', 'B', 'C', 'D'].map((lbl, oIdx) => (
                                <div key={oIdx} className="space-y-1">
                                  <label className="text-[9px] font-bold text-slate-400">Option {lbl}</label>
                                  <input
                                    type="text"
                                    required
                                    value={question.options?.[oIdx] || ''}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setNewQuestions((prev) => {
                                        const copy = [...prev];
                                        const ops = [...(copy[qIdx].options || ['', '', '', ''])];
                                        ops[oIdx] = val;
                                        copy[qIdx] = { ...copy[qIdx], options: ops };
                                        return copy;
                                      });
                                    }}
                                    placeholder={`Option text ${lbl}`}
                                    className="w-full px-3 py-1 text-xs bg-white border border-slate-200 rounded-lg"
                                  />
                                </div>
                              ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500">Correct Option index selector</label>
                                <select
                                  value={question.correctOptionIndex}
                                  onChange={(e) => {
                                    const val = Number(e.target.value);
                                    setNewQuestions((prev) => {
                                      const copy = [...prev];
                                      copy[qIdx] = { ...copy[qIdx], correctOptionIndex: val };
                                      return copy;
                                    });
                                  }}
                                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                                >
                                  <option value={0}>Option A is correct</option>
                                  <option value={1}>Option B is correct</option>
                                  <option value={2}>Option C is correct</option>
                                  <option value={3}>Option D is correct</option>
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500">Explanatory background blueprint context</label>
                                <input
                                  type="text"
                                  value={question.explanation || ''}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setNewQuestions((prev) => {
                                      const copy = [...prev];
                                      copy[qIdx] = { ...copy[qIdx], explanation: val };
                                      return copy;
                                    });
                                  }}
                                  placeholder="Why is this option correct?"
                                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                                />
                              </div>
                            </div>

                          </div>
                        ))}
                      </div>

                      {quizSuccessMessage && (
                        <p className="p-3 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-xl">{quizSuccessMessage}</p>
                      )}

                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs"
                      >
                        Publish Assessment Quiz
                      </button>
                    </form>
                  )}

                  {/* Compose brain blog */}
                  {adminSection === 'add-blog' && (
                    <form onSubmit={handleCreateBlogManual} className="space-y-4">
                      <h3 className="text-base font-bold text-slate-800">Compose Cognitive Strategy Article</h3>
                      
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600">Article Title</label>
                        <input
                          type="text"
                          required
                          value={newBlogTitle}
                          onChange={(e) => setNewBlogTitle(e.target.value)}
                          placeholder="e.g. Cognitive Efficacy of High Temperature Spaced Study repetitions"
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600">Category Tag</label>
                          <input
                            type="text"
                            required
                            value={newBlogCategory}
                            onChange={(e) => setNewBlogCategory(e.target.value)}
                            placeholder="e.g. Neuroscience, Memory Science"
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600">Read Time annotation</label>
                          <input
                            type="text"
                            required
                            value={newBlogReadTime}
                            onChange={(e) => setNewBlogReadTime(e.target.value)}
                            placeholder="e.g. 5 min read"
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600">Summary sentence</label>
                        <input
                          type="text"
                          value={newBlogSummary}
                          onChange={(e) => setNewBlogSummary(e.target.value)}
                          placeholder="Brief 1-sentence abstract summary of the findings..."
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600">Markdown Content Body</label>
                        <textarea
                          required
                          rows={10}
                          value={newBlogContent}
                          onChange={(e) => setNewBlogContent(e.target.value)}
                          placeholder="Compose your rich scientific markdown summary analysis context here..."
                          className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:outline-none"
                        ></textarea>
                      </div>

                      {blogSuccessMessage && (
                        <p className="p-3 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-xl">{blogSuccessMessage}</p>
                      )}

                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg text-xs"
                      >
                        Publish Brain Insights Post
                      </button>
                    </form>
                  )}

                </div>

              </div>
            )}
          </div>
        )}

        {/* ========================================== */}
        {/* VIEW 12: ONLINE CLASSES HUB                */}
        {/* ========================================== */}
        {currentRoute === '#online-classes' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-300 space-y-10 text-left">
            
            <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-indigo-950">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(255,193,7,0.12),transparent_65%)] pointer-events-none"></div>
              <div className="relative z-10 max-w-3xl space-y-4">
                <span className="inline-block bg-[#FFC107] text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                  ★ Live Olympiad Coaching Live
                </span>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                  Master K-12 Olympiads Under the Guidance of <span className="text-[#FFC107]">Top IIT & MIT Mentors</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-355 font-semibold leading-relaxed">
                  Join our highly interactive, self-paced, and live micro-batch programs specially formulated to build fearless logical reasoning and mathematical deduction from Class 2-10.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-xs font-bold text-amber-300">✓ Small batches (under 12 kids)</span>
                  <span className="text-xs font-bold text-amber-300">• ✓ AI-enhanced diagnostic reporting</span>
                  <span className="text-xs font-bold text-amber-300">• ✓ Free Mock-Test pass included</span>
                </div>
              </div>
            </div>

            {/* Class Cards Grid */}
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Active Online Coaching Batches</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "📐 Math Wizardry Elite", subject: "Maths Olympiad (IMO-Level Prep)", age: "Class 2 to 6", timing: "Every Sat & Sun 10:00 AM UTC", features: ["Topological and fractal logic", "Speed mathematical arithmetic rules", "Official IMO previous paper walkthroughs"] },
                  { title: "🔬 Advanced Science Pioneers", subject: "National Science (ISO Prep)", age: "Class 5 to 10", timing: "Every Mon & Wed 4:30 PM UTC", features: ["Cell and organic biological matrices", "Newtonian motion and light dispersion proofs", "Dynamic sandbox laboratory exercises"] },
                  { title: "🧠 IQ & Fluid Logic Builder", subject: "Cognitive Aptitude & Patterns", age: "Class 4 to 8", timing: "Every Thursday 5:00 PM UTC", features: ["Pattern matching under strict timing", "Spatial logical rotation rules", "Lateral thinking puzzles & games"] },
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <span className="bg-emerald-50 text-[#00A86B] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                          {item.age}
                        </span>
                        <span className="text-slate-400 font-mono text-[10px] font-bold">{item.timing}</span>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-black text-slate-900">{item.title}</h3>
                        <p className="text-xs text-indigo-600 font-bold">{item.subject}</p>
                      </div>
                      <ul className="space-y-1.5 pt-2 border-t border-slate-100">
                        {item.features.map((feat, f) => (
                          <li key={f} className="text-xs text-slate-600 font-medium flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00A86B]" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-6">
                      <button
                        onClick={() => setIsLoginOpen(true)}
                        className="w-full bg-[#00A86B] hover:bg-[#008F5A] text-white py-3 rounded-xl text-xs font-black transition-all shadow-md shadow-emerald-50 hover:shadow-lg hover:scale-101 uppercase tracking-wider"
                      >
                        Request Trial Pass
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* VIEW 13: SUBSCRIPTION & PRICING PLANS      */}
        {/* ========================================== */}
        {currentRoute === '#pricing' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-300 space-y-10 text-left">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="bg-[#FFC107]/10 text-amber-800 border border-amber-300 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full inline-block">
                Simple, Honest Choices
              </span>
              <h1 className="text-4.5xl font-black text-slate-950 tracking-tight leading-tight">
                Unlock Unlimited <span className="text-[#00A86B]">Olympiad Certification</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-bold leading-relaxed">
                Take all standard class practice questions 100% free forever. Upgrade to gain beautiful printable certificates, diagnostic insights, and official school rosters.
              </p>
            </div>

            {/* Pricing Packages Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                { name: "Starter Prep", price: "$0", term: "Free Forever", desc: "No credit cards, ideal for quick homework assessment test checks.", cta: "Current Active Mode", highlight: false, features: ["Access to Class 2-10 practice suite", "Submit up to 10 mock assessments/mo", "Real-time answers & solutions list", "Basic leaderboard rankings"] },
                { name: "Academic Champion", price: "$9", term: "per student/month", desc: "For ambitious students targeting Top 100 standing list in SOF/ITO exam rosters.", cta: "Upgrade to Champion", highlight: true, features: ["Unlimited practice test submissions", "Beautiful verifiable gold/silver certificates", "Advanced speed and logical reasoning analytics", "Offline curriculum PDF downloads", "Personal progress tracker dashboards"] },
                { name: "School Board License", price: "$49", term: "per school/month", desc: "Full bulk access permissions for educators and institutional test boards.", cta: "Initiate School Setup", highlight: false, features: ["Account profile seats for up to 200 kids", "Personal school portal & custom roster test-maker", "Full API access for childhood diagnostic tools", "Priority Zoom support with academic counselors"] }
              ].map((plan, idx) => (
                <div 
                  key={idx} 
                  className={`bg-white rounded-3xl border p-8 flex flex-col justify-between transition-all relative ${
                    plan.highlight 
                      ? 'border-[#00A86B] ring-2 ring-[#00A86B]/30 shadow-xl scale-102 hover:scale-103' 
                      : 'border-slate-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  {plan.highlight && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#00A86B] text-white text-[10px] font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-md">
                      Highly Recommended
                    </span>
                  )}
                  <div className="space-y-6">
                    <div className="text-left space-y-1">
                      <h3 className="text-xl font-black text-slate-900">{plan.name}</h3>
                      <p className="text-xs text-slate-400 font-semibold">{plan.desc}</p>
                    </div>

                    <div className="text-left flex items-baseline gap-1 pt-2 border-t border-slate-100">
                      <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                      <span className="text-xs text-slate-400 font-bold">{plan.term}</span>
                    </div>

                    <ul className="space-y-2.5 pt-4">
                      {plan.features.map((feat, f) => (
                        <li key={f} className="text-xs text-slate-650 font-semibold flex items-start gap-2.5">
                          <CheckCircle className="w-4 h-4 text-[#00A86B] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-8">
                    <button
                      type="button"
                      onClick={() => setIsLoginOpen(true)}
                      className={`w-full py-3.5 rounded-xl text-xs font-black transition-all uppercase tracking-wider ${
                        plan.highlight
                          ? 'bg-[#FF5722] hover:bg-[#E64A19] text-white shadow-md shadow-orange-100 font-black'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      {plan.cta}
                    </button>
                    <p className="text-[10px] text-slate-400 font-medium text-center mt-3">
                      Refund support & 100% passing guarantee applies.
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* VIEW 14: EXAM DATES & CALENDAR SHEET       */}
        {/* ========================================== */}
        {currentRoute === '#exam-dates' && (
          <div className="max-w-5xl mx-auto px-4 py-10 animate-in fade-in duration-300 space-y-10 text-left">
            <div className="space-y-2 text-left">
              <span className="text-[#00A86B] bg-emerald-50 text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full border border-emerald-100 inline-block">
                Academic Event Calendar
              </span>
              <h1 className="text-3.5xl font-extrabold text-slate-950 tracking-tight">Olympiad Examination Dates (2026 Season)</h1>
              <p className="text-xs text-slate-500 font-semibold max-w-2xl">
                Stay aligned with official schedules for major school board and supplementary exam programs. Plan Mock studies appropriately.
              </p>
            </div>

            {/* Calendar Table card */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-slate-50 p-4 border-b border-rose-150 flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  Consolidated Olympiad Timetable
                </span>
                <span className="text-[10px] font-bold text-slate-400 bg-white border px-2 py-0.5 rounded-md">Last checked: June 2026</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/50 text-slate-500 font-extrabold border-b border-slate-100">
                      <th className="p-4 uppercase tracking-widest text-[10px]">Olympiad Body</th>
                      <th className="p-4 uppercase tracking-widest text-[10px]">Exam Level</th>
                      <th className="p-4 uppercase tracking-widest text-[10px]">Proposed Registration Deadline</th>
                      <th className="p-4 uppercase tracking-widest text-[10px]">Active Test Date</th>
                      <th className="p-4 uppercase tracking-widest text-[10px] text-right">Reference Link</th>
                    </tr>
                  </thead>
                  <tbody className="font-semibold text-slate-700 divide-y divide-slate-50">
                    <tr className="hover:bg-slate-50/55 transition">
                      <td className="p-4 text-slate-900 font-black">
                        <div>IMO (Math Olympiad)</div>
                        <span className="text-[9px] font-bold text-slate-400 leading-none block">Science Olympiad Foundation (SOF)</span>
                      </td>
                      <td className="p-4"><span className="bg-indigo-55 text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded text-[10px] font-bold">Class 2 to 10</span></td>
                      <td className="p-4 font-mono text-slate-500 text-[11px]">August 31, 2026</td>
                      <td className="p-4 font-mono text-slate-900 text-[11px] font-black">October 22, 2026</td>
                      <td className="p-4 text-right">
                        <a href="https://sofworld.org" target="_blank" rel="noreferrer" className="text-[#00A86B] hover:underline font-extrabold">sofworld.org</a>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/55 transition">
                      <td className="p-4 text-slate-900 font-black">
                        <div>ISO (Science Olympiad)</div>
                        <span className="text-[9px] font-bold text-slate-400 leading-none block">Science Olympiad Foundation (SOF)</span>
                      </td>
                      <td className="p-4"><span className="bg-indigo-55 text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded text-[10px] font-bold">Class 2 to 10</span></td>
                      <td className="p-4 font-mono text-slate-500 text-[11px]">August 31, 2026</td>
                      <td className="p-4 font-mono text-slate-900 text-[11px] font-black">November 12, 2026</td>
                      <td className="p-4 text-right">
                        <a href="https://sofworld.org" target="_blank" rel="noreferrer" className="text-[#00A86B] hover:underline font-extrabold">sofworld.org</a>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/55 transition">
                      <td className="p-4 text-slate-900 font-black">
                        <div>ITO Math Olympiad</div>
                        <span className="text-[9px] font-bold text-slate-400 leading-none block">Indian Talent Olympiad (ITO)</span>
                      </td>
                      <td className="p-4"><span className="bg-indigo-55 text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded text-[10px] font-bold">Class 1 to 10</span></td>
                      <td className="p-4 font-mono text-slate-500 text-[11px]">September 15, 2026</td>
                      <td className="p-4 font-mono text-slate-900 text-[11px] font-black">December 05, 2026</td>
                      <td className="p-4 text-right">
                        <a href="https://indiantalent.org" target="_blank" rel="noreferrer" className="text-[#00A86B] hover:underline font-extrabold">indiantalent.org</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>

            {/* Quick alert reminder box with Golden yellow highlights */}
            <div className="bg-[#FFC107]/10 rounded-2xl p-6 border border-amber-300 text-slate-900">
              <h3 className="text-sm font-black flex items-center gap-1.5 uppercase tracking-wide">
                <Trophy className="w-5 h-5 text-amber-500 fill-amber-300" />
                Prepare Smart with Free Diagnostic Tests
              </h3>
              <p className="text-xs text-slate-750 font-bold mt-2 leading-relaxed">
                Do not wait until final date deadlines! Regular curriculum tracking checks done via the IQ200 Free Practice Zone are certified to build muscle memory required to score above 95th percentiles. Set up a regular 15-minute challenge interval daily.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => navigateTo('#categories')}
                  className="bg-[#00A86B] hover:bg-[#008F5A] text-white px-5 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition shadow-sm"
                >
                  Configure My Practice Routine
                </button>
              </div>
            </div>

          </div>
        )}
{currentRoute === '#privacy' && <PrivacyPolicy />}
{currentRoute === '#terms' && <TermsOfUse />}
{currentRoute === '#contact-us' && <ContactUs />}
{currentRoute === '#about-us' && <AboutUs />}
      </main>

      {/* Dynamic Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Login Modal overlay */}
      {isLoginOpen && (
        <LoginModal 
          onClose={() => setIsLoginOpen(false)} 
          onSuccess={handleLoginSuccess} 
        />
      )}
      <AiGuideChat />
    </div>
  );
}
