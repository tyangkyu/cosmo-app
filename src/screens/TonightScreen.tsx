import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { colors } from '../theme/colors';
import { useStore } from '../store/useStore';

interface SkyObject {
  name: string;
  emoji: string;
  description: string;
  bestTime: string;
  visible: boolean;
}

const getSeasonObjects = (): SkyObject[] => {
  const month = new Date().getMonth() + 1;
  const isWinter = month >= 12 || month <= 2;
  const isSpring = month >= 3 && month <= 5;
  const isSummer = month >= 6 && month <= 8;

  const base: SkyObject[] = [
    {
      name: '달',
      emoji: '🌙',
      description: '오늘 밤 달이 보여! 달의 분화구를 찾아봐',
      bestTime: '밤 8시 이후',
      visible: true,
    },
    {
      name: '목성',
      emoji: '🪐',
      description: '남쪽 하늘에서 밝게 빛나는 목성을 찾아봐!',
      bestTime: '밤 9시~새벽 2시',
      visible: true,
    },
  ];

  if (isWinter) {
    base.push(
      {
        name: '오리온자리',
        emoji: '⭐',
        description: '겨울 밤하늘의 왕! 3개의 별이 일렬로 늘어선 오리온의 허리띠를 찾아봐',
        bestTime: '밤 8시~새벽 1시',
        visible: true,
      },
      {
        name: '베텔게우스',
        emoji: '🔴',
        description: '오리온자리의 빨간 별! 폭발 직전의 거대한 별이야',
        bestTime: '밤 10시 전후',
        visible: true,
      },
    );
  } else if (isSpring) {
    base.push({
      name: '사자자리',
      emoji: '🦁',
      description: '봄의 대표 별자리! 낫 모양이 사자의 머리야',
      bestTime: '밤 9시~새벽 1시',
      visible: true,
    });
  } else if (isSummer) {
    base.push(
      {
        name: '여름의 대삼각형',
        emoji: '🔺',
        description: '백조자리, 독수리자리, 거문고자리의 가장 밝은 별 3개가 만드는 삼각형!',
        bestTime: '밤 9시~새벽 2시',
        visible: true,
      },
      {
        name: '전갈자리',
        emoji: '🦂',
        description: '남쪽 하늘에서 S자 모양을 찾아봐! 여름 밤하늘의 보석이야',
        bestTime: '밤 9시~새벽 12시',
        visible: true,
      },
    );
  } else {
    base.push({
      name: '페가수스자리',
      emoji: '🐎',
      description: '가을 밤하늘의 커다란 사각형! 페가수스의 몸통이야',
      bestTime: '밤 9시~새벽 1시',
      visible: true,
    });
  }

  return base;
};

export const TonightScreen: React.FC = () => {
  const [location, setLocation] = useState<string | null>(null);
  const [skyObjects] = useState<SkyObject[]>(getSeasonObjects());
  const [observed, setObserved] = useState<string[]>([]);
  const { addXP, earnBadge } = useStore();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        const reverse = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        if (reverse[0]) {
          setLocation(`${reverse[0].city || reverse[0].district || '내 위치'}`);
        }
      }
    })();
  }, []);

  const handleObserve = (name: string) => {
    if (!observed.includes(name)) {
      setObserved((prev) => [...prev, name]);
      addXP(200);
      if (observed.length + 1 >= 3) {
        earnBadge('observer_3');
      }
    }
  };

  const now = new Date();
  const dateStr = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;
  const season = ['겨울', '겨울', '봄', '봄', '봄', '여름', '여름', '여름', '가을', '가을', '가을', '겨울'][now.getMonth()];

  return (
    <LinearGradient colors={['#020210', '#060620', '#0A0A30']} style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>🌙 오늘 밤 하늘</Text>
          <Text style={styles.dateText}>{dateStr} · {season}</Text>
          {location && (
            <View style={styles.locationBadge}>
              <Text style={styles.locationText}>📍 {location}</Text>
            </View>
          )}
        </View>

        {/* 관측 팁 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>🔭 관측 꿀팁</Text>
          <Text style={styles.tipText}>
            눈이 어둠에 적응하려면 10~15분이 필요해. 핸드폰을 끄고 눈이 적응할 때까지 기다려봐!
          </Text>
        </View>

        {/* 천체 목록 */}
        <Text style={styles.sectionTitle}>오늘 밤 볼 수 있어요!</Text>

        {skyObjects.map((obj) => {
          const isObserved = observed.includes(obj.name);
          return (
            <View key={obj.name} style={[styles.skyCard, isObserved && styles.skyCardObserved]}>
              <View style={styles.skyCardHeader}>
                <Text style={styles.skyEmoji}>{obj.emoji}</Text>
                <View style={styles.skyInfo}>
                  <Text style={styles.skyName}>{obj.name}</Text>
                  <Text style={styles.skyTime}>⏰ {obj.bestTime}</Text>
                </View>
                {isObserved ? (
                  <View style={styles.observedBadge}>
                    <Text style={styles.observedText}>✓ 관측!</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.observeBtn}
                    onPress={() => handleObserve(obj.name)}
                  >
                    <Text style={styles.observeBtnText}>관측 완료</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.skyDesc}>{obj.description}</Text>
              {isObserved && (
                <Text style={styles.xpEarned}>+200 XP 획득! 🎉</Text>
              )}
            </View>
          );
        })}

        {/* 천문 이벤트 */}
        <Text style={styles.sectionTitle}>📅 이번 달 천문 이벤트</Text>
        <View style={styles.eventCard}>
          <Text style={styles.eventTitle}>🌠 페르세우스 유성우</Text>
          <Text style={styles.eventDesc}>매년 8월 12~13일 밤, 1시간에 100개 이상의 별똥별이 떨어져!</Text>
        </View>
        <View style={styles.eventCard}>
          <Text style={styles.eventTitle}>🌕 보름달</Text>
          <Text style={styles.eventDesc}>보름달은 밝아서 별 관측이 어렵지만, 달의 크레이터 관측에 좋아!</Text>
        </View>
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    gap: 16,
  },
  header: {
    gap: 6,
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  dateText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  locationBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.25)',
  },
  locationText: {
    fontSize: 13,
    color: colors.secondary,
    fontWeight: '600',
  },
  tipCard: {
    backgroundColor: 'rgba(255, 215, 0, 0.07)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
    gap: 6,
  },
  tipTitle: {
    fontSize: 14,
    color: colors.gold,
    fontWeight: '700',
  },
  tipText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 17,
    color: colors.textPrimary,
    fontWeight: '700',
    marginTop: 4,
  },
  skyCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  skyCardObserved: {
    borderColor: 'rgba(16, 185, 129, 0.3)',
    backgroundColor: 'rgba(16, 185, 129, 0.06)',
  },
  skyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  skyEmoji: {
    fontSize: 32,
  },
  skyInfo: {
    flex: 1,
    gap: 3,
  },
  skyName: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  skyTime: {
    fontSize: 12,
    color: colors.textMuted,
  },
  observeBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  observeBtnText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '700',
  },
  observedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  observedText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '700',
  },
  skyDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  xpEarned: {
    fontSize: 13,
    color: colors.success,
    fontWeight: '700',
  },
  eventCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    gap: 6,
  },
  eventTitle: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  eventDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
