import { useEffect, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { format, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNotesStore } from "../../src/store/useNotesStore";
import { useThemeStore } from "../../src/store/useThemeStore";
import { NOTE_COLORS } from "../../src/types/notes";

function dateLabel(ts: number): string {
  const d = new Date(ts);
  if (isToday(d))     return `Hoje ${format(d, "HH:mm")}`;
  if (isYesterday(d)) return `Ontem ${format(d, "HH:mm")}`;
  return format(d, "dd/MM HH:mm", { locale: ptBR });
}

function getColors(bg: string) {
  return NOTE_COLORS.find((c) => c.bg === bg) ?? NOTE_COLORS[5];
}

export default function NotesIndexScreen() {
  const router  = useRouter();
  const { theme } = useThemeStore();
  const { notes, loaded, load } = useNotesStore();
  const [search, setSearch] = useState("");

  useEffect(() => { if (!loaded) load(); }, []);

  const filtered = notes.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top"]}>
      <View style={{ backgroundColor: "#f59e0b", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 }}>
        <Text style={styles.headerSub}>NOTAS RÁPIDAS</Text>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Minhas notas</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => router.push("/notes/new")}>
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.searchBox, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar notas..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 40 }}>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📝</Text>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              {search ? "Nenhuma nota encontrada" : "Nenhuma nota ainda"}
            </Text>
            <Text style={[styles.emptyDesc, { color: theme.textMuted }]}>
              {search ? "Tente outra busca" : "Toque em + para criar uma nota rápida"}
            </Text>
            {!search && (
              <TouchableOpacity style={styles.createBtn} onPress={() => router.push("/notes/new")}>
                <Text style={styles.createBtnText}>Criar nota</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.grid}>
            {filtered.map((note) => {
              const colors = getColors(note.color);
              return (
                <TouchableOpacity
                  key={note.id}
                  style={[styles.card, { backgroundColor: note.color, borderColor: colors.accent + "44" }]}
                  onPress={() => router.push(`/notes/${note.id}`)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.cardAccent, { backgroundColor: colors.accent }]} />
                  <View style={styles.cardBody}>
                    {note.title ? (
                      <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
                        {note.title}
                      </Text>
                    ) : null}
                    <Text style={[styles.cardContent, { color: colors.text + "cc" }]} numberOfLines={4}>
                      {note.content || "Nota vazia"}
                    </Text>
                    <Text style={[styles.cardDate, { color: colors.accent }]}>
                      {dateLabel(note.updatedAt)}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerSub:     { fontSize: 11, color: "#fef3c7", fontWeight: "500", letterSpacing: 0.05 },
  headerRow:     { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 6, marginBottom: 12 },
  headerTitle:   { fontSize: 22, fontWeight: "700", color: "#fff" },
  addBtn:        { width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  addBtnText:    { fontSize: 24, color: "#fff", lineHeight: 30 },
  searchBox:     { flexDirection: "row", alignItems: "center", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  searchIcon:    { fontSize: 14 },
  searchInput:   { flex: 1, fontSize: 14, color: "#fff" },
  empty:         { alignItems: "center", marginTop: 64, paddingHorizontal: 32 },
  emptyEmoji:    { fontSize: 52, marginBottom: 14 },
  emptyTitle:    { fontSize: 17, fontWeight: "700", textAlign: "center" },
  emptyDesc:     { fontSize: 14, marginTop: 6, textAlign: "center", lineHeight: 20 },
  createBtn:     { marginTop: 24, backgroundColor: "#f59e0b", borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  createBtnText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  grid:          { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  card:          { width: "48%", borderRadius: 12, overflow: "hidden", borderWidth: 0.5 },
  cardAccent:    { height: 3 },
  cardBody:      { padding: 12 },
  cardTitle:     { fontSize: 14, fontWeight: "700", marginBottom: 6 },
  cardContent:   { fontSize: 13, lineHeight: 18, marginBottom: 8 },
  cardDate:      { fontSize: 10, fontWeight: "500" },
});