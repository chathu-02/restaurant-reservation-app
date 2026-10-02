import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon, { IconName } from './ui/Icon';
import StatusBadge, { BadgeVariant } from './StatusBadge';

export interface MetricCardProps {
  icon: IconName;
  iconBgColor: string;
  iconColor: string;
  badgeLabel: string;
  badgeVariant?: BadgeVariant;
  badgeDot?: boolean;
  value: string | number;
  subValue?: string;
  progressPercentage?: number;
  label: string;
  onPress?: () => void;
}

export function MetricCard({
  icon,
  iconBgColor,
  iconColor,
  badgeLabel,
  badgeVariant = 'green',
  badgeDot = false,
  value,
  subValue,
  progressPercentage,
  label,
  onPress,
}: MetricCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      {/* Top row with icon & badge */}
      <View style={styles.topRow}>
        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
          <Icon name={icon} size={18} color={iconColor} />
        </View>
        <StatusBadge label={badgeLabel} variant={badgeVariant} dot={badgeDot} />
      </View>

      {/* Value & subValue */}
      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        {subValue && <Text style={styles.subValue}>{subValue}</Text>}
      </View>

      {/* Progress bar if present */}
      {typeof progressPercentage === 'number' && (
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.min(100, Math.max(0, progressPercentage))}%` },
            ]}
          />
        </View>
      )}

      {/* Label */}
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    minHeight: 124,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#EEF2F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 2,
  },
  value: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.5,
  },
  subValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 6,
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0D9488',
    borderRadius: 2,
  },
  label: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 4,
  },
});

export default MetricCard;
