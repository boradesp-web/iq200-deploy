import React from 'react';
import { Brain, ArrowUp, Send, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const scrolltoTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="app-footer" className="bg-gray-900 text-gray-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo Brand / Brief */}
          <div className="space-y-4">
            <div 
              onClick={() => onNavigate('#home')} 
              className="flex items-center gap-2 cursor-pointer text-white max-w-fit"
            >
              <div className="bg-indigo-600 text-white p-2 rounded-xl">
                <Brain className="w-5 h-5" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                IQ<span className="text-indigo-400">200</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              IQ200 provides student-paced practicing engines and reinforcement challenges. Help your child build problem-solving confidence, practice International Olympiad topics, and explore mental math and cognitive skill challenges.
            </p>
          </div>

          {/* Quick Nav links */}
          <div>
            <h3 className="text-xs font-bold uppercase text-gray-200 tracking-wider mb-4">Core Platform</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('#home')} className="hover:text-indigo-400 transition-colors">Home Dashboard</button>
              </li>
              <li>
                <button onClick={() => onNavigate('#categories')} className="hover:text-indigo-400 transition-colors">Olympiad & Tests</button>
              </li>
              <li>
                <button onClick={() => onNavigate('#blog')} className="hover:text-indigo-400 transition-colors">Brain Training Blog</button>
              </li>
              <li>
                <button onClick={() => onNavigate('#admin')} className="hover:text-indigo-400 transition-colors">Admin Console</button>
              </li>
            </ul>
          </div>

          {/* Legal / Compliance links */}
          <div>
            <h3 className="text-xs font-bold uppercase text-gray-200 tracking-wider mb-4">Regulatory & Safety</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('#privacy')} className="hover:text-indigo-400 transition-colors">Privacy Policy</button>
              </li>
              <li>
                <button onClick={() => onNavigate('#terms')} className="hover:text-indigo-400 transition-colors">Terms & Conditions</button>
              </li>
              <li>
                <button onClick={() => onNavigate('#about')} className="hover:text-indigo-400 transition-colors">About Our Academy</button>
              </li>
              <li>
                <button onClick={() => onNavigate('#contact')} className="hover:text-indigo-400 transition-colors">Support & Queries</button>
              </li>
            </ul>
          </div>

          {/* Newsletter / Tech stack */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase text-gray-200 tracking-wider">Educational Practice</h3>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Currated assessments aligned with global curriculum guidelines to offer reliable academic challenges for home review.
            </p>
            <div className="flex items-center gap-1.5 text-[10px] bg-gray-800 text-gray-300 px-3 py-1.5 rounded-lg max-w-fit font-mono">
              <span>Access:</span>
              <span className="text-emerald-400 font-extrabold">100% Free Practice</span>
            </div>
          </div>

        </div>

        {/* Lower Divider Section */}
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col space-y-4 text-xs text-gray-500">
          <p className="leading-relaxed text-gray-450 bg-gray-950 p-4 rounded-xl border border-gray-800/60">
            <strong>Educational Disclaimer:</strong> IQ200 provides educational practice resources and skill-building assessments. Results should be used for learning and self-improvement purposes and should not be interpreted as clinical, psychological, or professional evaluations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p>© {new Date().getFullYear()} IQ200 Academy. All rights reserved. Self-assessment grades are illustrative for supplementary self-study.</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for thinkers
              </span>
              <button 
                onClick={scrolltoTop}
                className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors bg-gray-800 py-1 px-2.5 rounded-lg border border-gray-850 text-[11px]"
              >
                Back to TOP <ArrowUp className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
