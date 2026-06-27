import React, { useState, useEffect } from 'react';
import { Trophy, Award, Search, HelpCircle, ArrowRight, Flame, Sparkles, MapPin, Layers, GraduationCap, Clock } from 'lucide-react';
import { UserProfile } from '../types';

interface LeaderboardPageProps {
  user: UserProfile | null;
}

interface RankItem {
  name: string;
  xp: number;
  rank: number;
  classLevel: string;
  state: string;
  subject: string;
  medals: {
    gold: number;
    silver: number;
    bronze: number;
    participation: number;
  };
}

export default function LeaderboardPage({ user }: LeaderboardPageProps) {
  const [scope, setScope] = useState<'National' | 'State' | 'Class' | 'Subject'>('National');
  const [timeframe, setTimeframe] = useState<'Daily' | 'Weekly' | 'Monthly' | 'All-Time'>('All-Time');
  const [classLevel, setClassLevel] = useState<string>('Class 5');
  const [subject, setSubject] = useState<string>('Mathematics');
  const [selectedState, setSelectedState] = useState<string>('Delhi');

  const [leaderboard, setLeaderboard] = useState<RankItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          scope,
          classLevel,
          subject,
          timeframe,
          state: selectedState
        });
        
        const res = await fetch(`/api/leaderboards?${queryParams.toString()}`);
        const data = await res.json();
        setLeaderboard(data.leaderboard || []);
      } catch (err) {
        console.error('Failed to fetch lead boards data. Setting static fallbacks.');
        // Fallback robust mocks
        const fallbacks: RankItem[] = [
          { name: 'Challenger_8A', xp: 2450, rank: 1, classLevel: 'Class 8', state: 'Maharashtra', subject: 'Mathematics', medals: { gold: 12, silver: 3, bronze: 1, participation: 0 } },
          { name: 'Solver_6B', xp: 2120, rank: 2, classLevel: 'Class 6', state: 'Delhi', subject: 'Logical Reasoning', medals: { gold: 10, silver: 4, bronze: 2, participation: 1 } },
          { name: 'Scientist_10C', xp: 1980, rank: 3, classLevel: 'Class 10', state: 'Karnataka', subject: 'Science', medals: { gold: 8, silver: 6, bronze: 2, participation: 0 } },
          { name: 'Thinker_5D', xp: 1750, rank: 4, classLevel: 'Class 5', state: 'Delhi', subject: 'Hindi', medals: { gold: 7, silver: 5, bronze: 3, participation: 2 } },
          { name: 'Scholar_9E', xp: 1640, rank: 5, classLevel: 'Class 9', state: 'Uttar Pradesh', subject: 'English', medals: { gold: 6, silver: 7, bronze: 1, participation: 1 } }
        ];
        
        let filtered = [...fallbacks];
        if (scope === 'Class') {
          filtered = filtered.filter(item => item.classLevel === classLevel);
        } else if (scope === 'State') {
          filtered = filtered.filter(item => item.state === selectedState);
        } else if (scope === 'Subject') {
          filtered = filtered.filter(item => item.subject === subject);
        }
        
        setLeaderboard(filtered);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [scope, timeframe, classLevel, subject, selectedState, user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-300 space-y-8">
      
      <div className="space-y-2 text-left">
        <span className="bg-indigo-50 text-indigo-700 font-extrabold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
          ⚡ Live Honor Standings
        </span>
        <h1 className="text-3.5xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-2">
          <Trophy className="w-8 h-8 text-amber-500 fill-amber-150 animate-bounce" />
          IQ200 Real-Time Leaderboards
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
          Filter through National standings, state rankings, individual grade standards, or school subject catalogs across Daily, Weekly, and Monthly timeframes. Showcases cumulative experience points, active attendance streaks and verified exam medals.
        </p>
      </div>

      {/* FILTER CONTROL PANEL */}
      <div id="leaderboard-filters" className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        {/* Scope selection */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-black text-slate-700 flex items-center gap-1.5 justify-start">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            Standings Scope
          </label>
          <div className="flex bg-slate-100 p-1 rounded-xl w-full gap-1">
            {['National', 'State', 'Class', 'Subject'].map((sc) => (
              <button
                key={sc}
                onClick={() => setScope(sc as any)}
                className={`flex-1 py-1.5 px-2 text-[10px] font-black rounded-lg transition-all ${
                  scope === sc 
                    ? 'bg-indigo-600 text-white shadow' 
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {sc}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Context select based on scope */}
        {scope === 'State' && (
          <div className="space-y-1.5 text-left animate-in slide-in-from-left-2 duration-200">
            <label className="text-xs font-black text-slate-700 flex items-center gap-1.5 justify-start">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              State Territory
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            >
              {['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal'].map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        )}

        {scope === 'Class' && (
          <div className="space-y-1.5 text-left animate-in slide-in-from-left-2 duration-200">
            <label className="text-xs font-black text-slate-700 flex items-center gap-1.5 justify-start">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
              Class Standard
            </label>
            <select
              value={classLevel}
              onChange={(e) => setClassLevel(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            >
              {['Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map(cl => (
                <option key={cl} value={cl}>{cl}</option>
              ))}
            </select>
          </div>
        )}

        {scope === 'Subject' && (
          <div className="space-y-1.5 text-left animate-in slide-in-from-left-2 duration-200">
            <label className="text-xs font-black text-slate-700 flex items-center gap-1.5 justify-start">
              <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
              Focus Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            >
              {['Mathematics', 'Science', 'English', 'Hindi', 'Logical Reasoning'].map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        )}

        {/* For basic spacing alignment when single context matches */}
        {scope === 'National' && <div className="hidden lg:block"></div>}

        {/* Timeframe Filter selection */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-black text-slate-700 flex items-center gap-1.5 justify-start">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            Time Interval
          </label>
          <div className="flex bg-slate-100 p-1 rounded-xl w-full gap-1">
            {['Daily', 'Weekly', 'Monthly', 'All-Time'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf as any)}
                className={`flex-1 py-1.5 px-2 text-[10px] font-black rounded-lg transition-all ${
                  timeframe === tf 
                    ? 'bg-indigo-600 text-white shadow' 
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Medal Indicator summary box */}
        <div className="flex items-center justify-end">
          {user && (
            <div className="w-full text-xs font-black text-indigo-950 flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 py-2.5 px-4 rounded-xl shadow-sm justify-center lg:justify-end">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
              <span>Personal: <span className="text-indigo-600 font-extrabold">{user.xp} XP</span> | Level <span className="text-indigo-600">{user.level}</span></span>
            </div>
          )}
        </div>
      </div>

      {/* Main standings display table */}
      <div id="leaderboard-table" className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs text-slate-700 animate-in fade-in duration-200">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                <th className="py-4.5 px-6 font-bold text-center w-20">Rank</th>
                <th className="py-4.5 px-6">Scholar Student</th>
                <th className="py-4.5 px-6">Zone / State</th>
                <th className="py-4.5 px-6">Class Level</th>
                <th className="py-4.5 px-6 text-center">Gold Medals</th>
                <th className="py-4.5 px-6 text-center">Timeframe XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700 font-sans">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-20 px-6 text-center text-slate-400 italic font-semibold">
                    Sorting academic standing records ...
                  </td>
                </tr>
              ) : leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 px-6 text-center text-slate-400 font-bold">
                    No active student records found for selected filters in this timeframe. Try another category!
                  </td>
                </tr>
              ) : (
                leaderboard.map((scholar, i) => {
                  const isGoldMedal = i === 0;
                  const isSilverMedal = i === 1;
                  const isBronzeMedal = i === 2;

                  return (
                    <tr 
                      key={scholar.name + i} 
                      className={`hover:bg-slate-50 border-b border-dashed border-slate-100 transition-colors ${
                        user && scholar.name.toUpperCase() === user.name.toUpperCase() 
                          ? 'bg-indigo-50/70 border-l-4 border-l-indigo-600' 
                          : ''
                      }`}
                    >
                      <td className="py-4 px-6 text-center font-black">
                        {isGoldMedal ? (
                          <span className="text-xl">🏆</span>
                        ) : isSilverMedal ? (
                          <span className="text-xl">🥈</span>
                        ) : isBronzeMedal ? (
                          <span className="text-xl">🥉</span>
                        ) : (
                          <span className="text-slate-500 text-sm">{scholar.rank || i + 1}</span>
                        )}
                      </td>
                      <td className="py-4 px-6 font-extrabold text-slate-900">
                        <div className="flex items-center gap-1.5 justify-start">
                          <span>{scholar.name}</span>
                          {user && scholar.name.toUpperCase() === user.name.toUpperCase() && (
                            <span className="text-[8px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-150 px-1.5 py-0.5 rounded">
                              YOU
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-500 flex items-center gap-1 justify-start">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {scholar.state || 'Delhi'}
                      </td>
                      <td className="py-4 px-6 text-slate-600">{scholar.classLevel}</td>
                      <td className="py-4 px-6 text-center font-black text-amber-600">
                        {(scholar.medals?.gold || 0) > 0 ? (
                          <span className="bg-amber-50 text-amber-700 text-[10px] uppercase font-black tracking-widest py-1 px-2.5 rounded-full inline-flex items-center gap-1">
                            🥇 {scholar.medals?.gold} Medals
                          </span>
                        ) : (
                          <span className="text-slate-400 font-normal italic">Participation only</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="font-mono font-black text-indigo-600 text-sm">+{scholar.xp} XP</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
