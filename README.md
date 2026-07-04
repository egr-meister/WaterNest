# WaterNest

A calm, offline, home-style water journal for Android, built with React Native and Expo.

## 1. Project description

WaterNest is a cozy daily water journal that lives entirely on your device. You set a gentle daily goal, add glasses of water by hand, and keep a simple private history. It is designed to feel like a quiet home water corner rather than a dashboard, a tracker, or an analytics tool.

## 2. Neutral lifestyle positioning

WaterNest is a neutral lifestyle water journal. It is a personal log and a gentle daily routine — a simple water habit kept as a calm, private offline journal. It is **not** a sports app, a fitness app, or a medical app. Language throughout the app stays lifestyle-first: daily water journal, gentle daily routine, personal log, simple water habit, calm tracking, private offline journal.

## 3. Features

- Set and edit a daily water goal (default 2000 ml).
- Keep a simple daily water journal with manual entries.
- Quick-add cozy glass sizes, or enter a custom amount.
- Edit and delete entries; reset a whole day with confirmation.
- Customize glass sizes (add, edit, delete, reset defaults).
- Gentle in-app reminder cards (never phone notifications).
- Browse local history as quiet journal pages.
- View simple, calm statistics.
- Switch between light and dark themes.
- A privacy screen with a clear privacy summary and a "hide amounts on home screen" option.
- Everything stored locally with AsyncStorage.

## 4. Manual tracking disclaimer

**WaterNest is a manual water journal. It does not detect drinking automatically and does not connect to Health Connect, Google Fit, sensors, or wearable devices.** Water entries are added manually. This note appears in onboarding, in Settings, and on the Privacy screen inside the app.

## 5. Offline-first

WaterNest is fully offline. It never contacts a server, never syncs, and works completely in airplane mode. There is no backend, no Firebase, and no external API.

## 6. No internet / no permissions

The app does not request any runtime permissions and does not require the `INTERNET` permission. The Android manifest deliberately blocks `INTERNET`. There is no location, camera, microphone, contacts, storage, files, notifications, calendar, alarms, activity recognition, body sensors, or biometric access.

## 7. No sensors

WaterNest does not read any device sensors. Nothing is measured or detected automatically.

## 8. No Google Fit

WaterNest does not integrate with Google Fit and includes no Google Fit SDK.

## 9. No Health Connect

WaterNest does not integrate with Health Connect and includes no Health Connect SDK.

## 10. No wearable integration

WaterNest does not connect to smartwatches or any wearable devices.

## 11. No automatic water detection

WaterNest never detects drinking automatically. Every glass is added by you, manually.

## 12. Non-medical disclaimer

WaterNest is not a medical, diagnostic, or treatment app. It does not provide medical advice, does not diagnose dehydration, and makes no health claims. Your daily goal is a gentle personal target, not a medical recommendation.

## 13. Non-sport positioning

WaterNest is not a sports or fitness-performance app. It makes no athletic-performance claims and uses no competitive mechanics, leaderboards, scores, coins, prizes, or real-money rewards.

## 14. In-app reminders

Reminders are gentle cards shown **only while the app is open**. When the app opens, it checks today's progress and the current time and may show a calm, non-urgent prompt, for example:

- Morning: "Your water journal is still empty today." (empty journal after 11:00)
- Afternoon: "You can add any drinks you remember." (below 50% after 16:00)
- Evening: "Add any glasses you missed today." (goal not reached in the evening)

You can turn reminders (and each time-of-day note) on or off in Reminder Settings.

## 15. No notification permission

**WaterNest uses in-app reminder cards only. It does not send system notifications.** It does not request notification permission, does not use `expo-notifications`, does not use background tasks, alarms, or the calendar.

## 16. Privacy screen

The Privacy screen is a trust card that clearly explains how WaterNest handles your data: local-only storage, no account, no ads, no analytics, no internet, no sensors, no Health Connect, no Google Fit, no wearables, no notifications, and no cloud sync. It also offers a "Reset local data" action. It is a privacy **summary**, not a secure vault — there are no biometric locks, PINs, or encryption claims.

## 17. Hide amounts setting

The Privacy screen includes an optional "Hide amounts on home screen" toggle. When enabled, the home screen softly hides your totals and shows "Amounts hidden". You can tap "Show" to reveal them temporarily. Your data stays local and unchanged.

## 18. Light / dark theme

