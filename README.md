# Habit Tracker

A mobile habit tracking app built with Expo and React Native. Track your daily habits, view streaks, and monitor your completion rates over time.

## Features

- Add habits with a custom emoji and color
- Mark habits complete each day with haptic feedback
- Track streaks and see your 7-day history at a glance
- View 7-day and 30-day completion rates
- Data persists locally on device via AsyncStorage

## Prerequisites

- [Node.js](https://nodejs.org) (v18 or later)
- [Expo Go](https://expo.dev/go) app installed on your phone, or an iOS/Android simulator

## Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/kelsilane10/habit-tracker.git
   cd habit-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the dev server**
   ```bash
   npx expo start
   ```

4. **Open on your device**
   - **Physical device:** Scan the QR code in the terminal with the Expo Go app
   - **iOS Simulator:** Press `i` in the terminal (requires Xcode)
   - **Android Emulator:** Press `a` in the terminal (requires Android Studio)

## Project Structure

```
app/                  # Expo Router screens
├── _layout.tsx       # Root layout with providers
├── add-habit.tsx     # Modal to create a new habit
└── (tabs)/
    ├── index.tsx     # Today screen
    └── stats.tsx     # Stats screen
src/
├── components/       # Reusable UI components
├── store/            # State management and AsyncStorage
└── types/            # TypeScript types
```

## Tech Stack

- [Expo](https://expo.dev) / React Native
- [Expo Router](https://expo.github.io/router) — file-based navigation
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) — local persistence
- [Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/) — haptic feedback
