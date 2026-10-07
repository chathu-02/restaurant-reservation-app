import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { auth } from "@/lib/firebase";
import { logout } from "@/lib/auth";
import { colors } from "@/components/form-ui";

export default function ProfileScreen() {
  const router = useRouter();
  const user = auth.currentUser;
  const name = user?.displayName || "Staff Member";
  const initials = name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

  const handleLogout = async () => {
    await logout();
    router.replace("/sign-in" as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Pressable style={styles.iconBtn}>
          <Ionicons name="create-outline" size={24} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.profileBox}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
          <View style={styles.cameraIcon}>
            <Ionicons name="camera" size={12} color="#fff" />
          </View>
        </View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{user?.email || "staff@restaurant.com"}</Text>
      </View>

      <View style={styles.menuCard}>
        <MenuRow icon="person-outline" label="Edit personal details" />
        <MenuRow icon="lock-closed-outline" label="Change password" onPress={() => router.push("/forgot-password" as never)} />
        <MenuRow icon="help-circle-outline" label="Help & support" noBorder />
      </View>

      <Pressable style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={colors.error} />
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function MenuRow({ icon, label, onPress, noBorder }: any) {
  return (
    <Pressable style={[styles.menuRow, !noBorder && styles.menuBorder]} onPress={onPress}>
      <Ionicons name={icon} size={20} color={colors.text} />
      <Text style={styles.menuLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color={colors.border} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingTop: 12, paddingBottom: 24 },
  headerTitle: { fontSize: 24, fontWeight: "700", color: colors.text },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  
  profileBox: { alignItems: "center", marginBottom: 32 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.text, alignItems: "center", justifyContent: "center", marginBottom: 16, position: "relative" },
  avatarText: { color: "#fff", fontSize: 28, fontWeight: "700", letterSpacing: 1 },
  cameraIcon: { position: "absolute", bottom: 0, right: 0, backgroundColor: colors.text, width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: colors.bg },
  name: { fontSize: 20, fontWeight: "700", color: colors.text, textTransform: "uppercase", marginBottom: 4 },
  email: { fontSize: 14, color: colors.muted },

  menuCard: { backgroundColor: "#fff", borderRadius: 16, marginHorizontal: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2, marginBottom: 24 },
  menuRow: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12 },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: "500", color: colors.text },

  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 12 },
  logoutText: { color: colors.error, fontSize: 15, fontWeight: "600" },
});
