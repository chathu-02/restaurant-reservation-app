import { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Switch, ActivityIndicator, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { colors, Field } from "@/components/form-ui";

type StaffMember = { id: string; name: string; role: string; active: boolean };

export default function StaffAccountsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const q = query(collection(db, "users"), where("role", "!=", "customer"));
        const snap = await getDocs(q);
        const users = snap.docs.map(d => ({ id: d.id, ...d.data() } as StaffMember));
        setStaff(users.length ? users : [
          { id: "1", name: "Charu Perera", role: "kitchen", active: true },
          { id: "2", name: "Manager Admin", role: "manager", active: true }
        ]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const toggleActive = async (id: string, current: boolean) => {
    try {
      setStaff(prev => prev.map(s => s.id === id ? { ...s, active: !current } : s));
      await updateDoc(doc(db, "users", id), { active: !current });
    } catch (e) {
      console.error(e);
      // Revert on error
      setStaff(prev => prev.map(s => s.id === id ? { ...s, active: current } : s));
    }
  };

  const filteredStaff = staff.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  const roleBadge = (role: string) => {
    const r = role.toLowerCase();
    const config = r === 'manager' ? { bg: '#E5E7EB', text: '#374151' } :
                   r === 'kitchen' ? { bg: '#F3F4F6', text: '#111827' } :
                   r === 'front' ? { bg: '#DBEAFE', text: '#1D4ED8' } :
                   { bg: '#F3F4F6', text: '#6B7280' };
    return (
      <View style={[styles.badge, { backgroundColor: config.bg }]}>
        <Text style={[styles.badgeText, { color: config.text }]}>{role.toUpperCase()}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Staff accounts</Text>
        <Pressable onPress={() => Alert.alert("Coming soon")} style={styles.iconBtn}>
          <Ionicons name="add" size={24} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.muted} style={styles.searchIcon} />
        <Field label="" placeholder="Search staff members" value={search} onChangeText={setSearch} />
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.green} />
      ) : (
        <FlatList
          data={filteredStaff}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.name.substring(0, 2).toUpperCase()}
                </Text>
              </View>
              <View style={styles.info}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{item.name}</Text>
                  {roleBadge(item.role)}
                </View>
                <View style={styles.statusRow}>
                  <Switch
                    value={item.active}
                    onValueChange={() => toggleActive(item.id, item.active)}
                    trackColor={{ false: colors.border, true: colors.green }}
                  />
                  <Text style={styles.statusText}>{item.active ? "Active" : "Inactive"}</Text>
                </View>
              </View>
              <Ionicons name="create-outline" size={20} color={colors.muted} />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: colors.text },
  iconBtn: { padding: 8 },
  searchContainer: { paddingHorizontal: 16, position: 'relative', marginTop: -10 },
  searchIcon: { position: 'absolute', left: 28, top: 22, zIndex: 1 },
  list: { padding: 16 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#E5E7EB", alignItems: "center", justifyContent: "center", marginRight: 12 },
  avatarText: { fontSize: 14, fontWeight: "700", color: colors.text },
  info: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  name: { fontSize: 16, fontWeight: "600", color: colors.text, marginRight: 8 },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontSize: 10, fontWeight: "700" },
  statusRow: { flexDirection: "row", alignItems: "center" },
  statusText: { marginLeft: 8, fontSize: 12, color: colors.muted },
});
