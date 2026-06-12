import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { getScheduledNotifications, cancelAllNotifications, requestPermissions } from "../src/utils/notifications";
import { useThemeStore } from "../src/store/useThemeStore";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function NotificationsDebugScreen() {
  const router  = useRouter();
  const { theme } = useThemeStore();
  const [scheduled, setScheduled] = useState<Notifications.NotificationRequest[]>([]);
  const [hasPermission, setHasPermission] = useState(false);

  async function load() {
    const granted = await requestPermissions();
    setHasPermission(granted);
    const list = await getScheduledNotifications();
    setScheduled(list);
  }

  useEffect(() => { load(); }, []);

  async function handleTestNow() {
    const granted = await requestPermissions();
    if (!granted) { Alert.alert("Sem permissão", "Permita notificações nas configurações do celular."); return; }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🧠 FocusMe — Teste",
        body:  "Suas notificações estão funcionando!",
        sound: "default",
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 3 },
    });

    Alert.alert("✅ Enviado!", "Você vai receber uma notificação em 3 segundos.\nMínimize o app para vê-la.");
    setTimeout(load, 4000);
  }

  async function handleCancelAll() {
    await cancelAllNotifications();
    load();
    Alert.alert("Pronto", "Todas as notificações agendadas foram canceladas.");
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: "#6366f1" }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => { try { router.back(); } catch { router.replace("/(tabs)"); }}}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificações</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Status da permissão</Text>
          <View style={[styles.badge, { backgroundColor: hasPermission ? "#dcfce7" : "#fee2e2" }]}>
            <Text style={{ color: hasPermission ? "#16a34a" : "#dc2626", fontWeight: "600", fontSize: 13 }}>
              {hasPermission ? "✅ Permitido" : "❌ Negado"}
            </Text>
          </View>
          {!hasPermission && (
            <Text style={[styles.hint, { color: theme.textMuted }]}>
              Vá em Configurações do celular → FocusMe → Notificações e ative.
            </Text>
          )}
        </View>

        <TouchableOpacity style={styles.testBtn} onPress={handleTestNow}>
          <Text style={styles.testBtnText}>🔔 Enviar notificação de teste (3s)</Text>
        </TouchableOpacity>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, marginTop: 16 }]}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              Agendadas ({scheduled.length})
            </Text>
            {scheduled.length > 0 && (
              <TouchableOpacity onPress={handleCancelAll}>
                <Text style={{ fontSize: 13, color: "#ef4444", fontWeight: "500" }}>Cancelar todas</Text>
              </TouchableOpacity>
            )}
          </View>

          {scheduled.length === 0 ? (
            <Text style={[styles.hint, { color: theme.textMuted }]}>Nenhuma notificação agendada.</Text>
          ) : (
            scheduled.map((n) => {
              const trigger = n.trigger as any;
              const triggerDate = trigger?.value ? new Date(trigger.value * 1000) : null;
              return (
                <View key={n.identifier} style={[styles.notifItem, { borderBottomColor: theme.border }]}>
                  <Text style={[styles.notifTitle, { color: theme.text }]}>{n.content.title}</Text>
                  <Text style={[styles.notifBody, { color: theme.textSecondary }]}>{n.content.body}</Text>
                  {triggerDate && (
                    <Text style={[styles.notifTime, { color: theme.textMuted }]}>
                      {format(triggerDate, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </Text>
                  )}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header:      { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16 },
  backBtn:     { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  backText:    { fontSize: 18, color: "#fff" },
  headerTitle: { fontSize: 17, fontWeight: "600", color: "#fff" },
  card:        { borderRadius: 12, padding: 14, borderWidth: 0.5, marginBottom: 8 },
  cardTitle:   { fontSize: 15, fontWeight: "600", marginBottom: 10 },
  badge:       { alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  hint:        { fontSize: 13, marginTop: 10, lineHeight: 18 },
  testBtn:     { backgroundColor: "#6366f1", borderRadius: 12, padding: 15, alignItems: "center", marginTop: 8 },
  testBtnText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  notifItem:   { paddingVertical: 10, borderBottomWidth: 0.5 },
  notifTitle:  { fontSize: 14, fontWeight: "600" },
  notifBody:   { fontSize: 13, marginTop: 2 },
  notifTime:   { fontSize: 11, marginTop: 4 },
});