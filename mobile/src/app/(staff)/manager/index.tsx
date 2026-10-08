import { Button, colors, Screen } from "@/components/form-ui";
import { logout } from "@/lib/auth";
import { useRouter } from "expo-router";
import { Text } from "react-native";

export default function ManagerHome() {
  const router = useRouter();
  return (
    <Screen top>
      <Text style={{ fontSize: 26, fontWeight: "700", color: colors.text }}>Manager</Text>
      <Text style={{ color: colors.muted, marginVertical: 8 }}>
        Reports, settings and staff accounts go here.
      </Text>
      <Button
        title="Log out"
        secondary
        onPress={async () => {
          await logout();
          router.replace("/role-choice" as never);
        }}
      />
    </Screen>
  );
}