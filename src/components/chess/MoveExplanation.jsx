import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function MoveExplanation({ message, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-6 max-w-md shadow-2xl border-4 border-purple-300"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="text-4xl">💡</div>
          <button
            onClick={onClose}
            className="text-purple-600 hover:text-purple-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="text-center">
          <h3 className="text-xl font-bold text-purple-800 mb-3">
            טיפ קסום! ✨
          </h3>
          <p className="text-lg text-purple-700 leading-relaxed">
            {message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
        >
          הבנתי! 🦄
        </button>
      </motion.div>
    </motion.div>
  );
}