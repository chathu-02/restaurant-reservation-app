import { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const colors = {
  bg: "#F5F7F4",
  text: "#1B2A24",
  muted: "#55645D",
  green: "#1F6B54",
  border: "#BFCBC5",
  error: "#8A2D2D",
};

export function Screen({ children, top }: { children: ReactNode; top?: boolean }) {
  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, top && { justifyContent: "flex-start" }]}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.muted}
        autoCapitalize="none"
        {...props}
      />
    </View>
  );
}

export function Button({
  title,
  onPress,
  disabled,
  secondary,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  secondary?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        secondary && styles.buttonSecondary,
        disabled && { opacity: 0.6 },
      ]}
    >
      <Text style={[styles.buttonText, secondary && { color: colors.green }]}>
        {title}
      </Text>
    </Pressable>
  );
}

export function LinkText({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="link"
      onPress={onPress}
      style={{ minHeight: 44, justifyContent: "center", alignItems: "center" }}
    >
      <Text style={{ color: colors.green, fontSize: 15, fontWeight: "700" }}>{title}</Text>
    </Pressable>
  );
}

export function Message({ text, good }: { text: string; good?: boolean }) {
  if (!text) return null;
  return (
    <Text
      style={{
        color: good ? colors.green : colors.error,
        fontSize: 14,
        marginBottom: 12,
        lineHeight: 20,
      }}
    >
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 24, flexGrow: 1, justifyContent: "center" },
  label: { fontSize: 14, fontWeight: "700", color: colors.text, marginBottom: 6 },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    fontSize: 16,
    color: colors.text,
  },
  button: {
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  buttonSecondary: { backgroundColor: "#fff", borderWidth: 2, borderColor: colors.green },
  buttonText: { color: "#fff", fontSize: 17, fontWeight: "700" },
});

export function Chip({
  title,
  selected,
  disabled,
  onPress,
}: {
  title: string;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={{
        minHeight: 48,
        paddingHorizontal: 14,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: selected ? colors.green : colors.border,
        backgroundColor: selected ? colors.green : disabled ? "#ECEFED" : "#fff",
      }}
    >
      <Text
        style={{
          color: selected ? "#fff" : disabled ? colors.muted : colors.text,
          fontWeight: selected ? "700" : "500",
          fontSize: 15,
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}

export function Card({ children, tint }: { children: ReactNode; tint?: string }) {
  return (
    <View
      style={{
        backgroundColor: tint ?? "#fff",
        borderRadius: 16,
        padding: 16,
        borderWidth: tint ? 0 : 1,
        borderColor: "#DDE4DF",
        marginBottom: 14,
      }}
    >
      {children}
    </View>
  );
}

export function Badge({ text, tone }: { text: string; tone: "good" | "wait" | "bad" }) {
  const map = {
    good: ["#D5EDE3", "#14503E"],
    wait: ["#FCEBCB", "#6B3A00"],
    bad: ["#F3D9D9", "#8A2D2D"],
  } as const;
  const [bg, fg] = map[tone];
  return (
    <View
      style={{
        alignSelf: "flex-start",
        backgroundColor: bg,
        borderRadius: 99,
        paddingHorizontal: 12,
        paddingVertical: 4,
      }}
    >
      <Text style={{ color: fg, fontWeight: "700", fontSize: 13 }}>{text}</Text>
    </View>
  );
}