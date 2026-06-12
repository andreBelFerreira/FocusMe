export interface Event {
  id: string;
  title: string;
  description: string;
  start_at: number;
  end_at: number;
  all_day: number;
  color: string;
  notify_before: number;
  recurrence: string | null;
  synced_at: number | null;
  deleted_at: number | null;
}

export interface Reminder {
  id: string;
  event_id: string;
  notify_at: number;
  sent: number;
}

export type EventColor =
  | "#6366f1"
  | "#ec4899"
  | "#f59e0b"
  | "#10b981"
  | "#3b82f6"
  | "#ef4444";
