// WaterNest — a calm offline home-style water tracker.
// Root component: sets up navigation, theme and the app-wide data provider.

import React from "react";
import { ActivityIndicator, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AppProvider, useApp } from "./src/context/AppContext";
import { safeColors } from "./src/theme/theme";

import OnboardingScreen from "./src/screens/OnboardingScreen";
import HomeScreen from "./src/screens/HomeScreen";
import AddEditEntryScreen from "./src/screens/AddEditEntryScreen";
import DayDetailScreen from "./src/screens/DayDetailScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import StatisticsScreen from "./src/screens/StatisticsScreen";
import GlassSettingsScreen from "./src/screens/GlassSettingsScreen";
import ReminderSettingsScreen from "./src/screens/ReminderSettingsScreen";
import ThemeSettingsScreen from "./src/screens/ThemeSettingsScreen";
import GoalSettingsScreen from "./src/screens/GoalSettingsScreen";
import PrivacyScreen from "./src/screens/PrivacyScreen";
import SettingsScreen from "./src/screens/SettingsScreen";

const Stack = createNativeStackNavigator();

// Build a navigation theme by EXTENDING the built-in themes (never from
// scratch), so required fields like theme.fonts.regular are always present.
function buildNavTheme(appTheme) {
  const base = appTheme?.mode === "dark" ? DarkTheme : DefaultTheme;
  const c = safeColors(appTheme);
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: c.accent,
      background: c.background,
      card: c.panel,
      text: c.text,
      border: c.border,
      notification: c.accent,
    },
    // Preserve base.fonts to avoid "theme.fonts.regular is undefined" crashes.
    fonts: base.fonts,
  };
}

function RootNavigator() {
  const { ready, settings, theme } = useApp();
  const c = safeColors(theme);

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: c.background,
        }}
      >
        <ActivityIndicator color={c.accent} size="large" />
      </View>
    );
  }

  const navTheme = buildNavTheme(theme);
  const onboardingDone = Boolean(settings?.onboardingCompleted);

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={theme?.mode === "dark" ? "light" : "dark"} />
      <Stack.Navigator
        initialRouteName={onboardingDone ? "Home" : "Onboarding"}
        screenOptions={{
          headerStyle: { backgroundColor: c.panel },
          headerTintColor: c.text,
          headerTitleStyle: { fontWeight: "700", color: c.text },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: c.background },
        }}
      >
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddEditEntry"
          component={AddEditEntryScreen}
          options={{ title: "Water Entry" }}
        />
        <Stack.Screen
          name="DayDetail"
          component={DayDetailScreen}
          options={{ title: "Day Detail" }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{ title: "History" }}
        />
        <Stack.Screen
          name="Statistics"
          component={StatisticsScreen}
          options={{ title: "Statistics" }}
        />
        <Stack.Screen
          name="GlassSettings"
          component={GlassSettingsScreen}
          options={{ title: "Glass Sizes" }}
        />
        <Stack.Screen
          name="ReminderSettings"
          component={ReminderSettingsScreen}
          options={{ title: "Reminders" }}
        />
        <Stack.Screen
          name="ThemeSettings"
          component={ThemeSettingsScreen}
          options={{ title: "Theme" }}
        />
        <Stack.Screen
          name="GoalSettings"
          component={GoalSettingsScreen}
          options={{ title: "Daily Goal" }}
        />
        <Stack.Screen
          name="Privacy"
          component={PrivacyScreen}
          options={{ title: "Privacy" }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: "Settings" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <RootNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}
