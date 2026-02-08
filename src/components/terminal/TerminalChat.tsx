'use client';

import { useState, useRef, useEffect, KeyboardEvent, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'system' | 'error' | 'ascii';
  content: string;
  color?: string;
}

interface TerminalChatProps {
  onNavigate?: (sectionId: string) => void;
}

// 슬래시 명령어 목록 (자동완성용)
const SLASH_COMMANDS = [
  { cmd: '/journey', desc: '전체 여정 보기', icon: '📖' },
  { cmd: '/story', desc: '시작 이야기 요약', icon: '📖' },
  { cmd: '/timeline', desc: '연도별 타임라인', icon: '📅' },
  { cmd: '/products', desc: '제품 생태계', icon: '🚀' },
  { cmd: '/scout', desc: 'Scout Manager 상세', icon: '🎯' },
  { cmd: '/infleos', desc: 'Infleos 상세', icon: '📊' },
  { cmd: '/getcare', desc: 'GetCareKorea 상세', icon: '🏥' },
  { cmd: '/csflow', desc: 'CS Flow AI 상세', icon: '💬' },
  { cmd: '/vibeops', desc: 'VibeOps 상세', icon: '⚡' },
  { cmd: '/flow', desc: '데이터 흐름도', icon: '🔄' },
  { cmd: '/metrics', desc: '핵심 지표', icon: '📊' },
  { cmd: '/proof', desc: '실적과 숫자', icon: '📈' },
  { cmd: '/team', desc: '팀 소개 (LangGraph)', icon: '👥' },
  { cmd: '/apply', desc: 'Hashed Vibe Labs 지원', icon: '🎯' },
  { cmd: '/about', desc: '회사 소개', icon: 'ℹ️' },
];

// ASCII Art
const ASCII_LOGO = `
   █████╗ ███████╗███████╗ ██████╗ ██████╗ ███╗   ███╗ █████╗ ████████╗██╗ ██████╗ ███╗   ██╗
  ██╔══██╗██╔════╝██╔════╝██╔═══██╗██╔══██╗████╗ ████║██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║
  ███████║█████╗  █████╗  ██║   ██║██████╔╝██╔████╔██║███████║   ██║   ██║██║   ██║██╔██╗ ██║
  ██╔══██║██╔══╝  ██╔══╝  ██║   ██║██╔══██╗██║╚██╔╝██║██╔══██║   ██║   ██║██║   ██║██║╚██╗██║
  ██║  ██║██║     ██║     ╚██████╔╝██║  ██║██║ ╚═╝ ██║██║  ██║   ██║   ██║╚██████╔╝██║ ╚████║
  ╚═╝  ╚═╝╚═╝     ╚═╝      ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
`;

