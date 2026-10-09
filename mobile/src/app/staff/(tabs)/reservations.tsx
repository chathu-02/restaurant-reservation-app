import { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/components/form-ui";
import { ReservationDoc, formatTime, dateValue, nextDays } from "@/lib/booking";
import { loadKitchenReservations, markSeated, markNoShow } from "@/lib/kitchen";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function StaffReservationsScreen() {
  const [dates, setDates] = useState(nextDays(7));
  const [selectedDate, setSelectedDate] = useState(dates[0].value);
  const [reservations, setReservations] = useState<ReservationDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const loadData = useCallback(async (date: string) => {
    try {
      const data = await loadKitchenReservations(date);
      setReservations(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setExpanded(null);
    loadData(selectedDate);
  }, [selectedDate, loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData(selectedDate);
  };

  const cancelBooking = async (id: string) => {
    try {
      await updateDoc(doc(db, "reservations", id), { status: "cancelled" });
      loadData(selectedDate);
    } catch (e) {
      Alert.alert("Error cancelling booking");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reservations</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.calendarStrip} contentContainerStyle={styles.calendarStripContent}>
        {dates.map((item, idx) => {
          const isSelected = item.value === selectedDate;
          const dayName = item.label.split(" ")[0].substring(0, 3).toUpperCase();
          const dayNum = item.label.split(" ")[1];
          return (
            <Pressable key={idx} onPress={() => setSelectedDate(item.value)} style={[styles.dateItem, isSelected && styles.dateItemSelected]}>
              <Text style={[styles.dateDay, isSelected && styles.dateTextSelected]}>{dayName}</Text>
              <Text style={[styles.dateNum, isSelected && styles.dateTextSelected]}>{dayNum}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.green} />
      ) : (
        <ScrollView 
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {reservations.length === 0 && (
            <View style={{ alignItems: "center", marginTop: 60 }}>
              <Ionicons name="calendar-outline" size={48} color={colors.border} />
              <Text style={{ color: colors.muted, marginTop: 12, fontWeight: "600" }}>No reservations for this day.</Text>
            </View>
          )}

          {reservations.map(r => {
            const isExpanded = expanded === r.id;
            return (
              <Pressable key={r.id} style={styles.card} onPress={() => setExpanded(isExpanded ? null : r.id)}>
                <View style={styles.cardHeader}>
                  <View style={styles.partyBadge}>
                    <Text style={styles.partyNum}>{r.partySize}</Text>
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.guestName}>{r.userName}</Text>
                    <Text style={styles.tableInfo}>{formatTime(r.timeMinutes)} • {(r.tableNames || []).join(", ")}</Text>
                  </View>
                  <View style={[styles.statusBadge, r.status === "seated" ? {backgroundColor:"#DBEAFE"} : r.status==="pending" ? {backgroundColor:"#FEF3C7"} : {backgroundColor:"#D1FAE5"}]}>
                    <Text style={[styles.statusText, r.status === "seated" ? {color:"#1D4ED8"} : r.status==="pending" ? {color:"#B45309"} : {color:"#065F46"}]}>
                      {r.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
                
                {isExpanded && (
                  <View style={styles.actionArea}>
                    {r.status === "confirmed" && (
                      <Pressable style={[styles.actionBtn, { backgroundColor: colors.green }]} onPress={() => { markSeated(r.id); loadData(selectedDate); }}>
                        <Text style={[styles.actionBtnText, { color: "#fff" }]}>Mark Seated</Text>
                      </Pressable>
                    )}
                    <Pressable style={styles.actionBtn} onPress={() => { markNoShow(r.id); loadData(selectedDate); }}>
                      <Text style={styles.actionBtnText}>No Show</Text>
                    </Pressable>
                    <Pressable style={styles.actionBtn} onPress={() => cancelBooking(r.id)}>
                      <Text style={[styles.actionBtnText, { color: colors.error }]}>Cancel</Text>
                    </Pressable>
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: "700", color: colors.text },
  calendarStrip: { maxHeight: 80, minHeight: 80 },
  calendarStripContent: { paddingHorizontal: 24, gap: 12 },
  dateItem: { width: 56, height: 68, borderRadius: 12, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  dateItemSelected: { backgroundColor: colors.text },
  dateDay: { fontSize: 11, fontWeight: "600", color: colors.muted, marginBottom: 4 },
  dateNum: { fontSize: 20, fontWeight: "700", color: colors.text },
  dateTextSelected: { color: "#fff" },
  content: { padding: 24, paddingBottom: 40 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  partyBadge: { width: 40, height: 40, borderRadius: 8, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center", marginRight: 12 },
  partyNum: { color: colors.text, fontSize: 18, fontWeight: "700" },
  cardInfo: { flex: 1 },
  guestName: { fontSize: 16, fontWeight: "700", color: colors.text, marginBottom: 4 },
  tableInfo: { fontSize: 13, color: colors.muted },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: "700" },
  actionArea: { flexDirection: "row", gap: 8, marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: "#F3F4F6" },
  actionBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: colors.bg, alignItems: "center" },
  actionBtnText: { fontSize: 13, fontWeight: "600", color: colors.text },
});
