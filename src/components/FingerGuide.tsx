import React from 'react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

type Finger = 
  | 'lp' | 'lr' | 'lm' | 'li' | 'lt' // Left: pinky, ring, middle, index, thumb
  | 'rp' | 'rr' | 'rm' | 'ri' | 'rt'; // Right: pinky, ring, middle, index, thumb

interface FingerGuideProps {
  activeFinger?: Finger;
}

const getFingerLabel = (finger: Finger) => {
  switch(finger) {
    case 'lp': return 'Left Pinky';
    case 'lr': return 'Left Ring';
    case 'lm': return 'Left Middle';
    case 'li': return 'Left Index';
    case 'lt': return 'Left Thumb';
    case 'rp': return 'Right Pinky';
    case 'rr': return 'Right Ring';
    case 'rm': return 'Right Middle';
    case 'ri': return 'Right Index';
    case 'rt': return 'Right Thumb';
  }
}

export const FingerGuide: React.FC<FingerGuideProps> = ({ activeFinger }) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Next Finger</div>
      <div className="relative">
        {/* Schematic Hand Visualization */}
        <svg width="160" height="auto" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          {/* Left Hand */}
          <g className="opacity-20 transition-opacity">
            <rect x="10" y="40" width="12" height="30" rx="6" fill={activeFinger === 'lp' ? '#EAB308' : '#3f3f46'} className={activeFinger === 'lp' ? 'opacity-100' : ''} />
            <rect x="25" y="30" width="12" height="40" rx="6" fill={activeFinger === 'lr' ? '#EAB308' : '#3f3f46'} />
            <rect x="40" y="25" width="12" height="45" rx="6" fill={activeFinger === 'lm' ? '#EAB308' : '#3f3f46'} />
            <rect x="55" y="32" width="12" height="38" rx="6" fill={activeFinger === 'li' ? '#EAB308' : '#3f3f46'} />
            <rect x="70" y="55" width="12" height="25" rx="6" fill={activeFinger === 'lt' ? '#EAB308' : '#3f3f46'} />
          </g>
          {/* Right Hand */}
          <g className="opacity-20 transition-opacity">
            <rect x="110" y="55" width="12" height="25" rx="6" fill={activeFinger === 'rt' ? '#EAB308' : '#3f3f46'} />
            <rect x="125" y="32" width="12" height="38" rx="6" fill={activeFinger === 'ri' ? '#EAB308' : '#3f3f46'} />
            <rect x="140" y="25" width="12" height="45" rx="6" fill={activeFinger === 'rm' ? '#EAB308' : '#3f3f46'} />
            <rect x="155" y="30" width="12" height="40" rx="6" fill={activeFinger === 'rr' ? '#EAB308' : '#3f3f46'} />
            <rect x="170" y="40" width="12" height="30" rx="6" fill={activeFinger === 'rp' ? '#EAB308' : '#3f3f46'} />
          </g>

          {/* Active indicator */}
          {activeFinger && (
            <motion.circle 
              initial={{ r: 0 }}
              animate={{ r: 6 }}
              cx={
                activeFinger === 'lp' ? 16 :
                activeFinger === 'lr' ? 31 :
                activeFinger === 'lm' ? 46 :
                activeFinger === 'li' ? 61 :
                activeFinger === 'lt' ? 76 :
                activeFinger === 'rt' ? 116 :
                activeFinger === 'ri' ? 131 :
                activeFinger === 'rm' ? 146 :
                activeFinger === 'rr' ? 161 : 176
              }
              cy={
                activeFinger === 'lp' ? 45 :
                activeFinger === 'lr' ? 35 :
                activeFinger === 'lm' ? 30 :
                activeFinger === 'li' ? 37 :
                activeFinger === 'lt' ? 60 :
                activeFinger === 'rt' ? 60 :
                activeFinger === 'ri' ? 37 :
                activeFinger === 'rm' ? 30 :
                activeFinger === 'rr' ? 35 : 45
              }
              fill="#EAB308"
              className="animate-pulse shadow-[0_0_15px_rgba(234,179,8,0.5)]"
            />
          )}
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center pt-24">
           <AnimatePresence mode="wait">
            <motion.span 
              key={activeFinger}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-bold text-yellow-500 uppercase tracking-tighter"
            >
              {activeFinger ? getFingerLabel(activeFinger) : ''}
            </motion.span>
           </AnimatePresence>
        </div>
      </div>
      <p className="text-[10px] text-zinc-500 max-w-[150px] leading-relaxed">
        {activeFinger ? "Recommended position for optimal velocity." : "Place hands in home row position."}
      </p>
    </div>
  );
};

