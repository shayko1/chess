import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Sparkles as SparklesIcon } from 'lucide-react';

const VICTORY_MESSAGES = [
  'ניצחון מדהים! 🎉',
  'אלוף שחמט! 👑',
  'משחק מעולה! ⭐',
  'וואו! מה כשרון! 🦄',
  'המלך גאה בך! 🏆'
];

const DRAW_MESSAGES = [
  'תיקו! משחק מאוזן! 🤝',
  'שניכם שיחקתם מעולה! ⚖️',
  'מצוין! תיקו הוגן! ✨'
];

export default function VictoryScreen({ winner, isDraw, onClose }) {
  const [message] = useState(
    isDraw 
      ? DRAW_MESSAGES[Math.floor(Math.random() * DRAW_MESSAGES.length)]
      : VICTORY_MESSAGES[Math.floor(Math.random() * VICTORY_MESSAGES.length)]
  );

  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    const particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2
      });
    }
    setConfetti(particles);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      dir="rtl"
    >
      {/* Confetti */}
      {confetti.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute top-0 text-2xl"
          style={{ left: `${particle.x}%` }}
          initial={{ y: -50, opacity: 0 }}
          animate={{ 
            y: window.innerHeight + 100, 
            opacity: [0, 1, 1, 0],
            rotate: [0, 360]
          }}
          transition={{ 
            delay: particle.delay,
            duration: particle.duration,
            ease: "linear"
          }}
        >
          {['🎉', '✨', '⭐', '🦄', '👑'][Math.floor(Math.random() * 5)]}
        </motion.div>
      ))}

      <motion.div
        className="bg-gradient-to-br from-purple-100 via-pink-100 to-purple-100 rounded-3xl p-8 max-w-lg w-full shadow-2xl border-4 border-purple-300"
        initial={{ scale: 0.5, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0.5, rotate: 10 }}
      >
        <motion.div
          className="text-center"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="text-7xl mb-4">
            {isDraw ? '🤝' : '🏆'}
          </div>
        </motion.div>

        <h2 className="text-4xl font-bold text-purple-800 text-center mb-4">
          {message}
        </h2>

        {!isDraw && (
          <div className="bg-white/70 rounded-2xl p-4 mb-6 text-center">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-purple-700">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <span>{winner} ניצח!</span>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        )}

        {isDraw && (
          <div className="bg-white/70 rounded-2xl p-4 mb-6 text-center">
            <div className="text-xl font-bold text-purple-700">
              משחק מדהים לשניכם! 🌟
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <motion.button
            onClick={onClose}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg col-span-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center justify-center gap-2">
              <SparklesIcon className="w-5 h-5" />
              <span>משחק חדש</span>
              <SparklesIcon className="w-5 h-5" />
            </div>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}