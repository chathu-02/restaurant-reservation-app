import { useEffect, useState } from "react";
import { Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button, Card, Chip, colors, Message, Screen } from "@/components/form-ui";
import {
  Settings,
  TableDoc,
  createReservation,
  formatTime,
  loadSettings,
  loadTables,
  prettyDate,
} from "@/lib/booking";

export default function Review() {
  const router = useRouter();
  const { date, minutes, party, tableIds } = useLocalSearchParams<{
    date: string;
    minutes: string;
    party: string;
    tableIds: string;
  }>();
  const [tables, setTables] = useState<TableDoc[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [profile, setProfile] = useState({ name: "", phone: "" });
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const n = Number(party);

  useEffect(() => {
    const ids = (tableIds ?? "").split(",").filter(Boolean);
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    Promise.all([loadTables(), loadSettings(), getDoc(doc(db, "users", uid))])
      .then(([all, s, u]) => {
        setTables(all.filter((t) => ids.includes(t.id)));
        setSettings(s);
        setProfile({ name: u.data()?.name ?? "", phone: u.data()?.phone ?? "" });
      })
      .catch(() => setError("Could not load your details. Check your connection."));
  }, [tableIds]);

  const depositRequired =
    !!settings && n >= settings.depositMinGuests && n <= settings.depositMaxGuests;

  const confirm = async () => {
    if (!settings) return;
    setBusy(true);
    setError("");
    try {
      const res = await createReservation({
        date,
        minutes: Number(minutes),
        party: n,
        tables,
        depositRequired,
        depositAmount: settings.depositAmount,
        userName: profile.name,
        phone: profile.phone,
      });
      router.replace({
        pathname: depositRequired ? "/pay-deposit" : "/booking-status",
        params: { id: res.id },
      } as never);
    } catch (e) {
      const code = (e as { code?: string }).code;
      setError(
        code === "app/slot-taken"
          ? "Sorry, one of those tables was just booked. Please go back and choose again."
          : "Could not save your booking. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <Text style={{ fontSize: 26, fontWeight: "700", color: colors.text }}>Review and confirm</Text>
      <Text style={{ fontSize: 14, color: colors.muted, marginBottom: 20 }}>Step 3 of 3</Text>
      <Card>
        <Text style={{ fontSize: 20, fontWeight: "700", color: colors.text }}>
          {prettyDate(date)}, {formatTime(Number(minutes))}
        </Text>
        <Text style={{ fontSize: 15, color: colors.text, marginTop: 6 }}>{n} guests</Text>
        <Text style={{ fontSize: 15, color: colors.text }}>
          Table: {tables.map((t) => t.name).join(", ") || "…"}
        </Text>
        <Text style={{ fontSize: 15, color: colors.muted, marginTop: 6 }}>
          {profile.name} · {profile.phone}
        </Text>
      </Card>
      <Card tint="#EEF1EF">
        <Text style={{ fontSize: 14, color: colors.text, lineHeight: 20 }}>
          {settings ? `We hold your table for ${settings.graceMinutes} minutes after your booking time.` : ""}
        </Text>
      </Card>
      {depositRequired && settings && (
        <Card tint="#FCEBCB">
          <Text style={{ color: "#6B3A00", fontSize: 14, lineHeight: 20, marginBottom: 10 }}>
            A deposit of Rs. {settings.depositAmount} is required for groups of {settings.depositMinGuests}–
            {settings.depositMaxGuests}. It is non-refundable and is deducted from your final bill after
            your visit. Your booking is confirmed once we verify the payment.
          </Text>
          <Chip
            title={agree ? "✓ I understand" : "Tap to confirm you understand"}
            selected={agree}
            onPress={() => setAgree(!agree)}
          />
        </Card>
      )}
      <Message text={error} />
      <Button
        title={busy ? "Please wait…" : depositRequired ? "Confirm and pay deposit" : "Confirm booking"}
        disabled={busy || tables.length === 0 || (depositRequired && !agree)}
        onPress={confirm}
      />
    </Screen>
  );
}