import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Note, NoteColor } from "../types/notes";

const KEY = "focusme_notes";

interface NotesStore {
  notes: Note[];
  loaded: boolean;
  load: () => Promise<void>;
  addNote: (note: Note) => Promise<void>;
  updateNote: (note: Note) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  save: (notes: Note[]) => Promise<void>;
}

export const useNotesStore = create<NotesStore>((set, get) => ({
  notes:  [],
  loaded: false,

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      set({ notes: raw ? JSON.parse(raw) : [], loaded: true });
    } catch { set({ loaded: true }); }
  },

  save: async (notes) => {
    set({ notes });
    await AsyncStorage.setItem(KEY, JSON.stringify(notes));
  },

  addNote: async (note) => {
    const notes = [note, ...get().notes];
    await get().save(notes);
  },

  updateNote: async (note) => {
    const notes = get().notes.map((n) => n.id === note.id ? note : n);
    await get().save(notes);
  },

  deleteNote: async (id) => {
    await get().save(get().notes.filter((n) => n.id !== id));
  },
}));