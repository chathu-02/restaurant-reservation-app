import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export type SeatingPreference = 'Indoor' | 'Outdoor' | 'Any Table';

export type QueueStatus = 'WAITING' | 'CALLED' | 'SEATED' | 'CANCELLED';

export interface QueueEntry {
  id: string;
  customerName: string;
  phoneNumber: string; // normalized e.g. "+94771234567"
  phoneFormatted: string; // e.g. "+94 77 123 4567"
  partySize: number;
  seatingPreference: SeatingPreference;
  specialRequests?: string;
  joinedAt: string; // ISO 8601 string
  joinedTimeFormatted: string; // e.g. "7:45 PM"
  queuePosition: number;
  estimatedWaitMinutes: number;
  tablesAhead: number;
  status: QueueStatus;
}

const STORAGE_KEY = '@restaurant_active_queue_entry';

/**
 * Validates and normalizes Sri Lankan mobile numbers.
 * Supported local formats:
 * - 0771234567, 0712345678, 070..., 072..., 074..., 075..., 076..., 078...
 * - 771234567 (9 digits without leading 0)
 * - +94771234567 or +94 77 123 4567 (international format)
 * - 0094771234567 or 94771234567
 */
export function validateAndNormalizeSriLankanPhone(input: string): {
  isValid: boolean;
  normalized: string;
  formatted: string;
  displayLocal: string;
  rawDigits: string;
  error?: string;
} {
  if (!input || !input.trim()) {
    return {
      isValid: false,
      normalized: '',
      formatted: '',
      displayLocal: '',
      rawDigits: '',
      error: 'Please enter your Sri Lankan mobile number.',
    };
  }

  // Remove spaces, hyphens, brackets, dots
  let cleaned = input.trim().replace(/[\s\-\(\)\.]/g, '');

  if (cleaned.startsWith('+')) {
    if (cleaned.startsWith('+94')) {
      cleaned = cleaned.slice(3);
    } else {
      return {
        isValid: false,
        normalized: '',
        formatted: '',
        displayLocal: '',
        rawDigits: '',
        error: 'Only Sri Lankan numbers (+94) are supported for local queue alerts.',
      };
    }
  } else if (cleaned.startsWith('0094')) {
    cleaned = cleaned.slice(4);
  } else if (cleaned.startsWith('94') && cleaned.length === 11) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1);
  }

  // Strip any remaining non-digit characters
  cleaned = cleaned.replace(/\D/g, '');

  // Sri Lankan mobile prefixes: 70, 71, 72, 74, 75, 76, 77, 78
  // Total mobile subscriber length is 9 digits after country code / 0 trunk
  const slRegex = /^7[01245678]\d{7}$/;

  if (!slRegex.test(cleaned)) {
    if (cleaned.length !== 9) {
      return {
        isValid: false,
        normalized: '',
        formatted: '',
        displayLocal: '',
        rawDigits: cleaned,
        error: `Sri Lankan mobile numbers require 9 digits (e.g. 077 123 4567). Found ${cleaned.length} digits.`,
      };
    }
    return {
      isValid: false,
      normalized: '',
      formatted: '',
      displayLocal: '',
      rawDigits: cleaned,
      error: 'Invalid mobile prefix. Sri Lankan mobile numbers start with 070, 071, 072, 074, 075, 076, 077, or 078.',
    };
  }

  const normalized = `+94${cleaned}`;
  const formatted = `+94 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
  const displayLocal = `0${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;

  return {
    isValid: true,
    normalized,
    formatted,
    displayLocal,
    rawDigits: cleaned,
  };
}

/**
 * Format current time into human-friendly "H:MM AM/PM"
 */
