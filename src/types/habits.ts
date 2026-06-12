export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  createdAt: number;
  completions: string[];
}

export const HABIT_ICONS = [
  "💧","🏃","📚","🧘","💊","😴","🥗","🏋️","✍️","🎯",
  "🚿","🧹","📵","🌅","🎵","🧠","💪","🫁","🤸","🛌",
];

export const HABIT_COLORS = [
  "#0ea5e9","#10b981","#ec4899","#8b5cf6",
  "#f59e0b","#ef4444","#6366f1","#14b8a6",
];