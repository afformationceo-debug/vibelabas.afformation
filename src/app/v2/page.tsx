'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'framer-motion';
import TerminalV2 from '@/components/terminal/TerminalV2';
import { useWorldStore } from '@/stores/world-store';
import { useStoryStore } from '@/stores/story-store';
import { CHAPTERS } from '@/lib/chapters-data';
import { STORY_DATA, TRACTION_METRICS, ECOSYSTEM_CONNECTIONS } from '@/lib/story-data';

// Dynamic import for 3D
const WorldSceneV2 = dynamic(() => import('@/components/3d/WorldSceneV2'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black" />,
});

// ============================================
// VISUAL EFFECT COMPONENTS
// ============================================

// Cyber Grid Background
function CyberGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,136,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'center top',
        }}
      />
    </div>
  );
}

// Floating Particles
function FloatingParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    })), []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#00ff88]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            filter: 'blur(1px)',
            boxShadow: '0 0 10px #00ff88',
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Enhanced Glitch Text with Multiple Effects
function GlitchText({ text, className = '' }: { text: string; className?: string }) {
  const [glitching, setGlitching] = useState(false);
  const [scrambleText, setScrambleText] = useState(text);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true);
      // Scramble effect
      const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
      let iterations = 0;
      const scrambleInterval = setInterval(() => {
        setScrambleText(
          text
            .split('')
            .map((char, i) => {
              if (i < iterations) return text[i];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('')
        );
        iterations += 1;
        if (iterations > text.length) {
          clearInterval(scrambleInterval);
          setScrambleText(text);
        }
      }, 30);
      setTimeout(() => setGlitching(false), 200);
    }, 4000);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{glitching ? scrambleText : text}</span>
      <motion.span
        className="absolute top-0 left-0 text-[#ff0000] z-0"
        animate={{
          x: glitching ? [-2, 2, -2] : 0,
          opacity: glitching ? [0.8, 1, 0.8] : 0,
        }}
        transition={{ duration: 0.1, repeat: glitching ? Infinity : 0 }}
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute top-0 left-0 text-[#00ffff] z-0"
        animate={{
          x: glitching ? [2, -2, 2] : 0,
          opacity: glitching ? [0.8, 1, 0.8] : 0,
        }}
        transition={{ duration: 0.1, repeat: glitching ? Infinity : 0 }}
      >
        {text}
      </motion.span>
    </span>
  );
}

// Neon Glow Line Divider
function NeonDivider({ color = '#00ff88' }: { color?: string }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="h-[1px] w-full max-w-md mx-auto my-8"
      style={{
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        boxShadow: `0 0 20px ${color}40, 0 0 40px ${color}20`,
      }}
    />
  );
}

// Typing Text Effect
function TypeWriter({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayText(text.slice(0, i));
        i++;
        if (i > text.length) {
          clearInterval(interval);
          setTimeout(() => setShowCursor(false), 1000);
        }
      }, 50);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay, isInView]);

  return (
    <span ref={ref} className="font-mono">
      {displayText}
      {showCursor && <span className="animate-pulse text-[#00ff88]">|</span>}
    </span>
  );
}

function AnimatedCounter({ value, suffix = '', duration = 2000 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const timer = setInterval(() => {
      start += Math.ceil(value / 50);
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, duration / 50);
    return () => clearInterval(timer);
  }, [value, duration, isInView]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function ScanLines() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {/* CRT scan lines */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.15) 2px, rgba(0,255,136,0.15) 4px)' }} />
      {/* Moving scan beam */}
      <motion.div
        className="absolute left-0 right-0 h-[100px] pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, transparent, rgba(0,255,136,0.03) 50%, transparent)',
        }}
        animate={{ y: ['0vh', '100vh'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />
      {/* Vignette */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)' }} />
    </div>
  );
}

// Enhanced Section Wrapper with Parallax
function SectionWrapper({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`relative min-h-screen flex items-center justify-center py-20 overflow-hidden ${className}`}
    >
      <motion.div style={{ y: y }} className="w-full">
        {children}
      </motion.div>
    </motion.section>
  );
}

// ============================================
// SECTION COMPONENTS
// ============================================

