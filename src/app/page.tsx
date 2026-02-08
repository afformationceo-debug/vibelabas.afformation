'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, useInView } from 'framer-motion';

// 동적 임포트
const WorldSceneV2 = dynamic(() => import('@/components/3d/WorldSceneV2'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black" />,
});

const TerminalChat = dynamic(() => import('@/components/terminal/TerminalChat'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#0a0a0a] rounded-lg border border-[#222] flex items-center justify-center">
      <span className="text-[#00ff88] font-mono animate-pulse">Loading terminal...</span>
    </div>
  ),
});

const TeamGraph = dynamic(() => import('@/components/sections/TeamGraph'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-[#0a0a0a] flex items-center justify-center">
      <span className="text-[#c084fc] font-mono animate-pulse">Loading team graph...</span>
    </div>
  ),
});

const ProductJourney = dynamic(() => import('@/components/journey/ProductJourney'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[700px] bg-[#0a0a0a] flex items-center justify-center">
      <span className="text-[#00ff88] font-mono animate-pulse">Loading journey graph...</span>
    </div>
  ),
});

const JourneyTimeline = dynamic(() => import('@/components/journey/JourneyTimeline'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <span className="text-[#00ff88] font-mono animate-pulse">Loading story...</span>
    </div>
  ),
});

// ============================================
// VISUAL EFFECTS
// ============================================

