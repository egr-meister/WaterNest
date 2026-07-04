// Central app state. Loads once from AsyncStorage, keeps everything in memory
// and persists on every change. All mutations funnel through here so screens
// stay simple and consistent.

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { loadAppData, saveAppData, clearAppData } from "../storage/storage";
import {
  DEFAULT_GOAL_ML,
  MAX_ENTRY_ML,
  MAX_GLASS_ML,
  clampGoal,
  defaultAppData,
  defaultGlassSizes,
  defaultReminderSettings,
  defaultPrivacySettings,
  makeId,
  mergeAppData,
  nowIso,
} from "../storage/defaults";
import { getTheme } from "../theme/theme";
import { currentTimeString, todayString } from "../utils/dateUtils";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [data, setData] = useState(defaultAppData);
  const [ready, setReady] = useState(false);

  // Load once on mount.
  useEffect(() => {
    let active = true;
    (async () => {
      const loaded = await loadAppData();
      if (active) {
        setData(loaded);
        setReady(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Persist helper: apply an updater and save the merged result.
  const persist = useCallback((updater) => {
    setData((prev) => {
      const nextRaw =
        typeof updater === "function" ? updater(prev) : updater;
      const next = mergeAppData(nextRaw);
      // Fire and forget; storage layer handles its own errors.
      saveAppData(next);
      return next;
    });
  }, []);

  // ----- Settings -----
  const setSettings = useCallback(
    (patch) => {
      persist((prev) => ({
        ...prev,
        settings: { ...prev.settings, ...patch },
      }));
    },
    [persist]
  );

  const completeOnboarding = useCallback(() => {
    setSettings({ onboardingCompleted: true });
  }, [setSettings]);

  const showOnboardingAgain = useCallback(() => {
    setSettings({ onboardingCompleted: false });
  }, [setSettings]);

  const setDailyGoal = useCallback(
    (goalMl) => {
      setSettings({ dailyGoalMl: clampGoal(goalMl) });
    },
    [setSettings]
  );

  const resetGoal = useCallback(() => {
    setSettings({ dailyGoalMl: DEFAULT_GOAL_ML });
  }, [setSettings]);

  const setThemeMode = useCallback(
    (mode) => {
      setSettings({ themeMode: mode === "dark" ? "dark" : "light" });
    },
    [setSettings]
  );

  const setCompactMode = useCallback(
    (value) => {
      setSettings({ compactMode: Boolean(value) });
    },
    [setSettings]
  );

  const setReminders = useCallback(
    (patch) => {
      persist((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          reminders: { ...prev.settings.reminders, ...patch },
        },
      }));
    },
    [persist]
  );

  const setPrivacy = useCallback(
    (patch) => {
      persist((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          privacy: { ...prev.settings.privacy, ...patch },
        },
      }));
    },
    [persist]
  );

  // ----- Water entries -----
  // input: { date, time, amountMl, glassLabel, note }
  const addEntry = useCallback(
    (input) => {
      const t = nowIso();
      const entry = {
        id: makeId(),
        date:
          typeof input?.date === "string" && input.date
            ? input.date
            : todayString(),
        time:
          typeof input?.time === "string" && input.time
            ? input.time
            : currentTimeString(),
        amountMl: Math.max(0, Number(input?.amountMl) || 0),
        glassLabel:
          typeof input?.glassLabel === "string" ? input.glassLabel : "",
        note: typeof input?.note === "string" ? input.note : "",
        createdAt: t,
        updatedAt: t,
      };
      persist((prev) => ({
        ...prev,
        entries: [...(prev.entries ?? []), entry],
      }));
      return entry;
    },
    [persist]
  );

  // Quick-add from a glass size object for a given date (defaults today).
  const quickAddGlass = useCallback(
    (glass, date) => {
      return addEntry({
        date: date || todayString(),
        time: currentTimeString(),
        amountMl: Math.max(0, Number(glass?.amountMl) || 0),
        glassLabel: typeof glass?.label === "string" ? glass.label : "Glass",
        note: "",
      });
    },
    [addEntry]
  );

  const updateEntry = useCallback(
    (id, patch) => {
      persist((prev) => ({
        ...prev,
        entries: (prev.entries ?? []).map((e) =>
          e && e.id === id
            ? {
                ...e,
                ...patch,
                amountMl:
                  patch && patch.amountMl != null
                    ? Math.max(0, Number(patch.amountMl) || 0)
                    : e.amountMl,
                updatedAt: nowIso(),
              }
            : e
        ),
      }));
    },
    [persist]
  );

  const deleteEntry = useCallback(
    (id) => {
      persist((prev) => ({
        ...prev,
        entries: (prev.entries ?? []).filter((e) => e && e.id !== id),
      }));
    },
    [persist]
  );

  // Remove all entries for a specific day (keeps everything else).
  const resetDay = useCallback(
    (date) => {
      persist((prev) => ({
        ...prev,
        entries: (prev.entries ?? []).filter((e) => e && e.date !== date),
      }));
    },
    [persist]
  );

  const deleteAllEntries = useCallback(() => {
    persist((prev) => ({ ...prev, entries: [] }));
  }, [persist]);

  // ----- Glass sizes -----
  const addGlassSize = useCallback(
    (label, amountMl) => {
      const t = nowIso();
      const glass = {
        id: makeId(),
        label: typeof label === "string" ? label : "Glass",
        amountMl: Math.max(1, Number(amountMl) || 1),
        custom: true,
        createdAt: t,
        updatedAt: t,
      };
      persist((prev) => ({
        ...prev,
        glassSizes: [...(prev.glassSizes ?? []), glass],
      }));
      return glass;
    },
    [persist]
  );

  const updateGlassSize = useCallback(
    (id, patch) => {
      persist((prev) => ({
        ...prev,
        glassSizes: (prev.glassSizes ?? []).map((g) =>
          g && g.id === id
            ? {
                ...g,
                label:
                  patch && typeof patch.label === "string"
                    ? patch.label
                    : g.label,
                amountMl:
                  patch && patch.amountMl != null
                    ? Math.max(1, Number(patch.amountMl) || 1)
                    : g.amountMl,
                updatedAt: nowIso(),
              }
            : g
        ),
      }));
    },
    [persist]
  );

  const deleteGlassSize = useCallback(
    (id) => {
      persist((prev) => ({
        ...prev,
        glassSizes: (prev.glassSizes ?? []).filter((g) => g && g.id !== id),
      }));
    },
    [persist]
  );

  const resetGlassSizes = useCallback(() => {
    persist((prev) => ({ ...prev, glassSizes: defaultGlassSizes() }));
  }, [persist]);

  // ----- Whole-app reset -----
  const resetAllData = useCallback(async () => {
    await clearAppData();
    const fresh = defaultAppData();
    // Keep the user out of onboarding loop only if they already finished it?
    // Spec: reset all local data -> return to a clean default state.
    setData(fresh);
    saveAppData(fresh);
  }, []);

  // Derived, memoized safe values.
  const settings = data?.settings ?? defaultAppData().settings;
  const theme = useMemo(
    () => getTheme(settings?.themeMode ?? "light"),
    [settings?.themeMode]
  );

  const value = useMemo(
    () => ({
      ready,
      // raw data (already safe / merged)
      entries: data?.entries ?? [],
      glassSizes: data?.glassSizes ?? defaultGlassSizes(),
      settings,
      dailyGoalMl: clampGoal(settings?.dailyGoalMl),
      reminderSettings: settings?.reminders ?? defaultReminderSettings,
      privacySettings: settings?.privacy ?? defaultPrivacySettings,
      compactMode: Boolean(settings?.compactMode),
      themeMode: settings?.themeMode ?? "light",
      theme,
      // limits
      MAX_ENTRY_ML,
      MAX_GLASS_ML,
      // settings actions
      completeOnboarding,
      showOnboardingAgain,
      setDailyGoal,
      resetGoal,
      setThemeMode,
      setCompactMode,
      setReminders,
      setPrivacy,
      // entry actions
      addEntry,
      quickAddGlass,
      updateEntry,
      deleteEntry,
      resetDay,
      deleteAllEntries,
      // glass actions
      addGlassSize,
      updateGlassSize,
      deleteGlassSize,
      resetGlassSizes,
      // global
      resetAllData,
    }),
    [
      ready,
      data,
      settings,
      theme,
      completeOnboarding,
      showOnboardingAgain,
      setDailyGoal,
      resetGoal,
      setThemeMode,
      setCompactMode,
      setReminders,
      setPrivacy,
      addEntry,
      quickAddGlass,
      updateEntry,
      deleteEntry,
      resetDay,
      deleteAllEntries,
      addGlassSize,
      updateGlassSize,
      deleteGlassSize,
      resetGlassSizes,
      resetAllData,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    // Should never happen, but return a harmless fallback rather than crash.
    return {
      ready: false,
      entries: [],
      glassSizes: defaultGlassSizes(),
      settings: defaultAppData().settings,
      dailyGoalMl: DEFAULT_GOAL_ML,
      reminderSettings: defaultReminderSettings,
      privacySettings: defaultPrivacySettings,
      compactMode: false,
      themeMode: "light",
      theme: getTheme("light"),
      MAX_ENTRY_ML,
      MAX_GLASS_ML,
      completeOnboarding: () => {},
      showOnboardingAgain: () => {},
      setDailyGoal: () => {},
      resetGoal: () => {},
      setThemeMode: () => {},
      setCompactMode: () => {},
      setReminders: () => {},
      setPrivacy: () => {},
      addEntry: () => {},
      quickAddGlass: () => {},
      updateEntry: () => {},
      deleteEntry: () => {},
      resetDay: () => {},
      deleteAllEntries: () => {},
      addGlassSize: () => {},
      updateGlassSize: () => {},
      deleteGlassSize: () => {},
      resetGlassSizes: () => {},
      resetAllData: async () => {},
    };
  }
  return ctx;
}
