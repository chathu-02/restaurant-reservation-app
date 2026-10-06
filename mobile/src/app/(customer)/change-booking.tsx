import { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button, Chip, colors, Message, Screen } from "@/components/form-ui";
import {
  ReservationDoc,
  busyTableIds,
  changeReservationTime,
  loadDayReservations,
  nextDays,
  prettyDate,
  timeSlots,
} from "@/lib/booking";

export default function ChangeBooking() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const days = useMemo(() => nextDays(7), []);
  const slots = useMemo(() => timeSlots(), []);
  const [res, setRes] = useState<ReservationDoc | null>(null);
  const [date, setDate] = useState(days[0].value);
  const [time, setTime] = useState<number | null>(null);
  const [others, setOthers] = useState<ReservationDoc[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getDoc(doc(db, "reservations", id))
      .then((s) => s.exists() && setRes({ id: s.id, ...(s.data() as Omit<ReservationDoc, "id">) }))
      .catch(() => setError("Could not load your booking."));
  }, [id]);

  useEffect(() => {
    setTime(null);
    setLoaded(false);
    loadDayReservations(date)
      .then(setOthers)
      .catch(() => setError("Could not load availability. Check your connection."))
      .finally(() => setLoaded(true));
  }, [date]);

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const isPast = (m: number) => date === days[0].value && m < nowMinutes + 30;
  const unavailable = (m: number) => {
    if (!res) return true;
    const busyIds = busyTableIds(
      others.filter((o) => o.id !== res.id),
      m
    );
    return (res.tableIds ?? []).some((tid) => busyIds.has(tid));
  };

  const save = async () => {
    if (!res || time === null) return;
    setBusy(true);
    setError("");
    try {
      await changeReservationTime(res, date, time);
      router.back();
    } catch (e) {
      const code = (e as { code?: string }).code;
      setError(
        code === "app/slot-taken"
          ? "Your tables are not free at that time. Please choose another time."
          : "Could not change your booking. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen top>
      <Text style={{ fontSize: 26, fontWeight: "700", color: colors.text }}>Change date or time</Text>
      <Text style={{ fontSize: 14, color: colors.muted, marginBottom: 6 }}>
        {res ? `${res.bookingId} · now ${prettyDate(res.date)}, ${res.time}` : "Loading…"}
      </Text>
      <Text style={{ fontSize: 14, color: colors.muted, marginBottom: 20 }}>
        Your tables ({(res?.tableNames ?? []).join(", ")}) and party size stay the same. To change the
        number of guests, cancel and make a new booking.
      </Text>

      <Text style={{ fontSize: 14, fontWeight: "700", marginBottom: 8 }}>New date</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginBottom: 20 }}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {days.map((d) => (
            <Chip key={d.value} title={d.label} selected={d.value === date} onPress={() => setDate(d.value)} />
          ))}
        </View>
      </ScrollView>

      <Text style={{ fontSize: 14, fontWeight: "700", marginBottom: 8 }}>New time</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {slots
          .filter((s) => !isPast(s.minutes))
          .map((s) => {
            const off = loaded && unavailable(s.minutes);
            return (
              <Chip
                key={s.minutes}
                title={off ? `${s.label} · Busy` : s.label}
                selected={time === s.minutes}
                disabled={off || !loaded || !res}
                onPress={() => setTime(s.minutes)}
              />
            );
          })}
      </View>

      <Message text={error} />
      <Button
        title={busy ? "Saving…" : "Save change"}
        disabled={busy || time === null}
        onPress={save}
      />
    </Screen>
  );
}