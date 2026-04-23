import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AddHabitScreen from '../add-habit';

const mockAddHabit = jest.fn();
const mockBack = jest.fn();

jest.mock('../../src/store/HabitContext', () => ({
  useHabits: () => ({
    addHabit: mockAddHabit,
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockAddHabit.mockResolvedValue(undefined);
  (useRouter as jest.Mock).mockReturnValue({ back: mockBack, push: jest.fn() });
});

describe('AddHabitScreen', () => {
  it('shows an alert when saving with an empty name', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    const { getByText } = render(<AddHabitScreen />);
    fireEvent.press(getByText('Create Habit'));
    expect(alertSpy).toHaveBeenCalledWith('Name required', expect.any(String));
  });

  it('calls addHabit with correct shape when name is provided', async () => {
    const { getByPlaceholderText, getByText } = render(<AddHabitScreen />);
    fireEvent.changeText(getByPlaceholderText('e.g. Morning run'), 'Meditate');
    fireEvent.press(getByText('Create Habit'));

    await waitFor(() => expect(mockAddHabit).toHaveBeenCalledTimes(1));

    const [calledWith] = mockAddHabit.mock.calls[0];
    expect(calledWith.name).toBe('Meditate');
    expect(calledWith.frequency).toBe('daily');
    expect(typeof calledWith.id).toBe('string');
    expect(typeof calledWith.createdAt).toBe('string');
  });

  it('navigates back after a successful save', async () => {
    const { getByPlaceholderText, getByText } = render(<AddHabitScreen />);
    fireEvent.changeText(getByPlaceholderText('e.g. Morning run'), 'Meditate');
    fireEvent.press(getByText('Create Habit'));

    await waitFor(() => expect(mockBack).toHaveBeenCalled());
  });

  it('reflects typed name in the preview card', () => {
    const { getByPlaceholderText, getAllByText } = render(<AddHabitScreen />);
    fireEvent.changeText(getByPlaceholderText('e.g. Morning run'), 'Read daily');
    // The name appears both in the input and in the preview
    expect(getAllByText('Read daily').length).toBeGreaterThan(0);
  });
});
