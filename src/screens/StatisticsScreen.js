// Statistics — a calm home summary. Cozy summary cards, a soft weekly mini-row
// with small bars, and neutral (non-sport) labels. No chart library.

import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useApp } from "../context/AppContext";
import { safeColors, spacing, radius } from "../theme/theme";
import { AppText, NestCard, PaperCard } from "../components/ui";
import { computeStatistics, formatMlPlain } from "../utils/waterUtils";
import { relativeLabel } from "../utils/dateUtils";

export default function StatisticsScreen() {
  const { theme, entries, dailyGoalMl } = useApp();
  const c = safeColors(theme);

  const stats = computeStatistics(entries, dailyGoalMl);

  const cards = [
    { label: "Today", value: `${formatMlPlain(stats.todayTotal)} ml` },
    { label: "7-day average", value: `${formatMlPlain(stats.average7)} ml` },
    { label: "Last 7 days", value: `${formatMlPlain(stats.total7)} ml` },
    { label: "Last 30 days", value: `${formatMlPlain(stats.total30)} ml` },
    {
      label: "Best day",
      value: stats.bestDay
        ? `${formatMlPlain(stats.bestTotal)} ml`
        : "—",
      sub: stats.bestDay ? relativeLabel(stats.bestDay) : "No data yet",
    },
    { label: "Entries this week", value: String(stats.entriesThisWeek) },
  ];

  const weekdayLetters = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppText theme={theme} size={20} weight="800">
          A calm summary
        </AppText>
        <AppText theme={theme} soft size={14} style={{ marginTop: 4, marginBottom: spacing.lg }}>
          A gentle overview of your water journal. No scores, no competition.
        </AppText>

        {/* Weekly mini-row with soft bars */}
        <NestCard theme={theme}>
          <AppText theme={theme} soft size={13} weight="700" style={{ marginBottom: spacing.md }}>
            THIS WEEK
          </AppText>
          <View style={styles.weekRow}>
            {stats.week.map((w, i) => {
              const max = Math.max(1, stats.weekMax);
              const h = Math.round((Math.max(0, w.totalMl) / max) * 90);
              // Determine weekday letter from the date string index safely.
              const parts = String(w.date).split("-");
              const wd =
                parts.length === 3
                  ? new Date(
                      Number(parts[0]),
                      Number(parts[1]) - 1,
                      Number(parts[2])
                    ).getDay()
                  : i;
              return (
                <View key={w.date ?? i} style={styles.weekCol}>
                  <View style={styles.barArea}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: Math.max(6, h),
                          backgroundColor: w.reached ? c.accent : c.water,
                        },
                      ]}
                    />
                  </View>
                  <AppText theme={theme} soft size={11} style={{ marginTop: 6 }}>
                    {weekdayLetters[wd] ?? "·"}
                  </AppText>
                </View>
              );
            })}
          </View>
        </NestCard>

        {/* Summary cards grid */}
        <View style={styles.grid}>
          {cards.map((card, i) => (
            <PaperCard key={i} theme={theme} style={styles.gridCard}>
              <AppText theme={theme} soft size={12} weight="600">
                {card.label}
              </AppText>
              <AppText theme={theme} size={20} weight="800" style={{ marginTop: 6 }}>
                {card.value}
              </AppText>
              {card.sub ? (
                <AppText theme={theme} soft size={12} style={{ marginTop: 2 }}>
                  {card.sub}
                </AppText>
              ) : null}
            </PaperCard>
          ))}
        </View>

        {/* Goal days */}
        <NestCard theme={theme} style={{ marginTop: spacing.md }}>
          <AppText theme={theme} soft size={13} weight="700" style={{ marginBottom: spacing.sm }}>
            GOAL DAYS
          </AppText>
          <View style={styles.goalRow}>
            <AppText theme={theme} size={15}>
              Last 7 days
            </AppText>
            <AppText theme={theme} size={15} weight="700">
              {stats.goalDays7} of 7
            </AppText>
          </View>
          <View style={[styles.goalRow, { marginTop: spacing.sm }]}>
            <AppText theme={theme} size={15}>
              Last 30 days
            </AppText>
            <AppText theme={theme} size={15} weight="700">
              {stats.goalDays30} of 30
            </AppText>
          </View>
          <View style={[styles.goalRow, { marginTop: spacing.sm }]}>
            <AppText theme={theme} size={15}>
              Total entries
            </AppText>
            <AppText theme={theme} size={15} weight="700">
              {stats.totalEntries}
            </AppText>
          </View>
        </NestCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  weekCol: {
    flex: 1,
    alignItems: "center",
  },
  barArea: {
    height: 96,
    justifyContent: "flex-end",
  },
  bar: {
    width: 16,
    borderRadius: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
  gridCard: {
    width: "48.5%",
    marginBottom: spacing.md,
  },
  goalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
