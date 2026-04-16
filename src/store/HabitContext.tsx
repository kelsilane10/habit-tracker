import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Habit, HabitCompletion } from '../types';
import {
  loadHabits,
  saveHabits,
  loadCompletions,
  saveCompletions,
  todayString,
  isCompletedToday,
} from './habitStore';

interface HabitContextValue {
  habits: Habit[];
  completions: HabitCompletion[];
  addHabit: (habit: Habit) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleCompletion: (habitId: string) => Promise<void>;
  isCompleted: (habitId: string) => boolean;
  isLoading: boolean;
}

const HabitContext = createContext<HabitContextValue | null>(null);

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([loadHabits(), loadCompletions()]).then(([h, c]) => {
      setHabits(h);
      setCompletions(c);
      setIsLoading(false);
    });
  }, []);

  const addHabit = useCallback(async (habit: Habit) => {
    const updated = [...habits, habit];
    setHabits(updated);
    await saveHabits(updated);
  }, [habits]);

  const deleteHabit = useCallback(async (id: string) => {
    const updated = habits.filter((h) => h.id !== id);
    setHabits(updated);
    await saveHabits(updated);
    const updatedCompletions = completions.filter((c) => c.habitId !== id);
    setCompletions(updatedCompletions);
    await saveCompletions(updatedCompletions);
  }, [habits, completions]);

  const toggleCompletion = useCallback(async (habitId: string) => {
    const today = todayString();
    const alreadyDone = completions.some((c) => c.habitId === habitId && c.date === today);

    let updated: HabitCompletion[];
    if (alreadyDone) {
      updated = completions.filter((c) => !(c.habitId === habitId && c.date === today));
    } else {
      updated = [
        ...completions,
        { habitId, date: today, completedAt: new Date().toISOString() },
      ];
    }

    setCompletions(updated);
    await saveCompletions(updated);
  }, [completions]);

  const isCompleted = useCallback(
    (habitId: string) => isCompletedToday(completions, habitId),
    [completions]
  );

  return (
    <HabitContext.Provider
      value={{ habits, completions, addHabit, deleteHabit, toggleCompletion, isCompleted, isLoading }}
    >
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const ctx = useContext(HabitContext);
  if (!ctx) throw new Error('useHabits must be used within HabitProvider');
  return ctx;
}