// Hero Section - Ultra Enhanced
function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.9]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <WorldSceneV2 />
      </div>

      {/* Cyber Grid */}
      <CyberGrid />

      {/* Floating Particles */}
      <FloatingParticles />

      {/* Gradient overlays - Multiple layers */}
      <div className="absolute inset-0 z-[1]">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* Animated corner decorations */}
      <div className="absolute top-8 left-8 w-24 h-24 border-l-2 border-t-2 border-[#00ff88]/30 z-10" />
      <div className="absolute top-8 right-8 w-24 h-24 border-r-2 border-t-2 border-[#00ff88]/30 z-10" />
      <div className="absolute bottom-8 left-8 w-24 h-24 border-l-2 border-b-2 border-[#00ff88]/30 z-10" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-r-2 border-b-2 border-[#00ff88]/30 z-10" />

      {/* Content */}
      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 text-center px-4"
      >
        {/* Status Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex items-center justify-center gap-4"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-full">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-[#00ff88]"
            />
            <span className="text-[#00ff88] font-mono text-sm">HASHED VIBE LABS 2026</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Main Title with Glow Effect */}
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-white mb-6 leading-tight">
            <GlitchText text="마케팅을 알고" className="block drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]" />
            <motion.span
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-[#00d4ff] to-[#00ff88] bg-[length:200%_auto] block"
              animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{
                textShadow: '0 0 40px rgba(0,255,136,0.5), 0 0 80px rgba(0,212,255,0.3)',
              }}
            >
              코드를 짜는 조직
            </motion.span>
          </h1>

          {/* Subtitle with typewriter */}
          <div className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-8">
            <TypeWriter text="10년간의 해외환자유치 경험을 AI 프로덕트로 전환한" delay={500} />
            <br />
            <span className="text-[#00ff88] font-bold">
              <TypeWriter text="주식회사 어포메이션의 이야기" delay={2000} />
            </span>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12"
        >
          <motion.a
            href="#origin"
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0,255,136,0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-[#00ff88] to-[#00d4ff] rounded-full text-black font-bold text-lg flex items-center gap-2"
          >
            <span>스토리 시작하기</span>
            <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }}>→</motion.span>
          </motion.a>
          <motion.a
            href="#cta"
            whileHover={{ scale: 1.05, borderColor: '#00ff88' }}
            className="px-8 py-4 border border-[#00ff88]/50 rounded-full text-[#00ff88] font-bold text-lg backdrop-blur-sm"
          >
            Apply to Hashed
          </motion.a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-[#00ff88]/50 rounded-full flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-[#00ff88]"
            />
          </motion.div>
          <span className="text-gray-500 font-mono text-xs tracking-widest">SCROLL TO EXPLORE</span>
        </motion.div>
      </motion.div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00ff88] to-transparent z-20" />
    </section>
  );
}