function ScanLines() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.1) 2px, rgba(0,255,136,0.1) 4px)',
      }} />
      <motion.div
        className="absolute left-0 right-0 h-[100px]"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(0,255,136,0.02) 50%, transparent)' }}
        animate={{ y: ['0vh', '100vh'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

function NeonDivider({ color = '#00ff88' }: { color?: string }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      transition={{ duration: 1 }}
      className="h-[1px] w-full max-w-md mx-auto my-8"
      style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)`, boxShadow: `0 0 20px ${color}40` }}
    />
  );
}

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const timer = setInterval(() => {
      start += Math.ceil(value / 30);
      if (start >= value) { setCount(value); clearInterval(timer); }
      else { setCount(start); }
    }, 50);
    return () => clearInterval(timer);
  }, [value, isInView]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ============================================
// HERO SECTION (터미널 UI)
// ============================================

function HeroTerminalSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col overflow-hidden">
      {/* 3D 배경 */}
      <div className="absolute inset-0 z-0">
        <WorldSceneV2 />
      </div>
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/80 via-black/60 to-black" />

      {/* 상단 헤더 */}
      <div className="relative z-10 flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b border-[#222]/50">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-[#00ff88] to-[#00d4ff] flex items-center justify-center flex-shrink-0">
            <span className="text-black font-bold text-[10px] sm:text-xs">AF</span>
          </div>
          <span className="text-white font-bold text-sm sm:text-base">AFFORMATION</span>
          <span className="text-gray-500 text-sm hidden md:inline">— Hashed Vibe Labs 2026</span>
        </div>
        <div className="flex items-center">
          <a href="https://afformation.co.kr" target="_blank" rel="noopener noreferrer"
             className="text-gray-400 hover:text-[#00ff88] text-xs sm:text-sm transition-colors">
            afformation.co.kr
          </a>
        </div>
      </div>

      {/* 터미널 영역 */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-2 sm:p-4 md:p-8">
        <div className="w-full max-w-4xl h-[60vh] sm:h-[70vh] max-h-[600px]">
          <TerminalChat onNavigate={scrollToSection} />
        </div>
      </div>

      {/* 스크롤 안내 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="relative z-10 flex flex-col items-center pb-8"
      >
        <span className="text-gray-500 font-mono text-xs mb-2">스크롤하여 전체 여정 보기</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-[#00ff88] text-2xl"
        >
          ↓
        </motion.div>
      </motion.div>
    </section>
  );
}

// ============================================
// JOURNEY INTRO SECTION
// ============================================

function JourneyIntroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      id="journey-intro"
      className="relative py-16 sm:py-24 md:py-32 bg-gradient-to-b from-black via-[#050505] to-black overflow-hidden"
    >
      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, #00ff88 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
      }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[#00ff88] font-mono text-sm tracking-[0.3em]">THE COMPLETE JOURNEY</span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mt-4 mb-6">
            해외환자유치에서<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#c084fc]">
              VibeOps까지
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 mb-8">
            10년간의 현장 경험이 6개의 AI 프로덕트가 되기까지
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { label: '2015', desc: '시작', color: '#ff6b6b' },
              { label: '100+', desc: '병원', color: '#ffd93d' },
              { label: '6개', desc: '프로덕트', color: '#00ff88' },
              { label: '2026', desc: 'Hashed', color: '#c084fc' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="px-6 py-3 rounded-full border"
                style={{ borderColor: `${item.color}50`, backgroundColor: `${item.color}10` }}
              >
                <span className="font-bold text-white">{item.label}</span>
                <span className="text-gray-500 ml-2 text-sm">{item.desc}</span>
              </motion.div>
            ))}
          </div>

          <NeonDivider />

          <p className="text-gray-500 font-mono text-sm">
            아래로 스크롤하여 여정을 시작하세요
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// ECOSYSTEM GRAPH SECTION
// ============================================

function EcosystemGraphSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id="ecosystem"
      className="relative py-12 sm:py-16 md:py-20 bg-black overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="text-[#00d4ff] font-mono text-sm tracking-[0.3em]">PRODUCT ECOSYSTEM</span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mt-4">THE GRAPH</h2>
          <p className="text-base sm:text-xl text-gray-400 mt-4">모든 제품이 연결된 생태계 — 노드를 클릭해 자세히 보기</p>
          <NeonDivider color="#00d4ff" />
        </motion.div>

        <ProductJourney />

        {/* 데이터 플로우 설명 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-8 sm:mt-12 bg-gradient-to-r from-[#00ff88]/10 to-[#c084fc]/10 border border-[#00ff88]/20 rounded-2xl p-4 sm:p-8"
        >
          <h3 className="text-xl font-bold text-white mb-4 text-center">데이터가 흐르는 방식</h3>
          <div className="flex flex-wrap justify-center items-center gap-3 text-sm font-mono">
            <span className="px-3 py-1 bg-[#ff6b6b]/20 rounded text-[#ff6b6b]">Pain Point</span>
            <span className="text-gray-600">→</span>
            <span className="px-3 py-1 bg-[#00ff88]/20 rounded text-[#00ff88]">Scout</span>
            <span className="text-gray-600">→</span>
            <span className="px-3 py-1 bg-[#00d4ff]/20 rounded text-[#00d4ff]">Infleos</span>
            <span className="text-gray-600">→</span>
            <span className="px-3 py-1 bg-[#f472b6]/20 rounded text-[#f472b6]">GetCare</span>
            <span className="text-gray-600">→</span>
            <span className="px-3 py-1 bg-[#ffd93d]/20 rounded text-[#ffd93d]">CS Flow</span>
            <span className="text-gray-600">→</span>
            <span className="px-3 py-1 bg-[#c084fc]/20 rounded text-[#c084fc]">VibeOps</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// PROOF SECTION
// ============================================

function ProofSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const metrics = [
    { value: 80, suffix: '+', label: '잠재 리드', color: '#00ff88', icon: '🎯' },
    { value: 100, suffix: '억+', label: '누적 매출', color: '#00d4ff', icon: '💰' },
    { value: 5, suffix: '개', label: '라이브 서비스', color: '#ffd93d', icon: '🚀' },
    { value: 3, suffix: '인', label: '풀타임 팀', color: '#c084fc', icon: '⚡' },
  ];

  return (
    <section
      ref={ref}
      id="proof"
      className="relative py-16 sm:py-24 md:py-32 bg-gradient-to-b from-black via-[#050505] to-black"
    >
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-[#ffd93d] font-mono text-sm tracking-[0.3em]">THE PROOF</span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mt-4">숫자가 말합니다</h2>
          <p className="text-base sm:text-xl text-gray-400 mt-4">피치덱이 아니라, 실적이 증명합니다</p>
          <NeonDivider color="#ffd93d" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {metrics.map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-[#111] border border-[#222] rounded-2xl p-4 sm:p-6 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: metric.color }} />
              <div className="text-2xl sm:text-3xl mb-2">{metric.icon}</div>
              <div className="text-3xl sm:text-4xl font-black" style={{ color: metric.color }}>
                <AnimatedCounter value={metric.value} suffix={metric.suffix} />
              </div>
              <div className="text-gray-400 mt-1">{metric.label}</div>
            </motion.div>
          ))}
        </div>

        {/* 제품별 핵심 지표 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Scout Manager', metric: '80+ 잠재리드 수집', sub: 'Cronjob 자동추출/시딩/인입관리', color: '#00ff88', url: 'https://desk.scoutmanager.io/' },
            { name: 'Infleos', metric: '전사 사용 중', sub: '인플루언서 소통~2차관리 토탈', color: '#00d4ff', url: 'https://infleos.io/' },
            { name: 'GetCareKorea', metric: '50+ 국가', sub: '외국인 환자 유치 플랫폼', color: '#f472b6', url: 'https://getcarekorea.com/en' },
            { name: 'CS Flow', metric: '90% 자동화', sub: '다국어 CS 자동 응대', color: '#ffd93d', url: 'https://cs-admin.afformation.co.kr/' },
            { name: 'VibeOps', metric: '준비 중', sub: '통합 운영 대시보드', color: '#c084fc', url: '#' },
            { name: 'Afformation', metric: '10년', sub: '현장 노하우 · 고객사 니즈 100% 파악', color: '#ff6b6b', url: 'https://afformation.co.kr' },
          ].map((item, i) => (
            <motion.a
              key={i}
              href={item.url}
              target={item.url !== '#' ? '_blank' : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-4 p-4 bg-[#111] border border-[#222] rounded-xl cursor-pointer hover:border-[#444] transition-colors"
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold"
                   style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                {item.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="font-bold text-white">{item.name}</div>
                <div className="text-sm" style={{ color: item.color }}>{item.metric}</div>
                <div className="text-xs text-gray-500">{item.sub}</div>
              </div>
              {item.url !== '#' && <span className="text-gray-600 text-sm">&rarr;</span>}
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// CTA SECTION
// ============================================

function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      id="cta"
      className="relative py-16 sm:py-24 md:py-32 bg-gradient-to-b from-black to-[#001a0d] overflow-hidden"
    >
      {/* 배경 효과 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,255,136,0.1)_0%,_transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
        >
          <span className="text-[#00ff88] font-mono text-sm tracking-[0.3em]">THE CALL</span>
          <h2 className="text-3xl sm:text-4xl md:text-7xl font-black text-white mt-4 mb-6 sm:mb-8">
            다음 챕터를<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#00d4ff]">
              함께 쓰시겠습니까?
            </span>
          </h2>

          <p className="text-xl sm:text-2xl text-gray-300 mb-4">&quot;마케팅을 알고 코드를 짜는 조직&quot;</p>
          <p className="text-base sm:text-xl text-gray-500 mb-8 sm:mb-12">
            10년의 현장 경험 + 6개의 라이브 프로덕트 + AI Native 개발
          </p>

          <motion.a
            href="https://afformation.co.kr"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 sm:gap-4 px-8 sm:px-12 py-4 sm:py-6 bg-gradient-to-r from-[#00ff88] to-[#00d4ff] rounded-full text-black font-bold text-base sm:text-xl shadow-[0_0_60px_rgba(0,255,136,0.5)]"
          >
            APPLY TO HASHED VIBE LABS
            <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }}>→</motion.span>
          </motion.a>

          <div className="mt-12 flex flex-col md:flex-row justify-center gap-8 text-sm text-gray-500">
            <a href="mailto:contact@afformation.co.kr" className="hover:text-[#00ff88] transition-colors">
              contact@afformation.co.kr
            </a>
            <a href="https://afformation.co.kr" target="_blank" className="hover:text-[#00ff88] transition-colors">
              afformation.co.kr
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }}>
          <span className="text-[#00ff88] font-mono">INITIALIZING AFFORMATION CODE...</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white">
      <ScanLines />

      {/* 1. 히어로: 터미널 UI */}
      <HeroTerminalSection />

      {/* 2. 여정 인트로 */}
      <JourneyIntroSection />

      {/* 3. 전체 스토리 타임라인 (스크롤 스토리텔링) */}
      <div id="journey">
        <JourneyTimeline />
      </div>

      {/* 4. 제품 생태계 그래프 */}
      <EcosystemGraphSection />

      {/* 5. 실적 증명 */}
      <ProofSection />

      {/* 6. 팀 소개 */}
      <TeamGraph />

      {/* 7. CTA */}
      <CTASection />

      {/* Footer */}
      <footer className="py-12 border-t border-[#222] text-center bg-black">
        <p className="text-gray-600 text-sm font-mono">
          Built with <span className="text-[#00ff88]">Claude Code</span> × <span className="text-[#00d4ff]">bkit PDCA</span>
        </p>
        <p className="text-gray-700 text-xs font-mono mt-2">
          Try: help, /journey, /scout, /infleos, /getcare, /csflow, /vibeops, /flow
        </p>
      </footer>
    </div>
  );
}
