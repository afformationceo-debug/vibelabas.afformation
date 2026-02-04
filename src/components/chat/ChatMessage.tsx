'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage as ChatMessageType, MessageAction } from '@/types/chat';
import { useChatStore } from '@/stores/chat-store';

// 마크다운 볼드 처리
function parseMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

// 타이핑 효과 컴포넌트
function TypeWriter({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(text.slice(0, i));
      i++;
      if (i > text.length) {
        clearInterval(interval);
        setTimeout(() => {
          setShowCursor(false);
          onComplete?.();
        }, 500);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [text, onComplete]);

  return (
    <span>
      {parseMarkdown(displayText)}
      {showCursor && <span className="animate-pulse text-[#00ff88]">|</span>}
    </span>
  );
}

// 메트릭 카드
function MetricCard({ icon, value, suffix, label, color }: {
  icon: string;
  value: string | number;
  suffix?: string;
  label: string;
  color: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const numValue = typeof value === 'number' ? value : parseInt(value) || 0;

  useEffect(() => {
    let start = 0;
    const timer = setInterval(() => {
      start += Math.ceil(numValue / 30);
      if (start >= numValue) {
        setCount(numValue);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 50);
    return () => clearInterval(timer);
  }, [numValue]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-[#0a0a0a] border border-[#222] rounded-xl p-4 text-center relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: color }} />
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-3xl font-black" style={{ color }}>
        {count}{suffix}
      </div>
      <div className="text-sm text-gray-400 mt-1">{label}</div>
    </motion.div>
  );
}

// 메인 메시지 컴포넌트
interface ChatMessageProps {
  message: ChatMessageType;
  isTyping?: boolean;
  onAction?: (action: MessageAction) => void;
}

export default function ChatMessage({ message, isTyping, onAction }: ChatMessageProps) {
  const [expanded, setExpanded] = useState(false);
  const [typingComplete, setTypingComplete] = useState(!isTyping);
  const { toggleExpand, isMessageExpanded } = useChatStore();

  const isExpanded = isMessageExpanded(message.id) || expanded;

  // 스타일 클래스 매핑
  const styleClasses: Record<string, string> = {
    intro: 'bg-gradient-to-br from-[#00ff88]/10 to-[#00d4ff]/10 border border-[#00ff88]/30 rounded-2xl p-5 shadow-[0_0_30px_rgba(0,255,136,0.1)]',
    story: 'bg-[#111]/90 border border-[#222] rounded-2xl rounded-tl-sm p-4',
    problem: 'bg-[#ff6b6b]/10 border-l-4 border-[#ff6b6b] rounded-r-xl p-4',
    solution: 'bg-[#00ff88]/10 border-l-4 border-[#00ff88] rounded-r-xl p-4',
    metric: 'bg-transparent p-2',
    timeline: 'bg-[#00d4ff]/5 border border-[#00d4ff]/20 rounded-xl p-4',
    cta: 'bg-transparent p-4 text-center',
    quote: 'bg-transparent border-l-4 border-[#c084fc]/50 pl-4 py-2 italic',
  };

  const handleAction = (action: MessageAction) => {
    if (action.type === 'expand') {
      setExpanded(!expanded);
      toggleExpand(message.id);
    } else if (action.type === 'link' && action.target) {
      window.open(action.target, '_blank');
    } else {
      onAction?.(action);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="flex gap-3 mb-4"
    >
      {/* 아바타 */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#00ff88] to-[#00d4ff] flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.3)]"
      >
        <span className="text-black font-bold text-sm">AF</span>
      </motion.div>

      {/* 메시지 내용 */}
      <div className={`flex-1 max-w-[85%] ${styleClasses[message.style] || styleClasses.story}`}>
        {/* 메인 콘텐츠 */}
        {message.content && (
          <div className="text-gray-200 leading-relaxed">
            {isTyping && !typingComplete ? (
              <TypeWriter text={message.content} onComplete={() => setTypingComplete(true)} />
            ) : (
              parseMarkdown(message.content)
            )}
          </div>
        )}

        {/* 서브 콘텐츠 */}
        {message.subContent && typingComplete && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-500 text-sm mt-2"
          >
            {message.subContent}
          </motion.p>
        )}

        {/* 리스트 아이템 */}
        {message.list && typingComplete && (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 space-y-2"
          >
            {message.list.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-start gap-2 text-sm ${item.highlight ? 'text-white font-medium' : 'text-gray-400'}`}
              >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                <span>{item.text}</span>
              </motion.li>
            ))}
          </motion.ul>
        )}

        {/* 메트릭 카드 */}
        {message.cards && typingComplete && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {message.cards.map((card, i) => (
              <MetricCard key={i} {...card} />
            ))}
          </div>
        )}

        {/* 펼치기 가능한 내용 */}
        {message.expandable && typingComplete && (
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 pt-4 border-t border-[#333] overflow-hidden"
              >
                <h4 className="text-white font-medium mb-3">{message.expandable.title}</h4>
                <ul className="space-y-2">
                  {message.expandable.items.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-start gap-2 text-sm ${item.highlight ? 'text-[#00ff88]' : 'text-gray-400'}`}
                    >
                      {item.icon && <span>{item.icon}</span>}
                      <span>{item.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* 액션 버튼들 */}
        {message.actions && typingComplete && (
          <div className={`flex flex-wrap gap-2 mt-4 ${message.style === 'cta' ? 'justify-center' : ''}`}>
            {message.actions.map((action) => (
              <motion.button
                key={action.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAction(action)}
                className={
                  message.style === 'cta'
                    ? 'px-8 py-4 bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black font-bold text-lg rounded-full shadow-[0_0_30px_rgba(0,255,136,0.5)] hover:shadow-[0_0_50px_rgba(0,255,136,0.7)] transition-shadow'
                    : 'px-4 py-2 bg-[#222] hover:bg-[#333] border border-[#333] hover:border-[#00ff88]/50 rounded-lg text-sm text-gray-300 hover:text-white transition-all flex items-center gap-2'
                }
              >
                {action.icon && <span>{action.icon}</span>}
                {action.label}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
