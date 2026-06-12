import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const OPTIONS = [
  { label: "Nenhum", value: 0 },
  { label: "5 min",  value: 5 },
  { label: "15 min", value: 15 },
  { label: "30 min", value: 30 },
  { label: "1 hora", value: 60 },
  { label: "1 dia",  value: 1440 },
];

interface Props {
  selected: number;
  onSelect: (value: number) => void;
}

export function ReminderPicker({ selected, onSelect }: Props) {
  return (
    <View style={styles.row}>
      {OPTIONS.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[styles.pill, selected === opt.value && styles.pillActive]}
          onPress={() => onSelect(opt.value)}
          activeOpacity={0.7}
        >
          <Text style={[styles.label, selected === opt.value && styles.labelActive]}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
  },
  pillActive: { backgroundColor: "#6366f1" },
  label: { fontSize: 12, color: "#6b7280", fontWeight: "500" },
  labelActive: { color: "#ffffff" },
});
