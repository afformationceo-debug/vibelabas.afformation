'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

// ============================================
// TEAM DATA
// ============================================

interface TeamMember {
  id: string;
  name: string;
  nameEn: string;
  role: string;
  roleEn: string;
  color: string;
  icon: string;
  position: { x: number; y: number };
  capabilities: string[];
  details: {
    title: string;
    items: string[];
  }[];
  quote: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'woonggeun',
    name: '지웅근',
    nameEn: 'Woonggeun Ji',
    role: '공동대표 (Co-CEO)',
    roleEn: 'Co-CEO & Operations',
    color: '#00ff88',
    icon: '👤',
    position: { x: 25, y: 35 },
    capabilities: ['조직 관리', 'HR', '대외 영업', '경영 전략', '바이브코딩'],
    details: [
      {
        title: 'LEADERSHIP',
        items: [
          '조직 설계 및 인력 운영 총괄',
          '대외 파트너십 및 영업 전략 수립',
          '경영 전략 및 사업 방향성 설계',
          '풀타임 코파운더 · 전략적 의사결정',
        ],
      },
      {
        title: 'EXECUTION',
        items: [
          'HR 프로세스 구축 및 팀 빌딩',
          '병원/에이전시 B2B 딜 클로징',
          'Vibe Coding으로 프로덕트 직접 빌딩',
          '3개국 비즈니스 네트워크 운영',
        ],
      },
    ],
    quote: '"조직이 곧 프로덕트다. 사람을 움직이는 것이 코드보다 어렵다."',
  },
  {
    id: 'hyungeun',
    name: '지현근',
    nameEn: 'Hyungeun Ji',
    role: '공동대표 (Co-CEO)',
    roleEn: 'Co-CEO & Tech/Marketing',
    color: '#00d4ff',
    icon: '👤',
    position: { x: 75, y: 35 },
    capabilities: ['유효타 마케팅', '영업 전략', 'DB 구축', '바이브코딩', 'LLM 이해'],
    details: [
      {
        title: 'MARKETING & DATA',
        items: [
          '퍼포먼스 마케팅 전략 설계 및 실행',
          '인플루언서 데이터베이스 300만+ 구축',
          '캠페인 ROI 분석 및 최적화 체계',
          'CRM/마케팅 자동화 파이프라인 설계',
        ],
      },
      {
        title: 'TECH & AI',
        items: [
          'Claude Code + bkit PDCA로 프로덕트 직접 빌딩',
          'LLM 작동원리 깊은 이해 (RAG, Fine-tuning, Prompt Engineering)',
          '마케팅 도메인 + AI 결합한 솔루션 설계',
          '6개 프로덕트의 기술 아키텍처 설계',
        ],
      },
    ],
    quote: '"마케팅을 알아야 진짜 쓸모 있는 코드를 짤 수 있다."',
  },
  {
    id: 'cheolhyun',
    name: '강철현',
    nameEn: 'Cheolhyun Kang',
    role: 'CFO / 이사',
    roleEn: 'CFO & Operations',
    color: '#c084fc',
    icon: '👤',
    position: { x: 50, y: 75 },
    capabilities: ['회계', 'SaaS 영업', '바이브코딩', '실무 오퍼레이션'],
    details: [
      {
        title: 'FINANCE & SALES',
        items: [
          '재무 전략 및 회계 관리 총괄',
          'SaaS 영업 및 고객 온보딩 프로세스',
          '수익 모델 설계 및 유닛 이코노믹스 분석',
          '투자 검토 및 재무 모델링',
        ],
      },
      {
        title: 'OPERATIONS',
        items: [
          '실무 오퍼레이션 프로세스 최적화',
          'Vibe Coding으로 내부 도구 직접 빌딩',
          '고객사 니즈 분석 및 피드백 루프 구축',
          '서비스 운영 및 품질 관리',
        ],
      },
    ],
    quote: '"숫자가 말하지 않으면 아무것도 증명되지 않는다."',
  },
];

// 노드 간 연결 정의
const CONNECTIONS = [
  { from: 'woonggeun', to: 'hyungeun', label: '전략 × 실행', color: '#00ff88' },
  { from: 'hyungeun', to: 'cheolhyun', label: '마케팅 × 재무', color: '#00d4ff' },
  { from: 'cheolhyun', to: 'woonggeun', label: '운영 × 조직', color: '#c084fc' },
];

// ============================================
// CONNECTION LINES (SVG)
// ============================================

