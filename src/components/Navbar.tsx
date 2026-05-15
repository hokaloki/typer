import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useFirebase } from '../lib/FirebaseProvider';
import { Zap, LayoutDashboard, Keyboard, Trophy, LineChart, LogOut, LogIn } from 'lucide-react';
import { cn } from '../lib/utils';

export function Navbar() {
  const { user, signIn, logout } = useFirebase();
  const location = useLocation();

  const navItems = [
    { to: '/', label: 'Dash', icon: <LayoutDashboard size={18} /> },
    { to: '/learn', label: 'Learn', icon: <Keyboard size={18} /> },
    { to: '/game', label: 'Game', icon: <Trophy size={18} /> },
    { to: '/analytics', label: 'Stats', icon: <LineChart size={18} /> },
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-8 py-3 bg-[#0d0d0d]/80 backdrop-blur-xl border border-zinc-800/50 rounded-full flex items-center gap-8 shadow-2xl">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="bg-yellow-500 w-8 h-8 rounded flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-[0_0_15px_rgba(234,179,8,0.3)]">
          <Zap size={18} className="text-black fill-current" />
        </div>
        <span className="font-bold tracking-tight text-xl uppercase hidden sm:inline-block">Velocity.typer</span>
      </Link>

      <div className="flex items-center gap-2">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "px-4 py-2 rounded-full flex items-center gap-2 text-xs font-medium uppercase tracking-widest transition-all",
              location.pathname === item.to 
                ? "text-yellow-500" 
                : "text-zinc-400 hover:text-white"
            )}
          >
            <span className="hidden md:inline-block">{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="h-6 w-px bg-zinc-800 mx-2" />

      {user ? (
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] text-zinc-500 uppercase tracking-tighter">Signed in</div>
            <div className="text-xs font-bold">{user.displayName?.split(' ')[0]}</div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-zinc-500 hover:text-red-500 transition-colors"
          >
            <img src={user.photoURL || ''} alt="" className="w-9 h-9 rounded-full border border-zinc-700" />
            <LogOut size={18} />
          </button>
        </div>
      ) : (
        <button 
          onClick={signIn}
          className="bg-yellow-500 text-black px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)]"
        >
          Login
        </button>
      )}
    </nav>
  );
}
