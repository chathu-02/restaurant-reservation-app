import { Badge, Button, Card, colors, Screen } from "@/components/form-ui";
import { logout } from "@/lib/auth";
import { dateValue, prettyDate, ReservationDoc, statusLabel, statusTone } from "@/lib/booking";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "expo-router";
import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { Text, View, Alert } from "react-native";

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

  return (
    <Screen top>
      <Text style={{ fontSize: 26, fontWeight: "700", color: colors.text }}>Staff dashboard</Text>
      <Text style={{ fontSize: 15, color: colors.muted, marginBottom: 8 }}>
        {name ? `Signed in as ${name}` : "Loading…"}
      </Text>
      {!!role && <Badge text={ROLE_LABEL[role] ?? role} tone="good" />}
      <Text style={{ fontSize: 17, fontWeight: "700", color: colors.text, marginTop: 18, marginBottom: 10 }}>
        Today's reservations ({items.length})
      </Text>
      {items.length === 0 ? (
        <Text style={{ color: colors.muted, marginBottom: 14 }}>No reservations for today.</Text>
      ) : (
        items.map((r) => (
          <Card key={r.id}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text }}>{r.time}</Text>
              <Text style={{ fontSize: 14, color: colors.muted }}>{r.bookingId}</Text>
            </View>
            <Text style={{ fontSize: 14, color: colors.text, marginTop: 2 }}>
              {r.userName} · {r.partySize} guests · Table {(r.tableNames ?? []).join(", ")}
            </Text>
            <Text style={{ fontSize: 13, color: colors.muted }}>{prettyDate(r.date)}</Text>
            <View style={{ marginTop: 6, flexDirection: "row", gap: 8 }}>
              <Badge text={statusLabel(r)} tone={statusTone(r)} />
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