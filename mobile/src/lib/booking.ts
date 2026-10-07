import {
  addDoc,
  updateDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "./firebase";

export const RESTAURANT_PHONE = "+94372281966"; // TODO: real restaurant number
export const WHATSAPP_NUMBER = "+94774483581"; // TODO: international format, no +
export const BANK = {
  bank: "BOC",
  accountName: "Wijesinghe WAPU",
  accountNumber: "93216462",
};
export const SLOT_MINUTES = 90; // a booking holds its tables for 90 minutes
export const MAX_ONLINE_PARTY = 20; // larger groups must call the restaurant
export const LARGE_GROUP = 10; // groups this size or bigger also notify the kitchen
const BLOCKING = ["pending", "confirmed", "seated"];

export type TableDoc = { id: string; name: string; seats: number; row?: number; col?: number };
export type Settings = {
  depositAmount: number;
  depositMinGuests: number;
  depositMaxGuests: number;
  graceMinutes: number;
};
export type ReservationDoc = {
  id: string;
  bookingId: string;
  userId: string;
  userName: string;
  phone: string;
  date: string;
  time: string;
  timeMinutes: number;
  partySize: number;
  tableIds: string[];
  tableNames: string[];
  status: string;
  depositRequired: boolean;
  depositStatus: string;
  depositAmount: number;
  checkedIn?: boolean;
};

const DEFAULT_SETTINGS: Settings = {
  depositAmount: 2500,
  depositMinGuests: 10,
  depositMaxGuests: 20,
  graceMinutes: 15,
};

export async function loadSettings(): Promise<Settings> {
  const snap = await getDoc(doc(db, "settings", "restaurant"));
  return {
    ...DEFAULT_SETTINGS,
    ...(snap.exists() ? (snap.data() as Partial<Settings>) : {}),
  };
}

export async function loadTables(): Promise<TableDoc[]> {
  const snap = await getDocs(collection(db, "tables"));
  return snap.docs
    .map((d) => {
      const data = d.data();
      return {
        id: d.id,
        name: String(data.name ?? d.id),
        seats: Number(data.seats ?? 0),
        row: data.row !== undefined ? Number(data.row) : undefined,
        col: data.col !== undefined ? Number(data.col) : undefined,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
}

export async function loadDayReservations(date: string): Promise<ReservationDoc[]> {
  const snap = await getDocs(
    query(collection(db, "reservations"), where("date", "==", date))
  );
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<ReservationDoc, "id">),
  }));
}

export function busyTableIds(reservations: ReservationDoc[], minutes: number) {
  const busy = new Set<string>();
  reservations.forEach((r) => {
    if (BLOCKING.includes(r.status) && Math.abs(r.timeMinutes - minutes) < SLOT_MINUTES) {
      (r.tableIds ?? []).forEach((id) => busy.add(id));
    }
  });
  return busy;
}

export function freeTables(tables: TableDoc[], reservations: ReservationDoc[], minutes: number) {
  const busy = busyTableIds(reservations, minutes);
  return tables.filter((t) => !busy.has(t.id));
}

export function slotIsFull(
  tables: TableDoc[],
  reservations: ReservationDoc[],
  minutes: number,
  party: number
) {
  const seats = freeTables(tables, reservations, minutes).reduce((s, t) => s + t.seats, 0);
  return seats < party;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pad = (n: number) => String(n).padStart(2, "0");

export function dateValue(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function nextDays(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return { value: dateValue(d), label: `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}` };
  });
}

export function prettyDate(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return `${DAYS[dt.getDay()]} ${d} ${MONTHS[m - 1]}`;
}

