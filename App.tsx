import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

import { HomeScreen } from './src/screens/HomeScreen';
import { ExploreScreen } from './src/screens/ExploreScreen';
import { QuizScreen } from './src/screens/QuizScreen';
import { CollectScreen } from './src/screens/CollectScreen';
import { CocoScreen } from './src/screens/CocoScreen';
import { TonightScreen } from './src/screens/TonightScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { CraftingScreen } from './src/screens/CraftingScreen';
import { BaseScreen } from './src/screens/BaseScreen';
import { useStore } from './src/store/useStore';
import { colors } from './src/theme/colors';

const Tab = createBottomTabNavigator();

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: focused ? 22 : 18, opacity: focused ? 1 : 0.5 }}>
        {emoji}
      </Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0D0D22',
          borderTopColor: 'rgba(255,255,255,0.07)',
          borderTopWidth: 1,
          height: 82,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primaryLight,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginTop: 2 },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen}
        options={{ tabBarLabel: '퀘스트', tabBarIcon: ({ focused }) => <TabIcon emoji="📋" focused={focused} /> }} />
      <Tab.Screen name="Explore" component={ExploreScreen}
        options={{ tabBarLabel: '탐험', tabBarIcon: ({ focused }) => <TabIcon emoji="🗺️" focused={focused} /> }} />
      <Tab.Screen name="Crafting" component={CraftingScreen}
        options={{ tabBarLabel: '제작', tabBarIcon: ({ focused }) => <TabIcon emoji="⚒️" focused={focused} /> }} />
      <Tab.Screen name="Base" component={BaseScreen}
        options={{ tabBarLabel: '기지', tabBarIcon: ({ focused }) => <TabIcon emoji="🏗️" focused={focused} /> }} />
      <Tab.Screen name="Coco" component={CocoScreen}
        options={{ tabBarLabel: 'AI', tabBarIcon: ({ focused }) => <TabIcon emoji="🎮" focused={focused} /> }} />
      <Tab.Screen name="Quiz" component={QuizScreen}
        options={{ tabBarLabel: '퀴즈', tabBarIcon: ({ focused }) => <TabIcon emoji="🧠" focused={focused} /> }} />
      <Tab.Screen name="Tonight" component={TonightScreen}
        options={{ tabBarLabel: '밤하늘', tabBarIcon: ({ focused }) => <TabIcon emoji="🌙" focused={focused} /> }} />
      <Tab.Screen name="Collect" component={CollectScreen}
        options={{ tabBarLabel: '도감', tabBarIcon: ({ focused }) => <TabIcon emoji="🃏" focused={focused} /> }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const { nickname, loadState } = useStore();
  const [loaded, setLoaded] = useState(false);
  const [onboarded, setOnboarded] = useState(false);

  useEffect(() => {
    loadState().then(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded && nickname) setOnboarded(true);
  }, [loaded, nickname]);

  if (!loaded) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 48 }}>🚀</Text>
        <Text style={{ color: colors.textSecondary, marginTop: 16, fontSize: 16 }}>
          우주 기지 로딩 중...
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      {!onboarded
        ? <OnboardingScreen onComplete={() => setOnboarded(true)} />
        : <MainTabs />}
    </NavigationContainer>
  );
}
