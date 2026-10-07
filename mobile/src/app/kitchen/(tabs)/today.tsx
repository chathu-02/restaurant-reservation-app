import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/components/form-ui";

export default function KitchenTodayScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.dot} />
            <Text style={styles.headerTitle}>Next hour</Text>
          </View>
          <View style={styles.headerRight}>
            <Ionicons name="time-outline" size={16} color={colors.text} />
            <Text style={styles.currentTime}>18:45</Text>
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
            <Text style={styles.summaryNumber}>18</Text>
            <Text style={styles.summaryText}>Guests arriving</Text>
          </View>
        </View>

        <View style={styles.arrivalCard}>
          <View style={styles.arrivalHeader}>
            <View style={styles.partyAvatar}>
              <Text style={styles.partyAvatarText}>P4</Text>
            </View>
            <View style={styles.arrivalInfo}>
              <Text style={styles.arrivalName}>The Thompson Party</Text>
              <Text style={styles.arrivalTable}>Table 12 • 4 Guests</Text>
            </View>
            <View style={styles.timeInfo}>
              <Text style={styles.inTime}>in 12 min</Text>
              <Text style={styles.etaTime}>ETA 18:57</Text>
            </View>
          </View>
          <View style={styles.tagsContainer}>
            <View style={styles.tag}>
              <Text style={styles.tagIcon}>🌱</Text>
              <Text style={styles.tagText}>GLUTEN FREE</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagIcon}>🎂</Text>
              <Text style={styles.tagText}>BIRTHDAY</Text>
            </View>
          </View>
        </View>

        <View style={styles.arrivalCard}>
          <View style={styles.arrivalHeader}>
            <View style={styles.partyAvatar}>
              <Text style={styles.partyAvatarText}>P8</Text>
            </View>
            <View style={styles.arrivalInfo}>
              <Text style={styles.arrivalName}>Sarah Jenkins</Text>
              <Text style={styles.arrivalTable}>Table 24 • 8 Guests</Text>
            </View>
            <View style={styles.timeInfo}>
              <Text style={styles.inTimeWarning}>in 28 min</Text>
              <Text style={styles.etaTime}>ETA 19:13</Text>
            </View>
          </View>
          <View style={styles.tagsContainer}>
            <View style={styles.tag}>
              <Text style={styles.tagIcon}>🪑</Text>
              <Text style={styles.tagText}>2 HIGH CHAIRS</Text>
            </View>
          </View>
        </View>

        <View style={styles.arrivalCard}>
          <View style={styles.arrivalHeader}>
            <View style={styles.partyAvatar}>
              <Text style={styles.partyAvatarText}>P2</Text>
            </View>
            <View style={styles.arrivalInfo}>
              <Text style={styles.arrivalName}>Mark Robinson</Text>
              <Text style={styles.arrivalTable}>Window 02 • 2 Guests</Text>
            </View>
            <View style={styles.timeInfo}>
              <Text style={styles.inTimeWarning}>in 45 min</Text>
              <Text style={styles.etaTime}>ETA 19:30</Text>
            </View>
          </View>
        </View>

        <View style={[styles.arrivalCard, { marginBottom: 100 }]}>
          <View style={styles.arrivalHeader}>
            <View style={styles.partyAvatar}>
              <Text style={styles.partyAvatarText}>C4</Text>
            </View>
            <View style={styles.arrivalInfo}>
              <Text style={styles.arrivalName}>Chen Family</Text>
              <Text style={styles.arrivalTable}>Table 8 • 4 Guests</Text>
            </View>
            <View style={styles.timeInfo}>
              <Text style={styles.inTimeWarning}>in 58 min</Text>
              <Text style={styles.etaTime}>ETA 19:43</Text>
            </View>
          </View>
        </View>

      </ScrollView>

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
  content: { padding: 24 },
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
  
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingLeft: 52, marginTop: 12 },
  tag: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: colors.bg, borderRadius: 4 },
  tagIcon: { fontSize: 10 },
  tagText: { fontSize: 10, fontWeight: "600", color: colors.muted, textTransform: "uppercase" },

  floatingContainer: { position: "absolute", bottom: 16, left: 0, right: 0, alignItems: "center" },
  floatingButton: { flexDirection: "row", alignItems: "center", backgroundColor: colors.text, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 30, gap: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 },
  floatingButtonText: { color: "#fff", fontSize: 15, fontWeight: "600" },
});
