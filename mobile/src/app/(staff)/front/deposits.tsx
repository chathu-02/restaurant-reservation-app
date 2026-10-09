import { Badge, Card, Chip, colors, LinkText, Message, Screen } from "@/components/form-ui";
import { prettyDate, ReservationDoc } from "@/lib/booking";
import { confirmDeposit, rejectDeposit, releaseBooking, whatsappNumber } from "@/lib/deposits";
import { db } from "@/lib/firebase";
import { useRouter } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, Linking, Text, View } from "react-native";

const DEPOSIT_TEXT: Record<string, { text: string; tone: "good" | "wait" | "bad" }> = {
  waiting: { text: "Waiting for the customer to pay", tone: "wait" },
  receipt_sent: { text: "Customer says the receipt was sent", tone: "wait" },
  rejected: { text: "Receipt rejected", tone: "bad" },
  received: { text: "Deposit received", tone: "good" },
};

export default function Deposits() {
  const router = useRouter();
  const [items, setItems] = useState<ReservationDoc[]>([]);
  const [tab, setTab] = useState<"pending" | "done">("pending");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    return onSnapshot(
      query(collection(db, "reservations"), where("depositRequired", "==", true)),
      (snap) =>
        setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ReservationDoc, "id">) }))),
      () => setError("Could not load bookings.")
    );
  }, []);

  const key = (r: ReservationDoc) => r.date + String(r.timeMinutes).padStart(4, "0");
  const pending = items
    .filter((r) => r.status === "pending")
    .sort((a, b) => key(a).localeCompare(key(b)));
  const done = items
    .filter((r) => r.depositStatus === "received")
    .sort((a, b) => key(b).localeCompare(key(a)));
  const list = tab === "pending" ? pending : done;

  const run = async (r: ReservationDoc, action: (r: ReservationDoc) => Promise<void>) => {
    setBusyId(r.id);
    setError("");
    try {
      await action(r);
    } catch {
      setError("Could not update this booking. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  const askConfirm = (r: ReservationDoc) =>
    Alert.alert(
      "Confirm deposit?",
      `Have you checked the WhatsApp receipt for ${r.bookingId}? Rs. ${r.depositAmount} from ${r.userName}.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes, confirm", onPress: () => run(r, confirmDeposit) },
      ]
    );

  const askReject = (r: ReservationDoc) =>
    Alert.alert("Reject this receipt?", "The customer will be asked to send a clear receipt again.", [
      { text: "Cancel", style: "cancel" },
      { text: "Reject", style: "destructive", onPress: () => run(r, rejectDeposit) },
    ]);

  const askRelease = (r: ReservationDoc) =>
    Alert.alert(
      "Release these tables?",
      "The booking will be marked expired and its tables become free for other guests.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Release", style: "destructive", onPress: () => run(r, releaseBooking) },
      ]
    );

  return (
    <Screen top>
      <Text style={{ fontSize: 26, fontWeight: "700", color: colors.text, marginBottom: 6 }}>
        Deposit checks
      </Text>
      <Text style={{ fontSize: 14, color: colors.muted, marginBottom: 14 }}>
        Check each receipt in WhatsApp, then confirm or reject it here.
      </Text>
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
        <Chip title={`To check (${pending.length})`} selected={tab === "pending"} onPress={() => setTab("pending")} />
        <Chip title={`Confirmed (${done.length})`} selected={tab === "done"} onPress={() => setTab("done")} />
      </View>
      <Message text={error} />
      {list.length === 0 ? (
        <Text style={{ color: colors.muted }}>
          {tab === "pending" ? "No deposits are waiting." : "No confirmed deposits yet."}
        </Text>
      ) : (
        list.map((r) => {
          const dep = DEPOSIT_TEXT[r.depositStatus] ?? { text: r.depositStatus, tone: "wait" as const };
          const busy = busyId === r.id;
          return (
            <Card key={r.id}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text }}>{r.bookingId}</Text>
                <Text style={{ fontSize: 16, fontWeight: "700", color: colors.green }}>
                  Rs. {r.depositAmount}
                </Text>
              </View>
              <Text style={{ fontSize: 15, color: colors.text, marginTop: 4 }}>
                {r.userName} · {r.phone}
              </Text>
              <Text style={{ fontSize: 14, color: colors.muted }}>
                {prettyDate(r.date)}, {r.time} · {r.partySize} guests · Table {(r.tableNames ?? []).join(", ")}
              </Text>
              <View style={{ marginTop: 8 }}>
                <Badge text={dep.text} tone={dep.tone} />
              </View>
              {tab === "pending" && (
                <>
                  <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
                    <View style={{ flex: 1 }}>
                      <Chip
                        title="WhatsApp"
                        onPress={() => Linking.openURL(`https://wa.me/${whatsappNumber(r.phone)}`)}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Chip title="Call" onPress={() => Linking.openURL(`tel:${r.phone}`)} />
                    </View>
                  </View>
                  <View style={{ marginTop: 8 }}>
                    <Chip
                      title={busy ? "Please wait…" : "Mark deposit received"}
                      selected
                      disabled={busy}
                      onPress={() => askConfirm(r)}
                    />
                  </View>
                  <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
                    <View style={{ flex: 1 }}>
                      <Chip title="Reject receipt" disabled={busy} onPress={() => askReject(r)} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Chip title="Release tables" disabled={busy} onPress={() => askRelease(r)} />
                    </View>
                  </View>
                </>
              )}
            </Card>
          );
        })
      )}
      <LinkText title="Back" onPress={() => router.back()} />
    </Screen>
  );
}