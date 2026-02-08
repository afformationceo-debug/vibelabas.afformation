'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

// 제품 데이터 - 스토리 중심
const JOURNEY_NODES = [
  {
    id: 'pain',
    type: 'origin',
    year: '2015',
    title: '해외환자유치의 시작',
    subtitle: 'THE PAIN POINT',
    description: '모든 것을 직접 해야 했던 시절',
    details: [
      '인플루언서 찾기 → 수작업 3일',
      'CS 응대 → 24시간 대기',
      '캠페인 관리 → 엑셀 지옥',
      '성과 추적 → 감으로 판단',
    ],
    color: '#ff6b6b',
    icon: '😰',
    position: { x: 50, y: 10 },
    mobilePosition: { x: 50, y: 5 },
  },
  {
    id: 'scout',
    type: 'product',
    year: '2023',
    title: 'Scout Manager',
    subtitle: 'AI INFLUENCER MATCHING',
    description: '인플루언서 찾기의 혁신',
    details: [
      '300만+ 인플루언서 DB',
      'AI 매칭 알고리즘',
      '가짜 팔로워 탐지',
      '실시간 캠페인 추적',
    ],
    metrics: { time: '3일 → 30초', accuracy: '95%' },
    url: 'https://desk.scoutmanager.io/',
    color: '#00ff88',
    icon: '🎯',
    position: { x: 20, y: 30 },
    mobilePosition: { x: 25, y: 22 },
    from: ['pain'],
  },
  {
    id: 'infleos',
    type: 'product',
    year: '2023',
    title: 'Infleos',
    subtitle: 'FULL-FUNNEL CAMPAIGN',
    description: '캠페인의 처음부터 끝까지',
    details: [
      '인플루언서 계약 자동화',
      '콘텐츠 승인 워크플로우',
      '성과 대시보드',
      'ROI 실시간 추적',
    ],
    metrics: { efficiency: '70% 업무 감소', roi: '3.2x 개선' },
    url: 'https://infleos.io/',
    color: '#00d4ff',
    icon: '📊',
    position: { x: 50, y: 45 },
    mobilePosition: { x: 50, y: 38 },
    from: ['scout'],
  },
  {
    id: 'getcare',
    type: 'product',
    year: '2024',
    title: 'GetCareKorea',
    subtitle: 'MEDICAL TOURISM PLATFORM',
    description: '외국인 환자의 한국 의료 여정',
    details: [
      '병원 매칭 & 예약',
      '비자/숙소/통역 원스톱',
      '실시간 번역 상담',
      '사후 관리 시스템',
    ],
    metrics: { countries: '50+ 국가', satisfaction: '4.9/5' },
    url: 'https://getcarekorea.com/en',
    color: '#f472b6',
    icon: '🏥',
    position: { x: 80, y: 30 },
    mobilePosition: { x: 75, y: 22 },
    from: ['pain'],
  },
  {
    id: 'csflow',
    type: 'product',
    year: '2024',
    title: 'CS Flow',
    subtitle: 'AI CUSTOMER SERVICE',
    description: 'CS의 90%를 AI가 처리',
    details: [
      '다국어 자동 응대 (12개 언어)',
      '의료 전문 용어 학습',
      '감정 분석 & 에스컬레이션',
      '24/7 무중단 서비스',
    ],
    metrics: { automation: '90%', languages: '12개' },
    url: 'https://cs-admin.afformation.co.kr/',
    color: '#ffd93d',
    icon: '💬',
    position: { x: 35, y: 65 },
    mobilePosition: { x: 30, y: 55 },
    from: ['infleos', 'getcare'],
  },
  {
    id: 'vibeops',
    type: 'hub',
    year: '2025',
    title: 'VibeOps',
    subtitle: 'UNIFIED OPERATIONS HUB',
    description: '모든 것이 연결되는 곳',
    details: [
      '전 제품 데이터 통합',
      'AI 인사이트 대시보드',
      '자동화 워크플로우 빌더',
      '실시간 알림 & 리포트',
    ],
    metrics: { integration: '100%', realtime: '실시간' },
    url: '#',
    color: '#c084fc',
    icon: '⚡',
    position: { x: 65, y: 80 },
    mobilePosition: { x: 70, y: 55 },
    from: ['scout', 'infleos', 'getcare', 'csflow'],
  },
];

