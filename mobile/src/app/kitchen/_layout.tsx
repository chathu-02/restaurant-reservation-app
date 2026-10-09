import { Stack } from "expo-router";
import { AuthProvider } from "@/hooks/useAuth";

export default function KitchenLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}

