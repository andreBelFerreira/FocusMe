import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Habit } from "../types/habits";
import { format } from "date-fns";

const KEY = "focusme_habits";

export function todayKey(): string {
  return format(new Date(), "yyyy-MM-dd");
}

interface HabitsStore {
  habits: Habit[];
  loaded: boolean;
  load: () => Promise<void>;
  addHabit: (habit: Habit) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleToday: (id: string) => Promise<void>;
  save: (habits: Habit[]) => Promise<void>;
}

export const useHabitsStore = create<HabitsStore>((set, get) => ({
  habits:  [],
  loaded:  false,

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      set({ habits: raw ? JSON.parse(raw) : [], loaded: true });
    } catch { set({ loaded: true }); }
  },

  save: async (habits) => {
    set({ habits });
    await AsyncStorage.setItem(KEY, JSON.stringify(habits));
  },

  addHabit: async (habit) => {
    const habits = [...get().habits, habit];
    await get().save(habits);
  },

  deleteHabit: async (id) => {
    await get().save(get().habits.filter((h) => h.id !== id));
  },

  toggleToday: async (id) => {
    const today = todayKey();
    const habits = get().habits.map((h) => {
      if (h.id !== id) return h;
      const done = h.completions.includes(today);
      return {
        ...h,
        completions: done
          ? h.completions.filter((d) => d !== today)
          : [...h.completions, today],
      };
    });
    await get().save(habits);
  },
}));