// 명령어 정의
const COMMANDS: Record<string, { description: string; output: string[]; navigate?: string }> = {
  help: {
    description: '사용 가능한 명령어 목록',
    output: [
      '┌───────────────────────────────────────────────────────────────────┐',
      '│  AFFORMATION CODE - Available Commands                            │',
      '├───────────────────────────────────────────────────────────────────┤',
      '│                                                                   │',
      '│  📖 STORY                                                         │',
      '│  ────────────────────────────────────────────────────────────     │',
      '│  /journey     전체 여정 보기 (스크롤 스토리)                      │',
      '│  /story       시작 이야기 요약                                    │',
      '│  /timeline    연도별 타임라인                                     │',
      '│                                                                   │',
      '│  🚀 PRODUCTS                                                      │',
      '│  ────────────────────────────────────────────────────────────     │',
      '│  /products    제품 생태계 (그래프 뷰)                             │',
      '│  /scout       Scout Manager 상세                                  │',
      '│  /infleos     Infleos 상세                                        │',
      '│  /getcare     GetCareKorea 상세                                   │',
      '│  /csflow      CS Flow AI 상세                                     │',
      '│  /vibeops     VibeOps 상세                                        │',
      '│  /flow        데이터 흐름도                                       │',
      '│                                                                   │',
      '│  📊 PROOF                                                         │',
      '│  ────────────────────────────────────────────────────────────     │',
      '│  /metrics     핵심 지표                                           │',
      '│  /proof       실적과 숫자                                         │',
      '│                                                                   │',
      '│  👥 TEAM                                                           │',
      '│  ────────────────────────────────────────────────────────────     │',
      '│  /team        팀 소개 (LangGraph)                                │',
      '│                                                                   │',
      '│  🎯 ACTION                                                        │',
      '│  ────────────────────────────────────────────────────────────     │',
      '│  /apply       Hashed Vibe Labs 지원                              │',
      '│  /about       회사 소개                                           │',
      '│  clear        터미널 초기화                                       │',
      '│                                                                   │',
      '└───────────────────────────────────────────────────────────────────┘',
    ],
  },
  '/story': {
    description: '우리의 시작 이야기',
    output: [
      '',
      '  ╔══════════════════════════════════════════════════════════╗',
      '  ║  CHAPTER 01: THE ORIGIN                                  ║',
      '  ╚══════════════════════════════════════════════════════════╝',
      '',
      '  2015년, 해외환자유치에서 시작했습니다.',
      '',
      '  • 인플루언서 마케팅 → Scout Manager 탄생',
      '  • 해외 CS 업무 → CS Flow AI 개발',
      '  • 캠페인 관리 → Infleos 런칭',
      '  • 의료관광 → GetCareKorea 오픈',
      '',
      '  10년간 100+ 병원과 함께하며 쌓은 노하우를',
      '  AI 프로덕트로 전환했습니다.',
      '',
      '  → 섹션으로 이동하려면 Enter를 누르세요',
    ],
    navigate: 'origin',
  },
  '/problems': {
    description: '해결한 문제들',
    output: [
      '',
      '  ╔══════════════════════════════════════════════════════════╗',
      '  ║  CHAPTER 02: PROBLEMS → SOLUTIONS                        ║',
      '  ╚══════════════════════════════════════════════════════════╝',
      '',
      '  [PROBLEM 1] 인플루언서 찾기가 너무 어렵다',
      '  └─ SOLUTION: Scout Manager (AI 인플루언서 매칭)',
      '',
      '  [PROBLEM 2] CS 응대에 인력이 너무 많이 든다',
      '  └─ SOLUTION: CS Flow (AI 자동 응대)',
      '',
      '  [PROBLEM 3] 캠페인 관리가 파편화되어 있다',
      '  └─ SOLUTION: Infleos (풀퍼널 통합 관리)',
      '',
      '  [PROBLEM 4] 외국인 환자 유치 플랫폼이 없다',
      '  └─ SOLUTION: GetCareKorea (의료관광 플랫폼)',
      '',
      '  → 섹션으로 이동하려면 Enter를 누르세요',
    ],
    navigate: 'problems',
  },
  '/products': {
    description: '제품 생태계',
    output: [
      '',
      '  ╔══════════════════════════════════════════════════════════╗',
      '  ║  CHAPTER 03: THE ECOSYSTEM                               ║',
      '  ╚══════════════════════════════════════════════════════════╝',
      '',
      '  ┌──────────────────┬────────────────────────────────┐',
      '  │ Scout Manager    │ AI 인플루언서 마케팅 플랫폼    │',
      '  │ Infleos          │ 풀퍼널 캠페인 관리             │',
      '  │ GetCareKorea     │ 외국인 의료관광 플랫폼         │',
      '  │ CS Flow          │ AI CS 자동화                   │',
      '  │ VibeOps          │ 통합 오퍼레이션                │',
      '  │ Afformation      │ 마케팅 에이전시                │',
      '  └──────────────────┴────────────────────────────────┘',
      '',
      '  모든 제품이 데이터로 연결된 생태계',
      '  Scout → Infleos → GetCare → CS Flow → VibeOps',
      '',
      '  → 섹션으로 이동하려면 Enter를 누르세요',
    ],
    navigate: 'ecosystem',
  },
  '/proof': {
    description: '실적과 숫자',
    output: [
      '',
      '  ╔══════════════════════════════════════════════════════════╗',
      '  ║  CHAPTER 04: THE PROOF                                   ║',
      '  ╚══════════════════════════════════════════════════════════╝',
      '',
      '  피치덱이 아니라, 숫자가 말합니다.',
      '',
      '  ┌─────────────┬─────────────┬─────────────┬─────────────┐',
      '  │   30+       │   100억+    │   3개국     │   6개       │',
      '  │  파트너사   │  누적 매출  │  글로벌     │  라이브     │',
      '  └─────────────┴─────────────┴─────────────┴─────────────┘',
      '',
      '  • 실제 운영 중인 6개 프로덕트',
      '  • 대한민국, 일본, 베트남 진출',
      '  • Claude Opus 4.5 기반 AI Native 개발',
      '',
      '  → 섹션으로 이동하려면 Enter를 누르세요',
    ],
    navigate: 'proof',
  },
  '/vision': {
    description: '비전과 로드맵',
    output: [
      '',
      '  ╔══════════════════════════════════════════════════════════╗',
      '  ║  CHAPTER 05: THE VISION                                  ║',
      '  ╚══════════════════════════════════════════════════════════╝',
      '',
      '  2015 ──── 해외환자유치 시작',
      '    │',
      '  2018 ──── 100+ 병원 경험 축적',
      '    │',
      '  2023 ──── AI Native 전환',
      '    │',
      '  2024 ──── SaaS 프로덕트 런칭',
      '    │',
      '  2025 ──── 풀스택 AI 확장',
      '    │',
      '  2026 ──── Hashed Vibe Labs ★',
      '',
      '  🚀 8주 후, ARR이 말해줄 것입니다.',
      '',
      '  → 섹션으로 이동하려면 Enter를 누르세요',
    ],
    navigate: 'vision',
  },
  '/apply': {
    description: 'Hashed Vibe Labs 지원',
    output: [
      '',
      '  ╔══════════════════════════════════════════════════════════╗',
      '  ║  CHAPTER 06: THE CALL                                    ║',
      '  ╚══════════════════════════════════════════════════════════╝',
      '',
      '  "마케팅을 알고 코드를 짜는 조직"',
      '',
      '  이 여정을 함께 하시겠습니까?',
      '',
      '  ┌─────────────────────────────────────────────────────────┐',
      '  │  🚀 APPLY TO HASHED VIBE LABS 2026                      │',
      '  │                                                         │',
      '  │  Website: afformation.co.kr                             │',
      '  │  Email: contact@afformation.co.kr                       │',
      '  └─────────────────────────────────────────────────────────┘',
      '',
      '  → 섹션으로 이동하려면 Enter를 누르세요',
    ],
    navigate: 'cta',
  },
  '/team': {
    description: '팀 소개',
    output: [
      '',
      '  ╔══════════════════════════════════════════════════════════╗',
      '  ║  👥 THE TEAM — 3인의 LangGraph                          ║',
      '  ╚══════════════════════════════════════════════════════════╝',
      '',
      '  각 노드가 독립적으로 실행하고, 네트워크로 상호작용합니다.',
      '  전원 풀타임 · 전원 바이브코딩 · 전원 실행형',
      '',
      '  ┌──────────────────────────────────────────────────────────┐',
      '  │  지웅근 (Co-CEO)           지현근 (Co-CEO)               │',
      '  │  ├─ 조직 관리 / HR          ├─ 유효타 마케팅              │',
      '  │  ├─ 대외 영업               ├─ 영업 전략                  │',
      '  │  ├─ 경영 전략               ├─ DB 구축 (300만+)           │',
      '  │  └─ 바이브코딩              ├─ 바이브코딩                 │',
      '  │                             └─ LLM 깊은 이해             │',
      '  │                                                          │',
      '  │              강철현 (CFO / 이사)                          │',
      '  │              ├─ 회계 / 재무 전략                          │',
      '  │              ├─ SaaS 영업                                │',
      '  │              ├─ 바이브코딩                                │',
      '  │              └─ 실무 오퍼레이션                           │',
      '  └──────────────────────────────────────────────────────────┘',
      '',
      '  "우리는 3명이지만, AI와 함께 30명의 일을 합니다."',
      '',
      '  → 섹션으로 이동하려면 Enter를 누르세요',
    ],
    navigate: 'team',
  },
  '/about': {
    description: '회사 소개',
    output: [
      '',
      '  ┌─────────────────────────────────────────────────────────┐',
      '  │  주식회사 어포메이션 (Afformation Inc.)                 │',
      '  ├─────────────────────────────────────────────────────────┤',
      '  │  Founded: 2015                                          │',
      '  │  CEO: 정현균                                            │',
      '  │  Focus: AI Native SaaS Products                         │',
      '  │  Tech Stack: Next.js, Claude API, TypeScript            │',
      '  │  Development: Claude Code (Opus 4.5) + bkit PDCA        │',
      '  └─────────────────────────────────────────────────────────┘',
      '',
      '  "We know marketing. We write code."',
      '',
    ],
  },
  '/journey': {
    description: '전체 여정',
    output: [
      '',
      '  ╔══════════════════════════════════════════════════════════╗',
      '  ║  THE COMPLETE JOURNEY                                    ║',
      '  ╚══════════════════════════════════════════════════════════╝',
      '',
      '  해외환자유치에서 VibeOps까지,',
      '  10년간의 여정을 스크롤로 경험하세요.',
      '',
      '  PROLOGUE ─── 2015: 모든 것의 시작',
      '      │',
      '  CHAPTER 01 ─ 2018-2022: 100개의 병원, 1000번의 삽질',
      '      │',
      '  CHAPTER 02 ─ 2023.03: Scout Manager 탄생',
      '      │',
      '  CHAPTER 03 ─ 2023.09: Infleos 런칭',
      '      │',
      '  CHAPTER 04 ─ 2024.02: GetCareKorea 오픈',
      '      │',
      '  CHAPTER 05 ─ 2024.08: CS Flow AI',
      '      │',
      '  CHAPTER 06 ─ 2025.01: VibeOps',
      '      │',
      '  EPILOGUE ─── 2026: Hashed Vibe Labs',
      '',
      '  → 섹션으로 이동하려면 Enter를 누르세요',
    ],
    navigate: 'journey',
  },
  '/timeline': {
    description: '연도별 타임라인',
    output: [
      '',
      '  ══════════════════════════════════════════════════════════',
      '   AFFORMATION TIMELINE: 10 YEARS OF INNOVATION',
      '  ══════════════════════════════════════════════════════════',
      '',
      '  2015 ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 2026',
      '',
      '  2015  ▓▓  해외환자유치 사업 시작',
      '        │   └─ 모든 것을 수동으로, 처음부터 끝까지',
      '        │',
      '  2018  ▓▓  100+ 병원 파트너십 달성',
      '        │   └─ 현장에서 배운 진짜 문제들',
      '        │',
      '  2023  ▓▓  AI 전환 선언 & Scout Manager 런칭',
      '        │   └─ 인플루언서 매칭 3일 → 30초',
      '        │',
      '        ▓▓  Infleos 런칭',
      '        │   └─ 풀퍼널 캠페인 관리 통합',
      '        │',
      '  2024  ▓▓  GetCareKorea 오픈',
      '        │   └─ B2B → B2C 확장',
      '        │',
      '        ▓▓  CS Flow AI 런칭',
      '        │   └─ CS 자동화 90% 달성',
      '        │',
      '  2025  ▓▓  VibeOps 런칭',
      '        │   └─ 전 제품 데이터 통합',
      '        │',
      '  2026  ★   Hashed Vibe Labs 지원',
      '            └─ 다음 챕터의 시작',
      '',
    ],
  },
  '/scout': {
    description: 'Scout Manager 상세',
    output: [
      '',
      '  ╔══════════════════════════════════════════════════════════╗',
      '  ║  🎯 SCOUT MANAGER                                        ║',
      '  ║  AI-Powered Influencer Marketing Platform                ║',
      '  ╚══════════════════════════════════════════════════════════╝',
      '',
      '  ┌─ THE PROBLEM ─────────────────────────────────────────┐',
      '  │  인플루언서 찾기 = 3일의 노가다                       │',
      '  │  가짜 팔로워 구분 = 불가능                            │',
      '  │  성과 예측 = 감에 의존                                │',
      '  └──────────────────────────────────────────────────────┘',
      '',
      '  ┌─ THE SOLUTION ────────────────────────────────────────┐',
      '  │  ✓ 300만+ 인플루언서 데이터베이스                     │',
      '  │  ✓ AI 기반 브랜드-인플루언서 매칭                     │',
      '  │  ✓ 가짜 팔로워 탐지 시스템                            │',
      '  │  ✓ 캠페인 성과 예측 엔진                              │',
      '  │  ✓ 실시간 ROI 트래킹                                  │',
      '  └──────────────────────────────────────────────────────┘',
      '',
      '  ┌─ IMPACT ──────────────────────────────────────────────┐',
      '  │  매칭 시간:  3일      →  30초     (99.9% 단축)        │',
      '  │  매칭 정확도: 60%     →  95%      (+58% 향상)         │',
      '  │  비용:       200만/건 →  29만/월  (85% 절감)          │',
      '  └──────────────────────────────────────────────────────┘',
      '',
      '  ┌─ LIVE TRACTION ──────────────────────────────────────┐',
      '  │  ✓ 80+ 잠재 리드 수집 완료                           │',
      '  │  ✓ 캠페인별 Cronjob 자동 추출/리스트업/시딩 운영     │',
      '  │  ✓ 인플루언서 인입 관리까지 통합 파이프라인           │',
      '  │  ✓ 우리가 직접 매일 쓰고 있는 서비스                  │',
      '  └──────────────────────────────────────────────────────┘',
      '',
      '  🔗 https://desk.scoutmanager.io/',
      '',
    ],
  },
  '/infleos': {
    description: 'Infleos 상세',
    output: [
      '',
      '  ╔══════════════════════════════════════════════════════════╗',
      '  ║  📊 INFLEOS                                              ║',
      '  ║  Full-Funnel Campaign Management                         ║',
      '  ╚══════════════════════════════════════════════════════════╝',
      '',
      '  ┌─ THE PROBLEM ─────────────────────────────────────────┐',
      '  │  인플루언서 찾기 → Scout (해결됨)                     │',
      '  │  그 다음은?                                           │',
      '  │  계약, 콘텐츠 관리, 정산, 성과 추적...                │',
      '  │  또 다시 엑셀 지옥                                    │',
      '  └──────────────────────────────────────────────────────┘',
      '',
      '  ┌─ THE SOLUTION ────────────────────────────────────────┐',
      '  │  ✓ 계약서 자동 생성 & 전자 서명                       │',
      '  │  ✓ 콘텐츠 승인 워크플로우                             │',
      '  │  ✓ 자동 정산 시스템                                   │',
      '  │  ✓ 실시간 성과 대시보드                               │',
      '  │  ✓ A/B 테스트 & 최적화 추천                           │',
      '  └──────────────────────────────────────────────────────┘',
      '',
      '  ┌─ IMPACT ──────────────────────────────────────────────┐',
      '  │  업무 시간:   주 40시간  →  주 12시간 (70% 절감)      │',
      '  │  ROI 추적:    월말 정산  →  실시간                    │',
      '  │  사용 도구:   5개        →  1개      (80% 통합)       │',
      '  └──────────────────────────────────────────────────────┘',
      '',
      '  ┌─ LIVE TRACTION ──────────────────────────────────────┐',
      '  │  ✓ 전사 사용 중 — 인플루언서 소통 전 과정 통합       │',
      '  │  ✓ 인입 → 소통 → 모델등록 → 관리 → 컨텐츠제안       │',
      '  │  ✓ → 컨텐츠분석 → 2차관리 토탈 워크플로우            │',
      '  │  ✓ 고객사 니즈 100% 파악 — 겉치레 아닌 실전 도구     │',
      '  └──────────────────────────────────────────────────────┘',
      '',
      '  🔗 https://infleos.io/',
      '',
    ],
  },
  '/getcare': {
    description: 'GetCareKorea 상세',
    output: [
      '',
      '  ╔══════════════════════════════════════════════════════════╗',
      '  ║  🏥 GETCAREKOREA                                         ║',
      '  ║  Medical Tourism Platform for International Patients     ║',
      '  ╚══════════════════════════════════════════════════════════╝',
      '',
      '  ┌─ THE PROBLEM ─────────────────────────────────────────┐',
      '  │  외국인 환자의 한국 의료 여정:                        │',
      '  │  병원 찾기 → 예약 → 비자 → 숙소 → 통역 → 사후관리    │',
      '  │  모든 게 분리되어 있고, 연결되지 않음                 │',
      '  └──────────────────────────────────────────────────────┘',
      '',
      '  ┌─ THE SOLUTION ────────────────────────────────────────┐',
      '  │  ✓ AI 병원 매칭 & 실시간 예약                         │',
      '  │  ✓ 비자/숙소/통역 원스톱 서비스                       │',
      '  │  ✓ 12개 언어 실시간 번역 상담                         │',
      '  │  ✓ 사후 관리 & 팔로업 시스템                          │',
      '  │  ✓ 의료 기록 통합 관리                                │',
      '  └──────────────────────────────────────────────────────┘',
      '',
      '  ┌─ IMPACT ──────────────────────────────────────────────┐',
      '  │  커버 국가:   5개국   →  50+ 개국  (10x 확장)         │',
      '  │  예약 전환율: 15%     →  45%       (3x 향상)          │',
      '  │  고객 만족도: 4.2/5   →  4.9/5     (+17%)             │',
      '  └──────────────────────────────────────────────────────┘',
      '',
      '  🔗 https://getcarekorea.com/en',
      '',
    ],
  },
  '/csflow': {
    description: 'CS Flow AI 상세',
    output: [
      '',
      '  ╔══════════════════════════════════════════════════════════╗',
      '  ║  💬 CS FLOW AI                                           ║',
      '  ║  AI-Powered Customer Service Automation                  ║',
      '  ╚══════════════════════════════════════════════════════════╝',
      '',
      '  ┌─ THE PROBLEM ─────────────────────────────────────────┐',
      '  │  외국인 고객 = 24시간 문의                            │',
      '  │  시차 = 새벽 3시에도 대기                             │',
      '  │  다국어 = 통역사 고용 비용                            │',
      '  │  우리는 잠을 잘 수 없었습니다                         │',
      '  └──────────────────────────────────────────────────────┘',
      '',
      '  ┌─ THE SOLUTION ────────────────────────────────────────┐',
      '  │  ✓ 12개 언어 자동 응대                                │',
      '  │  ✓ 의료 전문 용어 학습 AI                             │',
      '  │  ✓ 감정 분석 & 자동 에스컬레이션                      │',
      '  │  ✓ 24/7 무중단 서비스                                 │',
      '  │  ✓ 상담 히스토리 통합 관리                            │',
      '  └──────────────────────────────────────────────────────┘',
      '',
      '  ┌─ IMPACT ──────────────────────────────────────────────┐',
      '  │  자동 응대율: 0%       →  90%      (무한 개선)        │',
      '  │  응답 시간:   평균4시간 →  즉시     (99.9% 단축)      │',
      '  │  지원 언어:   3개      →  12개     (4x 확장)          │',
      '  └──────────────────────────────────────────────────────┘',
      '',
      '  "드디어 잠을 잘 수 있게 되었습니다."',
      '',
      '  🔗 https://cs-admin.afformation.co.kr/',
      '',
    ],
  },
  '/vibeops': {
    description: 'VibeOps 상세',
    output: [
      '',
      '  ╔══════════════════════════════════════════════════════════╗',
      '  ║  ⚡ VIBEOPS                                               ║',
      '  ║  Unified Operations Hub - Where Everything Connects      ║',
      '  ╚══════════════════════════════════════════════════════════╝',
      '',
      '  ┌─ THE FINAL PIECE ─────────────────────────────────────┐',
      '  │  Scout, Infleos, GetCare, CS Flow...                  │',
      '  │  각각은 훌륭했지만, 따로 놀고 있었습니다              │',
      '  │  데이터는 각 제품에 분산되어 있었고                   │',
      '  │  전체 그림을 볼 수 없었습니다                         │',
      '  └──────────────────────────────────────────────────────┘',
      '',
      '  ┌─ THE HUB ─────────────────────────────────────────────┐',
      '  │  ✓ 전 제품 데이터 실시간 통합                         │',
      '  │  ✓ AI 인사이트 대시보드                               │',
      '  │  ✓ 자동화 워크플로우 빌더                             │',
      '  │  ✓ 크로스 프로덕트 분석                               │',
      '  │  ✓ 실시간 알림 & 리포트                               │',
      '  └──────────────────────────────────────────────────────┘',
      '',
      '  ┌─ DATA FLOW ───────────────────────────────────────────┐',
      '  │                                                       │',
      '  │   Scout ──┐                                           │',
      '  │           ├──→ VibeOps ──→ Unified Insights          │',
      '  │  Infleos ─┤         │                                 │',
      '  │           │         ↓                                 │',
      '  │  GetCare ─┤    AI Analysis                            │',
      '  │           │         │                                 │',
      '  │  CS Flow ─┘         ↓                                 │',
      '  │              Auto Workflows                           │',
      '  │                                                       │',
      '  └──────────────────────────────────────────────────────┘',
      '',
      '  이것이 우리가 만든 생태계입니다.',
      '',
      '  🔗 [준비 중] vibeops.afformation.co.kr (coming soon)',
      '',
    ],
    navigate: 'ecosystem',
  },
  '/flow': {
    description: '데이터 흐름도',
    output: [
      '',
      '  ══════════════════════════════════════════════════════════',
      '   DATA FLOW: THE AFFORMATION ECOSYSTEM',
      '  ══════════════════════════════════════════════════════════',
      '',
      '                    ┌─────────────────┐',
      '                    │   Pain Point    │',
      '                    │   해외환자유치  │',
      '                    └────────┬────────┘',
      '                             │',
      '              ┌──────────────┼──────────────┐',
      '              │              │              │',
      '              ▼              │              ▼',
      '    ┌─────────────────┐     │    ┌─────────────────┐',
      '    │  Scout Manager  │     │    │  GetCareKorea   │',
      '    │  인플루언서 발굴 │     │    │  환자 유치      │',
      '    └────────┬────────┘     │    └────────┬────────┘',
      '             │              │             │',
      '             ▼              │             │',
      '    ┌─────────────────┐     │             │',
      '    │    Infleos      │     │             │',
      '    │  캠페인 관리    │     │             │',
      '    └────────┬────────┘     │             │',
      '             │              │             │',
      '             └──────────────┼─────────────┘',
      '                            │',
      '                            ▼',
      '                  ┌─────────────────┐',
      '                  │    CS Flow      │',
      '                  │   AI CS 자동화   │',
      '                  └────────┬────────┘',
      '                           │',
      '                           ▼',
      '                  ┌─────────────────┐',
      '                  │    VibeOps      │',
      '                  │   통합 운영     │',
      '                  │  ═══════════    │',
      '                  │  All Data Here  │',
      '                  └─────────────────┘',
      '',
      '  데이터가 흐르면, 인사이트가 생깁니다.',
      '',
    ],
    navigate: 'ecosystem',
  },
  '/metrics': {
    description: '핵심 지표',
    output: [
      '',
      '  ╔══════════════════════════════════════════════════════════╗',
      '  ║  KEY METRICS - 숫자가 말합니다                           ║',
      '  ╚══════════════════════════════════════════════════════════╝',
      '',
      '  ┌─────────────┬─────────────┬─────────────┬─────────────┐',
      '  │    30+      │   100억+    │    3개국    │    6개      │',
      '  │   파트너    │   누적매출  │   글로벌    │   라이브    │',
      '  │    병원     │             │    진출     │   프로덕트  │',
      '  └─────────────┴─────────────┴─────────────┴─────────────┘',
      '',
      '  ┌─ PRODUCT METRICS ─────────────────────────────────────┐',
      '  │                                                       │',
      '  │  Scout Manager                                        │',
      '  │  └─ 300만+ 인플루언서 DB | 95% 매칭 정확도            │',
      '  │                                                       │',
      '  │  Infleos                                              │',
      '  │  └─ 70% 업무 시간 절감 | 3.2x ROI 개선                │',
      '  │                                                       │',
      '  │  GetCareKorea                                         │',
      '  │  └─ 50+ 국가 커버 | 4.9/5 고객 만족도                 │',
      '  │                                                       │',
      '  │  CS Flow                                              │',
      '  │  └─ 90% 자동 응대율 | 12개 언어 지원                  │',
      '  │                                                       │',
      '  │  VibeOps                                              │',
      '  │  └─ 100% 데이터 통합 | 85% 자동화율                   │',
      '  │                                                       │',
      '  └──────────────────────────────────────────────────────┘',
      '',
      '  → 섹션으로 이동하려면 Enter를 누르세요',
    ],
    navigate: 'proof',
  },
};

