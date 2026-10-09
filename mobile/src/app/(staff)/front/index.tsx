import { Badge, Button, Card, colors, Screen } from "@/components/form-ui";
import { dateValue, prettyDate, ReservationDoc, statusLabel, statusTone } from "@/lib/booking";
import { auth, db } from "@/lib/firebase";
import { logout } from "@/lib/auth";
import { useRouter } from "expo-router";
import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View, Alert } from "react-native";

const ROLE_LABEL: Record<string, string> = { manager: "Manager", front: "Front staff" };

export default function StaffDashboard() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [items, setItems] = useState<ReservationDoc[]>([]);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      router.replace("/role-choice" as never);
      return;
    }
    getDoc(doc(db, "users", uid)).then((s) => {
      const r = s.data()?.role as string | undefined;
      if (r !== "manager" && r !== "front") {
        router.replace("/role-choice" as never);
        return;
      }
      setName(s.data()?.name ?? "");
      setRole(r);
    });
  }, [router]);

  const isFirstLoad = useRef(true);

  useEffect(() => {
    const today = dateValue(new Date());
    return onSnapshot(
      query(collection(db, "reservations"), where("date", "==", today)),
      (snap) => {
        setItems(
          snap.docs
            .map((d) => ({ id: d.id, ...(d.data() as Omit<ReservationDoc, "id">) }))
            .sort((a, b) => a.timeMinutes - b.timeMinutes)
        );

        if (isFirstLoad.current) {
          isFirstLoad.current = false;
        } else {
          snap.docChanges().forEach((change) => {
            if (change.type === "added") {
              const r = change.doc.data() as ReservationDoc;
              Alert.alert(
                "New Booking Received! 🛎️",
                `${r.userName} booked a table for ${r.partySize} guests at ${r.time}.`
              );
            }
          });
        }
      },
      (error) => console.error("Error fetching reservations:", error)
    );
  }, []);

  const activeItems = items.filter((item) => !["cancelled", "no_show", "served"].includes(item.status));
  const arrivedItems = items.filter((item) => item.checkedIn || item.status === "seated");

  return (
    <Screen top>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>FRONT OF HOUSE</Text>
          <Text style={styles.title}>Good evening{name ? `, ${name.split(" ")[0]}` : ""}</Text>
          <Text style={styles.subtitle}>Keep today’s arrivals moving smoothly.</Text>
        </View>
        <Pressable style={styles.profileButton} onPress={() => router.push("/(staff)/front/profile" as never)}>
          <Ionicons name="person-outline" size={20} color={colors.green} />
        </Pressable>
      </View>

      <View style={styles.roleRow}>
        {!!role && <Badge text={ROLE_LABEL[role] ?? role} tone="good" />}
        <View style={styles.livePill}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Live updates</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{activeItems.length}</Text>
          <Text style={styles.statLabel}>Active bookings</Text>
        </View>
        <View style={[styles.statCard, styles.statCardBlue]}>
          <Text style={[styles.statValue, { color: "#1D4ED8" }]}>{arrivedItems.length}</Text>
          <Text style={styles.statLabel}>Arrived guests</Text>
        </View>
        <View style={[styles.statCard, styles.statCardAmber]}>
          <Text style={[styles.statValue, { color: "#B45309" }]}>{items.filter((item) => item.status === "pending").length}</Text>
          <Text style={styles.statLabel}>Needs action</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick actions</Text>
      </View>
      <View style={styles.actionsRow}>
        <Pressable style={styles.actionCard} onPress={() => router.push("/(staff)/front/deposits" as never)}>
          <View style={[styles.actionIcon, { backgroundColor: "#D1FAE5" }]}>
            <Ionicons name="card-outline" size={21} color="#059669" />
          </View>
          <Text style={styles.actionTitle}>Deposit checks</Text>
          <Text style={styles.actionSubtitle}>Verify payments</Text>
        </Pressable>
        <Pressable style={styles.actionCard} onPress={() => router.push("/kitchen" as never)}>
          <View style={[styles.actionIcon, { backgroundColor: "#D5EDE3" }]}>
            <Ionicons name="restaurant-outline" size={21} color={colors.green} />
          </View>
          <Text style={styles.actionTitle}>Kitchen board</Text>
          <Text style={styles.actionSubtitle}>Live bookings</Text>
        </Pressable>
        <Pressable style={styles.actionCard} onPress={() => router.push("/queue" as never)}>
          <View style={[styles.actionIcon, { backgroundColor: "#FEF3C7" }]}>
            <Ionicons name="people-outline" size={21} color="#B45309" />
          </View>
          <Text style={styles.actionTitle}>Waitlist</Text>
          <Text style={styles.actionSubtitle}>Manage queue</Text>
        </Pressable>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Today’s reservations</Text>
        <Text style={styles.sectionCount}>{items.length}</Text>
      </View>
      {items.length === 0 ? (
        <Card tint="#F8FAF9">
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={30} color={colors.border} />
            <Text style={styles.emptyTitle}>No reservations yet</Text>
            <Text style={styles.emptySubtitle}>New customer bookings will appear here automatically.</Text>
          </View>
        </Card>
      ) : (
        items.map((r) => (
          <Card key={r.id} tint="#FFFFFF">
            <View style={styles.reservationHeader}>
              <View style={styles.timeBox}>
                <Text style={styles.timeText}>{r.time}</Text>
                <Text style={styles.bookingId}>{r.bookingId || "Booking"}</Text>
              </View>
              <Badge text={statusLabel(r)} tone={statusTone(r)} />
            </View>
            <Text style={styles.guestName}>{r.userName}</Text>
            <View style={styles.detailsRow}>
              <Ionicons name="people-outline" size={15} color={colors.muted} />
              <Text style={styles.detailsText}>{r.partySize} guests</Text>
              <Ionicons name="grid-outline" size={15} color={colors.muted} />
              <Text style={styles.detailsText}>{(r.tableNames ?? []).join(", ") || "Table pending"}</Text>
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.dateText}>{prettyDate(r.date)}</Text>
              {r.checkedIn && <Badge text="Arrived" tone="good" />}
            </View>
          </Card>
        ))
      )}

      <Button
        title="Log out"
        secondary
        onPress={async () => {
          await logout();
          router.replace("/role-choice" as never);
        }}
      />
    </Screen>
  );
}

