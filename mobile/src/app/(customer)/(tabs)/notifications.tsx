import { colors, Screen } from "@/components/form-ui";
import { Text } from "react-native";

export default function Notifications() {
  return (
    <Screen top>
      <Text style={{ fontSize: 26, fontWeight: "700", color: colors.text }}>Notifications</Text>
      <Text style={{ color: colors.muted, marginTop: 8 }}>Member 2 builds this screen.</Text>
    </Screen>
  );
}