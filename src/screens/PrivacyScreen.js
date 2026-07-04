// Privacy Screen — a trust card. Explains local-only storage clearly, offers a
// "hide amounts on home screen" toggle and a reset-local-data action. This is
// a privacy summary, NOT a secure vault: no biometrics, no PIN, no encryption
// claims.

import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useApp } from "../context/AppContext";
import { safeColors, spacing, radius } from "../theme/theme";
import {
  AppText,
  NestCard,
  PaperCard,
  ToggleRow,
  SoftButton,
  Divider,
} from "../components/ui";

const CHECKLIST = [
  "Stored only on this device",
  "No account or sign-in",
  "No ads",
  "No analytics or tracking",
  "No internet connection",
  "No sensors",
  "No Health Connect",
  "No Google Fit",
  "No wearable devices",
  "No phone notifications",
  "No cloud sync",
];

export default function PrivacyScreen({ navigation }) {
  const { theme, privacySettings, setPrivacy, resetAllData } = useApp();
  const c = safeColors(theme);

  const hide = Boolean(privacySettings?.hideAmountsOnHome);

  const onResetData = () => {
    Alert.alert(
      "Reset local data?",
      "This removes all water entries, glass sizes, goal, reminders, theme and privacy settings from this device. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset everything",
          style: "destructive",
          onPress: async () => {
            await resetAllData();
            navigation.reset({ index: 0, routes: [{ name: "Onboarding" }] });
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Shield header */}
        <NestCard theme={theme}>
          <View style={styles.shieldRow}>
            <View style={[styles.shield, { backgroundColor: c.accentSoft }]}>
              <AppText theme={theme} size={22} style={{ color: c.shield }}>
                ◈
              </AppText>
            </View>
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <AppText theme={theme} size={18} weight="800">
                Your private water nest
              </AppText>
              <AppText theme={theme} soft size={13} style={{ marginTop: 2 }}>
                A simple privacy summary you can trust.
              </AppText>
            </View>
          </View>
          <AppText theme={theme} size={14} style={{ marginTop: spacing.md, lineHeight: 20 }}>
            Your water journal stays on this device. WaterNest does not use
            accounts, ads, analytics, internet, sensors, Health Connect, Google
            Fit, or phone notifications.
          </AppText>
        </NestCard>

        {/* Checklist */}
        <AppText theme={theme} soft size={13} weight="700" style={styles.sectionLabel}>
          WHAT WATERNEST DOES NOT DO
        </AppText>
        <PaperCard theme={theme}>
          {CHECKLIST.map((item, i) => (
            <View key={i}>
              {i > 0 ? <Divider theme={theme} /> : null}
              <View style={styles.checkRow}>
                <View style={[styles.check, { borderColor: c.success }]}>
                  <AppText theme={theme} size={13} weight="800" style={{ color: c.success }}>
                    ✓
                  </AppText>
                </View>
                <AppText theme={theme} size={15} style={{ flex: 1 }}>
                  {item}
                </AppText>
              </View>
            </View>
          ))}
        </PaperCard>

        {/* Hide amounts toggle */}
        <AppText theme={theme} soft size={13} weight="700" style={styles.sectionLabel}>
          HOME SCREEN
        </AppText>
        <NestCard theme={theme}>
          <ToggleRow
            theme={theme}
            label="Hide amounts on home screen"
            description="Softly hide your totals on the home screen. You can tap Show to reveal them for a moment. Your data stays local and unchanged."
            value={hide}
            onValueChange={(v) => setPrivacy({ hideAmountsOnHome: v })}
          />
        </NestCard>

        {/* Manual disclaimer */}
        <PaperCard theme={theme} style={{ marginTop: spacing.lg }}>
          <AppText theme={theme} soft size={13} style={{ lineHeight: 19 }}>
            WaterNest is a manual water journal. It does not detect drinking
            automatically and does not connect to Health Connect, Google Fit,
            sensors, or wearable devices.
          </AppText>
        </PaperCard>

        <AppText theme={theme} soft size={12} style={{ marginTop: spacing.md, lineHeight: 18 }}>
          This is a privacy summary, not a secure vault. WaterNest does not use
          biometric locks, PIN codes or encryption. It simply keeps your journal
          local and offline.
        </AppText>

        <SoftButton
          theme={theme}
          label="Reset local data"
          tone="danger"
          onPress={onResetData}
          style={{ marginTop: spacing.xl }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  shieldRow: { flexDirection: "row", alignItems: "center" },
  shield: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionLabel: {
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    letterSpacing: 1,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
});
