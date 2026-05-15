import React from 'react';
import { useFirebase } from '../lib/FirebaseProvider';
import { motion } from 'motion/react';
import { Keyboard, Zap, Trophy, History, Play, Users, Globe, Smartphone, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const { user, signIn } = useFirebase();

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-zinc-100 overflow-hidden font-sans">
      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-yellow-500/5 to-transparent blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <span className="px-5 py-2 bg-zinc-900 border border-zinc-800/50 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] text-yellow-500">
              Low Latency Typing Engine
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8] mb-12"
          >
            Velocity<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-200">Enforcer</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl text-lg text-zinc-500 font-mono tracking-tight mb-16 leading-relaxed"
          >
            The sophisticated environment for elite typing performance. 
            Track precision, speed, and mental focus with industrial-grade analytics.
          </motion.p>

          {!user ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={signIn}
              className="bg-yellow-500 text-black font-black px-12 py-5 rounded-xl text-xl uppercase tracking-widest transition-all shadow-[0_0_50px_rgba(234,179,8,0.25)] hover:bg-yellow-400"
            >
              Initialize Profile
            </motion.button>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-px bg-zinc-800 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
            >
              <ModeLink 
                to="/learn" 
                title="Practice" 
                desc="Guided mechanical training"
                items={["Heatmap Guidance", "Key Precision"]}
                icon={<Keyboard className="w-8 h-8 text-yellow-500" />}
              />
              <ModeLink 
                to="/game" 
                title="Combat" 
                desc="Gamified velocity stress test"
                items={["Difficulty Scaling", "Leaderboards"]}
                icon={<Trophy className="w-8 h-8 text-zinc-100" />}
              />
              <ModeLink 
                to="/analytics" 
                title="Data Center" 
                desc="Performance deep dive"
                items={["Improvement Curves", "Trend Analysis"]}
                icon={<History className="text-zinc-600 w-8 h-8" />}
              />
            </motion.div>
          )}
        </div>
      </section>

      {/* Stats Preview Bar */}
      <section className="bg-zinc-900/20 border-y border-zinc-800/40 py-12 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-around gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
           <StaticStat label="Active Users" value="12,408" />
           <StaticStat label="Global Avg WPM" value="64.2" />
           <StaticStat label="Keys Struck Today" value="8.2M" />
           <StaticStat label="Accuracy Goal" value="98.5%" />
        </div>
      </section>
    </div>
  );
}

function StaticStat({ label, value }: { label: string, value: string }) {
  return (
    <div className="text-center">
      <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">{label}</p>
      <p className="text-2xl font-bold font-mono tracking-tighter">{value}</p>
    </div>
  );
}

function ModeLink({ to, title, desc, icon, items }: { to: string, title: string, desc: string, icon: React.ReactNode, items: string[] }) {
  return (
    <Link to={to} className="group flex flex-col w-full md:w-80 bg-[#0d0d0d] p-10 transition-all hover:bg-zinc-900">
      <div className="mb-8 p-4 bg-zinc-900 rounded-2xl w-fit group-hover:scale-110 group-hover:bg-zinc-800 transition-all border border-zinc-800/50">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3 uppercase tracking-tighter underline decoration-zinc-800 decoration-2 underline-offset-8 group-hover:decoration-yellow-500 transition-all">{title}</h3>
      <p className="text-zinc-500 text-sm mb-8 leading-relaxed font-mono">{desc}</p>
      <div className="mt-auto flex flex-col gap-2">
        {items.map(item => (
          <div key={item} className="flex items-center gap-2 text-[9px] uppercase font-bold tracking-[0.2em] text-zinc-600 group-hover:text-zinc-400 transition-colors">
            <div className="w-1.5 h-1.5 bg-yellow-500/20 group-hover:bg-yellow-500 rounded-sm transition-colors" />
            {item}
          </div>
        ))}
      </div>
    </Link>
  );
}
function Feature({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex flex-col gap-6 p-8 bg-zinc-900/20 border border-zinc-800/40 rounded-3xl group hover:bg-zinc-800/30 transition-all">
      <div className="p-4 bg-zinc-900 rounded-2xl w-fit border border-zinc-800/50 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold uppercase tracking-tighter">{title}</h3>
      <p className="text-zinc-500 leading-relaxed font-mono text-sm">{desc}</p>
    </div>
  );
}
