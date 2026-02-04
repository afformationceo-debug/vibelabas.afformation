// V3 Chat Messages Data
import { ChatMessage, ChatChapter } from '@/types/chat';

// 챕터 정보
export const CHAT_CHAPTERS: ChatChapter[] = [
  { id: 0, title: 'Boot', titleKo: '시작', color: '#00ff88' },
  { id: 1, title: 'Origin', titleKo: '시작점', color: '#00ff88' },
  { id: 2, title: 'Problems', titleKo: '문제와 해결', color: '#ff6b6b' },
  { id: 3, title: 'Ecosystem', titleKo: '생태계', color: '#00d4ff' },
  { id: 4, title: 'Proof', titleKo: '증명', color: '#ffd93d' },
  { id: 5, title: 'Vision', titleKo: '비전', color: '#c084fc' },
  { id: 6, title: 'CTA', titleKo: '함께하기', color: '#f472b6' },
];

// 모든 채팅 메시지
export const CHAT_MESSAGES: ChatMessage[] = [
  // ═══════════════════════════════════════════════════════
  // CHAPTER 0: BOOT (인트로)
  // ═══════════════════════════════════════════════════════
  {
    id: 'boot-1',
    chapter: 0,
    sender: 'ai',
    style: 'intro',
    content: '안녕하세요! 저는 **Afformation AI**입니다.',
    typingDuration: 1500,
    delay: 500,
  },
  {
    id: 'boot-2',
    chapter: 0,
    sender: 'ai',
    style: 'intro',
    content: '오늘 저희 이야기를 들려드릴게요.',
    typingDuration: 1200,
    delay: 300,
  },
  {
    id: 'boot-3',
    chapter: 0,
    sender: 'ai',
    style: 'quote',
    content: '"마케팅을 알고 코드를 짜는 조직"',
    subContent: '— 주식회사 어포메이션',
    typingDuration: 1500,
  },
  {
    id: 'boot-4',
    chapter: 0,
    sender: 'ai',
    style: 'story',
    content: '어떤 이야기가 궁금하신가요?',
    actions: [
      { id: 'a1', label: '처음부터 보기', type: 'chapter', target: '1', icon: '▶' },
      { id: 'a2', label: '프로덕트 보기', type: 'chapter', target: '3', icon: '📦' },
      { id: 'a3', label: '트랙션 보기', type: 'chapter', target: '4', icon: '📊' },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // CHAPTER 1: ORIGIN (시작)
  // ═══════════════════════════════════════════════════════
  {
    id: 'origin-1',
    chapter: 1,
    sender: 'ai',
    style: 'story',
    content: '우리는 **2015년**, 해외환자유치 에이전시로 시작했습니다.',
    typingDuration: 2000,
  },
  {
    id: 'origin-2',
    chapter: 1,
    sender: 'ai',
    style: 'story',
    content: '10년간 **100개 이상의 병원**과 함께 일하며 풀퍼널 업무를 직접 경험했습니다.',
    expandable: {
      title: '우리가 직접 해본 일들',
      items: [
        { icon: '📱', text: '인플루언서 마케팅 - 해외 인플루언서 섭외 및 캠페인' },
        { icon: '💬', text: '해외고객 CS - 다국어 실시간 고객 응대' },
        { icon: '🌐', text: '통역 서비스 - 의료 전문 통역 제공' },
        { icon: '🎬', text: '컨텐츠 제작 - 마케팅 영상/이미지' },
        { icon: '📊', text: '광고 운영 - 퍼포먼스 마케팅 집행' },
        { icon: '🔍', text: '구글 SEO - 해외 검색 최적화' },
      ],
    },
    actions: [
      { id: 'o1', label: '더 보기', type: 'expand', icon: '▼' },
    ],
  },
  {
    id: 'origin-3',
    chapter: 1,
    sender: 'ai',
    style: 'quote',
    content: '"풀퍼널 업무를 직접 손으로 다 해봤기 때문에, 어디가 비효율적인지 뼈저리게 알게 되었다"',
    typingDuration: 2500,
  },

  // ═══════════════════════════════════════════════════════
  // CHAPTER 2: PROBLEMS → SOLUTIONS
  // ═══════════════════════════════════════════════════════
  {
    id: 'problems-intro',
    chapter: 2,
    sender: 'ai',
    style: 'story',
    content: '그래서 **직접 만들었습니다.** 하나씩 보여드릴게요.',
    typingDuration: 1500,
  },

  // Problem 1
  {
    id: 'problem-1',
    chapter: 2,
    sender: 'ai',
    style: 'problem',
    content: '⚠️ **문제 1: 인플루언서 찾기가 너무 어려워**',
    list: [
      { icon: '•', text: '수작업으로 인스타그램 뒤지기', highlight: false },
      { icon: '•', text: '연락처 구하기 어려움', highlight: false },
      { icon: '•', text: '가격 협상 반복...', highlight: false },
    ],
  },
  {
    id: 'solution-1',
    chapter: 2,
    sender: 'ai',
    style: 'solution',
    content: '✅ **해결: Scout Manager**',
    list: [
      { icon: '✓', text: 'AI가 자동으로 인플루언서 발굴', highlight: true },
      { icon: '✓', text: '연락처 자동 수집', highlight: true },
      { icon: '✓', text: '협상 자동화', highlight: true },
    ],
    actions: [
      { id: 's1', label: 'scoutmanager.io', type: 'link', target: 'https://scoutmanager.io', icon: '↗' },
    ],
  },

  // Problem 2
  {
    id: 'problem-2',
    chapter: 2,
    sender: 'ai',
    style: 'problem',
    content: '⚠️ **문제 2: 캠페인 관리가 체계적이지 않아**',
    list: [
      { icon: '•', text: '엑셀로 인플루언서 관리', highlight: false },
      { icon: '•', text: '캠페인 성과 측정 불가', highlight: false },
      { icon: '•', text: '소통 히스토리 유실', highlight: false },
    ],
  },
  {
    id: 'solution-2',
    chapter: 2,
    sender: 'ai',
    style: 'solution',
    content: '✅ **해결: Infleos**',
    list: [
      { icon: '✓', text: '풀퍼널 인플루언서 캠페인 관리', highlight: true },
      { icon: '✓', text: '실시간 성과 대시보드', highlight: true },
      { icon: '✓', text: '통합 커뮤니케이션 로그', highlight: true },
    ],
    actions: [
      { id: 's2', label: 'infleos.io', type: 'link', target: 'https://infleos.io', icon: '↗' },
    ],
  },

  // Problem 3
  {
    id: 'problem-3',
    chapter: 2,
    sender: 'ai',
    style: 'problem',
    content: '⚠️ **문제 3: 외국인 환자가 병원 정보를 못 찾아**',
    list: [
      { icon: '•', text: '영어 정보 부족', highlight: false },
      { icon: '•', text: '가격 비교 어려움', highlight: false },
      { icon: '•', text: '신뢰할 수 있는 리뷰 없음', highlight: false },
    ],
  },
  {
    id: 'solution-3',
    chapter: 2,
    sender: 'ai',
    style: 'solution',
    content: '✅ **해결: GetCareKorea**',
    list: [
      { icon: '✓', text: '다국어 병원 정보 제공', highlight: true },
      { icon: '✓', text: '투명한 가격 비교', highlight: true },
      { icon: '✓', text: '실제 환자 리뷰 시스템', highlight: true },
    ],
    actions: [
      { id: 's3', label: 'getcarekorea.com', type: 'link', target: 'https://getcarekorea.com', icon: '↗' },
    ],
  },

  // Problem 4
  {
    id: 'problem-4',
    chapter: 2,
    sender: 'ai',
    style: 'problem',
    content: '⚠️ **문제 4: 해외 고객 CS가 24시간 필요해**',
    list: [
      { icon: '•', text: '시차 문제로 응대 불가 시간 발생', highlight: false },
      { icon: '•', text: '인건비 부담', highlight: false },
      { icon: '•', text: '품질 일관성 유지 어려움', highlight: false },
    ],
  },
  {
    id: 'solution-4',
    chapter: 2,
    sender: 'ai',
    style: 'solution',
    content: '✅ **해결: CS Flow**',
    list: [
      { icon: '✓', text: 'AI 자동 응답 + Human-in-the-Loop', highlight: true },
      { icon: '✓', text: '24시간 무중단 서비스', highlight: true },
      { icon: '✓', text: '다국어 자동 번역', highlight: true },
    ],
    actions: [
      { id: 's4', label: 'CS Flow 보기', type: 'link', target: 'https://cs-landing.afformation.co.kr', icon: '↗' },
    ],
  },

  // Problem 5
  {
    id: 'problem-5',
    chapter: 2,
    sender: 'ai',
    style: 'problem',
    content: '⚠️ **문제 5: 모든 프로덕트를 통합 관리하고 싶어**',
    list: [
      { icon: '•', text: '각 서비스별 대시보드 분리', highlight: false },
      { icon: '•', text: '데이터 사일로 현상', highlight: false },
      { icon: '•', text: '전체 현황 파악 어려움', highlight: false },
    ],
  },
  {
    id: 'solution-5',
    chapter: 2,
    sender: 'ai',
    style: 'solution',
    content: '✅ **해결: VibeOps** (Coming Soon)',
    list: [
      { icon: '✓', text: '모든 프로덕트 통합 대시보드', highlight: true },
      { icon: '✓', text: '실시간 데이터 연동', highlight: true },
      { icon: '✓', text: 'AI 기반 인사이트', highlight: true },
    ],
    actions: [
      { id: 's5', label: 'Hashed와 함께 개발 중', type: 'custom', icon: '🚀' },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // CHAPTER 3: ECOSYSTEM
  // ═══════════════════════════════════════════════════════
  {
    id: 'ecosystem-1',
    chapter: 3,
    sender: 'ai',
    style: 'story',
    content: '이렇게 만들어진 **6개의 프로덕트**가 하나의 생태계를 이룹니다.',
    typingDuration: 2000,
  },
  {
    id: 'ecosystem-2',
    chapter: 3,
    sender: 'ai',
    style: 'timeline',
    content: '**데이터가 흐르는 생태계**',
    list: [
      { icon: '1️⃣', text: 'Scout Manager → 인플루언서 데이터', highlight: false },
      { icon: '2️⃣', text: 'Infleos → 캠페인 트래픽', highlight: false },
      { icon: '3️⃣', text: 'GetCareKorea → 고객 문의', highlight: false },
      { icon: '4️⃣', text: 'CS Flow → 자동화 로그', highlight: false },
      { icon: '5️⃣', text: 'VibeOps → 통합 모니터링', highlight: true },
    ],
  },
  {
    id: 'ecosystem-3',
    chapter: 3,
    sender: 'ai',
    style: 'quote',
    content: '"모든 것은 연결되어 있습니다."',
  },

  // ═══════════════════════════════════════════════════════
  // CHAPTER 4: PROOF
  // ═══════════════════════════════════════════════════════
  {
    id: 'proof-1',
    chapter: 4,
    sender: 'ai',
    style: 'story',
    content: '**숫자가 증명합니다.** 피치덱이 아니라 실제 트랙션입니다.',
    typingDuration: 1800,
  },
  {
    id: 'proof-2',
    chapter: 4,
    sender: 'ai',
    style: 'metric',
    content: '핵심 지표',
    cards: [
      { icon: '🏥', value: 30, suffix: '+', label: '파트너사', color: '#00ff88' },
      { icon: '💰', value: 100, suffix: '억+', label: '누적 매출', color: '#00d4ff' },
      { icon: '🌏', value: 3, suffix: '개국', label: '글로벌 진출', color: '#ffd93d' },
      { icon: '🚀', value: 6, suffix: '개', label: '라이브 제품', color: '#c084fc' },
    ],
  },
  {
    id: 'proof-3',
    chapter: 4,
    sender: 'ai',
    style: 'story',
    content: '특히 **강남 성형외과 10+곳**과 장기 계약 중이며, **재계약률 90%+**를 유지하고 있습니다.',
    expandable: {
      title: '상세 실적',
      items: [
        { text: '강남 성형외과 10+곳 장기 계약', highlight: true },
        { text: '피부과, 치과 등 다양한 진료과', highlight: false },
        { text: '일본, 동남아 현지 에이전시 파트너', highlight: false },
        { text: 'SaaS 매출 성장 중', highlight: true },
      ],
    },
    actions: [
      { id: 'p1', label: '상세 보기', type: 'expand', icon: '▼' },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // CHAPTER 5: VISION
  // ═══════════════════════════════════════════════════════
  {
    id: 'vision-1',
    chapter: 5,
    sender: 'ai',
    style: 'story',
    content: '**2015년 시작 → 2026년 현재**, 그리고 미래.',
    typingDuration: 1500,
  },
  {
    id: 'vision-2',
    chapter: 5,
    sender: 'ai',
    style: 'timeline',
    content: '우리의 여정',
    list: [
      { icon: '2015', text: '해외환자유치 시작', highlight: false },
      { icon: '2018', text: '100+ 병원 경험 축적', highlight: false },
      { icon: '2023', text: 'AI Native 전환 (Claude와 함께)', highlight: true },
      { icon: '2024', text: 'Scout Manager, Infleos 런칭', highlight: false },
      { icon: '2025', text: 'GetCareKorea, CS Flow 런칭', highlight: false },
      { icon: '2026', text: 'VibeOps & Hashed Vibe Labs', highlight: true },
    ],
  },
  {
    id: 'vision-3',
    chapter: 5,
    sender: 'ai',
    style: 'story',
    content: '**Hashed Vibe Labs**와 함께 8주 안에 증명하겠습니다.',
    expandable: {
      title: '8주 로드맵',
      items: [
        { icon: '🔨', text: 'Week 1-2: VibeOps MVP 완성', highlight: true },
        { icon: '📊', text: 'Week 3-4: 통합 대시보드 런칭', highlight: false },
        { icon: '👥', text: 'Week 5-6: 베타 고객 온보딩', highlight: false },
        { icon: '💎', text: 'Week 7-8: ARR 성장 가시화', highlight: true },
      ],
    },
    actions: [
      { id: 'v1', label: '로드맵 보기', type: 'expand', icon: '▼' },
    ],
  },
  {
    id: 'vision-4',
    chapter: 5,
    sender: 'ai',
    style: 'quote',
    content: '"피치덱 대신 **대시보드**로 Demo합니다."',
  },

  // ═══════════════════════════════════════════════════════
  // CHAPTER 6: CTA
  // ═══════════════════════════════════════════════════════
  {
    id: 'cta-1',
    chapter: 6,
    sender: 'ai',
    style: 'story',
    content: '여기까지 읽어주셨네요. 감사합니다.',
    typingDuration: 1500,
  },
  {
    id: 'cta-2',
    chapter: 6,
    sender: 'ai',
    style: 'quote',
    content: '"마케팅을 알고 코드를 짜는 조직"',
    subContent: '이 여정을 함께 하시겠습니까?',
  },
  {
    id: 'cta-3',
    chapter: 6,
    sender: 'ai',
    style: 'cta',
    content: '',
    actions: [
      { id: 'cta-apply', label: 'APPLY TO HASHED VIBE LABS', type: 'link', target: 'https://afformation.co.kr', icon: '🚀' },
    ],
  },
  {
    id: 'cta-4',
    chapter: 6,
    sender: 'ai',
    style: 'story',
    content: '📧 contact@afformation.co.kr\n🌐 afformation.co.kr',
  },
];

// 챕터별 메시지 그룹핑 헬퍼
export function getMessagesByChapter(chapter: number): ChatMessage[] {
  return CHAT_MESSAGES.filter((msg) => msg.chapter === chapter);
}

// 특정 챕터까지의 모든 메시지
export function getMessagesUpToChapter(chapter: number): ChatMessage[] {
  return CHAT_MESSAGES.filter((msg) => msg.chapter <= chapter);
}
