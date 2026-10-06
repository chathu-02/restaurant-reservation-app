import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, colors, Message, Screen } from "@/components/form-ui";
import {
  TableDoc,
  busyTableIds,
  formatTime,
  layoutRows,
  loadDayReservations,
  loadTables,
  prettyDate,
} from "@/lib/booking";

function Swatch({ color, border, label }: { color: string; border: string; label: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <View
        style={{ width: 16, height: 16, borderRadius: 4, backgroundColor: color, borderWidth: 1, borderColor: border }}
      />
      <Text style={{ fontSize: 13, color: colors.text }}>{label}</Text>
    </View>
  );
}

export default function SelectTable() {
  const router = useRouter();
  const { date, minutes, party } = useLocalSearchParams<{
    date: string;
    minutes: string;
    party: string;
  }>();
  const need = Number(party);
  const [all, setAll] = useState<TableDoc[]>([]);
  const [taken, setTaken] = useState<Set<string>>(new Set());
  const [picked, setPicked] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([loadTables(), loadDayReservations(date)])
      .then(([t, r]) => {
        setAll(t);
        setTaken(busyTableIds(r, Number(minutes)));
      })
      .catch(() => setError("Could not load tables. Check your connection."))
      .finally(() => setLoading(false));
  }, [date, minutes]);

  const seats = all.filter((t) => picked.includes(t.id)).reduce((s, t) => s + t.seats, 0);
  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const rows = layoutRows(all);

  return (
    <Screen>
      <Text style={{ fontSize: 26, fontWeight: "700", color: colors.text }}>Select a table</Text>
      <Text style={{ fontSize: 14, color: colors.muted, marginBottom: 16 }}>
        Step 2 of 3 · {prettyDate(date)}, {formatTime(Number(minutes))}, {need} guests
      </Text>

      <View
        style={{
          backgroundColor: "#fff",
          borderWidth: 1,
          borderColor: "#DDE4DF",
          borderRadius: 16,
          padding: 14,
          marginBottom: 12,
          gap: 8,
        }}
      >
        {loading ? (
          <Text style={{ color: colors.muted }}>Loading tables…</Text>
        ) : (
          rows.map((row, i) => (
            <View key={i} style={{ flexDirection: "row", justifyContent: "center", gap: 8 }}>
              {row.map((t) => {
                const isTaken = taken.has(t.id);
                const isPicked = picked.includes(t.id);
                return (
                  <Pressable
                    key={t.id}
                    disabled={isTaken}
                    onPress={() => toggle(t.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Table ${t.name}, ${t.seats} seats, ${
                      isTaken ? "taken" : isPicked ? "selected" : "available"
                    }`}
                    style={{
                      width: 68,
                      height: 68,
                      borderRadius: 12,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 2,
                      borderColor: isPicked ? colors.green : isTaken ? "#D5DBD8" : colors.green,
                      backgroundColor: isPicked ? colors.green : isTaken ? "#ECEFED" : "#fff",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: isPicked ? "#fff" : isTaken ? colors.muted : colors.text,
                      }}
                    >
                      {t.name}
                    </Text>
                    <Text style={{ fontSize: 12, color: isPicked ? "#fff" : colors.muted }}>
                      {isTaken ? "Taken" : `${t.seats} seats`}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ))
        )}
        {!loading && all.length === 0 && (
          <Text style={{ color: colors.text }}>No tables have been set up yet.</Text>
        )}
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 14 }}>
        <Swatch color="#fff" border={colors.green} label="Available" />
        <Swatch color="#ECEFED" border="#D5DBD8" label="Taken" />
        <Swatch color={colors.green} border={colors.green} label="Selected" />
      </View>

      <Text style={{ fontSize: 15, color: colors.text, marginBottom: 14 }}>
        Selected seats: {seats} of {need} needed
      </Text>
      <Message text={error} />
      <Button
        title="Continue"
        disabled={seats < need}
        onPress={() =>
          router.push({
            pathname: "/review",
            params: { date, minutes, party, tableIds: picked.join(",") },
          } as never)
        }
      />
    </Screen>
  );
}