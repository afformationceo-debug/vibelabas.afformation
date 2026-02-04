import { TractionMetric, AICapability } from '@/types';

export const TRACTION_METRICS: TractionMetric[] = [
  {
    id: 'partners',
    value: 30,
    suffix: '+',
    label: '파트너사',
    description: '병원, 에이전시 파트너',
  },
  {
    id: 'revenue',
    value: 100,
    suffix: '억+',
    label: '누적 매출',
    description: '어포메이션 그룹 누적',
  },
  {
    id: 'countries',
    value: 3,
    suffix: '개국',
    label: '진출 국가',
    description: '한국, 미국, 태국',
  },
  {
    id: 'products',
    value: 6,
    suffix: '개',
    label: '프로덕트',
    description: '라이브 서비스',
  },
];

export const AI_CAPABILITIES: AICapability[] = [
  {
    id: 'opus',
    title: 'Claude Opus 4.5',
    subtitle: '복잡한 의사결정',
    description: '전략적 판단과 복잡한 비즈니스 로직에 최고 성능 AI 활용',
    icon: '🧠',
  },
  {
    id: 'rag',
    title: 'RAG + Human-in-the-Loop',
    subtitle: '정확도 + 신뢰성',
    description: '검색 증강 생성과 인간 검증을 결합한 하이브리드 시스템',
    icon: '🔄',
  },
  {
    id: 'vibe',
    title: 'Vibe Coding',
    subtitle: 'Claude Code + bkit',
    description: '"깊이는 AI가, 넓이는 인간이" - AI Native 개발 방법론',
    icon: '⚡',
  },
];
