import { useEffect, useState } from "react";
import {
  View, Text, ScrollView, TextInput,
  StyleSheet, Alert, Modal, Pressable, TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSettingsStore } from "../../src/store/useSettingsStore";
import { useThemeStore } from "../../src/store/useThemeStore";
import { SettingRow } from "../../src/components/SettingRow";
import { ColorAccentPicker } from "../../src/components/ColorAccentPicker";
import { ReminderPicker } from "../../src/components/ReminderPicker";
import { TimePicker } from "../../src/components/TimePicker";

const REMINDER_LABELS: Record<number, string> = {
  0: "Nenhum", 5: "5 min", 15: "15 min", 30: "30 min", 60: "1 hora", 1440: "1 dia",
};

export default function SettingsScreen() {
  const settings = useSettingsStore();
  const { dark, theme, setDark } = useThemeStore();
  const router = useRouter();

  const [colorPickerVisible,   setColorPickerVisible]   = useState(false);
  const [nameModalVisible,     setNameModalVisible]      = useState(false);
  const [reminderModalVisible, setReminderModalVisible]  = useState(false);
  const [birthModalVisible,    setBirthModalVisible]     = useState(false);
  const [nameInput,            setNameInput]             = useState("");
  const [birthDate,            setBirthDate]             = useState(new Date(1990, 0, 1));

  useEffect(() => { settings.load(); }, []);

  useEffect(() => {
    if (settings.birthdate) {
      const parsed = new Date(settings.birthdate);
      if (!isNaN(parsed.getTime())) setBirthDate(parsed);
    }
  }, [settings.birthdate]);

  function handleToggleDark(v: boolean) { setDark(v); settings.update({ darkMode: v }); }
  function handleEditName() { setNameInput(settings.name); setNameModalVisible(true); }
  function handleSaveName() { settings.update({ name: nameInput.trim() }); setNameModalVisible(false); }
  function handleSaveBirth(date: Date) { setBirthDate(date); settings.update({ birthdate: date.toISOString() }); setBirthModalVisible(false); }

  function handleClearAll() {
    Alert.alert("Apagar todos os dados", "Isso irá remover todos os compromissos e configurações.", [
      { text: "Cancelar", style: "cancel" },
      { text: "Apagar tudo", style: "destructive", onPress: async () => {
        await AsyncStorage.clear(); settings.reset();
        Alert.alert("Pronto", "Todos os dados foram apagados.");
      }},
    ]);
  }

  const birthdateLabel = settings.birthdate
    ? format(new Date(settings.birthdate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : "—";

  const greeting = settings.name ? `Olá, ${settings.name}!` : "Olá!";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

        <View style={{ backgroundColor: settings.accentColor, padding: 20, paddingBottom: 24 }}>
          <Text style={styles.headerSub}>CONFIGURAÇÕES</Text>
          <View style={styles.profileRow}>
            <View style={styles.avatar}><Text style={styles.avatarEmoji}>🧠</Text></View>
            <View>
              <Text style={styles.greeting}>{greeting}</Text>
              <Text style={styles.since}>Membro desde junho 2025</Text>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 14, marginTop: 20 }}>
          <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>Perfil</Text>
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <SettingRow type="press" icon="👤" label="Nome" value={settings.name || "—"} onPress={handleEditName} />
            <SettingRow type="press" icon="🎂" label="Data de nascimento" value={birthdateLabel} onPress={() => setBirthModalVisible(true)} border={false} />
          </View>
        </View>

        <View style={{ paddingHorizontal: 14, marginTop: 20 }}>
          <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>Aparência</Text>
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <SettingRow type="toggle" icon="🌙" label="Tema escuro" value={dark} onToggle={handleToggleDark} />
            <SettingRow type="color" icon="🎨" label="Cor do app" color={settings.accentColor} onPress={() => setColorPickerVisible(true)} border={false} />
          </View>
        </View>

        <View style={{ paddingHorizontal: 14, marginTop: 20 }}>
          <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>Notificações</Text>
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <SettingRow type="toggle" icon="🔔" label="Ativar lembretes" value={settings.notificationsEnabled} onToggle={(v) => settings.update({ notificationsEnabled: v })} />
            <SettingRow type="press" icon="⏰" label="Lembrete padrão" value={REMINDER_LABELS[settings.defaultReminder] ?? `${settings.defaultReminder} min`} onPress={() => setReminderModalVisible(true)} />
            <SettingRow type="press" icon="🧪" label="Testar notificações" onPress={() => router.push("/notifications-debug")} border={false} />
          </View>
        </View>

        <View style={{ paddingHorizontal: 14, marginTop: 20 }}>
          <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>Dados</Text>
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <SettingRow type="press" icon="📤" label="Exportar dados" onPress={() => Alert.alert("Em breve", "Exportação disponível em breve.")} />
            <SettingRow type="press" icon="🗑️" label="Apagar todos os dados" onPress={handleClearAll} danger border={false} />
          </View>
        </View>

        <Text style={[styles.footer, { color: theme.textMuted }]}>FocusMe v1.0.0 · Feito com 💜 para mentes TDAH</Text>
      </ScrollView>

      <ColorAccentPicker visible={colorPickerVisible} selected={settings.accentColor} onSelect={(c) => settings.update({ accentColor: c })} onClose={() => setColorPickerVisible(false)} />

      <Modal visible={nameModalVisible} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setNameModalVisible(false)} />
        <View style={[styles.modalBox, { backgroundColor: theme.card }]}>
          <Text style={[styles.modalTitle, { color: theme.text }]}>Seu nome</Text>
          <TextInput
            style={[styles.modalInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
            value={nameInput} onChangeText={setNameInput}
            placeholder="Como quer ser chamado?" placeholderTextColor={theme.textMuted}
            autoFocus maxLength={40}
          />
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity style={[styles.modalCancel, { backgroundColor: theme.background }]} onPress={() => setNameModalVisible(false)}>
              <Text style={{ fontSize: 14, color: theme.textSecondary, fontWeight: "500" }}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalSave, { backgroundColor: settings.accentColor }]} onPress={handleSaveName}>
              <Text style={{ fontSize: 14, color: "#fff", fontWeight: "600" }}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={birthModalVisible} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setBirthModalVisible(false)} />
        <View style={[styles.birthSheet, { backgroundColor: theme.card }]}>
          <View style={[styles.birthHeader, { borderBottomColor: theme.border }]}>
            <TouchableOpacity onPress={() => setBirthModalVisible(false)}>
              <Text style={{ fontSize: 15, color: theme.textSecondary }}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={[styles.birthTitle, { color: theme.text }]}>Data de nascimento</Text>
            <TouchableOpacity onPress={() => handleSaveBirth(birthDate)}>
              <Text style={{ fontSize: 15, color: settings.accentColor, fontWeight: "600" }}>Confirmar</Text>
            </TouchableOpacity>
          </View>
          <TimePicker label="" mode="date" value={birthDate} onChange={setBirthDate} hideButton />
        </View>
      </Modal>

      <Modal visible={reminderModalVisible} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setReminderModalVisible(false)} />
        <View style={[styles.bottomSheet, { backgroundColor: theme.card }]}>
          <Text style={[styles.modalTitle, { color: theme.text }]}>Lembrete padrão</Text>
          <ReminderPicker selected={settings.defaultReminder} onSelect={(v) => { settings.update({ defaultReminder: v }); setReminderModalVisible(false); }} />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerSub:   { fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: "600", letterSpacing: 0.08 },
  profileRow:  { flexDirection: "row", alignItems: "center", gap: 14, marginTop: 14 },
  avatar:      { width: 52, height: 52, borderRadius: 26, backgroundColor: "rgba(255,255,255,0.25)", alignItems: "center", justifyContent: "center" },
  avatarEmoji: { fontSize: 26 },
  greeting:    { fontSize: 18, fontWeight: "600", color: "#fff" },
  since:       { fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 },
  sectionTitle:{ fontSize: 11, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.08, marginBottom: 6, paddingLeft: 4 },
  card:        { borderRadius: 12, overflow: "hidden", borderWidth: 0.5 },
  footer:      { textAlign: "center", fontSize: 12, marginTop: 32, paddingHorizontal: 20 },
  overlay:     { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)" },
  modalBox:    { position: "absolute", top: "30%", left: 24, right: 24, borderRadius: 16, padding: 20 },
  modalTitle:  { fontSize: 16, fontWeight: "600", marginBottom: 14, textAlign: "center" },
  modalInput:  { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 15, marginBottom: 16 },
  modalCancel: { flex: 1, padding: 12, borderRadius: 10, alignItems: "center" },
  modalSave:   { flex: 1, padding: 12, borderRadius: 10, alignItems: "center" },
  birthSheet:  { position: "absolute", bottom: 0, left: 0, right: 0, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 40 },
  birthHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderBottomWidth: 0.5 },
  birthTitle:  { fontSize: 15, fontWeight: "600" },
  bottomSheet: { position: "absolute", bottom: 0, left: 0, right: 0, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 },
});