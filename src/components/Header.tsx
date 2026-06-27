import React, { useState } from 'react';
import { 
  Brain, Search, Menu, X, Settings, Sparkles, LogIn, LogOut, User, 
  ChevronDown, Trophy, BookOpen, Clock, Zap, DollarSign, Calendar
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  user: UserProfile | null;
  onTriggerLogin: () => void;
  onSignOut: () => void;
}

export default function Header({ 
  currentRoute, 
  onNavigate, 
  searchQuery, 
  onSearchChange,
  user,
  onTriggerLogin,
  onSignOut
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOlympiadsDropdownOpen, setIsOlympiadsDropdownOpen] = useState(false);
  const [isResultsDropdownOpen, setIsResultsDropdownOpen] = useState(false);

  const handleNavClick = (route: string) => {
    onNavigate(route);
    setIsMobileMenuOpen(false);
    setIsOlympiadsDropdownOpen(false);
    setIsResultsDropdownOpen(false);
  };

  return (
    <header id="app-header" className="sticky top-0 z-50 bg-white shadow-md border-b border-slate-100">
      
      {/* 1. PRIMARY ACCENT: HIGH-ENERGY GOLDEN YELLOW (#FFC107) BANNER */}
      <div className="bg-[#FFC107] text-slate-900 text-xs py-2 px-4 shadow-sm relative overflow-hidden font-black uppercase tracking-wider">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-300 via-yellow-250 to-amber-500 opacity-20 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto flex items-center justify-between gap-4 text-center">
          <div className="flex items-center gap-2 mx-auto justify-center">
            <Sparkles className="w-4 h-4 text-slate-950 animate-bounce" />
            <span>🔥 2026 IQ200 Olympiad Prep Hub: Register Today for Exclusive Mock Tests & Live Performance Insights!</span>
            <span className="hidden md:inline-block bg-slate-950 text-white text-[9px] font-black px-2 py-0.5 rounded-full ring-1 ring-white/20">
              CLASS 2-10 PREPARATION
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          
          {/* Logo Brand */}
          <a 
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#home');
            }}
            className="flex items-center gap-2.5 cursor-pointer select-none group focus:outline-none"
          >
            <div className="bg-indigo-600 text-white p-2.5 rounded-xl transition-all duration-305 group-hover:bg-[#00A86B] group-hover:scale-105 shadow-md shadow-indigo-100">
              <Brain className="w-6 h-6" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                IQ<span className="text-[#00A86B] font-black">200</span>
              </span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                National Prep Academy
              </span>
            </div>
          </a>

          {/* 2. SPECIFICATION-COMPLIANT HEADER NAVIGATION */}
          <nav className="hidden xl:flex items-center gap-1">
            
            {/* Online Classes Link */}
            <a
              href="#online-classes"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#online-classes');
              }}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all ${
                currentRoute === '#online-classes'
                  ? 'text-indigo-600 bg-indigo-50 font-black'
                  : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              Online Classes
            </a>

            {/* Olympiads Dropout ▼ */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsOlympiadsDropdownOpen(!isOlympiadsDropdownOpen);
                  setIsResultsDropdownOpen(false);
                }}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all flex items-center gap-1.5 focus:outline-none ${
                  isOlympiadsDropdownOpen || currentRoute === '#categories' || currentRoute === '#syllabus'
                    ? 'text-indigo-600 bg-indigo-50 font-black'
                    : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                <span>Olympiads</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isOlympiadsDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="px-3 py-1 text-[10px] uppercase font-black text-slate-400 tracking-widest border-b border-slate-50 mb-1">
                    Select Exam
                  </div>
                  {[
                    { label: '🏆 IMO (Maths Olympiad)', route: '#categories', desc: 'Class-wise practice tests & sample sets' },
                    { label: '🔬 ISO (Science Olympiad)', route: '#syllabus', desc: 'Curriculum-aligned science syllabus' },
                    { label: '📖 IEO (English Olympiad)', route: '#syllabus-matrix', desc: 'Grammar and conceptual prep files' },
                    { label: '🖥️ ICO (Cyber Foundation)', route: '#categories', desc: 'Logical and digital skill checks' },
                  ].map((sub, i) => (
                    <a
                      key={i}
                      href={sub.route}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(sub.route);
                      }}
                      className="block px-4 py-2.5 hover:bg-slate-50 text-left transition-colors"
                    >
                      <span className="block text-xs font-bold text-slate-800">{sub.label}</span>
                      <span className="block text-[10px] text-slate-400 font-medium leading-none mt-1">{sub.desc}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Pricing Section */}
            <a
              href="#pricing"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#pricing');
              }}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all ${
                currentRoute === '#pricing'
                  ? 'text-indigo-600 bg-indigo-50 font-black'
                  : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              Pricing
            </a>

            {/* Exam Dates Section */}
            <a
              href="#exam-dates"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#exam-dates');
              }}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all ${
                currentRoute === '#exam-dates'
                  ? 'text-indigo-600 bg-indigo-50 font-black'
                  : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              Exam Dates
            </a>

            {/* Free Practice Zone */}
            <a
              href="#categories"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#categories');
              }}
              className="px-3.5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wide transition-all bg-[#FFC107]/10 text-amber-800 border border-amber-300 hover:bg-[#FFC107]/20 flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Free Practice Zone</span>
            </a>

            {/* Results Dropout ▼ */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsResultsDropdownOpen(!isResultsDropdownOpen);
                  setIsOlympiadsDropdownOpen(false);
                }}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all flex items-center gap-1.5 focus:outline-none ${
                  isResultsDropdownOpen || currentRoute === '#leaderboard' || currentRoute === '#certificates'
                    ? 'text-indigo-600 bg-indigo-50 font-black'
                    : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                <span>Results</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isResultsDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="px-3 py-1 text-[10px] uppercase font-black text-slate-400 tracking-widest border-b border-slate-50 mb-1">
                    Student Standings
                  </div>
                  {[
                    { label: '🏆 National Leaderboard', route: '#leaderboard', desc: 'Celebrate the top 100 rankers' },
                    { label: '🎓 Verifiable Certificates', route: '#certificates', desc: 'Verify and download passing grades' },
                  ].map((sub, i) => (
                    <a
                      key={i}
                      href={sub.route}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(sub.route);
                      }}
                      className="block px-4 py-2.5 hover:bg-slate-50 text-left transition-colors"
                    >
                      <span className="block text-xs font-bold text-slate-800">{sub.label}</span>
                      <span className="block text-[10px] text-slate-400 font-medium leading-none mt-1">{sub.desc}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
            
          </nav>

          {/* Action elements on desktop */}
          <div className="hidden sm:flex items-center gap-3 flex-1 xl:max-w-md ml-auto justify-end">
            
            {/* Search Input bar */}
            <div className="relative w-full max-w-[140px] lg:max-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-800"
              />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Link to Admin center */}
            <a
              href="#admin"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#admin');
              }}
              className={`flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-black transition-all ${
                currentRoute === '#admin'
                  ? 'bg-slate-950 text-white'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Admin</span>
            </a>

            {/* 3. PREMIUM SIGN IN / SIGN UP BUTTON ARRAY AT TOP RIGHT (HIGH-CONTRAST ORANGE/TEAL) */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="flex flex-col text-right hidden lg:flex">
                  <span className="text-xs font-extrabold text-slate-900 truncate max-w-[100px]" title={user.name}>
                    {user.name}
                  </span>
                  <span className="text-[10px] font-bold text-[#00A86B] font-mono leading-none">
                    🌟 Lvl {user.level || 1} ({user.xp || 100} XP)
                  </span>
                </div>
                <button
                  onClick={onSignOut}
                  className="bg-red-50 hover:bg-red-100 text-red-600 p-2.5 rounded-xl text-xs font-bold transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Sign In is Styled in Premium Deep Teal */}
                <button
                  type="button"
                  onClick={onTriggerLogin}
                  className="text-[#00A86B] bg-emerald-50 hover:bg-emerald-100 border border-emerald-250 font-black px-3.5 py-2 rounded-xl text-xs transition-all flex items-center gap-1"
                >
                  <User className="w-3.5 h-3.5 text-[#00A86B]" />
                  <span>Sign In</span>
                </button>
                {/* Sign Up is Styled in High-Contrast Orange */}
                <button
                  type="button"
                  onClick={onTriggerLogin}
                  className="bg-[#FF5722] hover:bg-[#E64A19] text-white font-extrabold px-3.5 py-2 rounded-xl text-xs shadow-md shadow-orange-100 hover:shadow-lg hover:scale-102 transition-all"
                >
                  Sign Up Free
                </button>
              </div>
            )}

          </div>

          {/* Mobile Drawer Trigger */}
          <div className="flex items-center gap-2 xl:hidden ml-auto">
            {user && (
              <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                🌟 {user.xp} XP
              </span>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-lg border border-slate-205 text-slate-700 hover:bg-slate-50 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu Layout */}
      {isMobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-100 bg-white px-4 py-5 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search resource titles..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>

          <div className="flex flex-col gap-1">
            <a
              href="#online-classes"
              onClick={(e) => { e.preventDefault(); handleNavClick('#online-classes'); }}
              className={`text-left px-3.5 py-3 rounded-xl text-sm font-black uppercase tracking-wide transition-all ${
                currentRoute === '#online-classes' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              Online Classes
            </a>

            <div className="pl-3.5 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Olympiad Prep:
            </div>
            {[
              { label: '🏆 IMO Maths preparation', route: '#categories' },
              { label: '🔬 ISO Science syllabus', route: '#syllabus' },
              { label: '📖 IEO English concepts', route: '#syllabus-matrix' },
            ].map((sub, i) => (
              <a
                key={i}
                href={sub.route}
                onClick={(e) => { e.preventDefault(); handleNavClick(sub.route); }}
                className="text-left pl-6 pr-3.5 py-2 hover:bg-slate-50 text-xs font-bold text-slate-700 transition"
              >
                {sub.label}
              </a>
            ))}

            <a
              href="#pricing"
              onClick={(e) => { e.preventDefault(); handleNavClick('#pricing'); }}
              className={`text-left px-3.5 py-3 rounded-xl text-sm font-black uppercase tracking-wide transition-all ${
                currentRoute === '#pricing' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              Pricing
            </a>

            <a
              href="#exam-dates"
              onClick={(e) => { e.preventDefault(); handleNavClick('#exam-dates'); }}
              className={`text-left px-3.5 py-3 rounded-xl text-sm font-black uppercase tracking-wide transition-all ${
                currentRoute === '#exam-dates' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-805 hover:bg-slate-50'
              }`}
            >
              Exam Dates
            </a>

            <a
              href="#categories"
              onClick={(e) => { e.preventDefault(); handleNavClick('#categories'); }}
              className="text-left px-3.5 py-3 rounded-xl text-sm font-black uppercase tracking-wide transition-all bg-amber-50 text-amber-900 border border-amber-200 mt-1 flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Free Practice Zone</span>
            </a>

            <div className="pl-3.5 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-2">
              Results & Ranks:
            </div>
            <a
              href="#leaderboard"
              onClick={(e) => { e.preventDefault(); handleNavClick('#leaderboard'); }}
              className="text-left pl-6 pr-3.5 py-2 font-bold text-xs text-slate-700 hover:bg-slate-50"
            >
              🏆 National Standings List
            </a>
            <a
              href="#certificates"
              onClick={(e) => { e.preventDefault(); handleNavClick('#certificates'); }}
              className="text-left pl-6 pr-3.5 py-2 font-bold text-xs text-slate-700 hover:bg-slate-50"
            >
              🎓 Printable Certificate Vault
            </a>
          </div>

          <div className="flex flex-col gap-1.5 pt-4 border-t border-slate-100">
            {user ? (
              <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-[#00A86B] text-white p-2 rounded-xl">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-black text-slate-900 truncate max-w-[130px]">{user.name}</span>
                    <span className="text-[10px] font-bold text-[#00A86B] font-mono">Level {user.level || 1} • {user.xp} XP</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="bg-red-50 text-red-650 px-3 py-1.5 rounded-xl text-xs font-bold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onTriggerLogin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="bg-[#00A86B] text-white font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-1"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => {
                    onTriggerLogin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="bg-[#FF5722] text-white font-extrabold py-3 rounded-xl text-xs"
                >
                  Register Free
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
