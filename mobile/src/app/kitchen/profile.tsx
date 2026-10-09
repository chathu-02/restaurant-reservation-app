import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/components/form-ui";
import { logout } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";

const STATIONS = [
  "MAIN KITCHEN",
  "GRILL & ROAST",
  "PREP STATION",
  "COLD & SALAD",
  "PASTRY & DESSERT",
];

export default function KitchenProfileScreen() {
  const router = useRouter();
  const authContext = useAuth();
  const user = authContext?.user;
  const toggleDuty = authContext?.toggleDuty;
  const updateService = authContext?.updateService;

  const [rushAlerts, setRushAlerts] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const name = user?.name || "Kitchen Chef";
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "KC";
  const email = user?.email || "kitchen@restaurant.com";
  const currentStation = user?.service || "MAIN KITCHEN";

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (err) {
      console.warn("Logout error:", err);
    }
    router.replace("/(auth)/role-choice" as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={10}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Kitchen Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Profile Card ── */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileCopy}>
            <Text style={styles.name}>{name}</Text>
            <View style={styles.roleBadge}>
              <Ionicons name="restaurant" size={13} color="#059669" />
              <Text style={styles.roleText}>CHEF / KITCHEN</Text>
            </View>
            <Text style={styles.email}>{email}</Text>
          </View>
          <View
            style={[
              styles.dutyBadge,
              user?.isOnDuty !== false ? styles.dutyOn : styles.dutyOff,
            ]}
          >
            <View
              style={[
                styles.dutyDot,
                user?.isOnDuty !== false ? styles.dotOn : styles.dotOff,
              ]}
            />
            <Text
              style={[
                styles.dutyBadgeText,
                user?.isOnDuty !== false ? styles.dutyTextOn : styles.dutyTextOff,
              ]}
            >
              {user?.isOnDuty !== false ? "On duty" : "Off duty"}
            </Text>
          </View>
        </View>

        {/* ── Shift / Duty Section ── */}
        <Text style={styles.sectionTitle}>Shift status</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: "#ECFDF5" }]}>
              <Ionicons name="time" size={20} color="#059669" />
            </View>
            <View style={styles.rowCopy}>
              <Text style={styles.rowTitle}>
                {user?.isOnDuty !== false ? "Active on duty" : "Currently off duty"}
              </Text>
              <Text style={styles.rowSubtitle}>
                {user?.isOnDuty !== false
                  ? "Receiving live orders & rush notifications"
                  : "Turn on when starting your kitchen shift"}
              </Text>
            </View>
            <Switch
              value={user?.isOnDuty !== false}
              onValueChange={() => toggleDuty?.()}
              trackColor={{ false: "#CBD5E1", true: "#6EE7B7" }}
              thumbColor={user?.isOnDuty !== false ? "#059669" : "#FFFFFF"}
            />
          </View>
        </View>

        {/* ── Station Selector ── */}
        <Text style={styles.sectionTitle}>Kitchen station</Text>
        <View style={styles.card}>
          <Text style={styles.cardHint}>Select the station you are operating today</Text>
          <View style={styles.chipsContainer}>
            {STATIONS.map((station) => {
              const selected = currentStation === station;
              return (
                <Pressable
                  key={station}
                  onPress={() => updateService?.(station)}
                  style={[styles.chip, selected && styles.chipSelected]}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {station}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ── Kitchen Preferences ── */}
        <Text style={styles.sectionTitle}>Kitchen alerts</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: "#FEF3C7" }]}>
              <Ionicons name="flash-outline" size={20} color="#D97706" />
            </View>
            <View style={styles.rowCopy}>
              <Text style={styles.rowTitle}>Rush hour alerts</Text>
              <Text style={styles.rowSubtitle}>Notify when incoming orders surge</Text>
            </View>
            <Switch
              value={rushAlerts}
              onValueChange={setRushAlerts}
              trackColor={{ false: "#CBD5E1", true: "#FCD34D" }}
              thumbColor={rushAlerts ? "#D97706" : "#FFFFFF"}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: "#E0E7FF" }]}>
              <Ionicons name="volume-high-outline" size={20} color="#4F46E5" />
            </View>
            <View style={styles.rowCopy}>
              <Text style={styles.rowTitle}>Sound notifications</Text>
              <Text style={styles.rowSubtitle}>Chime on new incoming ticket</Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: "#CBD5E1", true: "#A5B4FC" }}
              thumbColor={soundEnabled ? "#4F46E5" : "#FFFFFF"}
            />
          </View>
        </View>

        {/* ── Quick Navigation ── */}
        <Text style={styles.sectionTitle}>Quick access</Text>
        <View style={styles.card}>
          <Pressable
            style={styles.menuRow}
            onPress={() => router.push("/kitchen/today" as never)}
          >
            <View style={[styles.iconBox, { backgroundColor: "#ECFDF5" }]}>
              <Ionicons name="calendar-outline" size={20} color="#059669" />
            </View>
            <View style={styles.rowCopy}>
              <Text style={styles.rowTitle}>Today's prep plan</Text>
              <Text style={styles.rowSubtitle}>Confirmed arrivals & prep times</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </Pressable>

          <View style={styles.divider} />

          <Pressable
            style={styles.menuRow}
            onPress={() => router.push("/kitchen/tables" as never)}
          >
            <View style={[styles.iconBox, { backgroundColor: "#F3E8FF" }]}>
              <Ionicons name="grid-outline" size={20} color="#9333EA" />
            </View>
            <View style={styles.rowCopy}>
              <Text style={styles.rowTitle}>Table assignments</Text>
              <Text style={styles.rowSubtitle}>Live floor dining layout</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </Pressable>
        </View>

        {/* ── Sign Out Button ── */}
        <Pressable
          style={({ pressed }) => [styles.signOutBtn, pressed && styles.signOutPressed]}
          onPress={handleSignOut}
        >
          <View style={styles.signOutIconWrap}>
            <Ionicons name="log-out-outline" size={20} color="#DC2626" />
          </View>
          <Text style={styles.signOutText}>Sign out of Kitchen</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAF9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.2,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },

  // ── Profile Card ──
  profileCard: {
    backgroundColor: "#064E3B",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
    shadowColor: "#064E3B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#A7F3D0",
  },
  avatarText: {
    color: "#047857",
    fontSize: 20,
    fontWeight: "800",
  },
  profileCopy: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 4,
    gap: 4,
  },
  roleText: {
    color: "#A7F3D0",
    fontSize: 10.5,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  email: {
    color: "#D1FAE5",
    fontSize: 12,
    marginTop: 4,
  },
  dutyBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
  },
  dutyOn: {
    backgroundColor: "#ECFDF5",
  },
  dutyOff: {
    backgroundColor: "#FEF2F2",
  },
  dutyDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  dotOn: {
    backgroundColor: "#10B981",
  },
  dotOff: {
    backgroundColor: "#EF4444",
  },
  dutyBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  dutyTextOn: {
    color: "#047857",
  },
  dutyTextOff: {
    color: "#B91C1C",
  },

  // ── Sections & Cards ──
  sectionTitle: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.2,
    borderColor: "#E2E8F0",
    marginBottom: 20,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  rowCopy: {
    flex: 1,
    marginLeft: 12,
  },
  rowTitle: {
    color: "#0F172A",
    fontSize: 14.5,
    fontWeight: "700",
  },
  rowSubtitle: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },

  // ── Chips ──
  cardHint: {
    color: "#64748B",
    fontSize: 12.5,
    marginBottom: 12,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderWidth: 1.2,
    borderColor: "#CBD5E1",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: "#F8FAFC",
  },
  chipSelected: {
    backgroundColor: "#ECFDF5",
    borderColor: "#10B981",
  },
  chipText: {
    color: "#475569",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  chipTextSelected: {
    color: "#065F46",
  },

  // ── Menu Rows ──
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 12,
  },

  // ── Sign Out Button ──
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    borderWidth: 1.5,
    borderColor: "#FECACA",
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 18,
    gap: 10,
    marginTop: 4,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  signOutPressed: {
    opacity: 0.85,
    backgroundColor: "#FEE2E2",
  },
  signOutIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  signOutText: {
    color: "#DC2626",
    fontSize: 15,
    fontWeight: "800",
  },
});
