import React from 'react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface KeyProps {
  label: string;
  active?: boolean;
  finger?: string;
  className?: string;
}

const Key: React.FC<KeyProps> = ({ label, active, finger, className }) => {
  return (
    <motion.div
      animate={{
        backgroundColor: active ? '#EAB308' : '#27272a',
        borderColor: active ? '#EAB308' : '#3f3f46',
        color: active ? '#000' : '#71717a',
        boxShadow: active ? '0 0 15px rgba(234,179,8,0.4)' : 'none'
      }}
      className={cn(
        "h-10 flex items-center justify-center rounded text-[10px] font-bold font-sans border transition-shadow",
        className
      )}
    >
      {label.toUpperCase()}
    </motion.div>
  );
};

interface KeyboardProps {
  activeKey?: string;
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

export const Keyboard: React.FC<KeyboardProps> = ({ activeKey }) => {
  const normalize = (k: string) => k.toLowerCase();
  const currentKey = activeKey ? normalize(activeKey) : null;

  return (
    <div className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800/80">
      <div className="flex flex-col gap-2">
        {KEYBOARD_ROWS.map((row, i) => (
          <div key={i} className={cn(
            "flex gap-2",
            i === 0 ? "justify-start" : i === 1 ? "pl-2" : i === 2 ? "pl-4" : i === 3 ? "pl-6" : "justify-center"
          )}>
            {row.map((key, j) => {
              const isActive = currentKey === normalize(key) || 
                              (key === 'Space' && activeKey === ' ');
              return (
                <Key
                  key={`${i}-${j}`}
                  label={key === 'Space' ? '' : key}
                  active={isActive}
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
