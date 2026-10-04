import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const RESTAURANT_NAME = "Restaurant Name"; // change to the real name

const SLIDES = [
  { icon: "🗓️", title: "Book ahead", text: "Reserve a table before you arrive and skip the wait on busy nights." },
  { icon: "📍", title: "Skip the crowd", text: "Join the queue from anywhere and watch your position update live." },
  { icon: "🔔", title: "Stay updated", text: "Get an alert in the app the moment your table is ready." },
];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(-1); // -1 = splash (A1), 0-2 = slides (A2-A4)

  useEffect(() => {
    if (step !== -1) return;
    const timer = setTimeout(() => setStep(0), 1800);
    return () => clearTimeout(timer);
  }, [step]);

  const finish = () => router.replace("/sign-in" as never);

  if (step === -1) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.logo}>🍽️</Text>
        <Text style={styles.name}>{RESTAURANT_NAME}</Text>
      </View>
    );
  }

  const slide = SLIDES[step];
  const last = step === SLIDES.length - 1;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topRow}>
        <Pressable onPress={finish} style={styles.skip} accessibilityRole="button">
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>
      <View style={[styles.center, { flex: 1 }]}>
        <Text style={styles.icon}>{slide.icon}</Text>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.body}>{slide.text}</Text>
      </View>
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
        ))}
      </View>
      <Pressable
        style={styles.button}
        accessibilityRole="button"
        onPress={() => (last ? finish() : setStep(step + 1))}
      >
        <Text style={styles.buttonText}>{last ? "Get started" : "Next"}</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F7F4", padding: 24 },
  center: { alignItems: "center", justifyContent: "center" },
  logo: { fontSize: 72 },
  name: { fontSize: 28, fontWeight: "700", color: "#1B2A24", marginTop: 12 },
  topRow: { alignItems: "flex-end" },
  skip: { minHeight: 44, justifyContent: "center", paddingHorizontal: 8 },
  skipText: { fontSize: 16, color: "#55645D" },
  icon: { fontSize: 88, marginBottom: 24 },
  title: { fontSize: 28, fontWeight: "700", color: "#1B2A24", marginBottom: 12 },
  body: { fontSize: 17, lineHeight: 25, color: "#55645D", textAlign: "center", paddingHorizontal: 12 },
  dots: { flexDirection: "row", justifyContent: "center", gap: 8, marginBottom: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#BFCBC5" },
  dotActive: { width: 24, backgroundColor: "#1F6B54" },
  button: { height: 56, borderRadius: 14, backgroundColor: "#1F6B54", alignItems: "center", justifyContent: "center" },
  buttonText: { color: "#fff", fontSize: 17, fontWeight: "700" },
});