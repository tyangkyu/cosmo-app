import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ResourceInventory {
  [resourceId: string]: number;
}

export interface ActiveQuest {
  questId: string;
  stepProgress: number; // how many steps completed
  startedAt: number;
}

export interface UserState {
  nickname: string;
  level: number;
  xp: number;
  collectedCards: string[];
  completedQuizzes: string[];
  visitedPlanets: string[];
  dailyWonderSeen: boolean;
  dailyMissions: { id: string; completed: boolean }[];
  badges: string[];
  streak: number;
  lastLoginDate: string;

  // Minecraft mode extras
  selectedCharacterId: string;
  resources: ResourceInventory;
  craftedItems: string[];
  baseLevel: number;
  activeQuest: ActiveQuest | null;
  completedQuestIds: string[];
  todayQuestId: string;

  // Actions
  setNickname: (name: string) => void;
  addXP: (amount: number) => void;
  collectCard: (cardId: string) => void;
  completeQuiz: (quizId: string) => void;
  visitPlanet: (planetId: string) => void;
  setDailyWonderSeen: () => void;
  completeDailyMission: (missionId: string) => void;
  earnBadge: (badgeId: string) => void;
  setCharacter: (characterId: string) => void;
  addResource: (resourceId: string, amount: number) => void;
  craftItem: (recipeId: string, cost: ResourceInventory) => boolean;
  upgradeBase: () => void;
  startQuest: (questId: string) => void;
  advanceQuest: () => void;
  completeQuest: (questId: string) => void;
  loadState: () => Promise<void>;
  saveState: () => Promise<void>;
  resetDaily: () => void;
}

const XP_PER_LEVEL = 300;

const pickTodayQuest = (): string => {
  const questIds = ['q_moon_mining', 'q_star_quiz', 'q_enderman_mystery', 'q_mars_expedition', 'q_creeper_blackhole', 'q_golem_patrol'];
  const day = Math.floor(Date.now() / 86400000);
  return questIds[day % questIds.length];
};

const getInitialMissions = () => [
  { id: 'daily_wonder', completed: false },
  { id: 'quiz', completed: false },
  { id: 'explore', completed: false },
];

