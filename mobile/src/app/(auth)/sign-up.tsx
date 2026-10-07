import { useState } from "react";
import { Text } from "react-native";
import { useRouter } from "expo-router";
import { Button, colors, Field, LinkText, Message, Screen } from "@/components/form-ui";
import { friendlyError, registerCustomer } from "@/lib/auth";

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      setError("Please fill in every field.");
      return;
    }
    if (phone.replace(/\D/g, "").length < 9) {
      setError("Please enter a valid phone number.");
      return;
    }
    if (password !== confirm) {
      setError("The two passwords do not match.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await registerCustomer(name, email, phone, password);
      router.replace("/home" as never);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <Text style={{ fontSize: 28, fontWeight: "700", color: colors.text, marginBottom: 6 }}>
        Create your account
      </Text>
      <Text style={{ fontSize: 16, color: colors.muted, marginBottom: 24 }}>
        We use your phone number to reach you about your table.
      </Text>
      <Field label="Full name" value={name} onChangeText={setName} autoCapitalize="words" />
      <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoComplete="email" />
      <Field label="Phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <Field label="Password (at least 6 characters)" value={password} onChangeText={setPassword} secureTextEntry />
      <Field label="Confirm password" value={confirm} onChangeText={setConfirm} secureTextEntry />
      <Message text={error} />
      <Button title={busy ? "Please wait…" : "Sign up"} onPress={submit} disabled={busy} />
      <LinkText title="Already have an account? Log in" onPress={() => router.replace("/sign-in" as never)} />
    </Screen>
  );
}