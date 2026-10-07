import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/components/form-ui";

export default function KitchenAlertsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alerts</Text>
        <Pressable style={styles.profileBtn}>
          <Ionicons name="person-outline" size={20} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={[styles.alertCard, styles.alertCardRed]}>
          <View style={styles.alertHeader}>
            <View style={styles.alertIconRed}>
              <Text style={{color: "#8A2D2D", fontWeight: "700"}}>!</Text>
            </View>
            <View style={styles.alertTitleBox}>
              <Text style={styles.alertTitle}>Large group arriving</Text>
              <Text style={styles.alertSubtitle}>Party of 12 at 7:30 PM</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>TABLE</Text>
              <Text style={styles.infoValue}>T24, T25{'\n'}Joined</Text>
            </View>
            <View style={[styles.infoBox, { borderLeftWidth: 1, borderLeftColor: "#F3D9D9", paddingLeft: 16 }]}>
              <Text style={styles.infoLabel}>COUNTDOWN</Text>
              <Text style={[styles.infoValue, { color: "#8A2D2D" }]}>14 mins</Text>
            </View>
          </View>

          <View style={styles.requestsBox}>
            <Text style={styles.infoLabel}>SPECIAL REQUESTS</Text>
            <Text style={styles.requestsText}>2 High chairs, 1 Birthday cake pre-ordered</Text>
          </View>

          <Pressable style={styles.ackButton}>
            <Text style={styles.ackButtonText}>Acknowledge</Text>
          </Pressable>
        </View>

        <View style={styles.rushCard}>
          <View style={styles.rushHeader}>
            <View style={styles.rushIconBox}>
              <Ionicons name="flash" size={16} color="#fff" />
            </View>
            <View style={styles.alertTitleBox}>
              <Text style={styles.alertTitle}>Rush expected</Text>
              <Text style={styles.alertSubtitle}>8 groups in 30 min</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.border} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>EARLIER TODAY</Text>

        <View style={styles.timeline}>
          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineLine} />
            <View style={styles.timelineContent}>
              <View style={styles.timelineHeader}>
                <Text style={styles.timelineTitle}>Shift Started</Text>
                <Text style={styles.timelineTime}>4:00 PM</Text>
              </View>
              <Text style={styles.timelineDesc}>Evening service staff logged in.</Text>
            </View>
          </View>
          
          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineLine} />
            <View style={styles.timelineContent}>
              <View style={styles.timelineHeader}>
                <Text style={styles.timelineTitle}>Cancellation</Text>
                <Text style={styles.timelineTime}>3:45 PM</Text>
              </View>
              <Text style={styles.timelineDesc}>Table 4, Party of 2 canceled.</Text>
            </View>
          </View>
          
          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <View style={styles.timelineHeader}>
                <Text style={styles.timelineTitle}>Menu Updated</Text>
                <Text style={styles.timelineTime}>1:12 PM</Text>
              </View>
              <Text style={styles.timelineDesc}>Specials added for lunch service.</Text>
            </View>
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
  profileBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  content: { padding: 24 },
  
  alertCard: { borderRadius: 16, padding: 16, marginBottom: 16, backgroundColor: "#fff", borderWidth: 1 },
  alertCardRed: { borderColor: "#F3D9D9", backgroundColor: "#FCF3F3" },
  alertHeader: { flexDirection: "row", alignItems: "flex-start", marginBottom: 16 },
  alertIconRed: { width: 24, height: 24, borderRadius: 12, backgroundColor: "#F3D9D9", alignItems: "center", justifyContent: "center", marginRight: 12, marginTop: 2 },
  alertTitleBox: { flex: 1 },
  alertTitle: { fontSize: 16, fontWeight: "700", color: colors.text, marginBottom: 4 },
  alertSubtitle: { fontSize: 13, color: colors.muted },
  
  infoRow: { flexDirection: "row", marginBottom: 16 },
  infoBox: { flex: 1 },
  infoLabel: { fontSize: 10, fontWeight: "700", color: colors.muted, marginBottom: 4, letterSpacing: 0.5 },
  infoValue: { fontSize: 14, fontWeight: "600", color: colors.text, lineHeight: 20 },
  
  requestsBox: { marginBottom: 20 },
  requestsText: { fontSize: 14, color: colors.text, lineHeight: 20 },
  
  ackButton: { backgroundColor: colors.text, borderRadius: 12, height: 48, alignItems: "center", justifyContent: "center" },
  ackButtonText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  
  rushCard: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 32, flexDirection: "row", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  rushHeader: { flexDirection: "row", alignItems: "center", flex: 1 },
  rushIconBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: colors.text, alignItems: "center", justifyContent: "center", marginRight: 12 },

  sectionTitle: { fontSize: 11, fontWeight: "700", color: colors.muted, letterSpacing: 1, marginBottom: 16 },
  
  timeline: { paddingLeft: 8 },
  timelineItem: { flexDirection: "row", marginBottom: 24, position: "relative" },
  timelineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border, marginTop: 6, zIndex: 2 },
  timelineLine: { position: "absolute", left: 3, top: 14, bottom: -24, width: 2, backgroundColor: colors.border, zIndex: 1 },
  timelineContent: { flex: 1, marginLeft: 16 },
  timelineHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  timelineTitle: { fontSize: 15, fontWeight: "700", color: colors.text },
  timelineTime: { fontSize: 12, color: colors.border },
  timelineDesc: { fontSize: 14, color: colors.muted },
});
