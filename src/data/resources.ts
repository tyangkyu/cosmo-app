export interface SpaceResource {
  id: string;
  name: string;
  emoji: string;
  planetId: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  description: string;
  craftingValue: number;
  scienceFact: string; // 자연스럽게 녹아있는 천문학 지식
}

export const spaceResources: SpaceResource[] = [
  // 달
  { id: 'moon_rock', name: '달 암석', emoji: '🪨', planetId: 'moon', rarity: 'common', description: '달 표면의 오래된 암석. 수십억 년의 역사를 담고 있어!', craftingValue: 10, scienceFact: '달에는 대기가 없어서 운석이 그대로 충돌해 이런 암석이 생겨났어' },
  { id: 'moon_dust', name: '달 먼지', emoji: '✨', planetId: 'moon', rarity: 'rare', description: '달 표면의 고운 먼지. 아폴로 우주인들 발자국이 수백만 년 남아있는 이유!', craftingValue: 25, scienceFact: '달에는 바람이 없어서 50년 전 아폴로 발자국이 지금도 그대로야' },
  { id: 'moon_crystal', name: '월광석', emoji: '💎', planetId: 'moon', rarity: 'epic', description: '달빛을 흡수한 신비로운 결정체', craftingValue: 80, scienceFact: '달은 지구의 자전을 안정시켜줘. 달이 없으면 지구가 뒤뚱뒤뚱!' },

  // 화성
  { id: 'mars_ore', name: '화성 철광석', emoji: '🔴', planetId: 'mars', rarity: 'common', description: '화성 표면에 가득한 산화철. 화성이 붉은 이유야!', craftingValue: 15, scienceFact: '화성이 빨간 이유는 표면에 산화철(녹)이 가득하기 때문이야' },
  { id: 'mars_sand', name: '화성 모래', emoji: '🏜️', planetId: 'mars', rarity: 'common', description: '화성 사막의 고운 모래. 올림푸스 산 주변에서 채취!', craftingValue: 8, scienceFact: '화성에는 태양계 최고 높은 산 올림푸스 산이 있어 (높이 21km!)' },
  { id: 'mars_ice', name: '화성 극지 얼음', emoji: '🧊', planetId: 'mars', rarity: 'rare', description: '화성 극지방의 얼음. 예전에 물이 흘렀다는 증거!', craftingValue: 40, scienceFact: '화성 극지방에 드라이아이스와 물 얼음이 있어. 옛날엔 강도 흘렀대!' },

  // 목성
  { id: 'jupiter_gas', name: '목성 에너지 결정', emoji: '⚡', planetId: 'jupiter', rarity: 'rare', description: '300년 폭풍에서 추출한 에너지 결정체', craftingValue: 60, scienceFact: '목성 대적반은 지구보다 큰 폭풍이 300년 넘게 계속되고 있어' },
  { id: 'europa_water', name: '유로파 심해수', emoji: '💧', planetId: 'jupiter', rarity: 'epic', description: '목성 위성 유로파 얼음 아래의 신비한 바닷물', craftingValue: 120, scienceFact: '유로파 얼음 아래에 지구 바다보다 2배 많은 물이 있을지도!' },

  // 토성
  { id: 'saturn_ring', name: '토성 고리 파편', emoji: '🪐', planetId: 'saturn', rarity: 'rare', description: '토성 고리의 얼음 조각. 아름다운 고리의 비밀!', craftingValue: 50, scienceFact: '토성의 고리는 얼음과 먼지로 만들어졌어. 넓이가 지구-달 거리만큼!' },
  { id: 'saturn_diamond', name: '토성 다이아몬드', emoji: '💠', planetId: 'saturn', rarity: 'legendary', description: '토성 내부 압력으로 만들어진 다이아몬드!', craftingValue: 300, scienceFact: '토성 내부 압력이 너무 강해서 탄소가 다이아몬드로 변한다는 연구가 있어' },

  // 천왕성
  { id: 'uranus_ice', name: '천왕성 메탄 얼음', emoji: '🔷', planetId: 'uranus', rarity: 'rare', description: '옆으로 누운 행성에서 채취한 파란 얼음', craftingValue: 55, scienceFact: '천왕성은 자전축이 98도 기울어져 옆으로 누워서 태양 주위를 돌아' },

  // 해왕성
  { id: 'neptune_wind', name: '해왕성 폭풍 결정', emoji: '🌀', planetId: 'neptune', rarity: 'epic', description: '시속 2100km 폭풍에서 만들어진 에너지 결정', craftingValue: 150, scienceFact: '해왕성의 바람은 시속 2,100km! 지구 허리케인의 9배야' },
  { id: 'neptune_diamond_rain', name: '해왕성 다이아 빗물', emoji: '🌧️', planetId: 'neptune', rarity: 'legendary', description: '해왕성에서 다이아몬드 비로 내리는 희귀 물질', craftingValue: 350, scienceFact: '해왕성 내부 압력으로 탄소가 다이아몬드로 변해 비처럼 내린다고 해!' },

  // 태양
  { id: 'solar_flare', name: '태양 플레어 에너지', emoji: '🔥', planetId: 'sun', rarity: 'epic', description: '태양 폭발에서 채취한 초고온 에너지', craftingValue: 200, scienceFact: '태양은 매초 600만 톤의 수소를 헬륨으로 바꾸며 에너지를 내뿜어' },
  { id: 'solar_core', name: '태양 핵융합 결정', emoji: '⭐', planetId: 'sun', rarity: 'legendary', description: '태양 중심부에서 얻은 핵융합 에너지 결정체', craftingValue: 500, scienceFact: '태양 중심 온도는 1500만 도! 핵융합으로 지구 130만 개 분량의 에너지를 가지고 있어' },

  // 혜성/소행성 (범용)
  { id: 'comet_ice', name: '혜성 얼음 조각', emoji: '☄️', planetId: 'asteroid', rarity: 'rare', description: '태양계를 여행하는 혜성의 꼬리에서 채취한 얼음', craftingValue: 45, scienceFact: '혜성의 꼬리는 항상 태양 반대 방향으로 뻗어있어. 태양풍 때문이야!' },
  { id: 'alien_material', name: '외계 물질', emoji: '👽', planetId: 'deep_space', rarity: 'legendary', description: '정체불명의 외계 물질. 분석 중...', craftingValue: 999, scienceFact: '우주에는 지구에 없는 원소들이 존재할 수 있어. 과학자들이 계속 탐구 중!' },
];

export const getResourcesByPlanet = (planetId: string): SpaceResource[] =>
  spaceResources.filter(r => r.planetId === planetId);

export const getResourceById = (id: string): SpaceResource | undefined =>
  spaceResources.find(r => r.id === id);