WaterNest supports a warm Light theme and a deep-navy Dark theme. Your choice is saved locally and persists after restart. All screens stay readable in both modes via a single central theme object with safe color fallbacks.

## 19. Airplane mode support

Because there is no networking of any kind, the app launches and works fully in airplane mode.

## 20. Local storage

All data is stored with `@react-native-async-storage/async-storage` under a single key. Loaded data is always merged with safe defaults, so the app never crashes on empty, missing, or corrupted data.

## 21. Daily goal

Set a daily goal (default 2000 ml). Progress is `dailyTotalMl / dailyGoalMl`, shown capped at 100% while still displaying your real total. The goal must be greater than 0 and no more than 10000 ml; invalid values show friendly validation text.

## 22. Daily water journal

Each entry stores an id, date, time, amount in ml, glass label, note, and created/updated timestamps. You can add water for today or a previous date, use quick glass buttons, enter a custom amount, edit an entry, delete an entry, and reset a selected day after confirmation.

## 23. Glass size settings

Default glasses are Small glass (150 ml), Regular glass (250 ml), and Bottle (500 ml). You can add custom sizes, edit any size, delete custom sizes, and reset defaults. Labels must not be empty and amounts must be between 1 and 5000 ml.

## 24. History

History shows daily summaries in reverse chronological order as quiet journal pages: date, total ml, goal-reached indicator, entry count, and a note preview. Open any day to edit, delete, or reset it. History is fully local.

## 25. Statistics

Statistics is a calm home summary: today's total, 7-day and 30-day totals, 7-day daily average, best day, goal days in the last 7 and 30 days, total entries, and a soft weekly mini-row with small bars. No heavy chart library and no sports-analytics language.

## 26. App icon concept

The custom icon is a rounded square on a warm cream / soft aqua background with a small water drop resting inside a nest-like rounded bowl and a tiny privacy shield mark — a cozy lifestyle look, readable at small sizes, with no medical symbols. See `assets/icon.png` and `assets/adaptive-icon.png`.

## 27. Splash screen concept

The custom splash centers a water drop inside a soft nest/bowl shape above the name "WaterNest" on a warm cream background — a calm, private water-journal feeling with no heavy image assets. See `assets/splash.png`.

## 28. Visual style concept

"WaterNest Cozy Lifestyle Journal" — cozy, calm, neutral, private, soft, home-like. Light theme uses warm cream, soft aqua panels, deep blue-gray text, muted teal progress, pale sand note cards, and clay beige dividers. Dark theme uses deep navy, dark slate panels, soft aqua accents, and warm gray text. No hospital, fitness-competition, casino, neon, 3D, photo-background, or mascot styling.

## 29. Cozy Water Nest layout uniqueness

The home screen is intentionally not a generic template. It uses a compact header (title + settings), a soft "nest" daily panel with a gentle horizontal water strip (not a sports ring), a horizontal row of cozy glass chips, a small paper-note journal preview, a gentle reminder card when relevant, and a quiet three-item shortcut row (Privacy / History / Stats). There is no mascot-centered header, no big vertical stack of identical buttons, and no spreadsheet-style logbook as the primary UI.

## 30. Scaffold with the Expo template

This project targets the current Expo SDK (SDK 53 / React Native 0.79). To recreate the scaffold from scratch:

```bash
npx create-expo-app waternest
```

Then copy the `App.js`, `src/`, `assets/`, `app.json`, and workflow files from this repository over the scaffold.

## 31. Install dependencies through `npx expo install`

Always install packages through Expo so versions stay compatible. Do not hand-edit versions.

```bash
# Local storage
npx expo install @react-native-async-storage/async-storage

# Navigation
npx expo install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context

# Expo core modules as direct dependencies
npx expo install expo-asset expo-constants expo-font expo-modules-core expo-status-bar
```

Every imported package is a direct dependency in `package.json`; nothing relies on transitive dependencies.

## 32. Run locally

```bash
npm install
npx expo install --fix
npx expo start
```

Press `a` to open on an Android emulator or scan the QR code with a development build. For a production-like check, build and install a release APK (see below).

## 33. Build Android

WaterNest uses the standard Expo prebuild + Gradle flow.

```bash
# Generate the native android/ project
npx expo prebuild --platform android --no-install

# Build a release APK
cd android
./gradlew assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk

# Build a release AAB (for Google Play)
./gradlew bundleRelease
# Output: android/app/build/outputs/bundle/release/app-release.aab
```

