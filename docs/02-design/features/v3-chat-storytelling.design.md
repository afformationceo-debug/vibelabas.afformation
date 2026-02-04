# V3 Chat Storytelling Design Document

> **Summary**: Afformation AI가 대화하듯 스토리를 전달하는 채팅 기반 인터랙티브 랜딩페이지 기술 설계
>
> **Project**: hashed-landing
> **Version**: 3.0
> **Author**: Claude Code + bkit PDCA
> **Date**: 2026-02-04
> **Status**: Draft
> **Planning Doc**: [v3-chat-storytelling.plan.md](../01-plan/features/v3-chat-storytelling.plan.md)

---

## 1. Overview

### 1.1 Design Goals

1. **몰입형 채팅 경험**: 페이지 전체가 AI와 대화하는 느낌
2. **스크롤 기반 자동 진행**: 별도 입력 없이 스크롤만으로 스토리 전개
3. **인터랙티브 요소**: 버튼 클릭으로 상세 정보 확장
4. **시각적 임팩트**: 3D 배경 + 타이핑 애니메이션 + 글로우 효과
5. **성능 최적화**: 60fps 유지, 부드러운 스크롤

### 1.2 Design Principles

- **Single Responsibility**: 각 컴포넌트는 하나의 역할만 담당
- **Composable**: 메시지 타입별로 재사용 가능한 구조
- **Accessible**: 키보드 네비게이션, 스크린리더 지원
- **Mobile-First**: 모바일에서 먼저 최적화

---

## 2. Architecture

### 2.1 Component Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          V3Page                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    WorldSceneV2 (3D Background)               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌───────────┐  ┌─────────────────────────────────────────────┐   │
│  │           │  │              ChatContainer                   │   │
│  │  ChatNav  │  │  ┌─────────────────────────────────────┐   │   │
│  │           │  │  │         ChatHeader                   │   │   │
│  │  • Ch0    │  │  ├─────────────────────────────────────┤   │   │
│  │  • Ch1    │  │  │                                     │   │   │
│  │  • Ch2    │  │  │  ChatMessage (AI Intro)             │   │   │
│  │  • Ch3    │  │  │  ChatMessage (Story)                │   │   │
│  │  • Ch4    │  │  │  ChatMessage (Problem) + Actions    │   │   │
│  │  • Ch5    │  │  │  ChatMessage (Solution) + Actions   │   │   │
│  │  • Ch6    │  │  │  ChatMessage (Metrics) Cards        │   │   │
│  │           │  │  │  ChatMessage (CTA) Button           │   │   │
│  │           │  │  │                                     │   │   │
│  │           │  │  ├─────────────────────────────────────┤   │   │
│  │           │  │  │         ChatInput                   │   │   │
│  │           │  │  └─────────────────────────────────────┘   │   │
│  └───────────┘  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Scroll     │────▶│  useScroll   │────▶│  ChatStore   │
│   Event      │     │  Trigger     │     │  (Zustand)   │
└──────────────┘     └──────────────┘     └──────────────┘
                                                 │
                                                 ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Render     │◀────│  Messages    │◀────│  Chapter     │
│   Messages   │     │  Selector    │     │  Messages    │
└──────────────┘     └──────────────┘     └──────────────┘
```

### 2.3 State Management

```typescript
// chat-store.ts
interface ChatState {
  // 현재 표시된 메시지들
  visibleMessages: ChatMessage[];

  // 현재 챕터
  currentChapter: number;

  // 타이핑 중인 메시지 ID
  typingMessageId: string | null;

  // 펼쳐진 메시지 상세 정보
  expandedMessages: Set<string>;

  // 사용자 입력 히스토리
  userInputs: string[];

  // Actions
  showNextMessage: () => void;
  jumpToChapter: (chapter: number) => void;
  toggleExpand: (messageId: string) => void;
  addUserInput: (input: string) => void;
}
```

---

## 3. Data Model

### 3.1 메시지 타입 정의

```typescript
// types/chat.ts

// 메시지 발신자 타입
type MessageSender = 'ai' | 'user' | 'system';

// 메시지 스타일 타입
type MessageStyle =
  | 'intro'      // 인트로/환영 (그라디언트 배경)
  | 'story'      // 일반 스토리 (기본 말풍선)
  | 'problem'    // 문제 제시 (빨간색 강조)
  | 'solution'   // 해결책 (초록색 강조)
  | 'metric'     // 숫자/성과 (카드 형태)
  | 'timeline'   // 타임라인 (시간순 표시)
  | 'cta'        // 행동 유도 (버튼 강조)
  | 'quote';     // 인용문 (특수 스타일)