function GraphConnections({ activeId }: { activeId: string | null }) {
  // viewBox 기반 좌표계 (0-1000)
  const scale = 10; // position 값(0-100)을 viewBox(0-1000)으로 변환

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      viewBox="0 0 1000 1000"
      preserveAspectRatio="none"
    >
      <defs>
        <filter id="team-glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {CONNECTIONS.map((conn, i) => (
          <linearGradient key={`tg-${i}`} id={`team-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={conn.color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={CONNECTIONS[(i + 1) % CONNECTIONS.length].color} stopOpacity="0.8" />
          </linearGradient>
        ))}
      </defs>

      {CONNECTIONS.map((conn, i) => {
        const fromMember = TEAM_MEMBERS.find((m) => m.id === conn.from)!;
        const toMember = TEAM_MEMBERS.find((m) => m.id === conn.to)!;
        const isActive = activeId === conn.from || activeId === conn.to;

        const fx = fromMember.position.x * scale;
        const fy = fromMember.position.y * scale;
        const tx = toMember.position.x * scale;
        const ty = toMember.position.y * scale;

        // 곡선 중점
        const mx = (fx + tx) / 2;
        const my = (fy + ty) / 2 - 80;

        return (
          <g key={i}>
            <motion.path
              d={`M ${fx} ${fy} Q ${mx} ${my} ${tx} ${ty}`}
              fill="none"
              stroke={`url(#team-grad-${i})`}
              strokeWidth={isActive ? 3 : 1.5}
              strokeDasharray={isActive ? '0' : '8,4'}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: isActive ? 1 : 0.3 }}
              transition={{ duration: 1.5, delay: i * 0.2 }}
              filter={isActive ? 'url(#team-glow)' : undefined}
            />
            {/* 연결 라벨 */}
            {isActive && (
              <motion.text
                x={mx}
                y={my - 15}
                textAnchor="middle"
                fill={conn.color}
                fontSize="24"
                fontFamily="monospace"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {conn.label}
              </motion.text>
            )}
            {/* 데이터 흐름 입자 */}
            {isActive && (
              <motion.circle r="6" fill={conn.color} filter="url(#team-glow)">
                <animateMotion
                  dur="2.5s"
                  repeatCount="indefinite"
                  path={`M ${fx} ${fy} Q ${mx} ${my} ${tx} ${ty}`}
                />
              </motion.circle>
            )}
          </g>
        );
      })}

      {/* 중앙 허브 */}
      <motion.circle
        cx="500"
        cy="480"
        r="12"
        fill="none"
        stroke="#ffffff30"
        strokeWidth="1"
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.text
        x="500"
        y="430"
        textAnchor="middle"
        fill="#ffffff40"
        fontSize="22"
        fontFamily="monospace"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        LANGGRAPH
      </motion.text>
    </svg>
  );
}

// ============================================
// TEAM NODE
// ============================================

