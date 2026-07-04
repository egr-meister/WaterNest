// History — quiet journal pages: daily summaries in reverse chronological
// order. Each card shows date, total, goal-reached indicator, entry count and
// a note preview, and opens the Day Detail screen.

import React from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useApp } from "../context/AppContext";
import { safeColors, spacing, radius } from "../theme/theme";
import { AppText, PaperCard, WaterStrip } from "../components/ui";
import {
  historyDates,
  entriesForDate,
  totalForDate,
  progressRatio,
  goalReached,
  formatMlPlain,
} from "../utils/waterUtils";
import { formatDisplayDate, relativeLabel } from "../utils/dateUtils";

export default function HistoryScreen({ navigation }) {
  const { theme, entries, dailyGoalMl } = useApp();
  const c = safeColors(theme);

  const dates = historyDates(entries);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppText theme={theme} size={20} weight="800">
          Your journal pages
        </AppText>
        <AppText theme={theme} soft size={14} style={{ marginTop: 4, marginBottom: spacing.lg }}>
          A calm look back at your water days. Everything stays on this device.
        </AppText>

        {dates.length === 0 ? (
          <PaperCard theme={theme}>
            <AppText theme={theme} size={15} weight="600">
              No water history yet.
            </AppText>
            <AppText theme={theme} soft size={14} style={{ marginTop: 4 }}>
              Add a glass on the home screen to start your journal.
            </AppText>
          </PaperCard>
        ) : (
          dates.map((date) => {
            const dayEntries = entriesForDate(entries, date);
            const total = totalForDate(entries, date);
            const ratio = progressRatio(total, dailyGoalMl);
            const reached = goalReached(total, dailyGoalMl);
            const firstNote = dayEntries.find(
              (e) => e && typeof e.note === "string" && e.note.trim()
            );

            return (
              <TouchableOpacity
                key={date}
                activeOpacity={0.85}
                onPress={() => navigation.navigate("DayDetail", { date })}
                style={{ marginBottom: spacing.md }}
              >
                <PaperCard theme={theme}>
                  <View style={styles.cardTop}>
                    <View style={{ flex: 1 }}>
                      <AppText theme={theme} size={16} weight="700">
                        {relativeLabel(date)}
                      </AppText>
                      <AppText theme={theme} soft size={12} style={{ marginTop: 1 }}>
                        {formatDisplayDate(date)}
                      </AppText>
                    </View>
                    <View
                      style={[
                        styles.badge,
                        {
                          backgroundColor: reached ? c.accentSoft : c.waterTrack,
                          borderColor: reached ? c.accent : c.border,
                        },
                      ]}
                    >
                      <AppText
                        theme={theme}
                        size={11}
                        weight="700"
                        style={{ color: reached ? c.accent : c.textSoft }}
                      >
                        {reached ? "Goal reached" : "In progress"}
                      </AppText>
                    </View>
                  </View>

                  <View style={{ marginTop: spacing.sm }}>
                    <WaterStrip theme={theme} ratio={ratio} />
                  </View>

                  <View style={styles.cardBottom}>
                    <AppText theme={theme} size={14} weight="600">
                      {formatMlPlain(total)} ml
                    </AppText>
                    <AppText theme={theme} soft size={13}>
                      {dayEntries.length}{" "}
                      {dayEntries.length === 1 ? "entry" : "entries"}
                    </AppText>
                  </View>

                  {firstNote ? (
                    <AppText theme={theme} soft size={13} numberOfLines={1} style={{ marginTop: 6 }}>
                      “{firstNote.note.trim()}”
                    </AppText>
                  ) : null}
                </PaperCard>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.sm,
  },
});
