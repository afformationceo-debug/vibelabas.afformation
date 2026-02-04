import { create } from 'zustand';
import { TerminalEntry } from '@/types';
import { executeCommand } from '@/lib/terminal-commands';

interface TerminalState {
  entries: TerminalEntry[];
  commandHistory: string[];
  historyIndex: number;
  isTyping: boolean;
  addEntry: (type: TerminalEntry['type'], content: string) => void;
  executeCommand: (command: string) => void;
  clear: () => void;
  navigateHistory: (direction: 'up' | 'down') => string;
  setTyping: (typing: boolean) => void;
}

const INITIAL_ENTRIES: TerminalEntry[] = [
  {
    id: 'welcome-1',
    type: 'system',
    content: '╔════════════════════════════════════════════════════════════╗',
    timestamp: new Date(),
  },
  {
    id: 'welcome-2',
    type: 'system',
    content: '║  AFFORMATION TERMINAL v1.0                                 ║',
    timestamp: new Date(),
  },
  {
    id: 'welcome-3',
    type: 'system',
    content: '║  "마케팅을 알고 코드를 짜는 조직"                          ║',
    timestamp: new Date(),
  },
  {
    id: 'welcome-4',
    type: 'system',
    content: '╚════════════════════════════════════════════════════════════╝',
    timestamp: new Date(),
  },
  {
    id: 'welcome-5',
    type: 'system',
    content: '',
    timestamp: new Date(),
  },
  {
    id: 'welcome-6',
    type: 'system',
    content: "Type 'help' to see available commands.",
    timestamp: new Date(),
  },
];

export const useTerminalStore = create<TerminalState>((set, get) => ({
  entries: INITIAL_ENTRIES,
  commandHistory: [],
  historyIndex: -1,
  isTyping: false,

  addEntry: (type, content) => {
    const entry: TerminalEntry = {
      id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content,
      timestamp: new Date(),
    };
    set((state) => ({
      entries: [...state.entries, entry],
    }));
  },

  executeCommand: (command) => {
    const { addEntry, clear } = get();

    // Add command to history
    set((state) => ({
      commandHistory: [command, ...state.commandHistory].slice(0, 50),
      historyIndex: -1,
    }));

    // Add command entry
    addEntry('command', `$ ${command}`);

    // Execute and get result
    const result = executeCommand(command);

    if (result === '__CLEAR__') {
      clear();
      return;
    }

    if (result) {
      // Add output with slight delay for effect
      setTimeout(() => {
        addEntry('output', result);
      }, 50);
    }
  },

  clear: () => {
    set({ entries: INITIAL_ENTRIES });
  },

  navigateHistory: (direction) => {
    const { commandHistory, historyIndex } = get();

    if (commandHistory.length === 0) return '';

    let newIndex: number;
    if (direction === 'up') {
      newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
    } else {
      newIndex = Math.max(historyIndex - 1, -1);
    }

    set({ historyIndex: newIndex });
    return newIndex >= 0 ? commandHistory[newIndex] : '';
  },

  setTyping: (typing) => set({ isTyping: typing }),
}));
