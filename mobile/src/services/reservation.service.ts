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
  bookingId?: string;
  guestName: string;
  avatarUrl?: string;
  partySize: number;
  time: string;
  date?: string;
  tableNumber?: string;
  tableArea?: string;
  status: ReservationStatus;
  phone?: string;
  notes?: string;
  vipBadge?: string;
  tags?: string[];
  seatedInfo?: string;
  actionType?: 'seat' | 'assign' | 'seated-info' | 'waitlist-offer';
  checkedIn?: boolean;
  depositStatus?: string;
  depositAmount?: number;
  tableIds?: string[];
}

export interface QueueGuest {
  id: string;
  guestName: string;
  partySize: number;
  joinedAt: string;
  estimatedWaitMinutes: number;
  phone?: string;
  notes?: string;
  status?: string;
}

const DEFAULT_OVERVIEW: ShiftOverviewData = {
  date: 'WEDNESDAY, JUNE 12',
  service: 'DINNER SERVICE',
  dutyRole: 'Shift Lead on Duty',
  reservationsToday: 42,
  newReservations: 4,
  guestsInQueue: 6,
  queueWaitMinutes: 12,
  occupiedTables: 14,
  totalTables: 20,
  tablesOccupancyRate: 85,
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
    guestName: 'Sarah Johnson',
    partySize: 4,
    time: '6:00 PM',
    tableNumber: 'Table 12',
    tableArea: 'Main Room',
    status: 'confirmed',
    vipBadge: '★ VIP',
    tags: ['🎉 Anniversary', 'Window seat'],
    actionType: 'seat',
  },
  {
    id: 'res-2',
    guestName: 'Michael Chen',
    partySize: 2,
    time: '6:30 PM',
    tableNumber: 'Unassigned',
    tableArea: '',
    status: 'pending',
    tags: ['Booth requested'],
    actionType: 'assign',
  },
  {
    id: 'res-3',
    guestName: 'Emily Davis',
    partySize: 6,
    time: '7:00 PM',
    tableNumber: 'Table 4',
    tableArea: 'Patio',
    status: 'seated',
    seatedInfo: 'Seated 25m ago • Entrées Cooking',
    actionType: 'seated-info',
  },
  {
    id: 'res-4',
    guestName: 'James Wilson',
    partySize: 3,
    time: '7:30 PM',
    tableNumber: 'Table 8',
    tableArea: 'Dining',
    status: 'confirmed',
    tags: ['👶 High chair needed'],
  },
  {
    id: 'res-5',
    guestName: 'Olivia Martinez',
    partySize: 5,
    time: '8:00 PM',
    tableNumber: 'Unassigned',
    status: 'cancelled',
    notes: 'Released table back to inventory',
    actionType: 'waitlist-offer',
  },
  {
    id: 'res-6',
    guestName: 'Daniel Brown',
    partySize: 2,
    time: '8:30 PM',
    tableNumber: 'Table 6',
    status: 'deposit-due',
    tags: ['SMS reminder sent'],
  },
  {
    id: 'res-7',
    guestName: 'Sophia Taylor',
    partySize: 4,
    time: '9:00 PM',
    tableNumber: 'Table 15',
    tableArea: 'Chef Counter',
    status: 'confirmed',
    vipBadge: 'VIP Concierge',
    tags: ['Sommelier Pairing'],
  },
];

const DEFAULT_QUEUE: QueueGuest[] = [];

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

  async addWalkIn(guest: { guestName: string; partySize: number; phone?: string; notes?: string }): Promise<QueueGuest> {
    const queueItem: QueueGuest = {
      id: `q-${Date.now()}`,
      guestName: guest.guestName,
      partySize: guest.partySize,
      phone: guest.phone,
      notes: guest.notes,
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
