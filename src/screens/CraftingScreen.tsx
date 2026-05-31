import React, { useState } from 'react';
import {
  Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { craftingRecipes, CraftingRecipe } from '../data/craftingRecipes';
import { getResourceById } from '../data/resources';
import { useStore } from '../store/useStore';
import { colors } from '../theme/colors';

const CATEGORY_ICONS: Record<string, string> = {
  spacecraft: '🚀', observatory: '🔭', lab: '🔬',
  base: '🏗️', telescope: '🔭', drone: '🛸', equipment: '⛏️',
};

export const CraftingScreen: React.FC = () => {
  const { resources, craftedItems, craftItem, addXP, baseLevel } = useStore();
  const [selected, setSelected] = useState<CraftingRecipe | null>(null);
  const [craftResult, setCraftResult] = useState<'success' | 'fail' | null>(null);

  const availableRecipes = craftingRecipes.filter(r => r.baseLevelRequired <= baseLevel);
  const canCraft = (recipe: CraftingRecipe) =>
    recipe.ingredients.every(ing => (resources[ing.resourceId] || 0) >= ing.amount);

  const handleCraft = (recipe: CraftingRecipe) => {
    const cost: Record<string, number> = {};
    recipe.ingredients.forEach(ing => { cost[ing.resourceId] = ing.amount; });
    const success = craftItem(recipe.id, cost);
    if (success) {
      addXP(recipe.xpReward);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCraftResult('success');
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setCraftResult('fail');
    }
    setTimeout(() => { setCraftResult(null); setSelected(null); }, 2000);
  };

  const totalResources = Object.values(resources).reduce((a, b) => a + b, 0);

  return (
    <LinearGradient colors={['#0A0A1A', '#1A0A00']} style={styles.root}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>⚒️ 제작소</Text>
          <Text style={styles.subtitle}>자원으로 우주 장비를 만들어라!</Text>
        </View>

        {/* 인벤토리 */}
        <View style={styles.inventoryCard}>
          <Text style={styles.inventoryTitle}>🎒 인벤토리 ({totalResources}개)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.inventoryRow}>
            {Object.entries(resources).filter(([, amt]) => amt > 0).map(([rid, amt]) => {
              const res = getResourceById(rid);
              if (!res) return null;
              return (
                <View key={rid} style={styles.invSlot}>
                  <Text style={styles.invEmoji}>{res.emoji}</Text>
                  <Text style={styles.invCount}>x{amt}</Text>
                  <Text style={styles.invName}>{res.name}</Text>
                </View>
              );
            })}
            {totalResources === 0 && (
              <Text style={styles.emptyInv}>바이옴을 탐험해서 자원을 모아봐! ⛏️</Text>
            )}
          </ScrollView>
        </View>

        {/* 잠긴 레시피 안내 */}
        {baseLevel < 5 && (
          <View style={styles.lockedHint}>
            <Text style={styles.lockedHintText}>
              🔒 기지 레벨을 올리면 더 많은 레시피가 해금돼!
              (현재 기지 Lv.{baseLevel})
            </Text>
          </View>
        )}

        {/* 제작 레시피 목록 */}
        {availableRecipes.map((recipe) => {
          const crafted = craftedItems.includes(recipe.id);
          const craftable = canCraft(recipe);
          return (
            <TouchableOpacity
              key={recipe.id}
              style={[styles.recipeCard, crafted && styles.recipeCardCrafted]}
              onPress={() => !crafted && setSelected(recipe)}
              activeOpacity={crafted ? 1 : 0.85}
            >
              <View style={styles.recipeHeader}>
                <Text style={styles.recipeEmoji}>{recipe.emoji}</Text>
                <View style={styles.recipeInfo}>
                  <Text style={styles.recipeName}>{recipe.name}</Text>
                  <Text style={styles.recipeCategory}>
                    {CATEGORY_ICONS[recipe.category]} {recipe.categoryLabel}
                  </Text>
                </View>
                <View style={styles.recipeRight}>
                  {crafted ? (
                    <View style={styles.craftedBadge}><Text style={styles.craftedText}>✓ 완성</Text></View>
                  ) : craftable ? (
                    <View style={styles.readyBadge}><Text style={styles.readyText}>⚒️ 제작 가능</Text></View>
                  ) : (
                    <View style={styles.needBadge}><Text style={styles.needText}>자원 부족</Text></View>
                  )}
                  <Text style={styles.recipeXP}>+{recipe.xpReward} XP</Text>
                </View>
              </View>

              {/* 재료 */}
              <View style={styles.ingredients}>
                {recipe.ingredients.map((ing) => {
                  const res = getResourceById(ing.resourceId);
                  const have = resources[ing.resourceId] || 0;
                  const enough = have >= ing.amount;
                  return (
                    <View key={ing.resourceId} style={[styles.ingChip, !enough && styles.ingChipLack]}>
                      <Text style={styles.ingEmoji}>{res?.emoji || '❓'}</Text>
                      <Text style={[styles.ingText, !enough && styles.ingTextLack]}>
                        {res?.name} {have}/{ing.amount}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 제작 확인 모달 */}
      <Modal visible={selected !== null} animationType="fade" transparent onRequestClose={() => setSelected(null)}>
        {selected && (
          <View style={styles.overlay}>
            <LinearGradient colors={['#1A1A40', '#0A0A20']} style={styles.craftModal}>
              {craftResult === 'success' ? (
                <>
                  <Text style={styles.resultEmoji}>🎉</Text>
                  <Text style={styles.resultTitle}>제작 성공!</Text>
                  <Text style={styles.resultDesc}>{selected.name} 완성! +{selected.xpReward} XP</Text>
                  <Text style={styles.resultFact}>💡 {selected.scienceFact}</Text>
                </>
              ) : craftResult === 'fail' ? (
                <>
                  <Text style={styles.resultEmoji}>😅</Text>
                  <Text style={styles.resultTitle}>재료가 부족해!</Text>
                  <Text style={styles.resultDesc}>바이옴을 더 탐험해서 자원을 모아봐!</Text>
                </>
              ) : (
                <>
                  <Text style={styles.craftModalEmoji}>{selected.emoji}</Text>
                  <Text style={styles.craftModalName}>{selected.name}</Text>
                  <Text style={styles.craftModalDesc}>{selected.description}</Text>
                  <View style={styles.craftIngList}>
                    {selected.ingredients.map(ing => {
                      const res = getResourceById(ing.resourceId);
                      const have = resources[ing.resourceId] || 0;
                      return (
                        <View key={ing.resourceId} style={styles.craftIngRow}>
                          <Text style={styles.craftIngEmoji}>{res?.emoji}</Text>
                          <Text style={styles.craftIngName}>{res?.name}</Text>
                          <Text style={[styles.craftIngCount, have < ing.amount && { color: colors.error }]}>
                            {have}/{ing.amount}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                  <View style={styles.craftBtns}>
                    <TouchableOpacity style={styles.craftConfirmBtn} onPress={() => handleCraft(selected)}>
                      <Text style={styles.craftConfirmText}>⚒️ 제작하기!</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.craftCancelBtn} onPress={() => setSelected(null)}>
                      <Text style={styles.craftCancelText}>취소</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
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
  content: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40, gap: 16 },
  header: { gap: 4 },
  title: { fontSize: 26, color: colors.textPrimary, fontWeight: '800' },
  subtitle: { fontSize: 13, color: colors.textSecondary },
  inventoryCard: {
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: 'rgba(255,215,0,0.2)', gap: 10,
  },
  inventoryTitle: { fontSize: 14, color: colors.gold, fontWeight: '700' },
  inventoryRow: { gap: 10, paddingVertical: 4 },
  invSlot: {
    alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10, padding: 8, minWidth: 70,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  invEmoji: { fontSize: 24 },
  invCount: { fontSize: 13, color: colors.gold, fontWeight: '800', marginTop: 2 },
  invName: { fontSize: 9, color: colors.textMuted, textAlign: 'center', marginTop: 2 },
  emptyInv: { fontSize: 13, color: colors.textMuted, alignSelf: 'center', paddingVertical: 8 },
  lockedHint: {
    backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
  },
  lockedHintText: { fontSize: 13, color: colors.textMuted, textAlign: 'center' },
  recipeCard: {
    backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', gap: 10,
  },
  recipeCardCrafted: { borderColor: 'rgba(16,185,129,0.3)', backgroundColor: 'rgba(16,185,129,0.05)' },
  recipeHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  recipeEmoji: { fontSize: 36 },
  recipeInfo: { flex: 1, gap: 3 },
  recipeName: { fontSize: 15, color: colors.textPrimary, fontWeight: '800' },
  recipeCategory: { fontSize: 11, color: colors.textMuted },
  recipeRight: { alignItems: 'flex-end', gap: 4 },
  craftedBadge: {
    backgroundColor: 'rgba(16,185,129,0.15)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
  },
  craftedText: { fontSize: 11, color: colors.success, fontWeight: '700' },
  readyBadge: {
    backgroundColor: 'rgba(251,191,36,0.15)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
  },
  readyText: { fontSize: 11, color: colors.gold, fontWeight: '700' },
  needBadge: {
    backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
  },
  needText: { fontSize: 11, color: colors.error, fontWeight: '700' },
  recipeXP: { fontSize: 11, color: colors.primary, fontWeight: '700' },
  ingredients: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  ingChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
  },
  ingChipLack: { backgroundColor: 'rgba(239,68,68,0.1)' },
  ingEmoji: { fontSize: 14 },
  ingText: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },
  ingTextLack: { color: colors.error },
  // Modal
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', alignItems: 'center', justifyContent: 'center', padding: 30 },
  craftModal: { borderRadius: 24, padding: 28, width: '100%', gap: 14, alignItems: 'center' },
  resultEmoji: { fontSize: 60 },
  resultTitle: { fontSize: 22, color: colors.textPrimary, fontWeight: '800' },
  resultDesc: { fontSize: 15, color: colors.textSecondary, textAlign: 'center' },
  resultFact: { fontSize: 13, color: colors.secondary, textAlign: 'center', lineHeight: 20 },
  craftModalEmoji: { fontSize: 56 },
  craftModalName: { fontSize: 20, color: colors.textPrimary, fontWeight: '800' },
  craftModalDesc: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  craftIngList: { width: '100%', gap: 8 },
  craftIngRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: 10,
  },
  craftIngEmoji: { fontSize: 22 },
  craftIngName: { flex: 1, fontSize: 14, color: colors.textPrimary, fontWeight: '600' },
  craftIngCount: { fontSize: 14, color: colors.success, fontWeight: '800' },
  craftBtns: { flexDirection: 'row', gap: 10, width: '100%' },
  craftConfirmBtn: { flex: 1, backgroundColor: '#78350F', borderRadius: 14, padding: 14, alignItems: 'center' },
  craftConfirmText: { fontSize: 16, color: '#FCD34D', fontWeight: '800' },
  craftCancelBtn: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 14,
    padding: 14, alignItems: 'center',
  },
  craftCancelText: { fontSize: 16, color: colors.textSecondary, fontWeight: '600' },
});
