import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DailyWonderCard } from '../components/DailyWonderCard';
import { XPBar } from '../components/XPBar';
import { getDailyWonder } from '../data/dailyWonders';
import { dailyQuestPool } from '../data/quests';
import { getCharacterById, getRandomCharacter } from '../data/mcCharacters';
import { useStore, getLevelTitle } from '../store/useStore';
import { colors } from '../theme/colors';

interface Props { navigation: any; }

const DANGER_LABELS = ['', '안전', '주의', '위험', '고위험', '극한'];
const DANGER_COLORS = ['', '#10B981', '#F59E0B', '#EF4444', '#7C3AED', '#FF0000'];

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const {
    nickname, level, xp, dailyWonderSeen, dailyMissions,
    setDailyWonderSeen, resetDaily, selectedCharacterId,
    resources, activeQuest, todayQuestId, startQuest, baseLevel,
  } = useStore();

  const wonder = getDailyWonder();

  useEffect(() => { resetDaily(); }, []);

  const todayQuest = dailyQuestPool.find(q => q.id === todayQuestId) || dailyQuestPool[0];
  const questChar = selectedCharacterId === 'random'
    ? getCharacterById(todayQuest.characterId)
    : getCharacterById(selectedCharacterId);

  const completedMissions = dailyMissions.filter(m => m.completed).length;
  const totalResources = Object.values(resources).reduce((a, b) => a + b, 0);

  return (
    <LinearGradient colors={['#0A0A1A', '#0F0F2E', '#1A0533']} style={styles.root}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* 헤더 — 탐험가 프로필 */}
        <View style={styles.header}>
          <View style={styles.profileBlock}>
            <Text style={styles.playerEmoji}>🧑‍🚀</Text>
            <View>
              <Text style={styles.greeting}>{nickname || '탐험가'}</Text>
              <Text style={styles.jobTitle}>{getLevelTitle(level)}</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statChip}>
              <Text style={styles.statEmoji}>🪨</Text>
              <Text style={styles.statValue}>{totalResources}</Text>
            </View>
            <View style={styles.statChip}>
              <Text style={styles.statEmoji}>🏗️</Text>
              <Text style={styles.statValue}>기지 Lv.{baseLevel}</Text>
            </View>
          </View>
        </View>

        {/* XP 바 */}
        <View style={styles.xpSection}>
          <XPBar level={level} xp={xp} xpToNextLevel={(level) * 300} />
        </View>

        {/* 오늘의 퀘스트 보드 */}
        <View style={styles.questBoard}>
          <View style={styles.questBoardHeader}>
            <Text style={styles.questBoardTitle}>📋 오늘의 퀘스트</Text>
            <View style={[styles.categoryBadge, { backgroundColor: colors.primary + '33' }]}>
              <Text style={styles.categoryText}>{todayQuest.emoji} {todayQuest.category === 'mining' ? '채굴' : todayQuest.category === 'exploration' ? '탐험' : todayQuest.category === 'crafting' ? '제작' : '연구'}</Text>
            </View>
          </View>

          <View style={styles.questCard}>
            <View style={styles.questCharRow}>
              <Text style={styles.questCharEmoji}>{questChar.emoji}</Text>
              <View style={styles.questCharInfo}>
                <Text style={[styles.questCharName, { color: questChar.color }]}>{questChar.name}</Text>
                <Text style={styles.questCharRole}>{questChar.role}</Text>
              </View>
            </View>
            <Text style={styles.questTitle}>{todayQuest.title}</Text>
            <Text style={styles.questStory}>{todayQuest.story}</Text>

            <View style={styles.questSteps}>
              {todayQuest.steps.map((step, i) => {
                const done = activeQuest && activeQuest.questId === todayQuestId
                  ? i < activeQuest.stepProgress
                  : false;
                return (
                  <View key={step.id} style={styles.questStep}>
                    <View style={[styles.stepDot, done && styles.stepDotDone]}>
                      {done && <Text style={styles.stepDotText}>✓</Text>}
                    </View>
                    <Text style={[styles.stepText, done && styles.stepTextDone]}>
                      {step.description}
                    </Text>
                  </View>
                );
              })}
            </View>

            {!activeQuest || activeQuest.questId !== todayQuestId ? (
              <TouchableOpacity
                style={styles.acceptBtn}
                onPress={() => startQuest(todayQuestId)}
              >
                <Text style={styles.acceptBtnText}>⚔️ 퀘스트 수락!</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.activeQuestBadge}>
                <Text style={styles.activeQuestText}>🗡️ 퀘스트 진행 중... {activeQuest.stepProgress}/{todayQuest.steps.length}</Text>
              </View>
            )}
          </View>

          <View style={styles.rewardPreview}>
            <Text style={styles.rewardLabel}>🎁 보상:</Text>
            <Text style={styles.rewardXP}>+{todayQuest.reward.xp} XP</Text>
            {todayQuest.reward.resources?.map(r => (
              <Text key={r.resourceId} style={styles.rewardResource}>자원 획득</Text>
            ))}
          </View>
        </View>

        {/* 오늘의 우주 발견 */}
        <Text style={styles.sectionTitle}>🔍 오늘의 우주 발견</Text>
        <DailyWonderCard wonder={wonder} onFlipped={setDailyWonderSeen} alreadySeen={dailyWonderSeen} />

        {/* 빠른 탐험 */}
        <Text style={styles.sectionTitle}>⚡ 빠른 탐험</Text>
        <View style={styles.quickGrid}>
          {[
            { label: '바이옴 탐험', emoji: '🗺️', screen: 'Explore', color: '#1A1A50' },
            { label: '제작소', emoji: '⚒️', screen: 'Crafting', color: '#1A3A1A' },
            { label: '우주 기지', emoji: '🏗️', screen: 'Base', color: '#3A1A00' },
            { label: 'AI 동반자', emoji: '🤖', screen: 'Coco', color: '#2D1B69' },
          ].map((item) => (
            <TouchableOpacity
              key={item.screen}
              style={styles.quickBtn}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.8}
            >
              <LinearGradient colors={[item.color, item.color + 'CC']} style={styles.quickBtnGrad}>
                <Text style={styles.quickBtnEmoji}>{item.emoji}</Text>
                <Text style={styles.quickBtnText}>{item.label}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* 일일 미션 진행 */}
        <View style={styles.missionBar}>
          <Text style={styles.missionBarLabel}>⚔️ 일일 미션</Text>
          <Text style={styles.missionBarCount}>{completedMissions}/3</Text>
          <View style={styles.missionDots}>
            {dailyMissions.map((m, i) => (
              <View key={i} style={[styles.missionDot, m.completed && styles.missionDotDone]} />
            ))}
          </View>
        </View>

      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40, gap: 18 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  profileBlock: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  playerEmoji: { fontSize: 36 },
  greeting: { fontSize: 20, color: colors.textPrimary, fontWeight: '800' },
  jobTitle: { fontSize: 12, color: colors.gold, fontWeight: '700', marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 8 },
  statChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  statEmoji: { fontSize: 14 },
  statValue: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  xpSection: {
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  // Quest Board
  questBoard: {
    backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 20, padding: 16,
    borderWidth: 1, borderColor: 'rgba(123,97,255,0.2)', gap: 12,
  },
  questBoardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  questBoardTitle: { fontSize: 16, color: colors.textPrimary, fontWeight: '800' },
  categoryBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  categoryText: { fontSize: 11, color: colors.primaryLight, fontWeight: '700' },
  questCard: {
    backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', gap: 10,
  },
  questCharRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  questCharEmoji: { fontSize: 28 },
  questCharInfo: {},
  questCharName: { fontSize: 14, fontWeight: '800' },
  questCharRole: { fontSize: 11, color: colors.textMuted },
  questTitle: { fontSize: 17, color: colors.textPrimary, fontWeight: '800' },
  questStory: { fontSize: 13, color: colors.textSecondary, lineHeight: 20, fontStyle: 'italic' },
  questSteps: { gap: 8 },
  questStep: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepDot: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: colors.textMuted,
    alignItems: 'center', justifyContent: 'center',
  },
  stepDotDone: { borderColor: colors.success, backgroundColor: colors.success },
  stepDotText: { fontSize: 10, color: '#fff', fontWeight: '900' },
  stepText: { fontSize: 13, color: colors.textSecondary, flex: 1 },
  stepTextDone: { color: colors.textMuted, textDecorationLine: 'line-through' },
  acceptBtn: {
    backgroundColor: colors.primary, borderRadius: 12,
    padding: 13, alignItems: 'center',
  },
  acceptBtnText: { fontSize: 15, color: '#fff', fontWeight: '800' },
  activeQuestBadge: {
    backgroundColor: 'rgba(16,185,129,0.1)', borderRadius: 12,
    padding: 11, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(16,185,129,0.3)',
  },
  activeQuestText: { fontSize: 14, color: colors.success, fontWeight: '700' },
  rewardPreview: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rewardLabel: { fontSize: 13, color: colors.textMuted },
  rewardXP: { fontSize: 13, color: colors.gold, fontWeight: '700' },
  rewardResource: { fontSize: 12, color: colors.secondary, fontWeight: '600' },
  sectionTitle: { fontSize: 16, color: colors.textPrimary, fontWeight: '800', marginBottom: -4 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickBtn: { width: '47%', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  quickBtnGrad: { padding: 16, alignItems: 'center', gap: 8 },
  quickBtnEmoji: { fontSize: 30 },
  quickBtnText: { fontSize: 12, color: colors.textPrimary, fontWeight: '700', textAlign: 'center' },
  missionBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14,
    padding: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  missionBarLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '600', flex: 1 },
  missionBarCount: { fontSize: 13, color: colors.primary, fontWeight: '800' },
  missionDots: { flexDirection: 'row', gap: 6 },
  missionDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.15)' },
  missionDotDone: { backgroundColor: colors.success },
});
