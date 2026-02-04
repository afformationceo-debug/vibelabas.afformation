'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

export default function Vision() {
  return (
    <section
      id="vision"
      className="section-container bg-[#0a0a0a] relative overflow-hidden"
    >
      {/* Background Effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-[#00ff88]/5 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00ff88]/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Main Quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-[#fafafa] mb-6">
            &quot;8주 후,
            <br />
            <span className="text-[#00ff88]">ARR</span>이 말해줄 것입니다&quot;
          </h2>
          <p className="text-xl md:text-2xl text-gray-400">
            Demo는 피치덱이 아니라 <span className="text-[#00d4ff]">대시보드</span>로
          </p>
        </motion.div>

        {/* Hashed Philosophy Match */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-[#1a1a1a] rounded-2xl border border-[#333] p-8 mb-12"
        >
          <h3 className="text-lg font-bold text-[#00ff88] mb-6 uppercase tracking-wider">
            Hashed Vibe Labs 철학과의 일치
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            {[
              { hashed: '아이디어가 아닌, 속도', us: '48시간 내 기획~배포' },
              { hashed: '설명이 아닌, 결과물', us: '이 랜딩페이지가 증거' },
              { hashed: 'AI 활용 깊이', us: 'Claude Opus 4.5 실전 적용' },
              { hashed: '유저 반응', us: '6개 라이브 프로덕트' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-[#0a0a0a] rounded-lg p-4"
              >
                <span className="text-[#00ff88] mt-1">✓</span>
                <div>
                  <p className="text-gray-400 text-sm">{item.hashed}</p>
                  <p className="text-[#fafafa] font-medium">{item.us}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-6"
        >
          <Button
            href="https://vibelabs.hashed.com"
            variant="primary"
            size="lg"
            glow
            className="text-lg px-12"
          >
            Apply to Hashed Vibe Labs
          </Button>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <a
              href="https://afformation.co.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00ff88] transition-colors"
            >
              afformation.co.kr
            </a>
            <span>•</span>
            <a
              href="mailto:contact@afformation.co.kr"
              className="hover:text-[#00ff88] transition-colors"
            >
              contact@afformation.co.kr
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
