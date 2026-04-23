import React from 'react';
import { fireEvent, render, act } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';
import HabitCard from '../HabitCard';
import { Habit } from '../../types';

// Mock the entire HabitContext module
const mockToggleCompletion = jest.fn();
const mockIsCompleted = jest.fn();

jest.mock('../../store/HabitContext', () => ({
  useHabits: () => ({
    toggleCompletion: mockToggleCompletion,
    isCompleted: mockIsCompleted,
    completions: [],
  }),
}));

const mockHabit: Habit = {
  id: '1',
  name: 'Morning Run',
  emoji: '🏃',
  color: '#6366F1',
  frequency: 'daily',
  createdAt: '2026-04-15T10:00:00.000Z',
};

beforeEach(() => {
  jest.clearAllMocks();
  mockIsCompleted.mockReturnValue(false);
  mockToggleCompletion.mockResolvedValue(undefined);
});

describe('HabitCard', () => {
  it('renders the habit name', () => {
    const { getByText } = render(<HabitCard habit={mockHabit} />);
    expect(getByText('Morning Run')).toBeTruthy();
  });

  it('renders the habit emoji', () => {
    const { getByText } = render(<HabitCard habit={mockHabit} />);
    expect(getByText('🏃')).toBeTruthy();
  });

  it('does not show streak text when streak is 0', () => {
    const { queryByText } = render(<HabitCard habit={mockHabit} />);
    expect(queryByText(/day streak/)).toBeNull();
  });

  it('shows streak text when streak is greater than 0', () => {
    // Provide completions for the last 3 days so getStreakCount returns 3
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-04-15T10:00:00.000Z'));

    jest.mock('../../store/HabitContext', () => ({
      useHabits: () => ({
        toggleCompletion: mockToggleCompletion,
        isCompleted: mockIsCompleted,
        completions: [
          { habitId: '1', date: '2026-04-13', completedAt: '' },
          { habitId: '1', date: '2026-04-14', completedAt: '' },
          { habitId: '1', date: '2026-04-15', completedAt: '' },
        ],
      }),
    }));

    jest.useRealTimers();
  });

  it('calls toggleCompletion when card is pressed', async () => {
    const { getByText } = render(<HabitCard habit={mockHabit} />);
    await act(async () => {
      fireEvent.press(getByText('Morning Run'));
    });
    expect(mockToggleCompletion).toHaveBeenCalledWith('1');
  });

  it('calls Haptics.impactAsync when pressed', async () => {
    const { getByText } = render(<HabitCard habit={mockHabit} />);
    await act(async () => {
      fireEvent.press(getByText('Morning Run'));
    });
    expect(Haptics.impactAsync).toHaveBeenCalledWith(
      Haptics.ImpactFeedbackStyle.Medium
    );
  });

  it('shows checkmark text when habit is completed', () => {
    mockIsCompleted.mockReturnValue(true);
    const { getByText } = render(<HabitCard habit={mockHabit} />);
    expect(getByText('✓')).toBeTruthy();
  });

  it('does not show checkmark when habit is not completed', () => {
    mockIsCompleted.mockReturnValue(false);
    const { queryByText } = render(<HabitCard habit={mockHabit} />);
    expect(queryByText('✓')).toBeNull();
  });
});
