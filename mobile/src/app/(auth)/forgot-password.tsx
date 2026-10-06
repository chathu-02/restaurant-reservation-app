import { useState } from "react";
import { Text } from "react-native";
import { useRouter } from "expo-router";
import { Button, colors, Field, LinkText, Message, Screen } from "@/components/form-ui";
import { friendlyError, sendReset } from "@/lib/auth";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await sendReset(email);
      setSent(true);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <Text style={{ fontSize: 28, fontWeight: "700", color: colors.text, marginBottom: 6 }}>
        Forgot password?
      </Text>
      <Text style={{ fontSize: 16, color: colors.muted, marginBottom: 24 }}>
        Enter your email and we will send you a link to set a new password.
      </Text>
      <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoComplete="email" />
      <Message text={error} />
      <Message
        good
        text={sent ? "If an account exists for this email, a reset link is on its way. Check your inbox and spam folder." : ""}
      />
      <Button title={busy ? "Please wait…" : "Send reset link"} onPress={submit} disabled={busy} />
      <LinkText title="Back to log in" onPress={() => router.replace("/sign-in" as never)} />
    </Screen>
  );
}