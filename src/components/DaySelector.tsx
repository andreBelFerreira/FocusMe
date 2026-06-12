import { ScrollView, TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { addDays, format, isToday, isTomorrow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Props {
  selected: Date;
  onSelect: (date: Date) => void;
}

function dayLabel(date: Date): string {
  if (isToday(date)) return "Hoje";
  if (isTomorrow(date)) return "Amanhã";
  return format(date, "EEE", { locale: ptBR });
}

export function DaySelector({ selected, onSelect }: Props) {
  const days = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {days.map((day) => {
        const active = format(day, "yyyy-MM-dd") === format(selected, "yyyy-MM-dd");
        return (
          <TouchableOpacity
            key={day.toISOString()}
            style={[styles.pill, active && styles.pillActive]}
            onPress={() => onSelect(day)}
            activeOpacity={0.7}
          >
            <Text style={[styles.label, active && styles.labelActive]}>
              {dayLabel(day)}
            </Text>
            {isToday(day) && !active && <View style={styles.dot} />}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingBottom: 4, gap: 6, flexDirection: "row" },
  pill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, alignItems: "center" },
  pillActive: { backgroundColor: "rgba(255,255,255,0.25)" },
  label: { fontSize: 13, color: "#c7d2fe", fontWeight: "500" },
  labelActive: { color: "#ffffff" },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: "#c7d2fe", marginTop: 3 },
});
