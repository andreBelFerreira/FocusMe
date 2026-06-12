import { create } from "zustand";
import { Event } from "../types";
import {
  getAllEvents, createEvent, updateEvent,
  deleteEvent, getEventsByDay,
} from "../db/events";
import {
  scheduleEventNotification,
  cancelAllNotifications,
  rescheduleAllEvents,
} from "../utils/notifications";

interface EventStore {
  events: Event[];
  loading: boolean;
  loadAll: () => Promise<void>;
  loadByDay: (dayStart: number, dayEnd: number) => Promise<void>;
  addEvent: (event: Event) => Promise<void>;
  editEvent: (event: Event) => Promise<void>;
  removeEvent: (id: string) => Promise<void>;
}

export const useEventStore = create<EventStore>((set) => ({
  events:  [],
  loading: false,

  loadAll: async () => {
    set({ loading: true });
    const events = await getAllEvents();
    set({ events, loading: false });
  },

  loadByDay: async (dayStart, dayEnd) => {
    set({ loading: true });
    const events = await getEventsByDay(dayStart, dayEnd);
    set({ events, loading: false });
  },

  addEvent: async (event) => {
    await createEvent(event);
    await scheduleEventNotification(event);
    const events = await getAllEvents();
    set({ events });
  },

  editEvent: async (event) => {
    await updateEvent(event);
    const all = await getAllEvents();
    await rescheduleAllEvents(all);
    set({ events: all });
  },

  removeEvent: async (id) => {
    await deleteEvent(id);
    const all = await getAllEvents();
    await rescheduleAllEvents(all);
    set({ events: all });
  },
}));