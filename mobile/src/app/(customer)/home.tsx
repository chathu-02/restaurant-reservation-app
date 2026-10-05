import { useEffect, useState } from "react";
import { Text } from "react-native";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { logout } from "@/lib/auth";
import { Button, colors, Screen } from "@/components/form-ui";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    getDoc(doc(db, "users", uid)).then((snap) => setName(snap.data()?.name ?? ""));
  }, []);

  return (
    <Screen>
      <Text style={{ fontSize: 28, fontWeight: "700", color: colors.text, marginBottom: 24 }}>
        Hello{name ? `, ${name}` : ""}
      </Text>
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