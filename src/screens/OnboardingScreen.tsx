import React, { useRef, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../store/useStore';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const STEPS = [
  {
    emoji: '🚀',
    title: '우주 탐험을 시작해보자!',
    desc: '매일 새로운 우주 이야기를 발견하고,\n별자리를 배우고, 퀴즈를 풀어봐!',
  },
  {
    emoji: '🃏',
    title: '우주 카드를 모아봐!',
    desc: '행성, 별, 은하, 블랙홀 카드를 수집해!\nLegendary 카드를 모두 모으면 전설의 천문학자가 될 수 있어!',
  },
  {
    emoji: '🤖',
    title: '코코에게 뭐든 물어봐!',
    desc: '"블랙홀이 뭐야?", "외계인은 있어?"\nAI 친구 코코가 쉽게 설명해줄게!',
  },
];

interface Props {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState('');
  const [enteringName, setEnteringName] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const { setNickname: storeSetNickname, collectCard } = useStore();

  const goNext = () => {
    if (step < STEPS.length - 1) {
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
        setStep((s) => s + 1);
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      });
    } else {
      setEnteringName(true);
    }
  };

  const handleStart = () => {
    const name = nickname.trim() || '탐험가';
    storeSetNickname(name);
    // 시작 카드 선물 (지구 카드)
    collectCard('card_earth');
    onComplete();
  };

  if (enteringName) {
    return (
      <LinearGradient colors={['#0A0A1A', '#0F0F2E', '#1A0533']} style={styles.root}>
        <View style={styles.nameContainer}>
          <Text style={styles.nameEmoji}>🧑‍🚀</Text>
          <Text style={styles.nameTitle}>탐험가의 이름은?</Text>
          <Text style={styles.nameDesc}>우주 탐험 증명서에 쓰일 이름이야!</Text>
          <TextInput
            style={styles.nameInput}
            value={nickname}
            onChangeText={setNickname}
            placeholder="닉네임 입력"
            placeholderTextColor={colors.textMuted}
            maxLength={12}
            autoFocus
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.startBtn} onPress={handleStart}>
            <LinearGradient colors={['#7B61FF', '#4C35D4']} style={styles.startBtnGrad}>
              <Text style={styles.startBtnText}>🚀 탐험 시작!</Text>
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.giftHint}>🎁 시작 선물: 지구 카드 (Rare)</Text>
        </View>
      </LinearGradient>
    );
  }

  const currentStep = STEPS[step];

  return (
    <LinearGradient colors={['#0A0A1A', '#0F0F2E', '#1A0533']} style={styles.root}>
      <View style={styles.container}>
        {/* 진행 점 */}
        <View style={styles.dots}>
          {STEPS.map((_, i) => (
            <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
          ))}
        </View>

        <Animated.View style={[styles.stepContent, { opacity: fadeAnim }]}>
          <Text style={styles.stepEmoji}>{currentStep.emoji}</Text>
          <Text style={styles.stepTitle}>{currentStep.title}</Text>
          <Text style={styles.stepDesc}>{currentStep.desc}</Text>
        </Animated.View>

        <TouchableOpacity style={styles.nextBtn} onPress={goNext}>
          <LinearGradient colors={['#7B61FF', '#4C35D4']} style={styles.nextBtnGrad}>
            <Text style={styles.nextBtnText}>
              {step < STEPS.length - 1 ? '다음 →' : '시작하기 →'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    gap: 32,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.primary,
  },
  stepContent: {
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 10,
  },
  stepEmoji: {
    fontSize: 80,
  },
  stepTitle: {
    fontSize: 26,
    color: colors.textPrimary,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  stepDesc: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  nextBtn: {
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
  },
  nextBtnGrad: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  nextBtnText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '800',
  },
  // 닉네임 입력
  nameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    gap: 20,
  },
  nameEmoji: {
    fontSize: 72,
  },
  nameTitle: {
    fontSize: 26,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  nameDesc: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  nameInput: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 16,
    padding: 16,
    fontSize: 18,
    color: colors.textPrimary,
    textAlign: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(123, 97, 255, 0.4)',
    fontWeight: '600',
  },
  startBtn: {
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 8,
  },
  startBtnGrad: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  startBtnText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '800',
  },
  giftHint: {
    fontSize: 14,
    color: colors.gold,
    fontWeight: '600',
  },
});
