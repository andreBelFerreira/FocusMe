import { Platform } from "react-native";
import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export function getDb(): SQLite.SQLiteDatabase {
  if (!db) db = SQLite.openDatabaseSync("focusme.db");
  return db;
}

export async function initDatabase(): Promise<void> {
  if (Platform.OS === "web") {
    console.log("Web: SQLite nao suportado, usando AsyncStorage");
    return;
  }

  const database = getDb();
  await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS events (
      id            TEXT PRIMARY KEY NOT NULL,
      title         TEXT NOT NULL,
      description   TEXT NOT NULL DEFAULT "",
      start_at      INTEGER NOT NULL,
      end_at        INTEGER NOT NULL,
      all_day       INTEGER NOT NULL DEFAULT 0,
      color         TEXT NOT NULL DEFAULT "#6366f1",
      notify_before INTEGER NOT NULL DEFAULT 15,
      recurrence    TEXT,
      synced_at     INTEGER,
      deleted_at    INTEGER
    );

    CREATE TABLE IF NOT EXISTS reminders (
      id         TEXT PRIMARY KEY NOT NULL,
      event_id   TEXT NOT NULL,
      notify_at  INTEGER NOT NULL,
      sent       INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_events_start_at ON events(start_at);
    CREATE INDEX IF NOT EXISTS idx_events_deleted_at ON events(deleted_at);
  `);
}

export default { getDb };
