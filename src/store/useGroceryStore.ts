import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GroceryList, GroceryItem } from "../types/grocery";

const KEY = "focusme_grocery";

interface GroceryStore {
  lists: GroceryList[];
  loaded: boolean;
  load: () => Promise<void>;
  createList: (name: string) => Promise<GroceryList>;
  deleteList: (id: string) => Promise<void>;
  addItem: (listId: string, item: GroceryItem) => Promise<void>;
  toggleItem: (listId: string, itemId: string) => Promise<void>;
  deleteItem: (listId: string, itemId: string) => Promise<void>;
  clearChecked: (listId: string) => Promise<void>;
  save: (lists: GroceryList[]) => Promise<void>;
}

export const useGroceryStore = create<GroceryStore>((set, get) => ({
  lists:  [],
  loaded: false,

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      set({ lists: raw ? JSON.parse(raw) : [], loaded: true });
    } catch { set({ loaded: true }); }
  },

  save: async (lists) => {
    set({ lists });
    await AsyncStorage.setItem(KEY, JSON.stringify(lists));
  },

  createList: async (name) => {
    const list: GroceryList = { id: Date.now().toString(), name, items: [], createdAt: Date.now() };
    const lists = [...get().lists, list];
    await get().save(lists);
    return list;
  },

  deleteList: async (id) => {
    await get().save(get().lists.filter((l) => l.id !== id));
  },

  addItem: async (listId, item) => {
    const lists = get().lists.map((l) =>
      l.id === listId ? { ...l, items: [...l.items, item] } : l
    );
    await get().save(lists);
  },

  toggleItem: async (listId, itemId) => {
    const lists = get().lists.map((l) =>
      l.id !== listId ? l : {
        ...l,
        items: l.items.map((i) => i.id === itemId ? { ...i, checked: !i.checked } : i),
      }
    );
    await get().save(lists);
  },

  deleteItem: async (listId, itemId) => {
    const lists = get().lists.map((l) =>
      l.id !== listId ? l : { ...l, items: l.items.filter((i) => i.id !== itemId) }
    );
    await get().save(lists);
  },

  clearChecked: async (listId) => {
    const lists = get().lists.map((l) =>
      l.id !== listId ? l : { ...l, items: l.items.filter((i) => !i.checked) }
    );
    await get().save(lists);
  },
}));