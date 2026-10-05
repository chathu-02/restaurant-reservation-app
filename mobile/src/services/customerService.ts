import {
  CustomerNotificationItem,
  CustomerProfile,
  CustomerQueueStatus,
  JoinQueueFormPayload,
} from '../types';
import { api } from './api';

const CUSTOMER_PROFILE_KEY = 'stitch_customer_profile_v1';
const CUSTOMER_QUEUE_KEY = 'stitch_customer_queue_v1';
const CUSTOMER_NOTIFS_KEY = 'stitch_customer_notifications_v1';

const INITIAL_PROFILE: CustomerProfile = {
  id: 'cust-amara-chen',
  name: 'Amara Chen',
  email: 'amara.chen@email.com',
  phone: '(555) 439-9201',
  statusBadge: 'PREFERRED GUEST • 18 VISITS',
  bookingsCount: 12,
  queueSaves: 8,
  points: 450,
  remindersEnabled: true,
  queueAlertsEnabled: true,
  avatarUrl:
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=256',
  defaultPayment: 'Apple Pay, Visa ending in 4022',
};

const INITIAL_QUEUE: CustomerQueueStatus = {
  id: 'queue-guest-3',
  restaurantName: 'The Green Terrace',
  restaurantLocation: 'Riverside Ave',
  position: 3,
  queueNumber: '#3',
  estimatedWaitMin: 15,
  initialWaitMin: 25,
  tablesAhead: 2,
  turnoverPace: 'Fast (~4 min/table)',
  partySize: 2,
  joinedTime: '6:40 PM',
  seatingPreference: 'Indoor',
  floorStatus: 'Table clearing in progress',
  lastUpdated: 'Just now',
  fullName: 'Alex Johnson',
  phoneNumber: '(555) 439-9201',
  specialRequests: 'High chair needed, booth if possible',
  estimatedSeatingTime: '~10:05 PM',
  status: 'WAITING',
};

const INITIAL_NOTIFICATIONS: CustomerNotificationItem[] = [
  {
    id: 'notif-1',
    type: 'TABLE_READY',
    title: 'Your table is ready!',
    body: 'Please head to the host stand within 10 minutes.',
    timeAgo: '2m ago',
    isUnread: true,
    section: 'TODAY',
    date: '14 Jun 2025',
    actionLabel: 'Ready now',
  },
  {
    id: 'notif-2',
    type: 'REMINDER',
    title: 'Reminder: booking tomorrow 7:00 PM',
    body: 'Table for 4 at The Green Terrace',
    timeAgo: '1h ago',
    isUnread: true,
    section: 'TODAY',
    date: '14 Jun 2025',
    bookingRef: 'Booking #RB-20481',
  },
  {
    id: 'notif-3',
    type: 'TIME_CHANGED',
    title: 'Booking time changed',
    body: 'Your reservation moved to 8:15 PM as requested.',
    timeAgo: '3h ago',
    isUnread: false,
    section: 'TODAY',
    date: '14 Jun 2025',
  },
  {
    id: 'notif-4',
    type: 'CONFIRMED',
    title: 'Booking confirmed',
    body: '#RB-20481 • 14 Jun, 6:30 PM • 4 guests',
    timeAgo: 'Yesterday',
    isUnread: false,
    section: 'EARLIER',
  },
  {
    id: 'notif-5',
    type: 'QUEUE_UPDATE',
    title: 'Queue update',
    body: 'You moved up to position #3 in line.',
    timeAgo: 'Yesterday',
    isUnread: false,
    section: 'EARLIER',
  },
];

class CustomerService {
  // Profile
  getProfile(): CustomerProfile {
    const raw = localStorage.getItem(CUSTOMER_PROFILE_KEY);
    if (!raw) {
      this.saveProfile(INITIAL_PROFILE);
      return INITIAL_PROFILE;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_PROFILE;
    }
  }

  saveProfile(profile: CustomerProfile): void {
    localStorage.setItem(CUSTOMER_PROFILE_KEY, JSON.stringify(profile));
  }

  async updateProfile(updates: Partial<CustomerProfile>): Promise<CustomerProfile> {
    const current = this.getProfile();
    const updated = { ...current, ...updates };
    this.saveProfile(updated);
    return updated;
  }

  // Queue (CRUD: Create, Read, Update, Delete)
  getQueueStatus(): CustomerQueueStatus {
    const raw = localStorage.getItem(CUSTOMER_QUEUE_KEY);
    if (!raw) {
      this.saveQueueStatus(INITIAL_QUEUE);
      return INITIAL_QUEUE;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_QUEUE;
    }
  }

  saveQueueStatus(status: CustomerQueueStatus | null): void {
    if (status) {
      localStorage.setItem(CUSTOMER_QUEUE_KEY, JSON.stringify(status));
    } else {
      localStorage.removeItem(CUSTOMER_QUEUE_KEY);
    }
  }

  // Create queue entry
  async joinQueue(payload: JoinQueueFormPayload): Promise<CustomerQueueStatus> {
    const newEntry: CustomerQueueStatus = {
      id: `queue-${Date.now()}`,
      restaurantName: 'The Green Terrace',
      restaurantLocation: 'Riverside Ave',
      position: 3,
      queueNumber: '#3',
      estimatedWaitMin: 15,
      initialWaitMin: 20,
      tablesAhead: 2,
      turnoverPace: 'Fast (~4 min/table)',
      partySize: payload.partySize,
      joinedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      seatingPreference: payload.seatingPreference,
      floorStatus: 'Table clearing in progress',
      lastUpdated: 'Just now',
      fullName: payload.fullName,
      phoneNumber: payload.phoneNumber,
      specialRequests: payload.specialRequests,
      estimatedSeatingTime: '~10:05 PM',
      status: 'WAITING',
    };

    this.saveQueueStatus(newEntry);

    try {
      await api.post('/queue', newEntry);
    } catch {
      // Local fallback
    }

    return newEntry;
  }

  // Delete queue entry (Leave queue)
  async leaveQueue(): Promise<void> {
    const current = this.getQueueStatus();
    if (current) {
      current.status = 'LEFT';
      this.saveQueueStatus(null);
    }
  }

  // Notifications (CRUD Read, Update)
  getNotifications(): CustomerNotificationItem[] {
    const raw = localStorage.getItem(CUSTOMER_NOTIFS_KEY);
    if (!raw) {
      this.saveNotifications(INITIAL_NOTIFICATIONS);
      return INITIAL_NOTIFICATIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  }

  saveNotifications(notifs: CustomerNotificationItem[]): void {
    localStorage.setItem(CUSTOMER_NOTIFS_KEY, JSON.stringify(notifs));
  }

  markAllAsRead(): CustomerNotificationItem[] {
    const notifs = this.getNotifications();
    const updated = notifs.map((n) => ({ ...n, isUnread: false }));
    this.saveNotifications(updated);
    return updated;
  }

  markAsRead(id: string): CustomerNotificationItem[] {
    const notifs = this.getNotifications();
    const updated = notifs.map((n) => (n.id === id ? { ...n, isUnread: false } : n));
    this.saveNotifications(updated);
    return updated;
  }
}

export const customerService = new CustomerService();
