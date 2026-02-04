import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Zap, Globe } from 'lucide-react';

export default function GameModeSelector({ mode, onChange, showHints = true }) {
  return (
    <div className="flex gap-4 justify-center flex-wrap" dir="rtl">
      {showHints && (
        <motion.button
            className={`
            flex flex-col items-center gap-4 p-8 rounded-[2rem] transition-all min-w-[200px] border-2 relative overflow-hidden group
            ${mode === 'learning'
              ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white border-white shadow-[0_20px_40px_rgba(16,185,129,0.3)] scale-110 rotate-1'
              : 'bg-white/90 backdrop-blur-md text-gray-600 border-white hover:bg-white hover:scale-105 hover:shadow-xl'}
          `}
          onClick={() => onChange('learning')}
          whileHover={{ scale: mode === 'learning' ? 1.12 : 1.05, y: -8 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Shine effect */}
          {mode === 'learning' && (
             <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
          )}
          
          {/* Recommended Badge */}
          <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-sm rotate-12">
            מומלץ! ⭐
          </div>

          <div className={`
            p-4 rounded-full shadow-inner
            ${mode === 'learning' ? 'bg-white/25 text-white ring-4 ring-white/30' : 'bg-emerald-100 text-emerald-600'}
          `}>
            <BookOpen className="w-10 h-10" />
          </div>
          <div className="text-center relative z-10">
            <span className="font-black text-2xl block mb-2">מצב למידה</span>
            <span className={`text-sm font-bold ${mode === 'learning' ? 'text-emerald-50' : 'text-gray-400'}`}>
              עם רמזים ועזרה 🧚‍♀️
            </span>
          </div>
        </motion.button>
      )}

      <motion.button
        className={`
          flex flex-col items-center gap-4 p-8 rounded-[2rem] transition-all min-w-[200px] border-2 relative overflow-hidden group
          ${mode === 'pro'
            ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-white shadow-[0_20px_40px_rgba(99,102,241,0.3)] scale-110 -rotate-1'
            : 'bg-white/90 backdrop-blur-md text-gray-600 border-white hover:bg-white hover:scale-105 hover:shadow-xl'}
        `}
        onClick={() => onChange('pro')}
        whileHover={{ scale: mode === 'pro' ? 1.12 : 1.05, y: -8 }}
        whileTap={{ scale: 0.95 }}
      >
        {mode === 'pro' && (
             <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
        )}

        <div className={`
          p-4 rounded-full shadow-inner
          ${mode === 'pro' ? 'bg-white/25 text-white ring-4 ring-white/30' : 'bg-purple-100 text-purple-600'}
        `}>
          <Zap className="w-10 h-10" />
        </div>
        <div className="text-center relative z-10">
          <span className="font-black text-2xl block mb-2">מצב מקצועי</span>
          <span className={`text-sm font-bold ${mode === 'pro' ? 'text-indigo-100' : 'text-gray-400'}`}>
            אתגר אמיתי ⚡
          </span>
        </div>
      </motion.button>

      <motion.button
        className={`
          flex flex-col items-center gap-4 p-8 rounded-[2rem] transition-all min-w-[200px] border-2 relative overflow-hidden group
          ${mode === 'online'
            ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-white shadow-[0_20px_40px_rgba(59,130,246,0.3)] scale-110'
            : 'bg-white/90 backdrop-blur-md text-gray-600 border-white hover:bg-white hover:scale-105 hover:shadow-xl'}
        `}
        onClick={() => onChange('online')}
        whileHover={{ scale: mode === 'online' ? 1.12 : 1.05, y: -8 }}
        whileTap={{ scale: 0.95 }}
      >
        {mode === 'online' && (
             <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
        )}

        <div className={`
          p-4 rounded-full shadow-inner
          ${mode === 'online' ? 'bg-white/25 text-white ring-4 ring-white/30' : 'bg-blue-100 text-blue-600'}
        `}>
          <Globe className="w-10 h-10" />
        </div>
        <div className="text-center relative z-10">
          <span className="font-black text-2xl block mb-2">משחק אונליין</span>
          <span className={`text-sm font-bold ${mode === 'online' ? 'text-cyan-100' : 'text-gray-400'}`}>
            שחק נגד חבר 🌐
          </span>
        </div>
      </motion.button>
    </div>
  );
}