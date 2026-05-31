export interface Quiz {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  emoji: string;
  category: string;
}

export const quizzes: Quiz[] = [
  {
    id: 'q001',
    question: '달에 가면 몸무게가 어떻게 될까?',
    options: ['6배 무거워진다', '6배 가벼워진다', '똑같다', '2배 무거워진다'],
    answerIndex: 1,
    explanation: '달의 중력은 지구의 1/6이야! 그래서 달에서는 엄청 높이 뛸 수 있어. 지구에서 1m 뛰면 달에서는 6m를 뛸 수 있지! 🚀',
    emoji: '🌙',
    category: '태양계',
  },
  {
    id: 'q002',
    question: '태양계에서 가장 큰 행성은?',
    options: ['토성', '목성', '천왕성', '해왕성'],
    answerIndex: 1,
    explanation: '목성이 맞아! 목성은 지구가 1,300개 이상 들어갈 만큼 엄청나게 커. 지구가 농구공이라면 목성은 자동차 크기야! 🪐',
    emoji: '🪐',
    category: '태양계',
  },
  {
    id: 'q003',
    question: '태양에서 지구까지 빛으로 달리면 얼마나 걸릴까?',
    options: ['1초', '3분', '8분 20초', '1시간'],
    answerIndex: 2,
    explanation: '약 8분 20초야! 태양과 지구 사이 거리가 1억 5천만 km인데, 빛이 그 거리를 달리는 시간이야. 태양이 꺼져도 우리는 8분 후에 알게 돼! ☀️',
    emoji: '☀️',
    category: '태양계',
  },
  {
    id: 'q004',
    question: '토성의 고리는 무엇으로 만들어져 있을까?',
    options: ['불꽃과 가스', '얼음과 먼지', '금과 다이아몬드', '물과 구름'],
    answerIndex: 1,
    explanation: '토성의 고리는 주로 얼음 조각과 먼지로 이루어져 있어! 크기가 모래알만 한 것부터 집만 한 것까지 다양해. 정말 아름답지? 🪐',
    emoji: '🪐',
    category: '태양계',
  },
  {
    id: 'q005',
    question: '화성은 왜 빨갛게 보일까?',
    options: ['불이 타고 있어서', '산화철(녹)이 많아서', '피가 흘러서', '석양 때문에'],
    answerIndex: 1,
    explanation: '화성 표면에 산화철, 쉽게 말하면 녹이 아주 많아서 빨갛게 보여! 지구에서도 녹슨 철이 빨갛잖아. 화성은 온통 녹투성이 행성이야! ♂️',
    emoji: '♂️',
    category: '태양계',
  },
  {
    id: 'q006',
    question: '태양계 행성 중 고리가 없는 것은?',
    options: ['토성', '목성', '지구', '천왕성'],
    answerIndex: 2,
    explanation: '지구에는 고리가 없어! 사실 목성, 토성, 천왕성, 해왕성 모두 고리가 있어. 토성의 고리가 가장 크고 아름다워서 유명한 거야! 🌍',
    emoji: '🌍',
    category: '태양계',
  },
  {
    id: 'q007',
    question: '블랙홀이 특별한 이유는?',
    options: ['색깔이 검어서', '빛조차 빠져나올 수 없어서', '온도가 0도여서', '크기가 작아서'],
    answerIndex: 1,
    explanation: '블랙홀의 중력이 너무 강해서 빛조차 빠져나올 수 없어! 그래서 아무것도 보이지 않아. 우주의 진공청소기라고 할 수 있지! 🌑',
    emoji: '🌑',
    category: '별과 우주',
  },
  {
    id: 'q008',
    question: '밤하늘의 별이 반짝이는 이유는?',
    options: ['별이 깜박이는 조명이어서', '지구 대기가 빛을 흔들어서', '별이 켜졌다 꺼졌다 해서', '구름이 가려서'],
    answerIndex: 1,
    explanation: '별 자체는 반짝이지 않아! 별빛이 지구 대기를 통과할 때 공기가 빛을 여러 방향으로 흔들어서 반짝이는 것처럼 보이는 거야. 대기가 없는 우주에서 보면 별이 반짝이지 않아! ⭐',
    emoji: '⭐',
    category: '별과 우주',
  },
  {
    id: 'q009',
    question: '우리 은하(은하수)의 이름은?',
    options: ['안드로메다', '밀키웨이 (Milky Way)', '마젤란 성운', '처녀자리 은하'],
    answerIndex: 1,
    explanation: '우리 은하의 영어 이름은 밀키웨이야! 밤하늘에 희뿌옇게 보이는 별들의 띠가 우리 은하의 원반 부분이야. 약 2,000억~4,000억 개의 별이 있어! 🌌',
    emoji: '🌌',
    category: '별과 우주',
  },
  {
    id: 'q010',
    question: '수성에서 낮 온도는 얼마나 될까?',
    options: ['100도', '200도', '430도', '600도'],
    answerIndex: 2,
    explanation: '수성 낮 온도는 430도야! 근데 신기한 건, 밤에는 -180도까지 내려가. 대기가 없어서 열을 보존할 수 없기 때문이야. 하루에 냉탕과 열탕을 오가는 행성! ☿',
    emoji: '☿',
    category: '태양계',
  },
  {
    id: 'q011',
    question: '달이 지구 주위를 한 바퀴 도는 데 걸리는 시간은?',
    options: ['7일', '약 27일', '30일', '365일'],
    answerIndex: 1,
    explanation: '달은 약 27.3일에 한 번 지구 주위를 돌아! 재밌는 건, 달이 자전하는 시간도 똑같아서 우리는 항상 달의 같은 면만 볼 수 있어. 달의 뒷면은 지구에서 절대 보이지 않아! 🌙',
    emoji: '🌙',
    category: '태양계',
  },
  {
    id: 'q012',
    question: '태양계에서 태양까지 가장 멀리 있는 행성은?',
    options: ['명왕성', '해왕성', '천왕성', '토성'],
    answerIndex: 1,
    explanation: '행성 중에서는 해왕성이 가장 멀어! 태양에서 해왕성까지 빛으로 4시간 걸려. 참고로 명왕성은 2006년에 행성에서 왜소행성으로 분류가 바뀌었어! ♆',
    emoji: '♆',
    category: '태양계',
  },
];

export const getRandomQuizzes = (count: number = 3): Quiz[] => {
  const shuffled = [...quizzes].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
