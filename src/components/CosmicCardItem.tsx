import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CosmicCard, getRarityColor, getRarityLabel } from '../data/cosmicCards';
import { colors } from '../theme/colors';

interface Props {
  card: CosmicCard;
  collected: boolean;
  onPress?: () => void;
}

const RARITY_GRADIENTS: Record<string, string[]> = {
  common: ['#2A2A4A', '#1A1A3A'],
  rare: ['#1D3A6A', '#1A2A5A'],
  epic: ['#3D1B69', '#2D1049'],
  legendary: ['#5A3A0A', '#3A2A00'],
};

export const CosmicCardItem: React.FC<Props> = ({ card, collected, onPress }) => {
  const rarityColor = getRarityColor(card.rarity);
  const gradient = RARITY_GRADIENTS[card.rarity];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.wrapper}>
      <LinearGradient
        colors={collected ? gradient as [string, string] : ['#111122', '#0A0A1A']}
        style={[
          styles.card,
          { borderColor: collected ? rarityColor : 'transparent' },
        ]}
      >
        {collected ? (
          <>
            <Text style={styles.emoji}>{card.emoji}</Text>
            <Text style={styles.name}>{card.name}</Text>
            <View style={[styles.rarityBadge, { backgroundColor: rarityColor + '33' }]}>
              <Text style={[styles.rarityText, { color: rarityColor }]}>
                {card.rarity.toUpperCase()}
              </Text>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.unknown}>?</Text>
            <Text style={styles.unknownText}>???</Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '30%',
    aspectRatio: 0.75,
    margin: '1.5%',
  },
  card: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  emoji: {
    fontSize: 30,
    marginBottom: 4,
  },
  name: {
    fontSize: 11,
    color: colors.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  rarityBadge: {
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  rarityText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  unknown: {
    fontSize: 28,
    color: colors.textMuted,
    fontWeight: '900',
    marginBottom: 4,
  },
  unknownText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
});