## 34. Generate a PKCS12 keystore

Create a release keystore locally (keep it out of the repository):

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore waternest-release-key.p12 -alias waternest_key -keyalg RSA -keysize 2048 -validity 10000
```

Use the **same password** for the keystore and the key (PKCS12). Then base64-encode it for CI:

```bash
base64 -i waternest-release-key.p12 -o waternest-release-key.txt   # macOS
# or
base64 -w 0 waternest-release-key.p12 > waternest-release-key.txt  # Linux
```

## 35. Add GitHub Secrets

In your repository, go to **Settings → Secrets and variables → Actions** and add:

```text
ANDROID_KEYSTORE_BASE64   # contents of waternest-release-key.txt
ANDROID_KEYSTORE_PASSWORD # keystore password
ANDROID_KEY_ALIAS         # waternest_key
ANDROID_KEY_PASSWORD      # same as keystore password
```

Never commit the keystore or passwords. `.gitignore` already excludes `*.p12`, `*.keystore`, and `*.jks`.

## 36. GitHub Actions

`.github/workflows/android-build.yml` runs on every push to `main` (and manual dispatch). It:

1. Checks out the repository.
2. Installs Node.js and JDK 17.
3. Installs the Android SDK, Platform 35, and Build Tools 35.0.0.
4. Runs `npm install`, then `npx expo install --fix`.
5. Runs `npx expo-doctor` and `npx expo install --check`.
6. Runs `npx expo prebuild` to generate the native project.
7. Decodes the keystore from secrets and configures release signing.
8. Builds a signed release APK and a signed release AAB.
9. Uploads both as workflow artifacts.

CI is responsible for a fast, stable signed build only. There is no mandatory emulator smoke-test on the free runners.

## 37. Google Play compatibility

The app targets Android API 35 (`compileSdkVersion 35`, `targetSdkVersion 35`), so it avoids Google Play's "target API 34" rejection. It ships no ads, analytics, payment, Firebase, Google Fit, Health Connect, sensor, wearable, notification, background-task, or biometric SDKs, keeping the store listing simple and permission-free.

## 38. Android API 35 notes

`app.json` sets `compileSdkVersion` and `targetSdkVersion` to 35. `minSdkVersion` follows the React Native 0.79 default (24 or higher). Use a current Expo SDK / React Native version that supports Android API 35.

## 39. 16 KB page size compatibility

The final AAB supports Android 15+/16 KB memory page sizes because the app uses only current Expo/React Native native libraries and adds no old or unnecessary native SDKs. Building with Build Tools 35.0.0 and the current Android Gradle Plugin produces 16 KB-aligned native libraries.

## 40. Release optimization

Verify a non-minified release first:

```gradle
minifyEnabled false
shrinkResources false
```

Then enable standard Android R8/Proguard optimization:

```gradle
minifyEnabled true
shrinkResources true
proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
```

Re-test the launch after enabling minify/shrink. Only the standard R8/Proguard toolchain is used — no risky third-party obfuscation. Obfuscation here is a normal release optimization, not a way to bypass any review.

## 41. Local launch verification checklist

A green CI build is not proof that the app launches. Before release, build a release APK, install it on a physical device or emulator, and capture logs:

```bash
adb install app-release.apk
adb logcat
```

Confirm there are no errors such as: "Cannot find native module", "Module has not been registered", Invariant Violation, `theme.fonts.regular is undefined`, AsyncStorage JSON parse crash, missing route params crash, invalid date crash, invalid number crash, privacy settings undefined crash, or theme color undefined crash.

Then walk through: first launch with empty storage; add a water entry; edit it; delete it; reset the selected day; add a custom glass size; change the daily goal; check in-app reminders; open the privacy screen; enable "hide amounts on home screen"; reveal hidden amounts temporarily; switch to light theme; switch to dark theme; view history; view statistics; reset all local data; relaunch; launch in airplane mode; and confirm no sensor, Google Fit, Health Connect, wearable, notification, internet, biometric, or storage permission is requested.

## 42. Privacy note

WaterNest stores water entries, goals, glass sizes, reminders, theme, and privacy settings only on this device. There is no account, no ads, no analytics, no internet connection, no sensors, no Google Fit, no Health Connect, and no notification permission. Your water journal stays private, on your phone.