export default function TerminalChat({ onNavigate }: TerminalChatProps) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [isBooting, setIsBooting] = useState(true);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // 필터링된 명령어 목록
  const filteredCommands = useMemo(() => {
    if (!input.startsWith('/')) return [];
    const query = input.toLowerCase();
    return SLASH_COMMANDS.filter(c => c.cmd.toLowerCase().startsWith(query));
  }, [input]);

  // 부팅 시퀀스
  useEffect(() => {
    const bootSequence = async () => {
      const bootLines: TerminalLine[] = [
        { id: '1', type: 'system', content: 'AFFORMATION CODE v1.0.0', color: '#00ff88' },
        { id: '2', type: 'system', content: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', color: '#333' },
        { id: '3', type: 'ascii', content: ASCII_LOGO, color: '#00ff88' },
        { id: '4', type: 'system', content: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', color: '#333' },
        { id: '5', type: 'system', content: '', color: '#666' },
        { id: '6', type: 'output', content: '  마케팅을 알고 코드를 짜는 조직, 어포메이션입니다.', color: '#888' },
        { id: '7', type: 'output', content: '  Hashed Vibe Labs 2026에 지원합니다.', color: '#888' },
        { id: '8', type: 'system', content: '', color: '#666' },
        { id: '9', type: 'output', content: '  "/" 를 입력하면 슬래시 명령어가 자동완성됩니다.', color: '#00d4ff' },
        { id: '10', type: 'output', content: '  "help"를 입력하면 전체 명령어 목록을 볼 수 있습니다.', color: '#666' },
        { id: '11', type: 'system', content: '', color: '#666' },
      ];

      for (let i = 0; i < bootLines.length; i++) {
        await new Promise((r) => setTimeout(r, i < 4 ? 100 : 150));
        setLines((prev) => [...prev, bootLines[i]]);
      }
      setIsBooting(false);
    };

    bootSequence();
  }, []);

  // 자동 스크롤
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  // 포커스
  useEffect(() => {
    if (!isBooting) {
      inputRef.current?.focus();
    }
  }, [isBooting]);

  // 자동완성 표시/숨김 처리
  useEffect(() => {
    if (input.startsWith('/') && filteredCommands.length > 0) {
      setShowAutocomplete(true);
      setSelectedIndex(0);
    } else {
      setShowAutocomplete(false);
    }
  }, [input, filteredCommands.length]);

  // 자동완성 명령어 선택
  const selectCommand = (cmd: string) => {
    handleCommand(cmd);
    setInput('');
    setShowAutocomplete(false);
    inputRef.current?.focus();
  };

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();

    // 명령어 입력 라인 추가
    setLines((prev) => [
      ...prev,
      { id: Date.now().toString(), type: 'command', content: `$ ${cmd}` },
    ]);

    if (trimmed === 'clear') {
      setLines([]);
      setLastCommand(null);
      return;
    }

    // Enter만 눌렀을 때 - 이전 명령어의 navigate 실행
    if (trimmed === '' && lastCommand) {
      const command = COMMANDS[lastCommand];
      if (command?.navigate && onNavigate) {
        onNavigate(command.navigate);
      }
      return;
    }

    const command = COMMANDS[trimmed];
    if (command) {
      setLastCommand(trimmed);
      command.output.forEach((line, i) => {
        setTimeout(() => {
          setLines((prev) => [
            ...prev,
            { id: `${Date.now()}-${i}`, type: 'output', content: line, color: '#ccc' },
          ]);
        }, i * 30);
      });
    } else if (trimmed !== '') {
      setLines((prev) => [
        ...prev,
        { id: Date.now().toString(), type: 'error', content: `  Command not found: ${cmd}`, color: '#ff6b6b' },
        { id: `${Date.now()}-hint`, type: 'output', content: '  Type "help" to see available commands.', color: '#666' },
      ]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // 자동완성이 열려있을 때 키보드 네비게이션
    if (showAutocomplete && filteredCommands.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        return;
      }
      if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        selectCommand(filteredCommands[selectedIndex].cmd);
        return;
      }
      if (e.key === 'Escape') {
        setShowAutocomplete(false);
        return;
      }
    }

    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    }
  };

  return (
    <div
      className="w-full h-full bg-[#0a0a0a] rounded-lg border border-[#222] overflow-hidden flex flex-col font-mono text-sm"
      onClick={() => inputRef.current?.focus()}
    >
      {/* 터미널 헤더 */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#111] border-b border-[#222]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
        </div>
        <span className="text-gray-500 text-xs ml-2">afformation-code — zsh — 80×24</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[#00ff88] text-xs">●</span>
          <span className="text-gray-500 text-xs">connected</span>
        </div>
      </div>

      {/* 터미널 출력 영역 */}
      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-1">
        <AnimatePresence mode="popLayout">
          {lines.map((line) => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.1 }}
              className={`whitespace-pre-wrap ${line.type === 'ascii' ? 'text-[10px] md:text-xs leading-none' : ''}`}
              style={{ color: line.color || (line.type === 'command' ? '#00ff88' : '#ccc') }}
            >
              {line.content}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 입력 영역 */}
      {!isBooting && (
        <div className="relative">
          {/* 자동완성 드롭다운 */}
          <AnimatePresence>
            {showAutocomplete && filteredCommands.length > 0 && (
              <motion.div
                ref={autocompleteRef}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full left-0 right-0 mb-1 mx-4 bg-[#1a1a1a] border border-[#333] rounded-lg overflow-hidden shadow-2xl z-50"
              >
                <div className="px-3 py-2 border-b border-[#333] bg-[#111]">
                  <span className="text-[#666] text-xs">슬래시 명령어 · ↑↓ 이동 · Enter 선택 · Esc 닫기</span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {filteredCommands.map((cmd, index) => (
                    <motion.div
                      key={cmd.cmd}
                      onClick={() => selectCommand(cmd.cmd)}
                      className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                        index === selectedIndex
                          ? 'bg-[#00ff88]/10 border-l-2 border-[#00ff88]'
                          : 'hover:bg-[#222] border-l-2 border-transparent'
                      }`}
                      whileHover={{ x: 2 }}
                    >
                      <span className="text-lg">{cmd.icon}</span>
                      <div className="flex-1">
                        <span className={`font-mono ${index === selectedIndex ? 'text-[#00ff88]' : 'text-white'}`}>
                          {cmd.cmd}
                        </span>
                        <span className="text-[#666] text-sm ml-3">{cmd.desc}</span>
                      </div>
                      {index === selectedIndex && (
                        <span className="text-[#00ff88] text-xs">Enter ↵</span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center px-4 py-3 border-t border-[#222] bg-[#0a0a0a]">
            <span className="text-[#00ff88] mr-2">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-white outline-none caret-[#00ff88]"
              placeholder='명령어를 입력하세요... ( "/" 로 시작)'
              autoComplete="off"
              spellCheck={false}
            />
            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="w-2 h-5 bg-[#00ff88] ml-1"
            />
          </div>
        </div>
      )}
    </div>
  );
}
