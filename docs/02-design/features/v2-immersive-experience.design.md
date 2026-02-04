# V2 Immersive Experience Design Document

> **Summary**: Terminal controls the 3D world - Immersive storytelling landing page
>
> **Project**: Afformation Vibe Landing V2
> **Version**: 2.0.0
> **Author**: Afformation Inc.
> **Date**: 2026-02-04
> **Status**: Draft
> **Planning Doc**: [v2-immersive-experience.plan.md](../01-plan/features/v2-immersive-experience.plan.md)

---

## 1. Overview

### 1.1 Design Goals

1. **Terminal-World Bridge**: Terminal commands directly control 3D world state
2. **Connected Story**: 6 chapters forming one continuous journey
3. **Interactive Discovery**: Users explore, not scroll
4. **Real Product Story**: Problem → Solution narrative with actual products

### 1.2 Design Principles

- **Command-Driven**: Every interaction via terminal commands
- **State Synchronization**: Terminal ↔ 3D world bidirectional sync
- **Progressive Disclosure**: Content unlocks through exploration
- **Performance First**: 60fps on modern devices

---

## 2. Architecture

### 2.1 Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          V2 ARCHITECTURE                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐            │
│  │   Terminal   │◄───►│  WorldStore  │◄───►│   3D Scene   │            │
│  │  Component   │     │   (Zustand)  │     │   (R3F)      │            │
│  └──────┬───────┘     └──────┬───────┘     └──────┬───────┘            │
│         │                    │                    │                     │
│         ▼                    ▼                    ▼                     │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐            │
│  │  CommandV2   │     │ ChapterStore │     │   Chapters   │            │
│  │   System     │     │   (State)    │     │  (1-6 Scenes)│            │
│  └──────────────┘     └──────────────┘     └──────────────┘            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow

```
User Input (Terminal)
    → Command Parser
    → Command Handler
    → WorldAction Dispatch
    → Store Update
    → 3D Scene React
    → Visual Feedback
    → Terminal Output
```

### 2.3 Dependencies

| Component | Depends On | Purpose |
|-----------|-----------|---------|
| Terminal | WorldStore, CommandV2 | Command input/output |
| WorldStore | ChapterStore | Global world state |
| ChapterStore | - | Chapter navigation |
| 3D Scene | WorldStore, ChapterStore | Visual rendering |
| CommandV2 | All stores | Command execution |

---

## 3. Data Model

### 3.1 Core Types

```typescript
// Chapter System
interface Chapter {
  id: string;
  number: number;
  title: string;
  titleKo: string;
  description: string;
  commands: CommandDef[];
  worldSetup: WorldSetup;
  completionCriteria: CompletionCriteria;
  transitions: {
    prev?: string;
    next?: string;
  };
}

// World State
interface WorldState {
  currentChapter: number;
  camera: CameraState;
  activeNodes: string[];
  highlightedConnections: string[];
  particles: ParticleConfig;
  overlays: OverlayConfig[];
  bootComplete: boolean;
  journeyStarted: boolean;
}

// Command System
interface CommandDef {
  name: string;
  aliases?: string[];
  args?: string[];
  description: string;
  handler: string;
  worldAction?: WorldAction;
  chapterUnlock?: number[];
}

interface CommandResult {
  output: TerminalLine[];
  worldAction?: WorldAction;
  sound?: SoundEffect;
  achievement?: Achievement;
  nextHint?: string;
}

// Story State
interface StoryState {
  problemsSolved: number;
  productsExplored: string[];
  connectionsDiscovered: string[];
  metricsViewed: boolean;
  simulationRun: boolean;
  journeyComplete: boolean;
}

// Problem-Solution Pair
interface ProblemSolution {
  id: string;
  problem: {
    title: string;
    description: string;
    painPoints: string[];
  };
  solution: {
    productId: string;
    features: string[];
    result: string;
  };
  connections: {
    prev?: string;
    next?: string;
  };
}
```

### 3.2 Chapter Definitions

