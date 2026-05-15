import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Keyboard } from '../components/Keyboard';
import { FingerGuide } from '../components/FingerGuide';
import { useTypingTest } from '../hooks/useTypingTest';
import { cn } from '../lib/utils';
import { Play, RotateCcw, ChevronRight, Award, Zap, Target, AlertCircle } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const DEFAULT_SENTENCE = "The quick brown fox jumps over the lazy dog";

export default function LearningMode() {
  const [repetitions, setRepetitions] = useState(1);
  const [fullText, setFullText] = useState(() => Array(1).fill(DEFAULT_SENTENCE).join(" "));

  useEffect(() => {
    setFullText(Array(repetitions).fill(DEFAULT_SENTENCE).join(" "));
  }, [repetitions]);

  const onSessionComplete = useCallback(async (stats: any) => {
    if (auth.currentUser) {
      try {
        await addDoc(collection(db, "sessions"), {
          userId: auth.currentUser.uid,
          mode: "learning",
          ...stats,
          timestamp: serverTimestamp()
        });
      } catch (e) {
        console.error("Failed to save session", e);
      }
    }
  }, []);

  const {
    userInput,
    currentChar,
    activeFinger,
    isFinished,
    isWaiting,
    errors,
    handleKey,
    reset,
    wpm,
    accuracy
  } = useTypingTest(fullText, onSessionComplete);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling with Space
      if (e.key === " " && isWaiting) {
        e.preventDefault();
      }

      if (e.key === "Backspace") return; 
      if (e.key === "Tab") {
        e.preventDefault();
        reset();
        return;
      }
      
      // Handle Shift+Enter as requested in the legend (focus)
      if (e.key === "Enter" && e.shiftKey) {
        e.preventDefault();
        reset();
        return;
      }

      // Pass keys to hook. Hook handles isWaiting check.
      // We pass the key if it's a single char OR if it's Enter/Space (for starting)
      if (e.key.length === 1 || e.key === "Enter") {
        handleKey(e.key);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleKey, reset, isWaiting]); // handleKey is now much more stable

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-zinc-100 p-8 pt-32 flex flex-col items-center">
      <header className="w-full max-w-5xl flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-500 rounded flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.2)]">
            <Zap className="text-black w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight uppercase">Practice Session</h1>
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest">Mastery Level: Advanced</p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded border border-zinc-800">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Repetitions</span>
            <select 
              value={repetitions} 
              onChange={(e) => {
                setRepetitions(Number(e.target.value));
                reset();
              }}
              className="bg-transparent text-zinc-200 outline-none cursor-pointer text-xs font-bold"
            >
              {[1, 3, 5, 10].map(n => <option key={n} value={n} className="bg-zinc-900">{n}x</option>)}
            </select>
          </div>
          <button 
            onClick={reset}
            className="p-2 hover:bg-zinc-800 rounded border border-zinc-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="w-full max-w-5xl flex justify-center gap-24 mb-16">
        <div className="text-center">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">WPM</div>
          <div className="text-6xl font-mono font-bold text-yellow-500 tabular-nums tracking-tighter">{Math.round(wpm)}</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Accuracy</div>
          <div className="text-6xl font-mono font-bold text-zinc-100 tabular-nums tracking-tighter">
            {Math.round(accuracy)}<span className="text-2xl text-zinc-600">%</span>
          </div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Errors</div>
          <div className="text-6xl font-mono font-bold text-red-500 tabular-nums tracking-tighter">{errors}</div>
        </div>
      </div>

      {/* Typing Area */}
      <section className="w-full max-w-5xl relative mb-20 group">
        <div className="relative z-10 font-mono text-4xl leading-relaxed tracking-wide text-zinc-700 min-h-[160px]">
          {fullText.split('').map((char, index) => {
            let status = 'pending';
            if (index < userInput.length) {
              status = 'correct';
            } else if (index === userInput.length) {
              status = 'current';
            }

            return (
              <span 
                key={index} 
                className={cn(
                  "relative transition-all duration-75",
                  status === 'correct' && "text-zinc-300",
                  status === 'current' && "text-yellow-500 bg-yellow-500/10 underline decoration-yellow-500 decoration-2 underline-offset-8",
                  status === 'pending' && "text-zinc-800"
                )}
              >
                {status === 'current' && (
                  <span className="absolute -left-[1px] top-0 bottom-0 w-[2.5px] bg-yellow-500 animate-[pulse_1s_infinite]" />
                )}
                {char === ' ' ? '\u00A0' : char}
              </span>
            );
          })}
        </div>
        
        <AnimatePresence>
          {isWaiting && !isFinished && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0d0d0d]/40 backdrop-blur-[2px] rounded-2xl border border-zinc-800/50"
            >
              <div className="flex flex-col items-center gap-6 animate-bounce">
                <div className="flex gap-4">
                  <div className="bg-zinc-900 border border-zinc-700 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-zinc-100 shadow-[0_10px_0_rgb(39,39,42)]">
                    SPACE
                  </div>
                  <div className="text-zinc-600 font-black italic flex items-center">OR</div>
                  <div className="bg-zinc-900 border border-zinc-700 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-zinc-100 shadow-[0_10px_0_rgb(39,39,42)]">
                    ENTER
                  </div>
                </div>
                <p className="text-yellow-500 font-bold uppercase tracking-[0.3em] text-sm animate-pulse">TO INITIALIZE ENGINE</p>
              </div>
            </motion.div>
          )}

          {isFinished && (
            <motion.div 
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
              className="absolute inset-x-0 inset-y-[-40px] bg-[#0d0d0d]/80 flex flex-col items-center justify-center z-20 rounded-3xl border border-zinc-800"
            >
              <Award className="w-16 h-16 text-yellow-500 mb-4 drop-shadow-[0_0_20px_rgba(234,179,8,0.4)]" />
              <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-8">Performance Wrap</h2>
              <div className="grid grid-cols-2 gap-12 mb-12">
                <div className="text-center">
                  <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">Final Speed</p>
                  <p className="text-5xl font-black font-mono text-yellow-500">{Math.round(wpm)} <span className="text-xl">WPM</span></p>
                </div>
                <div className="text-center">
                  <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">Precision</p>
                  <p className="text-5xl font-black font-mono">{Math.round(accuracy)}%</p>
                </div>
              </div>
              <button 
                onClick={reset}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-12 py-4 rounded-xl transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(234,179,8,0.2)]"
              >
                <RotateCcw className="w-5 h-5" />
                NEW SESSION
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Shortcut Legend */}
        <div className="mt-8 flex gap-4 opacity-40 group-hover:opacity-100 transition-opacity">
          <div className="bg-zinc-900 px-3 py-1 rounded text-[10px] text-zinc-400 border border-zinc-800">
            <span className="text-zinc-600 font-bold uppercase mr-1">Space / Enter</span> Start
          </div>
          <div className="bg-zinc-900 px-3 py-1 rounded text-[10px] text-zinc-400 border border-zinc-800">
            <span className="text-zinc-600 font-bold uppercase mr-1">Tab</span> Reset
          </div>
          <div className="bg-zinc-900 px-3 py-1 rounded text-[10px] text-zinc-400 border border-zinc-800">
            <span className="text-zinc-600 font-bold uppercase mr-1">Shift+Enter</span> Focus
          </div>
        </div>
      </section>

      {/* Visual Guides */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8 items-start">
        <Keyboard activeKey={currentChar} />
        <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800/80">
          <FingerGuide activeFinger={activeFinger} />
        </div>
      </div>
      
      <footer className="mt-auto py-12 text-zinc-600 text-[10px] uppercase font-mono tracking-[0.4em]">
        Velocity Engine v2.0 • Real-time Data Sync Active
      </footer>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-6">
      <div className="p-4 bg-slate-950 rounded-xl">
        {icon}
      </div>
      <div>
        <p className="text-slate-500 text-xs uppercase font-mono tracking-widest">{label}</p>
        <p className="text-3xl font-bold font-mono tracking-tight">{value}</p>
      </div>
    </div>
  );
}
