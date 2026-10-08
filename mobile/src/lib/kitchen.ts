import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { ReservationDoc } from "./booking";

export const KITCHEN_STATUSES = ["pending", "confirmed", "seated", "preparing", "ready", "served"] as const;
export type KitchenStatus = (typeof KITCHEN_STATUSES)[number];

// Load reservations for a specific date, sorted by timeMinutes
export async function loadKitchenReservations(date: string): Promise<ReservationDoc[]> {
  const snap = await getDocs(
    query(
      collection(db, "reservations"),
      where("date", "==", date),
      where("status", "in", KITCHEN_STATUSES)
    )
  );
  const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as ReservationDoc));
  return docs.sort((a, b) => a.timeMinutes - b.timeMinutes);
}

// Live reservation feed so kitchen screens update when a customer or staff member changes a booking.
export function subscribeKitchenReservations(
  date: string,
  callback: (reservations: ReservationDoc[]) => void,
  onError?: (error: Error) => void
) {
  return onSnapshot(
    query(
      collection(db, "reservations"),
      where("date", "==", date),
      where("status", "in", KITCHEN_STATUSES)
    ),
    (snap) =>
      callback(
        snap.docs
          .map((reservation) => ({
            id: reservation.id,
            ...(reservation.data() as Omit<ReservationDoc, "id">),
          }))
          .sort((a, b) => a.timeMinutes - b.timeMinutes)
      ),
    (error) => onError?.(error)
  );
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

export async function acknowledgeKitchenNotification(id: string) {
  await updateDoc(doc(db, "notifications", id), {
    read: true,
    readAt: serverTimestamp(),
    readBy: auth.currentUser?.uid ?? null,
  });
}

export async function updateReservationStatus(id: string, status: KitchenStatus) {
  const timestamp = serverTimestamp();
  const update: Record<string, unknown> = {
    status,
    kitchenUpdatedAt: timestamp,
    kitchenUpdatedBy: auth.currentUser?.uid ?? null,
  };
  if (status === "seated") update.seatedAt = timestamp;
  if (status === "preparing") update.preparingAt = timestamp;
  if (status === "ready") update.readyAt = timestamp;
  if (status === "served") update.servedAt = timestamp;

  await updateDoc(doc(db, "reservations", id), update);
  await addDoc(collection(db, "notifications"), {
    title: `Booking ${status}`,
    message: `Reservation ${id} was marked as ${status} by the kitchen.`,
    type: "reservation_status",
    category: "booking",
    recipientRole: "staff",
    reservationId: id,
    read: false,
    createdAt: timestamp,
  });
}

export function markSeated(id: string) {
  return updateReservationStatus(id, "seated");
}

export function markNoShow(id: string) {
  return updateDoc(doc(db, "reservations", id), {
    status: "no_show",
    kitchenUpdatedAt: serverTimestamp(),
    kitchenUpdatedBy: auth.currentUser?.uid ?? null,
  });
}
