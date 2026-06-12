import { create } from "zustand";

export const THEMES = {
  light: {
    background:    "#f3f4f6",
    card:          "#ffffff",
    border:        "#e5e7eb",
    text:          "#111827",
    textSecondary: "#6b7280",
    textMuted:     "#9ca3af",
    inputBg:       "#f3f4f6",
  },
  dark: {
    background:    "#0f172a",
    card:          "#1e293b",
    border:        "#334155",
    text:          "#f1f5f9",
    textSecondary: "#94a3b8",
    textMuted:     "#64748b",
    inputBg:       "#1e293b",
  },
};

interface ThemeStore {
  dark: boolean;
  theme: typeof THEMES.light;
  setDark: (v: boolean) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  dark:  false,
  theme: THEMES.light,
  setDark: (v) => set({ dark: v, theme: v ? THEMES.dark : THEMES.light }),
}));