import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Layers, Award, GraduationCap, ChevronRight, HelpCircle, 
  Search, ShieldCheck, CheckCircle2, Star, Target, Sparkles, AlertCircle
} from 'lucide-react';

interface SyllabusDirectoryViewProps {
  onNavigate: (route: string) => void;
  initialClass?: string;
}

export default function SyllabusDirectoryView({ onNavigate, initialClass = 'all' }: SyllabusDirectoryViewProps) {
  const [selectedClass, setSelectedClass] = useState<string>(initialClass);

  useEffect(() => {
    setSelectedClass(initialClass);
  }, [initialClass]);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedResourceType, setSelectedResourceType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const classes = Array.from({ length: 9 }, (_, i) => `Class ${i + 2}`); // Class 2 to 10
  const subjects = ['Mathematics', 'Science', 'English', 'Hindi'];
  const resourceTypes = [
    { slug: 'mcq', label: 'MCQ Questions', desc: 'Syllabus-aligned single choice questions with instant explanations.', color: 'border-blue-100 bg-blue-50/40 text-blue-700' },
    { slug: 'practice-tests', label: 'Practice Tests', desc: 'Chapter-wise diagnostic tests representing real mock challenges.', color: 'border-emerald-100 bg-emerald-50/40 text-emerald-700' },
    { slug: 'mock-tests', label: 'Mock Tests', desc: 'Full-length time-bound examination practice matching CBSE & ICSE styles.', color: 'border-amber-100 bg-amber-50/40 text-amber-700' },
    { slug: 'olympiad-practice', label: 'Olympiad Practice', desc: 'High-difficulty conceptual queries in-line with IMO, NSO & IEO papers.', color: 'border-indigo-100 bg-indigo-50/40 text-indigo-700' },
    { slug: 'sample-papers', label: 'Sample Papers', desc: 'Printable formats detailing questions weighted and structured for exams.', color: 'border-rose-100 bg-rose-50/40 text-rose-700' },
    { slug: 'important-questions', label: 'Important Questions', desc: 'Critical high-yield academic concepts curated by expert educators.', color: 'border-purple-100 bg-purple-50/40 text-purple-700' },
    { slug: 'topic-wise-questions', label: 'Topic Wise Questions', desc: 'Granular sub-topic checklists for focused revision sessions.', color: 'border-teal-100 bg-teal-50/40 text-teal-700' }
  ];

  // Helper to standardise slugs
  const getSubjectSlug = (subName: string) => {
    if (subName === 'Mathematics') return 'maths';
    return subName.toLowerCase();
  };

  // Build the complete matrix of combinations
  const linksList: { 
    classLevel: string; 
    subject: string; 
    resourceType: { slug: string; label: string }; 
    route: string;
    title: string;
  }[] = [];

  classes.forEach(cls => {
    const classNum = cls.toLowerCase().replace(' ', '-'); // "class-2"
    subjects.forEach(subj => {
      const subSlug = getSubjectSlug(subj); // "maths"
      resourceTypes.forEach(res => {
        const linkSlug = `${classNum}-${subSlug}-${res.slug}`; // "class-2-maths-mcq"
        linksList.push({
          classLevel: cls,
          subject: subj,
          resourceType: res,
          route: `#${linkSlug}`,
          title: `${cls} ${subj} ${res.label}`
        });
      });
    });
  });

  // Filter the list
  const filteredLinks = linksList.filter(item => {
    const matchesClass = selectedClass === 'all' || item.classLevel === selectedClass;
    const matchesSubject = selectedSubject === 'all' || item.subject === selectedSubject;
    const matchesType = selectedResourceType === 'all' || item.resourceType.slug === selectedResourceType;
    const matchesSearch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSubject && matchesType && matchesSearch;
  });

  const handleLinkClick = (e: React.MouseEvent, route: string) => {
    e.preventDefault();
    onNavigate(route);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in duration-300">
      
      {/* 1. ARCHITECTURAL HEADER */}
      <div className="text-center space-y-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
          <GraduationCap className="w-4 h-4" />
          K-12 Syllabus Directory & Traffic Core
        </div>
        <h1 className="text-3xl sm:text-4.5xl font-black tracking-tight text-slate-900 leading-tight">
          CBSE & ICSE <span className="text-indigo-600">Curriculum Study Hub</span>
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Access thousands of syllabus-aligned practice tests, standard curriculum MCQ banks, and mock papers. For a <strong>direct official syllabus document</strong> fetched in real-time, visit our <button onClick={() => onNavigate('#syllabus')} className="text-indigo-600 font-bold hover:underline">Official Syllabus Guide &rarr;</button>
        </p>
      </div>

      {/* 2. SILO LINK MATRIX SELECTORS */}
      <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-6 border-b border-slate-100">
          <div className="space-y-1 text-left w-full md:w-auto">
            <h3 className="text-lg font-black text-slate-950 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500" />
              Dynamic Syllabus Grid Matrix
            </h3>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Filtered: {filteredLinks.length} paths matching criteria
            </p>
          </div>

          {/* Quick search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by class, subject, test type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-700"
            />
          </div>
        </div>

        {/* Triple Select Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Class Filter */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-slate-700">Select Grade Level</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 cursor-pointer"
            >
              <option value="all">All Grades (Class 2 - 10)</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          {/* Subject Filter */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-slate-700">Select Subject Category</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 cursor-pointer"
            >
              <option value="all">All Academic Subjects</option>
              {subjects.map(subj => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>
          </div>

          {/* Test Type Filter */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-slate-700">Select Resource Category</label>
            <select
              value={selectedResourceType}
              onChange={(e) => setSelectedResourceType(e.target.value)}
              className="w-full text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 cursor-pointer"
            >
              <option value="all">All Materials (MCQs, Sample Papers, etc.)</option>
              {resourceTypes.map(res => (
                <option key={res.slug} value={res.slug}>{res.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Directory Links Output */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4">
          {filteredLinks.length === 0 ? (
            <div className="col-span-full py-12 text-center bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500 font-bold">No curricula syllabus landing paths found matching the active filters.</p>
              <button 
                onClick={() => { setSelectedClass('all'); setSelectedSubject('all'); setSelectedResourceType('all'); setSearchQuery(''); }}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline"
              >
                Reset Filter Values
              </button>
            </div>
          ) : (
            filteredLinks.slice(0, 75).map((item, index) => {
              const bgBadge = item.resourceType.slug === 'mcq' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                              item.resourceType.slug === 'mock-tests' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                              item.resourceType.slug === 'olympiad-practice' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                              'bg-slate-50 text-slate-700 border-slate-200';
              return (
                <a
                  key={item.route}
                  href={item.route}
                  onClick={(e) => handleLinkClick(e, item.route)}
                  className="group bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-50/40 p-3.5 rounded-2xl flex items-center justify-between gap-3 text-left transition-all"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 group-hover:text-indigo-500 transition-colors">
                      {item.classLevel} &bull; {item.subject}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 leading-tight group-hover:text-slate-950">
                      {item.title}
                    </h4>
                    <span className={`inline-block py-0.5 px-1.5 text-[9px] font-black uppercase rounded border ${bgBadge}`}>
                      {item.resourceType.label}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0" />
                </a>
              );
            })
          )}

          {filteredLinks.length > 75 && (
            <div className="col-span-full text-center py-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-xs text-slate-500 font-medium">
                Showing top 75 of {filteredLinks.length} dynamic SEO matching templates. Use filters to narrow down.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 3. SYLLABUS ARCHITECTURE DESCRIPTIVES */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4 text-left">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            CBSE Curriculum Alignment (Grades 2 to 10)
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            All dynamically rendered question templates comply strictly with current Central Board of Secondary Education frameworks. Each contains organized structural units matching basic learning objectives, multiple choice templates, logical derivations, and extensive post-assessment review logs.
          </p>
          <ul className="space-y-2">
            {[
              'Comprehensive NCERT syllabus mappings.',
              'Vetted by senior child educational advisors.',
              'Structured cognitive reasoning checkpoints.',
              'Real-time score analysis & metal levels awarded.'
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4 text-left">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            Verification & Merit Certification
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every practice and mock paper taken generates a verifiable academic merit record kept in the IQ200 database repository. Students achieving high benchmark percentages secure Bronze, Silver, or Gold medals corresponding directly with standard national evaluation criteria.
          </p>
          <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
            <div className="space-y-0.5">
              <span className="text-xs font-black text-slate-900 block">Printable Credentials PDF</span>
              <p className="text-[10px] text-slate-400 font-medium leading-normal">
                Credentials include unique ID validation strings and QR verification stamps secure for physical school submissions or student portfolios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOOTER CROSS LINKING SYSTEM */}
      <section className="bg-indigo-950 text-indigo-100 rounded-3xl p-6 sm:p-8 space-y-4 text-left relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.1),transparent)] pointer-events-none"></div>
        <div className="space-y-1">
          <h4 className="text-sm font-black text-indigo-300 uppercase tracking-widest">Internal Linking System</h4>
          <h3 className="text-xl font-bold text-white">Olympiad Prep Core Clusters</h3>
        </div>
        <p className="text-xs text-indigo-200 leading-relaxed max-w-3xl">
          Quickly switch between related study material streams to boost mental capacity and prepare for state and central school assessments. Explore specialized subjects by navigating directly to academic branches:
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          {subjects.map(subj => {
            const subSlug = getSubjectSlug(subj);
            return (
              <a
                key={subj}
                href={`#class-5-${subSlug}-olympiad-practice`}
                onClick={(e) => handleLinkClick(e, `#class-5-${subSlug}-olympiad-practice`)}
                className="bg-indigo-900/40 hover:bg-indigo-900/70 border border-indigo-800 text-indigo-200 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
              >
                Class 5 {subj} Olympiad Portal
              </a>
            );
          })}
          <a
            href="#categories"
            onClick={(e) => handleLinkClick(e, '#categories')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow"
          >
            Browse Unified Diagnostic Catalog &rarr;
          </a>
        </div>
      </section>

    </div>
  );
}
