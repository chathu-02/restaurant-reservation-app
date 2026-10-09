import { useEffect, useState } from "react";
import { Alert, Linking, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";

import { db } from "@/lib/firebase";
import {
  Badge,
  Button,
  Card,
  colors,
  LinkText,
  Message,
  Screen,
} from "@/components/form-ui";
import {
  ReservationDoc,
  WHATSAPP_NUMBER,
  cancelReservation,
  dateValue,
  prettyDate,
  statusLabel,
  statusTone,
} from "@/lib/booking";

export default function BookingStatus() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [res, setRes] = useState<ReservationDoc | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return undefined;

    return onSnapshot(
      doc(db, "reservations", id),
      (snapshot) => {
        setError("");
        setRes(
          snapshot.exists()
            ? {
              id: snapshot.id,
              ...(snapshot.data() as Omit<ReservationDoc, "id">),
            }
            : null
        );
      },
      () => setError("Could not load this booking.")
    );
  }, [id]);

  const needsPayment =
    res?.status === "pending" &&
    ["waiting", "rejected"].includes(res.depositStatus);

  // Allow changes or cancellation for bookings awaiting seating.
  const active =
    !!res &&
    ["pending", "confirmed"].includes(res.status) &&
    !res.checkedIn;

  const askCancel = () => {
    if (!res) return;

    const paid =
      res.depositRequired &&
      ["receipt_sent", "received"].includes(res.depositStatus);

    Alert.alert(
      "Cancel this booking?",
      paid
        ? `Your deposit of Rs. ${res.depositAmount} is non-refundable.`
        : "This will free your table for other guests.",
      [
        { text: "Keep booking", style: "cancel" },
        {
          text: "Cancel booking",
          style: "destructive",
          onPress: async () => {
            try {
              await cancelReservation(res);
            } catch {
              setError("Could not cancel your booking. Please try again.");
            }
          },
        },
      ]
    );
  };

  const openWhatsAppHost = () => {
    const cleanPhone = (WHATSAPP_NUMBER || "+94774483581").replace(
      /[^0-9]/g,
      ""
    );
    const bookingReference = res?.bookingId ? `#${res.bookingId}` : "";
    const msg = encodeURIComponent(
      `Hello! I have a question regarding my booking ${bookingReference}.`
    );

    Linking.openURL(`https://wa.me/${cleanPhone}?text=${msg}`).catch(() => {
      Alert.alert("WhatsApp Error", "Could not launch WhatsApp.");
    });
  };

  return (
    <Screen top>
      <Text
        style={{
          fontSize: 26,
          fontWeight: "700",
          color: colors.text,
          marginBottom: 16,
        }}
      >
        Booking status
      </Text>

      <Message text={error} />

      {res && (
        <>
          <Badge text={statusLabel(res)} tone={statusTone(res)} />

          {["confirmed", "seated", "preparing", "ready", "served"].includes(res.status) && (
            <Card tint="#F0FDF4">
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#14532D", marginBottom: 10 }}>
                Reservation progress
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                {[
                  ["confirmed", "Confirmed"],
                  ["seated", "Seated"],
                  ["preparing", "Preparing"],
                  ["ready", "Ready"],
                  ["served", "Served"],
                ].map(([value, label], index, steps) => {
                  const current = steps.findIndex(([step]) => step === res.status);
                  const complete = index <= current;
                  return (
                    <View key={value} style={{ alignItems: "center", flex: 1 }}>
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          backgroundColor: complete ? "#16A34A" : "#D1D5DB",
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                        {complete && <Text style={{ color: "#FFFFFF", fontSize: 12 }}>✓</Text>}
                      </View>
                      <Text style={{ color: complete ? "#166534" : colors.muted, fontSize: 9, marginTop: 4 }}>
                        {label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </Card>
          )}

          <Card>
            <Text
              style={{ fontSize: 13, color: colors.muted, marginTop: 10 }}
            >
              Booking ID
            </Text>
            <Text
              style={{ fontSize: 22, fontWeight: "700", color: colors.text }}
            >
              {res.bookingId}
            </Text>
            <Text
              style={{ fontSize: 16, color: colors.text, marginTop: 10 }}
            >
              {prettyDate(res.date)}, {res.time}
            </Text>
            <Text style={{ fontSize: 15, color: colors.text }}>
              {res.partySize} guests
            </Text>
            <Text style={{ fontSize: 15, color: colors.text }}>
              Table: {(res.tableNames ?? []).join(", ")}
            </Text>
          </Card>

          {needsPayment && (
            <Button
              title="Pay deposit"
              onPress={() =>
                router.push({
                  pathname: "/pay-deposit",
                  params: { id: res.id },
                } as never)
              }
            />
          )}

          {res.status === "confirmed" &&
            res.date === dateValue(new Date()) && (
              <>
                <Text />
                {res.checkedIn ? (
                  <Badge text="Checked in" tone="good" />
                ) : (
                  <Button
                    title="Check in"
                    onPress={() =>
                      router.push({
                        pathname: "/check-in",
                        params: { id: res.id },
                      } as never)
                    }
                  />
                )}
              </>
            )}

          {(res.checkedIn ||
            ["seated", "completed"].includes(res.status)) && (
              <LinkText
                title="Rate your visit"
                onPress={() =>
                  router.push({
                    pathname: "/feedback",
                    params: { id: res.id },
                  } as never)
                }
              />
            )}

          {active && (
            <>
              <Text />
              <Button
                title="Change date or time"
                secondary
                onPress={() =>
                  router.push({
                    pathname: "/change-booking",
                    params: { id: res.id },
                  } as never)
                }
              />
              <LinkText title="Cancel booking" onPress={askCancel} />
            </>
          )}

          <View style={{ marginTop: 12 }}>
            <Button
              title="💬 Chat with Host on WhatsApp"
              secondary
              onPress={openWhatsAppHost}
            />
          </View>
        </>
      )}

      <LinkText
        title="Back to my bookings"
        onPress={() => router.navigate("/bookings" as never)}
      />
      <LinkText
        title="Back to home"
        onPress={() => router.navigate("/home" as never)}
      />
    </Screen>
  );
}