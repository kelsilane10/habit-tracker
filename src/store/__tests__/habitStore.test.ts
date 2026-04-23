import {
  todayString,
  isCompletedToday,
  getStreakCount,
  getCompletionRate,
} from '../habitStore';
import { HabitCompletion } from '../../types';

const FIXED_DATE = '2026-04-15';
const FIXED_NOW = new Date(`${FIXED_DATE}T10:00:00.000Z`);

function makeCompletion(habitId: string, date: string): HabitCompletion {
  return { habitId, date, completedAt: `${date}T10:00:00.000Z` };
}

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(FIXED_NOW);
});

afterEach(() => {
  jest.useRealTimers();
});

// ─── todayString ─────────────────────────────────────────────────────────────

describe('todayString', () => {
  it('returns today in YYYY-MM-DD format', () => {
    expect(todayString()).toBe(FIXED_DATE);
  });
});

// ─── isCompletedToday ────────────────────────────────────────────────────────

describe('isCompletedToday', () => {
  it('returns true when habit is completed today', () => {
    const completions = [makeCompletion('h1', FIXED_DATE)];
    expect(isCompletedToday(completions, 'h1')).toBe(true);
  });

  it('returns false with no completions', () => {
    expect(isCompletedToday([], 'h1')).toBe(false);
  });

  it('returns false when completion is from yesterday', () => {
    const completions = [makeCompletion('h1', '2026-04-14')];
    expect(isCompletedToday(completions, 'h1')).toBe(false);
  });

  it('returns false when habitId does not match', () => {
    const completions = [makeCompletion('h2', FIXED_DATE)];
    expect(isCompletedToday(completions, 'h1')).toBe(false);
  });
});

// ─── getStreakCount ───────────────────────────────────────────────────────────

describe('getStreakCount', () => {
  it('returns 0 with no completions', () => {
    expect(getStreakCount([], 'h1')).toBe(0);
  });

  it('returns 1 when only completed today', () => {
    const completions = [makeCompletion('h1', FIXED_DATE)];
    expect(getStreakCount(completions, 'h1')).toBe(1);
  });

  it('returns correct count for 3 consecutive days ending today', () => {
    const completions = [
      makeCompletion('h1', '2026-04-13'),
      makeCompletion('h1', '2026-04-14'),
      makeCompletion('h1', FIXED_DATE),
    ];
    expect(getStreakCount(completions, 'h1')).toBe(3);
  });

  it('breaks streak at a gap in the middle', () => {
    const completions = [
      makeCompletion('h1', '2026-04-12'),
      // gap: 2026-04-13 missing
      makeCompletion('h1', '2026-04-14'),
      makeCompletion('h1', FIXED_DATE),
    ];
    expect(getStreakCount(completions, 'h1')).toBe(2);
  });

  it('returns 0 when today is missing even if yesterday and earlier exist', () => {
    const completions = [
      makeCompletion('h1', '2026-04-13'),
      makeCompletion('h1', '2026-04-14'),
      // today missing
    ];
    expect(getStreakCount(completions, 'h1')).toBe(0);
  });

  it('ignores completions for other habits', () => {
    const completions = [
      makeCompletion('h2', FIXED_DATE),
      makeCompletion('h2', '2026-04-14'),
    ];
    expect(getStreakCount(completions, 'h1')).toBe(0);
  });
});

// ─── getCompletionRate ────────────────────────────────────────────────────────

describe('getCompletionRate', () => {
  it('returns 0 with no completions', () => {
    expect(getCompletionRate([], 'h1', 7)).toBe(0);
  });

  it('returns 100 when completed every day in window', () => {
    const completions = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(FIXED_NOW);
      d.setDate(d.getDate() - i);
      return makeCompletion('h1', d.toISOString().split('T')[0]);
    });
    expect(getCompletionRate(completions, 'h1', 7)).toBe(100);
  });

  it('returns correct percentage for partial completion', () => {
    // Complete 3 of last 7 days
    const completions = [
      makeCompletion('h1', FIXED_DATE),
      makeCompletion('h1', '2026-04-14'),
      makeCompletion('h1', '2026-04-13'),
    ];
    expect(getCompletionRate(completions, 'h1', 7)).toBe(43); // 3/7 = 42.8 → 43
  });

  it('respects custom days parameter', () => {
    const completions = [makeCompletion('h1', FIXED_DATE)];
    expect(getCompletionRate(completions, 'h1', 1)).toBe(100);
    expect(getCompletionRate(completions, 'h1', 30)).toBe(3); // 1/30 = 3.3 → 3
  });

  it('excludes completions outside the window', () => {
    const completions = [makeCompletion('h1', '2026-04-01')]; // > 7 days ago
    expect(getCompletionRate(completions, 'h1', 7)).toBe(0);
  });

  it('ignores completions for other habits', () => {
    const completions = [makeCompletion('h2', FIXED_DATE)];
    expect(getCompletionRate(completions, 'h1', 7)).toBe(0);
  });
});