// SVG 연결선 컴포넌트
function ConnectionLines({ activeNode, isMobile }: { activeNode: string | null; isMobile: boolean }) {
  const connections = [
    { from: 'pain', to: 'scout', color: '#ff6b6b' },
    { from: 'pain', to: 'getcare', color: '#ff6b6b' },
    { from: 'scout', to: 'infleos', color: '#00ff88' },
    { from: 'infleos', to: 'csflow', color: '#00d4ff' },
    { from: 'getcare', to: 'csflow', color: '#f472b6' },
    { from: 'scout', to: 'vibeops', color: '#00ff88' },
    { from: 'infleos', to: 'vibeops', color: '#00d4ff' },
    { from: 'getcare', to: 'vibeops', color: '#f472b6' },
    { from: 'csflow', to: 'vibeops', color: '#ffd93d' },
  ];

  const scale = 10; // 0-100 -> 0-1000 viewBox

  const getNodePosition = (id: string) => {
    const node = JOURNEY_NODES.find(n => n.id === id);
    if (!node) return { x: 50, y: 50 };
    return isMobile ? node.mobilePosition : node.position;
  };

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      viewBox="0 0 1000 1000"
      preserveAspectRatio="none"
    >
      <defs>
        {connections.map((conn, i) => (
          <linearGradient key={`grad-${i}`} id={`gradient-${conn.from}-${conn.to}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={conn.color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={JOURNEY_NODES.find(n => n.id === conn.to)?.color || '#fff'} stopOpacity="0.8" />
          </linearGradient>
        ))}
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {connections.map((conn, i) => {
        const from = getNodePosition(conn.from);
        const to = getNodePosition(conn.to);
        const isActive = activeNode === conn.from || activeNode === conn.to;

        const fx = from.x * scale;
        const fy = from.y * scale;
        const tx = to.x * scale;
        const ty = to.y * scale;
        const mx = (fx + tx) / 2;
        const my = (fy + ty) / 2 - 80;

        return (
          <motion.path
            key={i}
            d={`M ${fx} ${fy} Q ${mx} ${my} ${tx} ${ty}`}
            fill="none"
            stroke={`url(#gradient-${conn.from}-${conn.to})`}
            strokeWidth={isActive ? 3 : 1.5}
            strokeDasharray={isActive ? "0" : "5,5"}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: isActive ? 1 : 0.3,
            }}
            transition={{ duration: 1.5, delay: i * 0.1 }}
            filter={isActive ? "url(#glow)" : undefined}
          />
        );
      })}

      {/* 데이터 흐름 애니메이션 */}
      {connections.map((conn, i) => {
        const from = getNodePosition(conn.from);
        const to = getNodePosition(conn.to);
        const isActive = activeNode === conn.from || activeNode === conn.to;

        if (!isActive) return null;

        const fx = from.x * scale;
        const fy = from.y * scale;
        const tx = to.x * scale;
        const ty = to.y * scale;
        const mx = (fx + tx) / 2;
        const my = (fy + ty) / 2 - 80;

        return (
          <motion.circle
            key={`flow-${i}`}
            r="5"
            fill={conn.color}
            filter="url(#glow)"
          >
            <animateMotion
              dur="2s"
              repeatCount="indefinite"
              path={`M ${fx} ${fy} Q ${mx} ${my} ${tx} ${ty}`}
            />
          </motion.circle>
        );
      })}
    </svg>
  );
}

