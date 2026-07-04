// Welcome / Onboarding screen. Shown only on first launch (or when the user
// chooses "Show onboarding again" in Settings). Explains the calm, manual,
// local-only nature of WaterNest.

import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useApp } from "../context/AppContext";
import { safeColors, spacing } from "../theme/theme";
import { AppText, NestCard, PaperCard, PrimaryButton, SoftButton } from "../components/ui";

export default function OnboardingScreen({ navigation }) {
  const { theme, completeOnboarding } = useApp();
  const c = safeColors(theme);

  const start = () => {
    completeOnboarding();
    navigation.reset({ index: 0, routes: [{ name: "Home" }] });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={[styles.bowl, { backgroundColor: c.accentSoft }]}>
            <View style={[styles.drop, { backgroundColor: c.water }]} />
          </View>
          <AppText theme={theme} size={30} weight="800" style={{ marginTop: spacing.lg }}>
            WaterNest
          </AppText>
          <AppText theme={theme} soft size={16} style={{ marginTop: 6 }}>
            A calm water journal for your day.
          </AppText>
        </View>

        <NestCard theme={theme} style={{ marginTop: spacing.xl }}>
          <AppText theme={theme} size={16} weight="700">
            A gentle daily routine
          </AppText>
          <AppText theme={theme} soft size={15} style={styles.para}>
            Add glasses manually and keep a simple private history. WaterNest is
            a personal log for your everyday water habit — quiet, cozy and
            entirely yours.
          </AppText>
        </NestCard>

        <PaperCard theme={theme} style={{ marginTop: spacing.md }}>
          <AppText theme={theme} size={15} weight="700">
            Private and offline
          </AppText>
          <AppText theme={theme} soft size={14} style={styles.para}>
            No sensors. No Health Connect. No account. Works offline. Everything
            you log stays on this device.
          </AppText>
        </PaperCard>

        <PaperCard theme={theme} style={{ marginTop: spacing.md }}>
          <AppText theme={theme} size={14} soft style={{ lineHeight: 20 }}>
            WaterNest is a manual water journal. It does not detect drinking
            automatically and does not connect to Health Connect, Google Fit,
            sensors, or wearable devices.
          </AppText>
        </PaperCard>

        <View style={{ marginTop: spacing.xl }}>
          <PrimaryButton theme={theme} label="Start WaterNest" onPress={start} />
          <SoftButton
            theme={theme}
            label="Skip"
            onPress={start}
            style={{ marginTop: spacing.md }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: spacing.xxl },
  hero: { alignItems: "center", marginTop: spacing.xl },
  bowl: {
    width: 120,
    height: 84,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  drop: {
    width: 34,
    height: 44,
    borderRadius: 20,
    borderTopLeftRadius: 4,
    transform: [{ rotate: "45deg" }],
  },
  para: { marginTop: spacing.sm, lineHeight: 21 },
});
