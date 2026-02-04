# V3 Chat Storytelling UI Planning Document

> **Summary**: Afformation AI가 대화하듯 스토리를 전달하는 채팅 기반 인터랙티브 랜딩페이지
>
> **Project**: hashed-landing
> **Version**: 3.0
> **Author**: Claude Code + bkit PDCA
> **Date**: 2026-02-04
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

현재 V2 페이지의 스크롤 기반 섹션 디자인을 **채팅 UI 형태**로 리뉴얼하여:
- Afformation AI가 대화하듯 스토리를 풀어가는 몰입형 경험 제공
- 스크롤만 해도 자동으로 채팅이 진행되듯 콘텐츠가 표시
- 클릭/입력 시 추가 상호작용이 가능한 하이브리드 UX 구현

### 1.2 Background

**V1 문제점**: 일반적인 랜딩페이지 → "해시드를 감동시킬 수 없음"
**V2 시도**: 터미널 + 섹션 기반 → 디자인은 좋으나 터미널이 분리되어 있음
**V3 목표**: 채팅 UI 안에서 모든 스토리가 자연스럽게 흐르며 상호작용 가능

### 1.3 Related Documents

- V2 기존 구현: `/src/app/v2/page.tsx`
- 스토리 데이터: `/src/lib/story-data.ts`
- 챕터 데이터: `/src/lib/chapters-data.ts`

---

## 2. Scope

### 2.1 In Scope

- [x] **채팅 기반 메인 UI**: 전체 페이지가 채팅창처럼 구성
- [x] **자동 스크롤 스토리텔링**: 스크롤 시 Afformation AI가 순차적으로 메시지 표시
- [x] **인터랙티브 버튼**: 채팅 내 버튼 클릭으로 상세 정보 펼치기/접기
- [x] **타이핑 애니메이션**: AI가 실시간으로 타이핑하는 듯한 효과
- [x] **챕터 네비게이션**: 원하는 챕터로 빠르게 이동 가능
- [x] **3D 배경 유지**: 기존 WorldSceneV2를 배경으로 활용
- [x] **모바일 최적화**: 모바일에서도 자연스러운 채팅 경험

### 2.2 Out of Scope

- 실제 AI 백엔드 연동 (모든 콘텐츠는 프리셋)
- 사용자 입력에 대한 동적 응답 (미리 정의된 응답만)
- 다국어 지원 (한국어 only)

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | 페이지 로드 시 "Afformation AI" 인트로 메시지 자동 표시 | High | Pending |
| FR-02 | 스크롤 시 다음 챕터 메시지가 순차적으로 나타남 | High | Pending |
| FR-03 | 각 메시지에 타이핑 애니메이션 적용 | High | Pending |
| FR-04 | 챕터 메시지 내 "더 보기" 버튼으로 상세 정보 펼침 | High | Pending |
| FR-05 | 좌측 네비게이션 바에서 챕터 선택 가능 | Medium | Pending |
| FR-06 | 터미널 입력창으로 빠른 명령어 입력 가능 | Medium | Pending |
| FR-07 | 문제→해결 흐름이 대화처럼 자연스럽게 이어짐 | High | Pending |
| FR-08 | 마지막 CTA에서 "지원하기" 버튼 강조 | High | Pending |
| FR-09 | 3D 배경이 챕터에 따라 변화 | Medium | Pending |
| FR-10 | 모바일에서 풀스크린 채팅 경험 | Medium | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Performance | 초기 로드 < 3초, 메시지 애니메이션 60fps | Lighthouse, FPS 모니터링 |
| UX | 스크롤 → 메시지 딜레이 < 300ms | 체감 테스트 |
| Accessibility | 키보드 네비게이션 지원 | 수동 테스트 |
| Mobile | 터치 스크롤 부드럽게, 반응형 레이아웃 | 실기기 테스트 |

---

## 4. UI/UX Design Concept

### 4.1 전체 레이아웃

