import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/components/form-ui";
import { TableDoc, layoutRows, loadTables, loadDayReservations, dateValue } from "@/lib/booking";

export default function StaffTablesScreen() {
  const [tables, setTables] = useState<TableDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [statuses, setStatuses] = useState<Record<string, "free" | "occupied" | "reserved">>({});

  const load = async () => {
    setLoading(true);
    try {
      const t = await loadTables();
      setTables(t);

      const res = await loadDayReservations(dateValue(new Date()));
      const now = new Date().getHours() * 60 + new Date().getMinutes();
      
      const newStatuses: Record<string, "free" | "occupied" | "reserved"> = {};
      t.forEach(table => {
        newStatuses[table.id] = "free";
      });

      res.forEach(r => {
        if (!r.tableIds) return;
        r.tableIds.forEach(tid => {
          if (r.status === "seated") {
            newStatuses[tid] = "occupied";
          } else if (r.status === "confirmed" && r.timeMinutes <= now + 90) {
            if (newStatuses[tid] !== "occupied") newStatuses[tid] = "reserved";
          }
        });
      });

      setStatuses(newStatuses);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const totalSeats = tables.reduce((acc, t) => acc + t.seats, 0);
  const rows = layoutRows(tables);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tables</Text>
        <Pressable onPress={load}>
          <Ionicons name="refresh" size={24} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.statsBar}>
        <Text style={styles.statsText}>{tables.length} tables • {totalSeats} seats</Text>
        <View style={styles.legend}>
          <View style={[styles.dot, { backgroundColor: "#fff", borderWidth: 1, borderColor: colors.border }]} />
          <Text style={styles.legendText}>Free</Text>
          <View style={[styles.dot, { backgroundColor: "#FCEBCB", marginLeft: 8 }]} />
          <Text style={styles.legendText}>Reserved</Text>
          <View style={[styles.dot, { backgroundColor: colors.green, marginLeft: 8 }]} />
          <Text style={styles.legendText}>Occupied</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} color={colors.green} />
      ) : (
        <ScrollView style={styles.canvas} contentContainerStyle={styles.canvasContent}>
          {rows.map((row, i) => (
            <View key={i} style={styles.tableRow}>
              {row.map(t => {
                const status = statuses[t.id] || "free";
                const isOcc = status === "occupied";
                const isRes = status === "reserved";
                
                return (
                  <View key={t.id} style={{ alignItems: "center" }}>
                    <View
                      style={[
                        styles.tableShape, 
                        isOcc && styles.tableOcc, 
                        isRes && styles.tableRes
                      ]}
                    >
                      <Text style={[styles.tableName, isOcc && { color: "#fff" }, isRes && { color: "#A36900" }]}>{t.name}</Text>
                      <Text style={[styles.tableSeats, isOcc && { color: "#DDE4DF" }, isRes && { color: "#A36900" }]}>{t.seats} seats</Text>
                    </View>
                    <Text style={styles.statusLabel}>{status.charAt(0).toUpperCase() + status.slice(1)}</Text>
                  </View>
                );
              })}
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingTop: 12, paddingBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: "700", color: colors.text },
  statsBar: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 24, paddingBottom: 16 },
  statsText: { fontSize: 13, fontWeight: "600", color: colors.text },
  legend: { flexDirection: "row", alignItems: "center" },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 4 },
  legendText: { fontSize: 10, color: colors.muted },
  canvas: { flex: 1, backgroundColor: colors.bg },
  canvasContent: { padding: 32, gap: 32, alignItems: "center" },
  tableRow: { flexDirection: "row", gap: 32, justifyContent: "center", flexWrap: "wrap" },
  tableShape: { width: 72, height: 72, borderRadius: 16, backgroundColor: "#fff", borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  tableOcc: { backgroundColor: colors.green, borderColor: colors.green },
  tableRes: { backgroundColor: "#FFF0C2", borderColor: "#FCEBCB" },
  tableName: { fontSize: 16, fontWeight: "700", color: colors.text },
  tableSeats: { fontSize: 11, color: colors.muted },
  statusLabel: { fontSize: 11, fontWeight: "600", color: colors.muted, marginTop: 8 },
});
