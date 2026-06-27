import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, CheckCircle, XCircle, ChevronRight, HelpCircle, 
  Share2, Award, ClipboardCheck, Sparkles, BookOpen, ThumbsUp, MessageSquare
} from 'lucide-react';
import { Question } from '../types';

interface SEOQuestionPageProps {
  question: Question;
  allQuestions: Question[];
  onNavigate: (route: string) => void;
}

export default function SEOQuestionPage({ question, allQuestions, onNavigate }: SEOQuestionPageProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [helpfulClicked, setHelpfulClicked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Reset state when the active question changes
  useEffect(() => {
    setSelectedOption(null);
    setShowAnswer(false);
    setHelpfulClicked(false);
    setCopiedLink(false);
  }, [question]);

  // Find related questions in the same topic for internal SEO linking
  const relatedQuestions = allQuestions
    .filter(q => q.topic === question.topic && q.id !== question.id)
    .slice(0, 4);

  // If not enough related in the same topic, pull from the same subject
  const fallbackRelated = relatedQuestions.length < 4
    ? allQuestions
        .filter(q => q.subjectCategory === question.subjectCategory && q.id !== question.id && !relatedQuestions.some(rq => rq.id === q.id))
        .slice(0, 4 - relatedQuestions.length)
    : [];

  const finalRelated = [...relatedQuestions, ...fallbackRelated];

  const handleShare = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getSubjectSlug = (subName: string) => {
    if (subName?.toLowerCase() === 'mathematics') return 'maths';
    return subName?.toLowerCase() || 'science';
  };

  const getQuestionUrl = (q: Question) => {
    const sub = getSubjectSlug(q.subjectCategory);
    const topicSlug = q.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `#class-10/${sub}/mcq-questions/${topicSlug}/${q.id.toLowerCase()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="seo-question-container">
      {/* ========================================== */}
      {/* BREADCRUMB NAVIGATION                      */}
      {/* ========================================== */}
      <nav aria-label="Breadcrumb" className="mb-8" id="seo-breadcrumbs">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-slate-500">
          <li>
            <button onClick={() => onNavigate('#home')} className="hover:text-indigo-600 transition-colors flex items-center gap-1 cursor-pointer">
              <span>Home</span>
            </button>
          </li>
          <li><ChevronRight className="w-3 h-3 text-slate-400" /></li>
          <li>
            <button onClick={() => onNavigate('#syllabus')} className="hover:text-indigo-600 transition-colors cursor-pointer">
              <span>Syllabus Directory</span>
            </button>
          </li>
          <li><ChevronRight className="w-3 h-3 text-slate-400" /></li>
          <li>
            <button 
              onClick={() => onNavigate(`#class-10-${getSubjectSlug(question.subjectCategory)}-mcq`)} 
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              <span>Class 10 {question.subjectCategory}</span>
            </button>
          </li>
          <li><ChevronRight className="w-3 h-3 text-slate-400" /></li>
          <li className="text-slate-400 truncate max-w-xs">{question.topic}</li>
          <li><ChevronRight className="w-3 h-3 text-slate-400" /></li>
          <li className="text-indigo-600 font-extrabold font-mono uppercase tracking-widest">Question Detailed View</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        {/* ========================================== */}
        {/* MAIN BODY: QUESTION & EXPLANATION PAGE     */}
        {/* ========================================== */}
        <main className="lg:col-span-8 space-y-6" id="seo-main-card">
          <div className="bg-white border border-slate-200/80 shadow-sm rounded-3xl overflow-hidden p-6 md:p-8 space-y-6">
            
            {/* Header / Sub-metadata */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5" id="seo-header-blocks">
              <div className="space-y-1">
                <span className="bg-indigo-50/80 text-indigo-700 border border-indigo-100 text-[10px] sm:text-xs font-extrabold uppercase px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-indigo-500 text-indigo-500 animate-pulse" />
                  SOF Olympiad Prep Masterclass Series
                </span>
                <span className="text-slate-405 block text-[10px] font-bold font-mono tracking-wider mt-2">
                  CLASS LEVEL: <span className="text-slate-700 font-extrabold">10</span> &nbsp;|&nbsp; SUBJECT: <span className="text-slate-700 font-extrabold">{question.subjectCategory.toUpperCase()}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleShare}
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all text-slate-600 hover:text-indigo-600 inline-flex items-center gap-1.5 text-xs font-black cursor-pointer shadow-sm"
                  title="Copy permanent link to clipboard"
                  id="share-btn-seo"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copiedLink ? 'Copied Link!' : 'Share Question'}</span>
                </button>
              </div>
            </div>

            {/* Topic Marker */}
            <div className="flex items-center gap-2 text-slate-500" id="topic-tag-view">
              <ClipboardCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-extrabold uppercase tracking-wide">TOPIC CLASSIFICATION:</span>
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-black rounded-lg border border-emerald-100/50">
                {question.topic}
              </span>
            </div>

            {/* Question Card */}
            <div className="space-y-4" id="question-payload-section">
              <h1 className="text-lg md:text-xl font-bold text-slate-800 leading-relaxed whitespace-pre-wrap">
                {question.questionText}
              </h1>
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-3" id="mcq-choices-grid">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block mb-2">Practice Interactive Selector:</span>
              {question.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === question.correctOptionIndex;
                const showCorrectStyle = showAnswer && isCorrect;
                const showWrongStyle = showAnswer && isSelected && !isCorrect;

                let optClass = "border-slate-200 bg-white hover:bg-slate-50 text-slate-700";
                if (showCorrectStyle) {
                  optClass = "border-emerald-500 bg-emerald-50/85 text-emerald-900 ring-2 ring-emerald-500/25";
                } else if (showWrongStyle) {
                  optClass = "border-rose-500 bg-rose-50/85 text-rose-900 ring-2 ring-rose-500/25";
                } else if (isSelected) {
                  optClass = "border-indigo-500 bg-indigo-50/50 text-indigo-900 ring-2 ring-indigo-505/25";
                }

                return (
                  <button
                    key={idx}
                    disabled={showAnswer}
                    onClick={() => {
                      setSelectedOption(idx);
                      setShowAnswer(true);
                    }}
                    className={`w-full p-4 rounded-2xl border text-left font-bold text-sm transition-all flex items-start gap-3.5 group cursor-pointer ${optClass}`}
                    id={`choice-btn-opt-${idx}`}
                  >
                    <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 border ${
                      showCorrectStyle ? 'bg-emerald-500 border-emerald-500 text-white' : 
                      showWrongStyle ? 'bg-rose-500 border-rose-500 text-white' : 
                      isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 
                      'bg-slate-50 border-slate-200 text-slate-500 group-hover:bg-slate-100'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 self-center">{option}</span>
                    {showCorrectStyle && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 self-center" />}
                    {showWrongStyle && <XCircle className="w-5 h-5 text-rose-600 shrink-0 self-center" />}
                  </button>
                );
              })}
            </div>

            {/* Answer Display */}
            {(showAnswer || showAnswer) && (
              <div 
                className="bg-gradient-to-br from-indigo-50/70 to-slate-50 border border-indigo-100/80 rounded-2xl p-6 md:p-8 space-y-4 animate-in slide-in-from-bottom-2 duration-300 shadow-sm"
                id="explanation-box-seo"
              >
                <div className="flex items-center gap-2 border-b border-indigo-100/40 pb-3">
                  <Award className="w-5 h-5 text-indigo-600 fill-indigo-100" />
                  <h3 className="text-sm font-black uppercase text-indigo-950 tracking-wider">
                    Official Pedagogical Explanation
                  </h3>
                </div>
                
                <p className="text-sm font-extrabold text-indigo-950">
                  CORRECT PATTERN: <span className="bg-white border border-indigo-200 px-3 py-1 rounded-lg text-indigo-600 font-black inline-block ml-1">Option {String.fromCharCode(65 + question.correctOptionIndex)}: {question.options[question.correctOptionIndex]}</span>
                </p>

                <div className="text-sm text-slate-700 leading-relaxed space-y-2 whitespace-pre-wrap bg-white/70 p-4 border border-slate-100 rounded-xl">
                  {question.explanation}
                </div>

                {/* Micro satisfaction poll */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-3.5 h-3.5 text-indigo-500" />
                    Was this NCERT standard explanation helpful?
                  </span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setHelpfulClicked(true)}
                      className={`px-3 py-1.5 rounded-lg border transition-all font-bold cursor-pointer text-xs ${
                        helpfulClicked ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                      id="helpful-btn-yes"
                    >
                      {helpfulClicked ? 'Thanks for feedback!' : '👍 Yes, extremely'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Reset Practice Toggle */}
            {showAnswer && (
              <div className="flex justify-end pt-2" id="reset-practice-strip">
                <button 
                  onClick={() => {
                    setSelectedOption(null);
                    setShowAnswer(false);
                  }}
                  className="text-xs font-black text-slate-500 hover:text-indigo-600 transition-all flex items-center gap-1 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl hover:shadow-sm cursor-pointer"
                  id="reset-practice-btn"
                >
                  Reset Practice Challenge and Re-solve
                </button>
              </div>
            )}

          </div>

          {/* NCERT & Syllabus Context block for SEO value weight */}
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl space-y-4" id="seo-weight-copy">
            <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm uppercase tracking-wide">
              <BookOpen className="w-4 h-4 text-indigo-500" /> Topic Academic Index Guidelines
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              This curriculum item is aligned with the **CBSE / ICSE Class 10 {question.subjectCategory} Syllabus** guidelines. 
              Prepared in general alignment with standard curriculum structures and **Olympiad school frameworks**, these questions emphasize high order thinking skills (HOTS), experimental verification setups, stoichiometric balances, and anatomical mechanisms. It serves as a comprehensive practice and learning study module.
            </p>
          </div>
        </main>

        {/* ========================================== */}
        {/* SIDEBAR: RELATED QUESTIONS & CATEGORY BOX  */}
        {/* ========================================== */}
        <aside className="lg:col-span-4 space-y-6" id="seo-sidebar">
          
          {/* Main Subject Portal Navigation Box */}
          <div className="bg-gradient-to-br from-indigo-950 to-indigo-900 text-white rounded-3xl p-6 space-y-5 shadow" id="sidebar-curriculum-card">
            <span className="bg-indigo-500/35 text-indigo-200 border border-indigo-500/20 text-[9px] uppercase font-black tracking-widest px-3 py-1 rounded-full inline-block">
              Course syllabus Hub
            </span>
            <div className="space-y-2">
              <h3 className="text-lg font-black tracking-tight text-white leading-tight">
                Class 10 {question.subjectCategory} Study Directory
              </h3>
              <p className="text-xs text-indigo-200">
                Access 100+ Chapter-wise practice challenges, mock board examinations, and high-difficulty SOF Olympiad simulation modules.
              </p>
            </div>
            <button 
              onClick={() => onNavigate(`#class-10-${getSubjectSlug(question.subjectCategory)}-mcq`)}
              className="w-full bg-white hover:bg-slate-50 text-indigo-955 px-4 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 text-indigo-950 shadow-sm cursor-pointer"
              id="back-to-course-hub"
            >
              <span>Explore Course Hub</span>
              <ChevronRight className="w-4 h-4 text-indigo-900" />
            </button>
          </div>

          {/* Related Questions / Internal Link Graph */}
          <div className="bg-white border border-slate-200/80 shadow-sm rounded-3xl p-6 space-y-4" id="related-graph shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <MessageSquare className="w-4 h-4 text-slate-500" />
              <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">
                Related SOF Practice Questions
              </h3>
            </div>

            <div className="space-y-3" id="related-links-list">
              {finalRelated.map((relQ, idx) => {
                const url = getQuestionUrl(relQ);
                return (
                  <button
                    key={relQ.id}
                    onClick={() => {
                      onNavigate(url);
                    }}
                    className="w-full text-left p-3.5 rounded-xl bg-slate-50 hover:bg-indigo-50/30 border border-slate-100 hover:border-indigo-150 transition-all group block space-y-1.5 cursor-pointer"
                    id={`rel-q-link-${idx}`}
                  >
                    <span className="text-[10px] font-black text-slate-400 group-hover:text-indigo-600 transition-colors uppercase font-mono block">
                      {relQ.topic}
                    </span>
                    <span className="text-xs font-extrabold text-slate-700 group-hover:text-slate-900 line-clamp-2 leading-relaxed">
                      {relQ.questionText}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}

// Simple internal helper component
function Star({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
    </svg>
  );
}
