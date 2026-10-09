import { friendlyError, homeRouteFor, login, logout, Role } from "@/lib/auth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { useState, ComponentProps, useCallback } from "react";
import { Text, View, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "@/components/logo";
import { Message } from "@/components/form-ui";

const STAFF_ROLES: Role[] = ["manager", "front", "kitchen"];
const STAFF_DOMAIN = "staff.oceangrace.app";

// a plain username becomes a staff email; a full email still works
const toEmail = (input: string) =>
  input.includes("@") ? input.trim() : `${input.trim().toLowerCase()}@${STAFF_DOMAIN}`;

function IconInput({
  label,
  icon,
  secureTextEntry,
  value,
  onChangeText,
  autoComplete
}: {
  label: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  secureTextEntry?: boolean;
  value: string;
  onChangeText: (v: string) => void;
  autoComplete?: any;
}) {
  const [show, setShow] = useState(!secureTextEntry);
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <Ionicons name={icon} size={20} color="#10B981" style={{ marginRight: 10 }} />
        <TextInput
          style={[styles.input, Platform.OS === 'web' && { outlineStyle: 'none' } as any]}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !show}
          placeholderTextColor="#A7F3D0"
          autoCapitalize="none"
          autoComplete={autoComplete}
        />
        {secureTextEntry && (
          <Pressable onPress={() => setShow(!show)} style={{ padding: 4 }}>
            <Ionicons name={show ? "eye-outline" : "eye-off-outline"} size={20} color="#10B981" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

export default function StaffSignIn() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setUsername("");
      setPassword("");
      setError("");
    }, [])
  );

  const submit = async () => {
    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const role = await login(toEmail(username), password);
      if (!STAFF_ROLES.includes(role)) {
        await logout();
        setError("This is not a staff account. Customers can log in from the customer option.");
        return;
      }
      router.replace(homeRouteFor(role) as never);
    } catch (e) {
      setError(friendlyError(e).replace("Email or password", "Username or password"));
    } finally {
      setBusy(false);
    }
  };

  return (
<<<<<<< HEAD
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          <View style={styles.logoContainer}>
            <Logo size={80} color="#064E3B" />
          </View>



          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Use the username and password your manager gave you.</Text>

          <View style={styles.card}>
            <IconInput
              label="USERNAME"
              icon="person-outline"
              value={username}
              onChangeText={setUsername}
              autoComplete="off"
            />
            <IconInput
              label="PASSWORD"
              icon="lock-closed-outline"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Text style={styles.forgot}>Forgot password? Ask manager.</Text>

            <Message text={error} />

            <Pressable
              style={({ pressed }) => [styles.button, pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }]}
              onPress={submit}
              disabled={busy}
            >
              <Text style={styles.buttonText}>{busy ? "Please wait…" : "Log in"}</Text>
              {!busy && <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />}
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [styles.bottomPill, pressed && { opacity: 0.7 }]}
            onPress={() => router.replace("/role-choice" as never)}
          >
            <Text style={styles.bottomPillText}>Not staff? <Text style={{ fontFamily: 'Inter_700Bold', color: '#022C22' }}>Go back</Text></Text>
          </Pressable>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F0FDF4" },
  scroll: { flexGrow: 1, padding: 24, justifyContent: "center" },

  logoContainer: {
    width: 130,
    height: 130,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
    shadowColor: '#10B981',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10
  },

  pill: {
    backgroundColor: "#D1FAE5",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  pillDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#10B981" },
  pillText: { fontSize: 12, fontFamily: 'Inter_700Bold', color: '#022C22', letterSpacing: 1 },

  title: { fontSize: 32, fontFamily: "Inter_900Black", color: "#022C22", textAlign: "center", marginBottom: 8 },
  subtitle: { fontSize: 16, fontFamily: "Inter_500Medium", color: "#064E3B", textAlign: "center", marginBottom: 32, paddingHorizontal: 16 },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
    marginBottom: 32,
  },

  label: { fontSize: 12, fontFamily: "Inter_700Bold", color: "#064E3B", marginBottom: 8, letterSpacing: 1 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderWidth: 1.5,
    borderColor: "rgba(16, 185, 129, 0.4)",
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: "#E8FAF0",
  },
  input: { flex: 1, fontSize: 16, color: "#022C22", fontFamily: "Inter_600SemiBold" },

  forgot: { fontSize: 13, color: "#059669", textAlign: "right", fontFamily: "Inter_600SemiBold", marginBottom: 24 },

  button: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: { color: "#FFFFFF", fontSize: 17, fontFamily: "Inter_800ExtraBold", letterSpacing: 0.5 },

  bottomPill: {
    alignSelf: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  bottomPillText: {
    fontSize: 14,
    color: "#064E3B",
    fontFamily: "Inter_500Medium",
  }
});
=======
    <Screen>
      <Text style={{ fontSize: 28, fontWeight: "700", color: colors.text, marginBottom: 6 }}>
        Kitchen staff log in
      </Text>
      <Text style={{ fontSize: 16, color: colors.muted, marginBottom: 24 }}>
        Use your staff username and password to open the kitchen dashboard.
      </Text>
      <Field label="Username" value={username} onChangeText={setUsername} autoComplete="username" />
      <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Message text={error} />
      <Button title={busy ? "Please wait..." : "Log in"} onPress={submit} disabled={busy} />
      <Text style={{ fontSize: 14, color: colors.muted, textAlign: "center", marginVertical: 8 }}>
        Forgot your password? Ask your manager.
      </Text>
      <LinkText title="Back" onPress={() => router.replace("/role-choice" as never)} />
    </Screen>
  );
}
>>>>>>> Feature/Kitchen
