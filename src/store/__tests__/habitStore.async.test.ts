import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadHabits, saveHabits, loadCompletions, saveCompletions } from '../habitStore';
import { Habit, HabitCompletion } from '../../types';

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

const mockHabit: Habit = {
  id: '1',
  name: 'Morning Run',
  emoji: '🏃',
  color: '#6366F1',
  frequency: 'daily',
  createdAt: '2026-04-15T10:00:00.000Z',
};

const mockCompletion: HabitCompletion = {
  habitId: '1',
  date: '2026-04-15',
  completedAt: '2026-04-15T10:00:00.000Z',
};

// ─── Habits ──────────────────────────────────────────────────────────────────

describe('saveHabits / loadHabits', () => {
  it('returns empty array when storage is empty', async () => {
    const result = await loadHabits();
    expect(result).toEqual([]);
  });

  it('saves and loads a habit array correctly', async () => {
    await saveHabits([mockHabit]);
    const result = await loadHabits();
    expect(result).toEqual([mockHabit]);
  });

  it('preserves all Habit fields through serialization', async () => {
    await saveHabits([mockHabit]);
    const [loaded] = await loadHabits();
    expect(loaded.id).toBe(mockHabit.id);
    expect(loaded.name).toBe(mockHabit.name);
    expect(loaded.emoji).toBe(mockHabit.emoji);
    expect(loaded.color).toBe(mockHabit.color);
    expect(loaded.frequency).toBe(mockHabit.frequency);
    expect(loaded.createdAt).toBe(mockHabit.createdAt);
  });

  it('saves multiple habits and loads them all', async () => {
    const second: Habit = { ...mockHabit, id: '2', name: 'Read' };
    await saveHabits([mockHabit, second]);
    const result = await loadHabits();
    expect(result).toHaveLength(2);
    expect(result[1].name).toBe('Read');
  });
});

// ─── Completions ─────────────────────────────────────────────────────────────

describe('saveCompletions / loadCompletions', () => {
  it('returns empty array when storage is empty', async () => {
    const result = await loadCompletions();
    expect(result).toEqual([]);
  });

  it('saves and loads a completion array correctly', async () => {
    await saveCompletions([mockCompletion]);
    const result = await loadCompletions();
    expect(result).toEqual([mockCompletion]);
  });

  it('preserves all HabitCompletion fields through serialization', async () => {
    await saveCompletions([mockCompletion]);
    const [loaded] = await loadCompletions();
    expect(loaded.habitId).toBe(mockCompletion.habitId);
    expect(loaded.date).toBe(mockCompletion.date);
    expect(loaded.completedAt).toBe(mockCompletion.completedAt);
  });
});
