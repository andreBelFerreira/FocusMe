import { useEffect, useState } from "react";
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNotesStore } from "../../src/store/useNotesStore";
import { useThemeStore } from "../../src/store/useThemeStore";
import { NoteColor, NOTE_COLORS } from "../../src/types/notes";

export default function NoteDetailScreen() {
  const { id }   = useLocalSearchParams<{ id: string }>();
  const router   = useRouter();
  const { theme } = useThemeStore();
  const { notes, updateNote, deleteNote } = useNotesStore();

  const note = notes.find((n) => n.id === id);

  const [editing,  setEditing]  = useState(false);
  const [title,    setTitle]    = useState(note?.title ?? "");
  const [content,  setContent]  = useState(note?.content ?? "");
  const [color,    setColor]    = useState<NoteColor>((note?.color as NoteColor) ?? "#fef9c3");
  const [saving,   setSaving]   = useState(false);

  useEffect(() => {
    if (note) { setTitle(note.title); setContent(note.content); setColor(note.color as NoteColor); }
  }, [note]);

  if (!note) return null;

  const colors = NOTE_COLORS.find((c) => c.bg === color) ?? NOTE_COLORS[5];

  async function handleSave() {
    if (!title.trim() && !content.trim()) {
      Alert.alert("Nota vazia", "Escreva algo antes de salvar.");
      return;
    }
    setSaving(true);
    try {
      await updateNote({ ...note, title, content, color, updatedAt: Date.now() });
      setEditing(false);
    } finally { setSaving(false); }
  }

  function handleDelete() {
    Alert.alert("Excluir nota", "Deseja excluir esta nota?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: async () => {
        await deleteNote(note.id);
        try { router.back(); } catch { router.replace("/notes"); }
      }},
    ]);
  }

  const bgColor = editing ? color : note.color;
  const accent  = colors.accent;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: accent }]}>
        {editing ? (
          <>
            <TouchableOpacity style={styles.headerBtn} onPress={() => { setEditing(false); setTitle(note.title); setContent(note.content); setColor(note.color as NoteColor); }}>
              <Text style={styles.headerBtnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.headerBtn, styles.headerBtnSave]} onPress={handleSave} disabled={saving}>
              <Text style={[styles.headerBtnText, { fontWeight: "700" }]}>{saving ? "..." : "Salvar"}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.iconBtn} onPress={() => { try { router.back(); } catch { router.replace("/notes"); }}}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity style={styles.iconBtn} onPress={() => setEditing(true)}>
                <Text style={{ fontSize: 16 }}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={handleDelete}>
                <Text style={{ fontSize: 16 }}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        {editing ? (
          <>
            <View style={[styles.field, { backgroundColor: "rgba(255,255,255,0.6)", borderColor: accent + "44" }]}>
              <Text style={[styles.fieldLabel, { color: accent }]}>Título</Text>
              <TextInput
                style={[styles.titleInput, { color: "#111827" }]}
                placeholder="Título da nota..."
                placeholderTextColor="#9ca3af"
                value={title}
                onChangeText={setTitle}
                maxLength={80}
                autoFocus
              />
            </View>

            <View style={[styles.field, { marginTop: 12, backgroundColor: "rgba(255,255,255,0.6)", borderColor: accent + "44", minHeight: 160 }]}>
              <Text style={[styles.fieldLabel, { color: accent }]}>Conteúdo</Text>
              <TextInput
                style={[styles.contentInput, { color: "#111827" }]}
                placeholder="Escreva aqui..."
                placeholderTextColor="#9ca3af"
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
                maxLength={2000}
              />
            </View>

            <View style={[styles.field, { marginTop: 12, backgroundColor: "rgba(255,255,255,0.6)", borderColor: accent + "44" }]}>
              <Text style={[styles.fieldLabel, { color: accent }]}>Cor</Text>
              <View style={styles.colorRow}>
                {NOTE_COLORS.map((c) => (
                  <TouchableOpacity
                    key={c.bg}
                    style={[styles.colorDot, { backgroundColor: c.bg, borderColor: c.accent }, color === c.bg && styles.colorDotSelected]}
                    onPress={() => setColor(c.bg)}
                  />
                ))}
              </View>
            </View>
          </>
        ) : (
          <View style={[styles.viewCard, { backgroundColor: "rgba(255,255,255,0.5)", borderColor: accent + "44" }]}>
            {note.title ? (
              <Text style={[styles.viewTitle, { color: colors.text }]}>{note.title}</Text>
            ) : null}
            <Text style={[styles.viewContent, { color: colors.text + "dd" }]}>
              {note.content || "Nota vazia"}
            </Text>
            <Text style={[styles.viewDate, { color: accent }]}>
              Criada {format(new Date(note.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              {note.updatedAt !== note.createdAt
                ? `\nEditada ${format(new Date(note.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`
                : ""}
            </Text>
            <TouchableOpacity style={[styles.editBtn, { backgroundColor: accent }]} onPress={() => setEditing(true)}>
              <Text style={styles.editBtnText}>Editar nota</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header:          { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14 },
  iconBtn:         { width: 34, height: 34, borderRadius: 17, backgroundColor: "rgba(255,255,255,0.25)", alignItems: "center", justifyContent: "center" },
  backIcon:        { fontSize: 18, color: "#fff" },
  headerBtn:       { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6 },
  headerBtnSave:   { backgroundColor: "rgba(255,255,255,0.35)" },
  headerBtnText:   { fontSize: 13, color: "#fff" },
  field:           { borderRadius: 12, padding: 14, borderWidth: 0.5 },
  fieldLabel:      { fontSize: 11, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 },
  titleInput:      { fontSize: 16, fontWeight: "500", paddingVertical: 2 },
  contentInput:    { fontSize: 15, lineHeight: 22, paddingVertical: 2, minHeight: 120 },
  colorRow:        { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  colorDot:        { width: 32, height: 32, borderRadius: 16, borderWidth: 1.5 },
  colorDotSelected:{ borderWidth: 3, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  viewCard:        { borderRadius: 12, padding: 16, borderWidth: 0.5 },
  viewTitle:       { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  viewContent:     { fontSize: 15, lineHeight: 24, marginBottom: 16 },
  viewDate:        { fontSize: 11, marginBottom: 20, lineHeight: 18 },
  editBtn:         { borderRadius: 10, padding: 13, alignItems: "center" },
  editBtnText:     { color: "#fff", fontSize: 14, fontWeight: "600" },
});