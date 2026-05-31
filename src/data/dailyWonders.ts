export interface DailyWonder {
  id: string;
  emoji: string;
  frontHint: string;
  title: string;
  description: string;
  funFact: string;
  relatedPlanet?: string;
}

export const dailyWonders: DailyWonder[] = [
  {
    id: 'dw_001',
    emoji: '🪐',
    frontHint: '목성의 숨겨진 비밀',
    title: '300년째 멈추지 않는 폭풍!',
    description: '목성에 있는 대적반은 지구보다 큰 거대한 폭풍이야. 이 폭풍은 무려 300년 이상 계속 돌고 있어!',
    funFact: '대적반의 크기는 지구 2개를 합친 것보다 커!',
    relatedPlanet: 'jupiter',
  },
  {
    id: 'dw_002',
    emoji: '☀️',
    frontHint: '태양의 엄청난 크기',
    title: '태양 안에 지구 130만 개!',
    description: '태양이 얼마나 큰지 알아? 태양 안에 지구가 무려 130만 개나 들어갈 수 있어!',
    funFact: '태양에서 지구까지 빛으로 달리면 8분 20초 걸려',
    relatedPlanet: 'sun',
  },
  {
    id: 'dw_003',
    emoji: '♀️',
    frontHint: '하루가 1년보다 긴 행성',
    title: '금성에서는 하루 = 1년!',
    description: '금성은 너무 천천히 자전해서, 금성에서의 하루가 금성의 1년보다 길어! 완전 이상하지?',
    funFact: '금성은 거꾸로 자전해서 태양이 서쪽에서 떠!',
    relatedPlanet: 'venus',
  },
  {
    id: 'dw_004',
    emoji: '🌑',
    frontHint: '블랙홀의 신비',
    title: '블랙홀 근처에서는 시간이 느려져!',
    description: '블랙홀 가까이 가면 시간이 정말 느리게 흘러. 공상과학 영화 같지만 진짜야!',
    funFact: '블랙홀은 빛조차 빨아들일 만큼 강한 중력을 가졌어',
  },
  {
    id: 'dw_005',
    emoji: '🪐',
    frontHint: '물 위에 뜨는 행성?',
    title: '토성은 물 위에 뜰 수 있어!',
    description: '토성의 평균 밀도가 물보다 낮아서, 엄청 큰 욕조가 있다면 토성은 둥실 떠있을 거야!',
    funFact: '토성 고리는 얼음과 먼지로 만들어졌어',
    relatedPlanet: 'saturn',
  },
  {
    id: 'dw_006',
    emoji: '🌙',
    frontHint: '달에서의 발자국',
    title: '달의 발자국은 수백만 년 남아!',
    description: '달에는 바람이 없어서 아폴로 우주인들이 남긴 발자국이 수백만 년 동안 그대로 남아있어!',
    funFact: '달은 매년 3.8cm씩 지구에서 멀어지고 있어',
    relatedPlanet: 'moon',
  },
  {
    id: 'dw_007',
    emoji: '⭐',
    frontHint: '우리가 보는 별빛',
    title: '지금 보이는 별빛은 수천 년 전 빛!',
    description: '별들이 너무 멀리 있어서, 우리가 보는 별빛은 수백~수천 년 전에 출발한 빛이야!',
    funFact: '어떤 별들은 우리가 볼 때 이미 존재하지 않을 수도 있어',
  },
  {
    id: 'dw_008',
    emoji: '♂️',
    frontHint: '화성의 거대한 산',
    title: '화성에 태양계 최고 높은 산이!',
    description: '올림푸스 산은 에베레스트 산의 3배 높이인 21km야. 태양계에서 가장 높은 화산이야!',
    funFact: '화성 하루는 지구보다 37분 더 길어',
    relatedPlanet: 'mars',
  },
  {
    id: 'dw_009',
    emoji: '🌊',
    frontHint: '얼음 아래 숨겨진 바다',
    title: '목성 위성 유로파에 바다가 있어!',
    description: '유로파는 얼음으로 덮여있지만 그 아래 지구 바다보다 2배나 많은 물이 있을 거야!',
    funFact: '유로파에 생명체가 살 가능성이 있다고 과학자들이 생각해',
  },
  {
    id: 'dw_010',
    emoji: '🌌',
    frontHint: '우주의 크기',
    title: '우주에 별이 모래알보다 많아!',
    description: '관측 가능한 우주에는 별이 약 2조 개 이상의 은하에 수백억 개씩 있어. 지구의 모래알보다 훨씬 많아!',
    funFact: '우리 은하 하나에만 별이 약 2000억~4000억 개야',
  },
  {
    id: 'dw_011',
    emoji: '🌪️',
    frontHint: '천왕성의 이상한 자전',
    title: '천왕성은 옆으로 누워서 돌아!',
    description: '천왕성의 자전축이 98도나 기울어져 있어. 거의 옆으로 눕혀진 채로 태양 주위를 돌고 있어!',
    funFact: '천왕성의 계절은 각 42년씩 지속돼',
    relatedPlanet: 'uranus',
  },
  {
    id: 'dw_012',
    emoji: '💎',
    frontHint: '다이아몬드 비가 내리는 곳',
    title: '해왕성에는 다이아몬드 비가 내려!',
    description: '해왕성 내부의 엄청난 압력이 탄소를 다이아몬드로 만들어. 다이아몬드 비가 내린다고 해!',
    funFact: '해왕성의 바람 속도는 시속 2,100km나 돼',
    relatedPlanet: 'neptune',
  },
];

export const getDailyWonder = (): DailyWonder => {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86400000,
  );
  return dailyWonders[dayOfYear % dailyWonders.length];
};