```typescript
const CHAPTERS: Chapter[] = [
  {
    id: 'chapter-0',
    number: 0,
    title: 'Boot Sequence',
    titleKo: '시스템 시작',
    commands: ['journey'],
    completionCriteria: { command: 'journey' }
  },
  {
    id: 'chapter-1',
    number: 1,
    title: 'The Origin',
    titleKo: '시작점',
    commands: ['scan', 'explore', 'analyze'],
    completionCriteria: { scanned: ['origin'], explored: ['problems'] }
  },
  {
    id: 'chapter-2',
    number: 2,
    title: 'Problems → Solutions',
    titleKo: '문제에서 해결책으로',
    commands: ['explore', 'solve', 'next'],
    completionCriteria: { solved: 5 }
  },
  {
    id: 'chapter-3',
    number: 3,
    title: 'The Ecosystem',
    titleKo: '생태계',
    commands: ['connect', 'flow', 'inspect'],
    completionCriteria: { connections: 3, flowViewed: true }
  },
  {
    id: 'chapter-4',
    number: 4,
    title: 'The Proof',
    titleKo: '증명',
    commands: ['metrics', 'evidence', 'compare'],
    completionCriteria: { metricsViewed: true }
  },
  {
    id: 'chapter-5',
    number: 5,
    title: 'The Vision',
    titleKo: '비전',
    commands: ['timeline', 'simulate'],
    completionCriteria: { simulationRun: true }
  },
  {
    id: 'chapter-6',
    number: 6,
    title: 'The Call',
    titleKo: '부름',
    commands: ['apply', 'replay', 'credits'],
    completionCriteria: { journeyComplete: true }
  }
];
```

---

## 4. Component Specification

### 4.1 Terminal V2

**Location**: `src/components/terminal/TerminalV2.tsx`

```typescript
interface TerminalV2Props {
  onCommand: (cmd: string) => CommandResult;
  bootSequence?: boolean;
  hints?: string[];
}

// Features:
// - Boot sequence animation
// - Auto-typing effect
// - Command suggestions based on chapter
// - World event echo
// - Progress indicator
```

### 4.2 WorldScene V2

**Location**: `src/components/3d/WorldSceneV2.tsx`

```typescript
interface WorldSceneV2Props {
  chapter: number;
  worldState: WorldState;
  onNodeClick: (nodeId: string) => void;
  onConnectionClick: (connId: string) => void;
}

// Sub-components:
// - BootScreen (Chapter 0)
// - OriginScene (Chapter 1)
// - ProblemSolutionScene (Chapter 2)
// - EcosystemScene (Chapter 3)
// - ProofScene (Chapter 4)
// - VisionScene (Chapter 5)
// - CallScene (Chapter 6)
```

### 4.3 Chapter Scenes

| Chapter | Scene Component | 3D Elements |
|---------|-----------------|-------------|
| 0 | BootScreen | Terminal fullscreen, loading bars |
| 1 | OriginScene | Building, 6 work icons floating |
| 2 | ProblemSolutionScene | Problem nodes, solution cards, arrows |
| 3 | EcosystemScene | 6 products in orbit, connection lines |
| 4 | ProofScene | 3D dashboard, floating metrics |
| 5 | VisionScene | Timeline, growth charts |
| 6 | CallScene | CTA button, credits roll |

---

## 5. Command System V2

### 5.1 Command Categories

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     COMMAND SYSTEM V2.0                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [Journey Commands]     [Exploration]        [Connection]               │
│  ─────────────────     ─────────────         ───────────               │
│  journey               scan [target]         connect [a] [b]           │
│  next                  explore [node]        flow                      │
│  back                  inspect [item]        story                     │
│  map                   solve                                           │
│  progress                                                              │
│                                                                         │
│  [Data Commands]        [Product Commands]   [System Commands]         │
│  ─────────────         ─────────────────     ─────────────────         │
│  metrics               products              help                      │
│  evidence              demo [product]        clear                     │
│  compare               tech [product]        theme [name]              │
│  timeline                                    sound [on/off]            │
│  simulate [scenario]                         credits                   │
│                                                                         │
│  [Easter Eggs]                                                         │
│  ────────────                                                          │
│  vibe, coffee, matrix, hack, 42                                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Command Handler Structure

