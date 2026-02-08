import { Product } from '@/types';

export const PRODUCTS: Product[] = [
  {
    id: 'scout-manager',
    name: 'Scout Manager',
    koreanName: '스카우트 매니저',
    description: 'AI 인플루언서 마케팅 자동화 SaaS',
    url: 'https://desk.scoutmanager.io/',
    category: 'core',
    features: [
      '자동 인플루언서 발굴',
      'AI 기반 매칭 알고리즘',
      '캠페인 관리 대시보드',
      '실시간 성과 분석',
    ],
    metrics: [
      { label: '비용 절감', value: '89', unit: '%' },
      { label: '월 구독료', value: '25만~100만', unit: '원' },
    ],
    aiFeatures: ['Claude Sonnet 4', 'RAG 기반 검색', 'Automated Outreach'],
    color: '#00FF88',
  },
  {
    id: 'infleos',
    name: 'Infleos',
    koreanName: '인플레오스',
    description: '풀퍼널 인플루언서 마케팅 플랫폼',
    url: 'https://infleos.io/',
    category: 'core',
    features: [
      '7단계 퍼널 자동화',
      'Discovery → Reporting',
      '사용량 기반 과금',
      'Enterprise Ready',
    ],
    metrics: [
      { label: '퍼널 단계', value: '7', unit: '단계' },
      { label: '자동화율', value: '95', unit: '%' },
    ],
    aiFeatures: ['Full Funnel AI', 'Predictive Analytics', 'Smart Matching'],
    color: '#00D4FF',
  },
  {
    id: 'getcarekorea',
    name: 'GetCareKorea',
    koreanName: '겟케어코리아',
    description: '의료관광 플랫폼',
    url: 'https://getcarekorea.com/en',
    category: 'supporting',
    features: [
      '10,000+ 환자 연결',
      '200+ 병원 파트너',
      '7개 언어 지원',
      'AI 챗봇 상담',
    ],
    metrics: [
      { label: '환자 수', value: '10,000', unit: '+' },
      { label: '병원', value: '200', unit: '+' },
    ],
    aiFeatures: ['Claude AI 챗봇', 'Multi-language NLP'],
    color: '#FF6B6B',
  },
  {
    id: 'csflow',
    name: 'CS Flow',
    koreanName: '씨에스플로우',
    description: 'CS 자동화 솔루션',
    url: 'https://cs-admin.afformation.co.kr/',
    category: 'supporting',
    features: [
      '87.5% 자동 해결률',
      '99% 응답 시간 개선',
      '멀티채널 통합',
      'AI 기반 분류',
    ],
    metrics: [
      { label: '자동 해결', value: '87.5', unit: '%' },
      { label: '응답 개선', value: '99', unit: '%' },
    ],
    aiFeatures: ['Intent Classification', 'Auto-Resolution', 'Sentiment Analysis'],
    color: '#FFD93D',
  },
  {
    id: 'vibeops',
    name: 'VibeOps',
    koreanName: '바이브옵스',
    description: '통합 운영 시스템 (개발 중)',
    url: '#',
    category: 'supporting',
    features: [
      '마케팅 + 개발 통합',
      '실시간 대시보드',
      'AI 기반 인사이트',
      '자동화 워크플로우',
    ],
    metrics: [],
    aiFeatures: ['Operations AI', 'Unified Dashboard'],
    color: '#A78BFA',
  },
  {
    id: 'afformation',
    name: 'Afformation',
    koreanName: '어포메이션',
    description: '의료관광 마케팅 전문',
    url: 'https://afformation.co.kr',
    category: 'supporting',
    features: [
      '30+ 병원 파트너',
      '3개국 진출',
      '풀서비스 에이전시',
      '10년+ 경험',
    ],
    metrics: [
      { label: '파트너', value: '30', unit: '+' },
      { label: '국가', value: '3', unit: '개국' },
    ],
    aiFeatures: [],
    color: '#FAFAFA',
  },
];

export const CORE_PRODUCTS = PRODUCTS.filter((p) => p.category === 'core');
export const SUPPORTING_PRODUCTS = PRODUCTS.filter((p) => p.category === 'supporting');
