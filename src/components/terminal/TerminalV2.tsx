'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TerminalLine, CommandResult } from '@/types/commands';
import { executeCommandV2, getCommandSuggestions } from '@/lib/commands-v2';
import { useWorldStore } from '@/stores/world-store';
import { useStoryStore } from '@/stores/story-store';
import { CHAPTER_HINTS, getChapterByNumber } from '@/lib/chapters-data';

interface TerminalV2Props {
  onChapterChange?: (chapter: number) => void;
  className?: string;
}

// Quick action buttons for each chapter
const CHAPTER_QUICK_ACTIONS: Record<number, Array<{ cmd: string; label: string; icon: string }>> = {
  0: [
    { cmd: 'journey', label: '여정 시작', icon: '▶' },
    { cmd: 'help', label: '도움말', icon: '?' },
  ],
  1: [
    { cmd: 'scan origin', label: '시작점 스캔', icon: '◎' },
    { cmd: 'analyze problems', label: '문제 분석', icon: '◈' },
    { cmd: 'next', label: '다음 챕터', icon: '→' },
  ],
  2: [
    { cmd: 'explore problem 1', label: '문제 1', icon: '①' },
    { cmd: 'explore problem 2', label: '문제 2', icon: '②' },
    { cmd: 'explore problem 3', label: '문제 3', icon: '③' },
    { cmd: 'solve', label: '해결책 보기', icon: '✓' },
    { cmd: 'next', label: '다음', icon: '→' },
  ],
  3: [
    { cmd: 'products', label: '제품 목록', icon: '☰' },
    { cmd: 'flow', label: '데이터 플로우', icon: '◇' },
    { cmd: 'connect scout-manager infleos', label: '연결 보기', icon: '⟷' },
    { cmd: 'next', label: '다음', icon: '→' },
  ],
  4: [
    { cmd: 'metrics', label: '트랙션 메트릭', icon: '▣' },
    { cmd: 'evidence', label: '증거 자료', icon: '◆' },
    { cmd: 'next', label: '다음', icon: '→' },
  ],
  5: [
    { cmd: 'timeline', label: '타임라인', icon: '━' },
    { cmd: 'simulate hashed', label: '시뮬레이션', icon: '▷' },
    { cmd: 'next', label: '다음', icon: '→' },
  ],
  6: [
    { cmd: 'apply', label: 'Hashed 지원', icon: '★' },
    { cmd: 'credits', label: '크레딧', icon: '♦' },
    { cmd: 'replay', label: '다시 시작', icon: '↺' },
  ],
};

// All available commands grouped by category
const ALL_COMMANDS = {
  'Journey': [
    { cmd: 'journey', desc: '여정 시작' },
    { cmd: 'next', desc: '다음 챕터' },
    { cmd: 'back', desc: '이전 챕터' },
    { cmd: 'map', desc: '진행도 보기' },
  ],
  'Explore': [
    { cmd: 'scan origin', desc: '시작점 스캔' },
    { cmd: 'analyze problems', desc: '문제 분석' },
    { cmd: 'explore problem 1', desc: '문제 탐색' },
    { cmd: 'solve', desc: '해결책 보기' },
  ],
  'Ecosystem': [
    { cmd: 'products', desc: '제품 목록' },
    { cmd: 'flow', desc: '데이터 플로우' },
    { cmd: 'connect scout-manager infleos', desc: '제품 연결' },
  ],
  'Proof': [
    { cmd: 'metrics', desc: '트랙션 메트릭' },
    { cmd: 'evidence', desc: '증거 자료' },
    { cmd: 'timeline', desc: '회사 타임라인' },
  ],
  'Action': [
    { cmd: 'simulate hashed', desc: '미래 시뮬레이션' },
    { cmd: 'apply', desc: 'Hashed 지원' },
    { cmd: 'credits', desc: '제작 정보' },
  ],
  'System': [
    { cmd: 'help', desc: '도움말' },
    { cmd: 'clear', desc: '화면 지우기' },
  ],
  'Easter Eggs': [
    { cmd: 'vibe', desc: '바이브' },
    { cmd: 'coffee', desc: '커피' },
    { cmd: 'matrix', desc: '매트릭스' },
  ],
};

