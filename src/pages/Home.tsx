import React from 'react';
import { useFirebase } from '../lib/FirebaseProvider';
import { motion } from 'motion/react';
import { Keyboard, Zap, Trophy, History, Play, Users, Globe, Smartphone, ShieldCheck, Target } from 'lucide-react';
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

      {/* Features Grid */}
      <section className="py-32 px-8 bg-[#0d0d0d] relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-20 text-center">
            <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4">Core Architecture</h2>
            <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase">Engineered for pure mechanical efficiency</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Feature 
              icon={<Zap className="text-yellow-500 w-6 h-6" />}
              title="Real-time Tracking"
              desc="Sub-millisecond latency tracking of every keystroke. Your performance is measured with industrial precision."
            />
            <Feature 
              icon={<Target className="text-zinc-100 w-6 h-6" />}
              title="Precision Grading"
              desc="Deep analysis of your error patterns. We don't just count mistakes; we identify the mechanical cause."
            />
            <Feature 
              icon={<Trophy className="text-zinc-100 w-6 h-6" />}
              title="Adaptive Difficulty"
              desc="Our engine scales with your skill. As your WPM increases, the environment intensifies to maintain your edge."
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-32 px-8 bg-zinc-900/10 border-t border-zinc-800/20">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-20 items-center">
            <div className="flex-1">
              <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-8 leading-none">The Training<br /><span className="text-yellow-500">Protocol</span></h2>
              <div className="space-y-12">
                <Step number="01" title="Initialize" desc="Connect your profile to start tracking your baseline velocity and accuracy across sessions." />
                <Step number="02" title="Condition" desc="Engage in guided practice modules focused on character clusters and muscle memory refinement." />
                <Step number="03" title="Simulate" desc="Enter combat mode where words fall as targets, testing your stress-response and sustained focus." />
              </div>
            </div>
            <div className="w-full md:w-[400px] aspect-square bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-[3rem] border border-zinc-700/50 relative overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 bg-yellow-500/5 group-hover:bg-yellow-500/10 transition-colors" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Keyboard className="w-40 h-40 text-zinc-100/10 group-hover:text-yellow-500/20 transition-all group-hover:scale-110" />
              </div>
              <div className="absolute bottom-10 left-10 right-10 p-6 bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                  <div className="text-[10px] text-zinc-500 font-mono">ENCRYPTED DATA</div>
                </div>
                <div className="space-y-2">
                  <div className="h-1.5 bg-zinc-800 rounded-full w-full" />
                  <div className="h-1.5 bg-zinc-800 rounded-full w-4/5" />
                  <div className="h-1.5 bg-yellow-500/30 rounded-full w-3/5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-8 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/[0.03] to-transparent pointer-events-none" />
        <h2 className="text-7xl md:text-8xl font-black uppercase italic tracking-tighter mb-12 opacity-90 leading-tight">Elevate Your<br />Mechanical Skill</h2>
        <Link 
          to="/learn"
          className="inline-flex items-center gap-4 bg-zinc-100 text-black px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-yellow-500 transition-all hover:scale-105 active:scale-95"
        >
          <Play className="fill-current w-5 h-5" />
          Start Training
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-zinc-800/40 bg-zinc-900/10">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg" />
              <span className="text-2xl font-black italic uppercase tracking-tighter">SwiftTyper</span>
            </div>
            <p className="max-w-xs text-zinc-500 text-sm font-mono leading-relaxed">
              Industrial-grade mechanical typing environment optimized for performance athletes and professional developers.
            </p>
          </div>
          
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-8">Navigation</h4>
            <div className="flex flex-col gap-4">
              <FooterLink to="/">Base Hub</FooterLink>
              <FooterLink to="/learn">Practice Mode</FooterLink>
              <FooterLink to="/game">Combat Simulation</FooterLink>
              <FooterLink to="/analytics">Performance Data</FooterLink>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-8">Technical</h4>
            <div className="flex flex-col gap-4 text-zinc-500 text-sm font-mono tracking-tight">
              <div className="group cursor-default hover:text-zinc-300 transition-colors lowercase">v4.2.0-stable</div>
              <div className="group cursor-default hover:text-zinc-300 transition-colors lowercase">mechanical-latency-2ms</div>
              <div className="group cursor-default hover:text-zinc-300 transition-colors lowercase">secure-data-link</div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-8 mt-20 pt-10 border-t border-zinc-800/40 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-zinc-600 font-mono text-[9px] uppercase tracking-[0.2em]">&copy; 2026 SwiftTyper Systems. All rights reserved.</p>
          <div className="flex gap-8 opacity-40 grayscale hover:grayscale-0 transition-all">
            <div className="w-10 h-6 bg-zinc-800 rounded" />
            <div className="w-8 h-6 bg-zinc-800 rounded" />
            <div className="w-12 h-6 bg-zinc-800 rounded" />
          </div>
        </div>
      </footer>
    </div>
  );
}

function Step({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <div className="flex gap-8 group">
      <div className="text-3xl font-black italic text-zinc-800 group-hover:text-yellow-500/20 transition-colors">{number}</div>
      <div>
        <h4 className="text-xl font-bold uppercase tracking-tighter mb-2 group-hover:text-yellow-500 transition-colors">{title}</h4>
        <p className="text-zinc-500 text-sm font-mono leading-relaxed max-w-sm">{desc}</p>
      </div>
    </div>
  );
}

function FooterLink({ to, children }: { to: string, children: React.ReactNode }) {
  return (
    <Link to={to} className="text-zinc-500 hover:text-yellow-500 text-sm font-mono transition-colors tracking-tight">
      {children}
    </Link>
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
