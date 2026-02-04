'use client';

import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore, TOTAL_MESSAGES } from '@/stores/chat-store';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { CHAT_CHAPTERS } from '@/lib/chat-messages';
import { MessageAction } from '@/types/chat';

export default function ChatContainer() {
  const {
    visibleMessages,
    currentChapter,
    typingMessageId,
    showNextMessage,
    jumpToChapter,
    nextMessageIndex,
    allMessagesShown,
  } = useChatStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);
  const isScrolling = useRef(false);

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleMessages]);

  // 초기 메시지 표시
  useEffect(() => {
    if (visibleMessages.length === 0) {
      // 첫 메시지들 순차 표시
      const showInitialMessages = async () => {
        for (let i = 0; i < 4; i++) {
          await new Promise((resolve) => setTimeout(resolve, 800));
          showNextMessage();
        }
      };
      showInitialMessages();
    }
  }, []);

  // 스크롤 기반 메시지 트리거
  const handleScroll = useCallback(() => {
    if (!containerRef.current || isScrolling.current || allMessagesShown) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const scrollProgress = scrollTop / (scrollHeight - clientHeight);
    const isScrollingDown = scrollTop > lastScrollTop.current;

    lastScrollTop.current = scrollTop;

    // 스크롤이 70% 이상이고 아래로 스크롤 중이면 다음 메시지 표시
    if (scrollProgress > 0.7 && isScrollingDown && !typingMessageId) {
      isScrolling.current = true;
      showNextMessage();

      // 디바운스
      setTimeout(() => {
        isScrolling.current = false;
      }, 500);
    }
  }, [showNextMessage, typingMessageId, allMessagesShown]);

  // 액션 핸들러
  const handleAction = (action: MessageAction) => {
    if (action.type === 'chapter' && action.target) {
      jumpToChapter(parseInt(action.target));
    }
  };

  // 현재 챕터 정보
  const currentChapterInfo = CHAT_CHAPTERS[currentChapter];

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a]/80 backdrop-blur-xl border border-[#222] rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.5)]">
      {/* 헤더 */}
      <div className="flex-shrink-0 px-5 py-4 border-b border-[#222] bg-[#0a0a0a]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* 아바타 */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00ff88] to-[#00d4ff] flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.3)]">
                <span className="text-black font-bold text-sm">AF</span>
              </div>
              {/* 온라인 인디케이터 */}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00ff88] border-2 border-[#0a0a0a]"
              />
            </div>

            <div>
              <h2 className="text-white font-bold">Afformation AI</h2>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-mono px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${currentChapterInfo?.color}20`,
                    color: currentChapterInfo?.color,
                  }}
                >
                  Ch.{currentChapter}: {currentChapterInfo?.titleKo}
                </span>
              </div>
            </div>
          </div>

          {/* 진행률 */}
          <div className="text-right">
            <div className="text-xs text-gray-500 font-mono">
              {nextMessageIndex}/{TOTAL_MESSAGES}
            </div>
            <div className="w-20 h-1 bg-[#222] rounded-full mt-1 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#00ff88] to-[#00d4ff]"
                animate={{ width: `${(nextMessageIndex / TOTAL_MESSAGES) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-5 space-y-1 scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-transparent"
      >
        <AnimatePresence mode="popLayout">
          {visibleMessages.map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message}
              isTyping={typingMessageId === message.id}
              onAction={handleAction}
            />
          ))}
        </AnimatePresence>

        {/* 타이핑 인디케이터 */}
        {typingMessageId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 px-4 py-2"
          >
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-[#00ff88]/50"
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">AI가 입력 중...</span>
          </motion.div>
        )}

        {/* 스크롤 트리거 영역 */}
        {!allMessagesShown && (
          <div className="h-20 flex items-center justify-center">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-gray-600 text-sm font-mono"
            >
              ↓ 스크롤하여 계속
            </motion.div>
          </div>
        )}

        {/* 완료 메시지 */}
        {allMessagesShown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-gray-500 text-sm">스토리 끝!</p>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="flex-shrink-0 p-4 border-t border-[#222] bg-[#0a0a0a]">
        <ChatInput onCommand={console.log} />
      </div>
    </div>
  );
}