// Chapter 1: Origin Section - Enhanced
function OriginSection() {
  const workItems = [
    { icon: '📱', title: '인플루언서 마케팅', desc: '해외 인플루언서 섭외 및 캠페인 운영', color: '#00ff88' },
    { icon: '💬', title: '해외고객 CS', desc: '다국어 실시간 고객 응대', color: '#00d4ff' },
    { icon: '🌐', title: '통역 서비스', desc: '의료 전문 통역 제공', color: '#ffd93d' },
    { icon: '🎬', title: '컨텐츠 제작', desc: '마케팅 영상/이미지 제작', color: '#ff6b6b' },
    { icon: '📊', title: '광고 운영', desc: '퍼포먼스 마케팅 집행', color: '#c084fc' },
    { icon: '🔍', title: '구글 SEO', desc: '해외 검색 최적화', color: '#f472b6' },
  ];
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <SectionWrapper id="origin" className="bg-black">
      <div ref={ref} className="max-w-6xl mx-auto px-4 relative">
        {/* Background decoration */}
        <motion.div
          style={{ y: backgroundY }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-[#00ff88]/5 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: backgroundY }}
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#00d4ff]/5 rounded-full blur-3xl"
        />

        {/* Chapter Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16 relative z-10"
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '100px' }}
            className="h-[1px] bg-gradient-to-r from-transparent via-[#00ff88] to-transparent mx-auto mb-6"
          />
          <span className="text-[#00ff88] font-mono text-sm tracking-[0.3em] uppercase">Chapter 01</span>
          <h2 className="text-4xl md:text-7xl font-black text-white mt-4 relative">
            <span className="relative z-10">THE ORIGIN</span>
            <motion.span
              className="absolute inset-0 text-[#00ff88]/10 blur-2xl"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              THE ORIGIN
            </motion.span>
          </h2>
          <p className="text-xl text-gray-400 mt-4 font-light">시작점 — 해외환자유치에서 시작된 모든 것</p>
          <NeonDivider />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left - Story Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00ff88] via-[#00d4ff] to-[#00ff88] rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />

              <div className="relative bg-gradient-to-br from-[#0a0a0a] to-[#111] border border-[#00ff88]/20 rounded-2xl p-8 backdrop-blur-xl">
                {/* Terminal-style header */}
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#222]">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
                  <span className="ml-4 text-gray-500 font-mono text-xs">origin.story</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                  우리는 <span className="text-[#00ff88]">해외환자유치</span>에서<br />시작했습니다
                </h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  2015년부터 지금까지, 수많은 병원의 해외환자유치를 직접 실행했습니다.
                  마케팅부터 CS까지, <span className="text-white">풀퍼널 업무를 손수</span> 해봤기 때문에
                  어디가 비효율적인지 뼈저리게 알게 되었습니다.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-full text-[#00ff88] font-mono text-sm"
                  >
                    <span className="mr-2">◉</span>100+ 병원
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 bg-[#00d4ff]/10 border border-[#00d4ff]/30 rounded-full text-[#00d4ff] font-mono text-sm"
                  >
                    <span className="mr-2">◉</span>10년 노하우
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 bg-[#ffd93d]/10 border border-[#ffd93d]/30 rounded-full text-[#ffd93d] font-mono text-sm"
                  >
                    <span className="mr-2">◉</span>풀퍼널
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Work Items Grid */}
          <div className="grid grid-cols-2 gap-4">
            {workItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                whileHover={{
                  scale: 1.05,
                  borderColor: item.color,
                  boxShadow: `0 0 30px ${item.color}30`,
                }}
                className="relative bg-[#0a0a0a] border border-[#222] rounded-xl p-5 cursor-default overflow-hidden group"
              >
                {/* Hover gradient */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at center, ${item.color}10, transparent 70%)`,
                  }}
                />

                <div className="relative z-10">
                  <motion.div
                    className="text-3xl mb-3"
                    whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.icon}
                  </motion.div>
                  <h4 className="font-bold text-white mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>

                {/* Corner accent */}
                <div
                  className="absolute top-0 right-0 w-8 h-8 opacity-30"
                  style={{
                    background: `linear-gradient(135deg, ${item.color}, transparent)`,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-20 text-center relative z-10"
        >
          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#00ff88]/20 to-[#00d4ff]/20 rounded-2xl blur-xl" />
            <div className="relative bg-black/50 border border-[#00ff88]/30 rounded-2xl px-8 py-6 backdrop-blur-xl">
              <div className="text-6xl text-[#00ff88]/20 absolute -top-4 left-4">&ldquo;</div>
              <p className="text-[#00ff88] font-mono text-lg md:text-xl relative z-10">
                풀퍼널 업무를 직접 손으로 다 해봤기 때문에,<br />
                <span className="text-white">어디가 비효율적인지 뼈저리게 알게 되었다</span>
              </p>
              <div className="text-6xl text-[#00ff88]/20 absolute -bottom-8 right-4">&rdquo;</div>
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

// Chapter 2: Problems & Solutions Section - Enhanced
function ProblemsSection() {
  return (
    <SectionWrapper id="problems" className="bg-gradient-to-b from-black via-[#050505] to-black">
      <div className="max-w-6xl mx-auto px-4 relative">
        {/* Background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff6b6b]/5 rounded-full blur-[100px]" />

        {/* Chapter Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16 relative z-10"
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '100px' }}
            className="h-[1px] bg-gradient-to-r from-transparent via-[#ff6b6b] to-transparent mx-auto mb-6"
          />
          <span className="text-[#ff6b6b] font-mono text-sm tracking-[0.3em] uppercase">Chapter 02</span>
          <h2 className="text-4xl md:text-7xl font-black text-white mt-4 relative">
            <span className="relative z-10">PROBLEMS</span>
            <motion.span
              className="text-[#ff6b6b] mx-4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              →
            </motion.span>
            <span className="text-[#00ff88]">SOLUTIONS</span>
          </h2>
          <p className="text-xl text-gray-400 mt-4 font-light">문제에서 해결책으로 — 직접 만든 솔루션들</p>
          <NeonDivider color="#ff6b6b" />
        </motion.div>

        {/* Problem-Solution Pairs */}
        <div className="space-y-12 relative z-10">
          {STORY_DATA.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {/* Connection line */}
              <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 w-16 h-[2px]">
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-[#ff6b6b] to-[#00ff88]"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-4 border-black"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-stretch">
                {/* Problem Card */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`relative group ${i % 2 === 1 ? 'md:order-2' : ''}`}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff6b6b]/50 to-[#ff6b6b]/0 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-[#0a0a0a] border border-[#ff6b6b]/20 rounded-2xl p-6 h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className="w-12 h-12 rounded-xl bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 flex items-center justify-center"
                        >
                          <span className="text-[#ff6b6b] font-black text-xl">{i + 1}</span>
                        </motion.div>
                        <div>
                          <span className="text-[#ff6b6b] font-mono text-xs tracking-wider">PROBLEM</span>
                          <h3 className="text-xl font-bold text-white">{item.problem.titleKo}</h3>
                        </div>
                      </div>
                      <div className="text-3xl">⚠️</div>
                    </div>

                    <p className="text-gray-400 text-sm mb-6 leading-relaxed">{item.problem.description}</p>

                    {/* Pain Points */}
                    <div className="space-y-3">
                      {item.problem.painPoints.map((point, j) => (
                        <motion.div
                          key={j}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: j * 0.1 }}
                          className="flex items-start gap-3 p-3 bg-[#ff6b6b]/5 border border-[#ff6b6b]/10 rounded-lg"
                        >
                          <span className="text-[#ff6b6b] text-lg">✗</span>
                          <span className="text-gray-400 text-sm">{point}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Solution Card */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`relative group ${i % 2 === 1 ? 'md:order-1' : ''}`}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00ff88]/0 to-[#00ff88]/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-[#0a0a0a] border border-[#00ff88]/20 rounded-2xl p-6 h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="w-12 h-12 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/30 flex items-center justify-center"
                        >
                          <span className="text-[#00ff88] text-2xl">✓</span>
                        </motion.div>
                        <div>
                          <span className="text-[#00ff88] font-mono text-xs tracking-wider">SOLUTION</span>
                          <h3 className="text-xl font-bold text-white">{item.solution.productName}</h3>
                        </div>
                      </div>
                      <div className="text-3xl">🚀</div>
                    </div>

                    <p className="text-gray-400 text-sm mb-6 leading-relaxed">{item.solution.result}</p>

                    {/* Features */}
                    <div className="space-y-3 mb-6">
                      {item.solution.features.map((feature, j) => (
                        <motion.div
                          key={j}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: j * 0.1 }}
                          className="flex items-start gap-3 p-3 bg-[#00ff88]/5 border border-[#00ff88]/10 rounded-lg"
                        >
                          <span className="text-[#00ff88] text-lg">✓</span>
                          <span className="text-gray-400 text-sm">{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* URL Button */}
                    <motion.a
                      href={item.solution.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0,255,136,0.3)' }}
                      className="flex items-center justify-between w-full px-4 py-3 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-xl text-[#00ff88] font-mono text-sm hover:bg-[#00ff88]/20 transition-colors"
                    >
                      <span>{item.solution.url}</span>
                      <span>→</span>
                    </motion.a>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

// Chapter 3: Ecosystem Section - Enhanced with Connections
function EcosystemSection() {
  const products = [
    { name: 'Scout Manager', color: '#00ff88', desc: 'AI 인플루언서 마케팅', url: 'scoutmanager.io', icon: '🎯' },
    { name: 'Infleos', color: '#00d4ff', desc: '풀퍼널 인플루언서 플랫폼', url: 'infleos.io', icon: '📊' },
    { name: 'GetCareKorea', color: '#ff6b6b', desc: '외국인 의료관광 플랫폼', url: 'getcarekorea.com', icon: '🏥' },
    { name: 'CS Flow', color: '#ffd93d', desc: 'Human-in-the-Loop CS 자동화', url: 'cs-landing.afformation.co.kr', icon: '💬' },
    { name: 'VibeOps', color: '#c084fc', desc: '통합 오퍼레이션 시스템', url: '(Coming Soon)', icon: '⚡' },
    { name: 'Afformation', color: '#f472b6', desc: '의료관광 마케팅 에이전시', url: 'afformation.co.kr', icon: '🚀' },
  ];

  const flowSteps = [
    { from: 'Scout Manager', to: 'Infleos', data: '인플루언서 데이터' },
    { from: 'Infleos', to: 'GetCareKorea', data: '캠페인 트래픽' },
    { from: 'GetCareKorea', to: 'CS Flow', data: '고객 문의' },
    { from: 'CS Flow', to: 'VibeOps', data: '자동화 로그' },
  ];

  return (
    <SectionWrapper id="ecosystem" className="bg-black">
      <div className="max-w-6xl mx-auto px-4 relative">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00d4ff]/5 rounded-full blur-[150px]" />

        {/* Chapter Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16 relative z-10"
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '100px' }}
            className="h-[1px] bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent mx-auto mb-6"
          />
          <span className="text-[#00d4ff] font-mono text-sm tracking-[0.3em] uppercase">Chapter 03</span>
          <h2 className="text-4xl md:text-7xl font-black text-white mt-4">
            THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#00ff88]">ECOSYSTEM</span>
          </h2>
          <p className="text-xl text-gray-400 mt-4 font-light">생태계 — 모든 제품이 연결된 하나의 시스템</p>
          <NeonDivider color="#00d4ff" />
        </motion.div>

        {/* Products Hexagon Grid */}
        <div className="relative mb-20">
          {/* Connection Lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden md:block" style={{ minHeight: '400px' }}>
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00ff88" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.5" />
              </linearGradient>
            </defs>
            {/* Animated connection lines will be drawn by CSS */}
          </svg>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 relative z-10">
            {products.map((product, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{
                  scale: 1.08,
                  y: -10,
                  boxShadow: `0 20px 40px ${product.color}30`,
                }}
                className="relative group cursor-pointer"
              >
                {/* Glow ring on hover */}
                <motion.div
                  className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${product.color}40, transparent, ${product.color}40)`,
                    filter: 'blur(8px)',
                  }}
                />

                <div className="relative bg-[#0a0a0a] border border-[#222] rounded-2xl p-6 text-center overflow-hidden">
                  {/* Top gradient bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ background: `linear-gradient(90deg, transparent, ${product.color}, transparent)` }}
                  />

                  {/* Animated background */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at center, ${product.color}15, transparent 70%)`,
                    }}
                  />

                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                    className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl relative"
                    style={{
                      backgroundColor: `${product.color}15`,
                      border: `2px solid ${product.color}30`,
                    }}
                  >
                    {product.icon}
                    {/* Pulse effect */}
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-2xl"
                      style={{ border: `2px solid ${product.color}` }}
                    />
                  </motion.div>

                  {/* Name */}
                  <h3 className="font-bold text-white text-lg mb-1">{product.name}</h3>
                  <p className="text-xs text-gray-500 mb-4">{product.desc}</p>

                  {/* URL Badge */}
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="inline-block px-3 py-1 rounded-full text-xs font-mono"
                    style={{
                      backgroundColor: `${product.color}15`,
                      color: product.color,
                      border: `1px solid ${product.color}30`,
                    }}
                  >
                    {product.url}
                  </motion.span>

                  {/* Status indicator */}
                  <div className="absolute top-4 right-4 flex items-center gap-1">
                    <motion.div
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: product.color }}
                    />
                    <span className="text-[10px] text-gray-500 font-mono">LIVE</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Data Flow Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <div className="bg-gradient-to-r from-[#0a0a0a] via-[#111] to-[#0a0a0a] border border-[#00ff88]/20 rounded-2xl p-8 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    ⚡
                  </motion.span>
                  데이터가 흐르는 생태계
                </h3>
                <p className="text-gray-500 text-sm mt-1">모든 제품은 실시간으로 연결되어 있습니다</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-full">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-[#00ff88]"
                />
                <span className="text-[#00ff88] font-mono text-xs">CONNECTED</span>
              </div>
            </div>

            {/* Flow Steps */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {flowSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="flex items-center gap-4"
                >
                  {/* From */}
                  <div className="px-4 py-2 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-lg">
                    <span className="text-[#00ff88] font-mono text-sm">{step.from}</span>
                  </div>

                  {/* Arrow with data label */}
                  <div className="flex flex-col items-center">
                    <span className="text-gray-600 text-[10px] font-mono mb-1">{step.data}</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="text-[#00d4ff] text-xl"
                    >
                      →
                    </motion.div>
                  </div>

                  {/* To (only for last item) */}
                  {i === flowSteps.length - 1 && (
                    <div className="px-4 py-2 bg-[#c084fc]/10 border border-[#c084fc]/30 rounded-lg">
                      <span className="text-[#c084fc] font-mono text-sm">{step.to}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-400 text-center mt-8 max-w-2xl mx-auto"
            >
              Scout Manager에서 시작된 인플루언서 데이터가 Infleos로 연결되고,
              GetCareKorea에서 발생한 고객 문의는 CS Flow가 자동 처리합니다.
              <span className="text-[#00ff88]"> 모든 것은 VibeOps에서 통합 모니터링됩니다.</span>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

// Chapter 4: Proof Section - Enhanced with Animations
function ProofSection() {
  const metrics = [
    { value: 30, suffix: '+', label: '파트너사', desc: '강남 성형외과 10+곳 포함', color: '#00ff88', icon: '🏥' },
    { value: 100, suffix: '억+', label: '누적 매출', desc: '10년 누적 실적', color: '#00d4ff', icon: '💰' },
    { value: 3, suffix: '개국', label: '글로벌 진출', desc: '한국, 일본, 동남아', color: '#ffd93d', icon: '🌏' },
    { value: 6, suffix: '개', label: '라이브 프로덕트', desc: '모두 실제 운영 중', color: '#c084fc', icon: '🚀' },
  ];

  const evidence = [
    {
      title: '파트너사',
      icon: '🏢',
      color: '#00ff88',
      items: [
        { text: '강남 성형외과 10+곳 장기 계약', highlight: true },
        { text: '피부과, 치과 등 다양한 진료과', highlight: false },
        { text: '일본, 동남아 현지 에이전시 파트너', highlight: false },
      ]
    },
    {
      title: '매출 실적',
      icon: '📈',
      color: '#00d4ff',
      items: [
        { text: '의료관광 마케팅 10년 누적', highlight: false },
        { text: 'SaaS 매출 성장 중', highlight: true },
        { text: '재계약률 90%+', highlight: true },
      ]
    },
    {
      title: '프로덕트',
      icon: '⚡',
      color: '#c084fc',
      items: [
        { text: 'Scout Manager: scoutmanager.io', highlight: false },
        { text: 'Infleos: infleos.io', highlight: false },
        { text: 'GetCareKorea: getcarekorea.com', highlight: false },
        { text: 'CS Flow: 운영 중', highlight: true },
      ]
    },
  ];

  return (
    <SectionWrapper id="proof" className="bg-gradient-to-b from-black via-[#050505] to-black">
      <div className="max-w-6xl mx-auto px-4 relative">
        {/* Background elements */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#ffd93d]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#00ff88]/5 rounded-full blur-[120px]" />

        {/* Chapter Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16 relative z-10"
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '100px' }}
            className="h-[1px] bg-gradient-to-r from-transparent via-[#ffd93d] to-transparent mx-auto mb-6"
          />
          <span className="text-[#ffd93d] font-mono text-sm tracking-[0.3em] uppercase">Chapter 04</span>
          <h2 className="text-4xl md:text-7xl font-black text-white mt-4">
            THE <span className="text-[#ffd93d]">PROOF</span>
          </h2>
          <p className="text-xl text-gray-400 mt-4 font-light">증명 — 피치덱이 아니라 숫자가 말합니다</p>
          <NeonDivider color="#ffd93d" />
        </motion.div>

        {/* Metrics Grid - Enhanced */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 relative z-10">
          {metrics.map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={{
                scale: 1.05,
                boxShadow: `0 20px 40px ${metric.color}20`,
              }}
              className="relative group"
            >
              {/* Glow effect */}
              <div
                className="absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(135deg, ${metric.color}50, transparent)` }}
              />

              <div className="relative bg-[#0a0a0a] border border-[#222] rounded-2xl p-6 text-center overflow-hidden">
                {/* Top accent */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ background: `linear-gradient(90deg, transparent, ${metric.color}, transparent)` }}
                />

                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: i * 0.1 + 0.2, type: "spring" }}
                  className="text-3xl mb-2"
                >
                  {metric.icon}
                </motion.div>

                {/* Number with animation */}
                <motion.div
                  className="text-4xl md:text-6xl font-black mb-2 relative"
                  style={{ color: metric.color }}
                >
                  <AnimatedCounter value={metric.value} suffix={metric.suffix} duration={2500} />
                  {/* Glow text */}
                  <motion.span
                    className="absolute inset-0 blur-lg opacity-50"
                    style={{ color: metric.color }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {metric.value}{metric.suffix}
                  </motion.span>
                </motion.div>

                <h3 className="font-bold text-white text-lg">{metric.label}</h3>
                <p className="text-xs text-gray-500 mt-1">{metric.desc}</p>

                {/* Animated corner */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -bottom-8 -right-8 w-16 h-16 opacity-10"
                  style={{
                    background: `conic-gradient(from 0deg, ${metric.color}, transparent, ${metric.color})`,
                    borderRadius: '50%',
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Evidence Section - Enhanced */}
        <div className="grid md:grid-cols-3 gap-6 relative z-10">
          {evidence.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                style={{ background: section.color }} />

              <div className="relative bg-[#0a0a0a] border border-[#222] rounded-2xl p-6 h-full">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#222]">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${section.color}15`, border: `1px solid ${section.color}30` }}
                  >
                    {section.icon}
                  </div>
                  <h3 className="font-bold text-white text-lg">{section.title}</h3>
                </div>

                {/* Items with tree structure */}
                <div className="space-y-3 relative">
                  {/* Vertical line */}
                  <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-[#333] to-transparent" />

                  {section.items.map((item, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 + j * 0.1 }}
                      className={`flex items-start gap-3 pl-5 relative ${item.highlight ? 'text-white' : 'text-gray-400'}`}
                    >
                      {/* Connector */}
                      <div className="absolute left-0 top-2 w-4 flex items-center">
                        <div className="w-full h-[1px] bg-[#333]" />
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: item.highlight ? section.color : '#333' }}
                        />
                      </div>

                      <span className={`text-sm ${item.highlight ? 'font-medium' : ''}`}>
                        {item.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-16 text-center relative z-10"
        >
          <div className="inline-block px-8 py-4 bg-gradient-to-r from-[#ffd93d]/10 to-[#00ff88]/10 border border-[#ffd93d]/30 rounded-2xl">
            <p className="text-lg text-white font-medium">
              &ldquo;숫자는 거짓말하지 않습니다. <span className="text-[#ffd93d]">실제 트랙션</span>으로 증명합니다.&rdquo;
            </p>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

// Chapter 5: Vision Section - Enhanced Timeline
function VisionSection() {
  const timeline = [
    { year: '2015', title: '해외환자유치 시작', desc: '의료관광 마케팅 사업 시작', color: '#00ff88', icon: '🌱' },
    { year: '2018', title: '100+ 병원 경험 축적', desc: '풀퍼널 운영 노하우 확보', color: '#00d4ff', icon: '📈' },
    { year: '2023', title: 'AI Native 전환', desc: 'Claude와 함께 프로덕트 개발 시작', color: '#ffd93d', icon: '🤖' },
    { year: '2024', title: 'Scout Manager, Infleos 런칭', desc: '첫 SaaS 프로덕트 출시', color: '#ff6b6b', icon: '🚀' },
    { year: '2025', title: 'GetCareKorea, CS Flow 런칭', desc: '바이브코딩으로 빠른 개발', color: '#c084fc', icon: '⚡' },
    { year: '2026', title: 'VibeOps & Hashed', desc: '통합 플랫폼 개발, Hashed Vibe Labs 지원', color: '#f472b6', icon: '🎯', current: true },
  ];

  const roadmap = [
    { week: 'Week 1-2', task: 'VibeOps MVP 완성', icon: '🔨', status: 'active' },
    { week: 'Week 3-4', task: '통합 대시보드 런칭', icon: '📊', status: 'pending' },
    { week: 'Week 5-6', task: '베타 고객 온보딩', icon: '👥', status: 'pending' },
    { week: 'Week 7-8', task: 'ARR 성장 가시화', icon: '💎', status: 'pending' },
  ];

  return (
    <SectionWrapper id="vision" className="bg-black">
      <div className="max-w-6xl mx-auto px-4 relative">
        {/* Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#c084fc]/5 rounded-full blur-[150px]" />

        {/* Chapter Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16 relative z-10"
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '100px' }}
            className="h-[1px] bg-gradient-to-r from-transparent via-[#c084fc] to-transparent mx-auto mb-6"
          />
          <span className="text-[#c084fc] font-mono text-sm tracking-[0.3em] uppercase">Chapter 05</span>
          <h2 className="text-4xl md:text-7xl font-black text-white mt-4">
            THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] to-[#f472b6]">VISION</span>
          </h2>
          <p className="text-xl text-gray-400 mt-4 font-light">비전 — Hashed와 함께할 미래</p>
          <NeonDivider color="#c084fc" />
        </motion.div>

        {/* Timeline - Enhanced */}
        <div className="relative mb-20">
          {/* Central line with gradient animation */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[3px] -translate-x-1/2">
            <motion.div
              initial={{ height: '0%' }}
              whileInView={{ height: '100%' }}
              transition={{ duration: 1.5 }}
              className="w-full bg-gradient-to-b from-[#00ff88] via-[#00d4ff] via-[#ffd93d] via-[#c084fc] to-[#f472b6]"
            />
          </div>

          <div className="space-y-16">
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`relative flex items-center ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
              >
                {/* Content Card */}
                <div className={`w-[45%] ${i % 2 === 0 ? 'text-right pr-12' : 'text-left pl-12'}`}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className={`relative group inline-block w-full ${i % 2 === 0 ? 'text-right' : 'text-left'}`}
                  >
                    {/* Glow */}
                    <div
                      className="absolute -inset-1 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                      style={{ background: item.color }}
                    />

                    <div className={`relative bg-[#0a0a0a] border rounded-2xl p-6 ${item.current ? 'border-[#f472b6]/50' : 'border-[#222]'}`}>
                      {/* Current indicator */}
                      {item.current && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#f472b6] rounded-full">
                          <span className="text-black text-xs font-bold">NOW</span>
                        </div>
                      )}

                      <div className={`flex items-center gap-4 mb-3 ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-3xl">{item.icon}</span>
                        <span className="font-mono text-2xl font-bold" style={{ color: item.color }}>{item.year}</span>
                      </div>
                      <h3 className="font-bold text-white text-lg mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </motion.div>
                </div>

                {/* Center Node */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: i * 0.1 + 0.2, type: "spring" }}
                  className="absolute left-1/2 -translate-x-1/2 z-10"
                >
                  <div
                    className="w-6 h-6 rounded-full border-4 border-black relative"
                    style={{ backgroundColor: item.color }}
                  >
                    {/* Pulse effect for current */}
                    {item.current && (
                      <motion.div
                        animate={{ scale: [1, 2, 1], opacity: [1, 0, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    )}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Hashed Vision Box - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <div className="relative group">
            {/* Animated border */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#c084fc] via-[#00ff88] to-[#00d4ff] rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500" />

            <div className="relative bg-[#0a0a0a] border border-[#333] rounded-3xl p-8 md:p-12 overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 1px)`,
                  backgroundSize: '40px 40px',
                }} />
              </div>

              {/* Header */}
              <div className="text-center mb-10 relative z-10">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  🚀
                </motion.div>
                <h3 className="text-3xl md:text-4xl font-black text-white mb-2">
                  8주 후, <span className="text-[#00ff88]">ARR</span>이 말해줄 것입니다
                </h3>
                <p className="text-gray-500">Hashed Vibe Labs 프로그램 로드맵</p>
              </div>

              {/* Roadmap Grid */}
              <div className="grid md:grid-cols-4 gap-4 relative z-10 mb-8">
                {roadmap.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`relative bg-black/50 rounded-2xl p-5 border ${item.status === 'active' ? 'border-[#00ff88]/50' : 'border-[#222]'}`}
                  >
                    {/* Status indicator */}
                    {item.status === 'active' && (
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#00ff88]"
                      />
                    )}

                    <div className="text-3xl mb-2">{item.icon}</div>
                    <span className="text-[#c084fc] font-mono text-xs">{item.week}</span>
                    <p className="text-white font-medium mt-1">{item.task}</p>

                    {/* Progress bar */}
                    <div className="mt-3 h-1 bg-[#222] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: item.status === 'active' ? '50%' : '0%' }}
                        className="h-full bg-gradient-to-r from-[#00ff88] to-[#00d4ff]"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quote */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center relative z-10"
              >
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#00ff88]/10 to-[#00d4ff]/10 border border-[#00ff88]/30 rounded-full">
                  <span className="text-xl">💻</span>
                  <p className="text-[#00ff88] font-mono">
                    &quot;피치덱 대신 <span className="text-white">대시보드</span>로 Demo합니다&quot;
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

// Chapter 6: CTA Section
function CTASection() {
  return (
    <SectionWrapper id="cta" className="bg-gradient-to-b from-black to-[#001a0d]">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-[#00ff88] font-mono text-sm tracking-widest">CHAPTER 06</span>
          <h2 className="text-4xl md:text-7xl font-black text-white mt-4 mb-8">
            THE CALL
          </h2>

          <div className="mb-12">
            <p className="text-2xl md:text-3xl text-gray-300 mb-4">
              &quot;마케팅을 알고 코드를 짜는 조직&quot;
            </p>
            <p className="text-xl text-gray-400">
              이 여정을 함께 하시겠습니까?
            </p>
          </div>

          <motion.a
            href="https://afformation.co.kr"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-[#00ff88] to-[#00d4ff] rounded-full text-black font-bold text-xl"
          >
            APPLY TO HASHED VIBE LABS
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.a>

          <div className="mt-12 flex justify-center gap-8 text-sm text-gray-500">
            <a href="mailto:contact@afformation.co.kr" className="hover:text-[#00ff88] transition-colors">
              contact@afformation.co.kr
            </a>
            <a href="https://afformation.co.kr" target="_blank" rel="noopener noreferrer" className="hover:text-[#00ff88] transition-colors">
              afformation.co.kr
            </a>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

// Terminal Section (Optional floating or dedicated section)
function TerminalSection() {
  const [showTerminal, setShowTerminal] = useState(false);
  const { journeyStarted } = useWorldStore();
  const handleChapterChange = useCallback(() => {}, []);

  return (
    <>
      {/* Floating Terminal Toggle Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        onClick={() => setShowTerminal(!showTerminal)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#00ff88] rounded-full flex items-center justify-center text-black font-bold shadow-[0_0_30px_rgba(0,255,136,0.5)] hover:scale-110 transition-transform"
      >
        {showTerminal ? '✕' : '>_'}
      </motion.button>

      {/* Floating Terminal */}
      <AnimatePresence>
        {showTerminal && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-[600px] max-w-[calc(100vw-3rem)]"
          >
            <TerminalV2 onChapterChange={handleChapterChange} className="shadow-[0_0_60px_rgba(0,255,136,0.3)]" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Navigation
function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    { id: 'origin', label: 'Origin' },
    { id: 'problems', label: 'Problems' },
    { id: 'ecosystem', label: 'Ecosystem' },
    { id: 'proof', label: 'Proof' },
    { id: 'vision', label: 'Vision' },
    { id: 'cta', label: 'Apply' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: scrolled ? 0 : -100 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-[#222]"
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00ff88] to-[#00d4ff] flex items-center justify-center">
            <span className="text-black font-black text-xs">AF</span>
          </div>
          <span className="font-bold text-white">AFFORMATION</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="text-sm text-gray-400 hover:text-[#00ff88] transition-colors"
            >
              {section.label}
            </a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}

// ============================================
// MAIN PAGE
// ============================================
export default function V2Page() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }}>
          <span className="text-[#00ff88] font-mono text-xl">LOADING...</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white">
      <ScanLines />
      <Navigation />

      <HeroSection />
      <OriginSection />
      <ProblemsSection />
      <EcosystemSection />
      <ProofSection />
      <VisionSection />
      <CTASection />

      <TerminalSection />

      {/* Footer */}
      <footer className="py-12 border-t border-[#222] text-center">
        <p className="text-gray-600 text-sm font-mono">
          Built with <span className="text-[#00ff88]">Claude Code</span> × <span className="text-[#00d4ff]">bkit PDCA</span> | 48 hours of vibe coding
        </p>
        <p className="text-gray-700 text-xs mt-2">
          © 2026 주식회사 어포메이션 (Afformation Inc.)
        </p>
      </footer>
    </div>
  );
}
