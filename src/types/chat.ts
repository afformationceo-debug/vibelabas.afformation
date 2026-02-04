// V3 Chat Storytelling Types

// 메시지 발신자 타입
export type MessageSender = 'ai' | 'user' | 'system';

// 메시지 스타일 타입
export type MessageStyle =
  | 'intro'      // 인트로/환영 (그라디언트 배경)
  | 'story'      // 일반 스토리 (기본 말풍선)
  | 'problem'    // 문제 제시 (빨간색 강조)
  | 'solution'   // 해결책 (초록색 강조)
  | 'metric'     // 숫자/성과 (카드 형태)
  | 'timeline'   // 타임라인 (시간순 표시)
  | 'cta'        // 행동 유도 (버튼 강조)
  | 'quote';     // 인용문 (특수 스타일)

// 메시지 내 액션 버튼
export interface MessageAction {
  id: string;
  label: string;
  type: 'expand' | 'link' | 'chapter' | 'custom';
  target?: string;      // 링크 URL 또는 챕터 번호
  icon?: string;        // 버튼 아이콘
}

// 메시지 내 카드 아이템 (메트릭용)
export interface MessageCard {
  icon: string;
  value: string | number;
  suffix?: string;
  label: string;
  color: string;
}

// 메시지 내 리스트 아이템
export interface MessageListItem {
  icon?: string;
  text: string;
  highlight?: boolean;
}

// 확장 가능한 상세 내용
export interface MessageExpandable {
  title: string;
  items: MessageListItem[];
}

// 메인 메시지 인터페이스
export interface ChatMessage {
  id: string;
  chapter: number;                    // 소속 챕터 (0-6)
  sender: MessageSender;
  style: MessageStyle;

  // 콘텐츠
  content: string;                    // 메인 텍스트 (마크다운 지원)
  subContent?: string;                // 서브 텍스트

  // 추가 요소들 (선택적)
  actions?: MessageAction[];          // 버튼들
  cards?: MessageCard[];              // 메트릭 카드들
  list?: MessageListItem[];           // 리스트 아이템들
  expandable?: MessageExpandable;     // 펼쳐볼 수 있는 내용

  // 애니메이션 설정
  typingDuration?: number;            // 타이핑 시간 (ms)
  delay?: number;                     // 표시 딜레이 (ms)
}

// 챕터 정보
export interface ChatChapter {
  id: number;
  title: string;
  titleKo: string;
  color: string;
}

// 채팅 상태
export interface ChatState {
  // 현재 표시된 메시지들
  visibleMessages: ChatMessage[];

  // 현재 챕터
  currentChapter: number;

  // 타이핑 중인 메시지 ID
  typingMessageId: string | null;

  // 펼쳐진 메시지 ID들
  expandedMessages: Set<string>;

  // 사용자 입력 히스토리
  userInputs: string[];

  // 모든 메시지가 표시되었는지
  allMessagesShown: boolean;
}
