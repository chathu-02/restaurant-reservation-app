import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { seedMenu } from "@/lib/seed";
import { Button, Card, Chip, colors, Message, Screen } from "@/components/form-ui";

type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  available?: boolean;
};

const CATEGORIES = ["Starters", "Mains", "Drinks", "Desserts"];
const money = (n: number) => `Rs. ${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

export default function Menu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [cat, setCat] = useState("Starters");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    getDocs(collection(db, "menu"))
      .then((snap) =>
        setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<MenuItem, "id">) })))
      )
      .catch(() => setError("Could not load the menu. Check your connection."))
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(load);

  const shown = items
    .filter((i) => i.category === cat && i.available !== false)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Screen top>
      <Text style={{ fontSize: 26, fontWeight: "700", color: colors.text, marginBottom: 14 }}>Menu</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginBottom: 16 }}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {CATEGORIES.map((c) => (
            <Chip key={c} title={c} selected={c === cat} onPress={() => setCat(c)} />
          ))}
        </View>
      </ScrollView>
      <Message text={error} />
      {loading ? (
        <Text style={{ color: colors.muted }}>Loading…</Text>
      ) : items.length === 0 && !error ? (
        <View>
          <Text style={{ color: colors.text, marginBottom: 12 }}>The menu has not been added yet.</Text>
          <Button
            title="Add sample menu (temporary)"
            onPress={async () => {
              await seedMenu();
              load();
            }}
          />
        </View>
      ) : shown.length === 0 ? (
        <Text style={{ color: colors.muted }}>Nothing in this section right now.</Text>
      ) : (
        shown.map((i) => (
          <Card key={i.id}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
              <Text style={{ fontSize: 17, fontWeight: "700", color: colors.text, flex: 1 }}>{i.name}</Text>
              <Text style={{ fontSize: 16, fontWeight: "700", color: colors.green }}>{money(i.price)}</Text>
            </View>
            {!!i.description && (
              <Text style={{ fontSize: 14, color: colors.muted, marginTop: 4 }}>{i.description}</Text>
            )}
          </Card>
        ))
      )}
    </Screen>
  );
}