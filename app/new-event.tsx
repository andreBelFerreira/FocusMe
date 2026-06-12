import { useState } from "react";
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  Switch, StyleSheet, Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { v4 as uuidv4 } from "uuid";
import { addHours } from "date-fns";
import { useEventStore } from "../src/store/useEventStore";
import { useThemeStore } from "../src/store/useThemeStore";
import { ColorPicker } from "../src/components/ColorPicker";
import { ReminderPicker } from "../src/components/ReminderPicker";
import { FormField } from "../src/components/FormField";
import { TimePicker } from "../src/components/TimePicker";
import { EventColor } from "../src/types";

function roundToNextHour(date: Date): Date {
  const next = new Date(date);
  next.setMinutes(0, 0, 0);
  next.setHours(next.getHours() + 1);
  return next;
}

export default function NewEventScreen() {
  const router = useRouter();
  const { addEvent } = useEventStore();
  const { theme } = useThemeStore();

  const defaultStart = roundToNextHour(new Date());
  const defaultEnd = addHours(defaultStart, 1);

  const [title,        setTitle]        = useState("");
  const [description,  setDescription]  = useState("");
  const [date,         setDate]         = useState(new Date());
  const [startTime,    setStartTime]    = useState(defaultStart);
  const [endTime,      setEndTime]      = useState(defaultEnd);
  const [allDay,       setAllDay]       = useState(false);
  const [color,        setColor]        = useState<EventColor>("#6366f1");
  const [notifyBefore, setNotifyBefore] = useState(15);
  const [saving,       setSaving]       = useState(false);

  function buildTimestamp(base: Date, time: Date): number {
    const result = new Date(base);
    result.setHours(time.getHours(), time.getMinutes(), 0, 0);
    return result.getTime();
  }

  async function handleSave() {
    console.log("=== SAVE INICIADO ===");
    console.log("title:", title);
    console.log("date:", date);
    console.log("startTime:", startTime);
    console.log("endTime:", endTime);

    if (!title.trim()) {
      Alert.alert("Campo obrigatório", "Por favor, informe o título do compromisso.");
      return;
    }

    const start_at = allDay
      ? new Date(date).setHours(0, 0, 0, 0)
      : buildTimestamp(date, startTime);

    const end_at = allDay
      ? new Date(date).setHours(23, 59, 0, 0)
      : buildTimestamp(date, endTime);

    console.log("start_at:", start_at, new Date(start_at).toISOString());
    console.log("end_at:", end_at, new Date(end_at).toISOString());

    if (!allDay && end_at <= start_at) {
      Alert.alert("Horário inválido", "O horário de fim deve ser após o início.");
      return;
    }

    const event = {
      id: uuidv4(),
      title: title.trim(),
      description: description.trim(),
      start_at,
      end_at,
      all_day: allDay ? 1 : 0,
      color,
      notify_before: notifyBefore,
      recurrence: null,
      synced_at: null,
      deleted_at: null,
    };

    console.log("evento a salvar:", JSON.stringify(event));
    setSaving(true);

    try {
      await addEvent(event);
      console.log("=== SALVO COM SUCESSO ===");
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/(tabs)");
      }
    } catch (e) {
      console.error("=== ERRO AO SALVAR ===", e);
      Alert.alert("Erro", String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={["bottom"]}>
      <ScrollView
        style={[styles.scroll, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <FormField label="Título">
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Ex: Consulta médica, reunião..."
            placeholderTextColor={theme.textMuted}
            value={title}
            onChangeText={setTitle}
            maxLength={80}
            autoFocus
          />
        </FormField>

        <FormField label="Descrição" style={{ marginTop: 10 }}>
          <TextInput
            style={[styles.input, styles.inputMulti, { color: theme.text }]}
            placeholder="Local, detalhes, observações..."
            placeholderTextColor={theme.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            maxLength={300}
          />
        </FormField>

        <FormField label="Data e hora" style={{ marginTop: 10 }}>
          <View style={styles.timeRow}>
            <TimePicker label="Data"   mode="date" value={date}      onChange={setDate}      />
            {!allDay && (
              <>
                <TimePicker label="Início" mode="time" value={startTime} onChange={setStartTime} />
                <TimePicker label="Fim"    mode="time" value={endTime}   onChange={setEndTime}   />
              </>
            )}
          </View>
          <View style={[styles.allDayRow, { borderTopColor: theme.border }]}
          >
            <Text style={[styles.allDayLabel, { color: theme.text }]}>Dia inteiro</Text>
            <Switch
              value={allDay}
              onValueChange={setAllDay}
              trackColor={{ false: theme.border, true: color }}
              thumbColor="#ffffff"
            />
          </View>
        </FormField>

        <FormField label="Cor" style={{ marginTop: 10 }}>
          <ColorPicker selected={color} onSelect={setColor} />
        </FormField>

        <FormField label="Lembrete" style={{ marginTop: 10 }}>
          <ReminderPicker selected={notifyBefore} onSelect={setNotifyBefore} />
        </FormField>

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: color }, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          <Text style={styles.saveBtnText}>
            {saving ? "Salvando..." : "Salvar compromisso"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 14, paddingBottom: 40 },
  input: { fontSize: 15, color: "#111827", paddingVertical: 4 },
  inputMulti: { minHeight: 72, textAlignVertical: "top" },
  timeRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  allDayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: "#e5e7eb",
  },
  allDayLabel: { fontSize: 14, color: "#374151" },
  saveBtn: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
});
