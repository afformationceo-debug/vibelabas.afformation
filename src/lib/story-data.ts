import type { ProblemSolution } from '@/types/story';

export const STORY_DATA: ProblemSolution[] = [
  {
    id: 'ps-1',
    problem: {
      title: 'Influencer Marketing Inefficiency',
      titleKo: '인플루언서 마케팅이 너무 비효율적',
      description: '수천 명 중 적합한 인플루언서 찾기가 수작업',
      painPoints: [
        '수작업 리스트업',
        '개별 DM 발송 (하나하나 복붙)',
        '엑셀 지옥',
        '낮은 응답률',
      ],
      icon: 'users',
    },
    solution: {
      productId: 'scout-manager',
      productName: 'Scout Manager',
      features: [
        'AI 자동 리스트업',
        '개인화된 DM 자동 발송',
        '채팅으로 모든 업무 실행',
        '실시간 ROI 트래킹',
      ],
      result: '89% 비용 절감, 월 25만~100만원 SaaS',
      url: 'https://scoutmanager.io',
    },
    connections: { next: 'ps-2' },
  },
  {
    id: 'ps-2',
    problem: {
      title: 'Post-Outreach Management',
      titleKo: '섭외 후 관리가 더 복잡하다',
      description: '인플루언서와의 소통과 관리가 분산됨',
      painPoints: [
        '메신저 지옥',
        '컨텐츠 승인 프로세스',
        '정산 관리',
        '성과 리포팅',
      ],
      icon: 'workflow',
    },
    solution: {
      productId: 'infleos',
      productName: 'Infleos',
      features: [
        '7-Step 자동화 파이프라인',
        'AI 기반 적합도 분석',
        '전자 계약 관리',
        '실시간 성과 모니터링',
      ],
      result: 'Enterprise 고객 대응, 사용량 기반 과금',
      url: 'https://infleos.io',
    },
    connections: { prev: 'ps-1', next: 'ps-3' },
  },
  {
    id: 'ps-3',
    problem: {
      title: 'Information Gap for Patients',
      titleKo: '마케팅으로 고객이 오는데, 정보를 볼 곳이 없다',
      description: '외국인 환자가 한국 병원 정보를 찾기 어려움',
      painPoints: [
        '다국어 정보 부족',
        '실시간 상담 채널 부재',
        '통역 예약 불편',
      ],
      icon: 'globe',
    },
    solution: {
      productId: 'getcarekorea',
      productName: 'GetCareKorea',
      features: [
        '200+ 병원 정보',
        '7개 언어 지원 (KO/EN/JA/ZH/VI/TH/RU)',
        'Claude 기반 AI 챗봇',
        '원클릭 통역사 매칭',
      ],
      result: '10,000+ 환자 연결, 다국어 SEO 1위',
      url: 'https://getcarekorea.com',
    },
    connections: { prev: 'ps-2', next: 'ps-4' },
  },
  {
    id: 'ps-4',
    problem: {
      title: 'CS Overload',
      titleKo: '고객 문의가 폭주한다',
      description: '해외 고객 CS 문의 24시간 대응 필요',
      painPoints: [
        '반복 질문 80% 이상',
        '복잡한 케이스는 사람 필요',
        '다국어 대응 인력 부족',
      ],
      icon: 'headphones',
    },
    solution: {
      productId: 'cs-flow',
      productName: 'CS Flow',
      features: [
        'RAG 기반 자동 답변',
        '지식베이스 자동 학습',
        '자동 에스컬레이션',
        'Human-in-the-Loop',
      ],
      result: '87.5% 자동 해결률, 99% 응답 시간 개선',
      url: 'https://cs-landing.afformation.co.kr',
    },
    connections: { prev: 'ps-3', next: 'ps-5' },
  },
  {
    id: 'ps-5',
    problem: {
      title: 'Unified Operations Need',
      titleKo: '모든 것을 하나로 통합해야 한다',
      description: '분산된 워크플로우를 통합 관리',
      painPoints: [
        '워크플로우 분산',
        'API 도구 파편화',
        'Human-AI 협업 관리',
      ],
      icon: 'layers',
    },
    solution: {
      productId: 'vibeops',
      productName: 'VibeOps',
      features: [
        'n8n 기반 워크플로우',
        'API 도구 통합 관리',
        'AI Agent Pool',
        '실시간 오퍼레이션 대시보드',
      ],
      result: 'Coming Soon - 통합 오퍼레이션 시스템',
      url: '#',
    },
    connections: { prev: 'ps-4' },
  },
];

export const ORIGIN_WORK_ITEMS = [
  { id: 'influencer', name: '인플루언서 마케팅', icon: 'users', color: '#00ff88' },
  { id: 'cs', name: '해외고객 CS', icon: 'headphones', color: '#00d4ff' },
  { id: 'translation', name: '통역 서비스', icon: 'languages', color: '#ff6b6b' },
  { id: 'content', name: '컨텐츠 제작', icon: 'film', color: '#ffd93d' },
  { id: 'ads', name: '광고 운영', icon: 'megaphone', color: '#c084fc' },
  { id: 'seo', name: '구글 SEO', icon: 'search', color: '#f472b6' },
];

export const TRACTION_METRICS = [
  { id: 'partners', label: '파트너사', value: 30, suffix: '+', description: '협력 병원 및 기업' },
  { id: 'revenue', label: '누적 매출', value: 100, suffix: '억+', description: '의료관광 마케팅 누적' },
  { id: 'countries', label: '진출 국가', value: 3, suffix: '개국', description: '한국, 일본, 동남아' },
  { id: 'products', label: '라이브 프로덕트', value: 6, suffix: '개', description: '실제 운영 중인 서비스' },
];

export const ECOSYSTEM_CONNECTIONS = [
  { id: 'conn-1', from: 'scout-manager', to: 'infleos', description: 'Scout Manager로 섭외한 인플루언서를 Infleos에서 관리' },
  { id: 'conn-2', from: 'infleos', to: 'getcarekorea', description: '인플루언서 캠페인이 GetCareKorea 트래픽으로 연결' },
  { id: 'conn-3', from: 'getcarekorea', to: 'cs-flow', description: 'GetCareKorea 문의가 CS Flow로 자동 연결' },
  { id: 'conn-4', from: 'cs-flow', to: 'vibeops', description: 'CS 데이터가 VibeOps 대시보드에 통합' },
  { id: 'conn-5', from: 'vibeops', to: 'scout-manager', description: 'VibeOps에서 전체 워크플로우 통합 관리' },
];
