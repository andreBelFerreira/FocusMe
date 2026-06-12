import { useEffect, useRef, useState, useCallback } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Vibration, Platform, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useThemeStore } from "../../src/store/useThemeStore";

type Mode = "focus" | "short" | "long";

const DEFAULT_CONFIG = {
  focusMin: 25,
  shortMin: 5,
  longMin:  15,
  cycles:   4,
};

const MODE_CONFIG: Record<Mode, { label: string; emoji: string; color: string; bg: string }> = {
  focus: { label: "Foco",        emoji: "🍅", color: "#ef4444", bg: "#fee2e2" },
  short: { label: "Pausa curta", emoji: "☕", color: "#f59e0b", bg: "#fef3c7" },
  long:  { label: "Pausa longa", emoji: "🛋️", color: "#3b82f6", bg: "#dbeafe" },
};

function pad(n: number) { return String(n).padStart(2, "0"); }

export default function FocusScreen() {
  const router    = useRouter();
  const { theme } = useThemeStore();
  const [config]          = useState(DEFAULT_CONFIG);
  const [mode,   setMode] = useState<Mode>("focus");
  const [cycle,  setCycle]  = useState(1);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(DEFAULT_CONFIG.focusMin * 60);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = useCallback(() => {
    if (mode === "focus") return config.focusMin * 60;
    if (mode === "short") return config.shortMin * 60;
    return config.longMin * 60;
  }, [mode, config]);

  useEffect(() => {
    setSeconds(totalSeconds());
    setRunning(false);
  }, [mode]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current!);
            handleTimerEnd();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  function handleTimerEnd() {
    setRunning(false);
    Vibration.vibrate(Platform.OS === "android" ? [0, 400, 200, 400] : 400);
    if (mode === "focus") {
      const nextCycle = cycle + 1;
      if (cycle % config.cycles === 0) {
        Alert.alert("🎉 Ciclo completo!", "Hora da pausa longa! Você merece.", [
          { text: "Pausa longa", onPress: () => { setCycle(nextCycle); setMode("long"); } },
        ]);
      } else {
        Alert.alert("✅ Foco concluído!", "Hora de uma pausa curta.", [
          { text: "Pausa curta", onPress: () => { setCycle(nextCycle); setMode("short"); } },
        ]);
      }
    } else {
      Alert.alert("⏰ Pausa encerrada!", "Pronto para focar?", [
        { text: "Começar foco", onPress: () => setMode("focus") },
      ]);
    }
  }

  function handlePlayPause() { setRunning((r) => !r); }

  function handleSkip() {
    clearInterval(intervalRef.current!);
    setRunning(false);
    if (mode === "focus") {
      const nextCycle = cycle + 1;
      if (cycle % config.cycles === 0) { setCycle(nextCycle); setMode("long"); }
      else { setCycle(nextCycle); setMode("short"); }
    } else {
      setMode("focus");
    }
  }

  function handleResetTimer() {
    clearInterval(intervalRef.current!);
    setRunning(false);
    setSeconds(totalSeconds());
  }

  function handleResetCycle() {
    Alert.alert(
      "Resetar ciclo",
      "Isso vai zerar o contador de ciclos e voltar ao início. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Resetar",
          style: "destructive",
          onPress: () => {
            clearInterval(intervalRef.current!);
            setRunning(false);
            setCycle(1);
            setMode("focus");
            setSeconds(config.focusMin * 60);
          },
        },
      ]
    );
  }

  const total    = totalSeconds();
  const progress = seconds / total;
  const mins     = Math.floor(seconds / 60);
  const secs     = seconds % 60;
  const modeInfo = MODE_CONFIG[mode];

  const arcSize   = 210;
  const stroke    = 10;
  const r         = (arcSize - stroke) / 2;
  const circumf   = 2 * Math.PI * r;
  const dashOffset = circumf * (1 - progress);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top"]}>
      <View style={{ backgroundColor: modeInfo.color, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 16 }}>
        <Text style={styles.headerSub}>MODO FOCO</Text>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => { clearInterval(intervalRef.current!); try { router.back(); } catch { router.replace("/(tabs)"); }}}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pomodoro</Text>
          <TouchableOpacity
            style={[styles.cycleBadge, { backgroundColor: "rgba(255,255,255,0.2)" }]}
            onPress={handleResetCycle}
          >
            <Text style={styles.cycleBadgeText}>Ciclo {cycle}/{config.cycles}  🔄</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ alignItems: "center", paddingVertical: 24, paddingHorizontal: 20 }}>

        <View style={styles.modeTabs}>
          {(["focus", "short", "long"] as Mode[]).map((m) => {
            const info = MODE_CONFIG[m];
            return (
              <TouchableOpacity
                key={m}
                style={[styles.modeTab, { backgroundColor: mode === m ? info.bg : theme.card, borderColor: mode === m ? info.color : theme.border }]}
                onPress={() => { if (!running) setMode(m); }}
              >
                <Text style={styles.modeTabEmoji}>{info.emoji}</Text>
                <Text style={[styles.modeTabLabel, { color: mode === m ? info.color : theme.textSecondary }]}>
                  {info.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ width: arcSize, height: arcSize, marginVertical: 28, alignItems: "center", justifyContent: "center" }}>
          <View style={[StyleSheet.absoluteFill, { alignItems: "center", justifyContent: "center" }]}>
            <View style={{
              width: arcSize - stroke, height: arcSize - stroke,
              borderRadius: (arcSize - stroke) / 2,
              borderWidth: stroke, borderColor: theme.border,
            }} />
          </View>
          <View style={[StyleSheet.absoluteFill, { alignItems: "center", justifyContent: "center" }]}>
            <View style={{
              width: arcSize - stroke, height: arcSize - stroke,
              borderRadius: (arcSize - stroke) / 2,
              borderWidth: stroke,
              borderTopColor: modeInfo.color,
              borderRightColor: progress > 0.25 ? modeInfo.color : "transparent",
              borderBottomColor: progress > 0.5 ? modeInfo.color : "transparent",
              borderLeftColor: progress > 0.75 ? modeInfo.color : "transparent",
              transform: [{ rotate: `-${(1 - progress) * 360}deg` }],
            }} />
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={[styles.timerText, { color: theme.text }]}>{pad(mins)}:{pad(secs)}</Text>
            <Text style={[styles.timerMode, { color: theme.textSecondary }]}>{modeInfo.label.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={handleResetTimer}
          >
            <Text style={styles.controlBtnIcon}>↺</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.playBtn, { backgroundColor: modeInfo.color, shadowColor: modeInfo.color }]}
            onPress={handlePlayPause}
          >
            <Text style={styles.playBtnIcon}>{running ? "⏸" : "▶"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={handleSkip}
          >
            <Text style={styles.controlBtnIcon}>⏭</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cycleDotsRow}>
          {Array.from({ length: config.cycles }).map((_, i) => (
            <View
              key={i}
              style={[styles.cycleDot, { backgroundColor: i < (cycle - 1) % config.cycles ? modeInfo.color : theme.border }]}
            />
          ))}
        </View>

        <View style={[styles.resetCycleBtn, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <TouchableOpacity onPress={handleResetCycle} style={styles.resetCycleBtnInner}>
            <Text style={styles.resetCycleBtnEmoji}>🔄</Text>
            <Text style={[styles.resetCycleBtnText, { color: theme.textSecondary }]}>Resetar ciclo completo</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.configCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.configTitle, { color: theme.textSecondary }]}>Configurações</Text>
          <View style={styles.configRow}>
            <View style={styles.configItem}>
              <Text style={styles.configEmoji}>🍅</Text>
              <Text style={[styles.configLabel, { color: theme.textMuted }]}>Foco</Text>
              <Text style={[styles.configValue, { color: theme.text }]}>{config.focusMin} min</Text>
            </View>
            <View style={styles.configItem}>
              <Text style={styles.configEmoji}>☕</Text>
              <Text style={[styles.configLabel, { color: theme.textMuted }]}>Pausa</Text>
              <Text style={[styles.configValue, { color: theme.text }]}>{config.shortMin} min</Text>
            </View>
            <View style={styles.configItem}>
              <Text style={styles.configEmoji}>🛋️</Text>
              <Text style={[styles.configLabel, { color: theme.textMuted }]}>Longa</Text>
              <Text style={[styles.configValue, { color: theme.text }]}>{config.longMin} min</Text>
            </View>
            <View style={styles.configItem}>
              <Text style={styles.configEmoji}>🔁</Text>
              <Text style={[styles.configLabel, { color: theme.textMuted }]}>Ciclos</Text>
              <Text style={[styles.configValue, { color: theme.text }]}>{config.cycles}x</Text>
            </View>
          </View>
        </View>

        <View style={[styles.tipsCard, { backgroundColor: "#fef9c3", borderColor: "#f59e0b44" }]}>
          <Text style={styles.tipsTitle}>💡 Dica para TDAH</Text>
          <Text style={styles.tipsText}>
            Durante o foco, deixe o celular virado para baixo e abra apenas o que precisa. O Pomodoro funciona melhor quando você define UMA tarefa antes de começar.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerSub:          { fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: "500", letterSpacing: 0.05 },
  headerRow:          { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6 },
  backBtn:            { width: 34, height: 34, borderRadius: 17, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  backIcon:           { fontSize: 18, color: "#fff" },
  headerTitle:        { fontSize: 18, fontWeight: "700", color: "#fff" },
  cycleBadge:         { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  cycleBadgeText:     { fontSize: 12, color: "#fff", fontWeight: "500" },
  modeTabs:           { flexDirection: "row", gap: 8, width: "100%" },
  modeTab:            { flex: 1, borderRadius: 12, padding: 10, alignItems: "center", borderWidth: 1 },
  modeTabEmoji:       { fontSize: 18, marginBottom: 4 },
  modeTabLabel:       { fontSize: 10, fontWeight: "600" },
  timerText:          { fontSize: 52, fontWeight: "700", letterSpacing: -1 },
  timerMode:          { fontSize: 11, fontWeight: "600", letterSpacing: 1, marginTop: 4 },
  controls:           { flexDirection: "row", alignItems: "center", gap: 20, marginBottom: 20 },
  controlBtn:         { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center", borderWidth: 0.5 },
  controlBtnIcon:     { fontSize: 22 },
  playBtn:            { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center", shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 8 },
  playBtnIcon:        { fontSize: 28, color: "#fff" },
  cycleDotsRow:       { flexDirection: "row", gap: 8, marginBottom: 20 },
  cycleDot:           { width: 12, height: 12, borderRadius: 6 },
  resetCycleBtn:      { width: "100%", borderRadius: 12, borderWidth: 0.5, marginBottom: 14, overflow: "hidden" },
  resetCycleBtnInner: { flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 13, gap: 8 },
  resetCycleBtnEmoji: { fontSize: 16 },
  resetCycleBtnText:  { fontSize: 14, fontWeight: "500" },
  configCard:         { width: "100%", borderRadius: 14, padding: 16, borderWidth: 0.5, marginBottom: 14 },
  configTitle:        { fontSize: 11, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 14 },
  configRow:          { flexDirection: "row", justifyContent: "space-between" },
  configItem:         { alignItems: "center", gap: 4 },
  configEmoji:        { fontSize: 20 },
  configLabel:        { fontSize: 10 },
  configValue:        { fontSize: 13, fontWeight: "700" },
  tipsCard:           { width: "100%", borderRadius: 14, padding: 16, borderWidth: 0.5, marginBottom: 14 },
  tipsTitle:          { fontSize: 13, fontWeight: "700", color: "#92400e", marginBottom: 6 },
  tipsText:           { fontSize: 13, color: "#78350f", lineHeight: 20 },
});