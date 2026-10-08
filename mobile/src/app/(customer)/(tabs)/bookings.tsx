import { Badge, Chip, colors, Message, Screen } from "@/components/form-ui";
import {
  cancelReservation,
  dateValue,
  prettyDate,
  ReservationDoc,
  statusLabel,
  statusTone,
} from "@/lib/booking";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";

export default function Bookings() {
  const router = useRouter();
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [items, setItems] = useState<ReservationDoc[]>([]);
  const [ratedIds, setRatedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      setLoading(false);
      return undefined;
    }
    const stopBookings = onSnapshot(
      query(collection(db, "reservations"), where("userId", "==", uid)),
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ReservationDoc, "id">) })));
        setLoading(false);
      },
      () => {
        setError("Could not load your bookings.");
        setLoading(false);
      }
    );
    // feedback documents use the booking's id as their id
    const stopFeedback = onSnapshot(
      query(collection(db, "feedback"), where("userId", "==", uid)),
      (snap) => setRatedIds(new Set(snap.docs.map((d) => d.id))),
      () => {}
    );
    return () => {
      stopBookings();
      stopFeedback();
    };
  }, []);

  const askCancel = (r: ReservationDoc) => {
    const paid = r.depositRequired && ["receipt_sent", "received"].includes(r.depositStatus);
    Alert.alert(
      "Cancel this booking?",
      paid
        ? `Your deposit of Rs. ${r.depositAmount} is non-refundable.`
        : "This will free your table for other guests.",
      [
        { text: "Keep booking", style: "cancel" },
        {
          text: "Cancel booking",
          style: "destructive",
          onPress: async () => {
            try {
              await cancelReservation(r);
            } catch {
              setError("Could not cancel your booking. Please try again.");
            }
          },
        },
      ]
    );
  };

  const today = dateValue(new Date());
  const key = (r: ReservationDoc) => r.date + String(r.timeMinutes).padStart(4, "0");
  const isUpcoming = (r: ReservationDoc) =>
    ["pending", "confirmed", "seated", "preparing", "ready"].includes(r.status) &&
    r.date >= today &&
    !r.checkedIn;
  const visited = (r: ReservationDoc) =>
    !!r.checkedIn || ["seated", "completed"].includes(r.status);
  const upcoming = items.filter(isUpcoming).sort((a, b) => key(a).localeCompare(key(b)));
  const past = items.filter((r) => !isUpcoming(r)).sort((a, b) => key(b).localeCompare(key(a)));
  const list = tab === "upcoming" ? upcoming : past;

  return (
    <Screen top>
      <Text style={{ fontSize: 26, fontWeight: "700", color: colors.text, marginBottom: 14 }}>
        My bookings
      </Text>
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
        <Chip title={`Upcoming (${upcoming.length})`} selected={tab === "upcoming"} onPress={() => setTab("upcoming")} />
        <Chip title={`Past (${past.length})`} selected={tab === "past"} onPress={() => setTab("past")} />
      </View>
      <Message text={error} />
      {loading ? (
        <Text style={{ color: colors.muted }}>Loading…</Text>
      ) : list.length === 0 ? (
        <Text style={{ color: colors.muted, fontSize: 15 }}>
          {tab === "upcoming" ? "You have no upcoming bookings." : "No past bookings yet."}
        </Text>
      ) : (
        list.map((r) => (
          <Pressable
            key={r.id}
            accessibilityRole="button"
            onPress={() => router.push({ pathname: "/booking-status", params: { id: r.id } } as never)}
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#DDE4DF",
              padding: 16,
              marginBottom: 12,
              gap: 4,
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: "700", color: colors.text }}>
              {prettyDate(r.date)}, {r.time}
            </Text>
            <Text style={{ fontSize: 14, color: colors.muted }}>
              {r.partySize} guests · Table {(r.tableNames ?? []).join(", ")} · {r.bookingId}
            </Text>
            <View style={{ marginTop: 6 }}>
              <Badge
                text={r.checkedIn ? "Checked in" : statusLabel(r)}
                tone={r.checkedIn ? "good" : statusTone(r)}
              />
            </View>
            {tab === "upcoming" && (
              <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
                <View style={{ flex: 1 }}>
                  <Chip
                    title="Change"
                    onPress={() =>
                      router.push({ pathname: "/change-booking", params: { id: r.id } } as never)
                    }
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Chip title="Cancel" onPress={() => askCancel(r)} />
                </View>
              </View>
            )}
            {tab === "past" && visited(r) && (
              <View style={{ marginTop: 10 }}>
                {ratedIds.has(r.id) ? (
                  <Badge text="Feedback sent. Thank you!" tone="good" />
                ) : (
                  <Chip
                    title="Rate your visit"
                    onPress={() =>
                      router.push({ pathname: "/feedback", params: { id: r.id } } as never)
                    }
                  />
                )}
              </View>
            )}
          </Pressable>
        ))
      )}
    </Screen>
  );
}