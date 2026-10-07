import { Text } from "react-native";
import { useRouter } from "expo-router";
import { logout } from "@/lib/auth";
import { Button, colors, Screen } from "@/components/form-ui";

export default function Profile() {
  const router = useRouter();
  return (
    <Screen>
      <Text style={{ fontSize: 26, fontWeight: "700", color: colors.text, marginBottom: 20 }}>Profile</Text>
      <Button
        title="Log out"
        secondary
        onPress={async () => {
          await logout();
          router.replace("/sign-in" as never);
        }}
      />
    </Screen>
  );
}