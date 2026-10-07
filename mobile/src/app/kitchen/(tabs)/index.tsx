import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/components/form-ui";

const DATES = [
  { day: "MON", date: "12", selected: true },
  { day: "TUE", date: "13" },
  { day: "WED", date: "14" },
  { day: "THU", date: "15" },
  { day: "FRI", date: "16" },
];

export default function KitchenUpcomingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Upcoming</Text>
        <Pressable style={styles.searchBtn}>
          <Ionicons name="search" size={20} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.calendarStrip} contentContainerStyle={styles.calendarStripContent}>
        {DATES.map((item, idx) => (
          <View key={idx} style={[styles.dateItem, item.selected && styles.dateItemSelected]}>
            <Text style={[styles.dateDay, item.selected && styles.dateTextSelected]}>{item.day}</Text>
            <Text style={[styles.dateNum, item.selected && styles.dateTextSelected]}>{item.date}</Text>
          </View>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.timeSection}>6:00 PM</Text>
        
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.partyBadge}>
              <Text style={styles.partyNum}>2</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.guestName}>Sarah Jenkins</Text>
              <Text style={styles.tableInfo}>Table 4 • Indoors</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.border} />
          </View>
          <View style={styles.tagsContainer}>
            <View style={styles.tag}><Text style={styles.tagText}>VEGETARIAN</Text></View>
            <View style={styles.tag}><Text style={styles.tagText}>ANNIVERSARY</Text></View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.partyBadge}>
              <Text style={styles.partyNum}>4</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.guestName}>Michael Chen</Text>
              <Text style={styles.tableInfo}>Table 12 • Window</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.border} />
          </View>
          <View style={styles.tagsContainer}>
            <View style={styles.tag}><Text style={styles.tagText}>NUT ALLERGY</Text></View>
          </View>
        </View>

        <Text style={styles.timeSection}>7:00 PM</Text>
        
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.partyBadge}>
              <Text style={styles.partyNum}>12</Text>
            </View>
            <View style={styles.cardInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.guestName}>Rodriguez Party</Text>
                <View style={styles.largeGroupBadge}>
                  <Text style={styles.largeGroupText}>LARGE GROUP</Text>
                </View>
              </View>
              <Text style={styles.tableInfo}>Patio • Tables 20-22</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.border} />
          </View>
          <View style={styles.tagsContainer}>
            <View style={styles.tag}><Text style={styles.tagText}>BIRTHDAY CAKE</Text></View>
            <View style={styles.tag}><Text style={styles.tagText}>PRE-ORDERED DRINKS</Text></View>
          </View>
        </View>

        <Text style={styles.timeSection}>8:00 PM</Text>
        
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.partyBadge}>
              <Text style={styles.partyNum}>2</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.guestName}>Emma Thompson</Text>
              <Text style={styles.tableInfo}>Bar Seating</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.border} />
          </View>
          <View style={styles.tagsContainer}>
            <View style={styles.tag}><Text style={styles.tagText}>FIRST VISIT</Text></View>
          </View>
        </View>
      </ScrollView>
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
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  partyBadge: { width: 40, height: 40, borderRadius: 8, backgroundColor: colors.text, alignItems: "center", justifyContent: "center", marginRight: 12 },
  partyNum: { color: "#fff", fontSize: 18, fontWeight: "700" },
  cardInfo: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  guestName: { fontSize: 16, fontWeight: "700", color: colors.text, marginBottom: 4 },
  tableInfo: { fontSize: 13, color: colors.muted },
  largeGroupBadge: { backgroundColor: "#FFF0C2", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginBottom: 4 },
  largeGroupText: { fontSize: 10, fontWeight: "700", color: "#A36900" },
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingLeft: 52 },
  tag: { paddingHorizontal: 8, paddingVertical: 4, backgroundColor: colors.bg, borderRadius: 4 },
  tagText: { fontSize: 10, fontWeight: "600", color: colors.muted, textTransform: "uppercase" },
});
