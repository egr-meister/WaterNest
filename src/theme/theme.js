// WaterNest Cozy Lifestyle Journal theme.
// A single central theme object with safe fallbacks. All colors are readable
// in both light and dark mode. Never build a navigation theme from scratch;
// see App.js where we extend DefaultTheme / DarkTheme.

export const lightTheme = {
  mode: "light",
  colors: {
    background: "#FCF7EE", // warm cream
    panel: "#EAF4F2", // soft aqua panel
    panelAlt: "#F3EBDD", // pale sand note card
    card: "#FFFFFF",
    text: "#2F4252", // deep blue-gray
    textSoft: "#6B7B88",
    accent: "#3E9C9C", // muted teal
    accentSoft: "#CFE8E6",
    water: "#5EA8B2", // light sky water mark
    waterTrack: "#DCEAE6",
    border: "#E5DAC7", // clay beige divider
    danger: "#B4573F",
    success: "#4C9A6E",
    shield: "#78A096",
    chip: "#E8F1EE",
    chipText: "#2F4252",
    shadow: "#00000012",
  },
};

export const darkTheme = {
  mode: "dark",
  colors: {
    background: "#0F1B24", // deep navy
    panel: "#1B2C36", // dark slate panel
    panelAlt: "#20303A",
    card: "#1E2F39",
    text: "#E4EAE9", // warm gray text
    textSoft: "#9DB0B4",
    accent: "#5FBEBE", // soft aqua accent
    accentSoft: "#25424A",
    water: "#4FA6B2",
    waterTrack: "#24363F",
    border: "#2A3B44", // low-contrast divider
    danger: "#D98266",
    success: "#77C79A",
    shield: "#8FB6AB",
    chip: "#233642",
    chipText: "#E4EAE9",
    shadow: "#00000040",
  },
};

// Resolve a theme object from a stored mode string, always returning a valid
// theme even if the input is missing or corrupted.
export function getTheme(mode) {
  return mode === "dark" ? darkTheme : lightTheme;
}

// Safe accessor helpers used across screens.
export function safeColors(theme) {
  return theme?.colors ?? lightTheme.colors;
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
};
