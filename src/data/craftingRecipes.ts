export interface CraftingIngredient {
  resourceId: string;
  amount: number;
}

export interface CraftingRecipe {
  id: string;
  name: string;
  emoji: string;
  category: 'spacecraft' | 'observatory' | 'lab' | 'base' | 'telescope' | 'drone' | 'equipment';
  categoryLabel: string;
  description: string;
  ingredients: CraftingIngredient[];
  xpReward: number;
  unlocksFeature?: string;
  baseLevelRequired: number;
  scienceFact: string;
}

export const craftingRecipes: CraftingRecipe[] = [
  {
    id: 'lunar_rover',
    name: '달 탐사 로버',
    emoji: '🚗',
    category: 'drone',
    categoryLabel: '탐사 드론',
    description: '달 표면을 굴러다니며 더 많은 암석을 채굴하는 로버!',
    ingredients: [
      { resourceId: 'moon_rock', amount: 3 },
      { resourceId: 'moon_dust', amount: 2 },
    ],
    xpReward: 200,
    baseLevelRequired: 1,
    scienceFact: '실제로 아폴로 미션에서 월면차를 사용했어. 달 표면 30km 이상 탐험!',
  },
  {
    id: 'mars_base_tent',
    name: '화성 탐사 텐트',
    emoji: '⛺',
    category: 'base',
    categoryLabel: '우주 기지',
    description: '화성 사막에 세울 수 있는 첫 번째 임시 기지!',
    ingredients: [
      { resourceId: 'mars_ore', amount: 5 },
      { resourceId: 'mars_sand', amount: 3 },
    ],
    xpReward: 300,
    baseLevelRequired: 1,
    scienceFact: 'NASA는 실제로 화성에 인간 기지를 세우는 계획을 준비 중이야!',
  },
  {
    id: 'telescope_basic',
    name: '우주 망원경 Mk.1',
    emoji: '🔭',
    category: 'telescope',
    categoryLabel: '망원경',
    description: '가까운 행성을 더 자세히 관측할 수 있는 망원경!',
    ingredients: [
      { resourceId: 'moon_crystal', amount: 1 },
      { resourceId: 'mars_ore', amount: 3 },
    ],
    xpReward: 400,
    unlocksFeature: '오늘 밤 하늘 강화 관측',
    baseLevelRequired: 1,
    scienceFact: '갈릴레오는 1609년 최초로 망원경으로 목성의 위성을 발견했어!',
  },
  {
    id: 'storm_analyzer',
    name: '폭풍 분석기',
    emoji: '🌪️',
    category: 'lab',
    categoryLabel: '연구소',
    description: '목성 대적반 폭풍 데이터를 분석하는 장비!',
    ingredients: [
      { resourceId: 'jupiter_gas', amount: 3 },
      { resourceId: 'mars_ore', amount: 2 },
    ],
    xpReward: 500,
    baseLevelRequired: 2,
    scienceFact: '목성 대적반은 300년 넘게 계속되는 폭풍이야. 지구보다 크기도 해!',
  },
  {
    id: 'ice_drill',
    name: '극지 채굴 드릴',
    emoji: '⛏️',
    category: 'equipment',
    categoryLabel: '채굴 장비',
    description: '화성 극지방 얼음을 뚫어 숨겨진 자원을 캐는 드릴!',
    ingredients: [
      { resourceId: 'mars_ore', amount: 4 },
      { resourceId: 'mars_ice', amount: 2 },
    ],
    xpReward: 450,
    baseLevelRequired: 2,
    scienceFact: '화성 극지방에는 드라이아이스와 물 얼음이 있어. 미래 화성 기지 물 공급원!',
  },
  {
    id: 'saturn_ring_station',
    name: '토성 고리 정거장',
    emoji: '🛸',
    category: 'base',
    categoryLabel: '우주 기지',
    description: '토성 고리 위에 떠있는 우주 정거장!',
    ingredients: [
      { resourceId: 'saturn_ring', amount: 5 },
      { resourceId: 'jupiter_gas', amount: 2 },
    ],
    xpReward: 700,
    baseLevelRequired: 3,
    scienceFact: '토성 고리는 두께가 고작 10~100m인데 넓이는 지구-달 거리만큼이야!',
  },
  {
    id: 'blackhole_detector',
    name: '블랙홀 탐지기',
    emoji: '🌑',
    category: 'lab',
    categoryLabel: '연구소',
    description: '블랙홀 근처의 중력파를 탐지하는 장비!',
    ingredients: [
      { resourceId: 'neptune_wind', amount: 2 },
      { resourceId: 'solar_flare', amount: 1 },
    ],
    xpReward: 1000,
    unlocksFeature: '블랙홀 탐험 해금',
    baseLevelRequired: 4,
    scienceFact: '2019년 인류 최초로 블랙홀 사진을 찍었어! 지구에서 5500만 광년 떨어진 M87 블랙홀이야',
  },
  {
    id: 'warp_drive',
    name: '워프 드라이브',
    emoji: '🚀',
    category: 'spacecraft',
    categoryLabel: '우주선',
    description: '먼 은하까지 이동할 수 있는 초광속 엔진!',
    ingredients: [
      { resourceId: 'solar_core', amount: 1 },
      { resourceId: 'neptune_diamond_rain', amount: 1 },
      { resourceId: 'alien_material', amount: 1 },
    ],
    xpReward: 3000,
    unlocksFeature: '은하수 탐험 해금',
    baseLevelRequired: 5,
    scienceFact: '빛의 속도로 가도 가장 가까운 별까지 4년이 걸려. 워프 드라이브가 필요한 이유!',
  },
];

export const getRecipesByLevel = (baseLevel: number): CraftingRecipe[] =>
  craftingRecipes.filter(r => r.baseLevelRequired <= baseLevel);

export const getRecipeById = (id: string): CraftingRecipe | undefined =>
  craftingRecipes.find(r => r.id === id);
