import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/components/form-ui";
import { subscribeKitchenAlerts, acknowledgeAlert } from "@/lib/kitchen";

export default function KitchenAlertsScreen() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeKitchenAlerts((data) => {
      setAlerts(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const active = alerts.filter(a => !a.acknowledged);
  const past = alerts.filter(a => a.acknowledged);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alerts</Text>
        <Pressable style={styles.profileBtn}>
          <Ionicons name="person-outline" size={20} color={colors.text} />
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.green} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {active.length === 0 && (
            <View style={{ alignItems: "center", marginVertical: 32 }}>
              <Ionicons name="checkmark-circle-outline" size={48} color={colors.border} />
              <Text style={{ color: colors.muted, marginTop: 12, fontWeight: "600" }}>No active alerts</Text>
            </View>
          )}

          {active.map(a => (
            <View key={a.id} style={[styles.alertCard, a.type === "large_group" ? styles.alertCardRed : styles.alertCardYellow]}>
              <View style={styles.alertHeader}>
                <View style={[styles.alertIcon, a.type === "large_group" && styles.alertIconRed]}>
                  {a.type === "large_group" ? (
                    <Text style={{color: "#8A2D2D", fontWeight: "700"}}>!</Text>
                  ) : (
                    <Ionicons name="flash" size={14} color="#A36900" />
                  )}
                </View>
                <View style={styles.alertTitleBox}>
                  <Text style={styles.alertTitle}>
                    {a.type === "large_group" ? "Large group arriving" : a.type === "cancelled" ? "Cancellation" : "Update"}
                  </Text>
                  <Text style={styles.alertSubtitle}>{a.message}</Text>
                </View>
              </View>
              <Pressable style={styles.ackButton} onPress={() => acknowledgeAlert(a.id)}>
                <Text style={styles.ackButtonText}>Acknowledge</Text>
              </Pressable>
            </View>
          ))}

          <Text style={styles.sectionTitle}>EARLIER TODAY</Text>

          <View style={styles.timeline}>
            {past.length === 0 && (
              <Text style={{ color: colors.muted, fontSize: 13 }}>No past events.</Text>
            )}
            {past.map(a => (
              <View key={a.id} style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineLine} />
                <View style={styles.timelineContent}>
                  <View style={styles.timelineHeader}>
                    <Text style={styles.timelineTitle}>{a.type.toUpperCase()}</Text>
                    <Text style={styles.timelineTime}>
                      {a.createdAt?.toDate ? a.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </Text>
                  </View>
                  <Text style={styles.timelineDesc}>{a.message}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingTop: 12, paddingBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: "700", color: colors.text },
  profileBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  content: { padding: 24 },
  
  alertCard: { borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1 },
  alertCardRed: { borderColor: "#F3D9D9", backgroundColor: "#FCF3F3" },
  alertCardYellow: { borderColor: "#FCEBCB", backgroundColor: "#FFFBF0" },
  alertHeader: { flexDirection: "row", alignItems: "flex-start", marginBottom: 16 },
  alertIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: "#FCEBCB", alignItems: "center", justifyContent: "center", marginRight: 12, marginTop: 2 },
  alertIconRed: { backgroundColor: "#F3D9D9" },
  alertTitleBox: { flex: 1 },
  alertTitle: { fontSize: 16, fontWeight: "700", color: colors.text, marginBottom: 4 },
  alertSubtitle: { fontSize: 13, color: colors.muted, lineHeight: 18 },
  
  ackButton: { backgroundColor: colors.text, borderRadius: 12, height: 48, alignItems: "center", justifyContent: "center" },
  ackButtonText: { color: "#fff", fontSize: 15, fontWeight: "600" },

  sectionTitle: { fontSize: 11, fontWeight: "700", color: colors.muted, letterSpacing: 1, marginBottom: 16, marginTop: 16 },
  
  timeline: { paddingLeft: 8 },
  timelineItem: { flexDirection: "row", marginBottom: 24, position: "relative" },
  timelineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border, marginTop: 6, zIndex: 2 },
  timelineLine: { position: "absolute", left: 3, top: 14, bottom: -24, width: 2, backgroundColor: colors.border, zIndex: 1 },
  timelineContent: { flex: 1, marginLeft: 16 },
  timelineHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  timelineTitle: { fontSize: 15, fontWeight: "700", color: colors.text },
  timelineTime: { fontSize: 12, color: colors.border },
  timelineDesc: { fontSize: 14, color: colors.muted },
});
