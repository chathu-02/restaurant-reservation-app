import { colors } from "@/components/form-ui";
import { auth, db } from "@/lib/firebase";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { ComponentProps, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

type IconName = ComponentProps<typeof Ionicons>["name"];
type Area = "front" | "manager" | "kitchen";

// which areas (tabs) each role may open
const ACCESS: Record<string, Area[]> = {
  manager: ["manager", "front", "kitchen"],
  front: ["front"],
  kitchen: ["kitchen"],
};

export default function StaffLayout() {
  const router = useRouter();
  const [areas, setAreas] = useState<Area[] | null>(null);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      router.replace("/role-choice" as never);
      return;
    }
    getDoc(doc(db, "users", uid))
      .then((s) => {
        const allowed = ACCESS[String(s.data()?.role)];
        if (!allowed || s.data()?.active === false) {
          router.replace("/role-choice" as never);
          return;
        }
        setAreas(allowed);
      })
      .catch(() => router.replace("/role-choice" as never));
  }, [router]);

  if (!areas) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.green} />
      </View>
    );
  }

  const tab = (name: Area, title: string, on: IconName, off: IconName) => (
    <Tabs.Screen
      name={name}
      options={{
        title,
        href: areas.includes(name) ? undefined : null,
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons name={focused ? on : off} size={size} color={color} />
        ),
      }}
    />
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle:
          areas.length > 1
            ? { backgroundColor: "#fff", borderTopColor: "#DDE4DF" }
            : { display: "none" },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
      }}
    >
      {tab("front", "Front staff", "people", "people-outline")}
      {tab("manager", "Manager", "stats-chart", "stats-chart-outline")}
      {tab("kitchen", "Kitchen", "restaurant", "restaurant-outline")}
    </Tabs>
  );
}