const styles = {
  header: { flexDirection: "row" as const, justifyContent: "space-between" as const, alignItems: "flex-start" as const, marginBottom: 14 },
  headerCopy: { flex: 1 },
  eyebrow: { color: colors.green, fontSize: 11, fontWeight: "800" as const, letterSpacing: 1.2, marginBottom: 6 },
  title: { color: colors.text, fontSize: 27, fontWeight: "800" as const },
  subtitle: { color: colors.muted, fontSize: 14, marginTop: 5 },
  profileButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#D5EDE3", alignItems: "center" as const, justifyContent: "center" as const },
  roleRow: { flexDirection: "row" as const, alignItems: "center" as const, gap: 10, marginBottom: 18 },
  livePill: { flexDirection: "row" as const, alignItems: "center" as const, gap: 6, backgroundColor: "#F0FDF4", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 99 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#16A34A" },
  liveText: { color: "#166534", fontSize: 12, fontWeight: "700" as const },
  statsRow: { flexDirection: "row" as const, gap: 8, marginBottom: 22 },
  statCard: { flex: 1, backgroundColor: "#ECFDF5", borderRadius: 15, padding: 12, borderWidth: 1, borderColor: "#BBF7D0" },
  statCardBlue: { backgroundColor: "#EFF6FF", borderColor: "#BFDBFE" },
  statCardAmber: { backgroundColor: "#FFFBEB", borderColor: "#FDE68A" },
  statValue: { color: "#047857", fontSize: 24, fontWeight: "800" as const },
  statLabel: { color: colors.muted, fontSize: 11, marginTop: 3, lineHeight: 15 },
  sectionHeader: { flexDirection: "row" as const, justifyContent: "space-between" as const, alignItems: "center" as const, marginBottom: 10 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: "800" as const },
  sectionCount: { color: colors.green, fontSize: 14, fontWeight: "800" as const, backgroundColor: "#D5EDE3", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 99 },
  actionsRow: { flexDirection: "row" as const, gap: 10, marginBottom: 24 },
  actionCard: { flex: 1, backgroundColor: "#FFFFFF", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "#DDE4DF" },
  actionIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center" as const, justifyContent: "center" as const, marginBottom: 10 },
  actionTitle: { color: colors.text, fontSize: 13, fontWeight: "800" as const },
  actionSubtitle: { color: colors.muted, fontSize: 11, marginTop: 3 },
  reservationHeader: { flexDirection: "row" as const, justifyContent: "space-between" as const, alignItems: "flex-start" as const, marginBottom: 10 },
  timeBox: { flex: 1 },
  timeText: { color: colors.green, fontSize: 17, fontWeight: "800" as const },
  bookingId: { color: colors.muted, fontSize: 11, marginTop: 2 },
  guestName: { color: colors.text, fontSize: 16, fontWeight: "800" as const, marginBottom: 8 },
  detailsRow: { flexDirection: "row" as const, alignItems: "center" as const, gap: 5, flexWrap: "wrap" as const },
  detailsText: { color: colors.muted, fontSize: 13, marginRight: 7 },
  cardFooter: { flexDirection: "row" as const, justifyContent: "space-between" as const, alignItems: "center" as const, marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#EEF2F0" },
  dateText: { color: colors.muted, fontSize: 12 },
  emptyState: { alignItems: "center" as const, paddingVertical: 12 },
  emptyTitle: { color: colors.text, fontSize: 15, fontWeight: "700" as const, marginTop: 8 },
  emptySubtitle: { color: colors.muted, fontSize: 12, textAlign: "center" as const, marginTop: 4 },
};