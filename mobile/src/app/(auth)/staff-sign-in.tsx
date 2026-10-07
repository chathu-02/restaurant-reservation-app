import { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Field, Message, colors } from "@/components/form-ui";
import { friendlyError } from "@/lib/auth";
import type { Role } from "@/lib/auth";

type Step = "login" | "pick-role";

const ROLE_OPTIONS: { role: Role; label: string; desc: string; icon: string; route: string }[] = [
  {
    role: "kitchen",
    label: "Kitchen Staff",
    desc: "View upcoming reservations, today's arrivals & alerts",
    icon: "restaurant-outline",
    route: "/kitchen",
  },
  {
    role: "front",
    label: "Front Desk",
    desc: "Manage reservations, walk-ins & table seating",
    icon: "people-outline",
    route: "/staff/dashboard",
  },
  {
    role: "manager",
    label: "Manager / Admin",
    desc: "Full access — staff, settings, reports & analytics",
    icon: "briefcase-outline",
    route: "/staff/dashboard",
  },
];

export default function StaffSignIn() {
  const router = useRouter();
  const [email, setEmail]       = useState("charu1@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [busy, setBusy]         = useState(false);
  const [showPwd, setShowPwd]   = useState(false);
  const [step, setStep]         = useState<Step>("login");
  const [uid, setUid]           = useState("");
  const [userData, setUserData] = useState<any>(null);

  // Step 1 — verify credentials with Firebase
  const submit = async () => {
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const snap = await getDoc(doc(db, "users", cred.user.uid));
      const data = snap.exists() ? snap.data() : null;
      setUid(cred.user.uid);
      setUserData(data ?? { name: email.split("@")[0], email: email.trim().toLowerCase(), active: true });
      // Always show role picker so staff can choose which side to enter
      setStep("pick-role");
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  };

  // Step 2 — save chosen role to Firestore and navigate
  const pickRole = async (option: typeof ROLE_OPTIONS[0]) => {
    setBusy(true);
    setError("");
    try {
      await setDoc(doc(db, "users", uid), { ...userData, role: option.role }, { merge: true });
      router.replace(option.route as never);
    } catch (e) {
      setError("Could not save role. Please try again.");
      setBusy(false);
    }
  };

  /* ── STEP 2: Role Picker ── */
  if (step === "pick-role") {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.iconContainer}>
            <View style={styles.iconBox}>
              <Ionicons name="shield-checkmark" size={32} color="#fff" />
            </View>
          </View>

          <Text style={styles.title}>Choose your view</Text>
          <Text style={styles.subtitle}>
            Signed in as{"\n"}
            <Text style={{ fontWeight: "700", color: "#111827" }}>{email}</Text>
          </Text>

          <View style={styles.roleList}>
            {ROLE_OPTIONS.map(opt => (
              <Pressable
                key={opt.role}
                style={({ pressed }) => [styles.roleCard, pressed && { opacity: 0.75 }]}
                onPress={() => pickRole(opt)}
                disabled={busy}
              >
                <View style={styles.roleIconBox}>
                  <Ionicons name={opt.icon as any} size={26} color="#fff" />
                </View>
                <View style={styles.roleTextBox}>
                  <Text style={styles.roleLabel}>{opt.label}</Text>
                  <Text style={styles.roleDesc}>{opt.desc}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </Pressable>
            ))}
          </View>

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <Pressable onPress={() => { setStep("login"); setError(""); }} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={16} color={colors.muted} />
            <Text style={styles.backText}>Use a different account</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  /* ── STEP 1: Login ── */
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.iconContainer}>
          <View style={styles.iconBox}>
            <Ionicons name="restaurant" size={32} color="#fff" />
          </View>
          <View style={styles.badge}>
            <View style={styles.dot} />
            <Text style={styles.badgeText}>STAFF</Text>
          </View>
        </View>

        <Text style={styles.title}>Staff sign in</Text>
        <Text style={styles.subtitle}>For restaurant team members only</Text>

        <View style={styles.form}>
          <Field
            label="Staff email or ID"
            placeholder="e.g. staff@restaurant.com or ID"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <View style={{ position: "relative" }}>
            <Field
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPwd}
            />
            <Pressable style={styles.eyeBtn} onPress={() => setShowPwd(!showPwd)}>
              <Ionicons
                name={showPwd ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={colors.muted}
              />
            </Pressable>
          </View>

          <Pressable onPress={() => router.push("/forgot-password" as never)}>
            <Text style={styles.forgot}>Forgot password?</Text>
          </Pressable>

          <Message text={error} />

          <Pressable
            style={[styles.btn, busy && { opacity: 0.7 }]}
            onPress={submit}
            disabled={busy}
          >
            <Text style={styles.btnText}>{busy ? "Signing in…" : "Sign In"}</Text>
          </Pressable>
        </View>

        <Text style={styles.footerText}>
          Having trouble accessing your account?{"\n"}Contact your restaurant manager for support.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flexGrow: 1, padding: 32, justifyContent: "center" },

  iconContainer: { alignItems: "center", marginBottom: 32 },
  iconBox: {
    width: 64, height: 64, borderRadius: 16,
    backgroundColor: "#111827",
    alignItems: "center", justifyContent: "center",
  },
  badge: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 12, marginTop: 12, gap: 4,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#10B981" },
  badgeText: { fontSize: 10, fontWeight: "700", color: "#10B981", letterSpacing: 1 },

  title: { fontSize: 28, fontWeight: "700", color: "#111827", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#6B7280", marginBottom: 32, lineHeight: 22 },

  form: { marginBottom: 32 },
  eyeBtn: { position: "absolute", right: 16, bottom: 24, padding: 4 },
  forgot: {
    color: "#10B981", fontSize: 14, fontWeight: "600",
    textAlign: "right", marginTop: -8, marginBottom: 24,
  },
  btn: {
    backgroundColor: "#111827", height: 52,
    borderRadius: 12, alignItems: "center", justifyContent: "center",
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  footerText: { fontSize: 12, color: "#9CA3AF", textAlign: "center", lineHeight: 18 },

  // Role picker
  roleList: { gap: 12, marginTop: 8, marginBottom: 28 },
  roleCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 16, borderRadius: 16, gap: 14,
    borderWidth: 1, borderColor: "#E5E7EB",
  },
  roleIconBox: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: "#111827",
    alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  roleTextBox: { flex: 1 },
  roleLabel: { fontSize: 15, fontWeight: "700", color: "#111827", marginBottom: 3 },
  roleDesc: { fontSize: 12, color: "#6B7280", lineHeight: 17 },

  errorText: { color: "#DC2626", fontSize: 14, textAlign: "center", marginBottom: 12 },
  backBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  backText: { fontSize: 14, color: colors.muted, fontWeight: "500" },
});