// 노드 컴포넌트
function JourneyNode({
  node,
  isActive,
  onClick,
  isMobile,
}: {
  node: typeof JOURNEY_NODES[0];
  isActive: boolean;
  onClick: () => void;
  isMobile: boolean;
}) {
  const pos = isMobile ? node.mobilePosition : node.position;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: JOURNEY_NODES.indexOf(node) * 0.15 }}
      className="absolute cursor-pointer group"
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: isActive ? 20 : 10,
      }}
      onClick={onClick}
    >
      {/* 노드 본체 */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={isActive ? {
          boxShadow: `0 0 40px ${node.color}60`,
          scale: 1.1,
        } : {}}
        className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${
          node.type === 'hub' ? 'bg-gradient-to-br from-[#c084fc]/30 to-[#00ff88]/30' :
          node.type === 'origin' ? 'bg-[#ff6b6b]/20' : 'bg-[#111]'
        }`}
        style={{
          border: `2px solid ${isActive ? node.color : '#333'}`,
        }}
      >
        <span className="text-xl sm:text-2xl md:text-3xl">{node.icon}</span>
        <span className="text-[8px] sm:text-[10px] md:text-xs font-bold text-white mt-1 text-center px-1 leading-tight">
          {node.title}
        </span>

        {/* 연도 배지 */}
        <div
          className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-mono"
          style={{ backgroundColor: node.color, color: '#000' }}
        >
          {node.year}
        </div>

        {/* 호버/활성 글로우 */}
        <div
          className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}
          style={{
            boxShadow: `inset 0 0 20px ${node.color}40`,
          }}
        />
      </motion.div>

      {/* 부제목 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0.5 }}
        className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap"
      >
        <span className="text-[10px] font-mono" style={{ color: node.color }}>
          {node.subtitle}
        </span>
      </motion.div>
    </motion.div>
  );
}

// 상세 정보 패널
function DetailPanel({ node, onClose }: { node: typeof JOURNEY_NODES[0] | null; onClose: () => void }) {
  if (!node) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="absolute left-2 right-2 bottom-2 md:left-auto md:right-4 md:top-4 md:bottom-4 md:w-80 max-h-[55%] md:max-h-none bg-[#0a0a0a]/95 backdrop-blur-xl border border-[#222] rounded-2xl overflow-hidden z-30"
    >
      {/* 헤더 */}
      <div className="p-4 border-b border-[#222]" style={{ backgroundColor: `${node.color}10` }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{node.icon}</span>
            <div>
              <h3 className="font-bold text-white">{node.title}</h3>
              <span className="text-xs font-mono" style={{ color: node.color }}>{node.subtitle}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
        </div>
      </div>

      {/* 본문 */}
      <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100%-80px)]">
        <p className="text-gray-300">{node.description}</p>

        {/* 주요 기능 */}
        <div>
          <h4 className="text-xs font-mono text-gray-500 mb-2">FEATURES</h4>
          <ul className="space-y-2">
            {node.details.map((detail, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-2 text-sm text-gray-400"
              >
                <span style={{ color: node.color }}>→</span>
                {detail}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* 메트릭스 */}
        {node.metrics && (
          <div>
            <h4 className="text-xs font-mono text-gray-500 mb-2">IMPACT</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(node.metrics).map(([key, value], i) => (
                <div key={i} className="bg-[#111] rounded-lg p-3 text-center">
                  <div className="text-lg font-bold" style={{ color: node.color }}>{value}</div>
                  <div className="text-[10px] text-gray-500 uppercase">{key}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* URL */}
        {node.url && (
          <a
            href={node.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 rounded-lg text-center font-mono text-sm transition-all hover:brightness-110"
            style={{ backgroundColor: node.color, color: '#000' }}
          >
            Visit {node.title} →
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function ProductJourney() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isMobile = useIsMobile();

  const selectedNode = activeNode ? JOURNEY_NODES.find(n => n.id === activeNode) || null : null;

  return (
    <div ref={ref} className="relative w-full h-[550px] sm:h-[700px] md:h-[800px]">
      {/* 배경 그리드 */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `
          linear-gradient(rgba(0,255,136,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,136,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
      }} />

      {/* 연결선 */}
      {isInView && <ConnectionLines activeNode={activeNode} isMobile={isMobile} />}

      {/* 노드들 */}
      {isInView && JOURNEY_NODES.map((node) => (
        <JourneyNode
          key={node.id}
          node={node}
          isActive={activeNode === node.id}
          onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
          isMobile={isMobile}
        />
      ))}

      {/* 상세 정보 패널 */}
      <AnimatePresence>
        {selectedNode && (
          <DetailPanel node={selectedNode} onClose={() => setActiveNode(null)} />
        )}
      </AnimatePresence>

      {/* 범례 */}
      <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 flex items-center gap-3 sm:gap-6 text-[10px] sm:text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#ff6b6b]" />
          <span>Pain Point</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#00ff88]" />
          <span>Product</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#c084fc]" />
          <span>Hub</span>
        </div>
      </div>

      {/* 안내 */}
      {!activeNode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-4 right-4 text-xs text-gray-500 font-mono"
        >
          노드를 클릭하여 자세히 보기
        </motion.div>
      )}
    </div>
  );
}
