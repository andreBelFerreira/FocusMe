export function formatDuration(startMs: number, endMs: number): string {
  const diff = Math.round((endMs - startMs) / 60000);
  if (diff < 60) return `${diff} min de duração`;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return m > 0 ? `${h}h ${m}min de duração` : `${h}h de duração`;
}

export function reminderLabel(minutes: number): string {
  if (minutes === 0)    return "Sem lembrete";
  if (minutes < 60)     return `${minutes} min antes`;
  if (minutes === 60)   return "1 hora antes";
  if (minutes === 1440) return "1 dia antes";
  return `${minutes} min antes`;
}