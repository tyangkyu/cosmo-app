# 🚀 COSMO — 초등학생 우주 탐험 앱

> "우주 공부를 하고 있다" 가 아니라 **"마인크래프트 우주 모드를 플레이하고 있다"** 는 느낌의 앱

[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2054-000020?logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://typescriptlang.org)

---

## 📱 앱 컨셉

**COSMO**는 초등학교 4~6학년 학생이 천문학을 **자연스럽게 좋아하게 만드는** 교육 엔터테인먼트 앱입니다.

마인크래프트의 탐험·채굴·제작·건설 경험을 우주에 접목하여,  
아이들이 퀘스트를 수행하고 자원을 채굴하고 기지를 건설하는 과정에서  
**자연스럽게 천문학 지식을 습득**하도록 설계했습니다.

```
초등학생용 우주판 마인크래프트 + 포켓몬 도감 + 듀오링고 + 우주 유튜브 쇼츠
```

---

## 🎮 핵심 기능

### 📋 퀘스트 보드 (홈)
- 마인크래프트 캐릭터(Steve, Alex, Villager 등)가 퀘스트 제공
- 탐험 → 채굴 → 제작 → 건설 흐름의 모험형 미션
- XP·레벨 시스템 (우주 새싹 → 전설의 천문학자)

### 🗺️ 바이옴 탐험
- 10개 행성을 **바이옴**으로 표현 (달 분화구, 화성 사막, 목성 폭풍 등)
- 위험도 1~5 등급, 채굴 가능 자원 표시
- 바이옴 탐험 시 천문학 지식을 자연스럽게 발견

### ⚒️ 제작소
- 15종 우주 자원 수집 (달 암석, 화성 광물, 토성 다이아몬드 등)
- 8종 레시피 (달 탐사 로버 → 워프 드라이브)
- 마인크래프트 스타일 인벤토리 + 재료 조합

### 🏗️ 우주 기지
- Lv.1 우주 텐트 → Lv.5 갤럭시 기지 (5단계 업그레이드)
- 레벨 달성 시 새로운 바이옴·레시피·AI 캐릭터 해금
- 10종 업적 시스템

### 🎮 AI 동반자 (마인크래프트 캐릭터)
| 캐릭터 | 역할 | 말투 |
|---|---|---|
| Steve 🧑‍🦱 | 모험가 | 직설적·열정적 |
| Alex 👩‍🦰 | 탐험가 | 호기심·발견 |
| Villager 🧑‍🌾 | 상인 | 흠흠·거래 |
| Enderman 🕶️ | 신비주의자 | 조용·철학적 |
| Iron Golem 🤖 | 수호자 | 정확·신뢰감 |
| Creeper 💚 | 장난꾸러기 | 과장·흥분 |

선택형 AI 프록시 연동, 캐릭터별 개성 있는 시스템 프롬프트 적용

### 기타
- 🔍 오늘의 우주 발견 (카드 뒤집기 애니메이션)
- 🧠 우주 퀴즈 (12문제, 정답 해설 포함)
- 🃏 카드 수집 도감 (20장, Common~Legendary)
- 🌙 오늘 밤 하늘 (GPS 기반 실시간 천체 안내)

---

## 🛠️ 기술 스택

| 분류 | 기술 |
|---|---|
| Framework | React Native (Expo SDK 54) |
| Language | TypeScript |
| Navigation | React Navigation v7 (Bottom Tabs) |
| State | Zustand + AsyncStorage |
| Animation | React Native Animated API |
| AI | Optional server-side AI proxy |
| Styling | StyleSheet + expo-linear-gradient |
| Haptics | expo-haptics |
| Location | expo-location |

---

## 🚀 실행 방법

### 1. 설치

```bash
git clone https://github.com/tyangkyu/cosmo-app.git
cd cosmo-app
npm install
```

### 2. 환경 변수 설정

```bash
cp .env.example .env
# 선택 사항: 서버 측 AI 프록시 URL 입력
# EXPO_PUBLIC_AI_PROXY_URL=https://your-domain.example.com/api/cosmo-chat
```

> API 키 없이도 앱은 동작합니다. AI 동반자가 오프라인 폴백 응답으로 자동 전환됩니다.
> Anthropic/OpenAI 같은 외부 API 키는 Expo 앱의 `EXPO_PUBLIC_*` 환경변수에 넣지 마세요. 이 값은 클라이언트 번들에 포함되므로, 실제 API 키는 서버 프록시나 백엔드 환경변수에만 보관해야 합니다.

### 3. 실행

```bash
# 웹 브라우저
npx expo start --web

# 모바일 (Expo Go 앱 필요, SDK 54 이상)
npx expo start --clear
# QR 코드를 Expo Go 앱으로 스캔
```

### Expo Go 버전 확인
앱 설정 → Supported SDK가 **54 이상**이어야 합니다.

---

## 📁 프로젝트 구조

```
cosmo-app/
├── App.tsx                    # 루트 + 탭 네비게이션
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx     # 퀘스트 보드
│   │   ├── ExploreScreen.tsx  # 바이옴 탐험
│   │   ├── CraftingScreen.tsx # 제작소
│   │   ├── BaseScreen.tsx     # 우주 기지 + 업적
│   │   ├── CocoScreen.tsx     # AI 동반자 (MC 캐릭터)
│   │   ├── QuizScreen.tsx     # 우주 퀴즈
│   │   ├── CollectScreen.tsx  # 카드 도감
│   │   ├── TonightScreen.tsx  # 오늘 밤 하늘
│   │   └── OnboardingScreen.tsx
│   ├── components/
│   │   ├── DailyWonderCard.tsx  # 카드 뒤집기
│   │   ├── CosmicCardItem.tsx   # 수집 카드
│   │   └── XPBar.tsx
│   ├── data/
│   │   ├── biomes.ts          # 행성 바이옴 데이터
│   │   ├── resources.ts       # 우주 자원 (15종)
│   │   ├── craftingRecipes.ts # 제작 레시피 (8종)
│   │   ├── mcCharacters.ts    # MC 캐릭터 (6종)
│   │   ├── quests.ts          # 일일 퀘스트 + 업적
│   │   ├── dailyWonders.ts    # 오늘의 우주 발견
│   │   ├── quizzes.ts         # 퀴즈 문제 (12종)
│   │   ├── cosmicCards.ts     # 수집 카드 (20종)
│   │   └── planets.ts
│   ├── store/
│   │   └── useStore.ts        # Zustand 전역 상태
│   └── theme/
│       └── colors.ts
└── docs/
    └── PRD.md                 # 전체 기획 문서
```

---

## 🗺️ 개발 로드맵

### ✅ MVP (현재)
- 온보딩, 퀘스트 보드, 바이옴 탐험
- 제작소, 우주 기지, AI 동반자
- 퀴즈, 카드 수집, 오늘 밤 하늘

### 🔄 v1.1 (예정)
- AR 별자리 찾기
- 친구 카드 교환
- 시즌 패스 시스템

### 💭 v2.0 (장기)
- 은하수 탐험 맵 확장
- 학교 수업 연계 교사 모드
- 글로벌 출시 (영어/일본어)

---

## 📄 기획 문서

전체 PRD 및 설계 문서는 [`docs/PRD.md`](./docs/PRD.md)를 참고하세요.

---

## 👨‍💻 개발 정보

- **대상**: 초등학교 4-6학년 (10-12세)
- **플랫폼**: iOS / Android / Web
- **AI 보조 개발**: Claude (Anthropic)

## 🔐 보안 주의사항

- `.env`는 로컬 전용 파일이며 GitHub에 올리지 않습니다.
- Expo의 `EXPO_PUBLIC_*` 환경변수에는 공개되어도 되는 값만 넣습니다.
- 외부 AI API Key, Firebase/Supabase Secret, 배포 토큰은 서버 환경변수나 배포 플랫폼 Secret으로 관리합니다.
- `node_modules`, `.expo`, 빌드 산출물, 로그 파일은 저장소에 커밋하지 않습니다.
