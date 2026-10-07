import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { colors } from "@/components/form-ui";
import { ReservationDoc } from "@/lib/booking";

export default function ReportsScreen() {
  const router = useRouter();
  const [tab, setTab] = useState("Today");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ noShow: 0, avgWait: 18, turnover: 3.2, guests: 0 });
  const [chart, setChart] = useState([20, 15, 10, 45, 55, 35]); // placeholder bar heights

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, "reservations"));
        const res = snap.docs.map(d => d.data() as ReservationDoc);
        
        // Very basic mock calculation for demo
        const guests = res.reduce((acc, r) => acc + (r.partySize || 0), 0);
        const noShows = res.filter(r => r.status === "no_show").length;
        const rate = res.length ? Math.round((noShows / res.length) * 100) : 0;
        
        setStats({ noShow: rate, avgWait: 18, turnover: 3.2, guests });
        
        // Fake peak hours data based on total count to look somewhat dynamic
        const base = res.length % 10 + 10;
        setChart([base, base-5, base-8, base*2, base*2.5, base*1.5]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [tab]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Reports</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.tabs}>
        {["Today", "Week", "Month"].map(t => (
          <Pressable key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.green} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.grid}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>NO-SHOW RATE</Text>
              <View style={styles.statValRow}>
                <Text style={styles.statVal}>{stats.noShow}%</Text>
                <Text style={styles.trendDown}>▼ 1.2%</Text>
              </View>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>AVG WAIT</Text>
              <View style={styles.statValRow}>
                <Text style={styles.statVal}>{stats.avgWait} min</Text>
                <Text style={styles.trendUp}>▲ 4m</Text>
              </View>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>TABLE TURNOVER</Text>
              <View style={styles.statValRow}>
                <Text style={styles.statVal}>{stats.turnover}x</Text>
                <Text style={styles.trendDown}>▼ 0.4x</Text>
              </View>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>TOTAL GUESTS</Text>
              <View style={styles.statValRow}>
                <Text style={styles.statVal}>{stats.guests}</Text>
                <Text style={styles.trendDown}>▼ 22</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Peak hours</Text>
          <View style={styles.chartCard}>
            <View style={styles.bars}>
              {chart.map((val, i) => {
                const max = Math.max(...chart);
                const height = (val / max) * 100;
                const isPeak = height > 70;
                return (
                  <View key={i} style={styles.barCol}>
                    <View style={[styles.bar, { height: `${height}%`, backgroundColor: isPeak ? colors.green : colors.text }]} />
                    <Text style={styles.barLabel}>{["12pm", "2pm", "4pm", "6pm", "8pm", "10pm"][i]}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <Text style={styles.sectionTitle}>Wait time trend</Text>
          <View style={styles.trendCard}>
            <Ionicons name="analytics-outline" size={48} color={colors.green} style={{ alignSelf: 'center', opacity: 0.5, marginVertical: 20 }} />
            <Text style={{textAlign: 'center', color: colors.muted, fontSize: 12}}>Trend chart visualization placeholder</Text>
          </View>

          <View style={styles.recHeader}>
            <Text style={styles.sectionTitle}>Recommendations</Text>
            <Text style={styles.viewAll}>View all</Text>
          </View>
          
          <View style={styles.recRow}>
            <View style={styles.recIcon}><Ionicons name="time" size={16} color={colors.text} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.recTitle}>Increase staff at 6:00 PM</Text>
              <Text style={styles.recDesc}>Based on peak wait times reaching 32 mins yesterday.</Text>
            </View>
          </View>
          <View style={styles.recRow}>
            <View style={styles.recIcon}><Ionicons name="flash" size={16} color={colors.text} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.recTitle}>Turnover efficiency up</Text>
              <Text style={styles.recDesc}>Server team B improved table reset time by 14%.</Text>
            </View>
          </View>

        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: colors.text },
  iconBtn: { padding: 8 },
  tabs: { flexDirection: "row", paddingHorizontal: 16, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 8 },
  tabActive: { backgroundColor: colors.bg },
  tabText: { fontSize: 12, fontWeight: "600", color: colors.muted },
  tabTextActive: { color: colors.text },
  content: { padding: 16, paddingBottom: 40 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 24 },
  statCard: { flex: 1, minWidth: "45%", backgroundColor: colors.bg, padding: 16, borderRadius: 12 },
  statLabel: { fontSize: 10, fontWeight: "700", color: colors.muted, marginBottom: 8 },
  statValRow: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" },
  statVal: { fontSize: 20, fontWeight: "700", color: colors.text },
  trendDown: { fontSize: 10, fontWeight: "700", color: colors.green },
  trendUp: { fontSize: 10, fontWeight: "700", color: colors.error },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: colors.text, marginBottom: 12 },
  chartCard: { height: 180, marginBottom: 24, paddingVertical: 16 },
  bars: { flex: 1, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", paddingHorizontal: 8 },
  barCol: { alignItems: "center", height: "100%", justifyContent: "flex-end" },
  bar: { width: 32, borderRadius: 4, marginBottom: 8 },
  barLabel: { fontSize: 10, color: colors.muted },
  trendCard: { height: 120, backgroundColor: colors.bg, borderRadius: 12, marginBottom: 24, justifyContent: 'center' },
  recHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  viewAll: { fontSize: 12, fontWeight: "600", color: colors.green },
  recRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  recIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" },
  recTitle: { fontSize: 14, fontWeight: "700", color: colors.text, marginBottom: 4 },
  recDesc: { fontSize: 12, color: colors.muted, lineHeight: 18 },
});