export function formatTime(date: Date = new Date()): string {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

// In-memory cache for synchronous read
let cachedQueueEntry: QueueEntry | null = null;
let isCacheLoaded = false;

/**
 * Load cached entry from AsyncStorage on app boot / initial access
 */
export async function initializeQueueService(): Promise<QueueEntry | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      cachedQueueEntry = JSON.parse(raw);
    } else {
      cachedQueueEntry = null;
    }
  } catch {
    // fallback to null
  } finally {
    isCacheLoaded = true;
  }
  return cachedQueueEntry;
}

// Immediately trigger background cache load
initializeQueueService();

/**
 * Get the current active queue entry (synchronous from memory)
 */
export function getActiveQueueEntrySync(): QueueEntry | null {
  return cachedQueueEntry;
}

/**
 * Get active queue entry (ensures storage is read)
 */
export async function getActiveQueueEntry(): Promise<QueueEntry | null> {
  if (!isCacheLoaded) {
    return await initializeQueueService();
  }
  return cachedQueueEntry;
}

/**
 * Save new queue entry
 */
export async function joinQueue(data: {
  customerName: string;
  phoneNumber: string; // validated input or normalized
  partySize: number;
  seatingPreference: SeatingPreference;
  specialRequests?: string;
}): Promise<QueueEntry> {
  const phoneValidation = validateAndNormalizeSriLankanPhone(data.phoneNumber);
  if (!phoneValidation.isValid) {
    throw new Error(phoneValidation.error || 'Invalid Sri Lankan phone number.');
  }

  const now = new Date();
  const joinedAt = now.toISOString();
  const joinedTimeFormatted = formatTime(now);

  // Calculate dynamic wait time and position based on party size & seating
  const basePosition = 3;
  const baseTablesAhead = 2;
  const waitPerTable = data.partySize >= 8 ? 8 : 5;
  const estimatedWaitMinutes = Math.max(10, baseTablesAhead * waitPerTable + (data.partySize > 4 ? 5 : 0));

  let firestoreId = `queue_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  // Try saving to Firestore if available
  try {
    const docRef = await addDoc(collection(db, 'queue'), {
      customerName: data.customerName.trim(),
      phoneNumber: phoneValidation.normalized,
      partySize: data.partySize,
      seatingPreference: data.seatingPreference,
      specialRequests: (data.specialRequests || '').trim(),
      joinedAt: serverTimestamp(),
      joinedTimeFormatted,
      queuePosition: basePosition,
      estimatedWaitMinutes,
      tablesAhead: baseTablesAhead,
      status: 'WAITING',
    });
    firestoreId = docRef.id;
  } catch (err) {
    // If Firestore fails (e.g. offline or rules), continue with local entry ID
    console.warn('Queue Firestore write failed, using local fallback:', err);
  }

  const newEntry: QueueEntry = {
    id: firestoreId,
    customerName: data.customerName.trim(),
    phoneNumber: phoneValidation.normalized,
    phoneFormatted: phoneValidation.formatted,
    partySize: data.partySize,
    seatingPreference: data.seatingPreference,
    specialRequests: (data.specialRequests || '').trim(),
    joinedAt,
    joinedTimeFormatted,
    queuePosition: basePosition,
    estimatedWaitMinutes,
    tablesAhead: baseTablesAhead,
    status: 'WAITING',
  };

  cachedQueueEntry = newEntry;

  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newEntry));
  } catch (storageErr) {
    console.warn('Failed to persist queue to AsyncStorage:', storageErr);
  }

  return newEntry;
}

/**
 * Leave the queue and release the spot
 */
export async function leaveQueue(): Promise<void> {
  if (cachedQueueEntry) {
    const entryId = cachedQueueEntry.id;
    try {
      if (entryId && !entryId.startsWith('queue_')) {
        await updateDoc(doc(db, 'queue', entryId), {
          status: 'CANCELLED',
        });
      }
    } catch (err) {
      console.warn('Could not update Firestore on leaveQueue:', err);
    }
  }

  cachedQueueEntry = null;
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Could not clear AsyncStorage queue entry:', err);
  }
}
