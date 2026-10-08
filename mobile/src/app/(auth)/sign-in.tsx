import { useState } from "react";
import { Text } from "react-native";
import { useRouter } from "expo-router";
import { Button, colors, Field, LinkText, Message, Screen } from "@/components/form-ui";
import { friendlyError, homeRouteFor, login } from "@/lib/auth";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const role = await login(email, password);
      router.replace(homeRouteFor(role) as never);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <Text style={{ fontSize: 28, fontWeight: "700", color: colors.text, marginBottom: 6 }}>
        Welcome back
      </Text>
      <Text style={{ fontSize: 16, color: colors.muted, marginBottom: 24 }}>
        Log in to book a table or join the queue.
      </Text>
      <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoComplete="email" />
      <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Message text={error} />
      <Button title={busy ? "Please wait..." : "Log in"} onPress={submit} disabled={busy} />
      <LinkText title="Forgot password?" onPress={() => router.push("/forgot-password" as never)} />
      <LinkText title="New here? Create an account" onPress={() => router.push("/sign-up" as never)} />
    </Screen>
  );
}
