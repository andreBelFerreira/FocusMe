import { useEffect, useState, useCallback } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import {
  startOfWeek, endOfWeek, startOfMonth, endOfMonth,
  eachDayOfInterval, format, isToday, subWeeks, subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { getAllEvents } from "../../src/db/events";
import { useNotesStore } from "../../src/store/useNotesStore";
import { useGroceryStore } from "../../src/store/useGroceryStore";
import { useThemeStore } from "../../src/store/useThemeStore";
import { Event } from "../../src/types";

type Period = "week" | "month" | "all";

const PERIOD_LABELS: Record<Period, string> = {
  week:  "Semana",
  month: "Mês",
  all:   "Tudo",
};

const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function motivationalMessage(events: number, notes: number): string {
  if (events === 0 && notes === 0) return "Comece registrando seu primeiro compromisso! 🚀";
  if (events >= 10) return "Você está arrasando! Semana super produtiva! 🔥";
  if (events >= 5)  return "Boa semana! Você está mantendo o ritmo. 💪";
  return "Cada pequeno passo conta. Continue em frente! 🧠";
}

export default function StatsScreen() {
  const router    = useRouter();
  const { theme } = useThemeStore();
  const { notes, load: loadNotes, loaded: notesLoaded } = useNotesStore();
  const { lists, load: loadLists, loaded: listsLoaded } = useGroceryStore();

  const [period,   setPeriod]   = useState<Period>("week");
  const [events,   setEvents]   = useState<Event[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [prevEvents, setPrevEvents] = useState<Event[]>([]);

  useFocusEffect(useCallback(() => {
    if (!notesLoaded) loadNotes();
    if (!listsLoaded) loadLists();
    loadData();
  }, [period]));

  async function loadData() {
    setLoading(true);
    try {
      const all = await getAllEvents();
      const now = new Date();

      let start: Date, end: Date, prevStart: Date, prevEnd: Date;

      if (period === "week") {
        start = startOfWeek(now, { weekStartsOn: 0 });
        end   = endOfWeek(now,   { weekStartsOn: 0 });
        prevStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 0 });
        prevEnd   = endOfWeek(subWeeks(now, 1),   { weekStartsOn: 0 });
      } else if (period === "month") {
        start = startOfMonth(now);
        end   = endOfMonth(now);
        prevStart = startOfMonth(subMonths(now, 1));
        prevEnd   = endOfMonth(subMonths(now, 1));
      } else {
        start = new Date(0);
        end   = new Date(9999999999999);
        prevStart = new Date(0);
        prevEnd   = new Date(0);
      }

      const filtered     = all.filter((e) => e.start_at >= start.getTime() && e.start_at <= end.getTime());
      const prevFiltered = all.filter((e) => e.start_at >= prevStart.getTime() && e.start_at <= prevEnd.getTime());
      setEvents(filtered);
      setPrevEvents(prevFiltered);
    } finally {
      setLoading(false);
    }
  }

  const totalNotes    = notes.length;
  const totalGrocery  = lists.reduce((acc, l) => acc + l.items.filter((i) => i.checked).length, 0);
  const prevEvtCount  = prevEvents.length;
  const evtDiff       = events.length - prevEvtCount;

  const now   = new Date();
  const wkStart = startOfWeek(now, { weekStartsOn: 0 });
  const wkEnd   = endOfWeek(now,   { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: wkStart, end: wkEnd });

  const eventsPerDay = weekDays.map((day) => ({
    label: DAY_LABELS[day.getDay()],
    count: events.filter((e) => {
      const d = new Date(e.start_at);
      return d.toDateString() === day.toDateString();
    }).length,
    isToday: isToday(day),
  }));

  const maxDay = Math.max(...eventsPerDay.map((d) => d.count), 1);

  const bestDay = eventsPerDay.reduce((best, d) => d.count > best.count ? d : best, eventsPerDay[0]);

  const periodLabel = period === "week"
    ? `${format(wkStart, "d", { locale: ptBR })} a ${format(wkEnd, "d 'de' MMMM", { locale: ptBR })}`
    : period === "month"
    ? format(now, "MMMM 'de' yyyy", { locale: ptBR })
    : "Todo o período";

  function DiffBadge({ diff }: { diff: number }) {
    if (period === "all" || diff === 0)
      return <Text style={[styles.diffNeutral, { color: theme.textMuted }]}>= igual anterior</Text>;
    if (diff > 0)
      return <Text style={styles.diffUp}>↑ +{diff} vs anterior</Text>;
    return <Text style={styles.diffDown}>↓ {diff} vs anterior</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top"]}>
      <View style={{ backgroundColor: "#8b5cf6", paddingHorizontal: 20, paddingTop: 14, paddingBottom: 16 }}>
        <Text style={styles.headerSub}>ESTATÍSTICAS</Text>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => { try { router.back(); } catch { router.replace("/(tabs)"); }}}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Resumo</Text>
            <Text style={styles.headerSub2}>{periodLabel}</Text>
          </View>
          <View style={{ width: 34 }} />
        </View>
        <View style={styles.periodTabs}>
          {(["week","month","all"] as Period[]).map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodTab, period === p && styles.periodTabActive]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[styles.periodTabText, period === p && styles.periodTabTextActive]}>
                {PERIOD_LABELS[p]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color="#8b5cf6" size="large" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 40 }}>

          <View style={styles.grid}>
            <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.statNum, { color: "#8b5cf6" }]}>{events.length}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Compromissos</Text>
              <DiffBadge diff={evtDiff} />
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.statNum, { color: "#f59e0b" }]}>{totalNotes}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Notas</Text>
              <Text style={[styles.diffNeutral, { color: theme.textMuted }]}>total geral</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.statNum, { color: "#10b981" }]}>{totalGrocery}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Itens comprados</Text>
              <Text style={[styles.diffNeutral, { color: theme.textMuted }]}>total geral</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.statNum, { color: "#ef4444" }]}>{lists.length}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Listas criadas</Text>
              <Text style={[styles.diffNeutral, { color: theme.textMuted }]}>total geral</Text>
            </View>
          </View>

          {period === "week" && (
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>Compromissos por dia</Text>
              <View style={styles.barChart}>
                {eventsPerDay.map((d, i) => (
                  <View key={i} style={styles.barCol}>
                    <Text style={[styles.barCount, { color: theme.textMuted }]}>
                      {d.count > 0 ? d.count : ""}
                    </Text>
                    <View style={styles.barWrapper}>
                      <View style={[
                        styles.bar,
                        {
                          height: Math.max((d.count / maxDay) * 80, d.count > 0 ? 6 : 2),
                          backgroundColor: d.isToday ? "#8b5cf6" : d.count > 0 ? "#c4b5fd" : theme.border,
                        },
                      ]} />
                    </View>
                    <Text style={[styles.barLabel, { color: d.isToday ? "#8b5cf6" : theme.textMuted }]}>
                      {d.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {bestDay && bestDay.count > 0 && period === "week" && (
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>Dia mais produtivo</Text>
              <View style={styles.bestDayRow}>
                <View style={[styles.bestDayIcon, { backgroundColor: "#f3e8ff" }]}>
                  <Text style={{ fontSize: 22 }}>⭐</Text>
                </View>
                <View>
                  <Text style={[styles.bestDayName, { color: theme.text }]}>{bestDay.label}</Text>
                  <Text style={[styles.bestDaySub, { color: theme.textSecondary }]}>
                    {bestDay.count} compromisso{bestDay.count > 1 ? "s" : ""}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {events.length > 0 && (
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>Próximos compromissos</Text>
              {events
                .filter((e) => e.start_at >= Date.now())
                .slice(0, 3)
                .map((e) => (
                  <TouchableOpacity
                    key={e.id}
                    style={[styles.eventRow, { borderBottomColor: theme.border }]}
                    onPress={() => router.push(`/event/${e.id}`)}
                  >
                    <View style={[styles.eventDot, { backgroundColor: e.color }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.eventTitle, { color: theme.text }]} numberOfLines={1}>{e.title}</Text>
                      <Text style={[styles.eventDate, { color: theme.textMuted }]}>
                        {format(new Date(e.start_at), "dd/MM 'às' HH:mm", { locale: ptBR })}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              }
            </View>
          )}

          <View style={styles.motivCard}>
            <Text style={styles.motivTitle}>🧠 {events.length >= 5 ? "Você está arrasando!" : "Continue assim!"}</Text>
            <Text style={styles.motivText}>{motivationalMessage(events.length, totalNotes)}</Text>
          </View>

        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerSub:          { fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: "500", letterSpacing: 0.05 },
  headerSub2:         { fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 },
  headerRow:          { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6, marginBottom: 12 },
  backBtn:            { width: 34, height: 34, borderRadius: 17, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  backIcon:           { fontSize: 18, color: "#fff" },
  headerTitle:        { fontSize: 18, fontWeight: "700", color: "#fff", textAlign: "center" },
  periodTabs:         { flexDirection: "row", gap: 6 },
  periodTab:          { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.15)" },
  periodTabActive:    { backgroundColor: "rgba(255,255,255,0.3)" },
  periodTabText:      { fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: "500" },
  periodTabTextActive:{ color: "#fff", fontWeight: "700" },
  grid:               { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 },
  statCard:           { width: "48%", borderRadius: 12, padding: 14, borderWidth: 0.5 },
  statNum:            { fontSize: 28, fontWeight: "700", marginBottom: 2 },
  statLabel:          { fontSize: 11, marginBottom: 4 },
  diffUp:             { fontSize: 10, color: "#10b981", fontWeight: "500" },
  diffDown:           { fontSize: 10, color: "#ef4444", fontWeight: "500" },
  diffNeutral:        { fontSize: 10 },
  card:               { borderRadius: 12, padding: 14, borderWidth: 0.5, marginBottom: 10 },
  cardTitle:          { fontSize: 13, fontWeight: "600", marginBottom: 12 },
  barChart:           { flexDirection: "row", alignItems: "flex-end", height: 110, gap: 4 },
  barCol:             { flex: 1, alignItems: "center", height: 110, justifyContent: "flex-end" },
  barCount:           { fontSize: 9, marginBottom: 2, height: 12 },
  barWrapper:         { width: "100%", alignItems: "center", justifyContent: "flex-end", height: 80 },
  bar:                { width: "70%", borderRadius: 4 },
  barLabel:           { fontSize: 9, marginTop: 4, fontWeight: "500" },
  bestDayRow:         { flexDirection: "row", alignItems: "center", gap: 12 },
  bestDayIcon:        { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  bestDayName:        { fontSize: 15, fontWeight: "600" },
  bestDaySub:         { fontSize: 12, marginTop: 2 },
  eventRow:           { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10, borderBottomWidth: 0.5 },
  eventDot:           { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  eventTitle:         { fontSize: 13, fontWeight: "500" },
  eventDate:          { fontSize: 11, marginTop: 2 },
  motivCard:          { borderRadius: 12, padding: 16, marginBottom: 10, backgroundColor: "#8b5cf6" },
  motivTitle:         { fontSize: 14, fontWeight: "700", color: "#fff", marginBottom: 6 },
  motivText:          { fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 20 },
});