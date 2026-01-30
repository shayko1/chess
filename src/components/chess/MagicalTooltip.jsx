import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const PIECE_INFO = {
  pawn: { 
    name: 'רגלי קסום', 
    fact: 'הרגלי הוא החייל הקטן שיכול להפוך למלכה אם יגיע לצד השני!' 
  },
  rook: { 
    name: 'מגדל הקסמים', 
    fact: 'המגדל זז בקווים ישרים - הוא השומר החזק של הממלכה!' 
  },
  bishop: { 
    name: 'קוסם באלכסון', 
    fact: 'הקוסם תמיד זז באלכסון - הוא אוהב לרקוד בין המשבצות!' 
  },
  queen: { 
    name: 'הנסיכה החזקה', 
    fact: 'הנסיכה היא הכי חזקה! היא יכולה לזוז לכל כיוון ככל שהיא רוצה!' 
  },
  knight: { 
    name: 'פגסוס המעופף', 
    fact: 'זהו פגסוס! הסוס המעופף שיכול לדלג מעל כולם בצורת "ר"!' 
  },
  king: { 
    name: 'המלך הקסום', 
    fact: 'המלך צריך הגנה! הוא יכול לזוז רק צעד אחד לכל כיוון.' 
  }
};

export default function MagicalTooltip({ piece, position, squarePosition }) {
  const info = piece ? PIECE_INFO[piece.type] : null;
  const colorName = piece?.color === 'white' ? 'הצבא הלבן' : 'הצבא השחור';
  
  const cols = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח'];
  const coordinate = squarePosition ? `${cols[squarePosition.col]}${8 - squarePosition.row}` : null;

  return (
    <AnimatePresence>
      {(piece || squarePosition) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute z-50 pointer-events-none"
          style={{
            left: position.x + 20,
            top: position.y - 10,
          }}
        >
          <div className="relative">
            {/* Magical glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur-xl opacity-60" />
            
            {/* Tooltip content */}
            <div className="relative bg-gradient-to-br from-white/95 to-purple-50/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl border-2 border-white/50 min-w-[200px]">
              {piece ? (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span className="font-black text-purple-900 text-sm">
                      {info?.name}
                    </span>
                  </div>
                  <div className="text-xs text-purple-700 leading-relaxed mb-1">
                    {info?.fact}
                  </div>
                  <div className="text-[10px] text-purple-500 font-semibold">
                    {colorName} ✨
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <div className="text-xs text-purple-700 font-bold">
                    משבצת ריקה
                  </div>
                  <div className="text-[10px] text-purple-500">
                    ({coordinate})
                  </div>
                </div>
              )}
              
              {/* Magical particles */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping" />
              <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-pink-300 rounded-full animate-pulse" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}