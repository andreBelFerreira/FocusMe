import { View, TouchableOpacity, StyleSheet } from "react-native";
import { EventColor } from "../types";

const COLORS: EventColor[] = [
  "#6366f1",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#ef4444",
];

interface Props {
  selected: EventColor;
  onSelect: (color: EventColor) => void;
}

export function ColorPicker({ selected, onSelect }: Props) {
  return (
    <View style={styles.row}>
      {COLORS.map((color) => (
        <TouchableOpacity
          key={color}
          style={[
            styles.dot,
            { backgroundColor: color },
            selected === color && styles.dotSelected,
          ]}
          onPress={() => onSelect(color)}
          activeOpacity={0.8}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 10 },
  dot: { width: 28, height: 28, borderRadius: 14 },
  dotSelected: {
    borderWidth: 3,
    borderColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
});
