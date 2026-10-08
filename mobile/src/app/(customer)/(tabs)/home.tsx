import { ComponentProps, useCallback, useState } from "react";
import { ImageBackground, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { ReservationDoc, dateValue, prettyDate, statusLabel } from "@/lib/booking";
import { BRAND, HERO_IMAGE, RESTAURANT_PHOTO } from "@/lib/brand";
import { Logo } from "@/components/logo";
import { Button, Card, colors, LinkText } from "@/components/form-ui";

type IconName = ComponentProps<typeof Ionicons>["name"];

function InfoRow({ icon, text, onPress }: { icon: IconName; text: string; onPress?: () => void }) {
  const row = (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8 }}>
      <Ionicons name={icon} size={20} color={colors.green} />
      <Text style={{ fontSize: 15, color: colors.text, flex: 1 }}>{text}</Text>
    </View>
  );
  return onPress ? (
    <Pressable accessibilityRole="link" onPress={onPress} style={{ minHeight: 44, justifyContent: "center" }}>
      {row}
    </Pressable>
  ) : (
    row
  );
}

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [next, setNext] = useState<ReservationDoc | null>(null);
  const [waitMin, setWaitMin] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      getDoc(doc(db, "users", uid)).then((s) => setName(s.data()?.name ?? ""));
      getDocs(query(collection(db, "reservations"), where("userId", "==", uid))).then((snap) => {
        const today = dateValue(new Date());
        const key = (r: ReservationDoc) => r.date + String(r.timeMinutes).padStart(4, "0");
        const list = snap.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<ReservationDoc, "id">) }))
          .filter((r) => ["pending", "confirmed"].includes(r.status) && r.date >= today)
          .sort((a, b) => key(a).localeCompare(key(b)));
        setNext(list[0] ?? null);
      });
      // rough estimate: 5 minutes per group waiting in the queue
      getDocs(query(collection(db, "queue"), where("status", "==", "waiting")))
        .then((s) => setWaitMin(s.size * 5))
        .catch(() => setWaitMin(null));
    }, [])
  );

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const hero = (
    <View
      style={{
        flex: 1,
        padding: 20,
        paddingTop: 52,
        justifyContent: "space-between",
        backgroundColor: HERO_IMAGE ? "rgba(0,0,0,0.35)" : colors.green,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Logo size={36} badge />
        <View>
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>{BRAND.name}</Text>
          <Text style={{ color: "#D5EDE3", fontSize: 11, letterSpacing: 1.5 }}>
            {BRAND.tagline.toUpperCase()}
          </Text>
        </View>
      </View>
      <View style={{ paddingBottom: 30 }}>
        <Text style={{ color: "#D5EDE3", fontSize: 15 }}>{greeting}</Text>
        <Text style={{ color: "#fff", fontSize: 28, fontWeight: "700" }}>{name || "Welcome"}</Text>
      </View>
    </View>
  );

    return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: 24 }}>
      {HERO_IMAGE ? (
        <ImageBackground source={HERO_IMAGE} style={{ height: 240 }}>
          {hero}
        </ImageBackground>
      ) : (
        <View style={{ height: 240 }}>{hero}</View>
      )}
      <View style={{ paddingHorizontal: 20, marginTop: -24 }}>
        {RESTAURANT_PHOTO && (
          <View style={{ borderRadius: 16, overflow: "hidden", height: 190, marginBottom: 14 }}>
            <ImageBackground source={RESTAURANT_PHOTO} style={{ flex: 1, justifyContent: "flex-end" }}>
              <View style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: 12 }}>
                <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>{BRAND.name}</Text>
                <Text style={{ color: "#fff", fontSize: 13 }}>{BRAND.tagline}</Text>
              </View>
            </ImageBackground>
          </View>
        )}

        <Card>
          <InfoRow icon="time-outline" text={BRAND.hours} />
          <InfoRow icon="location-outline" text={BRAND.address} />
          <InfoRow
            icon="call-outline"
            text={BRAND.phone}
            onPress={() => Linking.openURL(`tel:${BRAND.phone.replace(/\s/g, "")}`)}
          />
          <InfoRow
            icon="hourglass-outline"
            text={
              waitMin === null
                ? "Walk-in wait: unavailable"
                : waitMin === 0
                  ? "No wait for walk-ins right now"
                  : `Walk-in wait: about ${waitMin} min`
            }
          />
        </Card>

        <Card>
          <Text style={{ fontSize: 13, color: colors.muted }}>Your next reservation</Text>
          {next ? (
            <>
              <Text style={{ fontSize: 20, fontWeight: "700", color: colors.text, marginTop: 4 }}>
                {prettyDate(next.date)}, {next.time}
              </Text>
              <Text style={{ fontSize: 15, color: colors.text, marginTop: 2 }}>
                {next.partySize} guests · {statusLabel(next)}
              </Text>
              <LinkText
                title="View details"
                onPress={() => router.push({ pathname: "/booking-status", params: { id: next.id } } as never)}
              />
              <LinkText title="See all bookings" onPress={() => router.navigate("/bookings" as never)} />
            </>
          ) : (
            <Text style={{ fontSize: 15, color: colors.text, marginTop: 4 }}>
              You have no upcoming reservations.
            </Text>
          )}
        </Card>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Button title="Reserve a table" onPress={() => router.push("/reserve" as never)} />
          </View>
          <View style={{ flex: 1 }}>
            <Button title="Join the queue" secondary onPress={() => router.push("/join-queue" as never)} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}