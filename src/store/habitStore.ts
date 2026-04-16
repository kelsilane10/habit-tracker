import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, HabitCompletion } from '../types';

const HABITS_KEY = 'habits';
const COMPLETIONS_KEY = 'completions';

export async function loadHabits(): Promise<Habit[]> {
  const raw = await AsyncStorage.getItem(HABITS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveHabits(habits: Habit[]): Promise<void> {
  await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}

export async function loadCompletions(): Promise<HabitCompletion[]> {
  const raw = await AsyncStorage.getItem(COMPLETIONS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveCompletions(completions: HabitCompletion[]): Promise<void> {
  await AsyncStorage.setItem(COMPLETIONS_KEY, JSON.stringify(completions));
}

export function todayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function isCompletedToday(completions: HabitCompletion[], habitId: string): boolean {
  const today = todayString();
  return completions.some((c) => c.habitId === habitId && c.date === today);
}

export function getStreakCount(completions: HabitCompletion[], habitId: string): number {
  const habitCompletions = completions
    .filter((c) => c.habitId === habitId)
    .map((c) => c.date)
    .sort()
    .reverse();

  if (habitCompletions.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < habitCompletions.length; i++) {
    const expected = new Date(today);
    expected.setDate(today.getDate() - i);
    const expectedStr = expected.toISOString().split('T')[0];

    if (habitCompletions[i] === expectedStr) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function getCompletionRate(
  completions: HabitCompletion[],
  habitId: string,
  days = 7
): number {
  const habitCompletions = completions.filter((c) => c.habitId === habitId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let completed = 0;
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    if (habitCompletions.some((c) => c.date === dateStr)) {
      completed++;
    }
  }

  return Math.round((completed / days) * 100);
}
