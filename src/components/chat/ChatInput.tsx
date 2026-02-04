'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/stores/chat-store';
import { CHAT_CHAPTERS } from '@/lib/chat-messages';

interface ChatInputProps {
  onCommand?: (command: string) => void;
}

export default function ChatInput({ onCommand }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [showCommands, setShowCommands] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { jumpToChapter, showNextMessage, allMessagesShown } = useChatStore();

  // 커맨드 목록
  const commands = [
    { cmd: '/start', label: '처음부터 시작', action: () => jumpToChapter(0) },
    { cmd: '/origin', label: '시작점 보기', action: () => jumpToChapter(1) },
    { cmd: '/problems', label: '문제와 해결', action: () => jumpToChapter(2) },
    { cmd: '/ecosystem', label: '생태계', action: () => jumpToChapter(3) },
    { cmd: '/proof', label: '트랙션', action: () => jumpToChapter(4) },
    { cmd: '/vision', label: '비전', action: () => jumpToChapter(5) },
    { cmd: '/apply', label: '지원하기', action: () => jumpToChapter(6) },
    { cmd: '/next', label: '다음 메시지', action: () => showNextMessage() },
  ];

  useEffect(() => {
    if (input === '/') {
      setShowCommands(true);
    } else {
      setShowCommands(false);
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = commands.find((c) => c.cmd === input.trim().toLowerCase());
    if (cmd) {
      cmd.action();
    } else {
      onCommand?.(input);
    }

    setInput('');
    setShowCommands(false);
  };

  const handleCommandClick = (cmd: typeof commands[0]) => {
    cmd.action();
    setInput('');
    setShowCommands(false);
  };

  return (
    <div className="relative">
      {/* 커맨드 팔레트 */}
      <AnimatePresence>
        {showCommands && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full mb-2 left-0 right-0 bg-[#0a0a0a] border border-[#333] rounded-xl overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
          >
            <div className="p-2 border-b border-[#222]">
              <span className="text-xs text-gray-500 font-mono">사용 가능한 명령어</span>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {commands.map((cmd) => (
                <motion.button
                  key={cmd.cmd}
                  onClick={() => handleCommandClick(cmd)}
                  whileHover={{ backgroundColor: 'rgba(0,255,136,0.1)' }}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#111] transition-colors"
                >
                  <span className="text-[#00ff88] font-mono text-sm">{cmd.cmd}</span>
                  <span className="text-gray-500 text-sm">{cmd.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 입력 폼 */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-3 bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 focus-within:border-[#00ff88]/50 transition-colors">
          <span className="text-[#00ff88] text-lg">💬</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={allMessagesShown ? "스토리 끝! /start로 다시 시작" : "메시지 입력 또는 / 명령어..."}
            className="flex-1 bg-transparent text-white placeholder-gray-600 outline-none font-mono text-sm"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 rounded-lg bg-[#00ff88]/20 border border-[#00ff88]/30 flex items-center justify-center text-[#00ff88] hover:bg-[#00ff88]/30 transition-colors"
          >
            ↑
          </motion.button>
        </div>

        {/* 힌트 텍스트 */}
        <div className="absolute -bottom-6 left-0 right-0 flex justify-center">
          <span className="text-[10px] text-gray-600 font-mono">
            / 를 입력하면 명령어 목록 표시 • 스크롤하면 자동 진행
          </span>
        </div>
      </form>
    </div>
  );
}
