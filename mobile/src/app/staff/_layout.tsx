import { Stack } from "expo-router";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/components/form-ui";

export default function StaffLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      {/* Main tab container — no header */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* Manager sub-screens — each gets a back arrow automatically */}
      <Stack.Screen
        name="staff-accounts"
        options={{ headerShown: false, presentation: "card" }}
      />
      <Stack.Screen
        name="restaurant-settings"
        options={{ headerShown: false, presentation: "card" }}
      />
      <Stack.Screen
        name="floor-layout"
        options={{ headerShown: false, presentation: "card" }}
      />
      <Stack.Screen
        name="reports"
        options={{ headerShown: false, presentation: "card" }}
      />
      <Stack.Screen
        name="profile"
        options={{ headerShown: false, presentation: "card" }}
      />
    </Stack>
  );
}
