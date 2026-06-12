import { useEffect, useState } from "react";
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  Switch, StyleSheet, Alert, ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEventStore } from "../../src/store/useEventStore";
import { useThemeStore } from "../../src/store/useThemeStore";
import { getEventById } from "../../src/db/events";
import { ColorPicker } from "../../src/components/ColorPicker";
import { ReminderPicker } from "../../src/components/ReminderPicker";
import { FormField } from "../../src/components/FormField";
import { TimePicker } from "../../src/components/TimePicker";
import { formatDuration, reminderLabel } from "../../src/utils/duration";
import { Event, EventColor } from "../../src/types";

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router  = useRouter();
  const { editEvent, removeEvent } = useEventStore();
  const { theme } = useThemeStore();

  const [event,       setEvent]       = useState<Event | null>(null);
  const [editing,     setEditing]     = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [description, setDescription] = useState("");
  const [date,        setDate]        = useState(new Date());
  const [startTime,   setStartTime]   = useState(new Date());
  const [endTime,     setEndTime]     = useState(new Date());
  const [allDay,      setAllDay]      = useState(false);
  const [color,       setColor]       = useState<EventColor>("#6366f1");
  const [notify,      setNotify]      = useState(15);

  useEffect(() => {
    if (!id) return;
    getEventById(id).then((ev) => {
      if (!ev) return;
      setEvent(ev);
      setDescription(ev.description);
      setDate(new Date(ev.start_at));
      setStartTime(new Date(ev.start_at));
      setEndTime(new Date(ev.end_at));
      setAllDay(ev.all_day === 1);
      setColor(ev.color as EventColor);
      setNotify(ev.notify_before);
    });
  }, [id]);

  function buildTimestamp(base: Date, time: Date): number {
    const r = new Date(base);
    r.setHours(time.getHours(), time.getMinutes(), 0, 0);
    return r.getTime();
  }

  async function handleSave() {
    if (!event) return;
    const start_at = allDay ? new Date(date).setHours(0,0,0,0) : buildTimestamp(date, startTime);
    const end_at   = allDay ? new Date(date).setHours(23,59,0,0) : buildTimestamp(date, endTime);
    if (!allDay && end_at <= start_at) { Alert.alert("Horário inválido", "O fim deve ser após o início."); return; }
    setSaving(true);
    try {
      const updated: Event = { ...event, description, start_at, end_at, all_day: allDay ? 1 : 0, color, notify_before: notify };
      await editEvent(updated);
      setEvent(updated);
      setEditing(false);
    } catch { Alert.alert("Erro", "Não foi possível salvar."); }
    finally { setSaving(false); }
  }

  function handleDelete() {
    Alert.alert("Excluir compromisso", `Deseja excluir "${event?.title}"?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: async () => {
        if (!event) return;
        await removeEvent(event.id);
        try { router.back(); } catch { router.replace("/(tabs)"); }
      }},
    ]);
  }

  if (!event) return <View style={{ flex:1, alignItems:"center", justifyContent:"center", backgroundColor: theme.background }}><ActivityIndicator color="#6366f1" size="large" /></View>;

  const startDate = new Date(event.start_at);
  const endDate   = new Date(event.end_at);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["bottom"]}>
      <View style={[styles.header, { backgroundColor: event.color }]}>
        <View style={styles.headerActions}>
          {editing ? (
            <>
              <TouchableOpacity style={styles.headerBtn} onPress={() => setEditing(false)}>
                <Text style={styles.headerBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.headerBtn, styles.headerBtnSave]} onPress={handleSave} disabled={saving}>
                <Text style={[styles.headerBtnText, { fontWeight: "700" }]}>{saving ? "Salvando..." : "Salvar"}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.headerIconBtn} onPress={() => { try { router.back(); } catch { router.replace("/(tabs)"); }}}>
                <Text style={styles.headerIcon}>←</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <TouchableOpacity style={styles.headerIconBtn} onPress={() => setEditing(true)}><Text style={styles.headerIcon}>✏️</Text></TouchableOpacity>
                <TouchableOpacity style={styles.headerIconBtn} onPress={handleDelete}><Text style={styles.headerIcon}>🗑️</Text></TouchableOpacity>
              </View>
            </>
          )}
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "rgba(255,255,255,0.8)" }} />
          <Text style={styles.titleText} numberOfLines={2}>{event.title}</Text>
        </View>
        {editing
          ? <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>Título não pode ser editado</Text>
          : <Text style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>{format(startDate, "EEEE, d 'de' MMMM", { locale: ptBR })}</Text>
        }
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        {!editing ? (
          <>
            <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
              <Text style={styles.infoIcon}>🕐</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoMain, { color: theme.text }]}>
                  {event.all_day === 1 ? "Dia inteiro" : `${format(startDate,"HH:mm")} – ${format(endDate,"HH:mm")}`}
                </Text>
                {event.all_day === 0 && <Text style={[styles.infoSub, { color: theme.textMuted }]}>{formatDuration(event.start_at, event.end_at)}</Text>}
              </View>
            </View>
            {!!event.description && (
              <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
                <Text style={styles.infoIcon}>📝</Text>
                <Text style={[styles.infoMain, { color: theme.text, flex: 1 }]}>{event.description}</Text>
              </View>
            )}
            <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
              <Text style={styles.infoIcon}>🔔</Text>
              <Text style={[styles.infoMain, { color: theme.text }]}>{reminderLabel(event.notify_before)}</Text>
            </View>
            <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
              <Text style={styles.infoIcon}>🎨</Text>
              <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: event.color }} />
            </View>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: event.color }]} onPress={() => setEditing(true)}>
              <Text style={styles.actionBtnText}>Editar compromisso</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.deleteBtn, { backgroundColor: theme.card, borderColor: "#fca5a5" }]} onPress={handleDelete}>
              <Text style={styles.deleteBtnText}>Excluir compromisso</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <FormField label="Descrição">
              <TextInput
                style={{ fontSize: 15, color: theme.text, paddingVertical: 4, minHeight: 72, textAlignVertical: "top" }}
                placeholder="Local, detalhes, observações..."
                placeholderTextColor={theme.textMuted}
                value={description}
                onChangeText={setDescription}
                multiline numberOfLines={3} maxLength={300}
              />
            </FormField>
            <FormField label="Data e hora" style={{ marginTop: 10 }}>
              <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
                <TimePicker label="Data"   mode="date" value={date}      onChange={setDate}      />
                {!allDay && <>
                  <TimePicker label="Início" mode="time" value={startTime} onChange={setStartTime} />
                  <TimePicker label="Fim"    mode="time" value={endTime}   onChange={setEndTime}   />
                </>}
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTopWidth: 0.5, borderTopColor: theme.border }}>
                <Text style={{ fontSize: 14, color: theme.text }}>Dia inteiro</Text>
                <Switch value={allDay} onValueChange={setAllDay} trackColor={{ false: "#e5e7eb", true: "#6366f1" }} thumbColor="#ffffff" />
              </View>
            </FormField>
            <FormField label="Cor" style={{ marginTop: 10 }}>
              <ColorPicker selected={color} onSelect={setColor} />
            </FormField>
            <FormField label="Lembrete" style={{ marginTop: 10 }}>
              <ReminderPicker selected={notify} onSelect={setNotify} />
            </FormField>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: "#6366f1", marginTop: 20, opacity: saving ? 0.6 : 1 }]}
              onPress={handleSave} disabled={saving}
            >
              <Text style={styles.actionBtnText}>{saving ? "Salvando..." : "Salvar alterações"}</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header:        { padding: 16, paddingTop: 12 },
  headerActions: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  headerIconBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  headerIcon:    { fontSize: 16 },
  headerBtn:     { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6 },
  headerBtnSave: { backgroundColor: "rgba(255,255,255,0.35)" },
  headerBtnText: { fontSize: 13, color: "#fff" },
  titleText:     { fontSize: 20, fontWeight: "700", color: "#fff", flex: 1 },
  infoRow:       { flexDirection: "row", alignItems: "flex-start", gap: 14, paddingVertical: 14, borderBottomWidth: 0.5 },
  infoIcon:      { fontSize: 20, width: 28, textAlign: "center" },
  infoMain:      { fontSize: 15 },
  infoSub:       { fontSize: 12, marginTop: 2 },
  actionBtn:     { borderRadius: 12, padding: 15, alignItems: "center", marginTop: 24 },
  actionBtnText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  deleteBtn:     { borderRadius: 12, padding: 15, alignItems: "center", marginTop: 10, borderWidth: 0.5 },
  deleteBtnText: { color: "#ef4444", fontSize: 15, fontWeight: "500" },
});