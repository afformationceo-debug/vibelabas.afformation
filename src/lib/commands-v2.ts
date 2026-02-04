import type { CommandDef, CommandResult, CommandContext, TerminalLine } from '@/types/commands';
import { STORY_DATA, TRACTION_METRICS, ECOSYSTEM_CONNECTIONS, ORIGIN_WORK_ITEMS } from './story-data';
import { CHAPTERS, BOOT_SEQUENCE_LINES, CHAPTER_HINTS, getChapterByNumber } from './chapters-data';

// Helper to create terminal lines
function line(content: string, type: TerminalLine['type'] = 'output'): TerminalLine {
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    content,
    timestamp: Date.now(),
  };
}

function lines(contents: string[], type: TerminalLine['type'] = 'output'): TerminalLine[] {
  return contents.map((content) => line(content, type));
}

// Command definitions
export const COMMANDS_V2: CommandDef[] = [
  // ==================== JOURNEY COMMANDS ====================
  {
    name: 'journey',
    aliases: ['start', 'begin'],
    description: 'Start the journey through Afformation story',
    descriptionKo: '어포메이션 여정을 시작합니다',
    availableIn: [0],
    handler: (args, ctx) => {
      if (ctx.worldState.journeyStarted) {
        return {
          output: lines(['Journey already started. Use \'map\' to see your progress.'], 'system'),
        };
      }
      return {
        output: BOOT_SEQUENCE_LINES.map((l) => ({
          ...line(l.text, 'boot'),
          delay: l.delay,
        })),
        worldAction: { type: 'START_BOOT_SEQUENCE' },
        sound: 'boot_init',
        chapterUnlock: 1,
      };
    },
  },
  {
    name: 'next',
    aliases: ['n'],
    description: 'Go to the next chapter',
    descriptionKo: '다음 챕터로 이동',
    availableIn: [-1], // Always available
    handler: (args, ctx) => {
      const nextChapter = ctx.currentChapter + 1;
      if (nextChapter > 6) {
        return {
          output: lines(['You have reached the end of the journey.', 'Type \'apply\' to take the next step.'], 'system'),
        };
      }
      const chapter = getChapterByNumber(nextChapter);
      return {
        output: lines([
          '',
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
          `  CHAPTER ${nextChapter}: ${chapter?.title?.toUpperCase()}`,
          `  ${chapter?.titleKo}`,
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
          '',
          `  ${chapter?.description}`,
          '',
          `  Available commands: ${chapter?.availableCommands.join(', ')}`,
          '',
        ], 'system'),
        worldAction: { type: 'SET_CHAPTER', payload: nextChapter },
        sound: 'chapter_transition',
        nextHint: CHAPTER_HINTS[nextChapter],
      };
    },
  },
  {
    name: 'back',
    aliases: ['b', 'prev'],
    description: 'Go to the previous chapter',
    descriptionKo: '이전 챕터로 이동',
    availableIn: [-1],
    handler: (args, ctx) => {
      const prevChapter = ctx.currentChapter - 1;
      if (prevChapter < 0) {
        return {
          output: lines(['You are at the beginning.'], 'system'),
        };
      }
      const chapter = getChapterByNumber(prevChapter);
      return {
        output: lines([`Returning to Chapter ${prevChapter}: ${chapter?.title}`], 'system'),
        worldAction: { type: 'SET_CHAPTER', payload: prevChapter },
        sound: 'whoosh',
      };
    },
  },
  {
    name: 'map',
    aliases: ['progress'],
    description: 'Show journey progress map',
    descriptionKo: '여정 진행도 표시',
    availableIn: [-1],
    handler: (args, ctx) => {
      const current = ctx.currentChapter;
      const progressLine = CHAPTERS.map((c) => {
        if (c.number < current) return '●';
        if (c.number === current) return '◉';
        return '○';
      }).join('─────');

      return {
        output: lines([
          '',
          '┌─────────────────────────────────────────────────────────────┐',
          '│                     JOURNEY PROGRESS                        │',
          '├─────────────────────────────────────────────────────────────┤',
          `│  ${progressLine}  │`,
          '│   0       1       2       3       4       5       6        │',
          '│  Boot   Origin  Problems Eco    Proof  Vision  Call       │',
          '├─────────────────────────────────────────────────────────────┤',
          `│  Current: Chapter ${current} - ${getChapterByNumber(current)?.title}`,
          `│  Problems solved: ${ctx.storyState.problemsSolved}/5`,
          `│  Products explored: ${ctx.storyState.productsExplored.length}/6`,
          `│  Connections discovered: ${ctx.storyState.connectionsDiscovered.length}/5`,
          '└─────────────────────────────────────────────────────────────┘',
          '',
        ], 'system'),
      };
    },
  },

  // ==================== EXPLORATION COMMANDS ====================
  {
    name: 'scan',
    description: 'Scan a target to reveal information',
    descriptionKo: '대상을 스캔하여 정보 표시',
    usage: 'scan [target]',
    availableIn: [1],
    handler: (args, ctx) => {
      const target = args[0]?.toLowerCase();

      if (!target || target === 'origin') {
        return {
          output: lines([
            '',
            '┌─────────────────────────────────────────────────────────────┐',
            '│  SCANNING: AFFORMATION ORIGIN                               │',
            '├─────────────────────────────────────────────────────────────┤',
            '│                                                             │',
            '│  우리는 해외환자유치에서 시작했습니다.                       │',
            '│  https://afformation.co.kr                                  │',
            '│                                                             │',
            '│  수많은 병원의 해외환자유치를 직접 실행했습니다.             │',
            '│                                                             │',
            '│  ┌─────────────────────────────────────────────────────┐   │',
            '│  │  우리가 직접 한 일들:                               │   │',
            ...ORIGIN_WORK_ITEMS.map(item =>
              `│  │  • ${item.name.padEnd(20)}                        │   │`
            ),
            '│  └─────────────────────────────────────────────────────┘   │',
            '│                                                             │',
            '│  KEY INSIGHT:                                               │',
            '│  "풀퍼널 업무를 직접 손으로 다 해봤기 때문에,                │',
            '│   어디가 비효율적인지 뼈저리게 알게 되었다"                  │',
            '│                                                             │',
            '└─────────────────────────────────────────────────────────────┘',
            '',
            'Type \'analyze problems\' to see what we discovered.',
            '',
          ], 'output'),
          worldAction: { type: 'ACTIVATE_NODE', payload: 'origin-building' },
          sound: 'node_activate',
          nextHint: "Try 'analyze problems'",
        };
      }

      return {
        output: lines([`Unknown target: ${target}. Try 'scan origin'.`], 'error'),
      };
    },
  },
  {
    name: 'analyze',
    description: 'Analyze problems discovered in operations',
    descriptionKo: '발견한 문제점 분석',
    usage: 'analyze [problems]',
    availableIn: [1],
    handler: (args, ctx) => {
      return {
        output: lines([
          '',
          '┌─────────────────────────────────────────────────────────────┐',
          '│  PROBLEMS DETECTED IN OPERATIONS                            │',
          '├─────────────────────────────────────────────────────────────┤',
          '│                                                             │',
          ...STORY_DATA.map((ps, i) => [
            `│  [${i + 1}] ${ps.problem.titleKo}`,
            `│      ${ps.problem.description}`,
            '│',
          ]).flat(),
          '│                                                             │',
          '│  💡 "이 문제들을 해결하기 위해 우리가 직접 만들었습니다"     │',
          '│                                                             │',
          '└─────────────────────────────────────────────────────────────┘',
          '',
          'Type \'next\' to see how we solved these problems.',
          '',
        ], 'output'),
        worldAction: { type: 'ACTIVATE_NODE', payload: 'problems-list' },
        sound: 'success',
        chapterUnlock: 2,
      };
    },
  },
  {
    name: 'explore',
    aliases: ['x'],
    description: 'Explore a problem or product in detail',
    descriptionKo: '문제 또는 제품 상세 탐색',
    usage: 'explore [problem N | product NAME]',
    availableIn: [2, 3],
    handler: (args, ctx) => {
      const target = args[0]?.toLowerCase();
      const num = parseInt(args[1] || args[0]);

      if (target === 'problem' || (!isNaN(num) && num >= 1 && num <= 5)) {
        const problemIndex = (target === 'problem' ? num : parseInt(target)) - 1;
        if (problemIndex >= 0 && problemIndex < STORY_DATA.length) {
          const ps = STORY_DATA[problemIndex];
          return {
            output: lines([
              '',
              '┌─────────────────────────────────────────────────────────────┐',
              `│  PROBLEM #${problemIndex + 1}: ${ps.problem.titleKo.toUpperCase()}`,
              '├─────────────────────────────────────────────────────────────┤',
              '│',
              `│  ${ps.problem.description}`,
              '│',
              '│  Pain Points:',
              ...ps.problem.painPoints.map(p => `│    • ${p}`),
              '│',
              '│  💡 "이거 AI로 해결할 수 있지 않을까?"',
              '│',
              '└─────────────────────────────────────────────────────────────┘',
              '',
              `Type 'solve' to see our solution.`,
              '',
            ], 'output'),
            worldAction: { type: 'ACTIVATE_NODE', payload: `problem-${problemIndex + 1}` },
            sound: 'node_activate',
          };
        }
      }

      return {
        output: lines([`Usage: explore problem [1-5] or explore [product-name]`], 'error'),
      };
    },
  },
  {
    name: 'solve',
    description: 'Show the solution for the current problem',
    descriptionKo: '현재 문제의 해결책 표시',
    availableIn: [2],
    handler: (args, ctx) => {
      const problemIndex = ctx.storyState.currentProblem;
      const ps = STORY_DATA[problemIndex];

      if (!ps) {
        return {
          output: lines(['No problem selected. Use \'explore problem [1-5]\' first.'], 'error'),
        };
      }

      return {
        output: lines([
          '',
          '╔═══════════════════════════════════════════════════════════════╗',
          `║  SOLUTION: ${ps.solution.productName.toUpperCase().padEnd(47)}║`,
          `║  ${ps.solution.url.padEnd(59)}║`,
          '╠═══════════════════════════════════════════════════════════════╣',
          '║',
          ...ps.solution.features.map(f => `║  ✓ ${f}`),
          '║',
          `║  RESULT: ${ps.solution.result}`,
          '║',
          '╚═══════════════════════════════════════════════════════════════╝',
          '',
          ps.connections.next
            ? `Problem solved! Type 'explore problem ${problemIndex + 2}' for the next challenge.`
            : `All problems explored! Type 'next' to see the ecosystem.`,
          '',
        ], 'success'),
        worldAction: { type: 'ACTIVATE_NODE', payload: `solution-${ps.solution.productId}` },
        sound: 'achievement',
      };
    },
  },

  // ==================== CONNECTION COMMANDS ====================
  {
    name: 'connect',
    description: 'Show connection between two products',
    descriptionKo: '두 제품 간 연결 표시',
    usage: 'connect [product1] [product2]',
    availableIn: [3],
    handler: (args, ctx) => {
      const p1 = args[0]?.toLowerCase();
      const p2 = args[1]?.toLowerCase();

      if (!p1 || !p2) {
        return {
          output: lines([
            'Usage: connect [product1] [product2]',
            'Products: scout-manager, infleos, getcarekorea, cs-flow, vibeops',
          ], 'error'),
        };
      }

      const connection = ECOSYSTEM_CONNECTIONS.find(
        (c) => (c.from.includes(p1) && c.to.includes(p2)) || (c.from.includes(p2) && c.to.includes(p1))
      );

      if (connection) {
        return {
          output: lines([
            '',
            '┌─────────────────────────────────────────────────────────────┐',
            `│  CONNECTION: ${connection.from.toUpperCase()} ──► ${connection.to.toUpperCase()}`,
            '├─────────────────────────────────────────────────────────────┤',
            '│',
            `│  ${connection.description}`,
            '│',
            '│  데이터와 워크플로우가 자연스럽게 연결됩니다.',
            '│',
            '└─────────────────────────────────────────────────────────────┘',
            '',
          ], 'output'),
          worldAction: { type: 'HIGHLIGHT_CONNECTION', payload: connection.id },
          sound: 'connection_show',
        };
      }

      return {
        output: lines([`No direct connection found between ${p1} and ${p2}.`], 'error'),
      };
    },
  },
  {
    name: 'flow',
    description: 'Show the complete data flow across all products',
    descriptionKo: '전체 데이터 흐름 표시',
    availableIn: [3],
    handler: (args, ctx) => {
      return {
        output: lines([
          '',
          '┌─────────────────────────────────────────────────────────────┐',
          '│              THE AFFORMATION ECOSYSTEM                       │',
          '├─────────────────────────────────────────────────────────────┤',
          '│                                                             │',
          '│                    ┌─────────────┐                          │',
          '│                    │   VibeOps   │                          │',
          '│                    │ (통합 허브) │                          │',
          '│                    └──────┬──────┘                          │',
          '│         ┌────────────────┴────────────────┐                │',
          '│         ▼                                  ▼                │',
          '│   ┌─────────────┐                   ┌─────────────┐        │',
          '│   │Scout Manager│                   │   CS Flow   │        │',
          '│   │ (섭외 시작) │                   │ (고객 응대) │        │',
          '│   └──────┬──────┘                   └──────▲──────┘        │',
          '│          │                                  │                │',
          '│          ▼                                  │                │',
          '│   ┌─────────────┐    ┌─────────────┐       │                │',
          '│   │   Infleos   │───►│GetCareKorea │───────┘                │',
          '│   │ (캠페인관리)│    │  (환자연결) │                        │',
          '│   └─────────────┘    └─────────────┘                        │',
          '│                                                             │',
          '│  ══════════════════════════════════════════════════════    │',
          '│  모든 제품이 하나의 생태계로 연결되어                       │',
          '│  해외환자유치 풀퍼널을 자동화합니다.                        │',
          '│  ══════════════════════════════════════════════════════    │',
          '└─────────────────────────────────────────────────────────────┘',
          '',
        ], 'output'),
        worldAction: { type: 'START_FLOW' },
        sound: 'whoosh',
      };
    },
  },
  {
    name: 'products',
    aliases: ['ls', 'list'],
    description: 'List all products',
    descriptionKo: '모든 제품 목록',
    availableIn: [-1],
    handler: (args, ctx) => {
      return {
        output: lines([
          '',
          '┌─────────────────────────────────────────────────────────────┐',
          '│                    AFFORMATION PRODUCTS                      │',
          '├─────────────────────────────────────────────────────────────┤',
          '│',
          '│  [CORE PRODUCTS]',
          '│  • Scout Manager    - AI 인플루언서 마케팅 자동화',
          '│  • Infleos          - 풀퍼널 인플루언서 플랫폼',
          '│  • GetCareKorea     - 외국인 의료관광 플랫폼',
          '│  • CS Flow          - Human-in-the-Loop CS 자동화',
          '│',
          '│  [SUPPORTING]',
          '│  • VibeOps          - 통합 오퍼레이션 시스템 (Coming)',
          '│  • Afformation      - 의료관광 마케팅 에이전시',
          '│',
          '└─────────────────────────────────────────────────────────────┘',
          '',
        ], 'output'),
      };
    },
  },

  // ==================== DATA COMMANDS ====================
  {
    name: 'metrics',
    aliases: ['stats', 'traction'],
    description: 'Show traction metrics',
    descriptionKo: '트랙션 메트릭 표시',
    availableIn: [4],
    handler: (args, ctx) => {
      return {
        output: lines([
          '',
          '╔═══════════════════════════════════════════════════════════════╗',
          '║                        TRACTION                               ║',
          '╠═══════════════════════════════════════════════════════════════╣',
          '║',
          ...TRACTION_METRICS.map(m =>
            `║     ${String(m.value).padStart(3)}${m.suffix.padEnd(8)}  ${m.label.padEnd(12)}  ${m.description}`
          ),
          '║',
          '╠═══════════════════════════════════════════════════════════════╣',
          '║  "피치덱이 아니라 숫자가 말합니다"                             ║',
          '╚═══════════════════════════════════════════════════════════════╝',
          '',
          'Type \'evidence\' for detailed proof, or \'next\' to continue.',
          '',
        ], 'output'),
        worldAction: { type: 'SHOW_METRICS' },
        sound: 'success',
      };
    },
  },
  {
    name: 'evidence',
    description: 'Show evidence for metrics',
    descriptionKo: '메트릭 증거 자료',
    availableIn: [4],
    handler: (args, ctx) => {
      return {
        output: lines([
          '',
          '┌─────────────────────────────────────────────────────────────┐',
          '│                    EVIDENCE & PROOF                          │',
          '├─────────────────────────────────────────────────────────────┤',
          '│',
          '│  30+ 파트너사',
          '│  ├─ 강남 성형외과 10+곳 장기 계약',
          '│  ├─ 피부과, 치과 등 다양한 진료과',
          '│  └─ 일본, 동남아 현지 에이전시 파트너',
          '│',
          '│  100억+ 누적 매출',
          '│  ├─ 의료관광 마케팅 10년 누적',
          '│  ├─ SaaS 매출 성장 중',
          '│  └─ 재계약률 90%+',
          '│',
          '│  6개 라이브 프로덕트',
          '│  ├─ Scout Manager: scoutmanager.io',
          '│  ├─ Infleos: infleos.io',
          '│  ├─ GetCareKorea: getcarekorea.com',
          '│  ├─ CS Flow: cs-landing.afformation.co.kr',
          '│  ├─ VibeOps: (개발 중)',
          '│  └─ Afformation: afformation.co.kr',
          '│',
          '└─────────────────────────────────────────────────────────────┘',
          '',
        ], 'output'),
        sound: 'success',
      };
    },
  },
  {
    name: 'timeline',
    description: 'Show company timeline',
    descriptionKo: '회사 타임라인',
    availableIn: [5],
    handler: (args, ctx) => {
      return {
        output: lines([
          '',
          '┌─────────────────────────────────────────────────────────────┐',
          '│                    AFFORMATION TIMELINE                      │',
          '├─────────────────────────────────────────────────────────────┤',
          '│',
          '│  2015 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ NOW',
          '│    │',
          '│    ├─ 2015: 해외환자유치 마케팅 시작',
          '│    │',
          '│    ├─ 2018: 100개+ 병원 마케팅 경험 축적',
          '│    │',
          '│    ├─ 2023: AI Native 전환 시작',
          '│    │        Claude와 함께 빌드 시작',
          '│    │',
          '│    ├─ 2024: Scout Manager, Infleos 런칭',
          '│    │',
          '│    ├─ 2025: GetCareKorea, CS Flow 런칭',
          '│    │        바이브코딩으로 빠른 개발',
          '│    │',
          '│    └─ 2026: VibeOps 개발 중',
          '│             Hashed Vibe Labs 지원',
          '│',
          '└─────────────────────────────────────────────────────────────┘',
          '',
          'Type \'simulate hashed\' to see our vision with Hashed.',
          '',
        ], 'output'),
      };
    },
  },
  {
    name: 'simulate',
    description: 'Simulate future scenarios',
    descriptionKo: '미래 시나리오 시뮬레이션',
    usage: 'simulate [scenario]',
    availableIn: [5],
    handler: (args, ctx) => {
      const scenario = args[0]?.toLowerCase();

      if (scenario === 'hashed') {
        return {
          output: lines([
            '',
            '╔═══════════════════════════════════════════════════════════════╗',
            '║           SIMULATION: AFFORMATION × HASHED                    ║',
            '╠═══════════════════════════════════════════════════════════════╣',
            '║',
            '║  [ 8주 후 예상 ]',
            '║',
            '║  ┌─ Week 1-2: VibeOps MVP 완성',
            '║  │   • AI Agent Pool 구축',
            '║  │   • 워크플로우 자동화 확장',
            '║  │',
            '║  ├─ Week 3-4: 통합 대시보드 런칭',
            '║  │   • 실시간 오퍼레이션 모니터링',
            '║  │   • Human-AI 협업 최적화',
            '║  │',
            '║  ├─ Week 5-6: 베타 고객 온보딩',
            '║  │   • 3개 파트너사 파일럿',
            '║  │   • 피드백 기반 개선',
            '║  │',
            '║  └─ Week 7-8: ARR 성장 가시화',
            '║       • Demo는 대시보드로',
            '║       • "결과물로 말합니다"',
            '║',
            '║  ════════════════════════════════════════════════════════    ║',
            '║  "8주 후, ARR이 말해줄 것입니다"                             ║',
            '║  "피치덱 대신 대시보드로 Demo합니다"                         ║',
            '║  ════════════════════════════════════════════════════════    ║',
            '╚═══════════════════════════════════════════════════════════════╝',
            '',
            'Type \'next\' to see the call to action.',
            '',
          ], 'output'),
          worldAction: { type: 'START_SIMULATION' },
          sound: 'achievement',
          chapterUnlock: 6,
        };
      }

      return {
        output: lines(['Usage: simulate hashed'], 'error'),
      };
    },
  },

  // ==================== ACTION COMMANDS ====================
  {
    name: 'apply',
    description: 'Apply to Hashed Vibe Labs',
    descriptionKo: 'Hashed Vibe Labs 지원',
    availableIn: [6],
    handler: (args, ctx) => {
      return {
        output: lines([
          '',
          '╔═══════════════════════════════════════════════════════════════╗',
          '║                                                               ║',
          '║           "마케팅을 알고 코드를 짜는 조직"                     ║',
          '║                                                               ║',
          '║              이 여정을 함께 하시겠습니까?                      ║',
          '║                                                               ║',
          '║  ┌─────────────────────────────────────────────────────────┐ ║',
          '║  │                                                         │ ║',
          '║  │               [ APPLY TO HASHED VIBE LABS ]             │ ║',
          '║  │                                                         │ ║',
          '║  │       contact@afformation.co.kr                         │ ║',
          '║  │       https://afformation.co.kr                         │ ║',
          '║  │                                                         │ ║',
          '║  └─────────────────────────────────────────────────────────┘ ║',
          '║                                                               ║',
          '╚═══════════════════════════════════════════════════════════════╝',
          '',
        ], 'success'),
        worldAction: { type: 'SHOW_OVERLAY', payload: { id: 'cta', type: 'cta', content: 'apply', visible: true } },
        sound: 'achievement',
        achievement: 'journey_complete',
      };
    },
  },
  {
    name: 'replay',
    aliases: ['restart'],
    description: 'Restart the journey from the beginning',
    descriptionKo: '여정을 처음부터 다시 시작',
    availableIn: [6],
    handler: (args, ctx) => {
      return {
        output: lines([
          'Restarting journey...',
          'Type \'journey\' to begin again.',
        ], 'system'),
        worldAction: { type: 'SET_CHAPTER', payload: 0 },
      };
    },
  },
  {
    name: 'credits',
    description: 'Show credits',
    descriptionKo: '제작 정보',
    availableIn: [-1],
    handler: (args, ctx) => {
      return {
        output: lines([
          '',
          '┌─────────────────────────────────────────────────────────────┐',
          '│                        CREDITS                               │',
          '├─────────────────────────────────────────────────────────────┤',
          '│',
          '│  Built with:',
          '│  • Claude Code (Claude Opus 4.5)',
          '│  • bkit PDCA Methodology',
          '│  • Next.js 15 + React Three Fiber',
          '│  • Framer Motion + Tailwind CSS',
          '│',
          '│  Development Time: 48 hours',
          '│',
          '│  "이 페이지 자체가 우리의 빌드 속도를 증명합니다"',
          '│',
          '│  Made by:',
          '│  주식회사 어포메이션 (Afformation Inc.)',
          '│  https://afformation.co.kr',
          '│',
          '└─────────────────────────────────────────────────────────────┘',
          '',
        ], 'output'),
      };
    },
  },

  // ==================== SYSTEM COMMANDS ====================
  {
    name: 'help',
    aliases: ['h', '?'],
    description: 'Show available commands',
    descriptionKo: '사용 가능한 명령어',
    availableIn: [-1],
    handler: (args, ctx) => {
      const chapter = getChapterByNumber(ctx.currentChapter);
      const availableCmds = COMMANDS_V2.filter(
        (cmd) => cmd.availableIn.includes(-1) || cmd.availableIn.includes(ctx.currentChapter)
      );

      return {
        output: lines([
          '',
          `┌─────────────────────────────────────────────────────────────┐`,
          `│  AVAILABLE COMMANDS - Chapter ${ctx.currentChapter}: ${chapter?.title || 'Boot'}`,
          `├─────────────────────────────────────────────────────────────┤`,
          ...availableCmds.map(cmd => `│  ${cmd.name.padEnd(15)} ${cmd.descriptionKo}`),
          `└─────────────────────────────────────────────────────────────┘`,
          '',
        ], 'system'),
      };
    },
  },
  {
    name: 'clear',
    aliases: ['cls'],
    description: 'Clear terminal',
    descriptionKo: '터미널 초기화',
    availableIn: [-1],
    handler: (args, ctx) => {
      return {
        output: [],
        worldAction: { type: 'RESET_CAMERA' },
      };
    },
  },

  // ==================== EASTER EGGS ====================
  {
    name: 'vibe',
    description: 'Show the vibe',
    descriptionKo: '바이브 표시',
    availableIn: [-1],
    handler: (args, ctx) => {
      return {
        output: lines([
          '',
          '   ██╗   ██╗██╗██████╗ ███████╗',
          '   ██║   ██║██║██╔══██╗██╔════╝',
          '   ██║   ██║██║██████╔╝█████╗  ',
          '   ╚██╗ ██╔╝██║██╔══██╗██╔══╝  ',
          '    ╚████╔╝ ██║██████╔╝███████╗',
          '     ╚═══╝  ╚═╝╚═════╝ ╚══════╝',
          '',
          '  "마케팅을 알고 코드를 짜는 조직"',
          '',
        ], 'success'),
        sound: 'achievement',
      };
    },
  },
  {
    name: 'coffee',
    description: 'Get some coffee',
    descriptionKo: '커피 한 잔',
    availableIn: [-1],
    handler: (args, ctx) => {
      return {
        output: lines(['    ( (', '     ) )', '  .______.', '  |      |]', '  \\      /', '   `----\'', '', 'Fuel for the journey.'], 'output'),
      };
    },
  },
  {
    name: 'matrix',
    description: 'Enter the matrix',
    descriptionKo: '매트릭스',
    availableIn: [-1],
    handler: (args, ctx) => {
      return {
        output: lines([
          '01001000 01100001 01110011 01101000 01100101 01100100',
          '01010110 01101001 01100010 01100101 00100000 01001100',
          '01100001 01100010 01110011',
          '',
          'Wake up, Neo... The Matrix has you.',
        ], 'success'),
      };
    },
  },
  {
    name: 'hack',
    description: 'Nice try',
    descriptionKo: 'ㅎㅎ',
    availableIn: [-1],
    handler: (args, ctx) => {
      return {
        output: lines(['Nice try. But we\'re the ones building the tools.', '', '"마케팅을 알고 코드를 짜는 조직"'], 'error'),
        sound: 'error',
      };
    },
  },
  {
    name: '42',
    description: 'The answer',
    descriptionKo: '답',
    availableIn: [-1],
    handler: (args, ctx) => {
      return {
        output: lines(['The answer to life, the universe, and everything.', '', '(But the real question is: Why Hashed Vibe Labs?)'], 'output'),
      };
    },
  },
];

