// V3 Chat Store - Zustand
import { create } from 'zustand';
import { ChatMessage } from '@/types/chat';
import { CHAT_MESSAGES, getMessagesByChapter } from '@/lib/chat-messages';

interface ChatStore {
  // State
  visibleMessages: ChatMessage[];
  currentChapter: number;
  typingMessageId: string | null;
  expandedMessages: Set<string>;
  userInputs: string[];
  allMessagesShown: boolean;
  nextMessageIndex: number;

  // Actions
  showNextMessage: () => void;
  showMessagesUpTo: (index: number) => void;
  jumpToChapter: (chapter: number) => void;
  toggleExpand: (messageId: string) => void;
  addUserInput: (input: string) => void;
  setTyping: (messageId: string | null) => void;
  reset: () => void;

  // Selectors
  getCurrentChapterMessages: () => ChatMessage[];
  isMessageExpanded: (messageId: string) => boolean;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  // Initial State
  visibleMessages: [],
  currentChapter: 0,
  typingMessageId: null,
  expandedMessages: new Set(),
  userInputs: [],
  allMessagesShown: false,
  nextMessageIndex: 0,

  // Actions
  showNextMessage: () => {
    const { nextMessageIndex, visibleMessages } = get();

    if (nextMessageIndex >= CHAT_MESSAGES.length) {
      set({ allMessagesShown: true });
      return;
    }

    const nextMessage = CHAT_MESSAGES[nextMessageIndex];

    set({
      visibleMessages: [...visibleMessages, nextMessage],
      currentChapter: nextMessage.chapter,
      nextMessageIndex: nextMessageIndex + 1,
      typingMessageId: nextMessage.id,
    });

    // 타이핑 효과 후 타이핑 상태 해제
    const typingDuration = nextMessage.typingDuration || 1000;
    setTimeout(() => {
      set((state) => ({
        typingMessageId: state.typingMessageId === nextMessage.id ? null : state.typingMessageId,
      }));
    }, typingDuration);
  },

  showMessagesUpTo: (index: number) => {
    const messagesToShow = CHAT_MESSAGES.slice(0, index + 1);
    const lastMessage = messagesToShow[messagesToShow.length - 1];

    set({
      visibleMessages: messagesToShow,
      currentChapter: lastMessage?.chapter || 0,
      nextMessageIndex: index + 1,
      typingMessageId: null,
      allMessagesShown: index >= CHAT_MESSAGES.length - 1,
    });
  },

  jumpToChapter: (chapter: number) => {
    // 해당 챕터의 첫 번째 메시지 인덱스 찾기
    const chapterStartIndex = CHAT_MESSAGES.findIndex((msg) => msg.chapter === chapter);

    if (chapterStartIndex === -1) return;

    // 이전 챕터들의 메시지 + 현재 챕터 시작 메시지까지 모두 표시
    const messagesToShow = CHAT_MESSAGES.slice(0, chapterStartIndex + 1);

    set({
      visibleMessages: messagesToShow,
      currentChapter: chapter,
      nextMessageIndex: chapterStartIndex + 1,
      typingMessageId: null,
    });
  },

  toggleExpand: (messageId: string) => {
    set((state) => {
      const newExpanded = new Set(state.expandedMessages);
      if (newExpanded.has(messageId)) {
        newExpanded.delete(messageId);
      } else {
        newExpanded.add(messageId);
      }
      return { expandedMessages: newExpanded };
    });
  },

  addUserInput: (input: string) => {
    set((state) => ({
      userInputs: [...state.userInputs, input],
    }));
  },

  setTyping: (messageId: string | null) => {
    set({ typingMessageId: messageId });
  },

  reset: () => {
    set({
      visibleMessages: [],
      currentChapter: 0,
      typingMessageId: null,
      expandedMessages: new Set(),
      userInputs: [],
      allMessagesShown: false,
      nextMessageIndex: 0,
    });
  },

  // Selectors
  getCurrentChapterMessages: () => {
    const { currentChapter } = get();
    return getMessagesByChapter(currentChapter);
  },

  isMessageExpanded: (messageId: string) => {
    return get().expandedMessages.has(messageId);
  },
}));

// 전체 메시지 수
export const TOTAL_MESSAGES = CHAT_MESSAGES.length;