// 메시지 내 액션 버튼
interface MessageAction {
  id: string;
  label: string;
  type: 'expand' | 'link' | 'chapter' | 'custom';
  target?: string;      // 링크 URL 또는 챕터 번호
  icon?: string;        // 버튼 아이콘
}

// 메시지 내 카드 아이템 (메트릭용)
interface MessageCard {
  icon: string;
  value: string | number;
  suffix?: string;
  label: string;
  color: string;
}

// 메시지 내 리스트 아이템
interface MessageListItem {
  icon?: string;
  text: string;
  highlight?: boolean;
}

// 확장 가능한 상세 내용
interface MessageExpandable {
  title: string;
  items: MessageListItem[];
}

// 메인 메시지 인터페이스
interface ChatMessage {
  id: string;
  chapter: number;                    // 소속 챕터 (0-6)
  sender: MessageSender;
  style: MessageStyle;

  // 콘텐츠
  content: string;                    // 메인 텍스트 (마크다운 지원)
  subContent?: string;                // 서브 텍스트

  // 추가 요소들 (선택적)
  actions?: MessageAction[];          // 버튼들
  cards?: MessageCard[];              // 메트릭 카드들
  list?: MessageListItem[];           // 리스트 아이템들
  expandable?: MessageExpandable;     // 펼쳐볼 수 있는 내용

  // 애니메이션 설정
  typingDuration?: number;            // 타이핑 시간 (ms)
  delay?: number;                     // 표시 딜레이 (ms)

  // 스크롤 트리거 설정
  triggerOffset?: number;             // 스크롤 트리거 오프셋 (0-1)
}
```

### 3.2 챕터 메시지 데이터 구조

```typescript
// lib/chat-messages.ts

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
      { id: 's4', label: 'cs-landing.afformation.co.kr', type: 'link', target: 'https://cs-landing.afformation.co.kr', icon: '↗' },
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
```

---

## 4. UI/UX Design

### 4.1 전체 레이아웃 (Desktop)

```
┌─────────────────────────────────────────────────────────────────┐
│ [3D Background - WorldSceneV2]                                  │
│                                                                 │
│ ┌────────┐  ┌───────────────────────────────────────────────┐  │
│ │        │  │ ┌─────────────────────────────────────────┐   │  │
│ │ CHAT   │  │ │  AFFORMATION AI            🟢 Online    │   │  │
│ │ NAV    │  │ ├─────────────────────────────────────────┤   │  │
│ │        │  │ │                                         │   │  │
│ │ ○ Ch0  │  │ │  [AI Avatar]                           │   │  │
│ │ ● Ch1  │  │ │  안녕하세요! 저는 Afformation AI...    │   │  │
│ │ ○ Ch2  │  │ │                                         │   │  │
│ │ ○ Ch3  │  │ │  [AI Avatar]                           │   │  │
│ │ ○ Ch4  │  │ │  우리는 2015년...                      │   │  │
│ │ ○ Ch5  │  │ │                                         │   │  │
│ │ ○ Ch6  │  │ │  ┌───────────┐ ┌───────────┐           │   │  │
│ │        │  │ │  │ 더 알아보기 │ │ 스킵하기   │           │   │  │
│ │        │  │ │  └───────────┘ └───────────┘           │   │  │
│ │        │  │ │                                         │   │  │
│ │        │  │ ├─────────────────────────────────────────┤   │  │
│ │        │  │ │ 💬 메시지 입력 또는 / 명령어...   [↑]   │   │  │
│ └────────┘  │ └─────────────────────────────────────────┘   │  │
│             └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 전체 레이아웃 (Mobile)

```
┌────────────────────────┐
│ [3D Background]        │
├────────────────────────┤
│ ≡  AFFORMATION AI  🟢  │
├────────────────────────┤
│                        │
│ [AI]                   │
│ 안녕하세요!            │
│                        │
│ [AI]                   │
│ 우리는 2015년...       │
│                        │
│ ┌────────┐ ┌────────┐  │
│ │더보기  │ │스킵    │  │
│ └────────┘ └────────┘  │
│                        │
├────────────────────────┤
│ 💬 입력...       [↑]   │
└────────────────────────┘
```

### 4.3 메시지 컴포넌트 스타일

