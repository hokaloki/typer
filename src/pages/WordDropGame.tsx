import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Zap, Target, Award, Play, RotateCcw, Home, Trophy } from 'lucide-react';

interface Word {
  id: string;
  text: string;
  x: number;
  y: number;
  speed: number;
}

const COMMON_WORDS = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also"
];

export default function WordDropGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [words, setWords] = useState<Word[]>([]);
  const [userInput, setUserInput] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);

  const requestRef = useRef<number>(null);
  const spawnTimerRef = useRef<NodeJS.Timeout>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const spawnWord = useCallback(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.offsetWidth;
    const word = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];
    const newWord: Word = {
      id: Math.random().toString(36).substr(2, 9),
      text: word,
      x: Math.random() * (width - 150) + 50,
      y: -50,
      speed: (1 + level * 0.2) * (Math.random() * 0.5 + 0.75)
    };
    setWords(prev => [...prev, newWord]);
  }, [level]);

  const updateWords = useCallback(() => {
    if (gameOver || !isPlaying) return;

    setWords(prev => {
      const next = prev.map(w => ({ ...w, y: w.y + w.speed }));
      const missed = next.some(w => w.y > 600);
      
      if (missed) {
        setGameOver(true);
        setIsPlaying(false);
        return next;
      }
      return next;
    });

    requestRef.current = requestAnimationFrame(updateWords);
  }, [gameOver, isPlaying]);

  useEffect(() => {
    if (isPlaying && !gameOver) {
      requestRef.current = requestAnimationFrame(updateWords);
      spawnTimerRef.current = setInterval(spawnWord, Math.max(2000 - level * 100, 800));
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, [isPlaying, gameOver, level, spawnWord, updateWords]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().trim();
    setUserInput(val);

    const matchIndex = words.findIndex(w => w.text.toLowerCase() === val);
    if (matchIndex !== -1) {
      const match = words[matchIndex];
      setScore(prev => prev + match.text.length * (combo + 1) * level);
      setCombo(prev => prev + 1);
      setWords(prev => prev.filter((_, i) => i !== matchIndex));
      setUserInput("");
      
      if (score > 0 && score % 500 === 0) {
        setLevel(prev => prev + 1);
      }
    }
  };

  const startGame = () => {
    setScore(0);
    setWords([]);
    setUserInput("");
    setGameOver(false);
    setIsPlaying(true);
    setLevel(1);
    setCombo(0);
  };

  useEffect(() => {
    if (gameOver && auth.currentUser) {
      addDoc(collection(db, "sessions"), {
        userId: auth.currentUser.uid,
        mode: "game",
        score,
        level,
        timestamp: serverTimestamp()
      });
    }
  }, [gameOver, score, level]);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-zinc-100 flex flex-col items-center p-8 pt-40 overflow-hidden font-sans">
      <header className="w-full max-w-5xl flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-500 rounded flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.3)]">
            <Trophy className="text-black w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter transition-all hover:text-yellow-500 cursor-default">Combat.word</h1>
            <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-bold">Protocol Active</p>
          </div>
        </div>
        <div className="flex items-center gap-16">
          <div className="text-center group cursor-default">
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1 group-hover:text-yellow-500 transition-colors">Intensity</p>
            <p className="text-3xl font-black font-mono tracking-tighter">LV. {level}</p>
          </div>
          <div className="text-center group cursor-default">
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1 group-hover:text-yellow-500 transition-colors">Performance</p>
            <p className="text-6xl font-black font-mono text-yellow-500 tabular-nums tracking-tighter drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]">{score.toLocaleString()}</p>
          </div>
          <div className="text-center group cursor-default">
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1 group-hover:text-yellow-500 transition-colors">Combo</p>
            <p className="text-3xl font-black font-mono text-zinc-400 italic">x{combo}</p>
          </div>
        </div>
      </header>

      <div 
        ref={containerRef}
        className="w-full max-w-5xl h-[600px] bg-zinc-900/10 rounded-[2rem] border border-zinc-800/40 relative shadow-inner mb-12 backdrop-blur-3xl"
      >
        <AnimatePresence>
          {words.map(word => (
            <motion.div
              key={word.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, top: word.y, left: word.x }}
              exit={{ scale: 1.5, opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.1, ease: "linear" }}
              className="absolute px-6 py-3 bg-zinc-900/90 backdrop-blur-xl border border-zinc-700/30 rounded-xl shadow-2xl flex items-center gap-3 group"
            >
              <div className="w-1.5 h-6 bg-yellow-500 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
              <span className="text-2xl font-mono font-bold tracking-tight text-white uppercase">{word.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0d0d0d]/40 backdrop-blur-2xl rounded-3xl z-30">
            <button 
              onClick={startGame}
              className="group bg-yellow-500 hover:bg-yellow-400 text-black font-black px-16 py-6 rounded-2xl transition-all flex items-center gap-5 transform hover:scale-105 shadow-[0_0_60px_rgba(234,179,8,0.2)]"
            >
              <Play className="fill-current w-7 h-7" />
              <span className="text-xl uppercase tracking-widest italic">Engage Simulation</span>
            </button>
          </div>
        )}

        {gameOver && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d0d0d]/80 backdrop-blur-3xl rounded-3xl z-40"
          >
            <h2 className="text-8xl font-black text-red-500/90 mb-4 italic uppercase tracking-tighter scale-x-110 drop-shadow-[0_0_30px_rgba(239,68,68,0.2)]">Terminated</h2>
            <p className="text-zinc-600 mb-12 font-mono uppercase text-xs tracking-[0.6em] font-bold">Target escaped simulation</p>
            <div className="bg-[#080808] px-20 py-12 rounded-[2.5rem] border border-zinc-800 shadow-3xl mb-12 flex gap-24 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Trophy className="w-48 h-48" />
              </div>
              <div className="text-center relative z-10">
                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mb-3">Final Velocity</p>
                <p className="text-7xl font-black text-white font-mono tracking-tighter">{score.toLocaleString()}</p>
              </div>
              <div className="text-center relative z-10">
                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mb-3">Max Efficiency</p>
                <p className="text-7xl font-black text-white font-mono tracking-tighter">LV.{level}</p>
              </div>
            </div>
            <button 
              onClick={startGame}
              className="bg-white text-black font-black px-12 py-4 rounded-xl hover:bg-zinc-200 transition-all flex items-center gap-4 text-sm uppercase tracking-widest shadow-xl group"
            >
              <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              Re-Initialize
            </button>
          </motion.div>
        )}
      </div>

      <div className="w-full max-w-lg mb-12">
        <div className="relative group">
          <input
            type="text"
            value={userInput}
            onChange={handleInput}
            autoFocus
            disabled={!isPlaying || gameOver}
            placeholder={isPlaying ? "Awaiting command..." : "System Standby"}
            className="w-full bg-zinc-900 border border-zinc-800/80 rounded-[1.25rem] px-10 py-6 text-4xl font-mono text-center outline-none focus:border-yellow-500/40 focus:ring-4 focus:ring-yellow-500/5 transition-all shadow-2xl placeholder:text-zinc-800 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-[0.8em]"
          />
          {isPlaying && (
            <div className="absolute top-1/2 -translate-y-1/2 right-8 flex items-center gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping" />
              <div className="flex gap-1.5 h-6 items-center">
                {[...Array(5)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: [4, 16, 4] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                    className="w-[2px] bg-yellow-500/40 rounded-full"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <footer className="mt-auto py-12 text-zinc-700 text-[10px] uppercase font-mono tracking-[0.8em] text-center opacity-40 hover:opacity-100 transition-opacity">
        Mechanical Integrity Protocol v4.2
      </footer>
    </div>
  );
}
