'use client';

import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import { AI_CAPABILITIES } from '@/lib/traction-data';

export default function Proof() {
  return (
    <section
      id="proof"
      className="section-container bg-[#0a0a0a] relative"
    >
      <div className="absolute inset-0 gradient-radial opacity-50" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#fafafa] mb-4">
            AI 활용 깊이
          </h2>
          <p className="text-xl text-gray-400">
            &quot;깊이는 AI가, 넓이는 인간이&quot;
          </p>
        </motion.div>

        {/* AI Capability Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {AI_CAPABILITIES.map((cap, index) => (
            <Card
              key={cap.id}
              glowColor={
                cap.id === 'opus'
                  ? '#00ff88'
                  : cap.id === 'rag'
                  ? '#00d4ff'
                  : '#a78bfa'
              }
              delay={index * 0.15}
            >
              <div className="text-center">
                <div className="text-5xl mb-4">{cap.icon}</div>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{
                    color:
                      cap.id === 'opus'
                        ? '#00ff88'
                        : cap.id === 'rag'
                        ? '#00d4ff'
                        : '#a78bfa',
                  }}
                >
                  {cap.title}
                </h3>
                <p className="text-lg text-gray-300 mb-2">{cap.subtitle}</p>
                <p className="text-sm text-gray-500">{cap.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Proof Points */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-wrap justify-center gap-4">
            {[
              { label: 'Claude Opus 4.5', color: '#00ff88' },
              { label: 'Claude Sonnet 4', color: '#00d4ff' },
              { label: 'Claude Code', color: '#a78bfa' },
              { label: 'bkit PDCA', color: '#ffd93d' },
              { label: 'RAG Pipeline', color: '#ff6b6b' },
            ].map((tech, i) => (
              <motion.span
                key={tech.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="px-4 py-2 rounded-full border text-sm font-medium"
                style={{
                  borderColor: tech.color,
                  color: tech.color,
                  backgroundColor: `${tech.color}10`,
                }}
              >
                {tech.label}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
