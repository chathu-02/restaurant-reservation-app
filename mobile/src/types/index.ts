export type StaffRole = 'MANAGER' | 'KITCHEN' | 'STAFF';

export interface StaffMember {
  id: string;
  staffCode: string;
  name: string;
  role: StaffRole;
  department: string;
  isOnDuty: boolean;
  avatarColor: 'purple' | 'orange' | 'gray' | 'emerald' | 'blue';
  initials: string;
  email?: string;
  phone?: string;
  shift?: string;
}

export type StaffFilterType = 'ALL' | 'ACTIVE' | 'MANAGERS' | 'KITCHEN';

export interface UserProfile {
  id: string;
  staffId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  shiftInfo: string;
  isOnShift: boolean;
  rating: number;
  completedShifts: number;
  floor: string;
  alertsAndSound: boolean;
  avatarUrl: string;
  emergencyHotline?: string;
}

export interface DashboardMetrics {
  reservationsToday: number;
  reservationsChange: string;
  guestsInQueue: number;
  queueWaitTime: string;
  tablesOccupied: number;
  tablesTotal: number;
  noShows: number;
  noShowsLevel: string;
  serviceName: string;
  shiftName: string;
  dateFormatted: string;
}

export interface RushAlertInfo {
  time: string;
  coversReserved: number;
  capacityPercent: number;
  details: {
    peakRange: string;
    totalCovers: number;
    reservationsCount: number;
    queueCount: number;
    recommendations: string[];
    timeSlots: { time: string; tablesBooked: number; totalTables: number }[];
  };
}

export interface CreateBookingPayload {
  guestName: string;
  partySize: number;
  time: string;
  phone: string;
  tablePreference?: string;
  notes?: string;
}

export interface CreateWalkInPayload {
  guestName: string;
  partySize: number;
  phone: string;
  notes?: string;
}

// ----------------------------------------
// Customer Portal Types
// ----------------------------------------

export type SeatingPreferenceType = 'Indoor' | 'Outdoor' | 'Any table';

export interface JoinQueueFormPayload {
  fullName: string;
  phoneNumber: string;
  partySize: number;
  seatingPreference: SeatingPreferenceType;
  specialRequests?: string;
}

export interface CustomerQueueStatus {
  id: string;
  restaurantName: string;
  restaurantLocation: string;
  position: number;
  queueNumber: string;
  estimatedWaitMin: number;
  initialWaitMin: number;
  tablesAhead: number;
  turnoverPace: string;
  partySize: number;
  joinedTime: string;
  seatingPreference: SeatingPreferenceType;
  floorStatus: string;
  lastUpdated: string;
  fullName: string;
  phoneNumber: string;
  specialRequests?: string;
  estimatedSeatingTime: string;
  status: 'WAITING' | 'READY' | 'SEATED' | 'LEFT';
}

export interface CustomerNotificationItem {
  id: string;
  type: 'TABLE_READY' | 'REMINDER' | 'TIME_CHANGED' | 'CONFIRMED' | 'QUEUE_UPDATE';
  title: string;
  body: string;
  timeAgo: string;
  isUnread: boolean;
  section: 'TODAY' | 'EARLIER';
  date?: string;
  bookingRef?: string;
  actionLabel?: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  statusBadge: string;
  bookingsCount: number;
  queueSaves: number;
  points: number;
  remindersEnabled: boolean;
  queueAlertsEnabled: boolean;
  avatarUrl: string;
  defaultPayment: string;
}
