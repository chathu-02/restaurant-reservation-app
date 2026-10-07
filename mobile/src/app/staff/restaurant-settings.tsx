import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { colors, Button } from "@/components/form-ui";

const DEFAULT_HOURS = {
  Mon: { open: true, hours: "11:00 AM - 10:00 PM" },
  Tue: { open: true, hours: "11:00 AM - 10:00 PM" },
  Wed: { open: true, hours: "11:00 AM - 10:00 PM" },
  Thu: { open: true, hours: "11:00 AM - 10:00 PM" },
  Fri: { open: true, hours: "11:00 AM - 11:30 PM" },
  Sat: { open: true, hours: "10:00 AM - 11:30 PM" },
  Sun: { open: false, hours: "Closed" },
};

export default function RestaurantSettingsScreen() {
  const router = useRouter();
  const [hours, setHours] = useState(DEFAULT_HOURS);
  const [interval, setIntervalVal] = useState(30);
  const [maxParty, setMaxParty] = useState(12);
  const [closedDates, setClosedDates] = useState(["Dec 25, 2023", "Jan 1, 2024"]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDoc(doc(db, "settings", "restaurant"));
        if (snap.exists()) {
          const data = snap.data();
          if (data.openingHours) setHours({ ...DEFAULT_HOURS, ...data.openingHours });
          if (data.bookingInterval) setIntervalVal(data.bookingInterval);
          if (data.maxPartySize) setMaxParty(data.maxPartySize);
          if (data.closedDates) setClosedDates(data.closedDates);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "restaurant"), {
        openingHours: hours,
        bookingInterval: interval,
        maxPartySize: maxParty,
        closedDates
      }, { merge: true });
      Alert.alert("Saved!", "Settings updated successfully.");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const toggleDay = (day: keyof typeof hours) => {
    setHours(prev => ({ ...prev, [day]: { ...prev[day], open: !prev[day].open } }));
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color={colors.green} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Restaurant settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Opening hours</Text>
        <View style={styles.card}>
          {(Object.keys(hours) as (keyof typeof hours)[]).map(day => (
            <View key={day} style={styles.row}>
              <Text style={styles.dayText}>{day}</Text>
              <Text style={[styles.hoursText, !hours[day].open && { color: colors.border }]}>
                {hours[day].open ? hours[day].hours : "Closed"}
              </Text>
              <Switch
                value={hours[day].open}
                onValueChange={() => toggleDay(day)}
                trackColor={{ false: colors.border, true: colors.green }}
              />
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Booking intervals</Text>
        <View style={[styles.card, styles.intervalRow]}>
          {[15, 30, 60].map(val => (
            <Pressable
              key={val}
              style={[styles.intervalBtn, interval === val && styles.intervalBtnActive]}
              onPress={() => setIntervalVal(val)}
            >
              <Text style={[styles.intervalText, interval === val && styles.intervalTextActive]}>
                {val} min
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Max party size</Text>
        <View style={[styles.card, styles.stepperRow]}>
          <Pressable onPress={() => setMaxParty(Math.max(1, maxParty - 1))} style={styles.stepperBtn}>
            <Text style={styles.stepperBtnText}>-</Text>
          </Pressable>
          <Text style={styles.stepperValue}>{maxParty}</Text>
          <Pressable onPress={() => setMaxParty(Math.min(50, maxParty + 1))} style={styles.stepperBtn}>
            <Text style={styles.stepperBtnText}>+</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Closed dates</Text>
        <View style={styles.card}>
          {closedDates.map((d, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.dateText}>{d}</Text>
              <Pressable onPress={() => setClosedDates(prev => prev.filter((_, idx) => idx !== i))}>
                <Ionicons name="close" size={20} color={colors.muted} />
              </Pressable>
            </View>
          ))}
          <Pressable onPress={() => Alert.alert("Coming soon", "Add date picker here")} style={styles.addDateBtn}>
            <Text style={styles.addDateText}>+ Add date</Text>
          </Pressable>
        </View>

        <View style={{ marginTop: 24, marginBottom: 40 }}>
          <Button title={saving ? "Saving..." : "Save Changes"} onPress={save} disabled={saving} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, backgroundColor: "#fff" },
  headerTitle: { fontSize: 18, fontWeight: "700", color: colors.text },
  iconBtn: { padding: 8 },
  content: { padding: 16 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: colors.text, marginBottom: 8, marginTop: 16 },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#E5E7EB" },
  dayText: { width: 40, fontSize: 14, fontWeight: "600", color: colors.text },
  hoursText: { flex: 1, fontSize: 14, color: colors.muted, textAlign: "left", paddingLeft: 16 },
  intervalRow: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  intervalBtn: { flex: 1, height: 40, borderRadius: 8, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  intervalBtnActive: { backgroundColor: colors.text, borderColor: colors.text },
  intervalText: { fontSize: 14, fontWeight: "600", color: colors.text },
  intervalTextActive: { color: "#fff" },
  stepperRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 24 },
  stepperBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" },
  stepperBtnText: { fontSize: 20, fontWeight: "600", color: colors.text },
  stepperValue: { fontSize: 20, fontWeight: "700", color: colors.text, minWidth: 30, textAlign: "center" },
  dateText: { fontSize: 14, color: colors.text },
  addDateBtn: { paddingVertical: 12, marginTop: 8 },
  addDateText: { fontSize: 14, fontWeight: "600", color: colors.green },
});
