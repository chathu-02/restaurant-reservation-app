import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import type { ReservationDoc } from "./booking";
import { auth, db } from "./firebase";

// best effort: a failure here never blocks the staff member's action
async function notifyCustomer(userId: string, message: string) {
  try {
    await addDoc(collection(db, "notifications"), {
      userId,
      message,
      read: false,
      createdAt: serverTimestamp(),
    });
  } catch {
    // ignore
  }
}

export async function confirmDeposit(r: ReservationDoc) {
  await updateDoc(doc(db, "reservations", r.id), {
    status: "confirmed",
    depositStatus: "received",
    depositVerifiedAt: serverTimestamp(),
    depositVerifiedBy: auth.currentUser?.uid ?? "",
  });
  await notifyCustomer(
    r.userId,
    `Your deposit for booking ${r.bookingId} was received. Your booking is confirmed.`
  );
}

export async function rejectDeposit(r: ReservationDoc) {
  await updateDoc(doc(db, "reservations", r.id), { depositStatus: "rejected" });
  await notifyCustomer(
    r.userId,
    `We could not verify the receipt for booking ${r.bookingId}. Please send a clear receipt again or call us.`
  );
}

export async function releaseBooking(r: ReservationDoc) {
  await updateDoc(doc(db, "reservations", r.id), { status: "expired" });
  await notifyCustomer(
    r.userId,
    `Booking ${r.bookingId} was released because the deposit was not received.`
  );
}

// turns 077 123 4567 into 94771234567 for a WhatsApp link
export function whatsappNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("94")) return digits;
  if (digits.startsWith("0")) return `94${digits.slice(1)}`;
  return digits;
}