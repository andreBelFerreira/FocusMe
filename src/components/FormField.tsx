import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { useThemeStore } from "../store/useThemeStore";

interface Props {
  label: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function FormField({ label, children, style }: Props) {
  const { theme } = useThemeStore();

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }, style]}>
      <Text style={[styles.label, { color: theme.textMuted }]}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card:  { borderRadius: 12, padding: 14, borderWidth: 0.5 },
  label: { fontSize: 11, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 },
});