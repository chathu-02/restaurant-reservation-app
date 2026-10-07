import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, getDocs, query, where, onSnapshot, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { dateValue } from "@/lib/booking";
import { colors } from "@/components/form-ui";

export default function StaffDashboardScreen() {
  const router = useRouter();
  const [stats, setStats] = useState({ res: 0, queue: 0, noShow: 0, occupied: 0, total: 12 });
  const [alert, setAlert] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const d = dateValue(new Date());
    
    // Listen to most recent alert
    const unsubAlert = onSnapshot(query(collection(db, "kitchenAlerts"), orderBy("createdAt", "desc"), limit(1)), (snap) => {
      if (!snap.empty) {
        const a = snap.docs[0].data();
        if (!a.acknowledged) setAlert(a.message);
        else setAlert(null);
      }
    });

    async function loadStats() {
      try {
        const snapRes = await getDocs(query(collection(db, "reservations"), where("date", "==", d)));
        let resCount = 0;
        let noShowCount = 0;
        let occupied = 0;
        
        snapRes.forEach(s => {
          const r = s.data();
          if (["confirmed", "pending", "seated"].includes(r.status)) resCount++;
          if (r.status === "no_show") noShowCount++;
          if (r.status === "seated") occupied += (r.tableIds?.length || 1);
        });

        // Get tables count
        const snapTables = await getDocs(collection(db, "tables"));
        const totalTables = snapTables.size || 12;

        setStats({ res: resCount, queue: 0 /* Add queue later */, noShow: noShowCount, occupied, total: totalTables });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
    return () => unsubAlert();
  }, []);

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Today</Text>
            <Text style={styles.headerDate}>{todayStr}</Text>
          </View>
          <Pressable onPress={() => router.push("/staff/profile" as never)} style={styles.profileBtn}>
            <Ionicons name="person" size={20} color={colors.text} />
          </Pressable>
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 40 }} color={colors.green} />
        ) : (
          <View style={styles.grid}>
            <View style={styles.card}>
              <Ionicons name="calendar-outline" size={20} color={colors.text} style={styles.cardIcon} />
              <Text style={styles.cardVal}>{stats.res}</Text>
              <Text style={styles.cardLabel}>Reservations today</Text>
            </View>
            <View style={styles.card}>
              <Ionicons name="people-outline" size={20} color={colors.text} style={styles.cardIcon} />
              <Text style={styles.cardVal}>{stats.queue}</Text>
              <Text style={styles.cardLabel}>Guests in queue</Text>
            </View>
            <View style={styles.card}>
              <Ionicons name="checkbox-outline" size={20} color={colors.text} style={styles.cardIcon} />
              <Text style={styles.cardVal}>{stats.occupied}<Text style={{fontSize: 16, color: colors.muted}}>/{stats.total}</Text></Text>
              <Text style={styles.cardLabel}>Tables occupied</Text>
            </View>
            <View style={styles.card}>
              <Ionicons name="close-circle-outline" size={20} color={colors.text} style={styles.cardIcon} />
              <Text style={styles.cardVal}>{stats.noShow}</Text>
              <Text style={styles.cardLabel}>No-shows</Text>
            </View>
          </View>
        )}

        {alert && (
          <View style={styles.alertBanner}>
            <Ionicons name="flash" size={16} color="#A36900" />
            <Text style={styles.alertText}>{alert}</Text>
          </View>
        )}

        <View style={styles.actionBar}>
          <Pressable style={styles.actionBtn}>
            <Ionicons name="person-add-outline" size={24} color={colors.text} />
            <Text style={styles.actionText}>Walk-in</Text>
          </Pressable>
          <Pressable style={styles.actionBtnMain}>
            <Ionicons name="add" size={24} color="#fff" />
            <Text style={styles.actionTextMain}>New Booking</Text>
          </Pressable>
          <Pressable style={styles.actionBtn}>
            <Ionicons name="options-outline" size={24} color={colors.text} />
            <Text style={styles.actionText}>Manage</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Manager tools</Text>
        <View style={styles.menuCard}>
          <MenuRow icon="people-outline" label="Staff Accounts" onPress={() => router.push("/staff/staff-accounts" as never)} />
          <MenuRow icon="settings-outline" label="Restaurant Settings" onPress={() => router.push("/staff/restaurant-settings" as never)} />
          <MenuRow icon="grid-outline" label="Table Setup" onPress={() => router.push("/staff/floor-layout" as never)} />
          <MenuRow icon="bar-chart-outline" label="Reports" onPress={() => router.push("/staff/reports" as never)} noBorder />
        </View>
      </ScrollView>
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
  content: { padding: 24, paddingBottom: 40 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  headerTitle: { fontSize: 28, fontWeight: "700", color: colors.text, marginBottom: 4 },
  headerDate: { fontSize: 14, color: colors.muted },
  profileBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 24 },
  card: { flex: 1, minWidth: "45%", backgroundColor: "#fff", padding: 16, borderRadius: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  cardIcon: { marginBottom: 12 },
  cardVal: { fontSize: 24, fontWeight: "700", color: colors.text, marginBottom: 4 },
  cardLabel: { fontSize: 12, color: colors.muted },

  alertBanner: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFFBF0", borderColor: "#FCEBCB", borderWidth: 1, padding: 16, borderRadius: 12, marginBottom: 24, gap: 8 },
  alertText: { fontSize: 14, fontWeight: "600", color: "#A36900" },

  actionBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 32 },
  actionBtn: { alignItems: "center", gap: 8 },
  actionText: { fontSize: 12, fontWeight: "600", color: colors.text },
  actionBtnMain: { backgroundColor: colors.text, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, flexDirection: "row", alignItems: "center", gap: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  actionTextMain: { color: "#fff", fontSize: 14, fontWeight: "600" },

  sectionTitle: { fontSize: 14, fontWeight: "700", color: colors.text, marginBottom: 12 },
  menuCard: { backgroundColor: "#fff", borderRadius: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  menuRow: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12 },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: "500", color: colors.text },
});
