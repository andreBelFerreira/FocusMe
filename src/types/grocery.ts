export interface GroceryItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  checked: boolean;
  createdAt: number;
}

export interface GroceryList {
  id: string;
  name: string;
  items: GroceryItem[];
  createdAt: number;
}

export const CATEGORIES = [
  { label: "🥦 Hortifruti",  value: "hortifruti" },
  { label: "🥛 Laticínios",  value: "laticinios" },
  { label: "🥩 Carnes",      value: "carnes"     },
  { label: "🍞 Padaria",     value: "padaria"    },
  { label: "🧴 Limpeza",     value: "limpeza"    },
  { label: "🥫 Mercearia",   value: "mercearia"  },
  { label: "🍦 Congelados",  value: "congelados" },
  { label: "📦 Outros",      value: "outros"     },
];

export const QUANTITIES = ["1 un", "2 un", "3 un", "500g", "1 kg", "2 kg", "1 L", "2 L", "Custom"];