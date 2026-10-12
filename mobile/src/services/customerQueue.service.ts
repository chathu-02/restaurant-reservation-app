import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CustomerQueueStatus, SeatingPreferenceType } from '@/types';
import api from './api';

const ACTIVE_QUEUE_KEY = '@active_customer_queue';

export class CustomerQueueService {
  /**
   * Save queue entry locally and to backend/Firestore
   */
  async joinQueue(params: {
    fullName: string;
    phoneNumber: string;
    partySize: number;
    seatingPreference: SeatingPreferenceType;
    specialRequests?: string;
  }): Promise<CustomerQueueStatus> {
    // 1. Calculate live queue stats
    const stats = await this.getLiveQueueStats();
    const position = stats.waitingCount + 1;
    const tablesAhead = Math.max(0, position - 1);
    const estimatedWaitMin = Math.max(5, tablesAhead * 4 + 4);

    const now = new Date();
    const joinedTimeStr = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

    const seatingTime = new Date(now.getTime() + estimatedWaitMin * 60000);
    const estimatedSeatingTimeStr = `~${seatingTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}`;

    let generatedId = `q-${Date.now()}`;

    // 2. Attempt Firestore persist
    try {
      const docRef = await addDoc(collection(db, 'queue'), {
        guestName: params.fullName.trim(),
        name: params.fullName.trim(),
        partySize: Number(params.partySize),
        phone: params.phoneNumber,
        notes: params.specialRequests || '',
        seatingPreference: params.seatingPreference,
        status: 'waiting',
        estimatedWaitMinutes: estimatedWaitMin,
        joinedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      });
      if (docRef?.id) {
        generatedId = docRef.id;
      }
    } catch (e) {
      console.warn('Firestore queue create fallback:', e);
      // Fallback: try Express API if available
      try {
        const res = await api.post<any>('/queue', {
          id: generatedId,
          guestName: params.fullName.trim(),
          partySize: Number(params.partySize),
          phone: params.phoneNumber,
          notes: params.specialRequests || '',
          seatingPreference: params.seatingPreference,
          status: 'waiting',
          estimatedWaitMinutes: estimatedWaitMin,
        });
        if (res?.data?.id) generatedId = res.data.id;
      } catch {}
    }

    const queueRecord: CustomerQueueStatus = {
      id: generatedId,
      restaurantName: 'The Green Terrace',
      restaurantLocation: 'Riverside Ave',
      position,
      queueNumber: `#${position}`,
      estimatedWaitMin,
      initialWaitMin: estimatedWaitMin,
      tablesAhead,
      turnoverPace: 'Fast (~4 min/table)',
      partySize: params.partySize,
      joinedTime: joinedTimeStr,
      seatingPreference: params.seatingPreference,
      floorStatus: 'Table clearing in progress',
      lastUpdated: 'Just now',
      fullName: params.fullName.trim(),
      phoneNumber: params.phoneNumber,
      specialRequests: params.specialRequests || undefined,
      estimatedSeatingTime: estimatedSeatingTimeStr,
      status: 'WAITING',
    };

    // 3. Save to local storage for persistence across reloads
    await AsyncStorage.setItem(ACTIVE_QUEUE_KEY, JSON.stringify(queueRecord));

    return queueRecord;
  }

  /**
   * Get active queue item from AsyncStorage
   */
  async getStoredQueue(): Promise<CustomerQueueStatus | null> {
    try {
      const raw = await AsyncStorage.getItem(ACTIVE_QUEUE_KEY);
      if (!raw) return null;
      const parsed: CustomerQueueStatus = JSON.parse(raw);
      if (parsed.status === 'LEFT') return null;
      return parsed;
    } catch {
      return null;
    }
  }

  /**
   * Leave queue and clear local and remote status
   */
  async leaveQueue(queueId?: string): Promise<void> {
    const active = await this.getStoredQueue();
    const idToCancel = queueId || active?.id;

    if (idToCancel) {
      try {
        await updateDoc(doc(db, 'queue', idToCancel), {
          status: 'cancelled',
          updatedAt: serverTimestamp(),
        });
      } catch (e) {
        console.warn('Firestore leave queue warning:', e);
        try {
          await api.delete(`/queue/${idToCancel}`);
        } catch {}
      }
    }

    await AsyncStorage.removeItem(ACTIVE_QUEUE_KEY);
  }

  /**
   * Get live count of waiting guests to accurately compute position & wait time
   */
  async getLiveQueueStats(): Promise<{ waitingCount: number; waitMinutes: number }> {
    try {
      const q = query(collection(db, 'queue'), where('status', '==', 'waiting'));
      const snap = await getDocs(q);
      const count = snap.size;
      return {
        waitingCount: count,
        waitMinutes: Math.max(5, count * 4 + 4),
      };
    } catch {
      return {
        waitingCount: 2,
        waitMinutes: 15,
      };
    }
  }

  /**
   * Listen to live updates for a specific queue entry
   */
  subscribeToQueue(
    queueId: string,
    onUpdate: (data: Partial<CustomerQueueStatus>) => void
  ): () => void {
    try {
      const unsub = onSnapshot(
        doc(db, 'queue', queueId),
        (snap) => {
          if (!snap.exists()) return;
          const data = snap.data();
          const updates: Partial<CustomerQueueStatus> = {};

          if (data.status) {
            if (data.status === 'ready') updates.status = 'READY';
            else if (data.status === 'seated') updates.status = 'SEATED';
            else if (data.status === 'cancelled') updates.status = 'LEFT';
          }
          if (data.estimatedWaitMinutes !== undefined) {
            updates.estimatedWaitMin = Number(data.estimatedWaitMinutes);
          }
          if (data.floorStatus) {
            updates.floorStatus = data.floorStatus;
          }

          onUpdate(updates);
        },
        (err) => {
          console.warn('subscribeToQueue error:', err);
        }
      );
      return unsub;
    } catch {
      return () => {};
    }
  }
}

export const customerQueueService = new CustomerQueueService();
export default customerQueueService;
