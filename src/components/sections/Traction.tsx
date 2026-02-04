'use client';

import { motion } from 'framer-motion';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { TRACTION_METRICS } from '@/lib/traction-data';

export default function Traction() {
  const colors = ['#00ff88', '#00d4ff', '#ffd93d', '#a78bfa'];

  return (
    <section
      id="traction"
      className="section-container bg-[#0d0d0d] relative"
    >
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#fafafa] mb-4">
            Traction
          </h2>
          <p className="text-xl text-gray-400">
            피치덱이 아니라 대시보드로
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {TRACTION_METRICS.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative bg-[#1a1a1a] rounded-2xl border border-[#333] p-6 md:p-8 text-center overflow-hidden group"
              style={{
                boxShadow: `0 0 0 rgba(0,0,0,0)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 30px ${colors[index]}30`;
                e.currentTarget.style.borderColor = colors[index];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0 rgba(0,0,0,0)`;
                e.currentTarget.style.borderColor = '#333';
              }}
            >
              {/* Background Glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at center, ${colors[index]}10 0%, transparent 70%)`,
                }}
              />

              {/* Content */}
              <div className="relative z-10">
                <AnimatedCounter
                  value={metric.value}
                  suffix={metric.suffix}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold block"
                  duration={2}
                />
                <div
                  className="text-lg md:text-xl font-semibold mt-2"
                  style={{ color: colors[index] }}
                >
                  {metric.label}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {metric.description}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <blockquote className="text-2xl md:text-3xl font-light text-gray-400 italic">
            &quot;지금, 이미 움직이고 있는가?&quot;
          </blockquote>
          <p className="text-[#00ff88] font-bold text-xl mt-4">
            → YES.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
