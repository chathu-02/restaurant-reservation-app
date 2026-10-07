import { useEffect, useState } from "react";
import { Linking, Text, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button, Card, colors, LinkText, Message, Screen } from "@/components/form-ui";
import { BANK, ReservationDoc, WHATSAPP_NUMBER } from "@/lib/booking";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 }}>
      <Text style={{ color: colors.muted, fontSize: 15 }}>{label}</Text>
      <Text style={{ color: colors.text, fontSize: 15, fontWeight: "700" }}>{value}</Text>
    </View>
  );
}

export default function PayDeposit() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [res, setRes] = useState<ReservationDoc | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getDoc(doc(db, "reservations", id))
      .then((s) => s.exists() && setRes({ id: s.id, ...(s.data() as Omit<ReservationDoc, "id">) }))
      .catch(() => setError("Could not load your booking."));
  }, [id]);

  const openWhatsApp = () => {
    if (!res) return;
    const text = `Hello, I have paid the deposit for booking ${res.bookingId}. Name: ${res.userName}. My receipt is attached.`;
    Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`);
  };

  const receiptSent = async () => {
    try {
      await updateDoc(doc(db, "reservations", id), { depositStatus: "receipt_sent" });
      router.replace({ pathname: "/booking-status", params: { id } } as never);
    } catch {
      setError("Could not update your booking. Please try again.");
    }
  };

  return (
    <Screen>
      <Text style={{ fontSize: 26, fontWeight: "700", color: colors.text }}>Pay your deposit</Text>
      <Text style={{ fontSize: 14, color: colors.muted, marginBottom: 20 }}>
        {res ? `Booking ${res.bookingId} · ${res.partySize} guests` : "Loading…"}
      </Text>
      <Card tint={colors.green}>
        <Text style={{ fontSize: 34, fontWeight: "700", color: "#fff" }}>
          Rs. {res?.depositAmount ?? "…"}
        </Text>
        <Text style={{ fontSize: 14, color: "#fff", marginTop: 4, lineHeight: 20 }}>
          Non-refundable. Deducted from your final bill after your visit.
        </Text>
      </Card>
      <Text style={{ fontSize: 15, color: colors.text, lineHeight: 24, marginBottom: 14 }}>
        1. Transfer the amount to the account below.{"\n"}
        2. Use your booking ID as the payment reference.{"\n"}
        3. Send the receipt to us on WhatsApp.{"\n"}
        We confirm your booking once we check the receipt.
      </Text>
      <Card>
        <Row label="Bank" value={BANK.bank} />
        <Row label="Account name" value={BANK.accountName} />
        <Row label="Account no." value={BANK.accountNumber} />
        <Row label="Reference" value={res?.bookingId ?? "…"} />
        <LinkText
          title={copied ? "Account number copied ✓" : "Copy account number"}
          onPress={async () => {
            await Clipboard.setStringAsync(BANK.accountNumber);
            setCopied(true);
          }}
        />
      </Card>
      <Message text={error} />
      <Button title="Send receipt on WhatsApp" onPress={openWhatsApp} disabled={!res} />
      <Text />
      <Button title="I have sent the receipt" secondary onPress={receiptSent} disabled={!res} />
      <LinkText
        title="I will pay later"
        onPress={() => router.replace({ pathname: "/booking-status", params: { id } } as never)}
      />
    </Screen>
  );
}