export default function TerminalV2({ onChapterChange, className = '' }: TerminalV2Props) {
  const [entries, setEntries] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isBooting, setIsBooting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const worldState = useWorldStore();
  const storyState = useStoryStore();

  const currentChapter = worldState.currentChapter;
  const hint = CHAPTER_HINTS[currentChapter] || '';
  const chapterData = getChapterByNumber(currentChapter);
  const quickActions = CHAPTER_QUICK_ACTIONS[currentChapter] || [];

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  // Focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Update suggestions
  useEffect(() => {
    setSuggestions(getCommandSuggestions(currentChapter));
  }, [currentChapter]);

  // Boot sequence
  const runBootSequence = useCallback(async (bootLines: TerminalLine[]) => {
    setIsBooting(true);
    for (const line of bootLines) {
      await new Promise((resolve) => setTimeout(resolve, line.delay || 100));
      setEntries((prev) => [...prev, { ...line, delay: undefined }]);
    }
    setIsBooting(false);
    worldState.completeBoot();
    worldState.startJourney();
    onChapterChange?.(1);
  }, [worldState, onChapterChange]);

  // Execute command
  const handleCommand = useCallback(async (cmd: string) => {
    if (!cmd.trim() || isBooting) return;

    const inputLine: TerminalLine = {
      id: `input-${Date.now()}`,
      type: 'input',
      content: `$ ${cmd}`,
      timestamp: Date.now(),
    };
    setEntries((prev) => [...prev, inputLine]);
    setCommandHistory((prev) => [cmd, ...prev.slice(0, 49)]);
    setHistoryIndex(-1);
    setInput('');
    setShowCommandPalette(false);
    setShowSuggestions(false);

    const context = {
      currentChapter: worldState.currentChapter,
      storyState: {
        problemsSolved: storyState.problemsSolved,
        productsExplored: storyState.productsExplored,
        connectionsDiscovered: storyState.connectionsDiscovered,
        metricsViewed: storyState.metricsViewed,
        simulationRun: storyState.simulationRun,
        journeyComplete: storyState.journeyComplete,
        currentProblem: storyState.currentProblem,
      },
      worldState: {
        bootComplete: worldState.bootComplete,
        journeyStarted: worldState.journeyStarted,
        activeNodes: worldState.activeNodes,
        flowActive: worldState.flowActive,
      },
    };

    const result: CommandResult = executeCommandV2(cmd, context);

    // Boot sequence
    if (cmd.toLowerCase() === 'journey' && !worldState.journeyStarted) {
      await runBootSequence(result.output);
      return;
    }

    // Clear
    if (cmd.toLowerCase() === 'clear' || cmd.toLowerCase() === 'cls') {
      setEntries([]);
      return;
    }

    // Add output
    if (result.output.length > 0) {
      setEntries((prev) => [...prev, ...result.output]);
    }

    // World action
    if (result.worldAction) {
      worldState.dispatch(result.worldAction);
    }

    // Chapter unlock
    if (result.chapterUnlock !== undefined) {
      worldState.setChapter(result.chapterUnlock);
      onChapterChange?.(result.chapterUnlock);
    }

    // Story updates
    if (cmd.toLowerCase().startsWith('solve')) storyState.solveProblem();
    if (cmd.toLowerCase().startsWith('explore product')) {
      const productId = cmd.split(' ')[2];
      if (productId) storyState.exploreProduct(productId);
    }
    if (cmd.toLowerCase().startsWith('connect')) {
      const parts = cmd.split(' ');
      if (parts[1] && parts[2]) storyState.discoverConnection(`${parts[1]}-${parts[2]}`);
    }
    if (cmd.toLowerCase() === 'metrics') storyState.viewMetrics();
    if (cmd.toLowerCase().startsWith('simulate')) storyState.runSimulation();
    if (cmd.toLowerCase() === 'apply') storyState.completeJourney();
  }, [isBooting, worldState, storyState, runBootSequence, onChapterChange]);

  // Handle quick action click
  const handleQuickAction = useCallback((cmd: string) => {
    handleCommand(cmd);
  }, [handleCommand]);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    setShowSuggestions(false);

    // Show command palette on /
    if (value === '/') {
      setShowCommandPalette(true);
    } else {
      setShowCommandPalette(false);
    }
  }, []);

  // Key events
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (showCommandPalette) {
        setShowCommandPalette(false);
        setInput('');
      } else {
        handleCommand(input);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const matches = suggestions.filter((s) => s.startsWith(input.toLowerCase()));
      if (matches.length === 1) {
        setInput(matches[0]);
      } else if (matches.length > 1) {
        setShowSuggestions(true);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setShowCommandPalette(false);
    }
  }, [input, historyIndex, commandHistory, suggestions, handleCommand, showCommandPalette]);

  // Render line
  const renderLine = (entry: TerminalLine, index: number) => {
    const typeStyles: Record<TerminalLine['type'], string> = {
      input: 'text-[#00d4ff]',
      output: 'text-gray-300',
      system: 'text-[#00ff88]',
      error: 'text-red-400',
      success: 'text-[#00ff88]',
      boot: 'text-[#00ff88]',
    };

    return (
      <motion.div
        key={entry.id}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.15, delay: index * 0.01 }}
        className={`font-mono text-[13px] leading-relaxed whitespace-pre-wrap ${typeStyles[entry.type]}`}
      >
        {entry.content}
      </motion.div>
    );
  };

  const progress = storyState.getProgress();

  return (
    <div
      className={`bg-[#0a0a0a]/95 backdrop-blur-md border border-[#1a1a1a] rounded-xl overflow-hidden ${className}`}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal Header */}
      <div className="flex items-center px-4 py-3 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border-b border-[#222]">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-[0_0_8px_rgba(255,95,86,0.5)]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-[0_0_8px_rgba(255,189,46,0.5)]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-[0_0_8px_rgba(39,201,63,0.5)]" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-[11px] text-gray-500 font-mono">
            afformation-os — chapter-{currentChapter}
            {chapterData && ` — ${chapterData.title.toLowerCase()}`}
          </span>
        </div>
        <div className="text-[10px] text-[#00ff88]/60 font-mono">
          {hint && `💡 ${hint}`}
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="px-4 py-2 border-b border-[#222] bg-[#0d0d0d]">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] text-gray-600 font-mono shrink-0">QUICK:</span>
          {quickActions.map((action) => (
            <motion.button
              key={action.cmd}
              onClick={() => handleQuickAction(action.cmd)}
              disabled={isBooting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-[#1a1a1a] border border-[#333] rounded-lg hover:border-[#00ff88] hover:text-[#00ff88] transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <span className="text-[#00ff88]">{action.icon}</span>
              <span>{action.label}</span>
            </motion.button>
          ))}
          <motion.button
            onClick={() => setShowCommandPalette(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-[#111] border border-[#00ff88]/30 rounded-lg hover:border-[#00ff88] hover:bg-[#00ff88]/10 transition-all shrink-0"
          >
            <span className="text-[#00ff88]">/</span>
            <span className="text-[#00ff88]">모든 명령어</span>
          </motion.button>
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={scrollRef}
        className="h-[280px] overflow-y-auto p-4 font-mono text-sm scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-transparent"
      >
        {/* Welcome message */}
        {entries.length === 0 && (
          <div className="space-y-2">
            <div className="text-[#00ff88] text-lg font-bold">
              ╔══════════════════════════════════════════════════════════╗
            </div>
            <div className="text-[#00ff88]">
              ║&nbsp;&nbsp;AFFORMATION OS v2.0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;║
            </div>
            <div className="text-[#00ff88]">
              ║&nbsp;&nbsp;&quot;마케팅을 알고 코드를 짜는 조직&quot;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;║
            </div>
            <div className="text-[#00ff88]">
              ╠══════════════════════════════════════════════════════════╣
            </div>
            <div className="text-gray-400">
              ║&nbsp;&nbsp;🎮 터미널에 입력하거나 버튼을 클릭하세요&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;║
            </div>
            <div className="text-gray-400">
              ║&nbsp;&nbsp;⌨️ &apos;/&apos; 입력 시 모든 명령어 표시&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;║
            </div>
            <div className="text-[#00ff88]">
              ╠══════════════════════════════════════════════════════════╣
            </div>
            <div className="text-[#00d4ff]">
              ║&nbsp;&nbsp;👆 위의 [여정 시작] 버튼을 클릭하거나&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;║
            </div>
            <div className="text-[#00d4ff]">
              ║&nbsp;&nbsp;⌨️ &apos;journey&apos; 를 입력하세요&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;║
            </div>
            <div className="text-[#00ff88]">
              ╚══════════════════════════════════════════════════════════╝
            </div>
          </div>
        )}

        {/* Entries */}
        {entries.map((entry, i) => renderLine(entry, i))}

        {/* Command Palette */}
        <AnimatePresence>
          {showCommandPalette && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-3 p-4 bg-[#111] rounded-lg border border-[#00ff88]/30 max-h-[300px] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-[11px] text-[#00ff88] uppercase tracking-wider font-bold">
                  🎮 ALL COMMANDS
                </div>
                <button
                  onClick={() => setShowCommandPalette(false)}
                  className="text-gray-500 hover:text-white text-xs"
                >
                  [ESC]
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {Object.entries(ALL_COMMANDS).map(([category, commands]) => (
                  <div key={category} className="space-y-2">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider border-b border-[#222] pb-1">
                      {category}
                    </div>
                    {commands.map((cmd) => (
                      <motion.button
                        key={cmd.cmd}
                        onClick={() => {
                          handleCommand(cmd.cmd);
                        }}
                        whileHover={{ x: 5 }}
                        className="w-full flex items-center justify-between text-left px-2 py-1 rounded hover:bg-[#1a1a1a] group"
                      >
                        <span className="text-xs text-[#00ff88] font-mono group-hover:text-white transition-colors">
                          {cmd.cmd}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {cmd.desc}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Suggestions popup */}
        <AnimatePresence>
          {showSuggestions && !showCommandPalette && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="mt-3 p-3 bg-[#111] rounded-lg border border-[#222]"
            >
              <div className="text-[10px] text-gray-500 mb-2 uppercase tracking-wider">
                Available Commands
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions
                  .filter((s) => !input || s.startsWith(input.toLowerCase()))
                  .slice(0, 10)
                  .map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setInput(s);
                        setShowSuggestions(false);
                        inputRef.current?.focus();
                      }}
                      className="px-2 py-1 text-xs bg-[#1a1a1a] border border-[#333] rounded hover:border-[#00ff88] hover:text-[#00ff88] transition-colors"
                    >
                      {s}
                    </button>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Line */}
      <div className="flex items-center px-4 py-3 border-t border-[#222] bg-[#0d0d0d]">
        <span className="text-[#00ff88] mr-2 font-mono">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isBooting}
          className="flex-1 bg-transparent outline-none text-[#fafafa] font-mono text-sm placeholder-gray-600 caret-[#00ff88]"
          placeholder={isBooting ? 'Executing...' : "'/' 입력 시 모든 명령어 표시"}
          autoComplete="off"
          spellCheck={false}
        />
        {!input && !isBooting && (
          <span className={`text-[#00ff88] transition-opacity ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}>
            █
          </span>
        )}
        {isBooting && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="text-[#00ff88]"
          >
            ⣾
          </motion.span>
        )}
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 border-t border-[#222] bg-[#080808] flex items-center gap-4 text-[10px] font-mono">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${worldState.journeyStarted ? 'bg-[#00ff88] animate-pulse' : 'bg-[#333]'}`} />
          <span className="text-gray-500">
            {worldState.journeyStarted ? 'JOURNEY ACTIVE' : 'IDLE'}
          </span>
        </div>

        <div className="flex-1 flex items-center gap-2">
          <span className="text-gray-600">CHAPTER</span>
          <span className="text-[#00d4ff]">{currentChapter}/6</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-600">PROGRESS</span>
          <div className="w-24 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#00ff88] to-[#00d4ff]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-[#00ff88] w-8 text-right">{progress}%</span>
        </div>

        <div className="flex items-center gap-1 text-gray-600">
          <span className="text-[#00ff88]">/</span>
          <span>명령어</span>
          <span className="mx-1">|</span>
          <span>click</span>
          <span>버튼</span>
        </div>
      </div>
    </div>
  );
}
