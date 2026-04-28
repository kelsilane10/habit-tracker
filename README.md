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
- [EAS CLI](https://docs.expo.dev/eas/): `npm install -g eas-cli`
- An [Expo account](https://expo.dev/signup) (free)

## Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/kelsilane10/habit-tracker.git
   cd habit-tracker
   ```

2. **Install dependencies**
   ```bash
   yarn
   ```

3. **Log in to Expo**
   ```bash
   eas login
   ```

4. **Install the development build on your device** _(first time only)_
   ```bash
   eas build --profile development --platform ios
   # or --platform android
   ```
   When the build finishes, scan the QR code from the EAS dashboard to install the app on your device.

5. **Start the dev server**
   ```bash
   npx expo start --dev-client
   ```
   Then open on your target platform:
   - **Physical device:** Open the installed development build and it connects automatically
   - **iOS Simulator:** Press `i` in the terminal (requires Xcode)
   - **Android Emulator:** Press `a` in the terminal (requires Android Studio)
   - **Web browser:** Press `w` in the terminal, or run `yarn web`

## Building

### Development builds

A development build is a custom version of the app that includes the dev tools. You need to rebuild when:

- Adding or removing a package with native code (e.g. a new Expo SDK package)
- Upgrading the Expo SDK version

For day-to-day development, just run `npx expo start --dev-client` — no rebuild needed.

```bash
# iOS
eas build --profile development --platform ios

# Android
eas build --profile development --platform android

# Both platforms
eas build --profile development --platform all
```

### Preview builds

Internal distribution builds for testing with stakeholders (no App Store/Play Store required):

```bash
eas build --profile preview --platform all
```

### Production builds

Builds intended for App Store / Play Store submission:

```bash
eas build --profile production --platform all
eas submit --platform ios   # submit to App Store
eas submit --platform android  # submit to Play Store
```

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
- [Expo Dev Client](https://docs.expo.dev/develop/development-builds/introduction/) — custom development build
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) — local persistence
- [Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/) — haptic feedback
