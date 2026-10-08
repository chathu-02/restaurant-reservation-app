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
      setAreas(["manager", "front", "kitchen"]);
      return;
    }
    getDoc(doc(db, "users", uid))
      .then((s) => {
        const allowed = ACCESS[String(s.data()?.role)];
        setAreas(allowed || ["manager", "front", "kitchen"]);
      })
      .catch(() => setAreas(["manager", "front", "kitchen"]));
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
        tabBarStyle: { display: "none" },
      }}
    >
      {tab("front", "Front staff", "people", "people-outline")}
      {tab("manager", "Manager", "stats-chart", "stats-chart-outline")}
      {tab("kitchen", "Kitchen", "restaurant", "restaurant-outline")}
    </Tabs>
  );
}