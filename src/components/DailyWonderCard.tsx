import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { DailyWonder } from '../data/dailyWonders';
import { colors } from '../theme/colors';

interface Props {
  wonder: DailyWonder;
  onFlipped?: () => void;
  alreadySeen?: boolean;
}

export const DailyWonderCard: React.FC<Props> = ({ wonder, onFlipped, alreadySeen }) => {
  const [flipped, setFlipped] = useState(alreadySeen ?? false);
  const flipAnim = useRef(new Animated.Value(alreadySeen ? 1 : 0)).current;

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const handleFlip = useCallback(() => {
    if (flipped) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.spring(flipAnim, {
      toValue: 1,
      friction: 8,
      tension: 10,
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => {
      setFlipped(true);
      onFlipped?.();
    });
  }, [flipped, flipAnim, onFlipped]);

  return (
    <TouchableOpacity onPress={handleFlip} activeOpacity={0.95} style={styles.container}>
      {/* Front */}
      <Animated.View
        style={[
          styles.card,
          styles.front,
          { transform: [{ rotateY: frontInterpolate }] },
        ]}
      >
        <LinearGradient colors={['#1A1A50', '#2D1B69']} style={styles.gradient}>
          <Text style={styles.emoji}>{wonder.emoji}</Text>
          <Text style={styles.frontTitle}>오늘의 우주 놀라움</Text>
          <Text style={styles.frontHint}>{wonder.frontHint}</Text>
          <View style={styles.tapBadge}>
            <Text style={styles.tapText}>👆 탭해서 확인!</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Back */}
      <Animated.View
        style={[
          styles.card,
          styles.back,
          { transform: [{ rotateY: backInterpolate }] },
        ]}
      >
        <LinearGradient colors={['#2D1B69', '#1A3A5F']} style={styles.gradient}>
          <Text style={styles.emoji}>{wonder.emoji}</Text>
          <Text style={styles.backTitle}>{wonder.title}</Text>
          <Text style={styles.backDesc}>{wonder.description}</Text>
          <View style={styles.funFactBox}>
            <Text style={styles.funFactLabel}>💡 알고 있었어?</Text>
            <Text style={styles.funFactText}>{wonder.funFact}</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 220,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backfaceVisibility: 'hidden',
    overflow: 'hidden',
    ...Platform.select({
      native: {
        shadowColor: '#7B61FF',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
      },
      web: { boxShadow: '0 8px 16px rgba(123, 97, 255, 0.4)' },
    }),
    elevation: 10,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  front: {},
  back: {},
  emoji: {
    fontSize: 44,
    marginBottom: 8,
  },
  frontTitle: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  frontHint: {
    fontSize: 20,
    color: colors.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  tapBadge: {
    backgroundColor: 'rgba(123, 97, 255, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(123, 97, 255, 0.5)',
  },
  tapText: {
    color: colors.primaryLight,
    fontSize: 14,
    fontWeight: '600',
  },
  backTitle: {
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 26,
  },
  backDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 14,
  },
  funFactBox: {
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
    width: '100%',
  },
  funFactLabel: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  funFactText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
