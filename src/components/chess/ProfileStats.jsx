import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Target, Flame } from 'lucide-react';

export default function ProfileStats({ profile }) {
  if (!profile) return null;

  const totalGames = (profile.wins || 0) + (profile.losses || 0) + (profile.draws || 0);
  const winRate = totalGames > 0 ? Math.round((profile.wins / totalGames) * 100) : 0;

  const stats = [
    { icon: Trophy, label: 'נצחונות', value: profile.wins || 0, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    { icon: Target, label: 'הפסדים', value: profile.losses || 0, color: 'text-red-500', bg: 'bg-red-100' },
    { icon: TrendingUp, label: 'תיקו', value: profile.draws || 0, color: 'text-blue-500', bg: 'bg-blue-100' },
    { icon: Flame, label: 'ימים רצופים', value: profile.consecutive_days || 0, color: 'text-orange-500', bg: 'bg-orange-100' }
  ];

  return (
    <div className="space-y-4" dir="rtl">
      <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 text-center">
        <div className="text-6xl mb-3">{profile.avatar}</div>
        <h2 className="text-2xl font-bold text-purple-800 mb-1">{profile.name}</h2>
        <div className="text-lg text-purple-600">
          אחוז ניצחונות: <span className="font-bold">{winRate}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-white rounded-xl p-4 shadow-md"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={`${stat.bg} w-12 h-12 rounded-full flex items-center justify-center mb-2 mx-auto`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-800">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}