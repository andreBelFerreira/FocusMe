import { useCallback, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, RefreshControl } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { format, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEventStore } from "../../src/store/useEventStore";
import { useSettingsStore } from "../../src/store/useSettingsStore";
import { useThemeStore } from "../../src/store/useThemeStore";
import { getDayBounds } from "../../src/utils/dateHelpers";
import { EventCard } from "../../src/components/EventCard";
import { DaySelector } from "../../src/components/DaySelector";
import { QuickActions } from "../../src/components/QuickActions";
import { RecentNotes } from "../../src/components/RecentNotes";

export default function HomeScreen() {
  const router = useRouter();
  const { events, loading, loadByDay } = useEventStore();
  const accent = useSettingsStore((s) => s.accentColor);
  const { theme } = useThemeStore();
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [refreshing,  setRefreshing]  = useState(false);

  const loadDay = useCallback((date: Date) => {
    const { start, end } = getDayBounds(date);
    loadByDay(start, end);
  }, []);

  useFocusEffect(useCallback(() => { loadDay(selectedDay); }, [selectedDay]));

  const onRefresh = async () => { setRefreshing(true); await loadDay(selectedDay); setRefreshing(false); };

  const headerTitle = isToday(selectedDay) ? "Hoje" : format(selectedDay, "EEEE", { locale: ptBR });
  const headerSub   = format(selectedDay, "d MMMM", { locale: ptBR });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top"]}>
      <View style={{ backgroundColor: accent, paddingBottom: 12 }}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.appName}>FocusMe</Text>
            <Text style={styles.dayTitle}>{headerTitle}</Text>
            <Text style={styles.daySubtitle}>
              {headerSub}{events.length > 0 ? ` · ${events.length} compromisso${events.length > 1 ? "s" : ""}` : ""}
            </Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => router.push("/new-event")} activeOpacity={0.8}>
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>
        <DaySelector selected={selectedDay} onSelect={(d) => { setSelectedDay(d); loadDay(d); }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 14, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={accent} />}
      >
        <QuickActions />
        <RecentNotes />

        {loading && !refreshing ? (
          <ActivityIndicator color={accent} style={{ marginTop: 24 }} />
        ) : events.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>{isToday(selectedDay) ? "🎉" : "📭"}</Text>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              {isToday(selectedDay) ? "Nenhum compromisso hoje" : "Nenhum compromisso nesse dia"}
            </Text>
            <Text style={[styles.emptyDesc, { color: theme.textMuted }]}>Toque em + para adicionar</Text>
            <TouchableOpacity style={[styles.emptyBtn, { backgroundColor: accent }]} onPress={() => router.push("/new-event")}>
              <Text style={styles.emptyBtnText}>Adicionar compromisso</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                📅 Compromissos do dia
              </Text>
            </View>
            {events.map((event) => <EventCard key={event.id} event={event} />)}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerTop:     { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  appName:       { fontSize: 11, color: "#c7d2fe", fontWeight: "500", letterSpacing: 0.5 },
  dayTitle:      { fontSize: 24, color: "#ffffff", fontWeight: "700", marginTop: 2 },
  daySubtitle:   { fontSize: 13, color: "#a5b4fc", marginTop: 2 },
  addBtn:        { width: 42, height: 42, borderRadius: 21, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  addBtnText:    { fontSize: 26, color: "#ffffff", lineHeight: 34 },
  sectionHeader: { marginBottom: 8 },
  sectionTitle:  { fontSize: 13, fontWeight: "600" },
  empty:         { alignItems: "center", marginTop: 40, paddingHorizontal: 32 },
  emptyEmoji:    { fontSize: 52, marginBottom: 14 },
  emptyTitle:    { fontSize: 17, fontWeight: "700", textAlign: "center" },
  emptyDesc:     { fontSize: 14, marginTop: 6, textAlign: "center", lineHeight: 20 },
  emptyBtn:      { marginTop: 24, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  emptyBtnText:  { color: "#ffffff", fontWeight: "600", fontSize: 15 },
});