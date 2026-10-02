import api from './api';
import { ReservationStatus } from '@/constants/status';

export interface ShiftOverviewData {
  date: string;
  service: string;
  dutyRole: string;
  reservationsToday: number;
  newReservations: number;
  guestsInQueue: number;
  queueWaitMinutes: number;
  occupiedTables: number;
  totalTables: number;
  tablesOccupancyRate: number;
  noShowsToday: number;
  noShowRateLabel: string;
  rushAlert: {
    time: string;
    expectedGuests: number;
    withinMinutes: number;
  };
  managerTools: {
    staffOnShift: number;
    settingsSubtitle: string;
    floorPlanSubtitle: string;
    analyticsSubtitle: string;
  };
}

export interface Reservation {
  id: string;
  guestName: string;
  partySize: number;
  time: string;
  tableNumber?: string;
  status: ReservationStatus;
  phone?: string;
  notes?: string;
}

export interface QueueGuest {
  id: string;
  guestName: string;
  partySize: number;
  joinedAt: string;
  estimatedWaitMinutes: number;
  phone?: string;
}

const DEFAULT_OVERVIEW: ShiftOverviewData = {
  date: 'WEDNESDAY, JUNE 12',
  service: 'DINNER SERVICE',
  dutyRole: 'Shift Lead on Duty',
  reservationsToday: 24,
  newReservations: 4,
  guestsInQueue: 6,
  queueWaitMinutes: 12,
  occupiedTables: 14,
  totalTables: 20,
  tablesOccupancyRate: 70,
  noShowsToday: 2,
  noShowRateLabel: 'Low rate',
  rushAlert: {
    time: '7:30 PM',
    expectedGuests: 18,
    withinMinutes: 45,
  },
  managerTools: {
    staffOnShift: 8,
    settingsSubtitle: 'Hours, kitchen pacing, notifications',
    floorPlanSubtitle: 'Main room, Patio & Private bar',
    analyticsSubtitle: 'Pacing, table turns & revenue pace',
  },
};

const DEFAULT_RESERVATIONS: Reservation[] = [
  {
    id: 'res-1',
    guestName: 'Alex Mercer',
    partySize: 4,
    time: '7:00 PM',
    tableNumber: 'Table 4',
    status: 'seated',
    notes: 'Window booth requested, birthday celebration',
  },
  {
    id: 'res-2',
    guestName: 'Elena Rostova',
    partySize: 2,
    time: '7:30 PM',
    tableNumber: 'Table 7',
    status: 'confirmed',
    notes: 'Anniversary, champagne pre-ordered',
  },
  {
    id: 'res-3',
    guestName: 'Marcus Vance',
    partySize: 6,
    time: '7:30 PM',
    tableNumber: 'Table 12',
    status: 'confirmed',
    notes: 'VIP guest - GM acquaintance',
  },
  {
    id: 'res-4',
    guestName: 'Sophia Lin',
    partySize: 3,
    time: '8:00 PM',
    tableNumber: 'Table 9',
    status: 'confirmed',
  },
  {
    id: 'res-5',
    guestName: 'David Kim',
    partySize: 2,
    time: '6:30 PM',
    tableNumber: 'Table 2',
    status: 'completed',
  },
  {
    id: 'res-6',
    guestName: 'Oliver Twist Party',
    partySize: 5,
    time: '6:15 PM',
    status: 'no-show',
  },
];

const DEFAULT_QUEUE: QueueGuest[] = [
  {
    id: 'q-1',
    guestName: 'Chloe Bennett',
    partySize: 2,
    joinedAt: '7:05 PM',
    estimatedWaitMinutes: 10,
  },
  {
    id: 'q-2',
    guestName: 'Liam O’Connor',
    partySize: 4,
    joinedAt: '7:12 PM',
    estimatedWaitMinutes: 15,
  },
];

class ReservationService {
  private overviewData: ShiftOverviewData = { ...DEFAULT_OVERVIEW };
  private reservations: Reservation[] = [...DEFAULT_RESERVATIONS];
  private queue: QueueGuest[] = [...DEFAULT_QUEUE];

  async getShiftOverview(): Promise<ShiftOverviewData> {
    try {
      const data = await api.get<ShiftOverviewData>('/overview');
      return data;
    } catch {
      // Gracefully fall back to local realistic state
      return this.overviewData;
    }
  }

  async getReservations(): Promise<Reservation[]> {
    try {
      const data = await api.get<Reservation[]>('/reservations');
      return data;
    } catch {
      return this.reservations;
    }
  }

  async createReservation(newRes: Omit<Reservation, 'id'>): Promise<Reservation> {
    const reservation: Reservation = {
      ...newRes,
      id: `res-${Date.now()}`,
    };

    try {
      const created = await api.post<Reservation>('/reservations', reservation);
      this.reservations.unshift(created);
      this.overviewData.reservationsToday += 1;
      this.overviewData.newReservations += 1;
      return created;
    } catch {
      this.reservations.unshift(reservation);
      this.overviewData.reservationsToday += 1;
      this.overviewData.newReservations += 1;
      return reservation;
    }
  }

  async getQueue(): Promise<QueueGuest[]> {
    try {
      const data = await api.get<QueueGuest[]>('/queue');
      return data;
    } catch {
      return this.queue;
    }
  }

  async addWalkIn(guest: { guestName: string; partySize: number; phone?: string }): Promise<QueueGuest> {
    const queueItem: QueueGuest = {
      id: `q-${Date.now()}`,
      guestName: guest.guestName,
      partySize: guest.partySize,
      phone: guest.phone,
      joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedWaitMinutes: 12,
    };

    try {
      const created = await api.post<QueueGuest>('/queue', queueItem);
      this.queue.push(created);
      this.overviewData.guestsInQueue += guest.partySize;
      return created;
    } catch {
      this.queue.push(queueItem);
      this.overviewData.guestsInQueue += guest.partySize;
      return queueItem;
    }
  }
}

export const reservationService = new ReservationService();
export default reservationService;
