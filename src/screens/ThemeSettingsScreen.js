// Theme Settings — Light or Dark. The choice persists in AsyncStorage.

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
import { AppText, NestCard, WaterStrip } from "../components/ui";

export default function ThemeSettingsScreen() {
  const { theme, themeMode, setThemeMode } = useApp();
  const c = safeColors(theme);

  const options = [
    { key: "light", label: "Light", desc: "Warm cream and soft aqua." },
    { key: "dark", label: "Dark", desc: "Deep navy with gentle accents." },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppText theme={theme} soft size={14} style={{ marginBottom: spacing.lg }}>
          Choose the mood that feels calm to you. Your choice is saved on this
          device and stays after restart.
        </AppText>

        {options.map((opt) => {
          const selected = themeMode === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              activeOpacity={0.85}
              onPress={() => setThemeMode(opt.key)}
              style={{ marginBottom: spacing.md }}
            >
              <NestCard
                theme={theme}
                style={{
                  borderColor: selected ? c.accent : c.border,
                  borderWidth: selected ? 2 : 1,
                }}
              >
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <AppText theme={theme} size={17} weight="700">
                      {opt.label}
                    </AppText>
                    <AppText theme={theme} soft size={13} style={{ marginTop: 2 }}>
                      {opt.desc}
                    </AppText>
                  </View>
                  <View
                    style={[
                      styles.radio,
                      { borderColor: selected ? c.accent : c.border },
                    ]}
                  >
                    {selected ? (
                      <View style={[styles.radioDot, { backgroundColor: c.accent }]} />
                    ) : null}
                  </View>
                </View>
                <View style={{ marginTop: spacing.md }}>
                  <WaterStrip theme={theme} ratio={opt.key === "light" ? 0.65 : 0.4} />
                </View>
              </NestCard>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  row: { flexDirection: "row", alignItems: "center" },
  radio: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
});
