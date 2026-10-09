import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/components/form-ui";
import {
  acknowledgeAlert,
  acknowledgeKitchenNotification,
  subscribeKitchenAlerts,
} from "@/lib/kitchen";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type KitchenFeedItem = {
  id: string;
  type: string;
  message: string;
  title?: string;
  acknowledged: boolean;
  createdAt?: { toDate?: () => Date } | Date;
  source: "kitchen" | "notification";
};

export default function KitchenAlertsScreen() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<KitchenFeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let kitchenItems: KitchenFeedItem[] = [];
    let notificationItems: KitchenFeedItem[] = [];
    const updateFeed = () => {
      setAlerts(
        [...kitchenItems, ...notificationItems].sort((a, b) => {
          const aTime = a.createdAt && "toDate" in a.createdAt && a.createdAt.toDate
            ? a.createdAt.toDate().getTime()
            : a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
          const bTime = b.createdAt && "toDate" in b.createdAt && b.createdAt.toDate
            ? b.createdAt.toDate().getTime()
            : b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
          return bTime - aTime;
        })
      );
      setLoading(false);
    };
    const unsubKitchen = subscribeKitchenAlerts((data) => {
      kitchenItems = data.map((item) => ({
        ...item,
        source: "kitchen" as const,
        acknowledged: !!item.acknowledged,
      }));
      updateFeed();
    });
    const unsubNotifications = onSnapshot(
      query(collection(db, "notifications"), orderBy("createdAt", "desc")),
      (snap) => {
        notificationItems = snap.docs
          .map((item) => {
            const data = item.data();
            return {
              id: item.id,
              title: data.title || "Staff update",
              type: data.type || "info",
              message: data.message || data.body || "",
              acknowledged: !!data.read,
              createdAt: data.createdAt,
              source: "notification" as const,
            };
          })
          .filter((item) =>
            ["booking", "critical_booking", "cancellation", "reservation_status", "critical"].includes(item.type)
          );
        updateFeed();
      },
      () => setLoading(false)
    );
    return () => {
      unsubKitchen();
      unsubNotifications();
    };
  }, []);

  const active = alerts.filter(a => !a.acknowledged);
  const past = alerts.filter(a => a.acknowledged);

  const alertTitle = (alert: KitchenFeedItem) => {
    if (alert.type === "large_group") return "Large group arriving";
    if (alert.type === "cancelled" || alert.type === "cancellation") return "Reservation cancelled";
    if (alert.type === "critical_booking" || alert.type === "critical") return "Priority booking alert";
    if (alert.type === "reservation_status") return alert.title || "Kitchen status update";
    return alert.title || "New booking";
  };

  const alertTone = (alert: KitchenFeedItem) =>
    ["large_group", "cancelled", "cancellation", "critical_booking", "critical"].includes(alert.type)
      ? "critical"
      : alert.type === "reservation_status" ? "status" : "booking";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alerts</Text>
        <Pressable
          style={styles.profileBtn}
          onPress={() => router.push("/kitchen/profile" as never)}
          hitSlop={8}
        >
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

          {active.map(a => {
            const tone = alertTone(a);
            return (
            <View key={`${a.source}-${a.id}`} style={[styles.alertCard, tone === "critical" ? styles.alertCardRed : tone === "status" ? styles.alertCardBlue : styles.alertCardYellow]}>
              <View style={styles.alertHeader}>
                <View style={[styles.alertIcon, tone === "critical" && styles.alertIconRed, tone === "status" && styles.alertIconBlue]}>
                  {tone === "critical" ? (
                    <Text style={{color: "#8A2D2D", fontWeight: "700"}}>!</Text>
                  ) : tone === "status" ? (
                    <Ionicons name="sync-outline" size={14} color="#1D4ED8" />
                  ) : (
                    <Ionicons name="flash" size={14} color="#A36900" />
                  )}
                </View>
                <View style={styles.alertTitleBox}>
                  <Text style={styles.alertTitle}>{alertTitle(a)}</Text>
                  <Text style={styles.alertSubtitle}>{a.message}</Text>
                </View>
              </View>
              <Pressable
                style={styles.ackButton}
                onPress={() => a.source === "kitchen" ? acknowledgeAlert(a.id) : acknowledgeKitchenNotification(a.id)}
              >
                <Text style={styles.ackButtonText}>{a.source === "kitchen" ? "Acknowledge" : "Mark as read"}</Text>
              </Pressable>
            </View>
            );
          })}

          <Text style={styles.sectionTitle}>EARLIER TODAY</Text>

          <View style={styles.timeline}>
            {past.length === 0 && (
              <Text style={{ color: colors.muted, fontSize: 13 }}>No past events.</Text>
            )}
            {past.map(a => (
              <View key={`${a.source}-${a.id}`} style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineLine} />
                <View style={styles.timelineContent}>
                  <View style={styles.timelineHeader}>
                    <Text style={styles.timelineTitle}>{alertTitle(a).toUpperCase()}</Text>
                    <Text style={styles.timelineTime}>
                      {a.createdAt && "toDate" in a.createdAt && a.createdAt.toDate
                        ? a.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : ''}
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
  alertCardBlue: { borderColor: "#D7E5FC", backgroundColor: "#F2F7FF" },
  alertCardYellow: { borderColor: "#FCEBCB", backgroundColor: "#FFFBF0" },
  alertHeader: { flexDirection: "row", alignItems: "flex-start", marginBottom: 16 },
  alertIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: "#FCEBCB", alignItems: "center", justifyContent: "center", marginRight: 12, marginTop: 2 },
  alertIconRed: { backgroundColor: "#F3D9D9" },
  alertIconBlue: { backgroundColor: "#D7E5FC" },
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
