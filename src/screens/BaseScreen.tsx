import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useStore, getLevelTitle } from '../store/useStore';
import { achievements } from '../data/quests';
import { colors } from '../theme/colors';

const BASE_LEVELS = [
  { level: 1, name: '우주 텐트', emoji: '⛺', desc: '탐험을 막 시작한 작은 텐트', unlocks: '기본 탐험 가능' },
  { level: 2, name: '탐사 모듈', emoji: '🛖', desc: '작은 연구 장비를 갖춘 모듈', unlocks: '제작소 Mk.2 해금' },
  { level: 3, name: '우주 정거장', emoji: '🛸', desc: '태양계 탐험의 거점', unlocks: '토성/천왕성 탐험 해금' },
  { level: 4, name: '은하 연구소', emoji: '🏛️', desc: '고급 연구가 가능한 시설', unlocks: '블랙홀 탐지기 제작 해금' },
  { level: 5, name: '갤럭시 기지', emoji: '🌌', desc: '은하계를 향한 출발점', unlocks: '워프 드라이브 제작 해금' },
];

const BASE_UPGRADE_COST: Record<number, { resourceId: string; amount: number }[]> = {
  2: [{ resourceId: 'moon_rock', amount: 5 }, { resourceId: 'mars_ore', amount: 3 }],
  3: [{ resourceId: 'jupiter_gas', amount: 2 }, { resourceId: 'saturn_ring', amount: 2 }],
  4: [{ resourceId: 'neptune_wind', amount: 1 }, { resourceId: 'europa_water', amount: 1 }],
  5: [{ resourceId: 'solar_core', amount: 1 }, { resourceId: 'neptune_diamond_rain', amount: 1 }],
};

