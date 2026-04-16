import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHabits } from '../src/store/HabitContext';
import { Habit } from '../src/types';

const EMOJIS = ['💪', '🏃', '📚', '🧘', '💧', '🥗', '😴', '🎨', '🎸', '✍️', '🧹', '🌿', '🏊', '🚴', '🧠', '💊'];

const COLORS = [
  '#6366F1', '#EC4899', '#F59E0B', '#10B981',
  '#3B82F6', '#EF4444', '#8B5CF6', '#14B8A6',
];

export default function AddHabitScreen() {
  const router = useRouter();
  const { addHabit } = useHabits();

  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('💪');
  const [selectedColor, setSelectedColor] = useState('#6366F1');

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter a name for your habit.');
      return;
    }

    const habit: Habit = {
      id: Date.now().toString(),
      name: name.trim(),
      emoji: selectedEmoji,
      color: selectedColor,
      frequency: 'daily',
      createdAt: new Date().toISOString(),
    };

    await addHabit(habit);
    router.back();
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Name input */}
          <Text style={styles.label}>Habit name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Morning run"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
            maxLength={40}
            autoFocus
            returnKeyType="done"
          />

          {/* Emoji picker */}
          <Text style={styles.label}>Icon</Text>
          <View style={styles.emojiGrid}>
            {EMOJIS.map((emoji) => (
              <Pressable
                key={emoji}
                style={[
                  styles.emojiOption,
                  selectedEmoji === emoji && styles.emojiOptionSelected,
                ]}
                onPress={() => setSelectedEmoji(emoji)}
              >
                <Text style={styles.emojiOptionText}>{emoji}</Text>
              </Pressable>
            ))}
          </View>

          {/* Color picker */}
          <Text style={styles.label}>Color</Text>
          <View style={styles.colorRow}>
            {COLORS.map((color) => (
              <Pressable
                key={color}
                style={[
                  styles.colorDot,
                  { backgroundColor: color },
                  selectedColor === color && styles.colorDotSelected,
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>

          {/* Preview */}
          <Text style={styles.label}>Preview</Text>
          <View style={[styles.preview, { borderColor: selectedColor }]}>
            <View style={[styles.previewEmoji, { backgroundColor: selectedColor + '33' }]}>
              <Text style={{ fontSize: 24 }}>{selectedEmoji}</Text>
            </View>
            <Text style={styles.previewName}>{name || 'My habit'}</Text>
            <View style={[styles.previewCheck, { borderColor: selectedColor }]} />
          </View>

        </ScrollView>

        {/* Save button */}
        <View style={styles.footer}>
          <Pressable
            style={[styles.saveButton, { backgroundColor: selectedColor }]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Create Habit</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scroll: {
    padding: 20,
    paddingBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 14,
    fontSize: 17,
    color: '#111827',
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  emojiOption: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiOptionSelected: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  emojiOptionText: {
    fontSize: 24,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  colorDotSelected: {
    transform: [{ scale: 1.25 }],
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
  },
  previewEmoji: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  previewName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  previewCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
  },
  footer: {
    padding: 20,
    paddingBottom: 12,
  },
  saveButton: {
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});
