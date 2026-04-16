import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHabits } from '../../src/store/HabitContext';
import { getStreakCount, getCompletionRate } from '../../src/store/habitStore';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function WeekGrid({ habitId, color }: { habitId: string; color: string }) {
  const { completions } = useHabits();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const done = completions.some((c) => c.habitId === habitId && c.date === dateStr);
    return { dateStr, done, dayLabel: DAY_LABELS[d.getDay()] };
  });

  return (
    <View style={styles.weekGrid}>
      {days.map((d) => (
        <View key={d.dateStr} style={styles.dayCol}>
          <Text style={styles.dayLabel}>{d.dayLabel}</Text>
          <View
            style={[
              styles.dayDot,
              { backgroundColor: d.done ? color : '#E5E7EB' },
            ]}
          />
        </View>
      ))}
    </View>
  );
}

export default function StatsScreen() {
  const { habits, completions } = useHabits();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Stats</Text>
      </View>

      {habits.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📊</Text>
          <Text style={styles.emptyText}>Add habits to see your stats</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {habits.map((habit) => {
            const streak = getStreakCount(completions, habit.id);
            const rate7 = getCompletionRate(completions, habit.id, 7);
            const rate30 = getCompletionRate(completions, habit.id, 30);

            return (
              <View key={habit.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.habitEmoji}>{habit.emoji}</Text>
                  <Text style={styles.habitName}>{habit.name}</Text>
                </View>

                <WeekGrid habitId={habit.id} color={habit.color} />

                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Text style={[styles.statValue, { color: habit.color }]}>
                      {streak}
                    </Text>
                    <Text style={styles.statLabel}>day streak</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statBox}>
                    <Text style={[styles.statValue, { color: habit.color }]}>
                      {rate7}%
                    </Text>
                    <Text style={styles.statLabel}>last 7 days</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statBox}>
                    <Text style={[styles.statValue, { color: habit.color }]}>
                      {rate30}%
                    </Text>
                    <Text style={styles.statLabel}>last 30 days</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  habitEmoji: {
    fontSize: 22,
    marginRight: 10,
  },
  habitName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  weekGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayCol: {
    alignItems: 'center',
    gap: 4,
  },
  dayLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  dayDot: {
    width: 28,
    height: 28,
    borderRadius: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#E5E7EB',
  },
});
