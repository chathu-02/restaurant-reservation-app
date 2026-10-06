export type ReservationStatus =
  | 'confirmed'
  | 'pending'
  | 'seated'
  | 'completed'
  | 'cancelled'
  | 'no-show'
  | 'waitlist'
  | 'deposit-due';

export const RESERVATION_STATUS_CONFIG: Record<
  ReservationStatus,
  { label: string; variant: 'green' | 'amber' | 'teal' | 'pink' | 'blue' | 'gray' }
> = {
  confirmed: { label: 'Confirmed', variant: 'green' },
  pending: { label: 'Pending', variant: 'amber' },
  seated: { label: 'Seated', variant: 'blue' },
  completed: { label: 'Completed', variant: 'blue' },
  cancelled: { label: 'Cancelled', variant: 'gray' },
  'no-show': { label: 'No-Show', variant: 'pink' },
  waitlist: { label: 'Waitlist', variant: 'amber' },
  'deposit-due': { label: 'Deposit Due', variant: 'amber' },
};

export const SHIFT_NAMES = {
  LUNCH: 'LUNCH SERVICE',
  DINNER: 'DINNER SERVICE',
  BRUNCH: 'BRUNCH SERVICE',
} as const;

export const ROLES = {
  LEAD: 'Shift Lead on Duty',
  HOST: 'Host on Duty',
  MANAGER: 'General Manager',
  SERVER: 'Floor Server',
} as const;
