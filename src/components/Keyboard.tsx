import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { KEY_TO_FINGER, Finger } from '../lib/typingUtils';

interface KeyProps {
  label: string;
  active?: boolean;
  pressed?: boolean;
  isFingerKey?: boolean;
  className?: string;
}

const Key: React.FC<KeyProps> = ({ label, active, pressed, isFingerKey, className }) => {
  return (
    <motion.div
      initial={false}
      animate={{
        backgroundColor: active ? '#EAB308' : pressed ? '#404040' : isFingerKey ? '#1a1a1a' : '#27272a',
        borderColor: active ? '#EAB308' : pressed ? '#525252' : isFingerKey ? '#EAB30844' : '#3f3f46',
        color: active ? '#000' : pressed ? '#ffffff' : isFingerKey ? '#EAB308' : '#71717a',
        boxShadow: active 
          ? '0 0 20px rgba(234,179,8,0.4)' 
          : pressed 
            ? 'inset 0 2px 4px rgba(0,0,0,0.5)' 
            : '0 2px 0 rgba(0,0,0,0.1)',
        scale: pressed ? 0.93 : active ? 1.05 : 1,
        y: pressed ? 2 : 0
      }}
      transition={{ 
        type: "spring",
        stiffness: 600,
        damping: 30,
        mass: 0.8
      }}
      className={cn(
        "h-10 flex items-center justify-center rounded-lg text-[10px] font-black font-sans border transition-all relative overflow-hidden",
        className
      )}
    >
      <span className="relative z-10">{label.toUpperCase()}</span>
      {active && (
        <motion.div 
          layoutId="active-glow"
          className="absolute inset-0 bg-primary opacity-10 blur-xl"
        />
      )}
    </motion.div>
  );
};

interface KeyboardProps {
  activeKey?: string;
  activeFinger?: Finger;
}

const KEYBOARD_ROWS = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
  ['Space']
];

const KEY_WIDTHS: { [key: string]: string } = {
  'Backspace': 'w-20',
  'Tab': 'w-16',
  '\\': 'w-16',
  'Caps': 'w-20',
  'Enter': 'w-24',
  'Shift': 'w-28',
  'Space': 'w-64',
};

const PHYSICAL_KEY_MAP: { [label: string]: string } = {
  'Caps': 'capslock',
  'Space': ' ',
};

export const Keyboard: React.FC<KeyboardProps> = ({ activeKey, activeFinger }) => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPressedKeys(prev => {
        const next = new Set(prev);
        next.add(e.key.toLowerCase());
        return next;
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setPressedKeys(prev => {
        const next = new Set(prev);
        next.delete(e.key.toLowerCase());
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const normalize = (k: string) => k.toLowerCase();
  const currentKeyNormalized = activeKey ? normalize(activeKey) : null;

  return (
    <div className="p-6 bg-zinc-950/30 rounded-3xl border border-zinc-800/60 backdrop-blur-3xl shadow-inner group">
      <div className="flex flex-col gap-2">
        {KEYBOARD_ROWS.map((row, i) => (
          <div key={i} className={cn(
            "flex gap-2",
            i === 0 ? "justify-start" : i === 1 ? "pl-2" : i === 2 ? "pl-4" : i === 3 ? "pl-6" : "justify-center"
          )}>
            {row.map((key, j) => {
              const keyNorm = normalize(key);
              const physicalKey = PHYSICAL_KEY_MAP[key] || keyNorm;
              
              const isActive = (currentKeyNormalized === keyNorm) || 
                               (key === 'Space' && activeKey === ' ');
              
              const isPressed = pressedKeys.has(physicalKey);
              
              const finger = KEY_TO_FINGER[key === 'Space' ? ' ' : keyNorm];
              const isFingerKey = activeFinger !== undefined && finger === activeFinger;

              return (
                <Key
                  key={`${i}-${j}`}
                  label={key === 'Space' ? '' : key}
                  active={isActive}
                  pressed={isPressed}
                  isFingerKey={isFingerKey}
                  className={KEY_WIDTHS[key] || 'w-10'}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
