// Goal Settings — edit the daily water goal or reset to the default (2000 ml).

import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useApp } from "../context/AppContext";
import { safeColors, spacing } from "../theme/theme";
import {
  AppText,
  NestCard,
  PaperCard,
  Field,
  PrimaryButton,
  SoftButton,
} from "../components/ui";
import { DEFAULT_GOAL_ML, MAX_GOAL_ML } from "../storage/defaults";

export default function GoalSettingsScreen({ navigation }) {
  const { theme, dailyGoalMl, setDailyGoal, resetGoal } = useApp();
  const c = safeColors(theme);

  const [goal, setGoal] = useState(String(dailyGoalMl || DEFAULT_GOAL_ML));
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const validate = () => {
    const n = Number(goal);
    if (!Number.isFinite(n) || n <= 0) return "Goal must be greater than 0 ml.";
    if (n > MAX_GOAL_ML) return `Goal should not exceed ${MAX_GOAL_ML} ml.`;
    return "";
  };

  const onSave = () => {
    const message = validate();
    if (message) {
      setError(message);
      setSaved(false);
      return;
    }
    setDailyGoal(Number(goal));
    setSaved(true);
    setError("");
  };

  const onReset = () => {
    resetGoal();
    setGoal(String(DEFAULT_GOAL_ML));
    setSaved(true);
    setError("");
  };

  const presets = [1500, 2000, 2500, 3000];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <NestCard theme={theme}>
          <AppText theme={theme} soft size={13} weight="600">
            CURRENT DAILY GOAL
          </AppText>
          <AppText theme={theme} size={30} weight="800" style={{ marginTop: 6 }}>
            {Number(dailyGoalMl || DEFAULT_GOAL_ML).toLocaleString("en-US")} ml
          </AppText>
        </NestCard>

        <View style={styles.presetRow}>
          {presets.map((p) => (
            <SoftButton
              key={p}
              theme={theme}
              label={`${p}`}
              onPress={() => {
                setGoal(String(p));
                setError("");
                setSaved(false);
              }}
              style={styles.preset}
            />
          ))}
        </View>

        <NestCard theme={theme} style={{ marginTop: spacing.md }}>
          <Field
            theme={theme}
            label="Daily goal (ml)"
            value={goal}
            onChangeText={(v) => {
              setError("");
              setSaved(false);
              setGoal(v.replace(/[^0-9]/g, ""));
            }}
            placeholder="2000"
            keyboardType="number-pad"
            maxLength={5}
          />
          {error ? (
            <AppText theme={theme} size={14} style={{ color: c.danger, marginBottom: spacing.sm }}>
              {error}
            </AppText>
          ) : null}
          {saved && !error ? (
            <AppText theme={theme} size={14} style={{ color: c.success, marginBottom: spacing.sm }}>
              Goal saved.
            </AppText>
          ) : null}
          <PrimaryButton theme={theme} label="Save goal" onPress={onSave} />
          <SoftButton
            theme={theme}
            label="Reset to default (2000 ml)"
            onPress={onReset}
            style={{ marginTop: spacing.sm }}
          />
        </NestCard>

        <PaperCard theme={theme} style={{ marginTop: spacing.lg }}>
          <AppText theme={theme} soft size={13} style={{ lineHeight: 19 }}>
            Your goal is a gentle target for your daily routine, not a medical
            recommendation. Pick whatever feels comfortable for you.
          </AppText>
        </PaperCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  presetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
  preset: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
  },
});
