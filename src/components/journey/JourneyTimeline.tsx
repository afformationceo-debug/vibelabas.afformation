'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

// 여정 스토리 데이터
const JOURNEY_STORY = [
  {
    id: 'beginning',
    chapter: 'PROLOGUE',
    year: '2015',
    title: '모든 것의 시작',
    subtitle: '해외환자유치 시장에 뛰어들다',
    narrative: `
      2015년, 우리는 해외환자유치 시장에 뛰어들었습니다.

      병원은 외국인 환자를 원했고, 외국인 환자는 한국 의료를 원했습니다.
      하지만 그 사이에는 아무것도 없었습니다.

      우리가 직접 그 다리가 되기로 했습니다.
    `,
    painPoints: [
      '인플루언서를 찾는 데만 3일',
      'CS 응대를 위해 24시간 대기',
      '캠페인 성과는 엑셀로 수동 집계',
      '모든 것이 느리고, 비효율적이고, 소모적이었습니다',
    ],
    color: '#ff6b6b',
    bgGradient: 'from-red-900/20 to-black',
  },
  {
    id: 'insight',
    chapter: 'CHAPTER 01',
    year: '2018-2022',
    title: '100개의 병원, 1000번의 삽질',
    subtitle: '현장에서 배운 진짜 문제',
    narrative: `
      100개 이상의 병원과 일하면서 깨달았습니다.

      문제는 "일을 잘 못해서"가 아니었습니다.
      문제는 "도구가 없어서"였습니다.

      마케터는 마케팅을 해야 하는데,
      하루 종일 엑셀만 만지고 있었습니다.
    `,
    insights: [
      '반복 작업에 80%의 시간 소모',
      '데이터는 있지만 인사이트는 없음',
      '도구는 많지만 연결되지 않음',
      '결국, 사람이 병목이 되는 구조',
    ],
    color: '#ffd93d',
    bgGradient: 'from-yellow-900/20 to-black',
  },
  {
    id: 'scout',
    chapter: 'CHAPTER 02',
    year: '2023.03',
    title: 'Scout Manager 탄생',
    subtitle: '인플루언서 매칭의 혁신',
    narrative: `
      첫 번째 해결책: Scout Manager

      "인플루언서 찾는 데 3일? AI면 30초."

      300만+ 인플루언서 데이터베이스,
      AI 기반 매칭 알고리즘,
      가짜 팔로워 탐지 시스템.

      처음으로 "이건 되겠다" 싶었습니다.
    `,
    features: [
      { label: '매칭 시간', before: '3일', after: '30초', improvement: '99.9%' },
      { label: '정확도', before: '60%', after: '95%', improvement: '+58%' },
      { label: '비용', before: '외주 200만', after: '월 29만', improvement: '85%' },
    ],
    product: {
      name: 'Scout Manager',
      url: 'https://scoutmanager.io',
      icon: '🎯',
    },
    color: '#00ff88',
    bgGradient: 'from-green-900/20 to-black',
  },
  {
    id: 'infleos',
    chapter: 'CHAPTER 03',
    year: '2023.09',
    title: 'Infleos 런칭',
    subtitle: '캠페인의 처음부터 끝까지',
    narrative: `
      Scout으로 인플루언서를 찾았습니다.
      그 다음은? 계약, 콘텐츠 관리, 성과 추적...

      또 엑셀이었습니다.

      "풀퍼널을 하나로 묶자."
      그래서 만든 것이 Infleos입니다.
    `,
    features: [
      { label: '업무 시간', before: '주 40시간', after: '주 12시간', improvement: '70%' },
      { label: 'ROI 추적', before: '월말 정산', after: '실시간', improvement: '∞' },
      { label: '캠페인 관리', before: '5개 툴', after: '1개 툴', improvement: '80%' },
    ],
    product: {
      name: 'Infleos',
      url: 'https://infleos.com',
      icon: '📊',
    },
    color: '#00d4ff',
    bgGradient: 'from-cyan-900/20 to-black',
  },
  {
    id: 'getcare',
    chapter: 'CHAPTER 04',
    year: '2024.02',
    title: 'GetCareKorea 오픈',
    subtitle: '외국인 환자의 한국 의료 여정',
    narrative: `
      병원과 환자, 그 사이의 모든 것을 연결하는 플랫폼.

      병원 예약, 비자, 숙소, 통역, 사후 관리까지.
      외국인 환자가 한국에서 치료받는 전 과정을
      하나의 플랫폼에서.

      B2B에서 B2C로의 확장이었습니다.
    `,
    features: [
      { label: '커버 국가', before: '5개국', after: '50+개국', improvement: '10x' },
      { label: '예약 전환율', before: '15%', after: '45%', improvement: '3x' },
      { label: '고객 만족도', before: '4.2', after: '4.9', improvement: '+17%' },
    ],
    product: {
      name: 'GetCareKorea',
      url: 'https://getcarekorea.com',
      icon: '🏥',
    },
    color: '#f472b6',
    bgGradient: 'from-pink-900/20 to-black',
  },
  {
    id: 'csflow',
    chapter: 'CHAPTER 05',
    year: '2024.08',
    title: 'CS Flow AI',
    subtitle: 'CS의 90%를 AI가 처리',
    narrative: `
      가장 큰 병목은 CS였습니다.

      외국인 환자는 24시간 문의합니다.
      시차는 우리를 잠들지 못하게 했습니다.

      "AI가 90%를 처리하면?"
      12개 언어, 24시간, 무중단.
      드디어 잠을 잘 수 있게 되었습니다.
    `,
    features: [
      { label: '자동 응대율', before: '0%', after: '90%', improvement: '∞' },
      { label: '응답 시간', before: '평균 4시간', after: '즉시', improvement: '99.9%' },
      { label: '지원 언어', before: '3개', after: '12개', improvement: '4x' },
    ],
    product: {
      name: 'CS Flow',
      url: 'https://csflow.ai',
      icon: '💬',
    },
    color: '#ffd93d',
    bgGradient: 'from-yellow-900/20 to-black',
  },
  {
    id: 'vibeops',
    chapter: 'CHAPTER 06',
    year: '2025.01',
    title: 'VibeOps',
    subtitle: '모든 것이 연결되는 곳',
    narrative: `
      이제 모든 조각이 모였습니다.

      Scout → Infleos → GetCare → CS Flow
      각각 훌륭했지만, 따로 놀고 있었습니다.

      VibeOps는 이 모든 것을 연결합니다.
      데이터가 흐르고, 인사이트가 생기고,
      워크플로우가 자동화됩니다.

      이것이 우리가 만든 생태계입니다.
    `,
    features: [
      { label: '데이터 통합', before: '수동', after: '실시간', improvement: '100%' },
      { label: '의사결정', before: '감', after: 'AI 추천', improvement: '∞' },
      { label: '자동화율', before: '20%', after: '85%', improvement: '4.25x' },
    ],
    product: {
      name: 'VibeOps',
      url: 'https://vibeops.io',
      icon: '⚡',
    },
    color: '#c084fc',
    bgGradient: 'from-purple-900/20 to-black',
  },
  {
    id: 'future',
    chapter: 'EPILOGUE',
    year: '2026',
    title: 'Hashed Vibe Labs',
    subtitle: '다음 챕터를 함께',
    narrative: `
      10년간의 여정이 여기까지 왔습니다.

      해외환자유치의 현장에서 시작해,
      6개의 라이브 프로덕트를 만들었습니다.

      이제 Hashed와 함께
      다음 챕터를 쓰려 합니다.

      "마케팅을 알고 코드를 짜는 조직"

      우리의 여정은 계속됩니다.
    `,
    metrics: [
      { label: '파트너 병원', value: '30+' },
      { label: '누적 매출', value: '100억+' },
      { label: '라이브 제품', value: '6개' },
      { label: 'AI 자동화', value: '90%' },
    ],
    color: '#00ff88',
    bgGradient: 'from-green-900/30 via-cyan-900/20 to-black',
  },
];