```typescript
// src/lib/commands-v2.ts

interface CommandHandler {
  name: string;
  aliases?: string[];
  description: string;
  availableIn: number[]; // chapter numbers
  execute: (args: string[], state: GlobalState) => CommandResult;
}

const commandHandlers: CommandHandler[] = [
  {
    name: 'journey',
    aliases: ['start', 'begin'],
    description: 'Start the journey',
    availableIn: [0],
    execute: (args, state) => ({
      output: [...BOOT_SEQUENCE_LINES],
      worldAction: { type: 'START_BOOT_SEQUENCE' },
      sound: 'boot',
    })
  },
  // ... more handlers
];
```

---

## 6. Store Design

### 6.1 WorldStore (Zustand)

```typescript
// src/stores/world-store.ts

interface WorldStore {
  // State
  chapter: number;
  bootComplete: boolean;
  journeyStarted: boolean;
  camera: CameraState;
  activeNodes: string[];
  connections: string[];
  particles: ParticleConfig;

  // Story Progress
  story: StoryState;

  // Actions
  startBoot: () => void;
  completeBoot: () => void;
  setChapter: (n: number) => void;
  activateNode: (id: string) => void;
  showConnection: (a: string, b: string) => void;
  startFlow: () => void;
  updateStory: (updates: Partial<StoryState>) => void;

  // Camera
  focusNode: (id: string) => void;
  resetCamera: () => void;

  // World Actions
  dispatch: (action: WorldAction) => void;
}
```

### 6.2 TerminalStore V2

```typescript
// src/stores/terminal-store-v2.ts

interface TerminalStoreV2 {
  // State
  entries: TerminalEntry[];
  commandHistory: string[];
  historyIndex: number;
  isBooting: boolean;
  currentHint: string | null;

  // Actions
  addEntry: (entry: TerminalEntry) => void;
  addBootLine: (line: string, delay: number) => void;
  executeCommand: (cmd: string) => CommandResult;
  setHint: (hint: string) => void;
  clearHint: () => void;
  clear: () => void;
}
```

---

## 7. UI/UX Design

### 7.1 Screen Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         MAIN LAYOUT                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                   │ │
│  │                         3D WORLD                                  │ │
│  │                     (Full Viewport)                               │ │
│  │                                                                   │ │
│  │                                                                   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  ┌─ TERMINAL V2 ──────────────────────────────────────────────┐  │ │
│  │  │                                                             │  │ │
│  │  │  > journey                                                  │  │ │
│  │  │  Initializing Afformation OS...                            │  │ │
│  │  │  ████████████████████████ 100%                             │  │ │
│  │  │  Ready. Welcome to the journey.                            │  │ │
│  │  │                                                             │  │ │
│  │  │  > _                                                        │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                   │ │
│  │  [Chapter: 1/6] [Progress: ████░░░░░░ 40%] [Hint: try 'scan']   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Boot Sequence UI

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                                                                         │
│                                                                         │
│      ╔═══════════════════════════════════════════════════════════╗     │
│      ║                                                           ║     │
│      ║    AFFORMATION OS v2.0                                    ║     │
│      ║    ────────────────────                                   ║     │
│      ║                                                           ║     │
│      ║    > Initializing core systems...          [OK]          ║     │
│      ║    > Loading product database...           [OK]          ║     │
│      ║    > Connecting story threads...           [OK]          ║     │
│      ║    > Preparing 3D environment...           [OK]          ║     │
│      ║    > Building ecosystem map...             [OK]          ║     │
│      ║                                                           ║     │
│      ║    ████████████████████████████████████████ 100%         ║     │
│      ║                                                           ║     │
│      ║    System Ready.                                          ║     │
│      ║    Type 'journey' to begin your exploration.              ║     │
│      ║                                                           ║     │
│      ║    > _                                                    ║     │
│      ║                                                           ║     │
│      ╚═══════════════════════════════════════════════════════════╝     │
│                                                                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 7.3 Progress Indicator

