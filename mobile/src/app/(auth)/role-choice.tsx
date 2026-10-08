import { BRAND } from "@/lib/brand";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ComponentProps } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "@/components/logo";

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
      style={({ pressed }) => [
        styles.choiceCard,
        pressed && styles.choiceCardPressed
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={23} color="#FFFFFF" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.choiceTitle}>{title}</Text>
        <Text style={styles.choiceSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#10B981" />
    </Pressable>
  );
}

export default function RoleChoice() {
  const router = useRouter();
  
  return (
    <View style={{ flex: 1, backgroundColor: "#F6FDF8", position: "relative", overflow: "hidden" }}>
      {/* Background Decorative Shapes */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.bgCircle3} />

      <SafeAreaView style={styles.screen}>
        <Text style={styles.title}>Welcome to {BRAND.name}</Text>
          
        <View style={styles.header}>
          <Logo size={240} color="#064E3B" />
          </View>
        <Text style={styles.subtitle}>How would you like to continue?</Text>



        <View style={styles.cardsContainer}>
          <Choice
            icon="person"
            title="I am a Customer"
            subtitle="Book a table or join the queue"
            onPress={() => router.push("/sign-in" as never)}
          />
          <Choice
            icon="briefcase"
            title="I am Staff"
            subtitle="Manage bookings, queue & the floor"
            onPress={() => router.push("/staff-sign-in" as never)}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  bgCircle1: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: '#D1FAE5',
    top: -100,
    right: -100,
    opacity: 0.5,
  },
  bgCircle2: {
    position: 'absolute',
    width: 450,
    height: 450,
    borderRadius: 225,
    backgroundColor: '#E6F4EA',
    bottom: -150,
    left: -150,
    opacity: 0.7,
  },
  bgCircle3: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#FEF3C7',
    top: '40%',
    left: -80,
    opacity: 0.4,
  },
  screen: { 
    flex: 1, 
    paddingHorizontal: 24,
    justifyContent: "flex-start",
    paddingTop: 60
  },
  header: { 
    alignItems: "center", 
    marginBottom: 40 
  },
  title: { 
    fontSize: 30, 
    fontFamily: "Inter_800ExtraBold", 
    color: "#064E3B", 
    marginTop: 20,
    textAlign: "center"
  },
  subtitle: { 
    fontSize: 17, 
    fontFamily: "Inter_500Medium", 
    color: "#55645D", 
    marginTop: 8,
    textAlign: "center"
  },
  cardsContainer: {
    marginTop: 32,
    gap: 20,
  },
  choiceCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "rgba(16, 185, 129, 0.2)",
    borderRadius: 20,
    padding: 16,
    minHeight: 80,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  choiceCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
    backgroundColor: "#F9FAFB",
    borderColor: "#10B981",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#064E3B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  choiceTitle: { 
    fontSize: 16, 
    fontFamily: "Inter_800ExtraBold", 
    color: "#064E3B",
    marginBottom: 2
  },
  choiceSubtitle: { 
    fontSize: 13, 
    fontFamily: "Inter_500Medium", 
    color: "#55645D",
    lineHeight: 18
  }
});