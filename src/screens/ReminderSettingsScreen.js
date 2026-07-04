// Reminder Settings — in-app reminder cards only. This screen makes it very
// clear that reminders never become phone notifications.

import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useApp } from "../context/AppContext";
import { safeColors, spacing } from "../theme/theme";
import { AppText, NestCard, PaperCard, ToggleRow } from "../components/ui";

export default function ReminderSettingsScreen() {
  const { theme, reminderSettings, setReminders } = useApp();
  const c = safeColors(theme);

  const r = reminderSettings ?? {};
  const enabled = r.enabled !== false;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <PaperCard theme={theme} style={{ marginBottom: spacing.lg }}>
          <AppText theme={theme} size={14} style={{ lineHeight: 20 }}>
            These are in-app reminder cards only. They do not send phone
            notifications, and they only appear while WaterNest is open.
          </AppText>
        </PaperCard>

        <NestCard theme={theme}>
          <ToggleRow
            theme={theme}
            label="Gentle reminders"
            description="Show soft reminder cards on the home screen based on today's progress and the time of day."
            value={enabled}
            onValueChange={(v) => setReminders({ enabled: v })}
          />
          <ToggleRow
            theme={theme}
            label="Morning note"
            description="If your journal is still empty after 11:00."
            value={enabled && r.morningEnabled !== false}
            onValueChange={(v) => setReminders({ morningEnabled: v })}
          />
          <ToggleRow
            theme={theme}
            label="Afternoon note"
            description="If you are below half your goal after 16:00."
            value={enabled && r.afternoonEnabled !== false}
            onValueChange={(v) => setReminders({ afternoonEnabled: v })}
          />
          <ToggleRow
            theme={theme}
            label="Evening note"
            description="In the evening if your goal is not reached yet."
            value={enabled && r.eveningEnabled !== false}
            onValueChange={(v) => setReminders({ eveningEnabled: v })}
          />
        </NestCard>

        <AppText theme={theme} soft size={13} style={{ marginTop: spacing.lg, lineHeight: 19 }}>
          WaterNest never uses notification permission, background services,
          alarms or the calendar. Reminders are calm, friendly and non-urgent.
        </AppText>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
});
