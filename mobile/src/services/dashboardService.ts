import { CreateBookingPayload, CreateWalkInPayload, DashboardMetrics, RushAlertInfo } from '../types';
import { api } from './api';

const METRICS_STORAGE_KEY = 'stitch_dashboard_metrics_v1';
const BOOKINGS_STORAGE_KEY = 'stitch_bookings_list_v1';
const QUEUE_STORAGE_KEY = 'stitch_queue_list_v1';

const INITIAL_METRICS: DashboardMetrics = {
  reservationsToday: 24,
  reservationsChange: '+14%',
  guestsInQueue: 6,
  queueWaitTime: '~12m wait',
  tablesOccupied: 12,
  tablesTotal: 20,
  noShows: 2,
  noShowsLevel: 'Low',
  serviceName: 'Dinner Service',
  shiftName: 'Shift A',
  dateFormatted: 'Wednesday, June 12',
};

const RUSH_ALERT: RushAlertInfo = {
  time: '7:30 PM',
  coversReserved: 48,
  capacityPercent: 88,
  details: {
    peakRange: '7:30 PM - 8:15 PM',
    totalCovers: 48,
    reservationsCount: 14,
    queueCount: 4,
    recommendations: [
      'Pre-stage silverware and waters on Tables 4, 7, and 12.',
      'Inform kitchen lead of 6-top seating at 7:30 PM.',
      'Maintain bar queue seating for 2-tops.',
      'Ensure dessert cutlery is restocked before 8:00 PM wave.',
    ],
    timeSlots: [
      { time: '6:30 PM', tablesBooked: 8, totalTables: 20 },
      { time: '7:00 PM', tablesBooked: 14, totalTables: 20 },
      { time: '7:30 PM (Peak)', tablesBooked: 18, totalTables: 20 },
      { time: '8:00 PM', tablesBooked: 16, totalTables: 20 },
      { time: '8:30 PM', tablesBooked: 10, totalTables: 20 },
    ],
  },
};

class DashboardService {
  getMetrics(): DashboardMetrics {
    const raw = localStorage.getItem(METRICS_STORAGE_KEY);
    if (!raw) {
      this.saveMetrics(INITIAL_METRICS);
      return INITIAL_METRICS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_METRICS;
    }
  }

  saveMetrics(metrics: DashboardMetrics): void {
    localStorage.setItem(METRICS_STORAGE_KEY, JSON.stringify(metrics));
  }

  getRushAlert(): RushAlertInfo {
    return RUSH_ALERT;
  }

  async createBooking(payload: CreateBookingPayload): Promise<{ success: boolean; message: string }> {
    if (!payload.guestName.trim()) {
      throw new Error('Please enter guest name');
    }
    if (!payload.partySize || payload.partySize < 1) {
      throw new Error('Party size must be at least 1');
    }

    const currentBookings = JSON.parse(localStorage.getItem(BOOKINGS_STORAGE_KEY) || '[]');
    const newBooking = {
      id: `booking-${Date.now()}`,
      ...payload,
      createdAt: new Date().toISOString(),
      status: 'CONFIRMED',
    };
    currentBookings.unshift(newBooking);
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(currentBookings));

    // Update metrics
    const metrics = this.getMetrics();
    metrics.reservationsToday += 1;
    this.saveMetrics(metrics);

    try {
      await api.post('/reservations', newBooking);
    } catch {
      // Local fallback saved
    }

    return {
      success: true,
      message: `Reservation confirmed for ${payload.guestName} (${payload.partySize} guests at ${payload.time})`,
    };
  }

  async addWalkIn(payload: CreateWalkInPayload): Promise<{ success: boolean; message: string }> {
    if (!payload.guestName.trim()) {
      throw new Error('Please enter guest name');
    }
    if (!payload.partySize || payload.partySize < 1) {
      throw new Error('Party size must be at least 1');
    }

    const currentQueue = JSON.parse(localStorage.getItem(QUEUE_STORAGE_KEY) || '[]');
    const newEntry = {
      id: `queue-${Date.now()}`,
      ...payload,
      queueNumber: currentQueue.length + 1,
      estimatedWait: '~12 min',
      createdAt: new Date().toISOString(),
      status: 'WAITING',
    };
    currentQueue.push(newEntry);
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(currentQueue));

    // Update metrics
    const metrics = this.getMetrics();
    metrics.guestsInQueue += 1;
    this.saveMetrics(metrics);

    try {
      await api.post('/queue', newEntry);
    } catch {
      // Local fallback saved
    }

    return {
      success: true,
      message: `Added ${payload.guestName} to queue (#${newEntry.queueNumber}, estimated wait ~12 min)`,
    };
  }
}

export const dashboardService = new DashboardService();
