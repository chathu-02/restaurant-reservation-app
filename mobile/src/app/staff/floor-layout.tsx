import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Alert, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TableDoc, layoutRows } from "@/lib/booking";
import { colors, Button } from "@/components/form-ui";

export default function FloorLayoutScreen() {
  const router = useRouter();
  const [tables, setTables] = useState<TableDoc[]>([]);
  const [selected, setSelected] = useState<TableDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Edit panel state
  const [editName, setEditName] = useState("");
  const [editSeats, setEditSeats] = useState(2);

  const load = async () => {
    try {
      const snap = await getDocs(collection(db, "tables"));
      const t = snap.docs.map(d => ({ id: d.id, ...d.data() } as TableDoc));
      setTables(t);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const select = (t: TableDoc) => {
    setSelected(t);
    setEditName(t.name);
    setEditSeats(t.seats);
  };

  const saveSelected = () => {
    if (!selected) return;
    setTables(prev => prev.map(t => t.id === selected.id ? { ...t, name: editName, seats: editSeats } : t));
    setSelected(null);
  };

  const addTable = () => {
    const newId = `T${tables.length + 1}`;
    const newTable: TableDoc = { id: newId, name: newId, seats: 2 };
    setTables([...tables, newTable]);
    select(newTable);
  };

  const delTable = async () => {
    if (!selected) return;
    try {
      await deleteDoc(doc(db, "tables", selected.id));
      setTables(prev => prev.filter(t => t.id !== selected.id));
      setSelected(null);
    } catch (e) {
      console.error(e);
      Alert.alert("Error deleting table");
    }
  };

  const saveLayout = async () => {
    setSaving(true);
    try {
      for (const t of tables) {
        await setDoc(doc(db, "tables", t.id), { ...t, status: "free" });
      }
      Alert.alert("Success", "Layout saved!");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to save layout.");
    } finally {
      setSaving(false);
    }
  };

  const totalSeats = tables.reduce((acc, t) => acc + t.seats, 0);
  const rows = layoutRows(tables);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Floor layout</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.statsBar}>
        <View style={styles.statsLeft}>
          <View style={styles.dot} />
          <Text style={styles.statsText}>{tables.length} tables • {totalSeats} seats</Text>
        </View>
        <Pressable onPress={load}>
          <Text style={styles.resetText}><Ionicons name="refresh" /> Reset</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} color={colors.green} />
      ) : (
        <ScrollView style={styles.canvas} contentContainerStyle={styles.canvasContent}>
          {rows.map((row, i) => (
            <View key={i} style={styles.tableRow}>
              {row.map(t => (
                <Pressable
                  key={t.id}
                  style={[styles.tableShape, selected?.id === t.id && styles.tableSelected]}
                  onPress={() => select(t)}
                >
                  <Text style={styles.tableName}>{t.name}</Text>
                  <Text style={styles.tableSeats}>{t.seats} seats</Text>
                </Pressable>
              ))}
            </View>
          ))}
          <Pressable style={styles.addBtn} onPress={addTable}>
            <Text style={styles.addBtnText}>+ Add table</Text>
          </Pressable>
        </ScrollView>
      )}

      {selected && (
        <View style={styles.editPanel}>
          <View style={styles.editHeader}>
            <Text style={styles.editTitle}>Table {selected.name}</Text>
            <Pressable onPress={() => setSelected(null)}>
              <Ionicons name="close" size={20} color={colors.muted} />
            </Pressable>
          </View>
          
          <Text style={styles.label}>Table name</Text>
          <TextInput style={styles.input} value={editName} onChangeText={setEditName} />
          
          <View style={styles.editRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Seats</Text>
              <View style={styles.stepper}>
                <Pressable onPress={() => setEditSeats(Math.max(1, editSeats - 1))} style={styles.stepBtn}><Text style={styles.stepTxt}>-</Text></Pressable>
                <Text style={styles.stepVal}>{editSeats}</Text>
                <Pressable onPress={() => setEditSeats(Math.min(20, editSeats + 1))} style={styles.stepBtn}><Text style={styles.stepTxt}>+</Text></Pressable>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Shape</Text>
              <View style={styles.shapeToggle}>
                <View style={[styles.shapeBtn, styles.shapeActive]}><View style={styles.shapeSquare} /></View>
                <View style={styles.shapeBtn}><View style={styles.shapeCircle} /></View>
              </View>
            </View>
          </View>

          <View style={styles.panelActions}>
            <Pressable style={styles.delBtn} onPress={delTable}>
              <Ionicons name="trash-outline" size={16} color={colors.error} />
              <Text style={styles.delText}>Delete table</Text>
            </Pressable>
            <Button title="Apply" onPress={saveSelected} />
          </View>
        </View>
      )}

      {!selected && (
        <View style={styles.bottomBar}>
          <Button title={saving ? "Saving..." : "✓ Save Layout"} onPress={saveLayout} disabled={saving} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: colors.text },
  iconBtn: { padding: 8 },
  statsBar: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 16 },
  statsLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.green },
  statsText: { fontSize: 12, color: colors.muted },
  resetText: { fontSize: 12, color: colors.muted },
  canvas: { flex: 1, backgroundColor: colors.bg, margin: 16, borderRadius: 16 },
  canvasContent: { padding: 24, gap: 24, alignItems: "center" },
  tableRow: { flexDirection: "row", gap: 24, justifyContent: "center", flexWrap: "wrap" },
  tableShape: { width: 64, height: 64, borderRadius: 12, backgroundColor: "#fff", borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  tableSelected: { borderColor: colors.green, borderWidth: 2 },
  tableName: { fontSize: 14, fontWeight: "700", color: colors.text },
  tableSeats: { fontSize: 10, color: colors.muted },
  addBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 24, backgroundColor: "#fff", borderWidth: 1, borderColor: colors.border, marginTop: 12 },
  addBtnText: { fontSize: 14, fontWeight: "600", color: colors.text },
  bottomBar: { padding: 16, borderTopWidth: 1, borderTopColor: "#E5E7EB" },
  
  editPanel: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24, shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 10 },
  editHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  editTitle: { fontSize: 18, fontWeight: "700", color: colors.text },
  label: { fontSize: 12, fontWeight: "700", color: colors.text, marginBottom: 8 },
  input: { height: 44, borderRadius: 8, backgroundColor: colors.bg, paddingHorizontal: 12, fontSize: 14, marginBottom: 16 },
  editRow: { flexDirection: "row", gap: 16, marginBottom: 24 },
  stepper: { flexDirection: "row", alignItems: "center", backgroundColor: colors.bg, borderRadius: 8, height: 44, paddingHorizontal: 4 },
  stepBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  stepTxt: { fontSize: 18, color: colors.text },
  stepVal: { flex: 1, textAlign: "center", fontSize: 16, fontWeight: "600" },
  shapeToggle: { flexDirection: "row", backgroundColor: colors.bg, borderRadius: 8, height: 44, padding: 4 },
  shapeBtn: { flex: 1, alignItems: "center", justifyContent: "center", borderRadius: 6 },
  shapeActive: { backgroundColor: colors.text },
  shapeSquare: { width: 16, height: 16, backgroundColor: "#fff", borderRadius: 4 },
  shapeCircle: { width: 16, height: 16, backgroundColor: colors.muted, borderRadius: 8 },
  panelActions: { gap: 16 },
  delBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 12 },
  delText: { color: colors.error, fontSize: 14, fontWeight: "600" },
});
