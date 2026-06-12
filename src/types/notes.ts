export interface Note {
  id: string;
  title: string;
  content: string;
  color: NoteColor;
  createdAt: number;
  updatedAt: number;
}

export type NoteColor =
  | "#fef9c3"
  | "#fce7f3"
  | "#ede9fe"
  | "#dcfce7"
  | "#dbeafe"
  | "#f1f5f9";

export const NOTE_COLORS: { bg: NoteColor; accent: string; text: string }[] = [
  { bg: "#fef9c3", accent: "#f59e0b", text: "#78350f" },
  { bg: "#fce7f3", accent: "#ec4899", text: "#831843" },
  { bg: "#ede9fe", accent: "#8b5cf6", text: "#4c1d95" },
  { bg: "#dcfce7", accent: "#10b981", text: "#064e3b" },
  { bg: "#dbeafe", accent: "#3b82f6", text: "#1e3a8a" },
  { bg: "#f1f5f9", accent: "#64748b", text: "#0f172a" },
];