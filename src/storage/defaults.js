// Default data structures and constants for WaterNest.
// Everything is local. These defaults are merged with whatever is loaded from
// AsyncStorage so the app never crashes on missing / corrupted data.

export const STORAGE_KEY = "waternest_app_data_v1";

export const DEFAULT_GOAL_ML = 2000;
export const MIN_GOAL_ML = 1;
export const MAX_GOAL_ML = 10000;

export const MAX_ENTRY_ML = 5000;
export const MAX_GLASS_ML = 5000;

export function nowIso() {
  try {
    return new Date().toISOString();
  } catch (e) {
    return "";
  }
}

export function makeId() {
  // Simple, dependency-free unique id.
  return (
    Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10)
  );
}

export function defaultGlassSizes() {
  const t = nowIso();
  return [
    {
      id: "glass-small",
      label: "Small glass",
      amountMl: 150,
      custom: false,
      createdAt: t,
      updatedAt: t,
    },
    {
      id: "glass-regular",
      label: "Regular glass",
      amountMl: 250,
      custom: false,
      createdAt: t,
      updatedAt: t,
    },
    {
      id: "glass-bottle",
      label: "Bottle",
      amountMl: 500,
      custom: false,
      createdAt: t,
      updatedAt: t,
    },
  ];
}

export const defaultReminderSettings = {
  enabled: true,
  morningEnabled: true,
  afternoonEnabled: true,
  eveningEnabled: true,
};

export const defaultPrivacySettings = {
  hideAmountsOnHome: false,
};

export function defaultSettings() {
  return {
    onboardingCompleted: false,
    dailyGoalMl: DEFAULT_GOAL_ML,
    themeMode: "light",
    compactMode: false,
    reminders: { ...defaultReminderSettings },
    privacy: { ...defaultPrivacySettings },
  };
}

export function defaultAppData() {
  return {
    entries: [],
    glassSizes: defaultGlassSizes(),
    settings: defaultSettings(),
  };
}

// Merge loaded data with defaults, guarding every field. Any missing or invalid
// value falls back to a safe default so downstream screens never crash.
export function mergeAppData(loaded) {
  const base = defaultAppData();
  if (!loaded || typeof loaded !== "object") {
    return base;
  }

  const entries = Array.isArray(loaded.entries)
    ? loaded.entries
        .filter((e) => e && typeof e === "object")
        .map((e) => ({
          id: typeof e.id === "string" && e.id ? e.id : makeId(),
          date: typeof e.date === "string" ? e.date : "",
          time: typeof e.time === "string" ? e.time : "",
          amountMl: Math.max(0, Number(e.amountMl) || 0),
          glassLabel: typeof e.glassLabel === "string" ? e.glassLabel : "",
          note: typeof e.note === "string" ? e.note : "",
          createdAt: typeof e.createdAt === "string" ? e.createdAt : nowIso(),
          updatedAt: typeof e.updatedAt === "string" ? e.updatedAt : nowIso(),
        }))
    : [];

  const glassSizes =
    Array.isArray(loaded.glassSizes) && loaded.glassSizes.length > 0
      ? loaded.glassSizes
          .filter((g) => g && typeof g === "object")
          .map((g) => ({
            id: typeof g.id === "string" && g.id ? g.id : makeId(),
            label: typeof g.label === "string" ? g.label : "Glass",
            amountMl: Math.max(1, Number(g.amountMl) || 250),
            custom: Boolean(g.custom),
            createdAt: typeof g.createdAt === "string" ? g.createdAt : nowIso(),
            updatedAt: typeof g.updatedAt === "string" ? g.updatedAt : nowIso(),
          }))
      : defaultGlassSizes();

  const loadedSettings =
    loaded.settings && typeof loaded.settings === "object"
      ? loaded.settings
      : {};

  const loadedReminders =
    loadedSettings.reminders && typeof loadedSettings.reminders === "object"
      ? loadedSettings.reminders
      : {};

  const loadedPrivacy =
    loadedSettings.privacy && typeof loadedSettings.privacy === "object"
      ? loadedSettings.privacy
      : {};

  const settings = {
    onboardingCompleted: Boolean(loadedSettings.onboardingCompleted),
    dailyGoalMl: clampGoal(loadedSettings.dailyGoalMl),
    themeMode: loadedSettings.themeMode === "dark" ? "dark" : "light",
    compactMode: Boolean(loadedSettings.compactMode),
    reminders: {
      enabled: boolWithDefault(loadedReminders.enabled, true),
      morningEnabled: boolWithDefault(loadedReminders.morningEnabled, true),
      afternoonEnabled: boolWithDefault(loadedReminders.afternoonEnabled, true),
      eveningEnabled: boolWithDefault(loadedReminders.eveningEnabled, true),
    },
    privacy: {
      hideAmountsOnHome: Boolean(loadedPrivacy.hideAmountsOnHome),
    },
  };

  return { entries, glassSizes, settings };
}

function boolWithDefault(value, fallback) {
  if (value === true) return true;
  if (value === false) return false;
  return fallback;
}

export function clampGoal(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return DEFAULT_GOAL_ML;
  if (n > MAX_GOAL_ML) return MAX_GOAL_ML;
  return Math.round(n);
}
