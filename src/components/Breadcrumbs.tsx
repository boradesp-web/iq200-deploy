import React from 'react';
import { Home, ChevronRight, BookOpen, Layers, Award, Shield, FileText } from 'lucide-react';
import { Quiz, BlogPost, Certificate } from '../types';

interface BreadcrumbsProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  blogs: BlogPost[];
  quizzes: Quiz[];
  certificates: Certificate[];
  selectedBlogSlug: string | null;
  selectedCertificate: Certificate | null;
  activeQuiz: Quiz | null;
}

export default function Breadcrumbs({
  currentRoute,
  onNavigate,
  blogs,
  quizzes,
  certificates,
  selectedBlogSlug,
  selectedCertificate,
  activeQuiz
}: BreadcrumbsProps) {
  // Don't show breadcrumbs on the home page itself to keep page hero clean
  if (currentRoute === '#home' || !currentRoute) {
    return null;
  }

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, route: string) => {
    e.preventDefault();
    onNavigate(route);
  };

  const renderPath = () => {
    const items = [
      <li key="home" className="inline-flex items-center">
        <a
          href="#home"
          onClick={(e) => handleLinkClick(e, '#home')}
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <Home className="w-3.5 h-3.5 mr-1" />
          Home
        </a>
      </li>
    ];

    const addSeparator = (key: string) => {
      items.push(
        <li key={`sep-${key}`} className="inline-flex items-center text-slate-300">
          <ChevronRight className="w-3 h-3 mx-1" />
        </li>
      );
    };

    if (currentRoute === '#categories') {
      addSeparator('categories');
      items.push(
        <li key="categories" className="inline-flex items-center">
          <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            Assessments
          </span>
        </li>
      );
    } else if (currentRoute === '#blog') {
      addSeparator('blog');
      items.push(
        <li key="blog" className="inline-flex items-center">
          <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            Brain Insights Blog
          </span>
        </li>
      );
    } else if (currentRoute.startsWith('#blog/')) {
      const article = blogs.find(b => b.slug === selectedBlogSlug);
      addSeparator('blog-root');
      items.push(
        <li key="blog-root" className="inline-flex items-center">
          <a
            href="#blog"
            onClick={(e) => handleLinkClick(e, '#blog')}
            className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            Blog
          </a>
        </li>
      );
      addSeparator('blog-title');
      items.push(
        <li key="blog-title" className="inline-flex items-center max-w-[150px] sm:max-w-[240px] truncate">
          <span className="text-xs font-semibold text-slate-800 truncate" title={article?.title || 'Article Content'}>
            {article?.title || 'Article Reading'}
          </span>
        </li>
      );
    } else if (currentRoute === '#about') {
      addSeparator('about');
      items.push(
        <li key="about" className="inline-flex items-center">
          <span className="text-xs font-semibold text-slate-800">
            About Us
          </span>
        </li>
      );
    } else if (currentRoute === '#contact') {
      addSeparator('contact');
      items.push(
        <li key="contact" className="inline-flex items-center">
          <span className="text-xs font-semibold text-slate-800">
            Contact
          </span>
        </li>
      );
    } else if (currentRoute === '#leaderboard') {
      addSeparator('leaderboard');
      items.push(
        <li key="leaderboard" className="inline-flex items-center">
          <span className="text-xs font-semibold text-slate-800">
            Global Leaderboard
          </span>
        </li>
      );
    } else if (currentRoute.startsWith('#certificate/')) {
      const certId = currentRoute.split('/').pop() || '';
      const cert = certificates.find(c => c.id === certId) || selectedCertificate;
      addSeparator('cert-root');
      items.push(
        <li key="cert-root" className="inline-flex items-center">
          <a
            href="#certificates"
            onClick={(e) => handleLinkClick(e, '#certificates')}
            className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            Certificates
          </a>
        </li>
      );
      addSeparator('cert-val');
      items.push(
        <li key="cert-val" className="inline-flex items-center">
          <span className="text-xs font-semibold text-slate-800 flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            Verified Record {cert?.uniqueId || certId}
          </span>
        </li>
      );
    } else if (currentRoute === '#certificates') {
      addSeparator('certificates');
      items.push(
        <li key="certificates" className="inline-flex items-center">
          <span className="text-xs font-semibold text-slate-800">
            Credential Vault
          </span>
        </li>
      );
    } else if (currentRoute.startsWith('#quiz/')) {
      addSeparator('quiz-root');
      items.push(
        <li key="quiz-root" className="inline-flex items-center">
          <a
            href="#categories"
            onClick={(e) => handleLinkClick(e, '#categories')}
            className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            Catalog
          </a>
        </li>
      );
      addSeparator('quiz-active');
      items.push(
        <li key="quiz-active" className="inline-flex items-center max-w-[150px] sm:max-w-[200px] truncate">
          <span className="text-xs font-semibold text-slate-800 truncate" title={activeQuiz?.title || 'Standard Session'}>
            Active: {activeQuiz?.title || 'Standard Session'}
          </span>
        </li>
      );
    } else if (currentRoute === '#admin') {
      addSeparator('admin');
      items.push(
        <li key="admin" className="inline-flex items-center">
          <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-indigo-500" />
            Admin Operations Center
          </span>
        </li>
      );
    } else if (currentRoute === '#syllabus' || currentRoute === '#syllabus-matrix') {
      addSeparator('syllabus');
      items.push(
        <li key="syllabus" className="inline-flex items-center">
          <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            {currentRoute === '#syllabus' ? 'Official Syllabus Guide' : 'K-12 Syllabus Matrix'}
          </span>
        </li>
      );
    } else if (currentRoute.startsWith('#class-') && !currentRoute.includes('/')) {
      const parts = currentRoute.slice(1).split('-');
      let classLevelNum = '5';
      let subjectLabel = 'Maths';
      let resourceLabel = 'Practice';

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
        resourceLabel = 'MCQs';
      } else if (parts.includes('practice')) {
        resourceLabel = 'Practice Tests';
      } else if (parts.includes('mock')) {
        resourceLabel = 'Mock Tests';
      } else if (parts.includes('olympiad')) {
        resourceLabel = 'Olympiad Practice';
      } else if (parts.includes('sample')) {
        resourceLabel = 'Sample Papers';
      } else if (parts.includes('important')) {
        resourceLabel = 'Important Questions';
      } else if (parts.includes('topic')) {
        resourceLabel = 'Topic Wise Questions';
      }

      addSeparator('syllabus-back');
      items.push(
        <li key="syllabus-back" className="inline-flex items-center">
          <a
            href="#syllabus"
            onClick={(e) => handleLinkClick(e, '#syllabus')}
            className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            Syllabus Hub
          </a>
        </li>
      );

      addSeparator('syllabus-active');
      items.push(
        <li key="syllabus-active" className="inline-flex items-center">
          <span className="text-xs font-semibold text-slate-800">
            Class {classLevelNum} {subjectLabel} {resourceLabel}
          </span>
        </li>
      );
    } else {
      // General fallthrough
      const segment = currentRoute.replace('#', '');
      addSeparator(segment);
      items.push(
        <li key={segment} className="inline-flex items-center capitalize">
          <span className="text-xs font-semibold text-slate-800">
            {segment}
          </span>
        </li>
      );
    }

    return items;
  };

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 animate-in fade-in duration-300"
    >
      <ol className="flex flex-wrap items-center bg-white border border-slate-100 px-4 py-2.5 rounded-xl shadow-sm gap-y-1">
        {renderPath()}
      </ol>
    </nav>
  );
}
