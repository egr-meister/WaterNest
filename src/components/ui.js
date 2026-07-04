// Small reusable UI building blocks for the WaterNest cozy journal look.
// Everything is plain React Native — no external image packs or heavy assets.

import React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";

import { safeColors, radius, spacing } from "../theme/theme";

// Soft rounded home-card panel (the "nest" container shape).
export function NestCard({ theme, style, children }) {
  const c = safeColors(theme);
  return (
    <View
      style={[
        styles.nestCard,
        { backgroundColor: c.panel, borderColor: c.border },
        style,
      ]}
    >
      {children}
    </View>
  );
}

// Pale paper note card used for journal entries and notes.
export function PaperCard({ theme, style, children }) {
  const c = safeColors(theme);
  return (
    <View
      style={[
        styles.paperCard,
        { backgroundColor: c.panelAlt, borderColor: c.border },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function AppText({ theme, soft, size, weight, style, children, ...rest }) {
  const c = safeColors(theme);
  return (
    <Text
      style={[
        {
          color: soft ? c.textSoft : c.text,
          fontSize: size ?? 15,
          fontWeight: weight ?? "400",
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}

// Primary calm button (filled teal).
export function PrimaryButton({ theme, label, onPress, disabled, style }) {
  const c = safeColors(theme);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={disabled ? undefined : onPress}
      style={[
        styles.primaryBtn,
        { backgroundColor: disabled ? c.waterTrack : c.accent },
        style,
      ]}
    >
      <Text
        style={[
          styles.primaryBtnText,
          { color: disabled ? c.textSoft : "#FFFFFF" },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// Soft secondary button (outlined).
export function SoftButton({ theme, label, onPress, tone, style }) {
  const c = safeColors(theme);
  const color = tone === "danger" ? c.danger : c.accent;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.softBtn,
        { borderColor: color, backgroundColor: "transparent" },
        style,
      ]}
    >
      <Text style={[styles.softBtnText, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

// Glass chip: a cozy home-object quick-add button.
export function GlassChip({ theme, label, amountMl, onPress, onLongPress }) {
  const c = safeColors(theme);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.glassChip, { backgroundColor: c.chip, borderColor: c.border }]}
    >
      <View style={[styles.glassChipDrop, { backgroundColor: c.water }]} />
      <Text style={[styles.glassChipLabel, { color: c.chipText }]} numberOfLines={1}>
        {label}
      </Text>
      <Text style={[styles.glassChipAmount, { color: c.textSoft }]}>
        {Math.round(Number(amountMl) || 0)} ml
      </Text>
    </TouchableOpacity>
  );
}

// A gentle horizontal water strip (progress). Not a sports ring.
export function WaterStrip({ theme, ratio }) {
  const c = safeColors(theme);
  const pct = Math.max(0, Math.min(1, Number(ratio) || 0));
  return (
    <View style={[styles.stripTrack, { backgroundColor: c.waterTrack }]}>
      <View
        style={[
          styles.stripFill,
          { backgroundColor: c.water, width: `${pct * 100}%` },
        ]}
      />
    </View>
  );
}

// Simple text input row with a soft look.
export function Field({ theme, label, value, onChangeText, placeholder, keyboardType, multiline, maxLength }) {
  const c = safeColors(theme);
  return (
    <View style={{ marginBottom: spacing.md }}>
      {label ? (
        <Text style={[styles.fieldLabel, { color: c.textSoft }]}>{label}</Text>
      ) : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={c.textSoft}
        keyboardType={keyboardType || "default"}
        multiline={Boolean(multiline)}
        maxLength={maxLength}
        style={[
          styles.field,
          {
            backgroundColor: c.card,
            borderColor: c.border,
            color: c.text,
            minHeight: multiline ? 72 : 46,
            textAlignVertical: multiline ? "top" : "center",
          },
        ]}
      />
    </View>
  );
}

// A small labelled toggle row using a plain touchable pill (no extra deps).
export function ToggleRow({ theme, label, description, value, onValueChange }) {
  const c = safeColors(theme);
  const on = Boolean(value);
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onValueChange(!on)}
      style={[styles.toggleRow, { borderColor: c.border }]}
    >
      <View style={{ flex: 1, paddingRight: spacing.md }}>
        <Text style={[styles.toggleLabel, { color: c.text }]}>{label}</Text>
        {description ? (
          <Text style={[styles.toggleDesc, { color: c.textSoft }]}>
            {description}
          </Text>
        ) : null}
      </View>
      <View
        style={[
          styles.switchTrack,
          { backgroundColor: on ? c.accent : c.waterTrack },
        ]}
      >
        <View
          style={[
            styles.switchThumb,
            {
              backgroundColor: "#FFFFFF",
              alignSelf: on ? "flex-end" : "flex-start",
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
}

// A tappable settings row (label + optional value + chevron feel).
export function LinkRow({ theme, label, value, onPress, tone }) {
  const c = safeColors(theme);
  const color = tone === "danger" ? c.danger : c.text;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.linkRow, { borderColor: c.border }]}
    >
      <Text style={[styles.linkLabel, { color }]}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {value ? (
          <Text style={[styles.linkValue, { color: c.textSoft }]}>{value}</Text>
        ) : null}
        <Text style={[styles.linkChevron, { color: c.textSoft }]}>{"›"}</Text>
      </View>
    </TouchableOpacity>
  );
}

// Section heading.
export function SectionTitle({ theme, children, style }) {
  const c = safeColors(theme);
  return (
    <Text style={[styles.sectionTitle, { color: c.textSoft }, style]}>
      {children}
    </Text>
  );
}

// A gentle ripple divider (thin line).
export function Divider({ theme, style }) {
  const c = safeColors(theme);
  return <View style={[styles.divider, { backgroundColor: c.border }, style]} />;
}

const styles = StyleSheet.create({
  nestCard: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.lg,
  },
  paperCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
  },
  primaryBtn: {
    borderRadius: radius.lg,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: "700",
  },
  softBtn: {
    borderRadius: radius.lg,
    borderWidth: 1.5,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  softBtnText: {
    fontSize: 15,
    fontWeight: "600",
  },
  glassChip: {
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    minWidth: 96,
  },
  glassChipDrop: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginBottom: 6,
  },
  glassChipLabel: {
    fontSize: 13,
    fontWeight: "600",
    maxWidth: 110,
    textAlign: "center",
  },
  glassChipAmount: {
    fontSize: 12,
    marginTop: 2,
  },
  stripTrack: {
    height: 18,
    borderRadius: 12,
    overflow: "hidden",
    width: "100%",
  },
  stripFill: {
    height: "100%",
    borderRadius: 12,
  },
  fieldLabel: {
    fontSize: 13,
    marginBottom: 6,
    fontWeight: "600",
  },
  field: {
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  toggleDesc: {
    fontSize: 13,
    marginTop: 3,
    lineHeight: 18,
  },
  switchTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 3,
    justifyContent: "center",
  },
  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  linkLabel: {
    fontSize: 15,
    fontWeight: "500",
  },
  linkValue: {
    fontSize: 14,
    marginRight: 6,
  },
  linkChevron: {
    fontSize: 22,
    marginTop: -2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  divider: {
    height: 1,
    width: "100%",
    marginVertical: spacing.sm,
  },
});
