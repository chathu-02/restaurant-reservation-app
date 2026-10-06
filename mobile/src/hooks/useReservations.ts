import { useState, useEffect, useCallback } from 'react';
import reservationService, {
  ShiftOverviewData,
  Reservation,
  QueueGuest,
} from '@/services/reservation.service';

export function useReservations() {
  const [overview, setOverview] = useState<ShiftOverviewData | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [queue, setQueue] = useState<QueueGuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const [overviewData, resList, queueList] = await Promise.all([
        reservationService.getShiftOverview(),
        reservationService.getReservations(),
        reservationService.getQueue(),
      ]);

      setOverview(overviewData);
      setReservations(resList);
      setQueue(queueList);
    } catch (err: any) {
      setError(err?.message || 'Failed to load reservations data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addBooking = async (newRes: Omit<Reservation, 'id'>) => {
    try {
      const created = await reservationService.createReservation(newRes);
      setReservations((prev) => [created, ...prev]);
      setOverview((prev) =>
        prev
          ? {
              ...prev,
              reservationsToday: prev.reservationsToday + 1,
              newReservations: prev.newReservations + 1,
            }
          : null
      );
      return created;
    } catch (err: any) {
      throw err;
    }
  };

  const addWalkIn = async (guest: { guestName: string; partySize: number; phone?: string; notes?: string }) => {
    try {
      const created = await reservationService.addWalkIn(guest);
      setQueue((prev) => [...prev, created]);
      setOverview((prev) =>
        prev
          ? {
              ...prev,
              guestsInQueue: prev.guestsInQueue + guest.partySize,
            }
          : null
      );
      return created;
    } catch (err: any) {
      throw err;
    }
  };

  return {
    overview,
    reservations,
    queue,
    loading,
    refreshing,
    error,
    refresh: () => fetchData(true),
    addBooking,
    addWalkIn,
  };
}
