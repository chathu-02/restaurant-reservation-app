import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';

export type BadgeVariant = 'green' | 'amber' | 'teal' | 'pink' | 'blue' | 'gray';

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  dot?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  size?: 'small' | 'medium';
}

export function StatusBadge({
  label,
  variant = 'green',
  dot = false,
  style,
  textStyle,
  size = 'small',
}: StatusBadgeProps) {
  const isMedium = size === 'medium';

  return (
    <View style={[styles.badge, styles[variant], isMedium && styles.badgeMedium, style]}>
      {dot && <View style={[styles.dot, styles[`${variant}Dot`]]} />}
      <Text style={[styles.label, styles[`${variant}Text`], isMedium && styles.labelMedium, textStyle]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 4,
  },
  badgeMedium: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontSize: 12,
    fontWeight: '600',
  },
  // Green
  green: {
    backgroundColor: '#E6F8F0',
  },
  greenDot: {
    backgroundColor: '#00A86B',
  },
  greenText: {
    color: '#00875A',
  },
  // Amber
  amber: {
    backgroundColor: '#FFF4E5',
  },
  amberDot: {
    backgroundColor: '#F59E0B',
  },
  amberText: {
    color: '#D97706',
  },
  // Teal
  teal: {
    backgroundColor: '#E6FFFA',
  },
  tealDot: {
    backgroundColor: '#0D9488',
  },
  tealText: {
    color: '#0D9488',
  },
  // Pink
  pink: {
    backgroundColor: '#FFE4E6',
  },
  pinkDot: {
    backgroundColor: '#E11D48',
  },
  pinkText: {
    color: '#BE123C',
  },
  // Blue
  blue: {
    backgroundColor: '#EFF6FF',
  },
  blueDot: {
    backgroundColor: '#2563EB',
  },
  blueText: {
    color: '#1D4ED8',
  },
  // Gray
  gray: {
    backgroundColor: '#F1F4F8',
  },
  grayDot: {
    backgroundColor: '#6B7280',
  },
  grayText: {
    color: '#6B7280',
  },
});

export default StatusBadge;
