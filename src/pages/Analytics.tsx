import React, { useEffect, useState } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { motion } from 'motion/react';
import { TrendingUp, Clock, Target, Zap, Activity, Calendar, History, Trophy } from 'lucide-react';
import { UserSession } from '../types';
import { cn } from '../lib/utils';

export default function Analytics() {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSessions() {
      if (!auth.currentUser) return;
      
      const q = query(
        collection(db, "sessions"),
        where("userId", "==", auth.currentUser.uid),
        orderBy("timestamp", "asc"),
        limit(50)
      );
      
      try {
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserSession));
        setSessions(data);
      } catch (e) {
        console.error("Error fetching sessions", e);
      } finally {
        setLoading(false);
      }
    }

    fetchSessions();
  }, []);

  const chartData = sessions.map(s => ({
    time: s.timestamp?.toDate().toLocaleDateString() || '',
    wpm: s.wpm,
    accuracy: s.accuracy,
    score: s.score || 0
  }));

  const avgWpm = sessions.length > 0 ? sessions.reduce((acc, s) => acc + (s.wpm || 0), 0) / sessions.length : 0;
  const avgAccuracy = sessions.length > 0 ? sessions.reduce((acc, s) => acc + (s.accuracy || 0), 0) / sessions.length : 0;
  const topWpm = sessions.length > 0 ? Math.max(...sessions.map(s => s.wpm || 0)) : 0;

  if (loading) return <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center text-white">Loading protocols...</div>;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-zinc-100 p-8 pt-32 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-500 rounded flex items-center justify-center">
              <Activity className="text-black w-6 h-6" />
            </div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">Diagnostic.Center</h1>
          </div>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.3em]">Historical Performance Analysis</p>
        </header>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-zinc-800 border border-zinc-800 rounded-3xl overflow-hidden mb-16 shadow-2xl">
          <AnalyticCard 
            title="Avg. Velocity" 
            value={`${Math.round(avgWpm)} WPM`} 
            sub="Mean operational speed"
            icon={<Zap className="text-yellow-500" />}
          />
          <AnalyticCard 
            title="Max Velocity" 
            value={`${Math.round(topWpm)} WPM`} 
            sub="Peak mechanical output"
            icon={<TrendingUp className="text-white" />}
          />
          <AnalyticCard 
            title="Precision" 
            value={`${Math.round(avgAccuracy)}%`} 
            sub="Target acquisition accuracy"
            icon={<Target className="text-zinc-400" />}
          />
          <AnalyticCard 
            title="Sessions" 
            value={sessions.length.toString().padStart(2, '0')} 
            sub="Total cycles completed"
            icon={<History className="text-zinc-600" />}
          />
        </div>

        {/* Charts Grid */}
        <div className="mb-16">
          <div className="bg-zinc-900/40 p-10 rounded-3xl border border-zinc-800/60 shadow-xl backdrop-blur-sm">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-10 text-zinc-500 flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
              Velocity Trends
            </h3>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EAB308" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#EAB308" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#1e293b" vertical={false} opacity={0.2} />
                  <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#475569' }} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#475569' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0d0d0d', border: '1px solid #27272a', borderRadius: '8px', fontSize: '10px', textTransform: 'uppercase' }}
                    itemStyle={{ color: '#EAB308' }}
                  />
                  <Area type="monotone" dataKey="wpm" stroke="#EAB308" strokeWidth={3} fillOpacity={1} fill="url(#colorWpm)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>


        </div>

        {/* Session Log */}
        <div className="bg-zinc-900/20 rounded-3xl border border-zinc-800/50 shadow-2xl overflow-hidden backdrop-blur-md">
          <div className="p-10 border-b border-zinc-800/50">
            <h3 className="text-xs font-black uppercase tracking-[0.5em] text-zinc-400">Tactical Log_</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#0a0a0a] text-zinc-600 font-bold text-[10px] uppercase tracking-[0.3em]">
                <tr>
                  <th className="px-10 py-5">Timestamp</th>
                  <th className="px-10 py-5">Module</th>
                  <th className="px-10 py-5">Velocity</th>
                  <th className="px-10 py-5">Precision</th>
                  <th className="px-10 py-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/30">
                {sessions.slice().reverse().map((s) => (
                  <tr key={s.id} className="hover:bg-zinc-800/20 transition-colors group cursor-default">
                    <td className="px-10 py-5 font-mono text-xs text-zinc-500 group-hover:text-zinc-300">
                      {s.timestamp?.toDate().toLocaleDateString()}
                    </td>
                    <td className="px-10 py-5">
                      <span className={cn(
                        "px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest",
                        s.mode === 'game' ? "bg-white/5 text-white border border-white/10" : "bg-yellow-500/5 text-yellow-500 border border-yellow-500/10"
                      )}>
                        {s.mode}
                      </span>
                    </td>
                    <td className="px-10 py-5 font-bold font-mono text-lg">{Math.round(s.wpm)}</td>
                    <td className="px-10 py-5 font-bold font-mono text-lg">{Math.round(s.accuracy)}%</td>
                    <td className="px-10 py-5">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]",
                          s.accuracy > 95 ? "text-yellow-500 bg-yellow-500" : s.accuracy > 80 ? "text-zinc-400 bg-zinc-400" : "text-red-500 bg-red-500"
                        )} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 group-hover:text-zinc-400 transition-colors">
                          {s.accuracy > 95 ? "Optimal" : s.accuracy > 80 ? "Stable" : "Degraded"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticCard({ title, value, sub, icon }: { title: string, value: string | number, sub: string, icon: React.ReactNode }) {
  return (
    <div className="bg-[#0d0d0d] p-10 group transition-all hover:bg-zinc-900 border-l border-zinc-800 first:border-l-0">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800/50 group-hover:bg-zinc-800 transition-colors">
          {icon}
        </div>
      </div>
      <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">{title}</p>
      <h3 className="text-4xl font-black mb-2 tracking-tighter tabular-nums">{value}</h3>
      <p className="text-zinc-700 text-[9px] font-mono italic uppercase tracking-widest">{sub}</p>
    </div>
  );
}
