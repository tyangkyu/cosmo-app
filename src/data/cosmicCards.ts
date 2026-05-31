export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface CosmicCard {
  id: string;
  name: string;
  emoji: string;
  category: 'planet' | 'star' | 'galaxy' | 'blackhole' | 'spacecraft';
  rarity: Rarity;
  description: string;
  funFact: string;
  acquireMethod: string;
}

export const cosmicCards: CosmicCard[] = [
  // 행성 카드 - Common
  { id: 'card_mercury', name: '수성', emoji: '☿', category: 'planet', rarity: 'common', description: '태양과 가장 가까운 행성', funFact: '낮엔 430도, 밤엔 -180도!', acquireMethod: '수성 탐험 완료' },
  { id: 'card_venus', name: '금성', emoji: '♀️', category: 'planet', rarity: 'common', description: '태양계에서 가장 뜨거운 행성', funFact: '하루가 1년보다 길어!', acquireMethod: '금성 탐험 완료' },
  { id: 'card_earth', name: '지구', emoji: '🌍', category: 'planet', rarity: 'rare', description: '우리가 사는 소중한 별', funFact: '우주에서 보면 파란 대리석!', acquireMethod: '지구 탐험 완료' },
  { id: 'card_moon', name: '달', emoji: '🌙', category: 'planet', rarity: 'common', description: '지구의 하나뿐인 위성', funFact: '매년 3.8cm씩 멀어지고 있어!', acquireMethod: '달 탐험 완료' },
  { id: 'card_mars', name: '화성', emoji: '♂️', category: 'planet', rarity: 'common', description: '붉은 행성, 미래의 목적지', funFact: '태양계 최고 높은 산이 있어!', acquireMethod: '화성 탐험 완료' },
  { id: 'card_jupiter', name: '목성', emoji: '🪐', category: 'planet', rarity: 'rare', description: '태양계 최대의 행성', funFact: '300년째 멈추지 않는 폭풍!', acquireMethod: '목성 탐험 완료' },
  { id: 'card_saturn', name: '토성', emoji: '🪐', category: 'planet', rarity: 'rare', description: '아름다운 고리의 행성', funFact: '물 위에 뜰 수 있어!', acquireMethod: '토성 탐험 완료' },
  { id: 'card_uranus', name: '천왕성', emoji: '⛢', category: 'planet', rarity: 'common', description: '옆으로 누워 도는 얼음 행성', funFact: '자전축이 98도 기울어!', acquireMethod: '천왕성 탐험 완료' },
  { id: 'card_neptune', name: '해왕성', emoji: '♆', category: 'planet', rarity: 'common', description: '태양계 끝의 바람 왕', funFact: '다이아몬드 비가 내려!', acquireMethod: '해왕성 탐험 완료' },
  { id: 'card_sun', name: '태양', emoji: '☀️', category: 'star', rarity: 'epic', description: '우리 태양계의 심장', funFact: '지구 130만 개가 들어가!', acquireMethod: '태양 탐험 완료' },

  // 별 카드
  { id: 'card_sirius', name: '시리우스', emoji: '⭐', category: 'star', rarity: 'rare', description: '밤하늘에서 가장 밝은 별', funFact: '태양보다 25배 밝아!', acquireMethod: '별자리 도감 큰개자리 완성' },
  { id: 'card_polaris', name: '북극성', emoji: '🌟', category: 'star', rarity: 'rare', description: '항상 북쪽을 가리키는 별', funFact: '자기 자신도 쌍성이야!', acquireMethod: '별자리 도감 작은곰자리 완성' },
  { id: 'card_betelgeuse', name: '베텔게우스', emoji: '🔴', category: 'star', rarity: 'epic', description: '폭발 직전의 거대한 별', funFact: '곧 초신성 폭발할 수도!', acquireMethod: '별자리 도감 오리온자리 완성' },

  // 은하 카드
  { id: 'card_milkyway', name: '은하수', emoji: '🌌', category: 'galaxy', rarity: 'epic', description: '우리가 사는 나선은하', funFact: '별이 2000억~4000억 개야!', acquireMethod: '은하수 탐험 도전' },
  { id: 'card_andromeda', name: '안드로메다', emoji: '🌀', category: 'galaxy', rarity: 'epic', description: '우리 은하의 이웃 은하', funFact: '40억 년 후 우리 은하와 충돌!', acquireMethod: '국부은하군 탐험' },

  // 블랙홀 카드
  { id: 'card_m87', name: 'M87 블랙홀', emoji: '🌑', category: 'blackhole', rarity: 'legendary', description: '최초로 사진 찍힌 블랙홀', funFact: '태양 질량의 65억 배!', acquireMethod: '블랙홀 전체 콘텐츠 완료' },
  { id: 'card_sagittarius', name: '궁수자리 A*', emoji: '⚫', category: 'blackhole', rarity: 'epic', description: '우리 은하 중심의 블랙홀', funFact: '태양 질량의 400만 배!', acquireMethod: '은하수 탐험 완료' },

  // 우주선 카드
  { id: 'card_voyager', name: '보이저 1호', emoji: '🛸', category: 'spacecraft', rarity: 'legendary', description: '태양계를 벗어난 탐사선', funFact: '46년 넘게 날아가고 있어!', acquireMethod: '7일 연속 출석' },
  { id: 'card_apollo', name: '아폴로 11호', emoji: '🚀', category: 'spacecraft', rarity: 'epic', description: '최초로 달에 간 우주선', funFact: '1969년에 달에 착륙했어!', acquireMethod: '달 탐험 + 퀴즈 전부 정답' },
  { id: 'card_hubble', name: '허블 망원경', emoji: '🔭', category: 'spacecraft', rarity: 'legendary', description: '우주를 바꾼 우주 망원경', funFact: '1990년부터 우주를 촬영 중!', acquireMethod: '모든 은하 카드 수집' },
];

export const getRarityColor = (rarity: Rarity): string => {
  const colors: Record<Rarity, string> = {
    common: '#9CA3AF',
    rare: '#3B82F6',
    epic: '#8B5CF6',
    legendary: '#F59E0B',
  };
  return colors[rarity];
};

export const getRarityLabel = (rarity: Rarity): string => {
  const labels: Record<Rarity, string> = {
    common: 'Common',
    rare: 'Rare',
    epic: 'Epic',
    legendary: 'Legendary ✨',
  };
  return labels[rarity];
};
