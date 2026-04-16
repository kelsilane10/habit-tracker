import { Stack } from 'expo-router';
import { HabitProvider } from '../src/store/HabitContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <HabitProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="add-habit"
            options={{
              presentation: 'modal',
              headerShown: true,
              title: 'New Habit',
              headerStyle: { backgroundColor: '#F9FAFB' },
              headerTitleStyle: { fontWeight: '700' },
            }}
          />
        </Stack>
      </HabitProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
