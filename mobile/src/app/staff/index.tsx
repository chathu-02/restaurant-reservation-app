import { Redirect } from "expo-router";

// Redirect /staff → /staff/(tabs)/dashboard
export default function StaffIndex() {
  return <Redirect href="/staff/dashboard" />;
}
