// WaterNest Home — a cozy home water corner, not a sports/medical dashboard.
// Layout: compact header (title + settings) -> soft daily nest panel with a
// gentle water strip -> cozy glass quick-add chips -> journal preview paper
// note -> gentle in-app reminder card -> quiet shortcuts row.

import React, { useState, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

import { useApp } from "../context/AppContext";
import { safeColors, spacing, radius } from "../theme/theme";
import {
  AppText,
  NestCard,
  PaperCard,
  GlassChip,
  WaterStrip,
  Divider,
} from "../components/ui";
import {
  entriesForDate,
  totalForDate,
  progressRatio,
  progressPercent,
  progressSummary,
  formatMlPlain,
} from "../utils/waterUtils";
import { getActiveReminder } from "../utils/reminders";
import { todayString, formatDisplayDate } from "../utils/dateUtils";

export default function HomeScreen({ navigation }) {
  const {
    theme,
    entries,
    glassSizes,
    dailyGoalMl,
    reminderSettings,
    privacySettings,
    quickAddGlass,
  } = useApp();
  const c = safeColors(theme);

  const today = todayString();
  const [revealAmounts, setRevealAmounts] = useState(false);

  // Reset the temporary reveal whenever we come back to Home.
  useFocusEffect(
    useCallback(() => {
      setRevealAmounts(false);
      return () => {};
    }, [])
  );

  const dayEntries = entriesForDate(entries, today);
  const total = totalForDate(entries, today);
  const ratio = progressRatio(total, dailyGoalMl);
  const percent = progressPercent(total, dailyGoalMl);
  const summary = progressSummary(total, dailyGoalMl);

  const hideAmounts = Boolean(privacySettings?.hideAmountsOnHome) && !revealAmounts;
  const reminder = getActiveReminder(total, dailyGoalMl, reminderSettings);

  const sortedEntries = [...dayEntries].sort((a, b) =>
    String(a?.time) < String(b?.time) ? 1 : -1
  );
  const previewEntries = sortedEntries.slice(0, 3);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Compact header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <AppText theme={theme} size={22} weight="800">
              WaterNest
            </AppText>
            <AppText theme={theme} soft size={13} style={{ marginTop: 2 }}>
              {formatDisplayDate(today)}
            </AppText>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("Settings")}
            style={[styles.iconBtn, { backgroundColor: c.chip, borderColor: c.border }]}
            activeOpacity={0.8}
          >
            <AppText theme={theme} size={18}>
              ⚙
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Daily nest panel */}
        <NestCard theme={theme} style={{ marginTop: spacing.lg }}>
          <View style={styles.panelTopRow}>
            <AppText theme={theme} soft size={13} weight="600">
              TODAY'S WATER
            </AppText>
            {hideAmounts ? (
              <TouchableOpacity
                onPress={() => setRevealAmounts(true)}
                activeOpacity={0.8}
                style={[styles.revealBtn, { borderColor: c.accent }]}
              >
                <AppText theme={theme} size={12} weight="700" style={{ color: c.accent }}>
                  Show
                </AppText>
              </TouchableOpacity>
            ) : null}
          </View>

          {hideAmounts ? (
            <AppText theme={theme} size={22} weight="800" style={{ marginTop: spacing.sm }}>
              Amounts hidden
            </AppText>
          ) : (
            <View style={{ marginTop: spacing.sm }}>
              <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                <AppText theme={theme} size={34} weight="800">
                  {formatMlPlain(total)}
                </AppText>
                <AppText theme={theme} soft size={16} style={{ marginBottom: 5, marginLeft: 6 }}>
                  / {formatMlPlain(dailyGoalMl)} ml
                </AppText>
              </View>
              <AppText theme={theme} soft size={14} style={{ marginTop: 2 }}>
                {percent}% of today's goal · {summary}
              </AppText>
            </View>
          )}

          <View style={{ marginTop: spacing.md }}>
            <WaterStrip theme={theme} ratio={hideAmounts ? 0 : ratio} />
          </View>

          {hideAmounts ? (
            <AppText theme={theme} soft size={13} style={{ marginTop: spacing.sm }}>
              Today's progress hidden. Your data is unchanged.
            </AppText>
          ) : null}
        </NestCard>

        {/* Cozy glass quick-add chips */}
        <AppText theme={theme} soft size={13} weight="700" style={styles.sectionLabel}>
          ADD A GLASS
        </AppText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {(glassSizes ?? []).map((g) => (
            <View key={g?.id ?? Math.random()} style={{ marginRight: spacing.sm }}>
              <GlassChip
                theme={theme}
                label={g?.label ?? "Glass"}
                amountMl={g?.amountMl ?? 0}
                onPress={() => quickAddGlass(g, today)}
              />
            </View>
          ))}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate("AddEditEntry", { mode: "add", date: today })
            }
            style={[styles.customChip, { borderColor: c.accent, backgroundColor: c.accentSoft }]}
          >
            <AppText theme={theme} size={20} weight="800" style={{ color: c.accent }}>
              +
            </AppText>
            <AppText theme={theme} size={12} weight="600" style={{ color: c.accent, marginTop: 2 }}>
              Custom
            </AppText>
          </TouchableOpacity>
        </ScrollView>

        {/* Gentle in-app reminder card */}
        {reminder ? (
          <PaperCard
            theme={theme}
            style={[styles.reminderCard, { backgroundColor: c.accentSoft, borderColor: c.accent }]}
          >
            <AppText theme={theme} size={13} weight="700" style={{ color: c.accent }}>
              A gentle note
            </AppText>
            <AppText theme={theme} size={15} style={{ marginTop: 4 }}>
              {reminder.text}
            </AppText>
          </PaperCard>
        ) : null}

        {/* Journal preview — a small paper note */}
        <View style={styles.journalHeader}>
          <AppText theme={theme} soft size={13} weight="700">
            TODAY'S JOURNAL
          </AppText>
          <TouchableOpacity
            onPress={() => navigation.navigate("DayDetail", { date: today })}
            activeOpacity={0.8}
          >
            <AppText theme={theme} size={13} weight="700" style={{ color: c.accent }}>
              Open day
            </AppText>
          </TouchableOpacity>
        </View>

        <PaperCard theme={theme}>
          {previewEntries.length === 0 ? (
            <View style={{ paddingVertical: spacing.sm }}>
              <AppText theme={theme} size={15} weight="600">
                No water added today.
              </AppText>
              <AppText theme={theme} soft size={14} style={{ marginTop: 4 }}>
                Add a glass when you want to log one.
              </AppText>
            </View>
          ) : (
            previewEntries.map((e, idx) => (
              <View key={e?.id ?? idx}>
                {idx > 0 ? <Divider theme={theme} /> : null}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate("AddEditEntry", {
                      mode: "edit",
                      entryId: e?.id,
                    })
                  }
                  style={styles.entryRow}
                >
                  <View style={[styles.entryDot, { backgroundColor: c.water }]} />
                  <View style={{ flex: 1 }}>
                    <AppText theme={theme} size={15} weight="600">
                      {hideAmounts ? "•••" : `${formatMlPlain(e?.amountMl)} ml`}
                      {e?.glassLabel ? `  ·  ${e.glassLabel}` : ""}
                    </AppText>
                    {e?.note ? (
                      <AppText theme={theme} soft size={13} numberOfLines={1} style={{ marginTop: 2 }}>
                        {e.note}
                      </AppText>
                    ) : null}
                  </View>
                  <AppText theme={theme} soft size={13}>
                    {e?.time || ""}
                  </AppText>
                </TouchableOpacity>
              </View>
            ))
          )}
          {sortedEntries.length > 3 ? (
            <TouchableOpacity
              onPress={() => navigation.navigate("DayDetail", { date: today })}
              activeOpacity={0.8}
              style={{ paddingTop: spacing.sm }}
            >
              <AppText theme={theme} size={13} weight="600" style={{ color: c.accent }}>
                +{sortedEntries.length - 3} more entries
              </AppText>
            </TouchableOpacity>
          ) : null}
        </PaperCard>

        {/* Quiet shortcuts row (nest / journal / stats labels, not big buttons) */}
        <View style={styles.shortcutRow}>
          <Shortcut
            theme={theme}
            icon="◈"
            label="Privacy"
            onPress={() => navigation.navigate("Privacy")}
          />
          <Shortcut
            theme={theme}
            icon="❏"
            label="History"
            onPress={() => navigation.navigate("History")}
          />
          <Shortcut
            theme={theme}
            icon="◔"
            label="Stats"
            onPress={() => navigation.navigate("Statistics")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Shortcut({ theme, icon, label, onPress }) {
  const c = safeColors(theme);
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.shortcut, { backgroundColor: c.panel, borderColor: c.border }]}
    >
      <AppText theme={theme} size={20} style={{ color: c.accent }}>
        {icon}
      </AppText>
      <AppText theme={theme} size={13} weight="600" style={{ marginTop: 6 }}>
        {label}
      </AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  panelTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  revealBtn: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  sectionLabel: {
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    letterSpacing: 1,
  },
  chipsRow: {
    paddingVertical: spacing.xs,
    paddingRight: spacing.md,
  },
  customChip: {
    borderRadius: radius.lg,
    borderWidth: 1.5,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
  },
  reminderCard: {
    marginTop: spacing.lg,
  },
  journalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  entryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  entryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.md,
  },
  shortcutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.xl,
  },
  shortcut: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingVertical: spacing.lg,
    alignItems: "center",
  },
});
