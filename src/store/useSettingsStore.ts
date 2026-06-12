import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "focusme_settings";

interface Settings {
  name: string;
  birthdate: string;
  darkMode: boolean;
  accentColor: string;
  notificationsEnabled: boolean;
  defaultReminder: number;
  onboardingDone: boolean;
}

const DEFAULTS: Settings = {
  name:                 "",
  birthdate:            "",
  darkMode:             false,
  accentColor:          "#6366f1",
  notificationsEnabled: true,
  defaultReminder:      15,
  onboardingDone:       false,
};

interface SettingsStore extends Settings {
  loaded: boolean;
  load: () => Promise<void>;
  update: (partial: Partial<Settings>) => Promise<void>;
  reset: () => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...DEFAULTS,
  loaded: false,

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        set({ ...DEFAULTS, ...saved, loaded: true });
      } else {
        set({ loaded: true });
      }
    } catch {
      set({ loaded: true });
    }
  },

  update: async (partial) => {
    const next = { ...get(), ...partial };
    set(next);
    await AsyncStorage.setItem(KEY, JSON.stringify({
      name:                 next.name,
      birthdate:            next.birthdate,
      darkMode:             next.darkMode,
      accentColor:          next.accentColor,
      notificationsEnabled: next.notificationsEnabled,
      defaultReminder:      next.defaultReminder,
      onboardingDone:       next.onboardingDone,
    }));
  },

  reset: async () => {
    await AsyncStorage.removeItem(KEY);
    set({ ...DEFAULTS, loaded: true });
  },
}));