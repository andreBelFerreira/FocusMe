import { View, Text, TouchableOpacity, Modal, Pressable, StyleSheet } from "react-native";

const ACCENTS = [
  { color: "#6366f1", label: "Índigo" },
  { color: "#8b5cf6", label: "Roxo" },
  { color: "#ec4899", label: "Rosa" },
  { color: "#f59e0b", label: "Âmbar" },
  { color: "#10b981", label: "Verde" },
  { color: "#3b82f6", label: "Azul" },
  { color: "#ef4444", label: "Vermelho" },
  { color: "#0ea5e9", label: "Ciano" },
];

interface Props {
  visible: boolean;
  selected: string;
  onSelect: (color: string) => void;
  onClose: () => void;
}

export function ColorAccentPicker({ visible, selected, onSelect, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={styles.sheet}>
        <Text style={styles.title}>Cor do app</Text>
        <View style={styles.grid}>
          {ACCENTS.map(({ color, label }) => (
            <TouchableOpacity
              key={color}
              style={styles.item}
              onPress={() => { onSelect(color); onClose(); }}
            >
              <View style={[
                styles.dot,
                { backgroundColor: color },
                selected === color && styles.dotSelected,
              ]} />
              <Text style={styles.itemLabel}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay:     { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.4)" },
  sheet:       { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 },
  title:       { fontSize: 16, fontWeight: "600", color: "#111827", marginBottom: 16, textAlign: "center" },
  grid:        { flexDirection: "row", flexWrap: "wrap", gap: 16, justifyContent: "center" },
  item:        { alignItems: "center", gap: 6, width: 60 },
  dot:         { width: 40, height: 40, borderRadius: 20 },
  dotSelected: { borderWidth: 3, borderColor: "#fff", shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  itemLabel:   { fontSize: 11, color: "#6b7280" },
});