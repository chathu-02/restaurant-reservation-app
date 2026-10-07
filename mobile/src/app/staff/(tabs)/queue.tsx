import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { colors } from "@/components/form-ui";

export default function StaffQueueScreen() {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, "queue"), orderBy("joinedAt")), (snap) => {
      setQueue(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (error) => {
      // If collection doesn't exist or permissions fail, just show empty
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Queue</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{queue.length}</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.green} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {queue.length === 0 ? (
            <View style={{ alignItems: "center", marginTop: 60 }}>
              <Ionicons name="people-outline" size={48} color={colors.border} />
              <Text style={{ color: colors.muted, marginTop: 12, fontWeight: "600" }}>Queue is empty.</Text>
            </View>
          ) : (
            queue.map((item, idx) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.posBadge}><Text style={styles.posText}>{idx + 1}</Text></View>
                <View style={styles.info}>
                  <Text style={styles.name}>{item.userName || "Guest"}</Text>
                  <Text style={styles.details}>{item.partySize} Guests</Text>
                </View>
                <View style={styles.timeBox}>
                  <Text style={styles.timeLabel}>WAITING</Text>
                  <Text style={styles.timeVal}>
                    {item.joinedAt ? Math.floor((Date.now() - item.joinedAt.toDate().getTime()) / 60000) : "—"} min
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 24, paddingTop: 12, paddingBottom: 16, gap: 12 },
  headerTitle: { fontSize: 24, fontWeight: "700", color: colors.text },
  badge: { backgroundColor: colors.text, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  content: { padding: 24 },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 16, borderRadius: 16, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  posBadge: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center", marginRight: 16 },
  posText: { fontSize: 16, fontWeight: "700", color: colors.text },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "700", color: colors.text, marginBottom: 4 },
  details: { fontSize: 13, color: colors.muted },
  timeBox: { alignItems: "flex-end" },
  timeLabel: { fontSize: 10, fontWeight: "700", color: colors.muted, marginBottom: 4 },
  timeVal: { fontSize: 16, fontWeight: "700", color: colors.text },
});
