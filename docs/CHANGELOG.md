# Changelog

## [1.0.0] - 2026-05-31

### 최초 MVP 빌드

#### 앱 구조
- Expo SDK 54 기반 React Native 앱
- TypeScript 전체 적용
- React Navigation v7 탭 내비게이션 (8탭)
- Zustand + AsyncStorage 상태 관리

#### 화면 구현
- **온보딩**: 3단계 슬라이드, 닉네임 입력, 지구 카드(Rare) 시작 선물
- **홈 (퀘스트 보드)**: 마인크래프트 캐릭터 퀘스트, XP 바, 오늘의 우주 발견, 일일 미션
- **바이옴 탐험**: 10개 행성 바이옴, 위험도 등급, 자원 채굴, 퀘스트 힌트
- **제작소**: 15종 자원 인벤토리, 8종 제작 레시피, 재료 조합 UI
- **우주 기지**: Lv.1~5 업그레이드, 탐험가 프로필, 10종 업적 시스템
- **AI 동반자**: Steve/Alex/Villager/Enderman/Iron Golem/Creeper 캐릭터 선택, Claude API 연동
- **퀴즈**: 12문제 풀에서 랜덤 5문제, 정답/오답 애니메이션, 해설 제공
- **카드 도감**: 20장 수집 (Common~Legendary), 카테고리 필터
- **오늘 밤 하늘**: GPS 위치 기반 계절별 천체, 관측 인증 +200 XP

#### 데이터
- 일일 우주 발견 12개 콘텐츠
- 행성 바이옴 10종 (위험도, 비교 설명, 사실 3개씩)
- 우주 자원 15종
- 제작 레시피 8종
- MC 캐릭터 6종 (개성 있는 시스템 프롬프트)
- 일일 퀘스트 6종 (날짜별 순환)
- 업적 10종
- 퀴즈 12문제
- 카드 20장

#### 기술적 사항
- Expo SDK 54로 다운그레이드 (Expo Go 한국 앱스토어 호환)
- babel.config.js 설정 (babel-preset-expo)
- Platform.select()로 iOS/Android/Web 그림자 처리 분기
- useNativeDriver: Platform.OS !== 'web' 처리
- AsyncStorage v2.2.0 (Expo 54 호환)
- gesture-handler import를 index.ts 최상단으로 이동
