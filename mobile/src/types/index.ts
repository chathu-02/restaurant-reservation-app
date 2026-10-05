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
