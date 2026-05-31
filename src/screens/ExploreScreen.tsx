import React, { useState } from 'react';
import {
  Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { biomes, Biome } from '../data/biomes';
import { getResourcesByPlanet } from '../data/resources';
import { useStore } from '../store/useStore';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');
const CARD_W = (width - 40 - 12) / 2;

const DANGER_COLOR = ['', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
const DANGER_LABEL = ['', '안전', '주의', '위험', '고위험', '극한'];

interface Props { navigation: any; }

export const ExploreScreen: React.FC<Props> = ({ navigation }) => {
  const [selected, setSelected] = useState<Biome | null>(null);
  const { visitedPlanets, visitPlanet, collectCard, addResource, level } = useStore();

  const handleBiomePress = (biome: Biome) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (biome.requiredLevel > level) return;
    setSelected(biome);
    if (!visitedPlanets.includes(biome.planetId)) {
      visitPlanet(biome.planetId);
      collectCard('card_' + biome.planetId);
      // 자동으로 기본 자원 1개 지급
      const res = getResourcesByPlanet(biome.planetId);
      if (res.length > 0) addResource(res[0].id, 1);
    }
  };

  const handleMineResource = (biome: Biome) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const res = getResourcesByPlanet(biome.planetId);
    if (res.length > 0) {
      const pick = res[Math.floor(Math.random() * res.length)];
      addResource(pick.id, 1);
    }
  };

  const visitedCount = biomes.filter(b => visitedPlanets.includes(b.planetId)).length;

  return (
    <LinearGradient colors={['#0A0A1A', '#0F0F2E']} style={styles.root}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>🗺️ 바이옴 탐험</Text>
          <Text style={styles.subtitle}>행성을 탐험하고 자원을 채굴하라!</Text>
        </View>

        {/* 탐험 진행률 */}
        <View style={styles.progressCard}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>탐험 달성률</Text>
            <Text style={styles.progressCount}>{visitedCount}/{biomes.length} 바이옴</Text>
          </View>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${(visitedCount / biomes.length) * 100}%` }]} />
          </View>
        </View>

        {/* 바이옴 그리드 */}
        <View style={styles.grid}>
          {biomes.map((biome) => {
            const visited = visitedPlanets.includes(biome.planetId);
            const locked = biome.requiredLevel > level;
            return (
              <TouchableOpacity
                key={biome.id}
                style={[styles.biomeCard, { width: CARD_W }]}
                onPress={() => handleBiomePress(biome)}
                activeOpacity={locked ? 1 : 0.8}
              >
                <LinearGradient
                  colors={locked ? ['#0D0D1E', '#0A0A18'] : biome.gradient}
                  style={[styles.biomeGradient, visited && styles.biomeGradientVisited]}
                >
                  {locked ? (
                    <>
                      <Text style={styles.lockEmoji}>🔒</Text>
                      <Text style={styles.lockText}>Lv.{biome.requiredLevel} 필요</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.biomeEmoji}>{biome.emoji}</Text>
                      <Text style={styles.biomeName}>{biome.name}</Text>
                      <Text style={styles.biomeType}>{biome.biomeType}</Text>
                      <View style={styles.dangerRow}>
                        <View style={[styles.dangerBadge, { backgroundColor: DANGER_COLOR[biome.danger] + '33' }]}>
                          <Text style={[styles.dangerText, { color: DANGER_COLOR[biome.danger] }]}>
                            ⚠️ {DANGER_LABEL[biome.danger]}
                          </Text>
                        </View>
                      </View>
                      {visited && (
                        <View style={styles.visitedBadge}>
                          <Text style={styles.visitedText}>✓ 탐험완료</Text>
                        </View>
                      )}
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* 바이옴 상세 모달 */}
      <Modal visible={selected !== null} animationType="slide" transparent onRequestClose={() => setSelected(null)}>
        {selected && (
          <View style={styles.overlay}>
            <LinearGradient colors={['#1A1A40', '#0A0A20']} style={styles.modal}>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setSelected(null)}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>

              <Text style={styles.modalEmoji}>{selected.emoji}</Text>
              <Text style={styles.modalName}>{selected.name}</Text>
              <Text style={styles.modalType}>{selected.biomeType}</Text>

              {/* 위험도 */}
              <View style={[styles.dangerBig, { borderColor: DANGER_COLOR[selected.danger] + '55' }]}>
                <Text style={[styles.dangerBigText, { color: DANGER_COLOR[selected.danger] }]}>
                  ⚠️ 위험도: {DANGER_LABEL[selected.danger]} ({selected.danger}/5)
                </Text>
              </View>

              {/* 비교 설명 */}
              <View style={styles.compBox}>
                <Text style={styles.compLabel}>📏 비교</Text>
                <Text style={styles.compText}>{selected.comparison}</Text>
              </View>

              {/* 팩트 */}
              <Text style={styles.factsTitle}>💡 바이옴 특성</Text>
              {selected.facts.map((f, i) => (
                <View key={i} style={styles.factRow}>
                  <Text style={styles.factBullet}>›</Text>
                  <Text style={styles.factText}>{f}</Text>
                </View>
              ))}

              {/* 채굴 가능 자원 */}
              <Text style={styles.factsTitle}>⛏️ 채굴 가능 자원</Text>
              <View style={styles.resourceRow}>
                {getResourcesByPlanet(selected.planetId).map(r => (
                  <View key={r.id} style={styles.resourceChip}>
                    <Text style={styles.resourceEmoji}>{r.emoji}</Text>
                    <Text style={styles.resourceName}>{r.name}</Text>
                  </View>
                ))}
              </View>

              {/* 퀘스트 힌트 */}
              <View style={styles.questHintBox}>
                <Text style={styles.questHintLabel}>📋 퀘스트 힌트</Text>
                <Text style={styles.questHintText}>{selected.questHint}</Text>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.mineBtn} onPress={() => { handleMineResource(selected); setSelected(null); }}>
                  <Text style={styles.mineBtnText}>⛏️ 자원 채굴</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quizBtn} onPress={() => { setSelected(null); navigation.navigate('Quiz'); }}>
                  <Text style={styles.quizBtnText}>🧠 퀴즈 도전</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        )}
      </Modal>
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
  progressCard: {
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 14, gap: 10,
  },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  progressCount: { fontSize: 13, color: colors.primary, fontWeight: '700' },
  progressBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  biomeCard: { borderRadius: 16, overflow: 'hidden' },
  biomeGradient: { padding: 14, minHeight: 140, gap: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', borderRadius: 16 },
  biomeGradientVisited: { borderColor: colors.success + '44' },
  biomeEmoji: { fontSize: 32 },
  biomeName: { fontSize: 12, color: colors.textPrimary, fontWeight: '800', lineHeight: 16 },
  biomeType: { fontSize: 10, color: colors.textMuted },
  dangerRow: { marginTop: 4 },
  dangerBadge: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, alignSelf: 'flex-start' },
  dangerText: { fontSize: 9, fontWeight: '700' },
  visitedBadge: {
    backgroundColor: 'rgba(16,185,129,0.15)', borderRadius: 6,
    paddingHorizontal: 6, paddingVertical: 2, alignSelf: 'flex-start', marginTop: 2,
  },
  visitedText: { fontSize: 9, color: colors.success, fontWeight: '700' },
  lockEmoji: { fontSize: 28, opacity: 0.4 },
  lockText: { fontSize: 11, color: colors.textMuted, fontWeight: '600' },
  // Modal
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  modal: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 44, gap: 12 },
  closeBtn: {
    position: 'absolute', top: 16, right: 20, width: 32, height: 32,
    borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center', zIndex: 1,
  },
  closeBtnText: { color: colors.textSecondary, fontSize: 14, fontWeight: '600' },
  modalEmoji: { fontSize: 52, textAlign: 'center', marginTop: 8 },
  modalName: { fontSize: 22, color: colors.textPrimary, fontWeight: '800', textAlign: 'center' },
  modalType: { fontSize: 13, color: colors.textMuted, textAlign: 'center' },
  dangerBig: {
    borderRadius: 10, borderWidth: 1, padding: 8, alignSelf: 'center',
  },
  dangerBigText: { fontSize: 13, fontWeight: '700' },
  compBox: {
    backgroundColor: 'rgba(0,212,255,0.08)', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: 'rgba(0,212,255,0.2)', gap: 4,
  },
  compLabel: { fontSize: 11, color: colors.secondary, fontWeight: '700' },
  compText: { fontSize: 14, color: colors.textPrimary, fontWeight: '600' },
  factsTitle: { fontSize: 14, color: colors.textPrimary, fontWeight: '800' },
  factRow: { flexDirection: 'row', gap: 6 },
  factBullet: { fontSize: 16, color: colors.primary, fontWeight: '700' },
  factText: { fontSize: 13, color: colors.textSecondary, lineHeight: 20, flex: 1 },
  resourceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  resourceChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  resourceEmoji: { fontSize: 16 },
  resourceName: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  questHintBox: {
    backgroundColor: 'rgba(123,97,255,0.08)', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: 'rgba(123,97,255,0.2)', gap: 4,
  },
  questHintLabel: { fontSize: 11, color: colors.primaryLight, fontWeight: '700' },
  questHintText: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  mineBtn: { flex: 1, backgroundColor: '#78350F', borderRadius: 14, padding: 14, alignItems: 'center' },
  mineBtnText: { fontSize: 15, color: '#FCD34D', fontWeight: '800' },
  quizBtn: { flex: 1, backgroundColor: colors.primary, borderRadius: 14, padding: 14, alignItems: 'center' },
  quizBtnText: { fontSize: 15, color: '#fff', fontWeight: '700' },
});
