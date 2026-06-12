import { Tabs } from "expo-router";
import { Text } from "react-native";
import { useThemeStore } from "../../src/store/useThemeStore";

function Icon({ symbol }: { symbol: string }) {
  return <Text style={{ fontSize: 20 }}>{symbol}</Text>;
}

export default function TabLayout() {
  const { theme } = useThemeStore();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#6366f1",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.border, height: 60, paddingBottom: 8 },
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index"    options={{ title: "Hoje",    tabBarIcon: () => <Icon symbol="🏠" /> }} />
      <Tabs.Screen name="agenda"   options={{ title: "Agenda",  tabBarIcon: () => <Icon symbol="📅" /> }} />
      <Tabs.Screen name="settings" options={{ title: "Config",  tabBarIcon: () => <Icon symbol="⚙️" /> }} />
    </Tabs>
  );
}