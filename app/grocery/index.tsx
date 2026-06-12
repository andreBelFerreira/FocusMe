import { useEffect, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Alert, Modal, Pressable, TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGroceryStore } from "../../src/store/useGroceryStore";
import { useThemeStore } from "../../src/store/useThemeStore";
import { useSettingsStore } from "../../src/store/useSettingsStore";

export default function GroceryIndexScreen() {
  const router  = useRouter();
  const { theme } = useThemeStore();
  const accent  = useSettingsStore((s) => s.accentColor);
  const { lists, loaded, load, createList, deleteList } = useGroceryStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [newName,      setNewName]      = useState("");

  useEffect(() => { if (!loaded) load(); }, []);

  async function handleCreate() {
    if (!newName.trim()) return;
    const list = await createList(newName.trim());
    setNewName("");
    setModalVisible(false);
    router.push(`/grocery/${list.id}`);
  }

  function handleDelete(id: string, name: string) {
    Alert.alert("Excluir lista", `Deseja excluir "${name}"?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: () => deleteList(id) },
    ]);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top"]}>
      <View style={{ backgroundColor: "#10b981", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 }}>
        <Text style={styles.headerSub}>LISTA DE MERCADO</Text>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Minhas listas</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 40 }}>
        {lists.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🛒</Text>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>Nenhuma lista ainda</Text>
            <Text style={[styles.emptyDesc, { color: theme.textMuted }]}>Toque em + para criar sua primeira lista</Text>
            <TouchableOpacity style={styles.createBtn} onPress={() => setModalVisible(true)}>
              <Text style={styles.createBtnText}>Criar lista</Text>
            </TouchableOpacity>
          </View>
        ) : (
          lists.map((list) => {
            const total   = list.items.length;
            const checked = list.items.filter((i) => i.checked).length;
            const pct     = total > 0 ? checked / total : 0;
            return (
              <TouchableOpacity
                key={list.id}
                style={[styles.listCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => router.push(`/grocery/${list.id}`)}
                onLongPress={() => handleDelete(list.id, list.name)}
                activeOpacity={0.75}
              >
                <View style={styles.listCardHeader}>
                  <Text style={[styles.listName, { color: theme.text }]} numberOfLines={1}>{list.name}</Text>
                  <View style={styles.listBadges}>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{total} itens</Text>
                    </View>
                    {checked > 0 && (
                      <View style={[styles.badge, { backgroundColor: "#dcfce7" }]}>
                        <Text style={[styles.badgeText, { color: "#16a34a" }]}>{checked} ✓</Text>
                      </View>
                    )}
                  </View>
                </View>
                {total > 0 && (
                  <View style={[styles.progressBg, { backgroundColor: theme.border }]}>
                    <View style={[styles.progressFill, { width: `${pct * 100}%` }]} />
                  </View>
                )}
                <Text style={[styles.listHint, { color: theme.textMuted }]}>
                  {total === 0 ? "Lista vazia" : checked === total && total > 0 ? "✅ Tudo comprado!" : `${total - checked} itens restantes`}
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setModalVisible(false)} />
        <View style={[styles.modalBox, { backgroundColor: theme.card }]}>
          <Text style={[styles.modalTitle, { color: theme.text }]}>Nova lista</Text>
          <TextInput
            style={[styles.modalInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
            placeholder="Ex: Compras da semana..."
            placeholderTextColor={theme.textMuted}
            value={newName}
            onChangeText={setNewName}
            autoFocus
            maxLength={50}
            onSubmitEditing={handleCreate}
          />
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity style={[styles.modalCancel, { backgroundColor: theme.background }]} onPress={() => setModalVisible(false)}>
              <Text style={{ color: theme.textSecondary, fontWeight: "500" }}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalSave, { backgroundColor: "#10b981" }]} onPress={handleCreate}>
              <Text style={{ color: "#fff", fontWeight: "600" }}>Criar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerSub:     { fontSize: 11, color: "#a7f3d0", fontWeight: "500", letterSpacing: 0.05 },
  headerRow:     { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 6 },
  headerTitle:   { fontSize: 22, fontWeight: "700", color: "#fff" },
  addBtn:        { width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  addBtnText:    { fontSize: 24, color: "#fff", lineHeight: 30 },
  empty:         { alignItems: "center", marginTop: 64, paddingHorizontal: 32 },
  emptyEmoji:    { fontSize: 52, marginBottom: 14 },
  emptyTitle:    { fontSize: 17, fontWeight: "700", textAlign: "center" },
  emptyDesc:     { fontSize: 14, marginTop: 6, textAlign: "center", lineHeight: 20 },
  createBtn:     { marginTop: 24, backgroundColor: "#10b981", borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  createBtnText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  listCard:      { borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 0.5 },
  listCardHeader:{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 },
  listName:      { fontSize: 16, fontWeight: "600", flex: 1, marginRight: 8 },
  listBadges:    { flexDirection: "row", gap: 6 },
  badge:         { backgroundColor: "#f3f4f6", borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText:     { fontSize: 11, color: "#6b7280", fontWeight: "500" },
  progressBg:    { height: 4, borderRadius: 2, marginBottom: 8, overflow: "hidden" },
  progressFill:  { height: 4, backgroundColor: "#10b981", borderRadius: 2 },
  listHint:      { fontSize: 12 },
  overlay:       { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.4)" },
  modalBox:      { position: "absolute", top: "30%", left: 24, right: 24, borderRadius: 16, padding: 20 },
  modalTitle:    { fontSize: 16, fontWeight: "600", marginBottom: 14, textAlign: "center" },
  modalInput:    { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 15, marginBottom: 16 },
  modalCancel:   { flex: 1, padding: 12, borderRadius: 10, alignItems: "center" },
  modalSave:     { flex: 1, padding: 12, borderRadius: 10, alignItems: "center" },
});