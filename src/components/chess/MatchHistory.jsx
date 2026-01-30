import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar } from 'lucide-react';

export default function MatchHistory({ matches = [] }) {
  if (matches.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500" dir="rtl">
        <p className="text-lg">עדיין אין היסטוריית משחקים</p>
        <p className="text-sm mt-2">התחילו לשחק כדי לראות את ההיסטוריה שלכם! 🦄</p>
      </div>
    );
  }

  return (
    <div className="space-y-3" dir="rtl">
      {matches.map((match, index) => (
        <motion.div
          key={match.id}
          className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">
                {match.winner === 'draw' ? '🤝' : '🏆'}
              </div>
              <div>
                <div className="font-bold text-purple-800">
                  {match.winner === 'draw' 
                    ? 'תיקו' 
                    : `${match.winner_name} ניצח!`}
                </div>
                <div className="text-sm text-gray-600">
                  {match.white_player_name} 🆚 {match.black_player_name}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(match.created_date).toLocaleDateString('he-IL')}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}