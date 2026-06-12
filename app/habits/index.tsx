import { useEffect, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
  Modal, Pressable, TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { subDays, format } from "date-fns";
import { useHabitsStore, todayKey } from "../../src/store/useHabitsStore";
import { useThemeStore } from "../../src/store/useThemeStore";
import { Habit, HABIT_ICONS, HABIT_COLORS } from "../../src/types/habits";

function getStreak(completions: string[]): number {
  let streak = 0;
  let day = new Date();
  while (true) {
    const key = format(day, "yyyy-MM-dd");
    if (!completions.includes(key)) break;
    streak++;
    day = subDays(day, 1);
  }
  return streak;
}

function getLast7(completions: string[]): boolean[] {
  return Array.from({ length: 7 }, (_, i) => {
    const key = format(subDays(new Date(), 6 - i), "yyyy-MM-dd");
    return completions.includes(key);
  });
}

export default function HabitsScreen() {
  const router    = useRouter();
  const { theme } = useThemeStore();
  const { habits, loaded, load, addHabit, deleteHabit, toggleToday } = useHabitsStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [name,         setName]         = useState("");
  const [icon,         setIcon]         = useState("💧");
  const [color,        setColor]        = useState("#0ea5e9");

  useEffect(() => { if (!loaded) load(); }, []);

  const today    = todayKey();
  const done     = habits.filter((h) => h.completions.includes(today)).length;
  const total    = habits.length;
  const progress = total > 0 ? done / total : 0;

  function resetForm() { setName(""); setIcon("💧"); setColor("#0ea5e9"); }

  async function handleAdd() {
    if (!name.trim()) { Alert.alert("Nome obrigatório", "Dê um nome ao hábito."); return; }
    const habit: Habit = {
      id:          Date.now().toString(),
      name:        name.trim(),
      icon,
      color,
      createdAt:   Date.now(),
      completions: [],
    };
    await addHabit(habit);
    resetForm();
    setModalVisible(false);
  }

  function handleLongPress(habit: Habit) {
    Alert.alert(habit.name, "O que deseja fazer?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir hábito", style: "destructive", onPress: () => deleteHabit(habit.id) },
    ]);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top"]}>
      <View style={{ backgroundColor: "#0ea5e9", paddingHorizontal: 20, paddingTop: 14, paddingBottom: 16 }}>
        <Text style={styles.headerSub}>HÁBITOS DIÁRIOS</Text>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => { try { router.back(); } catch { router.replace("/(tabs)"); }}}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hoje</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>
        {total > 0 && (
          <>
            <View style={[styles.progressBg]}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            </View>
            <Text style={styles.progressLabel}>
              {done} de {total} hábitos concluídos
            </Text>
          </>
        )}
      </View>

      <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 40 }}>
        {habits.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🌱</Text>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>Nenhum hábito ainda</Text>
            <Text style={[styles.emptyDesc, { color: theme.textMuted }]}>
              Crie hábitos simples e marque todos os dias para construir uma rotina
            </Text>
            <TouchableOpacity style={styles.createBtn} onPress={() => setModalVisible(true)}>
              <Text style={styles.createBtnText}>Criar primeiro hábito</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {habits.map((habit) => {
              const isDone  = habit.completions.includes(today);
              const streak  = getStreak(habit.completions);
              const last7   = getLast7(habit.completions);
              return (
                <TouchableOpacity
                  key={habit.id}
                  style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
                  onPress={() => toggleToday(habit.id)}
                  onLongPress={() => handleLongPress(habit)}
                  activeOpacity={0.75}
                >
                  <View style={[styles.iconBox, { backgroundColor: habit.color + "22" }]}>
                    <Text style={styles.iconText}>{habit.icon}</Text>
                  </View>
                  <View style={styles.cardBody}>
                    <View style={styles.cardTop}>
                      <Text style={[styles.cardName, { color: theme.text }, isDone && styles.cardNameDone]}>
                        {habit.name}
                      </Text>
                      {streak > 0 && (
                        <View style={styles.streakBadge}>
                          <Text style={styles.streakText}>🔥 {streak}d</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.dotsRow}>
                      {last7.map((done, i) => (
                        <View
                          key={i}
                          style={[
                            styles.dot,
                            { backgroundColor: done ? habit.color : theme.border },
                          ]}
                        />
                      ))}
                    </View>
                  </View>
                  <View style={[
                    styles.checkCircle,
                    { borderColor: habit.color, backgroundColor: isDone ? habit.color : "transparent" },
                  ]}>
                    {isDone && <Text style={styles.checkMark}>✓</Text>}
                  </View>
                </TouchableOpacity>
              );
            })}

            {done === total && total > 0 && (
              <View style={[styles.allDoneCard]}>
                <Text style={styles.allDoneEmoji}>🎉</Text>
                <Text style={styles.allDoneTitle}>Todos os hábitos concluídos!</Text>
                <Text style={styles.allDoneSub}>Incrível! Você completou todos hoje.</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => { setModalVisible(false); resetForm(); }} />
        <View style={[styles.sheet, { backgroundColor: theme.card }]}>
          <View style={[styles.sheetHeader, { borderBottomColor: theme.border }]}>
            <TouchableOpacity onPress={() => { setModalVisible(false); resetForm(); }}>
              <Text style={{ color: theme.textSecondary, fontSize: 15 }}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={[styles.sheetTitle, { color: theme.text }]}>Novo hábito</Text>
            <TouchableOpacity onPress={handleAdd}>
              <Text style={{ color: "#0ea5e9", fontSize: 15, fontWeight: "600" }}>Salvar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }} keyboardShouldPersistTaps="handled">
            <View style={[styles.field, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>Nome do hábito</Text>
              <TextInput
                style={[styles.fieldInput, { color: theme.text }]}
                placeholder="Ex: Beber água, Meditar..."
                placeholderTextColor={theme.textMuted}
                value={name}
                onChangeText={setName}
                autoFocus
                maxLength={50}
              />
            </View>

            <View style={[styles.field, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>Ícone</Text>
              <View style={styles.iconsGrid}>
                {HABIT_ICONS.map((ic) => (
                  <TouchableOpacity
                    key={ic}
                    style={[
                      styles.iconOption,
                      { backgroundColor: icon === ic ? color + "33" : theme.background,
                        borderColor: icon === ic ? color : theme.border },
                    ]}
                    onPress={() => setIcon(ic)}
                  >
                    <Text style={{ fontSize: 20 }}>{ic}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={[styles.field, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>Cor</Text>
              <View style={styles.colorsRow}>
                {HABIT_COLORS.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.colorDot,
                      { backgroundColor: c },
                      color === c && styles.colorDotSelected,
                    ]}
                    onPress={() => setColor(c)}
                  />
                ))}
              </View>
            </View>

            <View style={[styles.preview, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>Pré-visualização</Text>
              <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, marginBottom: 0 }]}>
                <View style={[styles.iconBox, { backgroundColor: color + "22" }]}>
                  <Text style={styles.iconText}>{icon}</Text>
                </View>
                <View style={styles.cardBody}>
                  <View style={styles.cardTop}>
                    <Text style={[styles.cardName, { color: theme.text }]}>{name || "Nome do hábito"}</Text>
                  </View>
                  <View style={styles.dotsRow}>
                    {Array.from({ length: 7 }).map((_, i) => (
                      <View key={i} style={[styles.dot, { backgroundColor: theme.border }]} />
                    ))}
                  </View>
                </View>
                <View style={[styles.checkCircle, { borderColor: color }]} />
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerSub:      { fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: "500", letterSpacing: 0.05 },
  headerRow:      { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6, marginBottom: 10 },
  backBtn:        { width: 34, height: 34, borderRadius: 17, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  backIcon:       { fontSize: 18, color: "#fff" },
  headerTitle:    { fontSize: 20, fontWeight: "700", color: "#fff" },
  addBtn:         { width: 34, height: 34, borderRadius: 17, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  addBtnText:     { fontSize: 22, color: "#fff", lineHeight: 28 },
  progressBg:     { height: 5, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 3, overflow: "hidden" },
  progressFill:   { height: 5, backgroundColor: "#fff", borderRadius: 3 },
  progressLabel:  { fontSize: 11, color: "rgba(255,255,255,0.8)", marginTop: 4 },
  empty:          { alignItems: "center", marginTop: 64, paddingHorizontal: 32 },
  emptyEmoji:     { fontSize: 52, marginBottom: 14 },
  emptyTitle:     { fontSize: 17, fontWeight: "700", textAlign: "center" },
  emptyDesc:      { fontSize: 14, marginTop: 6, textAlign: "center", lineHeight: 20 },
  createBtn:      { marginTop: 24, backgroundColor: "#0ea5e9", borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  createBtnText:  { color: "#fff", fontWeight: "600", fontSize: 15 },
  card:           { flexDirection: "row", alignItems: "center", borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 0.5, gap: 10 },
  iconBox:        { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  iconText:       { fontSize: 20 },
  cardBody:       { flex: 1 },
  cardTop:        { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  cardName:       { fontSize: 14, fontWeight: "600", flex: 1 },
  cardNameDone:   { textDecorationLine: "line-through", opacity: 0.6 },
  streakBadge:    { backgroundColor: "#fef9c3", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  streakText:     { fontSize: 10, color: "#92400e", fontWeight: "600" },
  dotsRow:        { flexDirection: "row", gap: 4 },
  dot:            { width: 8, height: 8, borderRadius: 4 },
  checkCircle:    { width: 30, height: 30, borderRadius: 15, borderWidth: 2, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  checkMark:      { fontSize: 14, color: "#fff", fontWeight: "700" },
  allDoneCard:    { backgroundColor: "#0ea5e9", borderRadius: 14, padding: 20, alignItems: "center", marginTop: 8 },
  allDoneEmoji:   { fontSize: 40, marginBottom: 8 },
  allDoneTitle:   { fontSize: 16, fontWeight: "700", color: "#fff", marginBottom: 4 },
  allDoneSub:     { fontSize: 13, color: "rgba(255,255,255,0.8)" },
  overlay:        { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.4)" },
  sheet:          { position: "absolute", bottom: 0, left: 0, right: 0, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: "90%", paddingBottom: 34 },
  sheetHeader:    { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderBottomWidth: 0.5 },
  sheetTitle:     { fontSize: 15, fontWeight: "600" },
  field:          { borderRadius: 12, padding: 14, borderWidth: 0.5 },
  fieldLabel:     { fontSize: 11, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 },
  fieldInput:     { fontSize: 15, paddingVertical: 4 },
  iconsGrid:      { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  iconOption:     { width: 44, height: 44, borderRadius: 10, alignItems: "center", justifyContent: "center", borderWidth: 1.5 },
  colorsRow:      { flexDirection: "row", gap: 10 },
  colorDot:       { width: 30, height: 30, borderRadius: 15 },
  colorDotSelected: { borderWidth: 3, borderColor: "#fff", shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  preview:        { borderRadius: 12, padding: 14, borderWidth: 0.5 },
});