type DatabaseStub = {
  execAsync: (...args: any[]) => Promise<void>;
  getAllAsync: <T>(...args: any[]) => Promise<T[]>;
  getFirstAsync: <T>(...args: any[]) => Promise<T | null>;
  runAsync: (...args: any[]) => Promise<void>;
};

const db: DatabaseStub = {
  execAsync: async () => {
    return;
  },
  getAllAsync: async () => {
    return [];
  },
  getFirstAsync: async () => {
    return null;
  },
  runAsync: async () => {
    return;
  },
};

export async function initDatabase(): Promise<void> {
  return;
}

export default db;
