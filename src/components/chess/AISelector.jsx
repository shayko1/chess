import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, Flame, Zap } from 'lucide-react';

const AI_LEVELS = [
  { 
    id: 'easy', 
    name: 'קל', 
    emoji: '😊', 
    icon: Sparkles,
    color: 'from-green-400 to-emerald-500',
    description: 'מושלם למתחילים'
  },
  { 
    id: 'medium', 
    name: 'בינוני', 
    emoji: '🤔', 
    icon: Flame,
    color: 'from-orange-400 to-red-500',
    description: 'אתגר ממוצע'
  },
  { 
    id: 'hard', 
    name: 'קשה', 
    emoji: '🧙‍♂️', 
    icon: Zap,
    color: 'from-purple-600 to-indigo-700',
    description: 'רק למומחים!'
  }
];

export default function AISelector({ selectedLevel, onSelect }) {
  return (
    <div className="bg-white/40 backdrop-blur-md border border-white/40 p-5 rounded-3xl shadow-xl relative overflow-hidden" dir="rtl">
       {/* Ambient Light */}
       <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-400/20 blur-3xl rounded-full pointer-events-none" />

      <div className="flex items-center gap-2 mb-5 justify-center relative z-10">
        <div className="bg-white/80 p-2 rounded-full shadow-sm">
          <Bot className="w-6 h-6 text-indigo-600" />
        </div>
        <h3 className="font-bold text-indigo-900 text-lg drop-shadow-sm">מי יתחרה בך?</h3>
      </div>
      
      <div className="grid grid-cols-3 gap-3 relative z-10">
        {AI_LEVELS.map(level => {
          const Icon = level.icon;
          const isSelected = selectedLevel === level.id;
          
          return (
            <motion.button
              key={level.id}
              className={`
                flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border
                ${isSelected 
                  ? `bg-gradient-to-b ${level.color} text-white border-white/40 shadow-[0_0_20px_rgba(139,92,246,0.4)] scale-105 ring-2 ring-white/30` 
                  : 'bg-white/60 text-indigo-900 border-white/50 hover:bg-white/90 hover:shadow-lg'}
              `}
              onClick={() => onSelect(level.id)}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`text-4xl filter ${isSelected ? 'drop-shadow-md' : 'grayscale-[0.3]'}`}>{level.emoji}</div>
              
              <div className="text-center">
                <span className="font-bold block text-base mb-0.5">{level.name}</span>
                <span className={`text-[10px] leading-tight block ${isSelected ? 'text-white/90' : 'text-indigo-900/60'}`}>
                  {level.description}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export { AI_LEVELS };