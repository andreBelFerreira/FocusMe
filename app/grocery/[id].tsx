import { useEffect, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, Alert, Modal, Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGroceryStore } from "../../src/store/useGroceryStore";
import { useThemeStore } from "../../src/store/useThemeStore";
import { GroceryItem, CATEGORIES, QUANTITIES } from "../../src/types/grocery";

export default function GroceryListScreen() {
  const { id }   = useLocalSearchParams<{ id: string }>();
  const router   = useRouter();
  const { theme } = useThemeStore();
  const { lists, loaded, load, addItem, toggleItem, deleteItem, clearChecked } = useGroceryStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [itemName,     setItemName]     = useState("");
  const [quantity,     setQuantity]     = useState("1 un");
  const [customQty,    setCustomQty]    = useState("");
  const [category,     setCategory]     = useState("outros");
  const [showCustom,   setShowCustom]   = useState(false);

  useEffect(() => { if (!loaded) load(); }, []);

  const list = lists.find((l) => l.id === id);
  if (!list) return null;

  const grouped = CATEGORIES.map((cat) => ({
    ...cat,
    items: list.items.filter((i) => i.category === cat.value),
  })).filter((g) => g.items.length > 0);

  const total   = list.items.length;
  const checked = list.items.filter((i) => i.checked).length;
  const pct     = total > 0 ? Math.round((checked / total) * 100) : 0;

  function resetForm() {
    setItemName(""); setQuantity("1 un"); setCustomQty("");
    setCategory("outros"); setShowCustom(false);
  }

  async function handleAdd() {
    if (!itemName.trim()) { Alert.alert("Nome obrigatório", "Informe o nome do item."); return; }
    const finalQty = quantity === "Custom" ? customQty.trim() || "1 un" : quantity;
    const item: GroceryItem = {
      id: Date.now().toString(),
      name: itemName.trim(),
      quantity: finalQty,
      category,
      checked: false,
      createdAt: Date.now(),
    };
    await addItem(list.id, item);
    resetForm();
    setModalVisible(false);
  }

  function handleLongPress(item: GroceryItem) {
    Alert.alert(item.name, "O que deseja fazer?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir item", style: "destructive", onPress: () => deleteItem(list.id, item.id) },
    ]);
  }

  function handleClearChecked() {
    if (checked === 0) return;
    Alert.alert("Limpar marcados", `Remover ${checked} item(ns) já comprado(s)?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Limpar", style: "destructive", onPress: () => clearChecked(list.id) },
    ]);
  }

  function renderItem(item: GroceryItem) {
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.item, { backgroundColor: theme.card, borderColor: theme.border }, item.checked && styles.itemChecked]}
        onPress={() => toggleItem(list.id, item.id)}
        onLongPress={() => handleLongPress(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
          {item.checked && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={[styles.itemName, { color: theme.text }, item.checked && styles.itemNameChecked]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.itemQty, { color: theme.textMuted }]}>{item.quantity}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top"]}>
      <View style={{ backgroundColor: "#10b981", paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 }}>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.backBtn} onPress={() => { try { router.back(); } catch { router.replace("/grocery"); }}}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClearChecked} disabled={checked === 0} style={{ opacity: checked === 0 ? 0.4 : 1 }}>
            <Text style={styles.clearText}>Limpar ✓</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.listTitle} numberOfLines={1}>{list.name}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBadge}><Text style={styles.statText}>{total} itens</Text></View>
          <View style={styles.statBadge}><Text style={styles.statText}>{pct}% concluído</Text></View>
        </View>
        {total > 0 && (
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${pct}%` }]} />
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 100 }}>
        {list.items.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🛒</Text>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>Lista vazia</Text>
            <Text style={[styles.emptyDesc, { color: theme.textMuted }]}>Adicione itens tocando no botão abaixo</Text>
          </View>
        ) : (
          grouped.map((group) => (
            <View key={group.value}>
              <Text style={[styles.groupLabel, { color: theme.textSecondary }]}>{group.label}</Text>
              {group.items.map(renderItem)}
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.fab}>
        <TouchableOpacity style={styles.fabBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.fabText}>+ Adicionar item</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => { setModalVisible(false); resetForm(); }} />
        <View style={[styles.sheet, { backgroundColor: theme.card }]}>
          <View style={[styles.sheetHeader, { borderBottomColor: theme.border }]}>
            <TouchableOpacity onPress={() => { setModalVisible(false); resetForm(); }}>
              <Text style={{ color: theme.textSecondary, fontSize: 15 }}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={[styles.sheetTitle, { color: theme.text }]}>Novo item</Text>
            <TouchableOpacity onPress={handleAdd}>
              <Text style={{ color: "#10b981", fontSize: 15, fontWeight: "600" }}>Adicionar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }} keyboardShouldPersistTaps="handled">
            <View style={[styles.field, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>Nome do item</Text>
              <TextInput
                style={[styles.fieldInput, { color: theme.text }]}
                placeholder="Ex: Arroz, Leite, Sabão..."
                placeholderTextColor={theme.textMuted}
                value={itemName}
                onChangeText={setItemName}
                autoFocus
                maxLength={60}
              />
            </View>

            <View style={[styles.field, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>Quantidade</Text>
              <View style={styles.pills}>
                {QUANTITIES.map((q) => (
                  <TouchableOpacity
                    key={q}
                    style={[styles.pill, quantity === q && styles.pillActive]}
                    onPress={() => { setQuantity(q); setShowCustom(q === "Custom"); }}
                  >
                    <Text style={[styles.pillText, quantity === q && styles.pillTextActive]}>{q}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {showCustom && (
                <TextInput
                  style={[styles.fieldInput, { color: theme.text, marginTop: 8, borderTopWidth: 0.5, borderTopColor: theme.border, paddingTop: 8 }]}
                  placeholder="Ex: 300ml, 1 dúzia..."
                  placeholderTextColor={theme.textMuted}
                  value={customQty}
                  onChangeText={setCustomQty}
                  maxLength={20}
                />
              )}
            </View>

            <View style={[styles.field, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>Categoria</Text>
              <View style={styles.pills}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.value}
                    style={[styles.pill, category === cat.value && styles.pillActive]}
                    onPress={() => setCategory(cat.value)}
                  >
                    <Text style={[styles.pillText, category === cat.value && styles.pillTextActive]}>{cat.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerActions:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  backBtn:         { width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  backIcon:        { fontSize: 18, color: "#fff" },
  clearText:       { fontSize: 13, color: "#fff", fontWeight: "500" },
  listTitle:       { fontSize: 22, fontWeight: "700", color: "#fff", marginBottom: 8 },
  statsRow:        { flexDirection: "row", gap: 8, marginBottom: 10 },
  statBadge:       { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  statText:        { fontSize: 11, color: "#fff", fontWeight: "500" },
  progressBg:      { height: 4, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 2, overflow: "hidden" },
  progressFill:    { height: 4, backgroundColor: "#fff", borderRadius: 2 },
  empty:           { alignItems: "center", marginTop: 60 },
  emptyEmoji:      { fontSize: 48, marginBottom: 12 },
  emptyTitle:      { fontSize: 17, fontWeight: "700" },
  emptyDesc:       { fontSize: 14, marginTop: 6, textAlign: "center" },
  groupLabel:      { fontSize: 11, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.05, marginTop: 14, marginBottom: 6, paddingLeft: 2 },
  item:            { flexDirection: "row", alignItems: "center", borderRadius: 10, padding: 12, marginBottom: 6, borderWidth: 0.5, gap: 10 },
  itemChecked:     { opacity: 0.5 },
  checkbox:        { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: "#d1d5db", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  checkboxChecked: { backgroundColor: "#10b981", borderColor: "#10b981" },
  checkmark:       { fontSize: 12, color: "#fff", fontWeight: "700" },
  itemName:        { flex: 1, fontSize: 14, fontWeight: "500" },
  itemNameChecked: { textDecorationLine: "line-through" },
  itemQty:         { fontSize: 12 },
  fab:             { position: "absolute", bottom: 24, left: 16, right: 16 },
  fabBtn:          { backgroundColor: "#10b981", borderRadius: 14, padding: 15, alignItems: "center" },
  fabText:         { color: "#fff", fontSize: 15, fontWeight: "600" },
  overlay:         { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.4)" },
  sheet:           { position: "absolute", bottom: 0, left: 0, right: 0, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: "85%", paddingBottom: 34 },
  sheetHeader:     { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderBottomWidth: 0.5 },
  sheetTitle:      { fontSize: 15, fontWeight: "600" },
  field:           { borderRadius: 12, padding: 14, borderWidth: 0.5 },
  fieldLabel:      { fontSize: 11, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 },
  fieldInput:      { fontSize: 15, paddingVertical: 4 },
  pills:           { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  pill:            { backgroundColor: "#f3f4f6", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  pillActive:      { backgroundColor: "#10b981" },
  pillText:        { fontSize: 12, color: "#6b7280", fontWeight: "500" },
  pillTextActive:  { color: "#fff" },
});