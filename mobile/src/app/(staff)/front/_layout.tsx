import { Stack } from "expo-router";
import { AuthProvider } from "@/hooks/useAuth";

export default function AreaLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}