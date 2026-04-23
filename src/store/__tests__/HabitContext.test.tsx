import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HabitProvider, useHabits } from '../HabitContext';
import { Habit } from '../../types';

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-04-15T10:00:00.000Z'));
});

afterEach(() => {
  jest.useRealTimers();
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <HabitProvider>{children}</HabitProvider>
);

const mockHabit: Habit = {
  id: '1',
  name: 'Morning Run',
  emoji: '🏃',
  color: '#6366F1',
  frequency: 'daily',
  createdAt: '2026-04-15T10:00:00.000Z',
};

// ─── Initial load ─────────────────────────────────────────────────────────────

describe('HabitProvider — initial load', () => {
  it('starts with isLoading true then resolves to false', async () => {
    const { result } = renderHook(() => useHabits(), { wrapper });
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  it('starts with empty habits and completions', async () => {
    const { result } = renderHook(() => useHabits(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.habits).toEqual([]);
    expect(result.current.completions).toEqual([]);
  });
});

// ─── addHabit ────────────────────────────────────────────────────────────────

describe('addHabit', () => {
  it('adds a habit to state', async () => {
    const { result } = renderHook(() => useHabits(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.addHabit(mockHabit);
    });

    expect(result.current.habits).toHaveLength(1);
    expect(result.current.habits[0].name).toBe('Morning Run');
  });

  it('persists the habit via saveHabits', async () => {
    const { result } = renderHook(() => useHabits(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.addHabit(mockHabit);
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'habits',
      JSON.stringify([mockHabit])
    );
  });
});

// ─── deleteHabit ─────────────────────────────────────────────────────────────

describe('deleteHabit', () => {
  it('removes the habit from state', async () => {
    const { result } = renderHook(() => useHabits(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.addHabit(mockHabit);
    });
    await act(async () => {
      await result.current.deleteHabit('1');
    });

    expect(result.current.habits).toHaveLength(0);
  });

  it('removes completions for the deleted habit', async () => {
    const { result } = renderHook(() => useHabits(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.addHabit(mockHabit);
      await result.current.toggleCompletion('1');
    });

    expect(result.current.completions).toHaveLength(1);

    await act(async () => {
      await result.current.deleteHabit('1');
    });

    expect(result.current.completions).toHaveLength(0);
  });
});

// ─── toggleCompletion ────────────────────────────────────────────────────────

describe('toggleCompletion', () => {
  it('adds a completion for today when not yet done', async () => {
    const { result } = renderHook(() => useHabits(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.toggleCompletion('1');
    });

    expect(result.current.completions).toHaveLength(1);
    expect(result.current.completions[0].habitId).toBe('1');
    expect(result.current.completions[0].date).toBe('2026-04-15');
  });

  it('removes the completion when already done today', async () => {
    const { result } = renderHook(() => useHabits(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.toggleCompletion('1');
    });
    expect(result.current.completions).toHaveLength(1);

    await act(async () => {
      await result.current.toggleCompletion('1');
    });
    expect(result.current.completions).toHaveLength(0);
  });

  it('isCompleted returns true after toggling on', async () => {
    const { result } = renderHook(() => useHabits(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isCompleted('1')).toBe(false);

    await act(async () => {
      await result.current.toggleCompletion('1');
    });

    expect(result.current.isCompleted('1')).toBe(true);
  });
});

// ─── useHabits outside provider ──────────────────────────────────────────────

describe('useHabits', () => {
  it('throws when used outside HabitProvider', () => {
    // Suppress the expected console.error from React
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useHabits())).toThrow(
      'useHabits must be used within HabitProvider'
    );
    spy.mockRestore();
  });
});