```
┌─────────────────────────────────────────────────────────────────────────┐
│  JOURNEY PROGRESS                                                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [●]─────[●]─────[○]─────[○]─────[○]─────[○]─────[○]                  │
│   0       1       2       3       4       5       6                     │
│  Boot   Origin  Problems Ecosystem Proof  Vision  Call                  │
│                                                                         │
│  Current: Chapter 1 - The Origin                                        │
│  Next command: 'scan origin'                                            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Implementation Guide

### 8.1 File Structure

```
src/
├── app/
│   └── page.tsx                    # Main page (V2)
├── components/
│   ├── terminal/
│   │   ├── TerminalV2.tsx          # NEW: V2 terminal
│   │   ├── BootSequence.tsx        # NEW: Boot animation
│   │   └── ProgressBar.tsx         # NEW: Chapter progress
│   ├── 3d/
│   │   ├── WorldSceneV2.tsx        # NEW: Main 3D scene
│   │   ├── chapters/
│   │   │   ├── BootScreen.tsx      # Chapter 0
│   │   │   ├── OriginScene.tsx     # Chapter 1
│   │   │   ├── ProblemScene.tsx    # Chapter 2
│   │   │   ├── EcosystemScene.tsx  # Chapter 3
│   │   │   ├── ProofScene.tsx      # Chapter 4
│   │   │   ├── VisionScene.tsx     # Chapter 5
│   │   │   └── CallScene.tsx       # Chapter 6
│   │   └── shared/
│   │       ├── Particles.tsx
│   │       ├── ConnectionLine.tsx
│   │       └── GlowEffect.tsx
│   └── ui/
│       ├── ChapterIndicator.tsx
│       └── HintOverlay.tsx
├── stores/
│   ├── world-store.ts              # NEW: World state
│   ├── terminal-store-v2.ts        # NEW: Terminal V2 state
│   └── story-store.ts              # NEW: Story progress
├── lib/
│   ├── commands-v2.ts              # NEW: V2 command system
│   ├── chapters-data.ts            # NEW: Chapter definitions
│   ├── story-data.ts               # NEW: Problem-Solution data
│   └── sounds.ts                   # NEW: Sound effects
└── types/
    ├── world.ts                    # NEW: World types
    ├── commands.ts                 # NEW: Command types
    └── story.ts                    # NEW: Story types
```

### 8.2 Implementation Order

#### Phase 1: Foundation (Day 1 Morning)
1. [ ] Create type definitions (`types/world.ts`, `types/commands.ts`)
2. [ ] Implement WorldStore (`stores/world-store.ts`)
3. [ ] Implement TerminalStoreV2 (`stores/terminal-store-v2.ts`)
4. [ ] Create CommandV2 system (`lib/commands-v2.ts`)

#### Phase 2: Boot Sequence (Day 1 Afternoon)
5. [ ] Create BootSequence component
6. [ ] Implement 'journey' command
7. [ ] Add boot animation and sounds

#### Phase 3: Chapter 1 (Day 1 Evening)
8. [ ] Create OriginScene 3D component
9. [ ] Implement 'scan', 'explore', 'analyze' commands
10. [ ] Add work icons 3D elements

#### Phase 4: Chapter 2 (Day 2 Morning)
11. [ ] Create ProblemScene 3D component
12. [ ] Implement problem-solution data
13. [ ] Add 'solve', 'next problem' commands

#### Phase 5: Chapter 3 (Day 2 Afternoon)
14. [ ] Create EcosystemScene 3D component
15. [ ] Implement 'connect', 'flow' commands
16. [ ] Add connection line animations

#### Phase 6: Chapters 4-6 (Day 2-3)
17. [ ] ProofScene with metrics
18. [ ] VisionScene with timeline
19. [ ] CallScene with CTA

#### Phase 7: Polish (Day 3)
20. [ ] Sound effects
21. [ ] Easter eggs
22. [ ] Performance optimization
23. [ ] Mobile responsiveness

---

## 9. Story Data Structure

### 9.1 Problem-Solution Pairs

```typescript
// src/lib/story-data.ts