```css
/* 메시지 스타일별 디자인 */

/* ai-intro: 인트로 메시지 */
.message-intro {
  background: linear-gradient(135deg, rgba(0,255,136,0.1), rgba(0,212,255,0.1));
  border: 1px solid rgba(0,255,136,0.3);
  border-radius: 20px;
  padding: 24px;
  animation: glow 2s ease-in-out infinite;
}

/* ai-story: 일반 스토리 */
.message-story {
  background: rgba(17,17,17,0.9);
  border: 1px solid rgba(34,34,34,1);
  border-radius: 20px 20px 20px 4px;
  padding: 16px 20px;
}

/* ai-problem: 문제 제시 */
.message-problem {
  background: rgba(255,107,107,0.1);
  border-left: 4px solid #ff6b6b;
  border-radius: 4px 20px 20px 4px;
  padding: 16px 20px;
}

/* ai-solution: 해결책 */
.message-solution {
  background: rgba(0,255,136,0.1);
  border-left: 4px solid #00ff88;
  border-radius: 4px 20px 20px 4px;
  padding: 16px 20px;
}

/* ai-metric: 숫자 카드 */
.message-metric {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 16px;
}

/* ai-quote: 인용문 */
.message-quote {
  background: transparent;
  border-left: 4px solid rgba(192,132,252,0.5);
  padding: 16px 24px;
  font-style: italic;
  font-size: 1.25rem;
}

/* ai-cta: 행동 유도 */
.message-cta .action-button {
  background: linear-gradient(90deg, #00ff88, #00d4ff);
  color: black;
  font-weight: bold;
  padding: 16px 32px;
  border-radius: 9999px;
  font-size: 1.25rem;
  box-shadow: 0 0 30px rgba(0,255,136,0.5);
}
```

### 4.4 애니메이션

```typescript
// 타이핑 애니메이션
const typingVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const characterVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

// 메시지 등장 애니메이션
const messageVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 300,
    },
  },
};

// 버튼 호버 애니메이션
const buttonVariants = {
  hover: {
    scale: 1.05,
    boxShadow: '0 0 20px rgba(0,255,136,0.5)',
  },
  tap: {
    scale: 0.95,
  },
};
```

---

## 5. Component Specification

### 5.1 컴포넌트 목록

| Component | Props | Responsibility |
|-----------|-------|----------------|
| `ChatContainer` | - | 전체 채팅 영역 관리, 스크롤 처리 |
| `ChatHeader` | status | 상단 헤더 (AI 이름, 상태) |
| `ChatNav` | chapters, current | 좌측 챕터 네비게이션 |
| `ChatMessageList` | messages | 메시지 목록 렌더링 |
| `ChatMessage` | message, onAction | 개별 메시지 (타입별 분기) |
| `ChatTypingIndicator` | isTyping | "AI가 입력 중..." 표시 |
| `ChatActions` | actions, onAction | 메시지 내 버튼들 |
| `ChatMetricCard` | card | 숫자 카드 컴포넌트 |
| `ChatExpandable` | expandable, isExpanded | 펼쳐지는 상세 내용 |
| `ChatInput` | onSubmit | 하단 입력창 |
| `ChatAvatar` | sender | AI/사용자 아바타 |

### 5.2 주요 컴포넌트 상세

#### ChatMessage.tsx

```typescript
interface ChatMessageProps {
  message: ChatMessage;
  isTyping?: boolean;
  onAction: (action: MessageAction) => void;
}

export function ChatMessage({ message, isTyping, onAction }: ChatMessageProps) {
  const [expanded, setExpanded] = useState(false);

  // 메시지 스타일에 따른 클래스
  const styleClasses = {
    intro: 'message-intro',
    story: 'message-story',
    problem: 'message-problem',
    solution: 'message-solution',
    metric: 'message-metric',
    quote: 'message-quote',
    timeline: 'message-timeline',
    cta: 'message-cta',
  };

  return (
    <motion.div
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      className={`chat-message ${styleClasses[message.style]}`}
    >
      <ChatAvatar sender={message.sender} />

      <div className="message-content">
        {isTyping ? (
          <TypeWriter text={message.content} />
        ) : (
          <Markdown>{message.content}</Markdown>
        )}

        {message.subContent && (
          <p className="sub-content">{message.subContent}</p>
        )}

        {message.list && (
          <ul className="message-list">
            {message.list.map((item, i) => (
              <li key={i} className={item.highlight ? 'highlight' : ''}>
                {item.icon && <span className="icon">{item.icon}</span>}
                {item.text}
              </li>
            ))}
          </ul>
        )}

        {message.cards && (
          <div className="metric-grid">
            {message.cards.map((card, i) => (
              <ChatMetricCard key={i} card={card} />
            ))}
          </div>
        )}

        {message.expandable && (
          <ChatExpandable
            expandable={message.expandable}
            isExpanded={expanded}
            onToggle={() => setExpanded(!expanded)}
          />
        )}

        {message.actions && (
          <ChatActions
            actions={message.actions}
            onAction={(action) => {
              if (action.type === 'expand') {
                setExpanded(!expanded);
              } else {
                onAction(action);
              }
            }}
          />
        )}
      </div>
    </motion.div>
  );
}
```

