import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button, Card, colors, LinkText, Message, Screen } from "@/components/form-ui";

export default function Feedback() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getDoc(doc(db, "feedback", id))
      .then((s) => {
        if (s.exists()) setDone(true);
      })
      .catch(() => {});
  }, [id]);

  const submit = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    if (rating === 0) {
      setError("Please choose a star rating.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      // one feedback per booking: the document id is the booking's id
      await setDoc(doc(db, "feedback", id), {
        reservationId: id,
        userId: uid,
        rating,
        comment: comment.trim(),
        createdAt: serverTimestamp(),
      });
      setDone(true);
    } catch {
      setError("Could not send your feedback. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <Screen>
        <Card>
          <Text style={{ fontSize: 22, fontWeight: "700", color: colors.text }}>Thank you!</Text>
          <Text style={{ fontSize: 15, color: colors.text, marginTop: 6, lineHeight: 22 }}>
            Your feedback helps us improve your next visit.
          </Text>
        </Card>
        <LinkText title="Back to home" onPress={() => router.navigate("/home" as never)} />
      </Screen>
    );
  }

  return (
    <Screen top>
      <Text style={{ fontSize: 26, fontWeight: "700", color: colors.text, marginBottom: 6 }}>
        How was your visit?
      </Text>
      <Text style={{ fontSize: 15, color: colors.muted, marginBottom: 18 }}>
        Tap a star to rate your experience.
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 18 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable
            key={n}
            accessibilityRole="button"
            accessibilityLabel={`${n} star${n > 1 ? "s" : ""}`}
            onPress={() => setRating(n)}
            style={{ minHeight: 48, minWidth: 52, alignItems: "center", justifyContent: "center" }}
          >
            <Ionicons name={n <= rating ? "star" : "star-outline"} size={38} color="#E8A33D" />
          </Pressable>
        ))}
      </View>
      <Text style={{ fontSize: 14, fontWeight: "700", color: colors.text, marginBottom: 6 }}>
        Comments (optional)
      </Text>
      <TextInput
        value={comment}
        onChangeText={setComment}
        multiline
        placeholder="Tell us what you liked, or what we could do better"
        placeholderTextColor={colors.muted}
        style={{
          height: 120,
          textAlignVertical: "top",
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          backgroundColor: "#fff",
          padding: 14,
          fontSize: 16,
          color: colors.text,
          marginBottom: 14,
        }}
      />
      <Message text={error} />
      <Button title={busy ? "Sending…" : "Submit feedback"} disabled={busy} onPress={submit} />
      <LinkText title="Not now" onPress={() => router.back()} />
    </Screen>
  );
}