function TeamNode({
  member,
  isActive,
  onClick,
}: {
  member: TeamMember;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: TEAM_MEMBERS.indexOf(member) * 0.2 }}
      className="absolute cursor-pointer group"
      style={{
        left: `${member.position.x}%`,
        top: `${member.position.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: isActive ? 20 : 10,
      }}
      onClick={onClick}
    >
      {/* 외곽 펄스 */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{
            boxShadow: [
              `0 0 20px ${member.color}40`,
              `0 0 40px ${member.color}60`,
              `0 0 20px ${member.color}40`,
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ margin: '-4px' }}
        />
      )}

      {/* 노드 본체 */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        animate={isActive ? { scale: 1.05 } : {}}
        className="relative w-28 h-28 md:w-36 md:h-36 rounded-2xl flex flex-col items-center justify-center bg-[#0a0a0a] transition-all duration-300"
        style={{
          border: `2px solid ${isActive ? member.color : '#333'}`,
          boxShadow: isActive ? `0 0 30px ${member.color}40` : 'none',
        }}
      >
        {/* 역할 배지 */}
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-mono whitespace-nowrap"
          style={{ backgroundColor: member.color, color: '#000' }}
        >
          {member.role}
        </div>

        {/* 아이콘 */}
        <div
          className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-2xl mb-1"
          style={{ backgroundColor: `${member.color}20`, border: `1px solid ${member.color}40` }}
        >
          {member.icon}
        </div>

        {/* 이름 */}
        <span className="text-sm md:text-base font-bold text-white">{member.name}</span>
        <span className="text-[10px] text-gray-500 font-mono">{member.nameEn}</span>
      </motion.div>

      {/* 역량 태그 (활성 시) */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-4 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-1 max-w-[200px]"
          >
            {member.capabilities.map((cap, i) => (
              <motion.span
                key={cap}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="px-2 py-0.5 rounded-full text-[10px] font-mono whitespace-nowrap"
                style={{
                  backgroundColor: `${member.color}15`,
                  color: member.color,
                  border: `1px solid ${member.color}30`,
                }}
              >
                {cap}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================
// DETAIL PANEL
// ============================================

function TeamDetailPanel({
  member,
  onClose,
}: {
  member: TeamMember | null;
  onClose: () => void;
}) {
  if (!member) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      className="absolute bottom-0 left-0 right-0 mx-4 mb-4 bg-[#0a0a0a]/95 backdrop-blur-xl border border-[#222] rounded-2xl overflow-hidden z-30 max-h-[60%] overflow-y-auto"
    >
      {/* 헤더 */}
      <div className="sticky top-0 p-4 border-b border-[#222] bg-[#0a0a0a]/95 backdrop-blur-sm" style={{ borderTopColor: member.color, borderTopWidth: '2px' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
              style={{ backgroundColor: `${member.color}20` }}
            >
              {member.icon}
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">
                {member.name}{' '}
                <span className="text-sm text-gray-500 font-normal">{member.nameEn}</span>
              </h3>
              <span className="text-xs font-mono" style={{ color: member.color }}>
                {member.roleEn}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-lg">
            &times;
          </button>
        </div>
      </div>

      {/* 본문 */}
      <div className="p-4 space-y-4">
        {/* 역량 태그 */}
        <div className="flex flex-wrap gap-2">
          {member.capabilities.map((cap) => (
            <span
              key={cap}
              className="px-3 py-1 rounded-full text-xs font-mono"
              style={{
                backgroundColor: `${member.color}15`,
                color: member.color,
                border: `1px solid ${member.color}30`,
              }}
            >
              {cap}
            </span>
          ))}
        </div>

        {/* 상세 정보 */}
        <div className="grid md:grid-cols-2 gap-4">
          {member.details.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="bg-[#111] border border-[#222] rounded-xl p-4"
            >
              <h4 className="text-xs font-mono mb-3" style={{ color: member.color }}>
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                    <span style={{ color: member.color }} className="mt-0.5 flex-shrink-0">
                      &rarr;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* 인용구 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center py-3 border-t border-[#222]"
        >
          <p className="text-sm italic text-gray-400">{member.quote}</p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function TeamGraph() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const activeMember = activeId ? TEAM_MEMBERS.find((m) => m.id === activeId) || null : null;

  return (
    <section
      ref={ref}
      id="team"
      className="relative py-32 bg-gradient-to-b from-black via-[#030308] to-black overflow-hidden"
    >
      {/* 배경 패턴 */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #c084fc 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* 섹션 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-4"
        >
          <span className="text-[#c084fc] font-mono text-sm tracking-[0.3em]">THE TEAM</span>
          <h2 className="text-4xl md:text-6xl font-black text-white mt-4">
            3인의{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-[#00d4ff] to-[#c084fc]">
              LangGraph
            </span>
          </h2>
          <p className="text-xl text-gray-400 mt-4">
            각 노드가 독립적으로 실행하고, 네트워크로 상호작용합니다
          </p>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1 }}
            className="h-[1px] w-full max-w-md mx-auto my-8"
            style={{
              background: 'linear-gradient(90deg, transparent, #c084fc, transparent)',
              boxShadow: '0 0 20px #c084fc40',
            }}
          />
        </motion.div>

        {/* 그래프 설명 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#111] border border-[#222] rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
            <span className="text-xs text-gray-400 font-mono">
              전원 풀타임 &middot; 전원 바이브코딩 &middot; 전원 실행형
            </span>
          </div>
        </motion.div>

        {/* 그래프 영역 */}
        <div className="relative w-full h-[500px] md:h-[600px]">
          {/* 배경 그리드 */}
          <div
            className="absolute inset-0 opacity-15 rounded-2xl"
            style={{
              backgroundImage: `
                linear-gradient(rgba(192,132,252,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(192,132,252,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />

          {/* 연결선 */}
          {isInView && <GraphConnections activeId={activeId} />}

          {/* 노드들 */}
          {isInView &&
            TEAM_MEMBERS.map((member) => (
              <TeamNode
                key={member.id}
                member={member}
                isActive={activeId === member.id}
                onClick={() => setActiveId(activeId === member.id ? null : member.id)}
              />
            ))}

          {/* 상세 정보 패널 */}
          <AnimatePresence>
            {activeMember && (
              <TeamDetailPanel member={activeMember} onClose={() => setActiveId(null)} />
            )}
          </AnimatePresence>

          {/* 안내 */}
          {!activeId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute bottom-4 right-4 text-xs text-gray-500 font-mono"
            >
              노드를 클릭하여 상세 보기
            </motion.div>
          )}

          {/* 범례 */}
          <div className="absolute bottom-4 left-4 flex items-center gap-4 text-[10px] text-gray-600 font-mono">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#00ff88]" />
              <span>Strategy</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#00d4ff]" />
              <span>Tech/Marketing</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#c084fc]" />
              <span>Finance/Ops</span>
            </div>
          </div>
        </div>

        {/* 하단 메시지 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-12 bg-gradient-to-r from-[#00ff88]/10 via-[#00d4ff]/10 to-[#c084fc]/10 border border-[#c084fc]/20 rounded-2xl p-8 text-center"
        >
          <p className="text-lg text-white font-medium mb-2">
            &ldquo;우리는 3명이지만, AI와 함께 30명의 일을 합니다&rdquo;
          </p>
          <p className="text-sm text-gray-500">
            각자가 노드이면서 동시에 에이전트 &mdash; LangGraph처럼 상태를 공유하고, 독립적으로 실행하며, 결과를 통합합니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
