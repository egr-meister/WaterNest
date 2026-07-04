// Settings — the calm control center. Shortcuts to every settings area plus
// compact mode, onboarding replay, day reset, data deletion and app info.

import React from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useApp } from "../context/AppContext";
import { safeColors, spacing } from "../theme/theme";
import {
  AppText,
  NestCard,
  PaperCard,
  LinkRow,
  ToggleRow,
  SectionTitle,
} from "../components/ui";
import { todayString } from "../utils/dateUtils";

export default function SettingsScreen({ navigation }) {
  const {
    theme,
    themeMode,
    dailyGoalMl,
    compactMode,
    setCompactMode,
    showOnboardingAgain,
    deleteAllEntries,
    resetAllData,
    resetDay,
  } = useApp();
  const c = safeColors(theme);

  const onShowOnboarding = () => {
    showOnboardingAgain();
    navigation.reset({ index: 0, routes: [{ name: "Onboarding" }] });
  };

  const onResetToday = () => {
    Alert.alert(
      "Reset today?",
      "This will remove all water entries for today.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset today",
          style: "destructive",
          onPress: () => resetDay(todayString()),
        },
      ],
      { cancelable: true }
    );
  };

  const onDeleteRecords = () => {
    Alert.alert(
      "Delete all water records?",
      "This removes every water entry from every day. Glass sizes, goal, theme and other settings are kept.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete records",
          style: "destructive",
          onPress: () => deleteAllEntries(),
        },
      ],
      { cancelable: true }
    );
  };

  const onResetAll = () => {
    Alert.alert(
      "Reset all local data?",
      "This removes all water entries and restores default glass sizes, goal, reminders, theme and privacy settings.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset everything",
          style: "destructive",
          onPress: async () => {
            await resetAllData();
            navigation.reset({ index: 0, routes: [{ name: "Onboarding" }] });
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionTitle theme={theme} style={{ marginTop: 0 }}>
          Your routine
        </SectionTitle>
        <NestCard theme={theme} style={styles.group}>
          <LinkRow
            theme={theme}
            label="Daily goal"
            value={`${Number(dailyGoalMl || 2000).toLocaleString("en-US")} ml`}
            onPress={() => navigation.navigate("GoalSettings")}
          />
          <LinkRow
            theme={theme}
            label="Glass sizes"
            onPress={() => navigation.navigate("GlassSettings")}
          />
          <LinkRow
            theme={theme}
            label="Reminders"
            onPress={() => navigation.navigate("ReminderSettings")}
          />
          <View style={{ borderBottomWidth: 0 }}>
            <ToggleRow
              theme={theme}
              label="Compact mode"
              description="Use a slightly tighter, quieter layout."
              value={compactMode}
              onValueChange={(v) => setCompactMode(v)}
            />
          </View>
        </NestCard>

        <SectionTitle theme={theme}>Appearance & privacy</SectionTitle>
        <NestCard theme={theme} style={styles.group}>
          <LinkRow
            theme={theme}
            label="Theme"
            value={themeMode === "dark" ? "Dark" : "Light"}
            onPress={() => navigation.navigate("ThemeSettings")}
          />
          <LinkRow
            theme={theme}
            label="Privacy screen"
            onPress={() => navigation.navigate("Privacy")}
          />
        </NestCard>

        <SectionTitle theme={theme}>Data</SectionTitle>
        <NestCard theme={theme} style={styles.group}>
          <LinkRow
            theme={theme}
            label="Show onboarding again"
            onPress={onShowOnboarding}
          />
          <LinkRow
            theme={theme}
            label="Reset today"
            tone="danger"
            onPress={onResetToday}
          />
          <LinkRow
            theme={theme}
            label="Delete all water records"
            tone="danger"
            onPress={onDeleteRecords}
          />
          <LinkRow
            theme={theme}
            label="Reset all local data"
            tone="danger"
            onPress={onResetAll}
          />
        </NestCard>

        <SectionTitle theme={theme}>About</SectionTitle>
        <PaperCard theme={theme}>
          <AppText theme={theme} size={15} weight="700">
            WaterNest
          </AppText>
          <AppText theme={theme} soft size={13} style={{ marginTop: 2 }}>
            A calm, private, offline water journal. Version 1.0.0.
          </AppText>
          <AppText theme={theme} size={13} soft style={styles.para}>
            Water entries are added manually. WaterNest is a manual water
            journal. It does not detect drinking automatically and does not
            connect to Health Connect, Google Fit, sensors, or wearable devices.
          </AppText>
          <AppText theme={theme} size={13} soft style={styles.para}>
            WaterNest stores water entries, goals, glass sizes, reminders, theme,
            and privacy settings only on this device. No account, no ads, no
            analytics, no internet connection, no sensors, no Google Fit, no
            Health Connect, and no notification permission.
          </AppText>
          <AppText theme={theme} size={12} soft style={styles.para}>
            WaterNest is a lifestyle journal. It is not a medical, diagnostic or
            sports-performance app.
          </AppText>
        </PaperCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  group: { paddingVertical: spacing.xs },
  para: { marginTop: spacing.sm, lineHeight: 19 },
});
