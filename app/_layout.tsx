import { useEffect, useRef, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator } from "react-native";
import * as Notifications from "expo-notifications";
import { initDatabase } from "../src/db/database";
import { useSettingsStore } from "../src/store/useSettingsStore";
import { useThemeStore } from "../src/store/useThemeStore";
import "../src/global.css";

export default function RootLayout() {
  const loadSettings   = useSettingsStore((s) => s.load);
  const onboardingDone = useSettingsStore((s) => s.onboardingDone);
  const darkMode       = useSettingsStore((s) => s.darkMode);
  const loaded         = useSettingsStore((s) => s.loaded);
  const setDark        = useThemeStore((s) => s.setDark);
  const router         = useRouter();
  const notifListener    = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      await initDatabase().catch(console.error);
      await loadSettings();
      setReady(true);
    }
    init();
    notifListener.current = Notifications.addNotificationReceivedListener((n) => {
      console.log("Notificação:", n.request.content.title);
    });
    responseListener.current = Notifications.addNotificationResponseReceivedListener((r) => {
      const eventId = r.notification.request.content.data?.eventId;
      if (eventId) router.push(`/event/${eventId}`);
    });
    return () => { notifListener.current?.remove(); responseListener.current?.remove(); };
  }, []);

  useEffect(() => { setDark(darkMode); }, [darkMode]);

  useEffect(() => {
    if (!ready || !loaded) return;
    if (!onboardingDone) router.replace("/onboarding");
  }, [ready, loaded, onboardingDone]);

  if (!ready || !loaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#6366f1" }}>
        <ActivityIndicator color="#fff" size="large" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={darkMode ? "light" : "dark"} />
      <Stack>
        <Stack.Screen name="(tabs)"              options={{ headerShown: false }} />
        <Stack.Screen name="onboarding"          options={{ headerShown: false }} />
        <Stack.Screen name="notifications-debug" options={{ headerShown: false }} />
        <Stack.Screen name="grocery/index"       options={{ headerShown: false }} />
        <Stack.Screen name="grocery/[id]"        options={{ headerShown: false }} />
        <Stack.Screen name="notes/index"         options={{ headerShown: false }} />
        <Stack.Screen name="notes/new"           options={{ headerShown: false }} />
        <Stack.Screen name="notes/[id]"          options={{ headerShown: false }} />
        <Stack.Screen name="focus/index"         options={{ headerShown: false }} />
        <Stack.Screen name="stats/index"         options={{ headerShown: false }} />
        <Stack.Screen name="habits/index"        options={{ headerShown: false }} />
        <Stack.Screen
          name="new-event"
          options={{ headerShown: true, title: "Novo compromisso", headerStyle: { backgroundColor: "#6366f1" }, headerTintColor: "#fff", headerBackTitle: "Voltar" }}
        />
        <Stack.Screen name="event/[id]" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}