export const BaseScreen: React.FC = () => {
  const { baseLevel, resources, upgradeBase, badges, level, xp, craftedItems } = useStore();

  const currentBase = BASE_LEVELS[baseLevel - 1];
  const nextBase = BASE_LEVELS[baseLevel] || null;
  const upgradeCost = BASE_UPGRADE_COST[baseLevel + 1] || [];

  const canUpgrade = upgradeCost.every(c => (resources[c.resourceId] || 0) >= c.amount);

  const handleUpgrade = () => {
    if (!canUpgrade || !nextBase) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    upgradeBase();
  };

  const earnedAchievements = achievements.filter(a => badges.includes(a.id));
  const totalXPFromAchievements = earnedAchievements.reduce((s, a) => s + a.xp, 0);

  return (
    <LinearGradient colors={['#0A0A1A', '#001020']} style={styles.root}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>🏗️ 우주 기지</Text>
          <Text style={styles.subtitle}>기지를 업그레이드하고 은하계를 정복하라!</Text>
        </View>

        {/* 현재 기지 */}
        <LinearGradient colors={['#1A2A3A', '#0A1A2A']} style={styles.currentBase}>
          <Text style={styles.currentBaseEmoji}>{currentBase.emoji}</Text>
          <Text style={styles.currentBaseName}>{currentBase.name}</Text>
          <Text style={styles.currentBaseDesc}>{currentBase.desc}</Text>
          <View style={styles.baseLevelBadge}>
            <Text style={styles.baseLevelText}>기지 레벨 {baseLevel} / 5</Text>
          </View>
          {/* 기지 레벨 바 */}
          <View style={styles.baseLevelBar}>
            {BASE_LEVELS.map((_, i) => (
              <View key={i} style={[styles.baseLevelSegment, i < baseLevel && styles.baseLevelSegmentFilled]} />
            ))}
          </View>
        </LinearGradient>

        {/* 업그레이드 */}
        {nextBase ? (
          <View style={styles.upgradeCard}>
            <Text style={styles.upgradeTitle}>⬆️ 다음 단계: {nextBase.name} {nextBase.emoji}</Text>
            <Text style={styles.upgradeUnlocks}>해금: {nextBase.unlocks}</Text>

            <Text style={styles.upgradeCostTitle}>필요 자원:</Text>
            {upgradeCost.map((c) => {
              const have = resources[c.resourceId] || 0;
              const enough = have >= c.amount;
              // resource name from data
              const resNames: Record<string, string> = {
                moon_rock: '🪨 달 암석', mars_ore: '🔴 화성 철광석',
                jupiter_gas: '⚡ 목성 에너지 결정', saturn_ring: '🪐 토성 고리 파편',
                neptune_wind: '🌀 해왕성 폭풍 결정', europa_water: '💧 유로파 심해수',
                solar_core: '⭐ 태양 핵융합 결정', neptune_diamond_rain: '🌧️ 해왕성 다이아 빗물',
              };
              return (
                <View key={c.resourceId} style={[styles.costRow, enough && styles.costRowEnough]}>
                  <Text style={styles.costName}>{resNames[c.resourceId] || c.resourceId}</Text>
                  <Text style={[styles.costCount, { color: enough ? colors.success : colors.error }]}>
                    {have} / {c.amount}
                  </Text>
                </View>
              );
            })}

            <TouchableOpacity
              style={[styles.upgradeBtn, !canUpgrade && styles.upgradeBtnDisabled]}
              onPress={handleUpgrade}
              disabled={!canUpgrade}
            >
              <Text style={styles.upgradeBtnText}>
                {canUpgrade ? '🏗️ 업그레이드!' : '자원이 부족해...'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.maxLevelCard}>
            <Text style={styles.maxLevelEmoji}>🌌</Text>
            <Text style={styles.maxLevelText}>최고 단계 달성! 은하계를 향해!</Text>
          </View>
        )}

        {/* 탐험가 프로필 */}
        <View style={styles.profileCard}>
          <Text style={styles.profileTitle}>🧑‍🚀 탐험가 프로필</Text>
          <View style={styles.profileRow}>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatVal}>{level}</Text>
              <Text style={styles.profileStatLabel}>레벨</Text>
            </View>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatVal}>{xp}</Text>
              <Text style={styles.profileStatLabel}>총 XP</Text>
            </View>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatVal}>{craftedItems.length}</Text>
              <Text style={styles.profileStatLabel}>제작 완료</Text>
            </View>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatVal}>{earnedAchievements.length}</Text>
              <Text style={styles.profileStatLabel}>업적</Text>
            </View>
          </View>
          <Text style={styles.jobTitle}>{getLevelTitle(level)}</Text>
        </View>

        {/* 업적 */}
        <Text style={styles.achieveTitle}>🏆 업적 ({earnedAchievements.length}/{achievements.length})</Text>
        {achievements.map((ach) => {
          const earned = badges.includes(ach.id);
          return (
            <View key={ach.id} style={[styles.achieveCard, earned && styles.achieveCardEarned]}>
              <Text style={styles.achieveEmoji}>{earned ? ach.emoji : '🔒'}</Text>
              <View style={styles.achieveInfo}>
                <Text style={[styles.achieveName, !earned && { opacity: 0.4 }]}>{ach.title}</Text>
                <Text style={[styles.achieveDesc, !earned && { opacity: 0.3 }]}>{ach.desc}</Text>
              </View>
              <Text style={[styles.achieveXP, !earned && { opacity: 0.3 }]}>+{ach.xp} XP</Text>
            </View>
          );
        })}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40, gap: 18 },
  header: { gap: 4 },
  title: { fontSize: 26, color: colors.textPrimary, fontWeight: '800' },
  subtitle: { fontSize: 13, color: colors.textSecondary },
  currentBase: {
    borderRadius: 20, padding: 20, alignItems: 'center', gap: 8,
    borderWidth: 1, borderColor: 'rgba(0,212,255,0.3)',
  },
  currentBaseEmoji: { fontSize: 64 },
  currentBaseName: { fontSize: 22, color: colors.textPrimary, fontWeight: '800' },
  currentBaseDesc: { fontSize: 13, color: colors.textSecondary, textAlign: 'center' },
  baseLevelBadge: {
    backgroundColor: 'rgba(0,212,255,0.1)', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(0,212,255,0.3)',
  },
  baseLevelText: { fontSize: 13, color: colors.secondary, fontWeight: '700' },
  baseLevelBar: { flexDirection: 'row', gap: 6, marginTop: 4 },
  baseLevelSegment: {
    height: 8, flex: 1, borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  baseLevelSegmentFilled: { backgroundColor: colors.secondary },
  upgradeCard: {
    backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 18, padding: 16,
    borderWidth: 1, borderColor: 'rgba(255,215,0,0.2)', gap: 10,
  },
  upgradeTitle: { fontSize: 16, color: colors.gold, fontWeight: '800' },
  upgradeUnlocks: { fontSize: 13, color: colors.textSecondary },
  upgradeCostTitle: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },
  costRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: 'rgba(239,68,68,0.07)', borderRadius: 10,
    padding: 10, borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)',
  },
  costRowEnough: { backgroundColor: 'rgba(16,185,129,0.07)', borderColor: 'rgba(16,185,129,0.2)' },
  costName: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  costCount: { fontSize: 14, fontWeight: '800' },
  upgradeBtn: {
    backgroundColor: colors.gold, borderRadius: 14,
    padding: 14, alignItems: 'center',
  },
  upgradeBtnDisabled: { backgroundColor: 'rgba(255,255,255,0.1)' },
  upgradeBtnText: { fontSize: 16, color: '#000', fontWeight: '800' },
  maxLevelCard: {
    backgroundColor: 'rgba(123,97,255,0.1)', borderRadius: 18, padding: 20,
    alignItems: 'center', gap: 8, borderWidth: 1, borderColor: 'rgba(123,97,255,0.3)',
  },
  maxLevelEmoji: { fontSize: 48 },
  maxLevelText: { fontSize: 16, color: colors.primaryLight, fontWeight: '700', textAlign: 'center' },
  profileCard: {
    backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 18, padding: 16,
    gap: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
  },
  profileTitle: { fontSize: 15, color: colors.textPrimary, fontWeight: '800' },
  profileRow: { flexDirection: 'row', justifyContent: 'space-around' },
  profileStat: { alignItems: 'center', gap: 4 },
  profileStatVal: { fontSize: 22, color: colors.gold, fontWeight: '900' },
  profileStatLabel: { fontSize: 11, color: colors.textMuted },
  jobTitle: { fontSize: 14, color: colors.primaryLight, fontWeight: '700', textAlign: 'center' },
  achieveTitle: { fontSize: 16, color: colors.textPrimary, fontWeight: '800' },
  achieveCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  achieveCardEarned: {
    borderColor: 'rgba(251,191,36,0.3)', backgroundColor: 'rgba(251,191,36,0.05)',
  },
  achieveEmoji: { fontSize: 28 },
  achieveInfo: { flex: 1, gap: 3 },
  achieveName: { fontSize: 14, color: colors.textPrimary, fontWeight: '700' },
  achieveDesc: { fontSize: 11, color: colors.textMuted },
  achieveXP: { fontSize: 13, color: colors.gold, fontWeight: '700' },
});
