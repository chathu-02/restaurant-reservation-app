import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { colors } from "@/components/form-ui";

export default function KitchenBackButton() {
  const router = useRouter();

  return (
    <Pressable
      accessibilityLabel="Back to front dashboard"
      hitSlop={8}
      onPress={() => router.replace("/(staff)/front" as never)}
      style={styles.button}
    >
      <Ionicons name="arrow-back" size={20} color={colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#E2E8F0",
    borderRadius: 19,
    borderWidth: 1,
    elevation: 1,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
});