### 5.3 스크롤 트리거 훅

```typescript
// hooks/useScrollTrigger.ts

interface ScrollTriggerOptions {
  threshold?: number;      // 트리거 임계값 (0-1)
  rootMargin?: string;     // 관찰 영역 마진
  once?: boolean;          // 한 번만 트리거
}

export function useScrollTrigger(
  onTrigger: () => void,
  options: ScrollTriggerOptions = {}
) {
  const { threshold = 0.5, rootMargin = '0px', once = true } = options;
  const ref = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!once || !triggered.current)) {
          triggered.current = true;
          onTrigger();
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [onTrigger, threshold, rootMargin, once]);

  return ref;
}
```

---

## 6. Implementation Guide

### 6.1 파일 구조

```
src/
├── app/
│   └── v3/
│       └── page.tsx              # V3 메인 페이지
│
├── components/
│   └── chat/
│       ├── index.ts              # 배럴 export
│       ├── ChatContainer.tsx     # 전체 컨테이너
│       ├── ChatHeader.tsx        # 헤더
│       ├── ChatNav.tsx           # 좌측 네비
│       ├── ChatMessageList.tsx   # 메시지 목록
│       ├── ChatMessage.tsx       # 개별 메시지
│       ├── ChatTypingIndicator.tsx
│       ├── ChatActions.tsx       # 버튼들
│       ├── ChatMetricCard.tsx    # 숫자 카드
│       ├── ChatExpandable.tsx    # 펼침 영역
│       ├── ChatInput.tsx         # 입력창
│       └── ChatAvatar.tsx        # 아바타
│
├── stores/
│   └── chat-store.ts             # Zustand 스토어
│
├── lib/
│   └── chat-messages.ts          # 메시지 데이터
│
├── hooks/
│   ├── useScrollTrigger.ts       # 스크롤 트리거
│   └── useTypeWriter.ts          # 타이핑 효과
│
└── types/
    └── chat.ts                   # 타입 정의
```

### 6.2 구현 순서

1. **Phase 1: 타입 및 데이터**
   - [ ] `types/chat.ts` - 타입 정의
   - [ ] `lib/chat-messages.ts` - 메시지 데이터
   - [ ] `stores/chat-store.ts` - 상태 관리

2. **Phase 2: 기본 컴포넌트**
   - [ ] `ChatContainer.tsx` - 컨테이너
   - [ ] `ChatMessage.tsx` - 기본 메시지
   - [ ] `ChatMessageList.tsx` - 메시지 목록

3. **Phase 3: 스타일별 메시지**
   - [ ] intro, story, quote 스타일
   - [ ] problem, solution 스타일
   - [ ] metric, timeline, cta 스타일

4. **Phase 4: 인터랙션**
   - [ ] `useScrollTrigger.ts` - 스크롤 트리거
   - [ ] `ChatActions.tsx` - 버튼 처리
   - [ ] `ChatExpandable.tsx` - 펼침

5. **Phase 5: 부가 요소**
   - [ ] `ChatNav.tsx` - 네비게이션
   - [ ] `ChatInput.tsx` - 입력창
   - [ ] `ChatTypingIndicator.tsx` - 타이핑

6. **Phase 6: 통합 및 최적화**
   - [ ] V3 페이지 통합
   - [ ] 애니메이션 최적화
   - [ ] 모바일 대응

---

## 7. Test Plan

### 7.1 테스트 케이스

- [ ] 페이지 로드 시 인트로 메시지 표시
- [ ] 스크롤 시 다음 메시지 순차 표시
- [ ] 타이핑 애니메이션 정상 작동
- [ ] 버튼 클릭 시 상세 정보 펼침
- [ ] 챕터 네비게이션 작동
- [ ] 모바일에서 정상 표시
- [ ] 3D 배경과 겹침 없음
- [ ] 60fps 유지

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-02-04 | Initial draft | Claude Code |
