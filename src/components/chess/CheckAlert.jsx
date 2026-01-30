import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function CheckAlert({ onClose }) {
  return (
    <motion.div
      className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      dir="rtl"
    >
      <motion.div
        className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border-4 border-red-300"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 1 }}
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
        >
          <AlertTriangle className="w-8 h-8" />
        </motion.div>
        <div>
          <div className="text-xl font-bold">שח! 👑⚠️</div>
          <div className="text-sm">המלך שלך בסכנה! הגן עליו!</div>
        </div>
      </motion.div>
    </motion.div>
  );
}