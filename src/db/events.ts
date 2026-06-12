import { Platform } from "react-native";
import { getDb } from "./database";
import { Event } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WEB_KEY = "focusme_events";

async function webGetAll(): Promise<Event[]> {
  const raw = await AsyncStorage.getItem(WEB_KEY);
  if (!raw) return [];
  const all: Event[] = JSON.parse(raw);
  return all.filter((e) => !e.deleted_at).sort((a, b) => a.start_at - b.start_at);
}

async function webSave(events: Event[]): Promise<void> {
  await AsyncStorage.setItem(WEB_KEY, JSON.stringify(events));
}

export async function getAllEvents(): Promise<Event[]> {
  if (Platform.OS === "web") return webGetAll();
  return getDb().getAllAsync<Event>(
    `SELECT * FROM events WHERE deleted_at IS NULL ORDER BY start_at ASC`
  );
}

export async function getEventsByDay(dayStart: number, dayEnd: number): Promise<Event[]> {
  if (Platform.OS === "web") {
    const all = await webGetAll();
    return all.filter((e) => e.start_at >= dayStart && e.start_at < dayEnd);
  }
  return getDb().getAllAsync<Event>(
    `SELECT * FROM events
     WHERE deleted_at IS NULL AND start_at >= ? AND start_at < ?
     ORDER BY start_at ASC`,
    [dayStart, dayEnd]
  );
}

export async function getEventById(id: string): Promise<Event | null> {
  if (Platform.OS === "web") {
    const all = await webGetAll();
    return all.find((e) => e.id === id) ?? null;
  }
  return getDb().getFirstAsync<Event>(
    `SELECT * FROM events WHERE id = ? AND deleted_at IS NULL`, [id]
  );
}

export async function createEvent(event: Event): Promise<void> {
  if (Platform.OS === "web") {
    const raw = await AsyncStorage.getItem(WEB_KEY);
    const all: Event[] = raw ? JSON.parse(raw) : [];
    all.push(event);
    await webSave(all);
    return;
  }
  await getDb().runAsync(
    `INSERT INTO events
      (id, title, description, start_at, end_at, all_day, color, notify_before, recurrence)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [event.id, event.title, event.description, event.start_at, event.end_at,
     event.all_day, event.color, event.notify_before, event.recurrence ?? null]
  );
}

export async function updateEvent(event: Event): Promise<void> {
  if (Platform.OS === "web") {
    const raw = await AsyncStorage.getItem(WEB_KEY);
    const all: Event[] = raw ? JSON.parse(raw) : [];
    const idx = all.findIndex((e) => e.id === event.id);
    if (idx >= 0) all[idx] = event;
    await webSave(all);
    return;
  }
  await getDb().runAsync(
    `UPDATE events SET
      title=?, description=?, start_at=?, end_at=?,
      all_day=?, color=?, notify_before=?, recurrence=?
     WHERE id=?`,
    [event.title, event.description, event.start_at, event.end_at,
     event.all_day, event.color, event.notify_before, event.recurrence ?? null, event.id]
  );
}

export async function deleteEvent(id: string): Promise<void> {
  if (Platform.OS === "web") {
    const raw = await AsyncStorage.getItem(WEB_KEY);
    const all: Event[] = raw ? JSON.parse(raw) : [];
    const idx = all.findIndex((e) => e.id === id);
    if (idx >= 0) all[idx].deleted_at = Date.now();
    await webSave(all);
    return;
  }
  await getDb().runAsync(
    `UPDATE events SET deleted_at = ? WHERE id = ?`, [Date.now(), id]
  );
}
