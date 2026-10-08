import { colors, Screen } from "@/components/form-ui";
import { Logo } from "@/components/logo";
import { BRAND } from "@/lib/brand";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";

type IconName = ComponentProps<typeof Ionicons>["name"];

function Choice({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: IconName;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#DDE4DF",
        borderRadius: 16,
        padding: 18,
        marginBottom: 14,
        minHeight: 88,
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: "#D5EDE3",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon} size={24} color={colors.green} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 17, fontWeight: "700", color: colors.text }}>{title}</Text>
        <Text style={{ fontSize: 14, color: colors.muted, marginTop: 2 }}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.muted} />
    </Pressable>
  );
}

export default function RoleChoice() {
  const router = useRouter();
  return (
    <Screen>
      <View style={{ alignItems: "center", marginBottom: 24 }}>
        <Logo size={140} />
        <Text style={{ fontSize: 24, fontWeight: "700", color: colors.text, marginTop: 8 }}>
          Welcome to {BRAND.name}
        </Text>
        <Text style={{ fontSize: 15, color: colors.muted, marginTop: 4 }}>
          How would you like to continue?
        </Text>
      </View>
      <Choice
        icon="person-outline"
        title="I am a customer"
        subtitle="Book a table or join the queue"
        onPress={() => router.push("/sign-in" as never)}
      />
      <Choice
        icon="briefcase-outline"
        title="I am restaurant staff"
        subtitle="Manage bookings, the queue and the kitchen"
        onPress={() => router.push("/staff-sign-in" as never)}
      />
    </Screen>
  );
}