import React, { useCallback, useRef, useState } from 'react';
import {
  KeyboardAvoidingView, Modal, Platform, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { mcCharacters, getCharacterById, getRandomCharacter, MCCharacter } from '../data/mcCharacters';
import { useStore } from '../store/useStore';
import { colors } from '../theme/colors';

interface Message {
  role: 'user' | 'char';
  text: string;
  characterId: string;
}

const SUGGESTED: Record<string, string[]> = {
  steve: ['블랙홀이 뭐야?', '목성에 갈 수 있어?', '우주에서 살 수 있어?'],
  alex: ['새로운 바이옴은 어디야?', '외계 생명체가 있을까?', '달 뒷면은 어떻게 생겼어?'],
  villager: ['희귀 자원은 뭐야?', '어떤 자원이 제일 비싸?', '제작 아이템 뭐가 좋아?'],
  enderman: ['블랙홀 근처에 가면?', '차원이 여러 개야?', '시간이 느려지는 게 진짜야?'],
  iron_golem: ['태양계 행성 몇 개야?', '가장 위험한 바이옴은?', '우주 기지 어떻게 지어?'],
  creeper: ['우주에서 폭발하면?', '제일 신기한 우주 사실은?', '블랙홀에 빠지면 어떻게 돼?'],
};

export const CocoScreen: React.FC = () => {
  const { selectedCharacterId, setCharacter } = useStore();
  const [showPicker, setShowPicker] = useState(false);
  const [activeCharId, setActiveCharId] = useState(
    selectedCharacterId === 'random' ? getRandomCharacter().id : selectedCharacterId,
  );
  const activeChar = getCharacterById(activeCharId);

  const [messages, setMessages] = useState<Message[]>([
    { role: 'char', text: activeChar.greeting, characterId: activeChar.id },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const char = getCharacterById(activeCharId);

    const userMsg: Message = { role: 'user', text: text.trim(), characterId: activeCharId };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const history = messages.slice(-6).map(m => ({
        role: m.role === 'char' ? 'assistant' : 'user',
        content: m.text,
      }));

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 250,
          system: char.systemPrompt,
          messages: [...history, { role: 'user', content: text.trim() }],
        }),
      });

      const data = await res.json();
      const reply = data.content?.[0]?.text || getLocalFallback(text, char.id);
      setMessages(prev => [...prev, { role: 'char', text: reply, characterId: char.id }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'char', text: getLocalFallback(text, char.id), characterId: char.id,
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [loading, messages, activeCharId]);

  const switchCharacter = (charId: string) => {
    setActiveCharId(charId);
    setCharacter(charId);
    const char = getCharacterById(charId);
    setMessages([{ role: 'char', text: char.greeting, characterId: char.id }]);
    setShowPicker(false);
  };

  const suggested = SUGGESTED[activeCharId] || SUGGESTED['steve'];

  return (
    <LinearGradient colors={['#0A0A1A', '#0F0F2E']} style={styles.root}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={88}>

        {/* 헤더 */}
        <View style={styles.header}>
          <View style={[styles.charAvatar, { borderColor: activeChar.color }]}>
            <Text style={styles.charAvatarEmoji}>{activeChar.emoji}</Text>
          </View>
          <View style={styles.charInfo}>
            <Text style={[styles.charName, { color: activeChar.color }]}>{activeChar.name}</Text>
            <Text style={styles.charRole}>{activeChar.role} · 우주 동반자</Text>
          </View>
          <TouchableOpacity style={styles.switchBtn} onPress={() => setShowPicker(true)}>
            <Text style={styles.switchBtnText}>🔄 변경</Text>
          </TouchableOpacity>
        </View>

        {/* 메시지 목록 */}
        <ScrollView ref={scrollRef} style={styles.list} contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>
          {messages.map((msg, i) => {
            const char = getCharacterById(msg.characterId);
            return (
              <View key={i} style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.charBubble]}>
                {msg.role === 'char' && (
                  <Text style={[styles.bubbleName, { color: char.color }]}>{char.name}</Text>
                )}
                <Text style={[styles.bubbleText, msg.role === 'user' && styles.userText]}>
                  {msg.text}
                </Text>
              </View>
            );
          })}
          {loading && (
            <View style={[styles.bubble, styles.charBubble]}>
              <Text style={[styles.bubbleName, { color: activeChar.color }]}>{activeChar.name}</Text>
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color={activeChar.color} />
                <Text style={styles.loadingText}>생각 중...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* 추천 질문 */}
        {messages.length <= 2 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestRow} style={styles.suggestScroll}>
            {suggested.map((q, i) => (
              <TouchableOpacity key={i} style={[styles.suggestBtn, { borderColor: activeChar.color + '55' }]}
                onPress={() => sendMessage(q)}>
                <Text style={[styles.suggestText, { color: activeChar.color }]}>{q}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* 입력창 */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder={`${activeChar.name}에게 물어봐! ${activeChar.emoji}`}
            placeholderTextColor={colors.textMuted}
            onSubmitEditing={() => sendMessage(input)}
            returnKeyType="send"
            editable={!loading}
          />
          <TouchableOpacity
            style={[styles.sendBtn, { backgroundColor: activeChar.color }, (!input.trim() || loading) && styles.sendBtnDisabled]}
            onPress={() => sendMessage(input)}
            disabled={!input.trim() || loading}
          >
            <Text style={styles.sendBtnText}>→</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* 캐릭터 선택 모달 */}
      <Modal visible={showPicker} animationType="slide" transparent onRequestClose={() => setShowPicker(false)}>
        <View style={styles.pickerOverlay}>
          <LinearGradient colors={['#1A1A40', '#0A0A20']} style={styles.pickerModal}>
            <Text style={styles.pickerTitle}>🎮 동반자 선택</Text>
            <Text style={styles.pickerSubtitle}>누구와 우주를 탐험할까?</Text>
            {mcCharacters.map(char => (
              <TouchableOpacity
                key={char.id}
                style={[styles.charOption, activeCharId === char.id && { borderColor: char.color }]}
                onPress={() => switchCharacter(char.id)}
              >
                <Text style={styles.charOptionEmoji}>{char.emoji}</Text>
                <View style={styles.charOptionInfo}>
                  <Text style={[styles.charOptionName, { color: char.color }]}>{char.name}</Text>
                  <Text style={styles.charOptionRole}>{char.role} · {char.personality}</Text>
                </View>
                {activeCharId === char.id && <Text style={styles.selectedMark}>✓</Text>}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.randomBtn} onPress={() => {
              const r = getRandomCharacter();
              switchCharacter(r.id);
            }}>
              <Text style={styles.randomBtnText}>🎲 랜덤 선택</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
    </LinearGradient>
  );
};

function getLocalFallback(q: string, charId: string): string {
  const text = q.toLowerCase();
  const fallbacks: Record<string, Record<string, string>> = {
    steve: {
      default: '좋은 질문이야! 우주는 탐험할 게 무궁무진해! 탐험 맵에서 직접 확인해봐! 🗡️',
      블랙홀: '블랙홀은 우주의 가장 강력한 보스야! 빛조차 탈출 못 해. 가까이 가면... 끝이야! ⚔️',
    },
    enderman: {
      default: '...흥미롭군... 우주의 비밀은... 아직 밝혀지지 않은 것이 많아...',
      블랙홀: '...블랙홀은... 차원의 경계... 빛조차 빨려 들어가는 곳... 시간도 멈추는 그곳...',
    },
    creeper: {
      default: '앗! 완전 폭발적으로 신기한 질문이야!! 탐험 맵에서 확인해봐!! 💥',
      블랙홀: '블랙홀?! 저보다 더 강한 폭발력이라고요?! 빛도 빨아들인다고요?! 대박 SSS급이야!! 💥💥',
    },
    villager: {
      default: '흠흠! 좋은 질문이야! 바이옴을 탐험하면 알 수 있지! 흠흠흠~ 💎',
      블랙홀: '흠흠! 블랙홀 근처엔 희귀 자원이 있다는 소문이! 하지만 위험해! 흠흠흠~',
    },
    alex: {
      default: '오! 새로운 발견 같은 질문이야! 탐험 맵에서 직접 확인해봐! 🏹',
      블랙홀: '오! 블랙홀은 아직 완전히 탐험 안 된 곳이야! 엄청난 중력으로 빛도 못 빠져나와!',
    },
    iron_golem: {
      default: '정확한 정보가 필요하군! 탐험 맵 데이터를 확인해봐. 걱정 마! 🛡️',
      블랙홀: '데이터 분석: 블랙홀은 태양 질량의 수백만 배. 탈출 속도 = 빛의 속도 초과. 접근 금지!',
    },
  };

  const charFallbacks = fallbacks[charId] || fallbacks['steve'];
  if (text.includes('블랙홀')) return charFallbacks['블랙홀'] || charFallbacks['default'];
  return charFallbacks['default'];
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingTop: 60, paddingHorizontal: 20, paddingBottom: 14,
    gap: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  charAvatar: {
    width: 48, height: 48, borderRadius: 24,
    borderWidth: 2, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  charAvatarEmoji: { fontSize: 26 },
  charInfo: { flex: 1, gap: 2 },
  charName: { fontSize: 18, fontWeight: '800' },
  charRole: { fontSize: 12, color: colors.textMuted },
  switchBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 7,
  },
  switchBtnText: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  list: { flex: 1 },
  listContent: { padding: 16, gap: 12, paddingBottom: 8 },
  bubble: { maxWidth: '82%', borderRadius: 16, padding: 12, gap: 4 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  charBubble: {
    alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderBottomLeftRadius: 4,
  },
  bubbleName: { fontSize: 11, fontWeight: '800' },
  bubbleText: { fontSize: 15, color: colors.textPrimary, lineHeight: 22 },
  userText: { color: '#fff' },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  loadingText: { fontSize: 13, color: colors.textMuted },
  suggestScroll: { maxHeight: 50 },
  suggestRow: { paddingHorizontal: 16, gap: 8, paddingVertical: 6 },
  suggestBtn: {
    backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1,
  },
  suggestText: { fontSize: 13, fontWeight: '600' },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, gap: 10,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)',
  },
  input: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 22,
    paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: colors.textPrimary,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { opacity: 0.3 },
  sendBtnText: { fontSize: 20, color: '#fff', fontWeight: '700' },
  // 캐릭터 선택 모달
  pickerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  pickerModal: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 44, gap: 12 },
  pickerTitle: { fontSize: 22, color: colors.textPrimary, fontWeight: '800', textAlign: 'center' },
  pickerSubtitle: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: 4 },
  charOption: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 12,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.08)',
  },
  charOptionEmoji: { fontSize: 30 },
  charOptionInfo: { flex: 1, gap: 3 },
  charOptionName: { fontSize: 16, fontWeight: '800' },
  charOptionRole: { fontSize: 12, color: colors.textMuted },
  selectedMark: { fontSize: 18, color: colors.success, fontWeight: '900' },
  randomBtn: {
    backgroundColor: 'rgba(123,97,255,0.2)', borderRadius: 14, padding: 14,
    alignItems: 'center', borderWidth: 1, borderColor: 'rgba(123,97,255,0.4)', marginTop: 4,
  },
  randomBtnText: { fontSize: 16, color: colors.primaryLight, fontWeight: '800' },
});