// Execute command
export function executeCommandV2(input: string, context: CommandContext): CommandResult {
  const trimmed = input.trim().toLowerCase();
  const parts = trimmed.split(/\s+/);
  const cmdName = parts[0];
  const args = parts.slice(1);

  if (!cmdName) {
    return {
      output: lines([''], 'output'),
    };
  }

  const command = COMMANDS_V2.find(
    (cmd) => cmd.name === cmdName || cmd.aliases?.includes(cmdName)
  );

  if (!command) {
    return {
      output: lines([
        `Command not found: ${cmdName}`,
        'Type \'help\' for available commands.',
      ], 'error'),
      sound: 'error',
    };
  }

  // Check if command is available in current chapter
  if (!command.availableIn.includes(-1) && !command.availableIn.includes(context.currentChapter)) {
    return {
      output: lines([
        `Command '${cmdName}' is not available in this chapter.`,
        `Type 'help' for available commands.`,
      ], 'error'),
      sound: 'error',
    };
  }

  return command.handler(args, context);
}

// Get command suggestions for current chapter
export function getCommandSuggestions(chapter: number): string[] {
  return COMMANDS_V2
    .filter((cmd) => cmd.availableIn.includes(-1) || cmd.availableIn.includes(chapter))
    .map((cmd) => cmd.name);
}
