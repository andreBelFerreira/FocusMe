import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Event } from "../types";
import { formatTime, formatEventRange } from "../utils/dateHelpers";
import { useThemeStore } from "../store/useThemeStore";

interface Props { event: Event; }

export function EventCard({ event }: Props) {
  const router  = useRouter();
  const { theme } = useThemeStore();
  const isDone  = event.end_at < Date.now();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }, isDone && styles.cardDone]}
      onPress={() => router.push(`/event/${event.id}`)}
      activeOpacity={0.75}
    >
      <View style={[styles.accent, { backgroundColor: event.color }]} />
      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={[styles.title, { color: theme.text }, isDone && styles.titleDone]} numberOfLines={1}>
            {event.title}
          </Text>
          <View style={[styles.timeBadge, { backgroundColor: event.color + "22" }]}>
            <Text style={[styles.timeBadgeText, { color: event.color }]}>{formatTime(event.start_at)}</Text>
          </View>
        </View>
        <Text style={[styles.range, { color: theme.textSecondary }]}>
          {formatEventRange(event.start_at, event.end_at, event.all_day)}
          {event.description ? ` · ${event.description}` : ""}
        </Text>
        {event.notify_before > 0 && !isDone && (
          <Text style={[styles.reminder, { color: theme.textMuted }]}>🔔 Lembrete {event.notify_before}min antes</Text>
        )}
        {isDone && <Text style={styles.doneTag}>Concluído</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card:          { flexDirection: "row", borderRadius: 12, marginBottom: 8, overflow: "hidden", borderWidth: 0.5 },
  cardDone:      { opacity: 0.55 },
  accent:        { width: 4 },
  body:          { flex: 1, padding: 12 },
  row:           { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  title:         { fontSize: 14, fontWeight: "600", flex: 1, marginRight: 8 },
  titleDone:     { textDecorationLine: "line-through" },
  timeBadge:     { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  timeBadgeText: { fontSize: 11, fontWeight: "600" },
  range:         { fontSize: 12, marginTop: 4 },
  reminder:      { fontSize: 11, marginTop: 6 },
  doneTag:       { fontSize: 11, color: "#10b981", marginTop: 6, fontWeight: "500" },
});