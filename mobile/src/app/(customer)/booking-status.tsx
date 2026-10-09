import { Badge, Button, Card, colors, LinkText, Message, Screen } from "@/components/form-ui";
import { dateValue, prettyDate, ReservationDoc, statusLabel, statusTone } from "@/lib/booking";
import { db } from "@/lib/firebase";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Text } from "react-native";

export default function BookingStatus() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [res, setRes] = useState<ReservationDoc | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return undefined;
    return onSnapshot(
      doc(db, "reservations", id),
      (s) => setRes(s.exists() ? { id: s.id, ...(s.data() as Omit<ReservationDoc, "id">) } : null),
      () => setError("Could not load this booking.")
    );
  }, [id]);


  const needsPayment =
    res?.status === "pending" && ["waiting", "rejected"].includes(res.depositStatus);
  
  return (
    <Screen top>
      <Text style={{ fontSize: 26, fontWeight: "700", color: colors.text, marginBottom: 16 }}>
        Booking status
      </Text>
      <Message text={error} />
      {res && (
        <>
          <Badge text={statusLabel(res)} tone={statusTone(res)} />
          <Card>
            <Text style={{ fontSize: 13, color: colors.muted, marginTop: 10 }}>Booking ID</Text>
            <Text style={{ fontSize: 22, fontWeight: "700", color: colors.text }}>{res.bookingId}</Text>
            <Text style={{ fontSize: 16, color: colors.text, marginTop: 10 }}>
              {prettyDate(res.date)}, {res.time}
            </Text>
            <Text style={{ fontSize: 15, color: colors.text }}>{res.partySize} guests</Text>
            <Text style={{ fontSize: 15, color: colors.text }}>
              Table: {(res.tableNames ?? []).join(", ")}
            </Text>
          </Card>

          {needsPayment && (
            <Button
              title="Pay deposit"
              onPress={() => router.push({ pathname: "/pay-deposit", params: { id: res.id } } as never)}
            />
          )}

          {res.status === "confirmed" && res.date === dateValue(new Date()) && (
            <>
              <Text />
              {res.checkedIn ? (
                <Badge text="Checked in" tone="good" />
              ) : (
                <Button
                  title="Check in"
                  onPress={() => router.push({ pathname: "/check-in", params: { id: res.id } } as never)}
                />
              )}
            </>
          )}

          
        </>
      )}
      <LinkText title="Back to my bookings" onPress={() => router.navigate("/bookings" as never)} />
      <LinkText title="Back to home" onPress={() => router.navigate("/home" as never)} />
    </Screen>
  );
}