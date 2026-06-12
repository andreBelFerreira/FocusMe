import { useState } from "react";
import {
  View, Text, TouchableOpacity, Modal, ScrollView,
  StyleSheet, Pressable,
} from "react-native";

interface Props {
  value: Date;
  mode: "date" | "time";
  onChange: (date: Date) => void;
  label: string;
  hideButton?: boolean;
}

function pad(n: number) { return String(n).padStart(2, "0"); }

const HOURS   = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);
const DAYS    = Array.from({ length: 31 }, (_, i) => i + 1);
const MONTHS  = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const YEARS   = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 99 + i);

function Column({ items, selected, onSelect, fmt }: {
  items: number[] | string[];
  selected: number;
  onSelect: (i: number) => void;
  fmt?: (v: number | string) => string;
}) {
  return (
    <ScrollView
      style={styles.col}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 80 }}
    >
      {(items as any[]).map((item, i) => (
        <TouchableOpacity
          key={i}
          style={[styles.colItem, selected === i && styles.colItemActive]}
          onPress={() => onSelect(i)}
        >
          <Text style={[styles.colText, selected === i && styles.colTextActive]}>
            {fmt ? fmt(item) : pad(Number(item))}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

function PickerBody({ value, mode, onChange }: { value: Date; mode: "date" | "time"; onChange: (d: Date) => void }) {
  const [hour,   setHour]   = useState(value.getHours());
  const [minute, setMinute] = useState(value.getMinutes());
  const [day,    setDay]    = useState(value.getDate() - 1);
  const [month,  setMonth]  = useState(value.getMonth());
  const [year,   setYear]   = useState(() => {
    const idx = YEARS.indexOf(value.getFullYear());
    return idx >= 0 ? idx : YEARS.length - 10;
  });

  function emit(h: number, m: number, d: number, mo: number, y: number) {
    const next = new Date(value);
    if (mode === "time") { next.setHours(HOURS[h], MINUTES[m], 0, 0); }
    else { next.setFullYear(YEARS[y], mo, DAYS[d]); }
    onChange(next);
  }

  return (
    <View style={styles.cols}>
      {mode === "time" ? (
        <>
          <Column items={HOURS}   selected={hour}   onSelect={(i) => { setHour(i);   emit(i, minute, day, month, year); }} />
          <Text style={styles.sep}>:</Text>
          <Column items={MINUTES} selected={minute} onSelect={(i) => { setMinute(i); emit(hour, i, day, month, year); }} />
        </>
      ) : (
        <>
          <Column items={DAYS}   selected={day}   onSelect={(i) => { setDay(i);   emit(hour, minute, i, month, year); }} fmt={(v) => pad(Number(v))} />
          <Column items={MONTHS} selected={month} onSelect={(i) => { setMonth(i); emit(hour, minute, day, i, year);  }} fmt={(v) => String(v)} />
          <Column items={YEARS}  selected={year}  onSelect={(i) => { setYear(i);  emit(hour, minute, day, month, i); }} fmt={(v) => String(v)} />
        </>
      )}
    </View>
  );
}

export function TimePicker({ value, mode, onChange, label, hideButton }: Props) {
  const [visible, setVisible] = useState(false);

  function displayValue() {
    if (mode === "time") return `${pad(value.getHours())}:${pad(value.getMinutes())}`;
    return `${pad(value.getDate())}/${pad(value.getMonth()+1)}/${value.getFullYear()}`;
  }

  if (hideButton) {
    return <PickerBody value={value} mode={mode} onChange={onChange} />;
  }

  return (
    <>
      <TouchableOpacity style={styles.trigger} onPress={() => setVisible(true)}>
        <Text style={styles.triggerLabel}>{label}</Text>
        <Text style={styles.triggerValue}>{displayValue()}</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setVisible(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={styles.cancelBtn}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.sheetTitle}>
              {mode === "time" ? "Selecionar hora" : "Selecionar data"}
            </Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={styles.confirmBtn}>Confirmar</Text>
            </TouchableOpacity>
          </View>
          <PickerBody value={value} mode={mode} onChange={onChange} />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger:        { flex: 1, backgroundColor: "#f3f4f6", borderRadius: 8, padding: 10, alignItems: "center" },
  triggerLabel:   { fontSize: 11, color: "#9ca3af", marginBottom: 4 },
  triggerValue:   { fontSize: 14, fontWeight: "600", color: "#111827" },
  overlay:        { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.4)" },
  sheet:          { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 40 },
  sheetHeader:    { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderBottomWidth: 0.5, borderBottomColor: "#e5e7eb" },
  sheetTitle:     { fontSize: 15, fontWeight: "600", color: "#111827" },
  cancelBtn:      { fontSize: 15, color: "#9ca3af" },
  confirmBtn:     { fontSize: 15, color: "#6366f1", fontWeight: "600" },
  cols:           { flexDirection: "row", alignItems: "center", height: 220, paddingHorizontal: 16 },
  col:            { flex: 1, height: 220 },
  colItem:        { height: 44, alignItems: "center", justifyContent: "center", borderRadius: 8 },
  colItemActive:  { backgroundColor: "#eef2ff" },
  colText:        { fontSize: 18, color: "#9ca3af" },
  colTextActive:  { fontSize: 20, fontWeight: "600", color: "#6366f1" },
  sep:            { fontSize: 22, fontWeight: "700", color: "#374151", paddingHorizontal: 4 },
});