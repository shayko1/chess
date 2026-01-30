import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Sparkles, Gamepad2, GraduationCap, Crown, Glasses } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto space-y-8"
      >
        {/* Floating Icons */}
        <div className="flex justify-center gap-8 mb-4">
          {[
            { icon: Crown, color: "text-yellow-500", delay: 0 },
            { icon: Sparkles, color: "text-purple-500", delay: 0.2 },
            { icon: GraduationCap, color: "text-blue-500", delay: 0.4 }
          ].map((item, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                delay: item.delay,
                ease: "easeInOut" 
              }}
              className={`${item.color} p-4 bg-white rounded-3xl shadow-xl shadow-purple-100/50`}
            >
              <item.icon className="w-10 h-10" />
            </motion.div>
          ))}
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 drop-shadow-sm leading-tight">
            האקדמיה הקסומה<br />לשחמט
          </h1>
          <p className="text-xl text-slate-600 max-w-lg mx-auto leading-relaxed">
            הצטרפו למסע קסום בעולם השחמט! למדו אסטרטגיות, אספו גביעים, והפכו לרבי-אמנים קסומים. ✨
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to={createPageUrl('Chess')}>
              <Button size="lg" className="h-16 px-10 text-xl rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-xl shadow-purple-300/50 border-4 border-white/20">
                <Gamepad2 className="w-6 h-6 ml-2" />
                התחל משחק עכשיו
              </Button>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to={createPageUrl('VRChess')}>
              <Button size="lg" className="h-16 px-10 text-xl rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 shadow-xl shadow-indigo-300/50 border-4 border-white/20">
                <Glasses className="w-6 h-6 ml-2" />
                שחק ב-VR
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-right">
          {[
            { title: "לימוד אינטראקטיבי", desc: "הסברים קסומים על כל כלי וכל מהלך", emoji: "📚" },
            { title: "שחקו נגד חברים", desc: "או נגד המחשב ברמות קושי שונות", emoji: "🤖" },
            { title: "אספו פרסים", desc: "זכו בגביעים ותגים מיוחדים", emoji: "🏆" }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + (i * 0.1) }}
              className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-purple-100 hover:border-purple-300 transition-colors shadow-sm"
            >
              <div className="text-4xl mb-3">{feature.emoji}</div>
              <h3 className="font-bold text-lg text-purple-900 mb-1">{feature.title}</h3>
              <p className="text-slate-500 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}