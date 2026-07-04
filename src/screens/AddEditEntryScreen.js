// Add / Edit a single water entry. Works for both new entries and editing an
// existing one (mode === "edit" with an entryId route param). All params are
// optional and guarded.

import React, { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useApp } from "../context/AppContext";
import { safeColors, spacing } from "../theme/theme";
import {
  AppText,
  Field,
  NestCard,
  PrimaryButton,
  SoftButton,
  GlassChip,
} from "../components/ui";
import {
  isValidDateString,
  isValidTimeString,
  todayString,
  currentTimeString,
} from "../utils/dateUtils";

export default function AddEditEntryScreen({ navigation, route }) {
  const {
    theme,
    entries,
    glassSizes,
    addEntry,
    updateEntry,
    deleteEntry,
    MAX_ENTRY_ML,
  } = useApp();
  const c = safeColors(theme);

  const params = route?.params ?? {};
  const isEdit = params?.mode === "edit" && typeof params?.entryId === "string";

  const existing = useMemo(() => {
    if (!isEdit) return null;
    return (entries ?? []).find((e) => e && e.id === params.entryId) ?? null;
  }, [isEdit, entries, params.entryId]);

  const initialDate =
    (existing && existing.date) ||
    (typeof params?.date === "string" && params.date) ||
    todayString();

  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(
    (existing && existing.time) || currentTimeString()
  );
  const [amount, setAmount] = useState(
    existing && existing.amountMl ? String(existing.amountMl) : ""
  );
  const [glassLabel, setGlassLabel] = useState(
    (existing && existing.glassLabel) || ""
  );
  const [note, setNote] = useState((existing && existing.note) || "");
  const [error, setError] = useState("");

  const applyGlass = (g) => {
    setAmount(String(Math.round(Number(g?.amountMl) || 0)));
    setGlassLabel(typeof g?.label === "string" ? g.label : "");
  };

  const validate = () => {
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) {
      return "Amount must be greater than 0 ml.";
    }
    if (amt > MAX_ENTRY_ML) {
      return `Amount must not exceed ${MAX_ENTRY_ML} ml.`;
    }
    if (!isValidDateString(date)) {
      return "Date must use the YYYY-MM-DD format.";
    }
    if (time && !isValidTimeString(time)) {
      return "Time must use the HH:mm format.";
    }
    return "";
  };

  const onSave = () => {
    const message = validate();
    if (message) {
      setError(message);
      return;
    }
    const payload = {
      date: date.trim(),
      time: time.trim() || currentTimeString(),
      amountMl: Math.round(Number(amount)),
      glassLabel: glassLabel.trim(),
      note: note.trim(),
    };
    if (isEdit && existing) {
      updateEntry(existing.id, payload);
    } else {
      addEntry(payload);
    }
    navigation.goBack();
  };

  const onDelete = () => {
    if (!isEdit || !existing) return;
    Alert.alert(
      "Delete entry?",
      "This will remove this water entry.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteEntry(existing.id);
            navigation.goBack();
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <AppText theme={theme} size={20} weight="800">
          {isEdit ? "Edit water entry" : "Add water"}
        </AppText>
        <AppText theme={theme} soft size={14} style={{ marginTop: 4, marginBottom: spacing.lg }}>
          Water entries are added manually.
        </AppText>

        {/* Quick glass helpers */}
        <AppText theme={theme} soft size={13} weight="700" style={{ marginBottom: spacing.sm }}>
          QUICK GLASSES
        </AppText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.lg }}>
          {(glassSizes ?? []).map((g) => (
            <View key={g?.id ?? Math.random()} style={{ marginRight: spacing.sm }}>
              <GlassChip
                theme={theme}
                label={g?.label ?? "Glass"}
                amountMl={g?.amountMl ?? 0}
                onPress={() => applyGlass(g)}
              />
            </View>
          ))}
        </ScrollView>

        <NestCard theme={theme}>
          <Field
            theme={theme}
            label="Amount (ml)"
            value={amount}
            onChangeText={(v) => {
              setError("");
              setAmount(v.replace(/[^0-9]/g, ""));
            }}
            placeholder="e.g. 250"
            keyboardType="number-pad"
            maxLength={5}
          />
          <Field
            theme={theme}
            label="Glass label (optional)"
            value={glassLabel}
            onChangeText={setGlassLabel}
            placeholder="e.g. Regular glass"
            maxLength={40}
          />
          <Field
            theme={theme}
            label="Date (YYYY-MM-DD)"
            value={date}
            onChangeText={(v) => {
              setError("");
              setDate(v.trim());
            }}
            placeholder="2026-07-03"
            maxLength={10}
          />
          <Field
            theme={theme}
            label="Time (HH:mm)"
            value={time}
            onChangeText={(v) => {
              setError("");
              setTime(v.trim());
            }}
            placeholder="08:30"
            maxLength={5}
          />
          <Field
            theme={theme}
            label="Note (optional)"
            value={note}
            onChangeText={setNote}
            placeholder="A calm note for this glass"
            multiline
            maxLength={140}
          />
        </NestCard>

        {error ? (
          <AppText theme={theme} size={14} style={{ color: c.danger, marginTop: spacing.md }}>
            {error}
          </AppText>
        ) : null}

        <PrimaryButton
          theme={theme}
          label="Save Entry"
          onPress={onSave}
          style={{ marginTop: spacing.lg }}
        />

        {isEdit ? (
          <SoftButton
            theme={theme}
            label="Delete Entry"
            tone="danger"
            onPress={onDelete}
            style={{ marginTop: spacing.md }}
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
});
