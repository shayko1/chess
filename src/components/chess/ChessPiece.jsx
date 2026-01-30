import React from 'react';
import { motion } from 'framer-motion';

const PIECE_THEMES = {
  white: {
    king: { emoji: '🦄', name: 'מלך החד-קרן' },
    queen: { emoji: '👸', name: 'מלכת הקסם' },
    rook: { emoji: '🏰', name: 'מגדל הקסמים' },
    bishop: { emoji: '🧙‍♀️', name: 'קוסמת' },
    knight: { emoji: '🦋', name: 'פגסוס' },
    pawn: { emoji: '🌸', name: 'חד-קרן קטן' }
  },
  black: {
    king: { emoji: '🐉', name: 'מלך הדרקונים' },
    queen: { emoji: '🧝‍♀️', name: 'מלכת הצללים' },
    rook: { emoji: '🗼', name: 'מגדל האבן' },
    bishop: { emoji: '🧙', name: 'קוסם' },
    knight: { emoji: '🦅', name: 'עיט' },
    pawn: { emoji: '🔮', name: 'גביש קסום' }
  }
};

export default function ChessPiece({ piece, isSelected, onClick, isInDanger }) {
  if (!piece) return null;

  const theme = PIECE_THEMES[piece.color][piece.type];

  return (
    <motion.div
      className={`
        relative w-full h-full flex items-center justify-center cursor-pointer
        text-4xl sm:text-5xl md:text-6xl
        select-none transition-all duration-200
        ${isSelected ? 'scale-110 z-10' : ''}
        ${isInDanger ? 'animate-pulse' : ''}
      `}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Glow effect for selected piece */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-full bg-yellow-300/50 blur-md"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      )}
      
      {/* Danger indicator */}
      {isInDanger && (
        <motion.div
          className="absolute inset-0 rounded-full bg-red-400/30 blur-sm"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
        />
      )}
      
      {/* The piece itself */}
      <span className="relative z-10 drop-shadow-lg filter">
        {theme.emoji}
      </span>
    </motion.div>
  );
}

export { PIECE_THEMES };