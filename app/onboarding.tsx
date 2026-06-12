import { useRef, useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Dimensions, KeyboardAvoidingView, Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSettingsStore } from "../src/store/useSettingsStore";
import { requestPermissions } from "../src/utils/notifications";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    emoji:    "🧠",
    title:    "Bem-vindo ao FocusMe",
    subtitle: "O app feito para mentes TDAH.\nOrganize sua vida sem esforço.",
    bg:       "#6366f1",
    dots:     "#a5b4fc",
  },
  {
    emoji:    "📅",
    title:    "Nunca esqueça um compromisso",
    subtitle: "Lembretes inteligentes que chegam\nna hora certa, sempre.",
    bg:       "#8b5cf6",
    dots:     "#c4b5fd",
  },
  {
    emoji:    "⚡",
    title:    "Simples e sem distrações",
    subtitle: "Interface pensada para o seu cérebro.\nRápido, direto e intuitivo.",
    bg:       "#ec4899",
    dots:     "#f9a8d4",
  },
];

export default function OnboardingScreen() {
  const router      = useRouter();
  const { update }  = useSettingsStore();
  const scrollRef   = useRef<ScrollView>(null);
  const [page,      setPage]      = useState(0);
  const [name,      setName]      = useState("");
  const [saving,    setSaving]    = useState(false);
  const totalPages  = SLIDES.length + 1;
  const isLastSlide = page === SLIDES.length - 1;
  const isNameSlide = page === SLIDES.length;

  function goToPage(p: number) {
    scrollRef.current?.scrollTo({ x: p * width, animated: true });
    setPage(p);
  }

  function handleNext() {
    if (isLastSlide) { goToPage(page + 1); return; }
    if (isNameSlide) { handleFinish(); return; }
    goToPage(page + 1);
  }

  async function handleFinish() {
    if (saving) return;
    setSaving(true);
    await requestPermissions();
    await update({ name: name.trim(), onboardingDone: true });
    router.replace("/(tabs)");
  }

  function handleSkip() {
    goToPage(SLIDES.length);
  }

  const currentBg = isNameSlide ? "#10b981" : SLIDES[page].bg;

  return (
    <View style={{ flex: 1, backgroundColor: currentBg }}>
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {!isNameSlide && (
            <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
              <Text style={styles.skipText}>Pular</Text>
            </TouchableOpacity>
          )}

          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1 }}
          >
            {SLIDES.map((slide, i) => (
              <View key={i} style={[styles.slide, { width, backgroundColor: slide.bg }]}>
                <Text style={styles.emoji}>{slide.emoji}</Text>
                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.subtitle}>{slide.subtitle}</Text>
              </View>
            ))}

            <View style={[styles.slide, { width, backgroundColor: "#10b981" }]}>
              <Text style={styles.emoji}>👋</Text>
              <Text style={styles.title}>Como te chamo?</Text>
              <Text style={styles.subtitle}>Para personalizar sua experiência</Text>
              <TextInput
                style={styles.nameInput}
                placeholder="Seu nome..."
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={name}
                onChangeText={setName}
                maxLength={40}
                autoCorrect={false}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.dotsRow}>
              {Array.from({ length: totalPages }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    i === page
                      ? styles.dotActive
                      : { backgroundColor: "rgba(255,255,255,0.35)" },
                  ]}
                />
              ))}
            </View>

            <TouchableOpacity
              style={[styles.nextBtn, saving && { opacity: 0.7 }]}
              onPress={handleNext}
              disabled={saving}
              activeOpacity={0.85}
            >
              <Text style={[styles.nextBtnText, { color: currentBg }]}>
                {isNameSlide
                  ? saving ? "Entrando..." : "Começar →"
                  : isLastSlide ? "Continuar →" : "Próximo →"}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  skipBtn:      { position: "absolute", top: 16, right: 20, zIndex: 10, padding: 8 },
  skipText:     { fontSize: 14, color: "rgba(255,255,255,0.7)", fontWeight: "500" },
  slide:        { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40 },
  emoji:        { fontSize: 80, marginBottom: 28 },
  title:        { fontSize: 26, fontWeight: "700", color: "#fff", textAlign: "center", lineHeight: 34, marginBottom: 14 },
  subtitle:     { fontSize: 16, color: "rgba(255,255,255,0.8)", textAlign: "center", lineHeight: 24 },
  nameInput:    { marginTop: 24, width: "100%", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 14, padding: 16, fontSize: 16, color: "#fff", textAlign: "center" },
  footer:       { paddingHorizontal: 32, paddingBottom: 16, gap: 20 },
  dotsRow:      { flexDirection: "row", justifyContent: "center", gap: 6 },
  dot:          { width: 6, height: 6, borderRadius: 3 },
  dotActive:    { width: 22, height: 6, borderRadius: 3, backgroundColor: "#fff" },
  nextBtn:      { backgroundColor: "#fff", borderRadius: 16, padding: 16, alignItems: "center" },
  nextBtnText:  { fontSize: 16, fontWeight: "700" },
});