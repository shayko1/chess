import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PIECE_GUIDES = {
  pawn: {
    emoji: '🌸',
    title: 'הרגלי הקסום',
    story: `היי! אני הרגלי הקסום של הממלכה! 🌸

אני אולי קטן, אבל יש לי כוחות מיוחדים:

✨ אני תמיד צועד קדימה - משבצת אחת בכל פעם
🎯 בפעם הראשונה שלי, אני יכול לצעוד שתי משבצות!
⚔️ כדי לתפוס אויבים, אני זז באלכסון
👑 אם אגיע לצד השני של הלוח - אהפוך למלכה חזקה!

טיפ קסום: תשמרו עליי היטב, אני יכול להפוך לכוח הכי חזק בממלכה!`,
  },
  rook: {
    emoji: '🏰',
    title: 'מגדל הקסמים',
    story: `שלום! אני המגדל החזק של הממלכה! 🏰

אני זז רק בקווים ישרים - כמו קרני אור קסומות:

⬆️ למעלה - כמה שארצה
⬇️ למטה - עד קצה העולם
⬅️ שמאלה - בקו ישר מושלם
➡️ ימינה - ללא גבולות

⚠️ אני לא יכול לדלג מעל כלים אחרים
💪 אני מאוד חזק - אחד מהכלים החשובים בצבא!

טיפ קסום: תשתמשו בי לשמירה על העמודות החשובות בלוח!`,
  },
  bishop: {
    emoji: '🔮',
    title: 'הקוסם המרחף',
    story: `ברכות קסומות! אני הקוסם שזז באלכסון! 🔮

אני אוהב לרקוד בין המשבצות באלכסון:

↗️ למעלה-ימינה - בקפיצות אלכסוניות
↘️ למטה-ימינה - כמו מדרגות קסומות
↙️ למטה-שמאלה - בריקודים קסומים
↖️ למעלה-שמאלה - בזיגזג מושלם

🎨 כל קוסם נשאר על אותו צבע משבצות כל המשחק
✨ אני מהיר מאוד בזיזה ארוכה!

טיפ קסום: תשלבו אותי עם המגדל ליצירת כוח עצום!`,
  },
  queen: {
    emoji: '👸',
    title: 'הנסיכה החזקה',
    story: `שלום, אני הנסיכה! הכוח הכי גדול בממלכה! 👸

אני משלבת את כוחות המגדל והקוסם ביחד:

⬆️⬇️⬅️➡️ כמו המגדל - ישר לכל כיוון
↗️↘️↙️↖️ כמו הקוסם - באלכסון לכל מקום
🌟 אני יכולה לזוז כמה משבצות שארצה!
💫 אין מגבלה על התנועות שלי!

⚠️ אבל... כל הממלכה תלויה בי! אם אאבד - זה אסון!
👑 השתמשו בכוח שלי בחכמה!

טיפ קסום: אני החזקה ביותר, אבל שמרו עליי ואל תסכנו אותי מוקדם מדי!`,
  },
  knight: {
    emoji: '🦄',
    title: 'פגסוס המעופף',
    story: `נעים להכיר! אני פגסוס, הסוס הקסום המעופף! 🦄

יש לי יכולת קפיצה מיוחדת - אני קופץ בצורת "ר":

1️⃣ שתי משבצות לכיוון אחד (למעלה/למטה/ימין/שמאל)
2️⃣ ואז משבצת אחת הצידה!

✨ הכוח המיוחד שלי: אני יכול לדלג מעל כלים אחרים!
🎪 זו הופכת אותי למפתיע ביותר בקרב!
🌈 אני תמיד נוחת על צבע שונה מאשר התחלתי

טיפ קסום: תשתמשו בכוח הקפיצה שלי להפתעת האויבים!`,
  },
  king: {
    emoji: '🤴',
    title: 'המלך הקסום',
    story: `שלום, אני המלך! השליט של הממלכה! 🤴

אני זז רק צעד אחד בכל פעם:

↗️↑↖️ צעד אחד לכל כיוון
⬅️ 🤴 ➡️ משבצת אחת בלבד
↙️↓↘️ איטי אבל בטוח

👑 אני הכלי החשוב ביותר - אם אאבד, המשחק נגמר!
🛡️ תמיד תשמרו עליי עם כלים אחרים
⚠️ אל תעמידו אותי בסכנה - "שח"!

טיפ קסום: המטרה שלכם היא להגן עליי ולתפוס את המלך של האויב!`,
  },
};

export default function MagicalGuidePanel({ piece, onClose }) {
  if (!piece) return null;

  const guide = PIECE_GUIDES[piece.type];
  if (!guide) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 50, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="relative max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Magical glow background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-40" />
          
          {/* Main panel */}
          <div className="relative bg-gradient-to-br from-white via-purple-50 to-pink-50 rounded-3xl shadow-2xl border-4 border-white/60 overflow-hidden">
            {/* Sparkle decoration */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-purple-200/30 to-transparent" />
            
            {/* Close button */}
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="absolute top-4 left-4 z-10 bg-white/50 hover:bg-white/80 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Header with emoji */}
            <div className="relative pt-8 pb-4 text-center">
              <motion.div
                className="text-8xl mb-3 inline-block"
                animate={{ 
                  rotate: [0, -5, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >
                {guide.emoji}
              </motion.div>
              
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <h2 
                  className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"
                  style={{ fontFamily: "'Varela Round', 'Assistant', sans-serif" }}
                >
                  {guide.title}
                </h2>
                <Sparkles className="w-5 h-5 text-pink-500" />
              </div>
            </div>

            {/* Story content */}
            <div className="px-6 pb-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border-2 border-purple-200/50 shadow-inner">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  <span className="font-bold text-purple-900">הסיפור הקסום:</span>
                </div>
                
                <div 
                  className="text-purple-900 leading-relaxed whitespace-pre-line text-sm"
                  style={{ fontFamily: "'Varela Round', 'Assistant', sans-serif" }}
                >
                  {guide.story}
                </div>
              </div>

              {/* Action button */}
              <motion.button
                onClick={onClose}
                className="w-full mt-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-2xl shadow-lg"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                style={{ fontFamily: "'Varela Round', 'Assistant', sans-serif" }}
              >
                הבנתי! בואו נשחק! ✨
              </motion.button>
            </div>

            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                style={{
                  left: `${10 + i * 15}%`,
                  bottom: `${20 + (i % 3) * 20}%`,
                }}
                animate={{
                  y: [0, -15, 0],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 2 + i * 0.3,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}