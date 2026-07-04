// Day Detail — full entry list for a selected date, with progress, add, edit,
// delete and "reset day" (with confirmation). Guards missing route params and
// empty days.

import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useApp } from "../context/AppContext";
import { safeColors, spacing } from "../theme/theme";
import {
  AppText,
  NestCard,
  PaperCard,
  PrimaryButton,
  SoftButton,
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
  goalReached,
} from "../utils/waterUtils";
import { todayString, formatDisplayDate } from "../utils/dateUtils";

export default function DayDetailScreen({ navigation, route }) {
  const { theme, entries, dailyGoalMl, deleteEntry, resetDay } = useApp();
  const c = safeColors(theme);

  const params = route?.params ?? {};
  const date =
    typeof params?.date === "string" && params.date ? params.date : todayString();

  const dayEntries = entriesForDate(entries, date);
  const sorted = [...dayEntries].sort((a, b) =>
    String(a?.time) < String(b?.time) ? -1 : 1
  );
  const total = totalForDate(entries, date);
  const ratio = progressRatio(total, dailyGoalMl);
  const percent = progressPercent(total, dailyGoalMl);
  const reached = goalReached(total, dailyGoalMl);

  const notes = sorted
    .filter((e) => e && typeof e.note === "string" && e.note.trim())
    .map((e) => e.note.trim());

  const onDeleteEntry = (id) => {
    Alert.alert(
      "Delete entry?",
      "This will remove this water entry.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteEntry(id),
        },
      ],
      { cancelable: true }
    );
  };

  const onResetDay = () => {
    Alert.alert(
      "Reset this day?",
      "This will remove all water entries for the selected day.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset day",
          style: "destructive",
          onPress: () => resetDay(date),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <NestCard theme={theme}>
          <AppText theme={theme} soft size={13} weight="600">
            {formatDisplayDate(date)}
          </AppText>
          <View style={{ flexDirection: "row", alignItems: "flex-end", marginTop: spacing.sm }}>
            <AppText theme={theme} size={32} weight="800">
              {formatMlPlain(total)}
            </AppText>
            <AppText theme={theme} soft size={16} style={{ marginBottom: 5, marginLeft: 6 }}>
              / {formatMlPlain(dailyGoalMl)} ml
            </AppText>
          </View>
          <AppText theme={theme} soft size={14} style={{ marginTop: 2 }}>
            {percent}% of goal · {progressSummary(total, dailyGoalMl)}
          </AppText>
          <View style={{ marginTop: spacing.md }}>
            <WaterStrip theme={theme} ratio={ratio} />
          </View>
          {reached ? (
            <AppText theme={theme} size={13} weight="700" style={{ marginTop: spacing.sm, color: c.success }}>
              Goal reached for this day
            </AppText>
          ) : null}
        </NestCard>

        <PrimaryButton
          theme={theme}
          label="Add water for this day"
          onPress={() => navigation.navigate("AddEditEntry", { mode: "add", date })}
          style={{ marginTop: spacing.lg }}
        />

        <AppText theme={theme} soft size={13} weight="700" style={styles.sectionLabel}>
          ENTRIES
        </AppText>

        <PaperCard theme={theme}>
          {sorted.length === 0 ? (
            <View style={{ paddingVertical: spacing.sm }}>
              <AppText theme={theme} size={15} weight="600">
                No water added for this day.
              </AppText>
              <AppText theme={theme} soft size={14} style={{ marginTop: 4 }}>
                Add a glass when you want to log one.
              </AppText>
            </View>
          ) : (
            sorted.map((e, idx) => (
              <View key={e?.id ?? idx}>
                {idx > 0 ? <Divider theme={theme} /> : null}
                <View style={styles.entryRow}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={{ flex: 1 }}
                    onPress={() =>
                      navigation.navigate("AddEditEntry", {
                        mode: "edit",
                        entryId: e?.id,
                      })
                    }
                  >
                    <AppText theme={theme} size={16} weight="700">
                      {formatMlPlain(e?.amountMl)} ml
                    </AppText>
                    <AppText theme={theme} soft size={13} style={{ marginTop: 2 }}>
                      {(e?.time || "--")}
                      {e?.glassLabel ? `  ·  ${e.glassLabel}` : ""}
                    </AppText>
                    {e?.note ? (
                      <AppText theme={theme} soft size={13} style={{ marginTop: 3 }}>
                        {e.note}
                      </AppText>
                    ) : null}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => onDeleteEntry(e?.id)}
                    activeOpacity={0.8}
                    style={[styles.delBtn, { borderColor: c.danger }]}
                  >
                    <AppText theme={theme} size={13} weight="700" style={{ color: c.danger }}>
                      Delete
                    </AppText>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </PaperCard>

        {notes.length > 0 ? (
          <>
            <AppText theme={theme} soft size={13} weight="700" style={styles.sectionLabel}>
              DAILY NOTES
            </AppText>
            <PaperCard theme={theme}>
              {notes.map((n, i) => (
                <View key={i}>
                  {i > 0 ? <Divider theme={theme} /> : null}
                  <AppText theme={theme} size={14} style={{ paddingVertical: 4 }}>
                    “{n}”
                  </AppText>
                </View>
              ))}
            </PaperCard>
          </>
        ) : null}

        <SoftButton
          theme={theme}
          label="Reset this day"
          tone="danger"
          onPress={onResetDay}
          style={{ marginTop: spacing.xl }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  sectionLabel: {
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    letterSpacing: 1,
  },
  entryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  delBtn: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: spacing.md,
  },
});
