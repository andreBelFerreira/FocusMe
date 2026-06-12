import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useThemeStore } from "../store/useThemeStore";

export function QuickActions() {
  const router  = useRouter();
  const { theme } = useThemeStore();

  const actions = [
    { emoji: "📅", label: "Evento",   route: "/new-event", color: "#6366f1" },
    { emoji: "🛒", label: "Mercado",  route: "/grocery",   color: "#10b981" },
    { emoji: "📝", label: "Notas",    route: "/notes",     color: "#f59e0b" },
    { emoji: "🍅", label: "Foco",     route: "/focus",     color: "#ef4444" },
    { emoji: "🌱", label: "Hábitos",  route: "/habits",    color: "#0ea5e9" },
    { emoji: "📊", label: "Stats",    route: "/stats",     color: "#8b5cf6" },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingRight: 4 }}
      style={{ marginBottom: 16 }}
    >
      {actions.map((a) => (
        <TouchableOpacity
          key={a.route}
          style={[styles.btn, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => router.push(a.route as any)}
        >
          <View style={[styles.iconBg, { backgroundColor: a.color + "22" }]}>
            <Text style={styles.btnEmoji}>{a.emoji}</Text>
          </View>
          <Text style={[styles.btnLabel, { color: theme.textSecondary }]}>{a.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  btn:      { width: 70, borderRadius: 12, padding: 10, alignItems: "center", borderWidth: 0.5 },
  iconBg:   { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  btnEmoji: { fontSize: 20 },
  btnLabel: { fontSize: 10, fontWeight: "500" },
});