```
┌────────────────────────────────────────────────────────────┐
│ [3D Background - WorldSceneV2]                              │
├────────────────────────────────────────────────────────────┤
│ ┌──────┐  ┌─────────────────────────────────────────────┐ │
│ │      │  │  AFFORMATION AI                    ●●● │ │
│ │ NAV  │  ├─────────────────────────────────────────────┤ │
│ │      │  │                                             │ │
│ │ Ch1  │  │  🤖 안녕하세요! 저는 Afformation AI입니다.   │ │
│ │ Ch2  │  │     오늘 저희 이야기를 들려드릴게요.         │ │
│ │ Ch3  │  │                                             │ │
│ │ Ch4  │  │  🤖 우리는 "마케팅을 알고 코드를 짜는 조직"  │ │
│ │ Ch5  │  │     입니다. 왜 이런 말을 하는지...          │ │
│ │ Ch6  │  │                                             │ │
│ │      │  │     [ 더 알아보기 ]  [ 스킵하기 ]           │ │
│ │      │  │                                             │ │
│ │      │  │  🤖 처음엔 해외환자유치 에이전시로           │ │
│ │      │  │     시작했습니다. 10년간...                  │ │
│ │      │  │                                             │ │
│ └──────┘  │  ┌───────────────────────────────────────┐  │ │
│           │  │ 💬 메시지 입력 또는 / 명령어...       │  │ │
│           │  └───────────────────────────────────────┘  │ │
│           └─────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

### 4.2 메시지 타입

| Type | 설명 | 시각 디자인 |
|------|------|------------|
| `ai-intro` | AI 인트로/환영 메시지 | 그라디언트 배경, 애니메이션 아바타 |
| `ai-story` | 스토리 전개 메시지 | 일반 말풍선, 타이핑 효과 |
| `ai-problem` | 문제 제시 | 빨간색 강조, ⚠️ 아이콘 |
| `ai-solution` | 해결책 제시 | 초록색 강조, ✅ 아이콘 |
| `ai-metric` | 숫자/성과 | 카드 형태, 카운터 애니메이션 |
| `ai-cta` | 행동 유도 | 버튼 강조, 글로우 효과 |
| `user-action` | 사용자 선택 표시 | 우측 정렬, 다른 색상 |

### 4.3 인터랙션 플로우

```
[페이지 로드]
    │
    ▼
[인트로 메시지 자동 표시] ← 타이핑 애니메이션
    │
    ▼
[스크롤 감지] ──────────────┐
    │                       │
    ▼                       │
[다음 챕터 메시지 표시]      │
    │                       │
    ▼                       │
[버튼 클릭?] ───Yes──→ [상세 정보 펼침]
    │                       │
    No                      │
    │                       │
    ▼                       │
[계속 스크롤] ──────────────┘
    │
    ▼
[CTA 도달] → [지원하기 버튼 강조]
```

---

## 5. Story Flow (챕터별 메시지 시퀀스)

### Chapter 0: Boot (인트로)
```
🤖 안녕하세요! 저는 Afformation AI입니다.
🤖 오늘 저희 이야기를 들려드릴게요.
🤖 "마케팅을 알고 코드를 짜는 조직" - 어포메이션입니다.
   [스토리 시작하기] [빠르게 보기]
```

### Chapter 1: Origin (시작)
```
🤖 우리는 2015년, 해외환자유치 에이전시로 시작했습니다.
🤖 10년간 100개 이상의 병원과 함께 일하며...
   📱 인플루언서 마케팅
   💬 해외고객 CS
   🌐 통역 서비스
   ... (더보기)
🤖 풀퍼널 업무를 직접 손으로 다 해봤기 때문에,
   어디가 비효율적인지 뼈저리게 알게 되었습니다.
```

### Chapter 2: Problems → Solutions
```
🤖 그래서 직접 만들었습니다.

⚠️ 문제 1: 인플루언서 찾기가 너무 어려워
   • 수작업으로 인스타 뒤지기
   • 연락처 구하기 어려움
   • 가격 협상 반복...

✅ 해결: Scout Manager
   • AI가 자동으로 인플루언서 발굴
   • 연락처 자동 수집
   • 협상 자동화
   [scoutmanager.io 방문하기]

