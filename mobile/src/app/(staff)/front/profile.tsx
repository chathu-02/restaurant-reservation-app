import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Badge, colors } from "@/components/form-ui";
import { logout } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";

export default function FrontStaffProfile() {
  const router = useRouter();
  const { user, toggleDuty, updateService } = useAuth();
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const name = user?.name || "Front staff";
  const initials = name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();
  const services = ["BREAKFAST SERVICE", "LUNCH SERVICE", "DINNER SERVICE", "NIGHT SHIFT"];

  const signOut = () => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/role-choice" as never);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={21} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>My profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials || "FS"}</Text>
          </View>
          <View style={styles.profileCopy}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.role}>FRONT STAFF</Text>
            <Text style={styles.email}>{user?.email || "Staff account"}</Text>
          </View>
          <Badge text={user?.isOnDuty ? "On duty" : "Off duty"} tone={user?.isOnDuty ? "good" : "wait"} />
        </View>

        <Text style={styles.sectionLabel}>Shift status</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: "#D5EDE3" }]}>
              <Ionicons name="time-outline" size={20} color={colors.green} />
            </View>
            <View style={styles.rowCopy}>
              <Text style={styles.rowTitle}>{user?.isOnDuty ? "You are on duty" : "You are off duty"}</Text>
              <Text style={styles.rowSubtitle}>
                {user?.isOnDuty ? "You will receive live booking alerts." : "Turn this on when your shift starts."}
              </Text>
            </View>
            <Switch
              value={user?.isOnDuty ?? true}
              onValueChange={toggleDuty}
              trackColor={{ false: "#CBD5E1", true: "#86EFAC" }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>Current service</Text>
        <View style={styles.card}>
          <Text style={styles.cardHint}>Choose the service you are working.</Text>
          <View style={styles.chips}>
            {services.map((service) => {
              const selected = user?.service === service;
              return (
                <Pressable
                  key={service}
                  onPress={() => updateService(service)}
                  style={[styles.chip, selected && styles.chipSelected]}>
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {service.replace(" SERVICE", "")}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Text style={styles.sectionLabel}>Preferences</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: "#FEF3C7" }]}>
              <Ionicons name="notifications-outline" size={20} color="#B45309" />
            </View>
            <View style={styles.rowCopy}>
              <Text style={styles.rowTitle}>Booking alerts</Text>
              <Text style={styles.rowSubtitle}>New reservations and kitchen updates</Text>
            </View>
            <Switch
              value={alertsEnabled}
              onValueChange={setAlertsEnabled}
              trackColor={{ false: "#CBD5E1", true: "#FCD34D" }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>Quick access</Text>
        <View style={styles.card}>
          <Pressable style={styles.menuRow} onPress={() => router.push("/kitchen" as never)}>
            <View style={[styles.iconBox, { backgroundColor: "#D5EDE3" }]}>
              <Ionicons name="restaurant-outline" size={20} color={colors.green} />
            </View>
            <View style={styles.rowCopy}>
              <Text style={styles.rowTitle}>Kitchen board</Text>
              <Text style={styles.rowSubtitle}>View live customer bookings</Text>
            </View>
            <Ionicons name="chevron-forward" size={19} color={colors.muted} />
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.menuRow} onPress={() => router.push("/queue" as never)}>
            <View style={[styles.iconBox, { backgroundColor: "#E0E7FF" }]}>
              <Ionicons name="people-outline" size={20} color="#4F46E5" />
            </View>
            <View style={styles.rowCopy}>
              <Text style={styles.rowTitle}>Waitlist</Text>
              <Text style={styles.rowSubtitle}>Manage guests waiting for a table</Text>
            </View>
            <Ionicons name="chevron-forward" size={19} color={colors.muted} />
          </Pressable>
        </View>

        <Pressable style={styles.signOut} onPress={signOut}>
          <Ionicons name="log-out-outline" size={19} color={colors.error} />
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  safeArea: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 36 },
  header: { flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "space-between" as const, marginBottom: 22 },
  backButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#FFFFFF", alignItems: "center" as const, justifyContent: "center" as const, borderWidth: 1, borderColor: "#DDE4DF" },
  headerTitle: { color: colors.text, fontSize: 20, fontWeight: "800" as const },
  headerSpacer: { width: 42 },
  profileCard: { backgroundColor: "#123F32", borderRadius: 22, padding: 18, flexDirection: "row" as const, alignItems: "center" as const, marginBottom: 24 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#D5EDE3", alignItems: "center" as const, justifyContent: "center" as const },
  avatarText: { color: colors.green, fontSize: 22, fontWeight: "900" as const },
  profileCopy: { flex: 1, marginLeft: 13 },
  name: { color: "#FFFFFF", fontSize: 18, fontWeight: "800" as const },
  role: { color: "#A7F3D0", fontSize: 11, fontWeight: "800" as const, letterSpacing: 1, marginTop: 4 },
  email: { color: "#C7DCD4", fontSize: 12, marginTop: 5 },
  sectionLabel: { color: colors.muted, fontSize: 11, fontWeight: "800" as const, letterSpacing: 1, marginBottom: 8, marginLeft: 3, textTransform: "uppercase" as const },
  card: { backgroundColor: "#FFFFFF", borderRadius: 17, padding: 15, borderWidth: 1, borderColor: "#DDE4DF", marginBottom: 20 },
  row: { flexDirection: "row" as const, alignItems: "center" as const },
  iconBox: { width: 42, height: 42, borderRadius: 12, alignItems: "center" as const, justifyContent: "center" as const },
  rowCopy: { flex: 1, marginLeft: 12 },
  rowTitle: { color: colors.text, fontSize: 15, fontWeight: "800" as const },
  rowSubtitle: { color: colors.muted, fontSize: 12, marginTop: 3, lineHeight: 17 },
  cardHint: { color: colors.muted, fontSize: 13, marginBottom: 12 },
  chips: { flexDirection: "row" as const, flexWrap: "wrap" as const, gap: 8 },
  chip: { borderWidth: 1, borderColor: "#DDE4DF", borderRadius: 99, paddingHorizontal: 12, paddingVertical: 9, backgroundColor: "#F8FAF9" },
  chipSelected: { backgroundColor: "#D5EDE3", borderColor: "#7CC9A8" },
  chipText: { color: colors.muted, fontSize: 11, fontWeight: "700" as const },
  chipTextSelected: { color: "#14503E" },
  menuRow: { flexDirection: "row" as const, alignItems: "center" as const, minHeight: 55 },
  divider: { height: 1, backgroundColor: "#EEF2F0", marginVertical: 8 },
  signOut: { minHeight: 50, flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "center" as const, gap: 7, marginTop: 2 },
  signOutText: { color: colors.error, fontSize: 15, fontWeight: "800" as const },
};
