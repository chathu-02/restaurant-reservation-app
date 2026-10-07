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
  cardBgColor?: string;
  borderColor?: string;
  valueColor?: string;
  labelColor?: string;
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
  cardBgColor,
  borderColor,
  valueColor,
  labelColor,
  onPress,
}: MetricCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        cardBgColor ? { backgroundColor: cardBgColor } : null,
        borderColor ? { borderColor } : null,
        pressed && styles.pressed,
      ]}>
      {/* Top row with icon & badge */}
      <View style={styles.topRow}>
        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
          <Icon name={icon} size={18} color={iconColor} />
        </View>
        <StatusBadge label={badgeLabel} variant={badgeVariant} dot={badgeDot} />
      </View>

      {/* Value & subValue */}
      <View style={styles.valueRow}>
        <Text style={[styles.value, valueColor ? { color: valueColor } : null]}>{value}</Text>
        {subValue && <Text style={[styles.subValue, labelColor ? { color: labelColor } : null]}>{subValue}</Text>}
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
      <Text style={[styles.label, labelColor ? { color: labelColor } : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    minHeight: 96,
    justifyContent: 'space-between',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    borderTopColor: '#FFFFFF',
    borderBottomColor: '#94A3B8',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 5,
    minWidth: 0,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: 4,
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 1,
    flexWrap: 'wrap',
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.5,
  },
  subValue: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9CA3AF',
  },
  progressBarTrack: {
    height: 3.5,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 4,
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0D9488',
    borderRadius: 2,
  },
  label: {
    fontSize: 11.5,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 2,
  },
});

export default MetricCard;
