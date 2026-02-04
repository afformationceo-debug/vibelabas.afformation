// V2 Command Types

import type { WorldAction } from './world';

export interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'system' | 'error' | 'success' | 'boot';
  content: string;
  timestamp: number;
  delay?: number;
}

export interface CommandResult {
  output: TerminalLine[];
  worldAction?: WorldAction;
  sound?: SoundEffect;
  achievement?: string;
  nextHint?: string;
  chapterUnlock?: number;
}

export interface CommandDef {
  name: string;
  aliases?: string[];
  description: string;
  descriptionKo: string;
  usage?: string;
  availableIn: number[]; // chapter numbers, -1 means always available
  handler: (args: string[], context: CommandContext) => CommandResult;
}

export interface CommandContext {
  currentChapter: number;
  storyState: {
    problemsSolved: number;
    productsExplored: string[];
    connectionsDiscovered: string[];
    metricsViewed: boolean;
    simulationRun: boolean;
    journeyComplete: boolean;
    currentProblem: number;
  };
  worldState: {
    bootComplete: boolean;
    journeyStarted: boolean;
    activeNodes: string[];
    flowActive: boolean;
  };
}

export type SoundEffect =
  | 'boot_init'
  | 'boot_tick'
  | 'boot_complete'
  | 'key_enter'
  | 'chapter_transition'
  | 'node_activate'
  | 'connection_show'
  | 'achievement'
  | 'error'
  | 'success'
  | 'whoosh';

export interface CommandSuggestion {
  command: string;
  description: string;
}
