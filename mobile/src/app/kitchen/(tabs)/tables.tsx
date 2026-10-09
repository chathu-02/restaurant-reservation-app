import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/components/form-ui";
import { dateValue, formatTime, loadTables, ReservationDoc, TableDoc } from "@/lib/booking";
import { subscribeKitchenReservations } from "@/lib/kitchen";

type TableState = "free" | "booked" | "seated" | "preparing" | "ready" | "served";

const stateLabel: Record<TableState, string> = {
  free: "Available",
  booked: "Booked",
  seated: "Seated",
  preparing: "Preparing",
  ready: "Ready",
  served: "Served",
};

function reservationState(reservation?: ReservationDoc): TableState {
  if (!reservation) return "free";
  if (reservation.status === "seated") return "seated";
  if (reservation.status === "preparing") return "preparing";
  if (reservation.status === "ready") return "ready";
  if (reservation.status === "served") return "served";
  return "booked";
}

export default function KitchenTablesScreen() {
  const [tables, setTables] = useState<TableDoc[]>([]);
  const [reservations, setReservations] = useState<ReservationDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAvailable, setShowAvailable] = useState(true);

  useEffect(() => {
    let mounted = true;
    loadTables()
      .then((data) => {
        if (mounted) setTables(data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    const stop = subscribeKitchenReservations(dateValue(new Date()), setReservations, () => {
      if (mounted) setReservations([]);
    });
    return () => {
      mounted = false;
      stop();
    };
  }, []);

  const tableRows = useMemo(() => {
    const reservationByTable = new Map<string, ReservationDoc>();
    reservations.forEach((reservation) => {
      (reservation.tableIds ?? []).forEach((tableId) => {
        reservationByTable.set(tableId, reservation);
      });
      (reservation.tableNames ?? []).forEach((tableName) => {
        reservationByTable.set(tableName, reservation);
      });
    });

    return tables.map((table) => ({
      table,
      reservation: reservationByTable.get(table.id) ?? reservationByTable.get(table.name),
    }));
  }, [reservations, tables]);

  const visibleRows = tableRows.filter(({ reservation }) => showAvailable || reservation);
  const occupiedCount = tableRows.filter(({ reservation }) => reservation && reservation.status !== "served").length;
  const availableCount = Math.max(0, tables.length - occupiedCount);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Table view</Text>
          <Text style={styles.subtitle}>Live floor assignments for today</Text>
        </View>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} color={colors.green} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryNumber}>{occupiedCount}</Text>
              <Text style={styles.summaryLabel}>Assigned</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={[styles.summaryNumber, { color: colors.green }]}>{availableCount}</Text>
              <Text style={styles.summaryLabel}>Available</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryNumber}>{tables.length}</Text>
              <Text style={styles.summaryLabel}>Total</Text>
            </View>
          </View>

          <Pressable style={styles.filterButton} onPress={() => setShowAvailable((value) => !value)}>
            <Ionicons name={showAvailable ? "layers-outline" : "checkmark-circle-outline"} size={18} color={colors.text} />
            <Text style={styles.filterText}>{showAvailable ? "Showing all tables" : "Showing assigned tables"}</Text>
            <Text style={styles.filterAction}>{showAvailable ? "Hide free" : "Show all"}</Text>
          </Pressable>

          {visibleRows.map(({ table, reservation }) => {
            const state = reservationState(reservation);
            return (
              <View key={table.id} style={[styles.tableCard, state !== "free" && styles.assignedCard]}>
                <View style={styles.tableIcon}>
                  <Ionicons name={state === "free" ? "restaurant-outline" : "restaurant"} size={22} color={state === "free" ? colors.muted : colors.text} />
                </View>
                <View style={styles.tableInfo}>
                  <View style={styles.tableTitleRow}>
                    <Text style={styles.tableName}>{table.name}</Text>
                    <View style={[styles.stateChip, stateStyles[state]]}>
                      <Text style={[styles.stateText, stateTextStyles[state]]}>{stateLabel[state]}</Text>
                    </View>
                  </View>
                  <Text style={styles.seatText}>{table.seats} seats</Text>
                  {reservation ? (
                    <Text style={styles.reservationText}>
                      {reservation.userName} • {reservation.partySize} guests • {formatTime(reservation.timeMinutes)}
                    </Text>
                  ) : (
                    <Text style={styles.availableText}>No booking assigned for today</Text>
                  )}
                </View>
              </View>
            );
          })}

          {tables.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="grid-outline" size={44} color={colors.border} />
              <Text style={styles.emptyTitle}>No tables configured</Text>
              <Text style={styles.emptyText}>Add tables to the restaurant tables collection to display the live table view.</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const stateStyles = StyleSheet.create({
  free: { backgroundColor: "#EAF7F0" },
  booked: { backgroundColor: "#FFF4D6" },
  seated: { backgroundColor: "#E6F0FF" },
  preparing: { backgroundColor: "#E6F0FF" },
  ready: { backgroundColor: "#DDF7EA" },
  served: { backgroundColor: "#EEF1F0" },
});

const stateTextStyles = StyleSheet.create({
  free: { color: "#19704B" },
  booked: { color: "#966600" },
  seated: { color: "#2457A6" },
  preparing: { color: "#2457A6" },
  ready: { color: "#19704B" },
  served: { color: "#5F6B66" },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingHorizontal: 24, paddingTop: 14, paddingBottom: 18 },
  title: { fontSize: 24, fontWeight: "800", color: colors.text },
  subtitle: { color: colors.muted, fontSize: 13, marginTop: 4 },
  liveBadge: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#EAF7F0", paddingHorizontal: 9, paddingVertical: 6, borderRadius: 12 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.green },
  liveText: { color: "#19704B", fontSize: 10, fontWeight: "800" },
  loader: { marginTop: 48 },
  content: { paddingHorizontal: 24, paddingBottom: 32 },
  summaryRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  summaryCard: { flex: 1, backgroundColor: "#fff", borderRadius: 14, padding: 14 },
  summaryNumber: { color: colors.text, fontSize: 24, fontWeight: "800" },
  summaryLabel: { color: colors.muted, fontSize: 11, marginTop: 3 },
  filterButton: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#fff", borderRadius: 12, padding: 13, marginBottom: 14 },
  filterText: { flex: 1, color: colors.text, fontSize: 13, fontWeight: "600" },
  filterAction: { color: colors.green, fontSize: 12, fontWeight: "700" },
  tableCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 16, padding: 14, marginBottom: 10 },
  assignedCard: { borderWidth: 1, borderColor: "#DDE9E2" },
  tableIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center", marginRight: 12 },
  tableInfo: { flex: 1 },
  tableTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  tableName: { color: colors.text, fontSize: 16, fontWeight: "800" },
  stateChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  stateText: { fontSize: 10, fontWeight: "800" },
  seatText: { color: colors.muted, fontSize: 12, marginTop: 3 },
  reservationText: { color: colors.text, fontSize: 12, marginTop: 5 },
  availableText: { color: colors.muted, fontSize: 12, marginTop: 5 },
  emptyState: { alignItems: "center", padding: 40 },
  emptyTitle: { color: colors.text, fontSize: 16, fontWeight: "700", marginTop: 12 },
  emptyText: { color: colors.muted, textAlign: "center", fontSize: 13, lineHeight: 19, marginTop: 6 },
});
