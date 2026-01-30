import React from 'react';
import { motion } from 'framer-motion';

export default function Sparkles() {
  const sparkles = [
    { x: -20, y: -20, delay: 0 },
    { x: 20, y: -20, delay: 0.1 },
    { x: -20, y: 20, delay: 0.2 },
    { x: 20, y: 20, delay: 0.3 },
    { x: 0, y: -30, delay: 0.15 },
    { x: 0, y: 30, delay: 0.25 },
    { x: -30, y: 0, delay: 0.05 },
    { x: 30, y: 0, delay: 0.35 }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {sparkles.map((sparkle, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 text-yellow-400 text-2xl"
          initial={{ 
            x: 0, 
            y: 0, 
            scale: 0, 
            opacity: 0 
          }}
          animate={{ 
            x: sparkle.x, 
            y: sparkle.y, 
            scale: [0, 1.5, 0], 
            opacity: [0, 1, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            delay: sparkle.delay, 
            duration: 0.8,
            ease: "easeOut"
          }}
        >
          ✨
        </motion.div>
      ))}
    </div>
  );
}