export function formatTime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${pad(m)} ${h >= 12 ? "PM" : "AM"}`;
}

export function timeSlots() {
  const out: { minutes: number; label: string }[] = [];
  for (let m = 17 * 60; m <= 21 * 60 + 30; m += 30) out.push({ minutes: m, label: formatTime(m) });
  return out;
}

export function statusLabel(r: { status: string; depositStatus: string }) {
  if (r.status === "confirmed") return "Confirmed";
  if (r.status === "pending") {
    if (r.depositStatus === "receipt_sent") return "Receipt sent, we are checking it";
    if (r.depositStatus === "rejected") return "Receipt rejected, please contact us";
    return "Waiting for your deposit";
  }
  if (r.status === "seated") return "Seated";
  if (r.status === "cancelled") return "Cancelled";
  if (r.status === "no_show") return "Marked as no-show";
  if (r.status === "expired") return "Expired";
  return r.status;
}

export async function createReservation(input: {
  date: string;
  minutes: number;
  party: number;
  tables: TableDoc[];
  depositRequired: boolean;
  depositAmount: number;
  userName: string;
  phone: string;
}) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw Object.assign(new Error("not signed in"), { code: "app/not-signed-in" });

  // check again just before saving, in case someone else booked meanwhile
  const existing = await loadDayReservations(input.date);
  const busy = busyTableIds(existing, input.minutes);
  if (input.tables.some((t) => busy.has(t.id))) {
    throw Object.assign(new Error("taken"), { code: "app/slot-taken" });
  }

  const bookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
  const ref = await addDoc(collection(db, "reservations"), {
    bookingId,
    userId: uid,
    userName: input.userName,
    phone: input.phone,
    date: input.date,
    time: formatTime(input.minutes),
    timeMinutes: input.minutes,
    partySize: input.party,
    tableIds: input.tables.map((t) => t.id),
    tableNames: input.tables.map((t) => t.name),
    status: input.depositRequired ? "pending" : "confirmed",
    depositRequired: input.depositRequired,
    depositStatus: input.depositRequired ? "waiting" : "none",
    depositAmount: input.depositRequired ? input.depositAmount : 0,
    createdAt: serverTimestamp(),
  });
  
  if (input.party >= LARGE_GROUP) {
    await postKitchenAlert(
      "large_group",
      `${input.party} guests at ${formatTime(input.minutes)} on ${prettyDate(input.date)}, tables ${input.tables
        .map((t) => t.name)
        .join(", ")}.`
    );
  }
  return { id: ref.id, bookingId };
}

// groups tables into rows for the floor map; tables without row/col are placed automatically
export function layoutRows(tables: TableDoc[]): TableDoc[][] {
  const rows = new Map<number, { t: TableDoc; col: number }[]>();
  tables.forEach((t, i) => {
    const row = t.row ?? Math.floor(i / 4) + 1;
    const col = t.col ?? (i % 4) + 1;
    rows.set(row, [...(rows.get(row) ?? []), { t, col }]);
  });
  return [...rows.keys()]
    .sort((a, b) => a - b)
    .map((r) => rows.get(r)!.sort((a, b) => a.col - b.col).map((x) => x.t));
}

export function statusTone(r: { status: string }): "good" | "wait" | "bad" {
  if (r.status === "confirmed" || r.status === "seated") return "good";
  if (r.status === "pending") return "wait";
  return "bad";
}

// best effort: a failure here never blocks the customer's action
export async function postKitchenAlert(
  type: "large_group" | "changed" | "cancelled",
  message: string
) {
  try {
    await addDoc(collection(db, "kitchenAlerts"), {
      type,
      message,
      acknowledged: false,
      createdAt: serverTimestamp(),
    });
  } catch {
    // ignore
  }
}

export async function cancelReservation(r: ReservationDoc) {
  await updateDoc(doc(db, "reservations", r.id), {
    status: "cancelled",
    cancelledAt: serverTimestamp(),
  });
  if (r.partySize >= LARGE_GROUP) {
    await postKitchenAlert(
      "cancelled",
      `${r.partySize} guests at ${r.time} on ${prettyDate(r.date)} cancelled. You can stop prep.`
    );
  }
}

// keeps the same tables and party size; fails if those tables are busy at the new time
export async function changeReservationTime(r: ReservationDoc, date: string, minutes: number) {
  const others = (await loadDayReservations(date)).filter((x) => x.id !== r.id);
  const busy = busyTableIds(others, minutes);
  if ((r.tableIds ?? []).some((id) => busy.has(id))) {
    throw Object.assign(new Error("taken"), { code: "app/slot-taken" });
  }
  await updateDoc(doc(db, "reservations", r.id), {
    date,
    time: formatTime(minutes),
    timeMinutes: minutes,
  });
  if (r.partySize >= LARGE_GROUP) {
    await postKitchenAlert(
      "changed",
      `${r.partySize} guests moved from ${r.time} on ${prettyDate(r.date)} to ${formatTime(minutes)} on ${prettyDate(date)}.`
    );
  }
}

// check-in opens 60 minutes before the booking and closes when its 90 minute slot ends
export function checkInInfo(r: ReservationDoc): { canCheckIn: boolean; note: string } {
  if (r.checkedIn)
    return { canCheckIn: false, note: "You are checked in. Please wait for our host to show you to your table." };
  if (r.status === "pending")
    return { canCheckIn: false, note: "Your booking is waiting for deposit confirmation, so check-in is not open yet." };
  if (r.status !== "confirmed")
    return { canCheckIn: false, note: "This booking is not active." };
  if (r.date !== dateValue(new Date()))
    return { canCheckIn: false, note: `Check-in opens on the day of your booking (${prettyDate(r.date)}).` };
  const now = new Date();
  const m = now.getHours() * 60 + now.getMinutes();
  if (m < r.timeMinutes - 60)
    return { canCheckIn: false, note: `Check-in opens at ${formatTime(r.timeMinutes - 60)}.` };
  if (m > r.timeMinutes + SLOT_MINUTES)
    return { canCheckIn: false, note: "Your booking time has passed. Please speak to our host." };
  return { canCheckIn: true, note: "Tap the button when you arrive and our host will see you." };
}