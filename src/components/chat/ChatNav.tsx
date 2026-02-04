'use client';

import { motion } from 'framer-motion';
import { CHAT_CHAPTERS } from '@/lib/chat-messages';
import { useChatStore } from '@/stores/chat-store';

export default function ChatNav() {
  const { currentChapter, jumpToChapter, visibleMessages } = useChatStore();

  // 각 챕터에 도달했는지 확인
  const getChapterStatus = (chapterId: number) => {
    const hasMessages = visibleMessages.some((msg) => msg.chapter === chapterId);
    const isCurrent = currentChapter === chapterId;
    return { hasMessages, isCurrent };
  };

  return (
    <motion.nav
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden md:block"
    >
      <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-[#222] rounded-2xl p-3 space-y-2">
        {CHAT_CHAPTERS.map((chapter) => {
          const { hasMessages, isCurrent } = getChapterStatus(chapter.id);

          return (
            <motion.button
              key={chapter.id}
              onClick={() => jumpToChapter(chapter.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`
                relative w-10 h-10 rounded-xl flex items-center justify-center
                transition-all duration-300
                ${isCurrent
                  ? 'bg-gradient-to-br from-[#00ff88]/20 to-[#00d4ff]/20 border-2'
                  : hasMessages
                    ? 'bg-[#111] border border-[#333] hover:border-[#00ff88]/50'
                    : 'bg-[#111]/50 border border-[#222] opacity-50'
                }
              `}
              style={{
                borderColor: isCurrent ? chapter.color : undefined,
                boxShadow: isCurrent ? `0 0 20px ${chapter.color}30` : undefined,
              }}
            >
              {/* 챕터 번호 */}
              <span
                className={`font-mono text-sm font-bold ${isCurrent ? 'text-white' : 'text-gray-500'}`}
              >
                {chapter.id}
              </span>

              {/* 현재 챕터 인디케이터 */}
              {isCurrent && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -right-1 -top-1 w-3 h-3 rounded-full"
                  style={{ backgroundColor: chapter.color }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}

              {/* 툴팁 */}
              <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#111] border border-[#333] rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-gray-400">{chapter.titleKo}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* 진행률 표시 */}
      <div className="mt-4 text-center">
        <div className="text-[10px] text-gray-600 font-mono">
          {currentChapter + 1}/{CHAT_CHAPTERS.length}
        </div>
      </div>
    </motion.nav>
  );
}