// 개별 스토리 카드
function StoryCard({ story, index }: { story: typeof JOURNEY_STORY[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      className={`min-h-screen flex items-center justify-center py-20 bg-gradient-to-b ${story.bgGradient}`}
    >
      <div className="max-w-4xl mx-auto px-6">
        {/* 챕터 헤더 */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-mono" style={{ backgroundColor: `${story.color}20`, color: story.color }}>
              {story.chapter}
            </span>
            <span className="text-gray-500 font-mono text-sm">{story.year}</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4">{story.title}</h2>
          <p className="text-xl text-gray-400">{story.subtitle}</p>
        </motion.div>

        {/* 내러티브 */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="text-lg text-gray-300 leading-relaxed whitespace-pre-line font-light">
            {story.narrative}
          </div>
        </motion.div>

        {/* Pain Points (있는 경우) */}
        {story.painPoints && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 rounded-2xl p-6 mb-8"
          >
            <h4 className="text-[#ff6b6b] font-mono text-sm mb-4">PAIN POINTS</h4>
            <ul className="space-y-3">
              {story.painPoints.map((point, i) => (
                <motion.li
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={isInView ? { x: 0, opacity: 1 } : {}}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex items-start gap-3 text-gray-300"
                >
                  <span className="text-[#ff6b6b]">✗</span>
                  {point}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Insights (있는 경우) */}
        {story.insights && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="bg-[#ffd93d]/10 border border-[#ffd93d]/30 rounded-2xl p-6 mb-8"
          >
            <h4 className="text-[#ffd93d] font-mono text-sm mb-4">INSIGHTS</h4>
            <ul className="space-y-3">
              {story.insights.map((insight, i) => (
                <motion.li
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={isInView ? { x: 0, opacity: 1 } : {}}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex items-start gap-3 text-gray-300"
                >
                  <span className="text-[#ffd93d]">💡</span>
                  {insight}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Features 비교 (있는 경우) */}
        {story.features && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="grid md:grid-cols-3 gap-4 mb-8"
          >
            {story.features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="bg-[#111] border border-[#222] rounded-xl p-4 text-center"
              >
                <div className="text-xs text-gray-500 mb-2">{feature.label}</div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-gray-500 line-through text-sm">{feature.before}</span>
                  <span className="text-gray-600">→</span>
                  <span className="text-xl font-bold" style={{ color: story.color }}>{feature.after}</span>
                </div>
                <div className="text-xs px-2 py-1 rounded-full inline-block" style={{ backgroundColor: `${story.color}20`, color: story.color }}>
                  {feature.improvement} 개선
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Product CTA (있는 경우) */}
        {story.product && (
          <motion.a
            href={story.product.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between p-4 rounded-xl border transition-all"
            style={{
              backgroundColor: `${story.color}10`,
              borderColor: `${story.color}30`,
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{story.product.icon}</span>
              <div>
                <div className="font-bold text-white">{story.product.name}</div>
                <div className="text-xs text-gray-500">{story.product.url}</div>
              </div>
            </div>
            <span style={{ color: story.color }}>→</span>
          </motion.a>
        )}

        {/* Final Metrics (마지막 섹션) */}
        {story.metrics && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {story.metrics.map((metric, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="bg-gradient-to-br from-[#00ff88]/10 to-[#00d4ff]/10 border border-[#00ff88]/30 rounded-xl p-6 text-center"
              >
                <div className="text-3xl font-black text-[#00ff88] mb-1">{metric.value}</div>
                <div className="text-xs text-gray-400">{metric.label}</div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// 사이드 네비게이션
function SideNavigation({ currentIndex }: { currentIndex: number }) {
  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
      <div className="flex flex-col gap-3">
        {JOURNEY_STORY.map((story, i) => (
          <motion.button
            key={story.id}
            onClick={() => {
              document.getElementById(`story-${story.id}`)?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group flex items-center gap-3"
            whileHover={{ x: 5 }}
          >
            <motion.div
              animate={{
                scale: currentIndex === i ? 1.3 : 1,
                backgroundColor: currentIndex === i ? story.color : '#333',
              }}
              className="w-2 h-2 rounded-full"
            />
            <span className={`text-xs font-mono transition-colors ${
              currentIndex === i ? 'text-white' : 'text-gray-600 group-hover:text-gray-400'
            }`}>
              {story.chapter}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default function JourneyTimeline() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const sections = containerRef.current.querySelectorAll('[data-story-index]');
      let newIndex = 0;

      sections.forEach((section, i) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight / 2) {
          newIndex = i;
        }
      });

      setCurrentIndex(newIndex);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <SideNavigation currentIndex={currentIndex} />

      {JOURNEY_STORY.map((story, index) => (
        <div key={story.id} id={`story-${story.id}`} data-story-index={index}>
          <StoryCard story={story} index={index} />
        </div>
      ))}
    </div>
  );
}