⚠️ 문제 2: ...
✅ 해결: ...
```

### Chapter 3: Ecosystem
```
🤖 그렇게 만들어진 6개의 프로덕트가 하나로 연결됩니다.

   Scout Manager → Infleos → GetCareKorea → CS Flow → VibeOps

   [생태계 자세히 보기]
```

### Chapter 4: Proof
```
🤖 숫자가 증명합니다.

   ┌─────────────────────────────────────┐
   │  30+ 파트너사  │  100억+ 누적매출   │
   │  3개국 진출    │  6개 라이브 제품   │
   └─────────────────────────────────────┘

🤖 피치덱이 아니라 실제 트랙션입니다.
```

### Chapter 5: Vision
```
🤖 2015년 시작 → 2026년 현재

   [타임라인 보기]

🤖 Hashed Vibe Labs와 함께 8주 안에 증명하겠습니다.

   Week 1-2: VibeOps MVP
   Week 3-4: 대시보드 런칭
   Week 5-6: 베타 온보딩
   Week 7-8: ARR 가시화
```

### Chapter 6: CTA
```
🤖 "마케팅을 알고 코드를 짜는 조직"
   이 여정을 함께 하시겠습니까?

   [🚀 APPLY TO HASHED VIBE LABS]

   contact@afformation.co.kr | afformation.co.kr
```

---

## 6. Success Criteria

### 6.1 Definition of Done

- [x] 모든 챕터가 채팅 메시지로 구현됨
- [x] 스크롤 시 자동으로 메시지가 나타남
- [x] 타이핑 애니메이션이 자연스럽게 작동
- [x] 버튼 클릭 시 상세 정보 펼침 동작
- [x] 모바일에서 정상 작동
- [x] 3D 배경과 조화로운 디자인

### 6.2 Quality Criteria

- [x] 60fps 애니메이션 유지
- [x] 초기 로드 3초 이내
- [x] 모든 메시지 타입별 디자인 일관성

---

## 7. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| 스크롤 성능 저하 | High | Medium | IntersectionObserver 활용, 가상화 검토 |
| 타이핑 애니메이션 버벅임 | Medium | Low | requestAnimationFrame 사용, 최적화 |
| 모바일 터치 문제 | Medium | Medium | 터치 이벤트 별도 처리 |
| 3D 배경과 충돌 | Low | Low | z-index 관리, 레이어 분리 |

---

## 8. Architecture Considerations

### 8.1 Project Level Selection

| Level | Characteristics | Recommended For | Selected |
|-------|-----------------|-----------------|:--------:|
| **Starter** | Simple structure | Static sites | ☐ |
| **Dynamic** | Feature-based modules | Web apps | ☑ |
| **Enterprise** | Strict layers | Complex systems | ☐ |

### 8.2 Key Architectural Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| Framework | Next.js | Next.js 15 | 기존 프로젝트 유지 |
| State Management | Zustand | Zustand | 이미 사용 중 |
| Animation | Framer Motion | Framer Motion | 이미 사용 중 |
| 3D | React Three Fiber | React Three Fiber | 이미 사용 중 |

### 8.3 새로운 컴포넌트 구조

```
src/
├── app/
│   └── v3/
│       └── page.tsx          # V3 메인 페이지
├── components/
│   └── chat/                 # 새로운 채팅 컴포넌트들
│       ├── ChatContainer.tsx # 전체 채팅 컨테이너
│       ├── ChatMessage.tsx   # 개별 메시지 컴포넌트
│       ├── ChatTyping.tsx    # 타이핑 인디케이터
│       ├── ChatActions.tsx   # 메시지 내 버튼들
│       ├── ChatInput.tsx     # 하단 입력창
│       └── ChatNav.tsx       # 좌측 챕터 네비게이션
├── lib/
│   └── chat-messages.ts      # 챕터별 메시지 데이터
└── hooks/
    └── useScrollTrigger.ts   # 스크롤 기반 메시지 트리거
```

---

## 9. Next Steps

1. [x] ~~Plan 문서 작성~~ (현재 문서)
2. [ ] Design 문서 작성 (`/pdca design v3-chat-storytelling`)
3. [ ] 컴포넌트 구현
4. [ ] Gap Analysis
5. [ ] 완성 보고서

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-02-04 | Initial draft | Claude Code |
