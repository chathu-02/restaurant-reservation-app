import { Text } from "react-native";
import { colors, Screen } from "@/components/form-ui";

export default function QueueTab() {
  return (
    <Screen>
      <Text style={{ fontSize: 26, fontWeight: "700", color: colors.text }}>Queue</Text>
      <Text style={{ color: colors.muted, marginTop: 8 }}>The virtual queue screens go here.</Text>
    </Screen>
  );
}