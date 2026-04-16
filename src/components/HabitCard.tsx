import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Habit } from '../types';
import { getStreakCount } from '../store/habitStore';
import { useHabits } from '../store/HabitContext';

interface Props {
  habit: Habit;
}

export default function HabitCard({ habit }: Props) {
  const { toggleCompletion, isCompleted, completions } = useHabits();
  const done = isCompleted(habit.id);
  const streak = getStreakCount(completions, habit.id);

  async function handlePress() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleCompletion(habit.id);
  }

  return (
    <Pressable
      style={[styles.card, done && { backgroundColor: habit.color + '22', borderColor: habit.color }]}
      onPress={handlePress}
    >
      <View style={[styles.emojiBox, { backgroundColor: habit.color + '33' }]}>
        <Text style={styles.emoji}>{habit.emoji}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{habit.name}</Text>
        {streak > 0 && (
          <Text style={styles.streak}>🔥 {streak} day streak</Text>
        )}
      </View>
      <View style={[styles.checkCircle, done && { backgroundColor: habit.color }]}>
        {done && <Text style={styles.checkMark}>✓</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  emojiBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  emoji: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  streak: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
