// Glass Size Settings — add, edit, delete custom glass sizes and reset to
// defaults. Glass sizes feel like cozy home objects.

import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useApp } from "../context/AppContext";
import { safeColors, spacing, radius } from "../theme/theme";
import {
  AppText,
  NestCard,
  PaperCard,
  Field,
  PrimaryButton,
  SoftButton,
} from "../components/ui";

export default function GlassSettingsScreen() {
  const {
    theme,
    glassSizes,
    addGlassSize,
    updateGlassSize,
    deleteGlassSize,
    resetGlassSizes,
    MAX_GLASS_ML,
  } = useApp();
  const c = safeColors(theme);

  const [editingId, setEditingId] = useState(null);
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const beginAdd = () => {
    setEditingId("new");
    setLabel("");
    setAmount("");
    setError("");
  };

  const beginEdit = (g) => {
    setEditingId(g?.id ?? null);
    setLabel(g?.label ?? "");
    setAmount(g?.amountMl ? String(g.amountMl) : "");
    setError("");
  };

  const cancel = () => {
    setEditingId(null);
    setError("");
  };

  const validate = () => {
    if (!label.trim()) return "Label must not be empty.";
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) return "Amount must be greater than 0 ml.";
    if (amt > MAX_GLASS_ML) return `Amount must not exceed ${MAX_GLASS_ML} ml.`;
    return "";
  };

  const save = () => {
    const message = validate();
    if (message) {
      setError(message);
      return;
    }
    const amt = Math.round(Number(amount));
    if (editingId === "new") {
      addGlassSize(label.trim(), amt);
    } else if (editingId) {
      updateGlassSize(editingId, { label: label.trim(), amountMl: amt });
    }
    cancel();
  };

  const onDelete = (g) => {
    Alert.alert(
      "Delete glass size?",
      `Remove "${g?.label ?? "this glass"}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteGlassSize(g?.id),
        },
      ],
      { cancelable: true }
    );
  };

  const onResetDefaults = () => {
    Alert.alert(
      "Reset default glass sizes?",
      "This restores Small glass, Regular glass and Bottle, and removes custom sizes.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: () => resetGlassSizes() },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <AppText theme={theme} soft size={14} style={{ marginBottom: spacing.lg }}>
          Set up cozy glass sizes for quick logging. Tap a glass to edit it.
        </AppText>

        {(glassSizes ?? []).map((g) => (
          <PaperCard key={g?.id ?? Math.random()} theme={theme} style={{ marginBottom: spacing.sm }}>
            <View style={styles.row}>
              <View style={[styles.dot, { backgroundColor: c.water }]} />
              <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.8} onPress={() => beginEdit(g)}>
                <AppText theme={theme} size={16} weight="700">
                  {g?.label ?? "Glass"}
                </AppText>
                <AppText theme={theme} soft size={13} style={{ marginTop: 2 }}>
                  {Math.round(Number(g?.amountMl) || 0)} ml
                  {g?.custom ? "  ·  custom" : "  ·  default"}
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onDelete(g)}
                activeOpacity={0.8}
                style={[styles.smallBtn, { borderColor: c.danger }]}
              >
                <AppText theme={theme} size={12} weight="700" style={{ color: c.danger }}>
                  Delete
                </AppText>
              </TouchableOpacity>
            </View>
          </PaperCard>
        ))}

        {editingId ? (
          <NestCard theme={theme} style={{ marginTop: spacing.md }}>
            <AppText theme={theme} size={16} weight="700" style={{ marginBottom: spacing.md }}>
              {editingId === "new" ? "New glass size" : "Edit glass size"}
            </AppText>
            <Field
              theme={theme}
              label="Label"
              value={label}
              onChangeText={(v) => {
                setError("");
                setLabel(v);
              }}
              placeholder="e.g. Mug"
              maxLength={40}
            />
            <Field
              theme={theme}
              label="Amount (ml)"
              value={amount}
              onChangeText={(v) => {
                setError("");
                setAmount(v.replace(/[^0-9]/g, ""));
              }}
              placeholder="e.g. 300"
              keyboardType="number-pad"
              maxLength={5}
            />
            {error ? (
              <AppText theme={theme} size={14} style={{ color: c.danger, marginBottom: spacing.sm }}>
                {error}
              </AppText>
            ) : null}
            <PrimaryButton theme={theme} label="Save glass" onPress={save} />
            <SoftButton theme={theme} label="Cancel" onPress={cancel} style={{ marginTop: spacing.sm }} />
          </NestCard>
        ) : (
          <PrimaryButton
            theme={theme}
            label="Add custom glass size"
            onPress={beginAdd}
            style={{ marginTop: spacing.md }}
          />
        )}

        <SoftButton
          theme={theme}
          label="Reset default glass sizes"
          onPress={onResetDefaults}
          style={{ marginTop: spacing.lg }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: spacing.md,
  },
  smallBtn: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: spacing.md,
  },
});
