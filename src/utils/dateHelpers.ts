import { format, startOfDay, endOfDay, isToday, isTomorrow, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";

export function getDayBounds(date: Date): { start: number; end: number } {
  return {
    start: startOfDay(date).getTime(),
    end: endOfDay(date).getTime(),
  };
}

export function formatTime(timestamp: number): string {
  return format(new Date(timestamp), "HH:mm");
}

export function formatDate(timestamp: number): string {
  return format(new Date(timestamp), "dd/MM/yyyy");
}

export function formatDayLabel(date: Date): string {
  if (isToday(date)) return "Hoje";
  if (isTomorrow(date)) return "Amanhã";
  if (isYesterday(date)) return "Ontem";
  return format(date, "EEEE, dd/MM", { locale: ptBR });
}

export function formatEventRange(start: number, end: number, allDay: number): string {
  if (allDay) return "Dia inteiro";
  return `${formatTime(start)} – ${formatTime(end)}`;
}
