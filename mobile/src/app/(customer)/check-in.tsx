import { useEffect, useState } from "react";
import { Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Badge, Button, Card, colors, LinkText, Message, Screen } from "@/components/form-ui";
import { ReservationDoc, checkInInfo, prettyDate } from "@/lib/booking";

export default function CheckIn() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [res, setRes] = useState<ReservationDoc | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return undefined;
    return onSnapshot(
      doc(db, "reservations", id),
      (s) => setRes(s.exists() ? { id: s.id, ...(s.data() as Omit<ReservationDoc, "id">) } : null),
      () => setError("Could not load this booking.")
    );
  }, [id]);

  const info = res ? checkInInfo(res) : null;

  const arrive = async () => {
    setBusy(true);
    setError("");
    try {
      await updateDoc(doc(db, "reservations", id), { checkedIn: true, checkedInAt: serverTimestamp() });
    } catch {
      setError("Could not check you in. Please tell our host.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen top>
      <Text style={{ fontSize: 26, fontWeight: "700", color: colors.text, marginBottom: 6 }}>Check in</Text>
      <Text style={{ fontSize: 15, color: colors.muted, marginBottom: 20 }}>
        Show this booking ID to our host at the entrance.
      </Text>
      {res && info && (
        <>
          <Card>
            <Text style={{ fontSize: 13, color: colors.muted }}>Booking ID</Text>
            <Text style={{ fontSize: 40, fontWeight: "700", color: colors.text, letterSpacing: 2 }}>
              {res.bookingId}
            </Text>
            <Text style={{ fontSize: 16, color: colors.text, marginTop: 10 }}>{res.userName}</Text>
            <Text style={{ fontSize: 15, color: colors.text }}>
              {prettyDate(res.date)}, {res.time} · {res.partySize} guests
            </Text>
            <Text style={{ fontSize: 15, color: colors.text }}>Table: {(res.tableNames ?? []).join(", ")}</Text>
          </Card>
          {res.checkedIn && <Badge text="Checked in" tone="good" />}
          <Text style={{ fontSize: 15, color: colors.text, lineHeight: 22, marginVertical: 14 }}>
            {info.note}
          </Text>
          <Message text={error} />
          {!res.checkedIn && (
            <Button
              title={busy ? "Please wait…" : "I have arrived"}
              disabled={!info.canCheckIn || busy}
              onPress={arrive}
            />
          )}
        </>
      )}
      <LinkText title="Back to booking" onPress={() => router.back()} />
    </Screen>
  );
}