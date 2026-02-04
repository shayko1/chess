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
                flex flex-col items-center gap-4 p-6 rounded-[1.5rem] transition-all border-2
                ${isSelected 
                  ? `bg-gradient-to-b ${level.color} text-white border-white shadow-[0_10px_30px_rgba(139,92,246,0.3)] scale-110 ring-4 ring-white/30` 
                  : 'bg-white/80 text-indigo-900 border-white hover:bg-white hover:scale-105 hover:shadow-xl'}
              `}
              onClick={() => onSelect(level.id)}
              whileHover={{ scale: isSelected ? 1.12 : 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`text-6xl filter transition-all duration-300 ${isSelected ? 'drop-shadow-lg scale-110 rotate-6' : 'grayscale-[0.5]'}`}>{level.emoji}</div>
              
              <div className="text-center">
                <span className="font-black block text-xl mb-1">{level.name}</span>
                <span className={`text-xs font-bold leading-tight block ${isSelected ? 'text-white/90' : 'text-indigo-900/60'}`}>
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