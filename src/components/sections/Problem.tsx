'use client';

import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';

export default function Problem() {
  return (
    <section
      id="problem"
      className="section-container bg-[#0a0a0a] relative"
    >
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-gray-400">&quot;마케팅 회사가 AI를 말하고,</span>
          </h2>
          <h2 className="text-3xl md:text-5xl font-bold">
            <span className="text-gray-400">개발사가 마케팅을 모르는 시대&quot;</span>
          </h2>
        </motion.div>

        {/* Problem Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card glowColor="#ff6b6b" delay={0.1}>
            <div className="text-center">
              <div className="text-6xl mb-4">🏢</div>
              <h3 className="text-2xl font-bold text-[#ff6b6b] mb-2">마케팅 회사</h3>
              <p className="text-gray-400 text-lg">&quot;AI 도입 예정입니다&quot;</p>
              <div className="mt-4 text-gray-500">
                <p>• 피치덱만 화려</p>
                <p>• 실제 구현 능력 부재</p>
                <p>• 외주 의존</p>
              </div>
            </div>
          </Card>

          <Card glowColor="#00d4ff" delay={0.2}>
            <div className="text-center">
              <div className="text-6xl mb-4">💻</div>
              <h3 className="text-2xl font-bold text-[#00d4ff] mb-2">개발 회사</h3>
              <p className="text-gray-400 text-lg">&quot;마케팅은 몰라요&quot;</p>
              <div className="mt-4 text-gray-500">
                <p>• 기술만 있음</p>
                <p>• 시장 이해 부족</p>
                <p>• 고객 관점 미흡</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Arrow */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center mb-16"
        >
          <div className="text-4xl text-[#00ff88]">↓</div>
        </motion.div>

        {/* Solution Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative bg-gradient-to-br from-[#00ff88]/10 to-[#00d4ff]/10 rounded-2xl border-2 border-[#00ff88] p-8 text-center glow-green">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#0a0a0a] px-4">
              <span className="text-[#00ff88] font-bold">SOLUTION</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-bold text-[#fafafa] mb-4">
              어포메이션
            </h3>
            <p className="text-2xl text-[#00ff88] font-semibold">
              &quot;둘 다 압니다&quot;
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
              <span className="px-3 py-1 bg-[#00ff88]/20 rounded-full text-[#00ff88]">
                마케팅 10년+
              </span>
              <span className="px-3 py-1 bg-[#00d4ff]/20 rounded-full text-[#00d4ff]">
                AI Native 개발
              </span>
              <span className="px-3 py-1 bg-[#a78bfa]/20 rounded-full text-[#a78bfa]">
                6개 라이브 프로덕트
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
