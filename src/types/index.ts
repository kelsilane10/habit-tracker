export type HabitFrequency = 'daily' | 'weekly';

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: string;
  frequency: HabitFrequency;
  targetDays?: number[]; // 0=Sun, 1=Mon, ... 6=Sat (for weekly)
  createdAt: string; // ISO date string
}

export interface HabitCompletion {
  habitId: string;
  date: string; // YYYY-MM-DD
  completedAt: string; // ISO timestamp
}
