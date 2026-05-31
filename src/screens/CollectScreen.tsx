import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { cosmicCards, CosmicCard, getRarityColor, getRarityLabel } from '../data/cosmicCards';
import { CosmicCardItem } from '../components/CosmicCardItem';
import { useStore } from '../store/useStore';
import { colors } from '../theme/colors';

type CategoryFilter = 'all' | 'planet' | 'star' | 'galaxy' | 'blackhole' | 'spacecraft';

const CATEGORY_LABELS: Record<CategoryFilter, string> = {
  all: '전체',
  planet: '🪐 행성',
  star: '⭐ 별',
  galaxy: '🌌 은하',
  blackhole: '🌑 블랙홀',
  spacecraft: '🚀 우주선',
};

export const CollectScreen: React.FC = () => {
  const { collectedCards } = useStore();
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [selectedCard, setSelectedCard] = useState<CosmicCard | null>(null);

  const filtered = cosmicCards.filter(
    (c) => filter === 'all' || c.category === filter,
  );

  const collectedCount = collectedCards.length;
  const totalCount = cosmicCards.length;

  return (
    <LinearGradient colors={['#0A0A1A', '#0F0F2E']} style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>🃏 우주 카드 수집</Text>
          <Text style={styles.subtitle}>
            {collectedCount}/{totalCount}장 수집
          </Text>
        </View>

        {/* 진행률 */}
        <View style={styles.progressCard}>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${(collectedCount / totalCount) * 100}%` },
              ]}
            />
          </View>
          {/* 희귀도별 수집 현황 */}
          <View style={styles.rarityStats}>
            {(['common', 'rare', 'epic', 'legendary'] as const).map((rarity) => {
              const total = cosmicCards.filter((c) => c.rarity === rarity).length;
              const collected = collectedCards.filter((id) =>
                cosmicCards.find((c) => c.id === id && c.rarity === rarity),
              ).length;
              return (
                <View key={rarity} style={styles.rarityStat}>
                  <Text style={[styles.rarityStatLabel, { color: getRarityColor(rarity) }]}>
                    {rarity === 'legendary' ? 'LEG' : rarity.toUpperCase().slice(0, 4)}
                  </Text>
                  <Text style={styles.rarityStatCount}>
                    {collected}/{total}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* 카테고리 필터 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {(Object.keys(CATEGORY_LABELS) as CategoryFilter[]).map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.filterBtn, filter === cat && styles.filterBtnActive]}
              onPress={() => setFilter(cat)}
            >
              <Text
                style={[styles.filterText, filter === cat && styles.filterTextActive]}
              >
                {CATEGORY_LABELS[cat]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 카드 그리드 */}
        <View style={styles.cardGrid}>
          {filtered.map((card) => (
            <CosmicCardItem
              key={card.id}
              card={card}
              collected={collectedCards.includes(card.id)}
              onPress={() => {
                if (collectedCards.includes(card.id)) {
                  setSelectedCard(card);
                }
              }}
            />
          ))}
        </View>
      </ScrollView>

      {/* 카드 상세 모달 */}
      <Modal
        visible={selectedCard !== null}
        animationType="fade"
        transparent
        onRequestClose={() => setSelectedCard(null)}
      >
        {selectedCard && (
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setSelectedCard(null)}
          >
            <TouchableOpacity activeOpacity={1}>
              <LinearGradient
                colors={['#1A1A40', '#0F0F28']}
                style={styles.modalCard}
              >
                <View style={[
                  styles.modalRarityStripe,
                  { backgroundColor: getRarityColor(selectedCard.rarity) },
                ]} />
                <Text style={styles.modalEmoji}>{selectedCard.emoji}</Text>
                <Text style={styles.modalCardName}>{selectedCard.name}</Text>
                <View style={[
                  styles.modalRarityBadge,
                  { backgroundColor: getRarityColor(selectedCard.rarity) + '22' },
                ]}>
                  <Text style={[
                    styles.modalRarityText,
                    { color: getRarityColor(selectedCard.rarity) },
                  ]}>
                    {getRarityLabel(selectedCard.rarity)}
                  </Text>
                </View>
                <Text style={styles.modalDesc}>{selectedCard.description}</Text>
                <View style={styles.funFactBox}>
                  <Text style={styles.funFactLabel}>💡 알고 있었어?</Text>
                  <Text style={styles.funFactText}>{selectedCard.funFact}</Text>
                </View>
                <TouchableOpacity
                  style={styles.closeCardBtn}
                  onPress={() => setSelectedCard(null)}
                >
                  <Text style={styles.closeCardBtnText}>닫기</Text>
                </TouchableOpacity>
              </LinearGradient>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 40,
    gap: 20,
  },
  header: {
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 26,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  progressCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.gold,
    borderRadius: 4,
  },
  rarityStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  rarityStat: {
    alignItems: 'center',
    gap: 2,
  },
  rarityStatLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  rarityStatCount: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  filterRow: {
    gap: 8,
    paddingHorizontal: 4,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  filterBtnActive: {
    backgroundColor: 'rgba(123, 97, 255, 0.2)',
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
  },
  filterTextActive: {
    color: colors.primaryLight,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  modalCard: {
    borderRadius: 24,
    padding: 28,
    width: 300,
    alignItems: 'center',
    gap: 12,
    overflow: 'hidden',
  },
  modalRarityStripe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  modalEmoji: {
    fontSize: 56,
    marginTop: 8,
  },
  modalCardName: {
    fontSize: 24,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  modalRarityBadge: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  modalRarityText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  modalDesc: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  funFactBox: {
    backgroundColor: 'rgba(0, 212, 255, 0.08)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
    width: '100%',
    gap: 4,
  },
  funFactLabel: {
    fontSize: 11,
    color: colors.secondary,
    fontWeight: '600',
  },
  funFactText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  closeCardBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginTop: 4,
  },
  closeCardBtnText: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
