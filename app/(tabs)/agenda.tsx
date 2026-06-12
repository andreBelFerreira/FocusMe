import { useCallback, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { format, addMonths, subMonths, isToday, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEventStore } from "../../src/store/useEventStore";
import { useSettingsStore } from "../../src/store/useSettingsStore";
import { useThemeStore } from "../../src/store/useThemeStore";
import { getDayBounds } from "../../src/utils/dateHelpers";
import { CalendarGrid } from "../../src/components/CalendarGrid";
import { EventCard } from "../../src/components/EventCard";
import { getAllEvents } from "../../src/db/events";
import { Event } from "../../src/types";

export default function AgendaScreen() {
  const router  = useRouter();
  const { events, loading, loadByDay } = useEventStore();
  const accent  = useSettingsStore((s) => s.accentColor);
  const { theme } = useThemeStore();

  const [month,       setMonth]       = useState(new Date());
  const [selected,    setSelected]    = useState(new Date());
  const [monthEvents, setMonthEvents] = useState<Event[]>([]);

  async function loadMonthEvents(m: Date) {
    const start = startOfMonth(m).getTime();
    const end   = endOfMonth(m).getTime();
    const all   = await getAllEvents();
    setMonthEvents(all.filter((e) => e.start_at >= start && e.start_at <= end));
  }

  useFocusEffect(useCallback(() => {
    const { start, end } = getDayBounds(selected);
    loadByDay(start, end);
    loadMonthEvents(month);
  }, [selected, month]));

  function handleDaySelect(date: Date) {
    setSelected(date);
    const { start, end } = getDayBounds(date);
    loadByDay(start, end);
  }

  function handlePrevMonth() { const m = subMonths(month, 1); setMonth(m); loadMonthEvents(m); }
  function handleNextMonth() { const m = addMonths(month, 1); setMonth(m); loadMonthEvents(m); }

  const selectedLabel = isToday(selected)
    ? "Hoje · " + format(selected, "d 'de' MMMM", { locale: ptBR })
    : format(selected, "EEEE, d 'de' MMMM", { locale: ptBR });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top"]}>
      <View style={{ backgroundColor: accent, paddingBottom: 4 }}>
        <View style={styles.monthNav}>
          <TouchableOpacity style={styles.navBtn} onPress={handlePrevMonth}>
            <Text style={styles.navArrow}>‹</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setMonth(new Date()); setSelected(new Date()); }}>
            <Text style={styles.monthTitle}>{format(month, "MMMM yyyy", { locale: ptBR })}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={handleNextMonth}>
            <Text style={styles.navArrow}>›</Text>
          </TouchableOpacity>
        </View>
        <CalendarGrid month={month} selected={selected} events={monthEvents} onSelectDay={handleDaySelect} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 14, paddingBottom: 40 }}>
        <View style={styles.dayHeader}>
          <View style={[styles.dayDot, events.length > 0 && { backgroundColor: events[0]?.color ?? accent }]} />
          <Text style={[styles.dayLabel, { color: theme.textSecondary }]}>{selectedLabel}</Text>
        </View>

        {loading ? (
          <ActivityIndicator color={accent} style={{ marginTop: 24 }} />
        ) : events.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>Nenhum compromisso nesse dia</Text>
          </View>
        ) : (
          events.map((event) => <EventCard key={event.id} event={event} />)
        )}

        <TouchableOpacity style={[styles.addBtn, { backgroundColor: accent }]} onPress={() => router.push("/new-event")} activeOpacity={0.85}>
          <Text style={styles.addBtnText}>＋  Novo compromisso</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  monthNav:   { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 14, paddingBottom: 12 },
  navBtn:     { width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  navArrow:   { fontSize: 22, color: "#ffffff", lineHeight: 26 },
  monthTitle: { fontSize: 17, fontWeight: "600", color: "#ffffff", textTransform: "capitalize" },
  dayHeader:  { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  dayDot:     { width: 8, height: 8, borderRadius: 4, backgroundColor: "#e5e7eb" },
  dayLabel:   { fontSize: 13, fontWeight: "600", textTransform: "capitalize" },
  empty:      { alignItems: "center", paddingTop: 32 },
  emptyEmoji: { fontSize: 40, marginBottom: 8 },
  emptyText:  { fontSize: 14 },
  addBtn:     { borderRadius: 12, padding: 14, alignItems: "center", marginTop: 16 },
  addBtnText: { color: "#ffffff", fontSize: 15, fontWeight: "600" },
});