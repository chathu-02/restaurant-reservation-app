import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#111827',
    background: '#F4F9EC',
    surface: '#FFFFFF',
    backgroundElement: '#EEF2F1',
    backgroundSelected: '#E0EAE5',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',

    // Brand & Semantic colors
    primary: '#009669',
    primaryDark: '#047857',
    primaryLight: '#E6F8F0',
    primaryBadgeBg: '#E6F7F0',
    primaryBadgeText: '#00875A',

    // Accent Colors
    amber: '#F59E0B',
    amberLight: '#FEF3C7',
    amberDark: '#B45309',

    teal: '#0D9488',
    tealLight: '#E6FFFA',
    tealDark: '#0F766E',

    pink: '#E11D48',
    pinkLight: '#FFE4E6',
    pinkDark: '#BE123C',

    blue: '#2563EB',
    blueLight: '#EFF6FF',
    blueDark: '#1D4ED8',

    purple: '#4F46E5',
    purpleLight: '#EEF2FF',
    purpleDark: '#3730A3',

    border: '#E5E7EB',
    cardBorder: '#EEF2F0',

    rushBg: '#FFF8F1',
    rushBorder: '#FED7AA',
    rushText: '#C2410C',
    rushSubtext: '#9A3412',

    statusOnline: '#10B981',
    statusBusy: '#F59E0B',
    statusOffline: '#9CA3AF',
  },
  dark: {
    text: '#F9FAFB',
    background: '#111827',
    surface: '#1F2937',
    backgroundElement: '#2D3748',
    backgroundSelected: '#374151',
    textSecondary: '#9CA3AF',
    textMuted: '#6B7280',

    primary: '#10B981',
    primaryDark: '#059669',
    primaryLight: '#064E3B',
    primaryBadgeBg: '#064E3B',
    primaryBadgeText: '#6EE7B7',

    amber: '#FBBF24',
    amberLight: '#78350F',
    amberDark: '#F59E0B',

    teal: '#14B8A6',
    tealLight: '#134E4A',
    tealDark: '#0D9488',

    pink: '#F43F5E',
    pinkLight: '#881337',
    pinkDark: '#E11D48',

    blue: '#3B82F6',
    blueLight: '#1E3A8A',
    blueDark: '#2563EB',

    purple: '#6366F1',
    purpleLight: '#312E81',
    purpleDark: '#4F46E5',

    border: '#374151',
    cardBorder: '#374151',

    rushBg: '#451A03',
    rushBorder: '#78350F',
    rushText: '#FDBA74',
    rushSubtext: '#FED7AA',

    statusOnline: '#10B981',
    statusBusy: '#F59E0B',
    statusOffline: '#6B7280',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
    serif: 'var(--font-serif, Georgia, serif)',
    rounded: 'var(--font-rounded, sans-serif)',
    mono: 'var(--font-mono, monospace)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

export const Typography = {
  // Screen title — “Dashboard” (Bold 700, 26–28)
  screenTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
  },
  // Section heading — “Staff On Duty” (SemiBold 600, 18–20)
  sectionHeading: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  // Buttons / input labels (Medium 500, 14–16)
  button: {
    fontSize: 15,
    fontWeight: '500' as const,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  // සාමාන්‍ය text (Regular 400, 16)
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
  },
  // Secondary details (Regular 400, 13–14)
  secondary: {
    fontSize: 13,
    fontWeight: '400' as const,
  },
  // KPI numbers (Bold 700, 28–32)
  kpiNumber: {
    fontSize: 30,
    fontWeight: '700' as const,
  },
} as const;
