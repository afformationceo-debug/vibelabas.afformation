import type { Chapter } from '@/types/story';

export const CHAPTERS: Chapter[] = [
  {
    id: 'chapter-0',
    number: 0,
    title: 'Boot Sequence',
    titleKo: '시스템 시작',
    description: 'Afformation OS 부팅',
    availableCommands: ['journey', 'help'],
    completionCriteria: { commands: ['journey'] },
    transitions: { next: 'chapter-1' },
  },
  {
    id: 'chapter-1',
    number: 1,
    title: 'The Origin',
    titleKo: '시작점',
    description: '해외환자유치에서 시작된 모든 것',
    availableCommands: ['scan', 'explore', 'analyze', 'next', 'back', 'help'],
    completionCriteria: { scanned: ['origin'], explored: ['problems'] },
    transitions: { prev: 'chapter-0', next: 'chapter-2' },
  },
  {
    id: 'chapter-2',
    number: 2,
    title: 'Problems & Solutions',
    titleKo: '문제에서 해결책으로',
    description: '실전에서 발견한 문제와 직접 만든 솔루션',
    availableCommands: ['explore', 'solve', 'next', 'back', 'story', 'help'],
    completionCriteria: { solved: 5 },
    transitions: { prev: 'chapter-1', next: 'chapter-3' },
  },
  {
    id: 'chapter-3',
    number: 3,
    title: 'The Ecosystem',
    titleKo: '생태계',
    description: '모든 제품이 연결된 하나의 시스템',
    availableCommands: ['connect', 'flow', 'inspect', 'products', 'next', 'back', 'help'],
    completionCriteria: { connections: 3, flowViewed: true },
    transitions: { prev: 'chapter-2', next: 'chapter-4' },
  },
  {
    id: 'chapter-4',
    number: 4,
    title: 'The Proof',
    titleKo: '증명',
    description: '숫자로 말하는 실적',
    availableCommands: ['metrics', 'evidence', 'compare', 'next', 'back', 'help'],
    completionCriteria: { metricsViewed: true },
    transitions: { prev: 'chapter-3', next: 'chapter-5' },
  },
  {
    id: 'chapter-5',
    number: 5,
    title: 'The Vision',
    titleKo: '비전',
    description: 'Hashed와 함께할 미래',
    availableCommands: ['timeline', 'simulate', 'next', 'back', 'help'],
    completionCriteria: { simulationRun: true },
    transitions: { prev: 'chapter-4', next: 'chapter-6' },
  },
  {
    id: 'chapter-6',
    number: 6,
    title: 'The Call',
    titleKo: '부름',
    description: '함께 할 준비가 되셨습니까?',
    availableCommands: ['apply', 'replay', 'credits', 'back', 'help'],
    completionCriteria: { journeyComplete: true },
    transitions: { prev: 'chapter-5' },
  },
];

export const BOOT_SEQUENCE_LINES = [
  { text: 'AFFORMATION OS v2.0', delay: 0 },
  { text: '────────────────────────────────', delay: 100 },
  { text: '', delay: 200 },
  { text: '> Initializing core systems...          [OK]', delay: 300 },
  { text: '> Loading product database...           [OK]', delay: 600 },
  { text: '> Connecting story threads...           [OK]', delay: 900 },
  { text: '> Preparing 3D environment...           [OK]', delay: 1200 },
  { text: '> Building ecosystem map...             [OK]', delay: 1500 },
  { text: '', delay: 1800 },
  { text: '████████████████████████████████████████ 100%', delay: 2000 },
  { text: '', delay: 2200 },
  { text: 'System Ready.', delay: 2400 },
  { text: '"마케팅을 알고 코드를 짜는 조직"', delay: 2600 },
  { text: '', delay: 2800 },
  { text: 'Welcome to Afformation.', delay: 3000 },
  { text: 'Type \'scan origin\' to begin exploring.', delay: 3200 },
];

export const CHAPTER_HINTS: Record<number, string> = {
  0: "Type 'journey' to start",
  1: "Try 'scan origin' to explore our beginning",
  2: "Use 'explore problem 1' to see our challenges",
  3: "Try 'connect scout-manager infleos' to see how products link",
  4: "Type 'metrics' to see our traction",
  5: "Use 'simulate hashed' to see our future vision",
  6: "Type 'apply' to take the next step",
};

export function getChapterByNumber(num: number): Chapter | undefined {
  return CHAPTERS.find((c) => c.number === num);
}

export function getNextChapter(currentNum: number): Chapter | undefined {
  const current = getChapterByNumber(currentNum);
  if (!current?.transitions.next) return undefined;
  return CHAPTERS.find((c) => c.id === current.transitions.next);
}

export function getPrevChapter(currentNum: number): Chapter | undefined {
  const current = getChapterByNumber(currentNum);
  if (!current?.transitions.prev) return undefined;
  return CHAPTERS.find((c) => c.id === current.transitions.prev);
}
