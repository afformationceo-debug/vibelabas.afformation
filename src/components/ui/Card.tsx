'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  hover?: boolean;
  delay?: number;
}

export default function Card({
  children,
  className = '',
  glowColor = '#00ff88',
  hover = true,
  delay = 0,
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { y: -8, scale: 1.02 } : {}}
      className={`
        relative bg-[#1a1a1a] rounded-xl border border-[#333] p-6
        transition-shadow duration-300
        ${hover ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        boxShadow: hover
          ? `0 0 0 rgba(${glowColor}, 0)`
          : `0 0 20px ${glowColor}20`,
      }}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.boxShadow = `0 0 30px ${glowColor}40, 0 20px 40px rgba(0,0,0,0.3)`;
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.boxShadow = `0 0 0 rgba(${glowColor}, 0)`;
        }
      }}
    >
      {children}
    </motion.div>
  );
}
