import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Zap, Globe } from 'lucide-react';

export default function GameModeSelector({ mode, onChange, showHints = true }) {
  return (
    <div className="flex gap-4 justify-center flex-wrap" dir="rtl">
      {showHints && (
        <motion.button
          className={`
            flex flex-col items-center gap-3 p-5 rounded-3xl transition-all min-w-[150px] border relative overflow-hidden group
            ${mode === 'learning'
              ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white border-white/40 shadow-[0_10px_20px_rgba(16,185,129,0.3)] scale-105'
              : 'bg-white/80 backdrop-blur-sm text-gray-600 border-white/50 hover:bg-white'}
          `}
          onClick={() => onChange('learning')}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Shine effect */}
          {mode === 'learning' && (
             <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
          )}

          <div className={`
            p-3 rounded-2xl shadow-sm
            ${mode === 'learning' ? 'bg-white/25 text-white ring-2 ring-white/30' : 'bg-emerald-100 text-emerald-600'}
          `}>
            <BookOpen className="w-7 h-7" />
          </div>
          <div className="text-center relative z-10">
            <span className="font-bold text-xl block mb-1">מצב למידה</span>
            <span className={`text-xs font-medium ${mode === 'learning' ? 'text-emerald-100' : 'text-gray-400'}`}>
              עם רמזים ועזרה 🧚‍♀️
            </span>
          </div>
        </motion.button>
      )}

      <motion.button
        className={`
          flex flex-col items-center gap-3 p-5 rounded-3xl transition-all min-w-[150px] border relative overflow-hidden group
          ${mode === 'pro'
            ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-white/40 shadow-[0_10px_20px_rgba(99,102,241,0.3)] scale-105'
            : 'bg-white/80 backdrop-blur-sm text-gray-600 border-white/50 hover:bg-white'}
        `}
        onClick={() => onChange('pro')}
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        {mode === 'pro' && (
             <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
        )}

        <div className={`
          p-3 rounded-2xl shadow-sm
          ${mode === 'pro' ? 'bg-white/25 text-white ring-2 ring-white/30' : 'bg-purple-100 text-purple-600'}
        `}>
          <Zap className="w-7 h-7" />
        </div>
        <div className="text-center relative z-10">
          <span className="font-bold text-xl block mb-1">מצב מקצועי</span>
          <span className={`text-xs font-medium ${mode === 'pro' ? 'text-indigo-100' : 'text-gray-400'}`}>
            אתגר אמיתי ⚡
          </span>
        </div>
      </motion.button>

      <motion.button
        className={`
          flex flex-col items-center gap-3 p-5 rounded-3xl transition-all min-w-[150px] border relative overflow-hidden group
          ${mode === 'online'
            ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-white/40 shadow-[0_10px_20px_rgba(59,130,246,0.3)] scale-105'
            : 'bg-white/80 backdrop-blur-sm text-gray-600 border-white/50 hover:bg-white'}
        `}
        onClick={() => onChange('online')}
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        {mode === 'online' && (
             <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
        )}

        <div className={`
          p-3 rounded-2xl shadow-sm
          ${mode === 'online' ? 'bg-white/25 text-white ring-2 ring-white/30' : 'bg-blue-100 text-blue-600'}
        `}>
          <Globe className="w-7 h-7" />
        </div>
        <div className="text-center relative z-10">
          <span className="font-bold text-xl block mb-1">משחק אונליין</span>
          <span className={`text-xs font-medium ${mode === 'online' ? 'text-cyan-100' : 'text-gray-400'}`}>
            שחק נגד חבר 🌐
          </span>
        </div>
      </motion.button>
    </div>
  );
}