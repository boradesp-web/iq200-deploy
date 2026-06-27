import React, { useState } from 'react';
import { 
  BookOpen, Search, GraduationCap, ChevronRight, Loader2, 
  Map, Sparkles, Book, Info, AlertCircle, FileText, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SyllabusGuideView() {
  const [selectedClass, setSelectedClass] = useState<string>('Class 5');
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');
  const [selectedOrg, setSelectedOrg] = useState<'SOF' | 'ITO'>('SOF');
  const [syllabusData, setSyllabusData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const classes = Array.from({ length: 9 }, (_, i) => `Class ${i + 2}`); // Class 2 to 10
  const subjects = ['Mathematics', 'Science', 'English', 'Hindi'];

  const handleFetchSyllabus = async () => {
    setIsLoading(true);
    setError(null);
    setSyllabusData(null);
    
    // Build query for the AI Guide
    const query = `What is the ${selectedClass} ${selectedSubject} syllabus for ${selectedOrg} Olympiad?`;

    try {
      const res = await fetch('/api/ask-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      const data = await res.json();
      if (data.success) {
        setSyllabusData(data.answer);
      } else {
        setError(data.error || 'Failed to retrieve the syllabus. Please try again.');
      }
    } catch (err) {
      setError('Connection error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8 animate-in fade-in duration-500">
      
      {/* Header section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          Live Official Syllabus Guide
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
          Official <span className="text-indigo-600">Olympiad Syllabus</span>
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Select your grade and subject to view the current academic year's syllabus fetched directly from official SOF and ITO records.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Selector Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            
            {/* Organization Toggle */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Exam Body</label>
              <div className="flex p-1 bg-slate-100 rounded-2xl">
                <button
                  onClick={() => setSelectedOrg('SOF')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    selectedOrg === 'SOF' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  SOF (Science Olympiad)
                </button>
                <button
                  onClick={() => setSelectedOrg('ITO')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    selectedOrg === 'ITO' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  ITO (Indian Talent)
                </button>
              </div>
            </div>

            {/* Class Selection Grid */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Grade Level</label>
              <div className="grid grid-cols-3 gap-2">
                {classes.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setSelectedClass(cls)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      selectedClass === cls 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100' 
                        : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {cls.replace('Class ', 'C')}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Selection */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Subject</label>
              <div className="space-y-2">
                {subjects.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubject(sub)}
                    className={`w-full py-3 px-4 text-xs font-bold rounded-2xl border flex items-center justify-between transition-all ${
                      selectedSubject === sub 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                        : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span>{sub}</span>
                    {selectedSubject === sub && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleFetchSyllabus}
              disabled={isLoading || !selectedClass || !selectedSubject || !selectedOrg}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2 group active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Fetching Library...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>View Syllabus Directly</span>
                </>
              )}
            </button>
          </div>

          {/* Guidelines info */}
          <div className="bg-indigo-900 rounded-3xl p-6 text-indigo-100 space-y-3 text-left">
            <h4 className="font-bold flex items-center gap-2 text-sm">
              <Info className="w-4 h-4 text-indigo-300" />
              Syllabus Guidelines
            </h4>
            <p className="text-[10px] leading-relaxed opacity-80 font-medium">
              The syllabus is updated annually based on NCERT, CBSE, and ICSE council recommendations. IQ200 uses AI-powered web indexing to ensure you see the most current version available on official platforms.
            </p>
          </div>
        </div>

        {/* Display Area */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {!syllabusData && !isLoading && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full min-h-[500px] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center p-12 space-y-4"
              >
                <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center">
                  <FileText className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-800">Ready to Explore?</h3>
                  <p className="text-sm text-slate-500 max-w-md">
                    Select a class and subject on the left to see the official curriculum and exam pattern.
                  </p>
                </div>
              </motion.div>
            )}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full min-h-[500px] bg-white border border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center p-12 space-y-6"
              >
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                  <BotIcon className="w-6 h-6 text-indigo-600 absolute inset-0 m-auto" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-800">Consulting Official Olympiad Repositories</h3>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto">
                    Our AI Guide is visiting {selectedOrg === 'SOF' ? 'sofworld.org' : 'indiantalent.org'} to retrieve the exact {selectedClass} syllabus for you.
                  </p>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full min-h-[500px] bg-red-50 border border-red-100 rounded-3xl flex flex-col items-center justify-center text-center p-12 space-y-4"
              >
                <AlertCircle className="w-12 h-12 text-red-500" />
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-red-800">Retrieval Error</h3>
                  <p className="text-sm text-red-600 max-w-md">
                    {error}
                  </p>
                  <button 
                    onClick={handleFetchSyllabus}
                    className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-bold shadow-lg"
                  >
                    Retry Fetching
                  </button>
                </div>
              </motion.div>
            )}

            {syllabusData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden text-left"
              >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900">{selectedClass} {selectedSubject} Syllabus</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Source: {selectedOrg === 'SOF' ? 'Science Olympiad Foundation' : 'Indian Talent Olympiad'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-8 lg:p-10 space-y-6 overflow-y-auto max-h-[700px] custom-scrollbar">
                  <div className="prose prose-slate prose-indigo max-w-none">
                    {syllabusData.split('\n').map((line, i) => {
                      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                        return (
                          <li key={i} className="text-sm text-slate-700 mb-2 leading-relaxed list-none flex items-start gap-4">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0"></span>
                            <span>{line.replace(/^[-*]\s*/, '')}</span>
                          </li>
                        );
                      }
                      if (line.trim().length === 0) return <div key={i} className="h-4" />;
                      
                      // Check for headers
                      if (line.toUpperCase() === line && line.length > 5 && !line.includes('NOTE:')) {
                        return <h4 key={i} className="text-lg font-black text-slate-900 mt-6 mb-3 border-l-4 border-indigo-600 pl-4">{line}</h4>;
                      }

                      return <p key={i} className={`text-sm text-slate-700 leading-relaxed mb-4 ${line.startsWith('Note:') ? 'text-indigo-600 font-bold italic bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100' : ''}`}>{line}</p>;
                    })}
                  </div>
                  
                  <div className="pt-8 border-t border-slate-100 space-y-4">
                    <p className="text-xs text-slate-400 font-medium italic">
                      This information was retrieved in real-time from official sources. Exam patterns and weightage are subject to change by the governing board.
                    </p>
                    <div className="flex flex-wrap gap-2">
                       <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors">
                         <Map className="w-3.5 h-3.5" />
                         Download Roadmap
                       </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function BotIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}
