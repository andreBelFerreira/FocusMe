import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useNotesStore } from "../store/useNotesStore";
import { useThemeStore } from "../store/useThemeStore";
import { NOTE_COLORS } from "../types/notes";
import { isToday, isYesterday, format } from "date-fns";

function dateLabel(ts: number): string {
  const d = new Date(ts);
  if (isToday(d))     return `Hoje ${format(d, "HH:mm")}`;
  if (isYesterday(d)) return `Ontem ${format(d, "HH:mm")}`;
  return format(d, "dd/MM HH:mm");
}

export function RecentNotes() {
  const router  = useRouter();
  const { theme } = useThemeStore();
  const { notes, loaded, load } = useNotesStore();

  if (!loaded) { load(); return null; }

  const recent = notes.slice(0, 3);
  if (recent.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>📝 Notas recentes</Text>
        <TouchableOpacity onPress={() => router.push("/notes")}>
          <Text style={styles.seeAll}>Ver todas →</Text>
        </TouchableOpacity>
      </View>

      {recent.map((note) => {
        const colors = NOTE_COLORS.find((c) => c.bg === note.color) ?? NOTE_COLORS[5];
        return (
          <TouchableOpacity
            key={note.id}
            style={[styles.card, { backgroundColor: note.color, borderColor: colors.accent + "55" }]}
            onPress={() => router.push(`/notes/${note.id}`)}
            activeOpacity={0.8}
          >
            <View style={[styles.cardBar, { backgroundColor: colors.accent }]} />
            <View style={styles.cardBody}>
              {note.title ? (
                <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
                  {note.title}
                </Text>
              ) : null}
              <Text style={[styles.cardContent, { color: colors.text + "bb" }]} numberOfLines={2}>
                {note.content || "Nota vazia"}
              </Text>
              <Text style={[styles.cardDate, { color: colors.accent }]}>
                {dateLabel(note.updatedAt)}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity
        style={[styles.newNoteBtn, { backgroundColor: "#f59e0b" + "22", borderColor: "#f59e0b" + "44" }]}
        onPress={() => router.push("/notes/new")}
      >
        <Text style={[styles.newNoteBtnText, { color: "#f59e0b" }]}>+ Nova nota rápida</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:     { marginBottom: 16 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  sectionTitle:  { fontSize: 13, fontWeight: "600" },
  seeAll:        { fontSize: 12, color: "#f59e0b", fontWeight: "500" },
  card:          { flexDirection: "row", borderRadius: 10, marginBottom: 6, overflow: "hidden", borderWidth: 0.5 },
  cardBar:       { width: 3 },
  cardBody:      { flex: 1, padding: 10 },
  cardTitle:     { fontSize: 13, fontWeight: "700", marginBottom: 3 },
  cardContent:   { fontSize: 12, lineHeight: 17, marginBottom: 4 },
  cardDate:      { fontSize: 10, fontWeight: "500" },
  newNoteBtn:    { borderRadius: 10, padding: 11, alignItems: "center", borderWidth: 0.5, marginTop: 2 },
  newNoteBtnText:{ fontSize: 13, fontWeight: "600" },
});