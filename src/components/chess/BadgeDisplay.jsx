import React from 'react';
import { motion } from 'framer-motion';

const BADGES = {
  first_win: { emoji: '🏆', name: 'ניצחון ראשון', description: 'ניצחת במשחק הראשון!' },
  captured_queen: { emoji: '👸', name: 'לוכד המלכה', description: 'לכדת מלכה!' },
  three_days: { emoji: '🔥', name: '3 ימים רצופים', description: 'שיחקת 3 ימים ברצף!' },
  five_wins: { emoji: '⭐', name: '5 נצחונות', description: '5 נצחונות!' },
  ten_games: { emoji: '🎮', name: '10 משחקים', description: 'שיחקת 10 משחקים!' },
  knight_master: { emoji: '🦋', name: 'אלוף הפגסוס', description: 'לכדת עם פגסוס!' },
  checkmate_master: { emoji: '♟️', name: 'מאסטר שח מט', description: 'עשית שח מט!' },
  protector: { emoji: '🛡️', name: 'מגן המלך', description: 'הגנת על המלך מ-5 שחים!' },
  seven_days: { emoji: '🌟', name: 'שבוע קסום', description: 'שיחקת שבוע ברצף!' },
  twenty_wins: { emoji: '👑', name: 'מלך השחמט', description: '20 נצחונות!' }
};

export default function BadgeDisplay({ badges = [], showAll = false }) {
  const displayBadges = showAll 
    ? Object.keys(BADGES) 
    : badges;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3" dir="rtl">
      {displayBadges.map((badgeId, index) => {
        const badge = BADGES[badgeId];
        if (!badge) return null;

        const isLocked = showAll && !badges.includes(badgeId);

        return (
          <motion.div
            key={badgeId}
            className={`
              relative p-3 rounded-xl text-center transition-all
              ${isLocked 
                ? 'bg-gray-100 opacity-50' 
                : 'bg-gradient-to-br from-purple-100 to-pink-100 shadow-md'}
            `}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: isLocked ? 1 : 1.05 }}
          >
            <div className={`text-4xl mb-2 ${isLocked ? 'grayscale' : ''}`}>
              {badge.emoji}
            </div>
            <div className={`font-bold text-sm ${isLocked ? 'text-gray-400' : 'text-purple-800'}`}>
              {badge.name}
            </div>
            <div className={`text-xs mt-1 ${isLocked ? 'text-gray-400' : 'text-purple-600'}`}>
              {badge.description}
            </div>
            {isLocked && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl">🔒</span>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

export { BADGES };