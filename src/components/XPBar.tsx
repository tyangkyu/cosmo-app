import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

interface Props {
  level: number;
  xp: number;
  xpToNextLevel: number;
}

const LEVEL_TITLES = [
  '', '우주 새싹 🌱', '우주 새싹 🌱', '우주 새싹 🌱', '우주 새싹 🌱', '우주 새싹 🌱',
  '우주 탐험가 🚀', '우주 탐험가 🚀', '우주 탐험가 🚀', '우주 탐험가 🚀', '우주 탐험가 🚀',
  '별 관측사 🔭', '별 관측사 🔭', '별 관측사 🔭', '별 관측사 🔭', '별 관측사 🔭',
];

export const getLevelTitle = (level: number): string => {
  if (level <= 5) return '우주 새싹 🌱';
  if (level <= 10) return '우주 탐험가 🚀';
  if (level <= 20) return '별 관측사 🔭';
  if (level <= 35) return '은하 탐험단 🌌';
  if (level <= 50) return '우주 마스터 ⭐';
  return '전설의 천문학자 👑';
};

export const XPBar: React.FC<Props> = ({ level, xp, xpToNextLevel }) => {
  const currentLevelXP = xp % 300;
  const progress = currentLevelXP / 300;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.level}>Lv.{level}</Text>
        <Text style={styles.title}>{getLevelTitle(level)}</Text>
        <Text style={styles.xpText}>{currentLevelXP}/300 XP</Text>
      </View>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  level: {
    fontSize: 15,
    color: colors.gold,
    fontWeight: '800',
  },
  title: {
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
  },
  xpText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  barBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
});
