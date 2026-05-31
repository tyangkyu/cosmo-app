import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { getRandomQuizzes, Quiz } from '../data/quizzes';
import { useStore } from '../store/useStore';
import { colors } from '../theme/colors';

type AnswerState = 'idle' | 'correct' | 'wrong';

export const QuizScreen: React.FC = () => {
  const { completeQuiz, addXP } = useStore();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [shakeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    setQuizzes(getRandomQuizzes(5));
  }, []);

  const currentQuiz = quizzes[currentIndex];

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (answerState !== 'idle') return;
      setSelectedOption(optionIndex);

      const isCorrect = optionIndex === currentQuiz.answerIndex;

      if (isCorrect) {
        setAnswerState('correct');
        setScore((s) => s + 1);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Animated.spring(scaleAnim, {
          toValue: 1.05,
          friction: 4,
          useNativeDriver: Platform.OS !== 'web',
        }).start(() =>
          Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: Platform.OS !== 'web' }).start(),
        );
      } else {
        setAnswerState('wrong');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Animated.sequence([
          Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: Platform.OS !== 'web' }),
          Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: Platform.OS !== 'web' }),
          Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: Platform.OS !== 'web' }),
          Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: Platform.OS !== 'web' }),
        ]).start();
      }
    },
    [answerState, currentQuiz, scaleAnim, shakeAnim],
  );

  const handleNext = useCallback(() => {
    completeQuiz(currentQuiz.id);
    if (currentIndex + 1 >= quizzes.length) {
      setFinished(true);
      addXP(score * 30);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setAnswerState('idle');
    }
  }, [currentIndex, quizzes.length, currentQuiz, completeQuiz, addXP, score]);

  const handleRestart = () => {
    setQuizzes(getRandomQuizzes(5));
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswerState('idle');
    setScore(0);
    setFinished(false);
  };

  if (quizzes.length === 0) return null;

  if (finished) {
    return (
      <LinearGradient colors={['#0A0A1A', '#0F0F2E']} style={styles.root}>
        <View style={styles.finishContainer}>
          <Text style={styles.finishEmoji}>
            {score >= 4 ? '🏆' : score >= 3 ? '⭐' : '💪'}
          </Text>
          <Text style={styles.finishTitle}>퀴즈 완료!</Text>
          <Text style={styles.finishScore}>
            {score}/{quizzes.length} 정답
          </Text>
          <Text style={styles.finishMessage}>
            {score === quizzes.length
              ? '완벽해! 우주 박사 탄생! 🎉'
              : score >= 3
              ? '잘했어! 계속 탐험하면 더 잘할 수 있어!'
              : '괜찮아! 탐험을 더 하면 알게 될 거야!'}
          </Text>
          <View style={styles.xpEarned}>
            <Text style={styles.xpEarnedText}>+{score * 30} XP 획득!</Text>
          </View>
          <TouchableOpacity style={styles.restartBtn} onPress={handleRestart}>
            <Text style={styles.restartBtnText}>🔄 다시 도전!</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  const getOptionStyle = (i: number) => {
    if (selectedOption === null) return styles.optionIdle;
    if (i === currentQuiz.answerIndex) return styles.optionCorrect;
    if (i === selectedOption) return styles.optionWrong;
    return styles.optionDimmed;
  };

  const getOptionTextColor = (i: number) => {
    if (selectedOption === null) return colors.textPrimary;
    if (i === currentQuiz.answerIndex) return '#fff';
    if (i === selectedOption) return '#fff';
    return colors.textMuted;
  };

  return (
    <LinearGradient colors={['#0A0A1A', '#0F0F2E']} style={styles.root}>
      <View style={styles.content}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>🧠 우주 퀴즈</Text>
          <View style={styles.progressDots}>
            {quizzes.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === currentIndex && styles.dotActive,
                  i < currentIndex && styles.dotDone,
                ]}
              />
            ))}
          </View>
          <Text style={styles.progressText}>
            {currentIndex + 1} / {quizzes.length}
          </Text>
        </View>

        {/* 문제 카드 */}
        <Animated.View
          style={[
            styles.questionCard,
            { transform: [{ translateX: shakeAnim }, { scale: scaleAnim }] },
          ]}
        >
          <LinearGradient colors={['#1A1A50', '#2D1B69']} style={styles.questionGradient}>
            <Text style={styles.questionEmoji}>{currentQuiz.emoji}</Text>
            <Text style={styles.questionText}>{currentQuiz.question}</Text>
          </LinearGradient>
        </Animated.View>

        {/* 선택지 */}
        <View style={styles.options}>
          {currentQuiz.options.map((option, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.option, getOptionStyle(i)]}
              onPress={() => handleSelect(i)}
              activeOpacity={0.8}
              disabled={answerState !== 'idle'}
            >
              <View style={styles.optionLetter}>
                <Text style={styles.optionLetterText}>
                  {['A', 'B', 'C', 'D'][i]}
                </Text>
              </View>
              <Text style={[styles.optionText, { color: getOptionTextColor(i) }]}>
                {option}
              </Text>
              {answerState !== 'idle' && i === currentQuiz.answerIndex && (
                <Text style={styles.checkMark}>✓</Text>
              )}
              {answerState !== 'idle' && i === selectedOption && i !== currentQuiz.answerIndex && (
                <Text style={styles.crossMark}>✕</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* 해설 & 다음 */}
        {answerState !== 'idle' && (
          <View style={[
            styles.explanation,
            answerState === 'correct' ? styles.explanationCorrect : styles.explanationWrong,
          ]}>
            <Text style={styles.explanationTitle}>
              {answerState === 'correct' ? '🎉 정답이야!' : '😅 아쉽지만!'}
            </Text>
            <Text style={styles.explanationText}>{currentQuiz.explanation}</Text>
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextBtnText}>
                {currentIndex + 1 >= quizzes.length ? '결과 보기 →' : '다음 문제 →'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    gap: 20,
  },
  header: {
    gap: 10,
  },
  title: {
    fontSize: 26,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  progressDots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 20,
  },
  dotDone: {
    backgroundColor: colors.success,
  },
  progressText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  questionCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  questionGradient: {
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  questionEmoji: {
    fontSize: 44,
  },
  questionText: {
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 26,
  },
  options: {
    gap: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    gap: 12,
  },
  optionIdle: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  optionCorrect: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: colors.success,
  },
  optionWrong: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: colors.error,
  },
  optionDimmed: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderColor: 'rgba(255,255,255,0.04)',
  },
  optionLetter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLetterText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    lineHeight: 22,
  },
  checkMark: {
    fontSize: 18,
    color: colors.success,
    fontWeight: '900',
  },
  crossMark: {
    fontSize: 18,
    color: colors.error,
    fontWeight: '900',
  },
  explanation: {
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
  },
  explanationCorrect: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  explanationWrong: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  explanationTitle: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  explanationText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  nextBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  // 완료 화면
  finishContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    gap: 16,
  },
  finishEmoji: {
    fontSize: 72,
  },
  finishTitle: {
    fontSize: 30,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  finishScore: {
    fontSize: 48,
    color: colors.gold,
    fontWeight: '900',
  },
  finishMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  xpEarned: {
    backgroundColor: 'rgba(123, 97, 255, 0.15)',
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(123, 97, 255, 0.3)',
  },
  xpEarnedText: {
    fontSize: 18,
    color: colors.primaryLight,
    fontWeight: '800',
  },
  restartBtn: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 16,
    marginTop: 8,
  },
  restartBtnText: {
    fontSize: 17,
    color: '#fff',
    fontWeight: '700',
  },
});
