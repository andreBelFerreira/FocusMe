import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { Event } from "../types";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge:  true,
  }),
});

export async function requestPermissions(): Promise<boolean> {
  if (Platform.OS === "web") {
    console.log("Notificações não são suportadas no web.");
    return false;
  }

  if (!Device.isDevice) {
    console.log("Notificações não funcionam em emulador sem configuração extra.");
    return false;
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") return false;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("focusme", {
      name: "FocusMe Lembretes",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      sound: "default",
      lightColor: "#6366f1",
    });
  }

  return true;
}

export async function scheduleEventNotification(event: Event): Promise<string | null> {
  if (Platform.OS === "web") {
    console.log("Notificações não são suportadas no web. Ignorando agendamento.");
    return null;
  }

  if (event.notify_before === 0) return null;
  if (event.all_day === 1) return null;

  const triggerMs = event.start_at - event.notify_before * 60 * 1000;
  if (triggerMs <= Date.now()) return null;

  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `⏰ ${event.title}`,
        body: event.notify_before >= 60
          ? `Começa em ${event.notify_before / 60}h`
          : `Começa em ${event.notify_before} minutos`,
        sound: "default",
        data: { eventId: event.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: new Date(triggerMs),
        channelId: "focusme",
      },
    });
    return id;
  } catch (e) {
    console.error("Erro ao agendar notificação:", e);
    return null;
  }
}

export async function cancelEventNotification(notificationId: string): Promise<void> {
  if (Platform.OS === "web") {
    console.log("Notificações não são suportadas no web. Ignorando cancelamento.");
    return;
  }

  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (e) {
    console.error("Erro ao cancelar notificação:", e);
  }
}

export async function cancelAllNotifications(): Promise<void> {
  if (Platform.OS === "web") {
    console.log("Notificações não são suportadas no web. Ignorando cancelamento de todas.");
    return;
  }

  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function rescheduleAllEvents(events: Event[]): Promise<void> {
  if (Platform.OS === "web") {
    console.log("Notificações não são suportadas no web. Ignorando reagendamento.");
    return;
  }

  await cancelAllNotifications();
  for (const event of events) {
    if (!event.deleted_at) {
      await scheduleEventNotification(event);
    }
  }
}

export async function getScheduledNotifications() {
  if (Platform.OS === "web") {
    return [];
  }

  return await Notifications.getAllScheduledNotificationsAsync();
}
