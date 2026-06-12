import { useState } from "react";
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNotesStore } from "../../src/store/useNotesStore";
import { useThemeStore } from "../../src/store/useThemeStore";
import { Note, NoteColor, NOTE_COLORS } from "../../src/types/notes";

export default function NewNoteScreen() {
  const router  = useRouter();
  const { theme } = useThemeStore();
  const { addNote } = useNotesStore();

  const [title,   setTitle]   = useState("");
  const [content, setContent] = useState("");
  const [color,   setColor]   = useState<NoteColor>("#fef9c3");
  const [saving,  setSaving]  = useState(false);

  const accent = NOTE_COLORS.find((c) => c.bg === color)?.accent ?? "#f59e0b";

  async function handleSave() {
    if (!title.trim() && !content.trim()) {
      Alert.alert("Nota vazia", "Escreva algo antes de salvar.");
      return;
    }
    setSaving(true);
    try {
      const note: Note = {
        id:        Date.now().toString(),
        title:     title.trim(),
        content:   content.trim(),
        color,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await addNote(note);
      try { router.back(); } catch { router.replace("/notes"); }
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color }} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: accent }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => { try { router.back(); } catch { router.replace("/notes"); }}}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nova nota</Text>
        <TouchableOpacity
          style={[styles.saveBtn, saving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveBtnText}>{saving ? "..." : "Salvar"}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
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

        <View style={[styles.field, { backgroundColor: "rgba(255,255,255,0.6)", borderColor: accent + "44", minHeight: 160 }]}>
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

        <View style={[styles.field, { backgroundColor: "rgba(255,255,255,0.6)", borderColor: accent + "44" }]}>
          <Text style={[styles.fieldLabel, { color: accent }]}>Cor</Text>
          <View style={styles.colorRow}>
            {NOTE_COLORS.map((c) => (
              <TouchableOpacity
                key={c.bg}
                style={[
                  styles.colorDot,
                  { backgroundColor: c.bg, borderColor: c.accent },
                  color === c.bg && styles.colorDotSelected,
                ]}
                onPress={() => setColor(c.bg)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header:         { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14 },
  backBtn:        { width: 34, height: 34, borderRadius: 17, backgroundColor: "rgba(255,255,255,0.25)", alignItems: "center", justifyContent: "center" },
  backIcon:       { fontSize: 18, color: "#fff" },
  headerTitle:    { fontSize: 16, fontWeight: "600", color: "#fff" },
  saveBtn:        { backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6 },
  saveBtnText:    { color: "#fff", fontWeight: "700", fontSize: 14 },
  field:          { borderRadius: 12, padding: 14, borderWidth: 0.5 },
  fieldLabel:     { fontSize: 11, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 },
  titleInput:     { fontSize: 16, fontWeight: "500", paddingVertical: 2 },
  contentInput:   { fontSize: 15, lineHeight: 22, paddingVertical: 2, minHeight: 120 },
  colorRow:       { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  colorDot:       { width: 32, height: 32, borderRadius: 16, borderWidth: 1.5 },
  colorDotSelected: { borderWidth: 3, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
});