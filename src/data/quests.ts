export interface QuestStep {
  id: string;
  description: string;
  type: 'explore' | 'collect' | 'craft' | 'quiz' | 'wonder';
  target?: string;
  amount?: number;
  completed: boolean;
}

export interface Quest {
  id: string;
  title: string;
  emoji: string;
  characterId: string; // which MC character gives this quest
  story: string; // narrative quest description
  steps: Omit<QuestStep, 'completed'>[];
  reward: {
    xp: number;
    resources?: { resourceId: string; amount: number }[];
    cardId?: string;
    badgeId?: string;
    message: string;
  };
  planetId?: string;
  category: 'exploration' | 'mining' | 'crafting' | 'research' | 'building';
  scienceLearning: string; // 자연스럽게 배우는 천문학 지식
}

export const dailyQuestPool: Quest[] = [
  {
    id: 'q_moon_mining',
    title: '달 광산 탐사',
    emoji: '⛏️',
    characterId: 'steve',
    story: 'Steve: "야! 달에 희귀한 월광석이 있다는 소문을 들었어! 같이 채굴하러 가자!"',
    steps: [
      { id: 's1', description: '달 바이옴 방문하기', type: 'explore', target: 'moon' },
      { id: 's2', description: '오늘의 우주 발견 카드 확인', type: 'wonder' },
    ],
    reward: {
      xp: 150,
      resources: [{ resourceId: 'moon_rock', amount: 2 }],
      message: 'Steve: "대박! 월광석 2개 채굴 성공! 우주 탐험가 인정이야!"',
    },
    planetId: 'moon',
    category: 'mining',
    scienceLearning: '달 표면 탐험으로 달의 지질 구조를 자연스럽게 학습',
  },
  {
    id: 'q_star_quiz',
    title: '은하 상인의 퀴즈 미션',
    emoji: '💎',
    characterId: 'villager',
    story: 'Villager: "흠흠! 희귀 자원을 얻고 싶다고? 그럼 내 퀴즈를 통과해야지! 흠흠흠~"',
    steps: [
      { id: 's1', description: '우주 퀴즈 1문제 풀기', type: 'quiz' },
      { id: 's2', description: '바이옴 1곳 탐험하기', type: 'explore' },
    ],
    reward: {
      xp: 120,
      resources: [{ resourceId: 'comet_ice', amount: 1 }],
      message: 'Villager: "흠흠! 거래 성사! 혜성 얼음 조각을 드리죠! 흠흠흠~"',
    },
    category: 'research',
    scienceLearning: '퀴즈를 통한 천문학 지식 점검 및 강화',
  },
  {
    id: 'q_enderman_mystery',
    title: 'Enderman의 차원 관측',
    emoji: '🌑',
    characterId: 'enderman',
    story: 'Enderman: "...오늘 밤... 특별한 천체 현상이 있어... 함께... 관측하지 않겠어..."',
    steps: [
      { id: 's1', description: '오늘의 우주 발견 카드 탐색', type: 'wonder' },
      { id: 's2', description: '가장 멀리 있는 바이옴 방문', type: 'explore' },
    ],
    reward: {
      xp: 200,
      message: 'Enderman: "...흥미롭군... 우주의 비밀이... 한층 더 깊어졌어..."',
    },
    category: 'exploration',
    scienceLearning: '다양한 천체 현상 관찰 및 발견',
  },
  {
    id: 'q_mars_expedition',
    title: '화성 탐사대 결성',
    emoji: '🚀',
    characterId: 'alex',
    story: 'Alex: "오! 화성에서 이상한 신호가 잡혔어! 탐사대를 결성해서 확인하러 가자!"',
    steps: [
      { id: 's1', description: '화성 바이옴 탐험', type: 'explore', target: 'mars' },
      { id: 's2', description: '퀴즈 1문제 정답', type: 'quiz' },
    ],
    reward: {
      xp: 180,
      resources: [{ resourceId: 'mars_ore', amount: 3 }],
      message: 'Alex: "오! 화성 철광석 3개 발견! 탐사 대성공이야!"',
    },
    planetId: 'mars',
    category: 'exploration',
    scienceLearning: '화성 지질 및 탐사 역사 학습',
  },
  {
    id: 'q_creeper_blackhole',
    title: 'Creeper의 폭발적 발견',
    emoji: '💥',
    characterId: 'creeper',
    story: 'Creeper: "이거봐봐!! 블랙홀 데이터가 완전 폭발적으로 신기해!! 같이 연구하자!!"',
    steps: [
      { id: 's1', description: '오늘의 우주 발견 확인', type: 'wonder' },
      { id: 's2', description: '퀴즈 도전', type: 'quiz' },
    ],
    reward: {
      xp: 160,
      message: 'Creeper: "앗! 대박!! 우주가 이렇게 폭발적으로 신기할 줄이야!!"',
    },
    category: 'research',
    scienceLearning: '블랙홀 및 우주 극단적 천체 현상 학습',
  },
  {
    id: 'q_golem_patrol',
    title: 'Iron Golem의 순찰 임무',
    emoji: '🛡️',
    characterId: 'iron_golem',
    story: 'Iron Golem: "태양계 안전 점검이 필요해! 행성 3곳을 순찰하고 데이터를 보고해!"',
    steps: [
      { id: 's1', description: '바이옴 1곳 탐험', type: 'explore' },
      { id: 's2', description: '오늘의 우주 발견 확인', type: 'wonder' },
      { id: 's3', description: '퀴즈 1문제 풀기', type: 'quiz' },
    ],
    reward: {
      xp: 250,
      resources: [{ resourceId: 'moon_dust', amount: 1 }],
      message: 'Iron Golem: "순찰 완료! 태양계 안전 확인됐어. 잘 해냈어!"',
    },
    category: 'exploration',
    scienceLearning: '태양계 전반적인 특성 및 비교 학습',
  },
];

export const achievements = [
  { id: 'first_biome', title: '첫 바이옴 발견!', emoji: '🏆', desc: '첫 번째 행성 바이옴 탐험 완료', xp: 100 },
  { id: 'moon_miner', title: '달 광부', emoji: '⛏️', desc: '달에서 자원 3종 채굴', xp: 200 },
  { id: 'solar_system_explorer', title: '태양계 정복자', emoji: '🌌', desc: '태양계 모든 바이옴 방문', xp: 1000 },
  { id: 'crafter_1', title: '초보 제작사', emoji: '🔨', desc: '아이템 1개 제작 완료', xp: 150 },
  { id: 'crafter_3', title: '우주 제작사', emoji: '⚒️', desc: '아이템 3개 제작 완료', xp: 500 },
  { id: 'base_builder', title: '기지 건설자', emoji: '🏗️', desc: '우주 기지 레벨 2 달성', xp: 300 },
  { id: 'quiz_master', title: '우주 박사', emoji: '🧠', desc: '퀴즈 10문제 연속 정답', xp: 400 },
  { id: 'collector_10', title: '카드 수집가', emoji: '🃏', desc: '카드 10장 수집', xp: 200 },
  { id: 'streak_7', title: '7일 탐험가', emoji: '📅', desc: '7일 연속 접속', xp: 350 },
  { id: 'warp_ready', title: '은하계 탐험 준비', emoji: '🚀', desc: '워프 드라이브 제작 완료', xp: 2000 },
];
