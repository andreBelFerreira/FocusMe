import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, isSameMonth, isToday, isSameDay,
} from "date-fns";
import { Event } from "../types";

interface Props {
  month: Date;
  selected: Date;
  events: Event[];
  onSelectDay: (date: Date) => void;
}

const WEEK_DAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

export function CalendarGrid({ month, selected, events, onSelectDay }: Props) {
  const start = startOfWeek(startOfMonth(month));
  const end   = endOfWeek(endOfMonth(month));
  const days  = eachDayOfInterval({ start, end });

  function dotsForDay(day: Date) {
    return events
      .filter((e) => isSameDay(new Date(e.start_at), day))
      .slice(0, 3)
      .map((e) => e.color);
  }

  return (
    <View style={styles.container}>
      <View style={styles.weekRow}>
        {WEEK_DAYS.map((d, i) => (
          <Text key={i} style={styles.weekLabel}>{d}</Text>
        ))}
      </View>

      <View style={styles.grid}>
        {days.map((day) => {
          const inMonth  = isSameMonth(day, month);
          const isSelect = isSameDay(day, selected);
          const isTod    = isToday(day);
          const dots     = dotsForDay(day);

          return (
            <TouchableOpacity
              key={day.toISOString()}
              style={styles.cell}
              onPress={() => onSelectDay(day)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.dayCircle,
                isSelect && styles.dayCircleSelected,
                isTod && !isSelect && styles.dayCircleToday,
              ]}>
                <Text style={[
                  styles.dayText,
                  !inMonth && styles.dayTextOut,
                  isSelect && styles.dayTextSelected,
                  isTod && !isSelect && styles.dayTextToday,
                ]}>
                  {format(day, "d")}
                </Text>
              </View>
              <View style={styles.dots}>
                {dots.map((color, i) => (
                  <View key={i} style={[styles.dot, { backgroundColor: color }]} />
                ))}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:          { paddingHorizontal: 8, paddingBottom: 8 },
  weekRow:            { flexDirection: "row", marginBottom: 4 },
  weekLabel:          { flex: 1, textAlign: "center", fontSize: 11, color: "#a5b4fc", fontWeight: "600" },
  grid:               { flexDirection: "row", flexWrap: "wrap" },
  cell:               { width: "14.28%", alignItems: "center", paddingVertical: 2 },
  dayCircle:          { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  dayCircleSelected:  { backgroundColor: "rgba(255,255,255,0.3)" },
  dayCircleToday:     { backgroundColor: "rgba(255,255,255,0.15)", borderWidth: 1, borderColor: "rgba(255,255,255,0.5)" },
  dayText:            { fontSize: 13, color: "#ffffff", fontWeight: "400" },
  dayTextOut:         { color: "rgba(255,255,255,0.3)" },
  dayTextSelected:    { fontWeight: "700" },
  dayTextToday:       { fontWeight: "600" },
  dots:               { flexDirection: "row", gap: 2, height: 6, alignItems: "center", marginTop: 1 },
  dot:                { width: 4, height: 4, borderRadius: 2 },
});