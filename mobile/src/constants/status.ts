export type ReservationStatus =
  | 'confirmed'
  | 'seated'
  | 'completed'
  | 'cancelled'
  | 'no-show'
  | 'waitlist';

export const RESERVATION_STATUS_CONFIG: Record<
  ReservationStatus,
  { label: string; variant: 'green' | 'amber' | 'teal' | 'pink' | 'blue' | 'gray' }
> = {
  confirmed: { label: 'Confirmed', variant: 'green' },
  seated: { label: 'Seated', variant: 'teal' },
  completed: { label: 'Completed', variant: 'blue' },
  cancelled: { label: 'Cancelled', variant: 'gray' },
  'no-show': { label: 'No-Show', variant: 'pink' },
  waitlist: { label: 'Waitlist', variant: 'amber' },
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