export const useStore = create<UserState>((set, get) => ({
  nickname: '',
  level: 1,
  xp: 0,
  collectedCards: [],
  completedQuizzes: [],
  visitedPlanets: [],
  dailyWonderSeen: false,
  dailyMissions: getInitialMissions(),
  badges: [],
  streak: 1,
  lastLoginDate: new Date().toDateString(),
  selectedCharacterId: 'random',
  resources: {},
  craftedItems: [],
  baseLevel: 1,
  activeQuest: null,
  completedQuestIds: [],
  todayQuestId: pickTodayQuest(),

  setNickname: (name) => { set({ nickname: name }); get().saveState(); },

  addXP: (amount) => {
    const { xp } = get();
    const newXP = xp + amount;
    const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
    set({ xp: newXP, level: newLevel });
    get().saveState();
  },

  collectCard: (cardId) => {
    const { collectedCards } = get();
    if (!collectedCards.includes(cardId)) {
      set({ collectedCards: [...collectedCards, cardId] });
      get().addXP(50);
      get().saveState();
    }
  },

  completeQuiz: (quizId) => {
    const { completedQuizzes } = get();
    if (!completedQuizzes.includes(quizId)) {
      set({ completedQuizzes: [...completedQuizzes, quizId] });
    }
    get().completeDailyMission('quiz');
    get().advanceQuest();
    get().addXP(30);
    get().saveState();
  },

  visitPlanet: (planetId) => {
    const { visitedPlanets } = get();
    if (!visitedPlanets.includes(planetId)) {
      set({ visitedPlanets: [...visitedPlanets, planetId] });
      get().addXP(100);
      // 첫 바이옴 발견 업적
      if (visitedPlanets.length === 0) get().earnBadge('first_biome');
    }
    get().completeDailyMission('explore');
    get().advanceQuest();
    get().saveState();
  },

  setDailyWonderSeen: () => {
    set({ dailyWonderSeen: true });
    get().completeDailyMission('daily_wonder');
    get().advanceQuest();
    get().addXP(50);
    get().saveState();
  },

  completeDailyMission: (missionId) => {
    const { dailyMissions } = get();
    const updated = dailyMissions.map((m) =>
      m.id === missionId ? { ...m, completed: true } : m,
    );
    set({ dailyMissions: updated });
  },

  earnBadge: (badgeId) => {
    const { badges } = get();
    if (!badges.includes(badgeId)) {
      set({ badges: [...badges, badgeId] });
      get().saveState();
    }
  },

  setCharacter: (characterId) => {
    set({ selectedCharacterId: characterId });
    get().saveState();
  },

  addResource: (resourceId, amount) => {
    const { resources } = get();
    set({ resources: { ...resources, [resourceId]: (resources[resourceId] || 0) + amount } });
    get().saveState();
  },

  craftItem: (recipeId, cost) => {
    const { resources, craftedItems } = get();
    // 재료 확인
    for (const [rid, amt] of Object.entries(cost)) {
      if ((resources[rid] || 0) < amt) return false;
    }
    // 재료 차감
    const newResources = { ...resources };
    for (const [rid, amt] of Object.entries(cost)) {
      newResources[rid] = (newResources[rid] || 0) - amt;
    }
    set({ resources: newResources, craftedItems: [...craftedItems, recipeId] });
    get().earnBadge('crafter_1');
    if (craftedItems.length + 1 >= 3) get().earnBadge('crafter_3');
    get().saveState();
    return true;
  },

  upgradeBase: () => {
    const { baseLevel } = get();
    set({ baseLevel: baseLevel + 1 });
    if (baseLevel + 1 >= 2) get().earnBadge('base_builder');
    get().saveState();
  },

  startQuest: (questId) => {
    set({ activeQuest: { questId, stepProgress: 0, startedAt: Date.now() } });
    get().saveState();
  },

  advanceQuest: () => {
    const { activeQuest } = get();
    if (!activeQuest) return;
    set({ activeQuest: { ...activeQuest, stepProgress: activeQuest.stepProgress + 1 } });
    get().saveState();
  },

  completeQuest: (questId) => {
    const { completedQuestIds } = get();
    if (!completedQuestIds.includes(questId)) {
      set({ completedQuestIds: [...completedQuestIds, questId], activeQuest: null });
    }
    get().saveState();
  },

  resetDaily: () => {
    const today = new Date().toDateString();
    const { lastLoginDate } = get();
    if (lastLoginDate !== today) {
      set({
        dailyWonderSeen: false,
        dailyMissions: getInitialMissions(),
        lastLoginDate: today,
        todayQuestId: pickTodayQuest(),
        activeQuest: null,
      });
      get().saveState();
    }
  },

  loadState: async () => {
    try {
      const saved = await AsyncStorage.getItem('@cosmo_state_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        set(parsed);
      }
    } catch { /* fresh start */ }
  },

  saveState: async () => {
    try {
      const s = get();
      await AsyncStorage.setItem('@cosmo_state_v2', JSON.stringify({
        nickname: s.nickname,
        level: s.level,
        xp: s.xp,
        collectedCards: s.collectedCards,
        completedQuizzes: s.completedQuizzes,
        visitedPlanets: s.visitedPlanets,
        dailyWonderSeen: s.dailyWonderSeen,
        dailyMissions: s.dailyMissions,
        badges: s.badges,
        streak: s.streak,
        lastLoginDate: s.lastLoginDate,
        selectedCharacterId: s.selectedCharacterId,
        resources: s.resources,
        craftedItems: s.craftedItems,
        baseLevel: s.baseLevel,
        completedQuestIds: s.completedQuestIds,
        todayQuestId: s.todayQuestId,
      }));
    } catch { /* ignore */ }
  },
}));

export const getLevelTitle = (level: number): string => {
  if (level <= 2) return '우주 새싹 🌱';
  if (level <= 5) return '행성 개척자 ⛏️';
  if (level <= 10) return '우주 광부 🪨';
  if (level <= 15) return '별빛 탐험가 🚀';
  if (level <= 25) return '은하 건축가 🏗️';
  if (level <= 40) return '블랙홀 연구원 🌑';
  return '전설의 천문학자 👑';
};
