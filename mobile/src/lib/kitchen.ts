import { collection, doc, getDocs, onSnapshot, orderBy, query, updateDoc, where, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { ReservationDoc } from "./booking";

// Load reservations for a specific date, sorted by timeMinutes
export async function loadKitchenReservations(date: string): Promise<ReservationDoc[]> {
  const snap = await getDocs(
    query(
      collection(db, "reservations"),
      where("date", "==", date),
      where("status", "in", ["confirmed", "pending", "seated"])
    )
  );
  const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as ReservationDoc));
  return docs.sort((a, b) => a.timeMinutes - b.timeMinutes);
}

// Real-time listener for kitchen alerts
export function subscribeKitchenAlerts(callback: (alerts: any[]) => void) {
  return onSnapshot(
    query(collection(db, "kitchenAlerts"), orderBy("createdAt", "desc")),
    (snap) => callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  );
}

// Acknowledge an alert
export async function acknowledgeAlert(id: string) {
  await updateDoc(doc(db, "kitchenAlerts", id), { acknowledged: true, acknowledgedAt: serverTimestamp() });
}

// Mark a reservation as seated
export async function markSeated(id: string) {
  await updateDoc(doc(db, "reservations", id), { status: "seated", seatedAt: serverTimestamp() });
}

// Mark a reservation as no_show
export async function markNoShow(id: string) {
  await updateDoc(doc(db, "reservations", id), { status: "no_show" });
}
