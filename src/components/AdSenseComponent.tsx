import React from 'react';
import { Sparkles, Trophy, Lightbulb, BookOpen, Clock, Heart, MessageSquare } from 'lucide-react';

interface AdSenseComponentProps {
  placement: 'top_billboard' | 'inline_feed' | 'sidebar' | 'interstitial' | 'footer';
  className?: string;
  // Optional custom category override for educational content matching
  subjectContext?: string;
}

// Global flag simulation (can be configured in window context)
declare global {
  interface Window {
    enableRealAdSense?: boolean;
    adsbygoogle?: any[];
  }
}

export default function AdSenseComponent({ placement, className = '', subjectContext }: AdSenseComponentProps) {
  // Check if AdSense is active and configured in production
  const isAdSenseEnabled = typeof window !== 'undefined' && window.enableRealAdSense === true;

  // Render original Google AdSense Slot if configured
  if (isAdSenseEnabled) {
    return (
      <div className={`adsense-container my-4 text-center ${className}`} id={`adsense-${placement}`}>
        <span className="text-[9px] font-bold text-slate-400 tracking-wider block uppercase mb-1">Advertisement</span>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Mock placeholder for real publisher ID
          data-ad-slot={
            placement === 'top_billboard'
              ? '1111111111'
              : placement === 'sidebar'
              ? '2222222222'
              : placement === 'interstitial'
              ? '3333333333'
              : '4444444444'
          }
          data-ad-format={placement === 'sidebar' ? 'vertical' : 'auto'}
          data-full-width-responsive="true"
        />
        <script>
          {`(window.adsbygoogle = window.adsbygoogle || []).push({});`}
        </script>
      </div>
    );
  }

  // Fallback: Elegant Premium Educational & Parent Trust Content Cards
  // This satisfies AdSense Policy (no empty/broken placeholder ads) and builds educational credibility
  const fallbackTips = [
    {
      icon: <Lightbulb className="w-5 h-5 text-amber-500" />,
      title: "Mental Math: The 'Lacing' Trick",
      body: "Multiply any two-digit number by 11 inside your head. Just sum the digits and insert the result in between! (e.g. 25 × 11: 2 + 5 = 7, giving 275). It doubles math speed on competitive tests.",
      badge: "Math Olympiad Hack",
      cta: "Try Grade 5 Fractions",
      route: "class-5-maths-sample-paper"
    },
    {
      icon: <Clock className="w-5 h-5 text-indigo-500" />,
      title: "The 25-Minute Brain Cycle (Pomodoro)",
      body: "Encourage your child to study in 25-minute high-focus cycles, followed by a 5-minute digital-free hydration break. Research proves this pattern prevents mental fatigue and maintains cognitive endurance.",
      badge: "Parent Study Tip",
      cta: "Explore Study Skills Guide",
      route: "#blog/decoding-cbse-board-evaluation-grid"
    },
    {
      icon: <BookOpen className="w-4 h-4 text-emerald-500 animate-pulse" />,
      title: "Higher Order Thinking Skills (HOTS)",
      body: "In alignment with the Science Olympiad guidelines, we focus on problem-solving reasoning structures over literal definitions. Try starting our practice tests to experience the premium difference.",
      badge: "Curriculum Alignment Note",
      cta: "Interactive Syllabus Index",
      route: "#syllabus"
    },
    {
      icon: <Trophy className="w-5 h-5 text-amber-600" />,
      title: "Dynamic Student Certificates",
      body: "Students who achieve a score of 60% or superior in any topic-specific challenge automatically qualify for Gold, Silver, or Bronze Achievement Certificates perfectly optimized for home desktop printing.",
      badge: "Positive Reinforcement",
      cta: "View Certificate Vault",
      route: "#certificates"
    },
    {
      icon: <Heart className="w-5 h-5 text-rose-500" />,
      title: "A Parent's Role in Early Logic-Building",
      body: "We recommend reviewing the detailed results panel together after every self-evaluation challenge. Celebrate the logical effort in reasoning mistakes to foster a genuine growth mindset.",
      badge: "Parent Partnership",
      cta: "Read Parent Success Guide",
      route: "#blog/science-of-iq-cognitive-training-score"
    },
    {
      icon: <Sparkles className="w-5 h-5 text-purple-500" />,
      title: "Custom AI Practice Generator Enabled",
      body: "Our built-in Gemini AI generator lets parents type custom topics (such as 'Animal Adaptation' or 'Medieval Indian Dynasties') to instantly assemble curated 5-10 question mock challenges.",
      badge: "AI Learning Tool",
      cta: "Create Custom AI Test",
      route: "#medal-challenge-hero"
    }
  ];

  // Select a tip uniquely using placement
  let activeTip = fallbackTips[2]; // Default HOTS explanation
  if (placement === 'top_billboard') {
    activeTip = fallbackTips[0]; // Mental Math
  } else if (placement === 'inline_feed') {
    activeTip = fallbackTips[1]; // Pomodoro Cycle
  } else if (placement === 'sidebar') {
    activeTip = fallbackTips[3]; // Certificates
  } else if (placement === 'footer') {
    activeTip = fallbackTips[4]; // Parent Mindset
  } else if (placement === 'interstitial') {
    activeTip = fallbackTips[5]; // AI Generator
  }

  // Render various beautiful styles matching placement
  if (placement === 'top_billboard') {
    return (
      <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-4 ${className}`} id={`ads-fallback-${placement}`}>
        <div className="bg-gradient-to-r from-amber-50 to-orange-50/70 border border-amber-200/80 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/10 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-3.5 text-left text-xs">
            <div className="bg-amber-100 p-2.5 rounded-xl border border-amber-200 shrink-0 select-none">
              {activeTip.icon}
            </div>
            <div className="space-y-1">
              <span className="bg-amber-200/60 text-amber-900 text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider leading-none">
                {activeTip.badge}
              </span>
              <h4 className="font-extrabold text-slate-900 leading-none">{activeTip.title}</h4>
              <p className="text-[11px] text-slate-600 font-medium leading-relaxed max-w-2xl">
                {activeTip.body}
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <span className="text-[8px] text-amber-600/70 font-bold uppercase block tracking-widest text-right mb-1">IQ200 Educational Sponsor</span>
            <div className="bg-amber-600 text-white font-black text-[10px] uppercase py-2 px-3.5 rounded-xl transition-all shadow-xs leading-none">
              Daily Hack
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (placement === 'sidebar') {
    return (
      <div className={`bg-gradient-to-b from-indigo-50/50 to-white rounded-3xl p-5 border border-indigo-200/70 shadow-xs space-y-4 text-left relative overflow-hidden ${className}`} id={`ads-fallback-${placement}`}>
        <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-200/20 rounded-full blur-xl"></div>
        <div className="flex items-center gap-2">
          <div className="bg-indigo-100 p-2 rounded-xl text-indigo-700">
            {activeTip.icon}
          </div>
          <div>
            <span className="text-[9px] bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-md font-black uppercase tracking-wider block">
              {activeTip.badge}
            </span>
            <h4 className="font-black text-slate-950 text-sm mt-1">{activeTip.title}</h4>
          </div>
        </div>
        <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
          {activeTip.body}
        </p>
        <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
          <span className="text-[8px] text-indigo-400 font-bold uppercase tracking-wider">Free Platform Tip</span>
          <span className="text-[10px] text-indigo-600 font-extrabold hover:underline">
            Active Study
          </span>
        </div>
      </div>
    );
  }

  if (placement === 'interstitial') {
    return (
      <div className={`p-8 bg-slate-950 text-white rounded-3xl border border-indigo-500/20 text-center relative overflow-hidden max-w-2xl mx-auto space-y-6 ${className}`} id={`ads-fallback-${placement}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1),transparent_75%)] pointer-events-none"></div>
        
        <div className="flex justify-center">
          <div className="bg-indigo-500/10 p-3.5 rounded-full border border-indigo-500/20 text-indigo-400">
            {activeTip.icon}
          </div>
        </div>

        <div className="space-y-2">
          <span className="bg-indigo-500/20 text-indigo-300 text-[9px] font-black px-2.5 py-1 rounded-full border border-indigo-500/20 uppercase tracking-widest leading-none">
            {activeTip.badge}
          </span>
          <h3 className="text-xl font-extrabold tracking-tight text-white mt-1">
            {activeTip.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-md mx-auto">
            {activeTip.body}
          </p>
        </div>

        <div className="pt-2">
          <a
            href={activeTip.route}
            className="inline-flex bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black px-5 py-3 rounded-xl uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
          >
            {activeTip.cta}
          </a>
        </div>
      </div>
    );
  }

  // default footer/inline banners
  return (
    <div className={`w-full max-w-7xl mx-auto bg-slate-50 rounded-2.5xl p-5 border border-slate-200 flex flex-col md:flex-row items-center gap-4 text-left ${className}`} id={`ads-fallback-${placement}`}>
      <div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-600 shrink-0">
        {activeTip.icon}
      </div>
      <div className="space-y-1 w-full">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-wide leading-none">
            {activeTip.badge}
          </span>
          <span className="text-[10px] font-mono text-slate-400 font-bold select-none">• IQ200 Study Tips</span>
        </div>
        <h4 className="font-extrabold text-slate-900 text-sm leading-none">{activeTip.title}</h4>
        <p className="text-xs text-slate-500 font-medium leading-normal">
          {activeTip.body}
        </p>
      </div>
      <div className="shrink-0 w-full md:w-auto text-right">
        <a 
          href={activeTip.route}
          className="w-full md:w-auto inline-block text-center bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] uppercase py-2.5 px-4 rounded-xl transition-all leading-none tracking-wider"
        >
          {activeTip.cta}
        </a>
      </div>
    </div>
  );
}
