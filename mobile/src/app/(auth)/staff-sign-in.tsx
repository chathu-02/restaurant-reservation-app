import { Button, colors, Field, LinkText, Message, Screen } from "@/components/form-ui";
import { friendlyError, homeRouteFor, login, logout, Role } from "@/lib/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text } from "react-native";

const STAFF_ROLES: Role[] = ["manager", "front", "kitchen"];
const STAFF_DOMAIN = "staff.oceangrace.app";

// a plain username becomes a staff email; a full email still works
const toEmail = (input: string) =>
  input.includes("@") ? input.trim() : `${input.trim().toLowerCase()}@${STAFF_DOMAIN}`;

export default function StaffSignIn() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const role = await login(toEmail(username), password);
      if (!STAFF_ROLES.includes(role)) {
        await logout();
        setError("This is not a staff account. Customers can log in from the customer option.");
        return;
      }
      router.replace(homeRouteFor(role) as never);
    } catch (e) {
      setError(friendlyError(e).replace("Email or password", "Username or password"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <Text style={{ fontSize: 28, fontWeight: "700", color: colors.text, marginBottom: 6 }}>
        Staff log in
      </Text>
      <Text style={{ fontSize: 16, color: colors.muted, marginBottom: 24 }}>
        Use the username and password your manager gave you.
      </Text>
      <Field label="Username" value={username} onChangeText={setUsername} autoComplete="username" />
      <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Message text={error} />
      <Button title={busy ? "Please wait…" : "Log in"} onPress={submit} disabled={busy} />
      <Text style={{ fontSize: 14, color: colors.muted, textAlign: "center", marginVertical: 8 }}>
        Forgot your password? Ask your manager.
      </Text>
      <LinkText title="Back" onPress={() => router.replace("/role-choice" as never)} />
    </Screen>
  );
}
