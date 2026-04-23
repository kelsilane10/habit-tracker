import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import TodayScreen from '../(tabs)/index';

const mockPush = jest.fn();
const mockIsCompleted = jest.fn();

jest.mock('../../src/store/HabitContext', () => ({
  useHabits: () => ({
    habits: mockHabits,
    completions: [],
    isCompleted: mockIsCompleted,
    isLoading: mockIsLoading,
  }),
}));

// Mutable test state
let mockHabits: any[] = [];
let mockIsLoading = false;

beforeEach(() => {
  jest.clearAllMocks();
  mockHabits = [];
  mockIsLoading = false;
  mockIsCompleted.mockReturnValue(false);
  (useRouter as jest.Mock).mockReturnValue({ push: mockPush, back: jest.fn() });
});

describe('TodayScreen', () => {
  it('shows a loading spinner when isLoading is true', () => {
    mockIsLoading = true;
    const { getByTestId, UNSAFE_getByType } = render(<TodayScreen />);
    // ActivityIndicator is rendered in loading state
    const { ActivityIndicator } = require('react-native');
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('shows empty state when there are no habits', () => {
    mockHabits = [];
    const { getByText } = render(<TodayScreen />);
    expect(getByText('No habits yet')).toBeTruthy();
  });

  it('shows the habit list when habits exist', () => {
    mockHabits = [
      { id: '1', name: 'Morning Run', emoji: '🏃', color: '#6366F1', frequency: 'daily', createdAt: '' },
    ];
    const { getByText } = render(<TodayScreen />);
    expect(getByText('Morning Run')).toBeTruthy();
  });

  it('shows the correct progress fraction', () => {
    mockHabits = [
      { id: '1', name: 'Habit A', emoji: '💪', color: '#6366F1', frequency: 'daily', createdAt: '' },
      { id: '2', name: 'Habit B', emoji: '📚', color: '#10B981', frequency: 'daily', createdAt: '' },
    ];
    mockIsCompleted.mockImplementation((id: string) => id === '1');
    const { getByText } = render(<TodayScreen />);
    expect(getByText('1 / 2 completed')).toBeTruthy();
    expect(getByText('50%')).toBeTruthy();
  });

  it('navigates to add-habit when Add button is pressed', () => {
    const { getByText } = render(<TodayScreen />);
    fireEvent.press(getByText('+ Add'));
    expect(mockPush).toHaveBeenCalledWith('/add-habit');
  });
});
