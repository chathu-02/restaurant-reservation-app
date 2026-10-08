import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/components/form-ui";
import { ReservationDoc, formatTime, dateValue, nextDays } from "@/lib/booking";
import { subscribeKitchenReservations } from "@/lib/kitchen";

export default function KitchenUpcomingScreen() {
  const [dates] = useState(nextDays(7));
  const [selectedDate, setSelectedDate] = useState(dates[0].value);
  const [reservations, setReservations] = useState<ReservationDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const stop = subscribeKitchenReservations(
      selectedDate,
      (data) => {
        setReservations(data);
        setLoading(false);
      },
      () => {
        setReservations([]);
        setLoading(false);
      }
    );
    return stop;
  }, [selectedDate]);

  const grouped = reservations.reduce((acc, r) => {
    const t = formatTime(r.timeMinutes);
    if (!acc[t]) acc[t] = [];
    acc[t].push(r);
    return acc;
  }, {} as Record<string, ReservationDoc[]>);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Upcoming</Text>
        <Pressable style={styles.searchBtn}>
          <Ionicons name="search" size={20} color={colors.text} />
        </Pressable>
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
        >
          {Object.keys(grouped).length === 0 && (
            <View style={{ alignItems: "center", marginTop: 60 }}>
              <Ionicons name="calendar-outline" size={48} color={colors.border} />
              <Text style={{ color: colors.muted, marginTop: 12, fontWeight: "600" }}>No reservations for this day.</Text>
            </View>
          )}

          {Object.entries(grouped).map(([time, items]) => (
            <View key={time}>
              <Text style={styles.timeSection}>{time}</Text>
              {items.map(r => (
                <View key={r.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.partyBadge}>
                      <Text style={styles.partyNum}>{r.partySize}</Text>
                    </View>
                    <View style={styles.cardInfo}>
                      <View style={styles.nameRow}>
                        <Text style={styles.guestName}>{r.userName}</Text>
                        {r.partySize >= 10 && (
                          <View style={styles.largeGroupBadge}>
                            <Text style={styles.largeGroupText}>LARGE GROUP</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.tableInfo}>{(r.tableNames || []).join(", ")} • {r.status.toUpperCase()}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingTop: 12, paddingBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: "700", color: colors.text },
  searchBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  calendarStrip: { maxHeight: 80, minHeight: 80 },
  calendarStripContent: { paddingHorizontal: 24, gap: 12 },
  dateItem: { width: 56, height: 68, borderRadius: 12, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  dateItemSelected: { backgroundColor: colors.text },
  dateDay: { fontSize: 11, fontWeight: "600", color: colors.muted, marginBottom: 4 },
  dateNum: { fontSize: 20, fontWeight: "700", color: colors.text },
  dateTextSelected: { color: "#fff" },
  content: { padding: 24, paddingBottom: 40 },
  timeSection: { fontSize: 13, fontWeight: "600", color: colors.muted, marginTop: 16, marginBottom: 12 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  partyBadge: { width: 40, height: 40, borderRadius: 8, backgroundColor: colors.text, alignItems: "center", justifyContent: "center", marginRight: 12 },
  partyNum: { color: "#fff", fontSize: 18, fontWeight: "700" },
  cardInfo: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  guestName: { fontSize: 16, fontWeight: "700", color: colors.text, marginBottom: 4 },
  tableInfo: { fontSize: 13, color: colors.muted },
  largeGroupBadge: { backgroundColor: "#FFF0C2", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginBottom: 4 },
  largeGroupText: { fontSize: 10, fontWeight: "700", color: "#A36900" },
});
