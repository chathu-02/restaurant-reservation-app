import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/components/form-ui";
import { ReservationDoc, dateValue, formatTime } from "@/lib/booking";
import { subscribeKitchenReservations, updateReservationStatus, KitchenStatus } from "@/lib/kitchen";

export default function KitchenTodayScreen() {
  const [time, setTime] = useState(new Date());
  const [reservations, setReservations] = useState<ReservationDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stop = subscribeKitchenReservations(dateValue(new Date()), (data) => {
      setReservations(data);
      setLoading(false);
    }, () => setLoading(false));
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => {
      stop();
      clearInterval(t);
    };
  }, []);

  const handleStatus = async (id: string, status: KitchenStatus) => {
    try {
      await updateReservationStatus(id, status);
    } catch (e) {
      Alert.alert("Update failed", "Could not update this booking. Please try again.");
    }
  };

  const currentMins = time.getHours() * 60 + time.getMinutes();
  const upcoming = reservations.filter(r => r.timeMinutes >= currentMins - 30);
  const totalGuests = upcoming.reduce((acc, r) => acc + (r.partySize || 0), 0);

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.green} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.dot} />
              <Text style={styles.headerTitle}>Next hour</Text>
            </View>
            <View style={styles.headerRight}>
              <Ionicons name="time-outline" size={16} color={colors.text} />
              <Text style={styles.currentTime}>
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
          <Text style={styles.subtitle}>Live arrivals for your kitchen staff</Text>

          <View style={styles.summaryCard}>
            <View style={styles.summaryTop}>
              <Text style={styles.summaryLabel}>TOTAL EXPECTED</Text>
              <View style={styles.iconBox}>
                <Ionicons name="people" size={20} color="#fff" />
              </View>
            </View>
            <View style={styles.summaryBottom}>
              <Text style={styles.summaryNumber}>{totalGuests}</Text>
              <Text style={styles.summaryText}>Guests arriving</Text>
            </View>
          </View>

          {upcoming.map(r => {
            const diff = r.timeMinutes - currentMins;
            return (
              <View key={r.id} style={styles.arrivalCard}>
                <View style={styles.arrivalHeader}>
                  <View style={styles.partyAvatar}>
                    <Text style={styles.partyAvatarText}>{r.userName.substring(0,2).toUpperCase()}</Text>
                  </View>
                  <View style={styles.arrivalInfo}>
                    <Text style={styles.arrivalName}>{r.userName}</Text>
                    <Text style={styles.arrivalTable}>{(r.tableNames || []).join(", ")} • {r.partySize} Guests</Text>
                  </View>
                  <View style={styles.timeInfo}>
                    <Text style={diff < 30 ? styles.inTime : styles.inTimeWarning}>
                      {diff > 0 ? `in ${diff} min` : 'due now'}
                    </Text>
                    <Text style={styles.etaTime}>ETA {formatTime(r.timeMinutes)}</Text>
                  </View>
                </View>

                <View style={styles.actions}>
                  {r.status === "pending" && (
                    <Pressable style={styles.confirmBtn} onPress={() => handleStatus(r.id, "confirmed")}>
                      <Text style={styles.confirmBtnText}>Confirm booking</Text>
                    </Pressable>
                  )}
                  {r.status === "confirmed" && (
                    <Pressable style={styles.seatBtn} onPress={() => handleStatus(r.id, "seated")}>
                      <Text style={styles.seatBtnText}>Mark as seated</Text>
                    </Pressable>
                  )}
                  {r.status === "seated" && (
                    <Pressable style={styles.prepBtn} onPress={() => handleStatus(r.id, "preparing")}>
                      <Text style={styles.prepBtnText}>Start prep</Text>
                    </Pressable>
                  )}
                  {r.status === "preparing" && (
                    <Pressable style={styles.readyBtn} onPress={() => handleStatus(r.id, "ready")}>
                      <Text style={styles.readyBtnText}>Mark ready</Text>
                    </Pressable>
                  )}
                  {r.status === "ready" && (
                    <Pressable style={styles.readyBtn} onPress={() => handleStatus(r.id, "served")}>
                      <Text style={styles.readyBtnText}>Served</Text>
                    </Pressable>
                  )}
                  {["seated", "preparing", "ready", "served"].includes(r.status) && (
                    <View style={styles.seatedChip}><Text style={styles.seatedChipText}>{r.status}</Text></View>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

      <View style={styles.floatingContainer}>
        <Pressable style={styles.floatingButton}>
          <Ionicons name="clipboard-outline" size={20} color="#fff" />
          <Text style={styles.floatingButtonText}>Kitchen Prep View</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 24, paddingBottom: 100 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.green },
  headerTitle: { fontSize: 24, fontWeight: "700", color: colors.text },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 4 },
  currentTime: { fontSize: 14, fontWeight: "600", color: colors.text },
  subtitle: { fontSize: 14, color: colors.muted, marginBottom: 24 },
  
  summaryCard: { backgroundColor: colors.text, borderRadius: 16, padding: 20, marginBottom: 24 },
  summaryTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  summaryLabel: { color: colors.border, fontSize: 11, fontWeight: "700", letterSpacing: 1 },
  iconBox: { width: 36, height: 36, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.1)", alignItems: "center", justifyContent: "center" },
  summaryBottom: { flexDirection: "row", alignItems: "baseline", gap: 8 },
  summaryNumber: { color: "#fff", fontSize: 40, fontWeight: "700" },
  summaryText: { color: colors.green, fontSize: 16, fontWeight: "600" },
  
  arrivalCard: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  arrivalHeader: { flexDirection: "row", alignItems: "center" },
  partyAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center", marginRight: 12 },
  partyAvatarText: { fontSize: 14, fontWeight: "700", color: colors.text },
  arrivalInfo: { flex: 1 },
  arrivalName: { fontSize: 16, fontWeight: "700", color: colors.text, marginBottom: 4 },
  arrivalTable: { fontSize: 13, color: colors.muted },
  timeInfo: { alignItems: "flex-end" },
  inTime: { fontSize: 15, fontWeight: "700", color: colors.green, marginBottom: 2 },
  inTimeWarning: { fontSize: 15, fontWeight: "700", color: colors.muted, marginBottom: 2 },
  etaTime: { fontSize: 11, color: colors.muted },
  
  seatBtn: { marginTop: 12, backgroundColor: colors.bg, padding: 10, borderRadius: 8, alignItems: "center" },
  seatBtnText: { color: colors.text, fontWeight: "600", fontSize: 13 },
  confirmBtn: { backgroundColor: "#D5EDE3", padding: 10, borderRadius: 8, alignItems: "center" },
  confirmBtnText: { color: "#14503E", fontWeight: "700", fontSize: 13 },
  actions: { marginTop: 12, gap: 8 },
  prepBtn: { backgroundColor: "#E9F2FF", padding: 10, borderRadius: 8, alignItems: "center" },
  prepBtnText: { color: "#1D4ED8", fontWeight: "700", fontSize: 13 },
  readyBtn: { backgroundColor: "#D5EDE3", padding: 10, borderRadius: 8, alignItems: "center" },
  readyBtnText: { color: "#14503E", fontWeight: "700", fontSize: 13 },
  seatedChip: { marginTop: 12, alignSelf: "flex-start", backgroundColor: "#D5EDE3", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16 },
  seatedChipText: { color: "#14503E", fontSize: 12, fontWeight: "700" },

  floatingContainer: { position: "absolute", bottom: 16, left: 0, right: 0, alignItems: "center" },
  floatingButton: { flexDirection: "row", alignItems: "center", backgroundColor: colors.text, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 30, gap: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 },
  floatingButtonText: { color: "#fff", fontSize: 15, fontWeight: "600" },
});
