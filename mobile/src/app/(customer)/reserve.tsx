import { useEffect, useMemo, useState } from "react";
import { Linking, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Button, Card, Chip, colors, Message, Screen } from "@/components/form-ui";
import {
  MAX_ONLINE_PARTY,
  RESTAURANT_PHONE,
  ReservationDoc,
  Settings,
  TableDoc,
  loadDayReservations,
  loadSettings,
  loadTables,
  nextDays,
  slotIsFull,
  timeSlots,
} from "@/lib/booking";

export default function Reserve() {
  const router = useRouter();
  const days = useMemo(() => nextDays(7), []);
  const slots = useMemo(() => timeSlots(), []);
  const [date, setDate] = useState(days[0].value);
  const [time, setTime] = useState<number | null>(null);
  const [party, setParty] = useState(2);
  const [tables, setTables] = useState<TableDoc[]>([]);
  const [reservations, setReservations] = useState<ReservationDoc[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([loadTables(), loadSettings()])
      .then(([t, s]) => {
        setTables(t);
        setSettings(s);
      })
      .catch(() => setError("Could not load restaurant data. Check your connection."));
  }, []);

  useEffect(() => {
    setTime(null);
    setLoaded(false);
    loadDayReservations(date)
      .then(setReservations)
      .catch(() => setError("Could not load availability. Check your connection."))
      .finally(() => setLoaded(true));
  }, [date]);

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const isPast = (m: number) => date === days[0].value && m < nowMinutes + 30;
  const isFull = (m: number) => slotIsFull(tables, reservations, m, party);
  const tooBig = party > MAX_ONLINE_PARTY;
  const depositNeeded =
    settings && party >= settings.depositMinGuests && party <= settings.depositMaxGuests;
  const canContinue = !tooBig && time !== null && loaded;

  return (
    <Screen>
      <Text style={{ fontSize: 26, fontWeight: "700", color: colors.text }}>Reserve a table</Text>
      <Text style={{ fontSize: 14, color: colors.muted, marginBottom: 20 }}>
        Step 1 of 3 · Date, time and party size
      </Text>

      <Text style={{ fontSize: 14, fontWeight: "700", marginBottom: 8 }}>Date</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginBottom: 20 }}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {days.map((d) => (
            <Chip key={d.value} title={d.label} selected={d.value === date} onPress={() => setDate(d.value)} />
          ))}
        </View>
      </ScrollView>

      <Text style={{ fontSize: 14, fontWeight: "700", marginBottom: 8 }}>Party size</Text>
      <Card>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Chip title="−" onPress={() => setParty((p) => Math.max(1, p - 1))} />
          <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text }}>{party} guests</Text>
          <Chip title="+" onPress={() => setParty((p) => Math.min(30, p + 1))} />
        </View>
      </Card>

      {tooBig ? (
        <Card tint="#FCEBCB">
          <Text style={{ color: "#6B3A00", fontSize: 14, lineHeight: 20, marginBottom: 8 }}>
            For groups of more than {MAX_ONLINE_PARTY}, please call the restaurant to confirm before booking.
          </Text>
          <Button title="Call the restaurant" onPress={() => Linking.openURL(`tel:${RESTAURANT_PHONE}`)} />
        </Card>
      ) : depositNeeded && settings ? (
        <Card tint="#FCEBCB">
          <Text style={{ color: "#6B3A00", fontSize: 14, lineHeight: 20 }}>
            Groups of {settings.depositMinGuests}–{settings.depositMaxGuests} need a non-refundable deposit of
            Rs. {settings.depositAmount}. It is deducted from your final bill.
          </Text>
        </Card>
      ) : null}

      {!tooBig && (
        <>
          <Text style={{ fontSize: 14, fontWeight: "700", marginBottom: 8 }}>Time</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
            {slots.map((s) => {
              const off = isPast(s.minutes) || (loaded && isFull(s.minutes));
              return (
                <Chip
                  key={s.minutes}
                  title={off && !isPast(s.minutes) ? `${s.label} · Full` : s.label}
                  selected={time === s.minutes}
                  disabled={off || !loaded}
                  onPress={() => setTime(s.minutes)}
                />
              );
            })}
          </View>
        </>
      )}

      <Message text={error} />
      <Button
        title="Continue"
        disabled={!canContinue}
        onPress={() =>
          router.push({
            pathname: "/select-table",
            params: { date, minutes: String(time), party: String(party) },
          } as never)
        }
      />
    </Screen>
  );
}