export const STORY_DATA: ProblemSolution[] = [
  {
    id: 'ps-1',
    problem: {
      title: '인플루언서 마케팅이 너무 비효율적',
      description: '수천 명 중 적합한 인플루언서 찾기가 수작업',
      painPoints: [
        '수작업 리스트업',
        '개별 DM 발송 (하나하나 복붙)',
        '엑셀 지옥',
        '낮은 응답률'
      ]
    },
    solution: {
      productId: 'scout-manager',
      features: [
        'AI 자동 리스트업',
        '개인화된 DM 자동 발송',
        '채팅으로 모든 업무 실행',
        '실시간 ROI 트래킹'
      ],
      result: '89% 비용 절감'
    },
    connections: { next: 'ps-2' }
  },
  {
    id: 'ps-2',
    problem: {
      title: '섭외 후 관리가 더 복잡하다',
      description: '인플루언서와의 소통과 관리가 분산됨',
      painPoints: [
        '메신저 지옥',
        '컨텐츠 승인 프로세스',
        '정산 관리',
        '성과 리포팅'
      ]
    },
    solution: {
      productId: 'infleos',
      features: [
        '7-Step 자동화 파이프라인',
        'AI 기반 적합도 분석',
        '전자 계약 관리',
        '실시간 성과 모니터링'
      ],
      result: 'Enterprise 고객 대응'
    },
    connections: { prev: 'ps-1', next: 'ps-3' }
  },
  {
    id: 'ps-3',
    problem: {
      title: '마케팅으로 고객이 오는데, 정보를 볼 곳이 없다',
      description: '외국인 환자가 한국 병원 정보를 찾기 어려움',
      painPoints: [
        '다국어 정보 부족',
        '실시간 상담 채널 부재',
        '통역 예약 불편'
      ]
    },
    solution: {
      productId: 'getcarekorea',
      features: [
        '200+ 병원 정보',
        '7개 언어 지원',
        'Claude 기반 AI 챗봇',
        '원클릭 통역사 매칭'
      ],
      result: '10,000+ 환자 연결'
    },
    connections: { prev: 'ps-2', next: 'ps-4' }
  },
  {
    id: 'ps-4',
    problem: {
      title: '고객 문의가 폭주한다',
      description: '해외 고객 CS 문의 24시간 대응 필요',
      painPoints: [
        '반복 질문 80% 이상',
        '복잡한 케이스는 사람 필요',
        '다국어 대응 인력 부족'
      ]
    },
    solution: {
      productId: 'cs-flow',
      features: [
        'RAG 기반 자동 답변',
        '지식베이스 자동 학습',
        '자동 에스컬레이션',
        'Human-in-the-Loop'
      ],
      result: '87.5% 자동 해결률'
    },
    connections: { prev: 'ps-3', next: 'ps-5' }
  },
  {
    id: 'ps-5',
    problem: {
      title: '모든 것을 하나로 통합해야 한다',
      description: '분산된 워크플로우를 통합 관리',
      painPoints: [
        '워크플로우 분산',
        'API 도구 파편화',
        'Human-AI 협업 관리'
      ]
    },
    solution: {
      productId: 'vibeops',
      features: [
        'n8n 기반 워크플로우',
        'API 도구 통합 관리',
        'AI Agent Pool',
        '실시간 오퍼레이션 대시보드'
      ],
      result: 'Coming Soon'
    },
    connections: { prev: 'ps-4' }
  }
];
```

---

## 10. Performance Considerations

### 10.1 3D Optimization

- Lazy load chapter scenes
- Use `<Suspense>` for 3D components
- Implement frustum culling
- Limit particle count per scene
- Use instanced meshes for repeated elements

### 10.2 State Management

- Selective re-renders with Zustand selectors
- Memoize expensive computations
- Debounce rapid commands

### 10.3 Asset Loading

- Preload next chapter assets
- Use compressed textures
- Implement progressive loading

---

## 11. Sound Design

### 11.1 Sound Effects

| Event | Sound | Duration |
|-------|-------|----------|
| Boot start | `boot_init.mp3` | 0.5s |
| Boot progress | `boot_tick.mp3` | 0.1s |
| Boot complete | `boot_complete.mp3` | 1s |
| Command enter | `key_enter.mp3` | 0.1s |
| Chapter transition | `whoosh.mp3` | 0.5s |
| Node activate | `node_glow.mp3` | 0.3s |
| Connection show | `connect.mp3` | 0.4s |
| Achievement | `achievement.mp3` | 1s |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-02-04 | Initial design document | Afformation |
